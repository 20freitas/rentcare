 'use client';
 
 import { useEffect, useState } from 'react';
 import { supabase } from '@/lib/supabase';
 import { Bell, Mail } from 'lucide-react';
 
 interface NotificationSettings {
   email_enabled: boolean;
   notify_5days: boolean;
   notify_1day: boolean;
   email?: string | null;
 }
 
 export default function SettingsPage() {
   const [loading, setLoading] = useState(true);
   const [userEmail, setUserEmail] = useState<string>('');
   const [settings, setSettings] = useState<NotificationSettings>({
     email_enabled: false,
     notify_5days: true,
     notify_1day: true,
     email: '',
   });
 
   useEffect(() => {
     const init = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       const uid = session?.user?.id;
       const uemail = session?.user?.email || '';
       setUserEmail(uemail);
       if (!uid) {
         setLoading(false);
         return;
       }
 
       const { data } = await supabase
         .from('notification_settings')
         .select('*')
         .eq('user_id', uid)
         .maybeSingle();
 
       if (!data) {
         await supabase
           .from('notification_settings')
           .insert({
             user_id: uid,
             email_enabled: false,
             notify_5days: true,
             notify_1day: true,
             email: null,
           });
         setSettings({
           email_enabled: false,
           notify_5days: true,
           notify_1day: true,
           email: '',
         });
       } else {
         setSettings({
           email_enabled: !!data.email_enabled,
           notify_5days: !!data.notify_5days,
           notify_1day: !!data.notify_1day,
           email: (data.email as string) || '',
         });
       }
       setLoading(false);
     };
     init();
   }, []);
 
   const updateSetting = async (patch: Partial<NotificationSettings>) => {
     setSettings((s) => ({ ...s, ...patch }));
     const { data: { session } } = await supabase.auth.getSession();
     const uid = session?.user?.id;
     if (!uid) return;
     await supabase
       .from('notification_settings')
       .update(patch)
       .eq('user_id', uid);
   };
 
   return (
     <div>
       <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Definições</h1>
 
       <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
         <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
             <div style={{ background: '#eff6ff', padding: 10, borderRadius: '50%', color: '#1d4ed8' }}>
               <Bell size={20} />
             </div>
             <div>
               <p style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>Notificações por Email</p>
               <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Receber alertas de pagamentos e fim de contratos</p>
             </div>
           </div>
 
           {loading ? (
             <p style={{ color: '#64748b' }}>A carregar...</p>
           ) : (
             <>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                 <div>
                   <div style={{ fontWeight: 600, color: '#0f172a' }}>Ativar emails</div>
                   <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                     Enviar para: <span style={{ fontWeight: 600, color: '#334155' }}>{settings.email?.trim() || userEmail}</span>
                   </div>
                 </div>
                 <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                   <input
                     type="checkbox"
                     checked={settings.email_enabled}
                     onChange={(e) => updateSetting({ email_enabled: e.target.checked })}
                   />
                   <span style={{ color: settings.email_enabled ? '#16a34a' : '#64748b', fontWeight: 600 }}>
                     {settings.email_enabled ? 'On' : 'Off'}
                   </span>
                 </label>
               </div>
 
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', opacity: settings.email_enabled ? 1 : 0.5 }}>
                 <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                     <Mail size={18} />
                     <span style={{ fontWeight: 600, color: '#0f172a' }}>Aviso 5 dias antes</span>
                   </div>
                   <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                     Receber um email 5 dias antes da data.
                   </p>
                   <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: settings.email_enabled ? 'pointer' : 'not-allowed' }}>
                     <input
                       type="checkbox"
                       disabled={!settings.email_enabled}
                       checked={settings.notify_5days}
                       onChange={(e) => updateSetting({ notify_5days: e.target.checked })}
                     />
                     <span style={{ color: settings.notify_5days ? '#16a34a' : '#64748b', fontWeight: 600 }}>
                       {settings.notify_5days ? 'On' : 'Off'}
                     </span>
                   </label>
                 </div>
 
                 <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                     <Mail size={18} />
                     <span style={{ fontWeight: 600, color: '#0f172a' }}>Aviso 1 dia antes</span>
                   </div>
                   <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                     Receber um email 1 dia antes da data.
                   </p>
                   <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: settings.email_enabled ? 'pointer' : 'not-allowed' }}>
                     <input
                       type="checkbox"
                       disabled={!settings.email_enabled}
                       checked={settings.notify_1day}
                       onChange={(e) => updateSetting({ notify_1day: e.target.checked })}
                     />
                     <span style={{ color: settings.notify_1day ? '#16a34a' : '#64748b', fontWeight: 600 }}>
                       {settings.notify_1day ? 'On' : 'Off'}
                     </span>
                   </label>
                 </div>
               </div>
             </>
           )}
         </div>
       </div>
     </div>
   );
 }
