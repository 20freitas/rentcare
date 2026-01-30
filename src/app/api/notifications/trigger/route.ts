import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
 import { createClient } from '@supabase/supabase-js';
 
 type PropertyRow = {
   id: string;
   user_id: string;
   address: string;
   title?: string | null;
   payment_day: number;
 };
 
 type TenantRow = {
   id: string;
   user_id: string;
   name: string;
   property_id?: string | null;
   rent_amount?: number | null;
   payment_day?: number | null;
 };
 
 type DocumentRow = {
   id: string;
   property_id: string;
   type: 'Contrato' | 'Recibo' | 'Manutenção' | 'Outro';
   file_name: string;
   tenant_name?: string | null;
   expiration_date?: string | null;
 };
 
 type NotificationSettingsRow = {
   user_id: string;
   email_enabled: boolean;
   notify_5days: boolean;
   notify_1day: boolean;
   email?: string | null;
 };
 
 function nextPaymentDate(paymentDay?: number | null) {
   if (!paymentDay || paymentDay < 1 || paymentDay > 31) return null;
   const now = new Date();
   const year = now.getFullYear();
   const month = now.getMonth();
   const candidate = new Date(year, month, paymentDay);
   if (candidate.getTime() < new Date(year, month, now.getDate()).getTime()) {
     return new Date(year, month + 1, paymentDay);
   }
   return candidate;
 }
 
 function daysUntil(dateStr: string) {
   const now = new Date();
   const target = new Date(dateStr);
   const msPerDay = 24 * 60 * 60 * 1000;
   return Math.ceil((target.getTime() - now.getTime()) / msPerDay);
 }
 
 async function sendEmailResend(apiKey: string, from: string, to: string, subject: string, html: string) {
   const resp = await fetch('https://api.resend.com/emails', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${apiKey}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       from,
       to,
       subject,
       html,
     }),
   });
   if (!resp.ok) {
     const txt = await resp.text();
     throw new Error(`Resend error: ${resp.status} ${txt}`);
   }
 }
 
export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get('debug') === '1';
  const SUPABASE_URL = (process.env.SUPABASE_URL as string) || (process.env.NEXT_PUBLIC_SUPABASE_URL as string);
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    if (debug) {
      return NextResponse.json({
        ok: false,
        error: 'Supabase service role not configured',
        details: {
          has_SUPABASE_URL: !!SUPABASE_URL,
          has_NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          has_SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
          env_keys_seen: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('RESEND') || k.includes('EMAIL')),
        }
      }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: 'Supabase service role not configured' }, { status: 500 });
  }
   const RESEND_API_KEY = process.env.RESEND_API_KEY as string | undefined;
   const EMAIL_FROM = (process.env.EMAIL_FROM as string | undefined) || 'no-reply@rentcare.local';
   if (!RESEND_API_KEY) {
     return NextResponse.json({ ok: false, error: 'Email provider not configured' }, { status: 500 });
   }
 
   const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
 
   const { data: settingsRows } = await supabase
     .from('notification_settings')
     .select('*')
     .eq('email_enabled', true);
 
   const results: Record<string, { sent: boolean; count: number; reason?: string; message?: string }> = {};
 
   for (const s of (settingsRows || []) as NotificationSettingsRow[]) {
     const uid = s.user_id;
     const toEmail = (s.email && s.email.trim()) || undefined;
 
     const { data: props } = await supabase
       .from('properties')
       .select('id,user_id,address,title,payment_day')
       .eq('user_id', uid);
     const propertyIds = (props || []).map((p: PropertyRow) => p.id);
 
     const { data: tenants } = await supabase
       .from('tenants')
       .select('id,user_id,name,property_id,rent_amount,payment_day')
       .eq('user_id', uid);
 
     const { data: docs } = await supabase
       .from('documents')
       .select('id,property_id,type,file_name,tenant_name,expiration_date')
       .in('property_id', propertyIds.length > 0 ? propertyIds : ['00000000-0000-0000-0000-000000000000']);
 
     const items: { type: 'Pagamento' | 'FimContrato'; date: string; line: string }[] = [];
 
     for (const t of (tenants || []) as TenantRow[]) {
       const nd = nextPaymentDate(t.payment_day ?? undefined);
       if (nd) {
         const p = (props || []).find((pp: PropertyRow) => pp.id === (t.property_id || ''));
         const line = `${t.name}${p ? ' · ' + (p.title || p.address) : ''}${t.rent_amount ? ' · €' + Number(t.rent_amount).toFixed(2) : ''}`;
         items.push({ type: 'Pagamento', date: nd.toISOString(), line });
       }
     }
 
     for (const d of (docs || []) as DocumentRow[]) {
       if (d.type === 'Contrato' && d.expiration_date) {
         const p = (props || []).find((pp: PropertyRow) => pp.id === d.property_id);
         const line = `${d.tenant_name || 'Inquilino'} · ${(p?.title || p?.address || 'Imóvel')} · ${d.file_name}`;
         items.push({ type: 'FimContrato', date: d.expiration_date, line });
       }
     }
 
     const filtered = items.filter((it) => {
       const d = daysUntil(it.date);
       if (d === 5 && s.notify_5days) return true;
       if (d === 1 && s.notify_1day) return true;
       return false;
     });
 
     if (filtered.length === 0) {
       results[uid] = { sent: false, count: 0 };
       continue;
     }
 
     const lines = filtered
       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
       .map((it) => {
         const when = new Date(it.date).toLocaleDateString('pt-PT');
         return `<li><strong>${it.type}</strong> · ${when} · ${it.line}</li>`;
       })
       .join('');
 
     const html = `
       <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; color: #0f172a;">
         <h2 style="margin: 0 0 12px;">Lembretes RentCare</h2>
         <p>Tem eventos a ocorrer em breve:</p>
         <ul>${lines}</ul>
         <p style="color:#64748b;">Pode configurar estes avisos em Dashboard → Definições.</p>
       </div>
     `;
 
     const subject = `Lembretes RentCare (${filtered.length})`;
     const sendTo = toEmail || (await supabase.auth.admin.getUserById(uid)).data.user?.email || '';
 
    if (!sendTo) {
      results[uid] = { sent: false, count: filtered.length, reason: 'no_email' };
      continue;
    }
 
     try {
       await sendEmailResend(RESEND_API_KEY, EMAIL_FROM, sendTo, subject, html);
       results[uid] = { sent: true, count: filtered.length };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      results[uid] = { sent: false, count: filtered.length, reason: 'send_failed', message: msg };
    }
   }
 
   return NextResponse.json({ ok: true, results });
 }
 
