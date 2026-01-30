'use client';

import React from 'react';
import { X, Phone, Mail, Home, Euro, Calendar, FileText, Trash2, Edit, CheckCircle, AlertCircle, Circle, CreditCard } from 'lucide-react';
import { Tenant } from '@/types/tenant';

interface TenantDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenant: Tenant | null;
    onEdit: (tenant: Tenant) => void;
    onDelete: (id: string) => void;
    onMarkPaid: (tenant: Tenant) => void;
}

export default function TenantDetailModal({ isOpen, onClose, tenant, onEdit, onDelete, onMarkPaid }: TenantDetailModalProps) {
    if (!isOpen || !tenant) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.3s ease-out',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>{tenant.name}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                             <span style={{ 
                                 display: 'inline-flex', 
                                 alignItems: 'center', 
                                 gap: '0.25rem',
                                 padding: '0.25rem 0.75rem', 
                                 borderRadius: '999px', 
                                 fontSize: '0.8rem', 
                                 fontWeight: 600,
                                 background: '#dcfce7',
                                 color: '#166534'
                             }}>
                                <Circle size={10} fill="currentColor" />
                                Ativo
                             </span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Contacts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contactos</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Phone size={18} />
                            <span>{tenant.phone || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Mail size={18} />
                            <span>{tenant.email || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <CreditCard size={18} />
                            <span>{tenant.nif || 'NIF N/A'}</span>
                        </div>
                    </div>

                    {/* Property */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Imóvel</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Home size={18} />
                            <span>{tenant.properties?.title || tenant.properties?.address || 'N/A'}</span>
                        </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Euro size={18} />
                            <span>{tenant.rent_amount || 'N/A'} / mês</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                            <Calendar size={18} />
                            <span>Dia {tenant.payment_day || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {tenant.notes && (
                    <div style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                         <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>Notas</h3>
                         <p style={{ color: '#334155', fontSize: '0.95rem' }}>{tenant.notes}</p>
                    </div>
                )}

                {/* Rent History (Mocked for now) */}
                <div style={{ marginBottom: '2rem' }}>
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Histórico de Rendas</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {/* Example items */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>Janeiro 2024</span>
                            <span style={{ color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16} /> Pago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>Fevereiro 2024</span>
                            <span style={{ color: '#ca8a04', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={16} /> Em atraso</span>
                        </div>
                     </div>
                </div>

                {/* Documents (Mocked) */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Documentos</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                            <FileText size={18} color="#64748b" />
                            <span>Contrato.pdf</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <button 
                        onClick={() => onMarkPaid(tenant)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#166534', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <CheckCircle size={18} /> Marcar Pago
                    </button>
                    <button 
                        onClick={() => onEdit(tenant)}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Edit size={18} /> Editar
                    </button>
                    <button 
                        onClick={() => onDelete(tenant.id)}
                        style={{ width: '48px', padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
