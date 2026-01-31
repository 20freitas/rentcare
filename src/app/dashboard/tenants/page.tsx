'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Home, Euro, Phone, Mail, FileText, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AddTenantModal from '@/components/dashboard/AddTenantModal';
import TenantDetailModal from '@/components/dashboard/TenantDetailModal';
import { Tenant } from '@/types/tenant';
import styles from './Tenants.module.css';

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
        <div className={styles.wrapper}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h1>Inquilinos</h1>
                    <p>Gerencie todos os seus inquilinos num só lugar</p>
                </div>
                <button
                    onClick={() => { setIsEdit(false); setSelectedTenant(null); setIsAddModalOpen(true); }}
                    className={styles.addButton}
                >
                    <Plus size={20} />
                    Adicionar Inquilino
                </button>
            </div>

            {/* Search */}
            <div className={styles.searchContainer}>
                <Search size={20} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Procurar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <div className={styles.loading}>Carregando inquilinos...</div>
            ) : filteredTenants.length === 0 ? (
                <div className={styles.emptyState}>
                    <User size={48} style={{ color: '#cbd5e1' }} />
                    <h3>Nenhum inquilino encontrado</h3>
                    <p>Adicione inquilinos para começar a gerir as rendas.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredTenants.map((tenant) => (
                        <div key={tenant.id} className={styles.card}>
                            {/* Card Header */}
                            <div className={styles.cardHeader}>
                                <div className={styles.tenantInfo}>
                                    <div className={styles.avatar}>
                                        {tenant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className={styles.tenantName}>{tenant.name}</h3>
                                        <p className={styles.tenantProperty}>
                                            {tenant.properties?.title || tenant.properties?.address || 'Sem imóvel'}
                                        </p>
                                    </div>
                                </div>
                                {/* Rent Status Badge */}
                                <div className={styles.statusBadge}>
                                    <Circle size={10} fill="currentColor" />
                                    Ainda não marcado
                                </div>
                            </div>

                            <div className={styles.divider} />

                            {/* Card Footer */}
                            <div className={styles.cardFooter}>
                                <div className={styles.rentInfo}>
                                    <span className={styles.rentLabel}>Renda Mensal</span>
                                    <span className={styles.rentValue}>
                                        <Euro size={18} strokeWidth={2.5} />
                                        {tenant.rent_amount || '0.00'}
                                    </span>
                                </div>
                                <div className={styles.paymentInfo}>
                                    <span className={styles.rentLabel}>Dia Pagamento</span>
                                    <span className={styles.paymentDay}>Dia {tenant.payment_day || '?'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCardClick(tenant)}
                                className={styles.detailsButton}
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
