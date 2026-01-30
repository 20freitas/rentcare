'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Home, Euro, Phone, Mail, FileText, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AddTenantModal from '@/components/dashboard/AddTenantModal';
import TenantDetailModal from '@/components/dashboard/TenantDetailModal';
import { Tenant } from '@/types/tenant';

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const fetchTenants = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tenants')
            .select(`
                *,
                properties (
                    title,
                    address
                )
            `)
            .order('name', { ascending: true });
        
        if (data) {
            setTenants(data as Tenant[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddTenant = async (data: Partial<Tenant>) => {
        if (data.id) {
            // Update Tenant
            const { error } = await supabase
                .from('tenants')
                .update(data)
                .eq('id', data.id);
            
            if (!error) {
                 // Update Property if needed
                 if (data.property_id) {
                     await supabase.from('properties')
                        .update({
                            rent_amount: data.rent_amount,
                            payment_day: data.payment_day,
                            tenant_name: data.name // Keep tenant name in sync in properties table
                        })
                        .eq('id', data.property_id);
                 }
                 fetchTenants();
            }
        } else {
            // Create Tenant
            const { error } = await supabase
                .from('tenants')
                .insert([data]);
            
            if (!error) {
                 // Update Property if linked
                 if (data.property_id) {
                     await supabase.from('properties')
                        .update({
                            rent_amount: data.rent_amount,
                            payment_day: data.payment_day,
                            tenant_name: data.name,
                            status: 'paid' // Assuming new tenant starts fresh or whatever logic, but let's keep it simple
                        })
                        .eq('id', data.property_id);
                 }
                 fetchTenants();
            }
        }
    };

    const handleDeleteTenant = async (id: string) => {
        if (confirm('Tem a certeza que deseja remover este inquilino?')) {
            const { error } = await supabase
                .from('tenants')
                .delete()
                .eq('id', id);
            
            if (!error) {
                setIsDetailModalOpen(false);
                fetchTenants();
            }
        }
    };

    const handleEditClick = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsDetailModalOpen(false);
        setIsEdit(true);
        setIsAddModalOpen(true);
    };

    const handleCardClick = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsDetailModalOpen(true);
    };

    const handleMarkPaid = async (tenant: Tenant) => {
        // Mock implementation for now as rent_payments logic is complex
        // In a real app, this would insert into rent_payments table
        alert(`Renda marcada como paga para ${tenant.name}!`);
        // Maybe update local state to reflect change visually if we were tracking it
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>Inquilinos</h1>
                    <p style={{ color: '#64748b' }}>Gerencie todos os seus inquilinos num só lugar</p>
                </div>
                <button
                    onClick={() => { setIsEdit(false); setSelectedTenant(null); setIsAddModalOpen(true); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        background: '#0f172a',
                        color: 'white',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Plus size={20} />
                    Adicionar Inquilino
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Procurar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '1rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Carregando inquilinos...</div>
            ) : filteredTenants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <User size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#334155' }}>Nenhum inquilino encontrado</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Adicione inquilinos para começar a gerir as rendas.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredTenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748b',
                                        fontWeight: 600,
                                        fontSize: '1.2rem',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {tenant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{tenant.name}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                            {tenant.properties?.title || tenant.properties?.address || 'Sem imóvel'}
                                        </p>
                                    </div>
                                </div>
                                {/* Rent Status Badge */}
                                <div style={{ 
                                    padding: '0.35rem 0.75rem', 
                                    borderRadius: '999px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600,
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                }}>
                                    <Circle size={10} fill="currentColor" />
                                    Ainda não marcado
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#f1f5f9' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Renda Mensal</span>
                                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Euro size={18} strokeWidth={2.5} />
                                        {tenant.rent_amount || '0.00'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Dia Pagamento</span>
                                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>Dia {tenant.payment_day || '?'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCardClick(tenant)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: '#f8fafc',
                                    color: '#475569',
                                    fontWeight: 600,
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginTop: 'auto'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f1f5f9';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                <FileText size={16} />
                                Ver Detalhes
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <AddTenantModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddTenant}
                initialData={selectedTenant || undefined}
                isEdit={isEdit}
            />

            <TenantDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                tenant={selectedTenant}
                onEdit={handleEditClick}
                onDelete={handleDeleteTenant}
                onMarkPaid={handleMarkPaid}
            />
        </div>
    );
}
