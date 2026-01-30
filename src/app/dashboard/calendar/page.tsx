 "use client";
 
 import { useEffect, useMemo, useState } from "react";
 import { supabase } from "@/lib/supabase";
 import { Property } from "@/types/property";
 import { Tenant } from "@/types/tenant";
 import { Document } from "@/types/document";
 import {
   Calendar,
   Clock,
   AlertCircle,
   Bell,
   Home,
   Users,
   FileText,
 } from "lucide-react";
 
 type ReminderType = "Pagamento" | "FimContrato";
 
 interface ReminderItem {
   id: string;
   date: string;
   type: ReminderType;
   title: string;
   description?: string;
   propertyId?: string;
   tenantName?: string;
 }
 
 const mapProperty = (row: Record<string, unknown>): Property => ({
   id: row.id as string,
   address: row.address as string,
   tenantName: (row.tenant_name as string) || undefined,
   paymentDay: (row.payment_day as number) || 0,
   status: (row.status as Property["status"]) || "pending",
   image_url: (row.image_url as string) || undefined,
   title: (row.title as string) || undefined,
 });
 
 const mapTenant = (row: Record<string, unknown>): Tenant => ({
   id: row.id as string,
   created_at: row.created_at as string,
   user_id: row.user_id as string,
   name: row.name as string,
   email: (row.email as string) || undefined,
   phone: (row.phone as string) || undefined,
   nif: (row.nif as string) || undefined,
   property_id: (row.property_id as string) || undefined,
   rent_amount: (row.rent_amount as number) || undefined,
   payment_day: (row.payment_day as number) || undefined,
   notes: (row.notes as string) || undefined,
 });
 
 const mapDocument = (row: Record<string, unknown>): Document => ({
   id: row.id as string,
   propertyId: (row.property_id ?? row.propertyId) as string,
   fileName: (row.file_name ?? row.fileName) as string,
   type: row.type as Document["type"],
   uploadDate: (row.upload_date ?? row.uploadDate) as string,
   tenantName: (row.tenant_name ?? row.tenantName) as string | undefined,
   notes: row.notes as string | undefined,
   expirationDate: (row.expiration_date ?? row.expirationDate) as string | undefined,
   fileUrl: (row.file_url ?? row.fileUrl) as string,
 });
 
 function getPropertyLabel(p?: Property) {
   if (!p) return "Imóvel";
   return p.title || p.address;
 }
 
 function nextPaymentDate(paymentDay?: number) {
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
   const diff = Math.ceil((target.getTime() - now.getTime()) / msPerDay);
   return diff;
 }
 
 export default function CalendarPage() {
   const [properties, setProperties] = useState<Property[]>([]);
   const [tenants, setTenants] = useState<Tenant[]>([]);
   const [documents, setDocuments] = useState<Document[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const loadAll = async () => {
       setLoading(true);
       const [{ data: props }, { data: tens }, { data: docs }] = await Promise.all([
         supabase.from("properties").select("*").order("created_at", { ascending: false }),
         supabase.from("tenants").select("*"),
         supabase.from("documents").select("*").order("upload_date", { ascending: false }),
       ]);
       setProperties((props || []).map(mapProperty));
       setTenants((tens || []).map(mapTenant));
       setDocuments((docs || []).map(mapDocument));
       setLoading(false);
     };
     loadAll();
   }, []);
 
   const propertyById = useMemo(() => {
     const map = new Map<string, Property>();
     properties.forEach((p) => map.set(p.id, p));
     return map;
   }, [properties]);
 
   const importantDates: ReminderItem[] = useMemo(() => {
     const items: ReminderItem[] = [];
 
     tenants.forEach((t) => {
       const nd = nextPaymentDate(t.payment_day);
       if (nd) {
         const prop = t.property_id ? propertyById.get(t.property_id) : undefined;
         items.push({
           id: `pay-${t.id}`,
           date: nd.toISOString(),
           type: "Pagamento",
           title: `Pagamento de renda`,
           description: `${t.name}${prop ? " · " + getPropertyLabel(prop) : ""}${t.rent_amount ? " · €" + Number(t.rent_amount).toFixed(2) : ""}`,
           propertyId: t.property_id,
           tenantName: t.name,
         });
       }
     });
 
     documents.forEach((d) => {
       if (d.type === "Contrato" && d.expirationDate) {
         const prop = propertyById.get(d.propertyId);
         items.push({
           id: `exp-${d.id}`,
           date: d.expirationDate,
           type: "FimContrato",
           title: "Fim de contrato",
           description: `${d.tenantName || "Inquilino"} · ${getPropertyLabel(prop)} · ${d.fileName}`,
           propertyId: d.propertyId,
           tenantName: d.tenantName,
         });
       }
     });
 
     return items
       .filter((i) => !!i.date)
       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
   }, [tenants, documents, propertyById]);
 
   const inboxItems = useMemo(() => {
     return importantDates.filter((i) => {
       const d = daysUntil(i.date);
       return d >= 0 && d <= 5;
     });
   }, [importantDates]);
 
   return (
     <div>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
         <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0f172a" }}>Lembretes / Datas</h1>
       </div>
 
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
         <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: "4px solid #3b82f6" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
             <div style={{ background: "#eff6ff", padding: 10, borderRadius: "50%", color: "#1d4ed8" }}>
               <Bell size={20} />
             </div>
             <div>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Avisos próximos</p>
               <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>{inboxItems.length}</p>
             </div>
           </div>
           <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Itens a ocorrer nos próximos 5 dias.</p>
         </div>
         <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft: "4px solid #eab308" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
             <div style={{ background: "#fef9c3", padding: 10, borderRadius: "50%", color: "#a16207" }}>
               <Calendar size={20} />
             </div>
             <div>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>Datas importantes</p>
               <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>{importantDates.length}</p>
             </div>
           </div>
           <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Pagamentos e fins de contrato por ordem cronológica.</p>
         </div>
       </div>
 
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
         <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
           <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>Caixa de Entrada</h2>
           {loading ? (
             <p style={{ color: "#64748b" }}>A carregar...</p>
           ) : inboxItems.length === 0 ? (
             <p style={{ color: "#64748b" }}>Sem avisos para os próximos 5 dias.</p>
           ) : (
             inboxItems.map((item) => {
               const dLeft = daysUntil(item.date);
               const isUrgent = dLeft <= 2;
               return (
                 <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "#f8fafc", borderRadius: "8px", marginBottom: "0.5rem" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                     <div style={{ background: isUrgent ? "#fef2f2" : "#eff6ff", padding: 8, borderRadius: "50%", color: isUrgent ? "#dc2626" : "#1d4ed8" }}>
                       {item.type === "Pagamento" ? <Users size={18} /> : <FileText size={18} />}
                     </div>
                     <div>
                       <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.title}</div>
                       <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{item.description}</div>
                     </div>
                   </div>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isUrgent ? "#dc2626" : "#64748b", fontWeight: 600 }}>
                     <Clock size={16} />
                     <span>{dLeft} dias</span>
                   </div>
                 </div>
               );
             })
           )}
         </div>
 
         <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
           <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>Datas Importantes</h2>
           {loading ? (
             <p style={{ color: "#64748b" }}>A carregar...</p>
           ) : importantDates.length === 0 ? (
             <p style={{ color: "#64748b" }}>Sem datas registadas.</p>
           ) : (
             importantDates.map((item) => {
               const dLeft = daysUntil(item.date);
               const prop = item.propertyId ? propertyById.get(item.propertyId) : undefined;
               return (
                 <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderBottom: "1px solid #e2e8f0" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                     <div style={{ background: "#f1f5f9", padding: 8, borderRadius: "50%", color: "#334155" }}>
                       <Calendar size={18} />
                     </div>
                     <div>
                       <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.title}</div>
                       <div style={{ color: "#64748b", fontSize: "0.9rem" }}>{item.description}</div>
                       <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                         <span>{new Date(item.date).toLocaleDateString("pt-PT")}</span>
                         {prop && (
                           <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                             <Home size={14} />
                             {getPropertyLabel(prop)}
                           </span>
                         )}
                         {item.tenantName && (
                           <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                             <Users size={14} />
                             {item.tenantName}
                           </span>
                         )}
                       </div>
                     </div>
                   </div>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: dLeft < 0 ? "#64748b" : "#0f172a", fontWeight: 600 }}>
                     <AlertCircle size={16} />
                     <span>{dLeft < 0 ? "Passado" : dLeft === 0 ? "Hoje" : `Em ${dLeft} dias`}</span>
                   </div>
                 </div>
               );
             })
           )}
         </div>
       </div>
     </div>
   );
 }
 
