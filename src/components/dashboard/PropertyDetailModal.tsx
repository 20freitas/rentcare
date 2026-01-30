'use client';

import React, { useState, useEffect } from 'react';
import { X, Home, Users, FileText, Wrench, Calendar, Euro, MapPin, Edit, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { Tenant } from '@/types/tenant';
import { Document } from '@/types/document';
import { MaintenanceOccurrence } from '@/types/maintenance';
import Image from 'next/image';

interface PropertyDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
    onEdit: (property: Property) => void;
}

export default function PropertyDetailModal({ isOpen, onClose, property, onEdit }: PropertyDetailModalProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'tenants' | 'documents' | 'occurrences'>('info');
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [occurrences, setOccurrences] = useState<MaintenanceOccurrence[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && property) {
            fetchDetails();
        }
    }, [isOpen, property]);

    const fetchDetails = async () => {
        if (!property) return;
        setLoading(true);

        // Fetch Tenants
        const { data: tenantsData } = await supabase
            .from('tenants')
            .select('*')
            .eq('property_id', property.id);
        if (tenantsData) setTenants(tenantsData);

        // Fetch Documents
        const { data: docsData } = await supabase
            .from('documents')
            .select('*')
            .eq('property_id', property.id)
            .order('created_at', { ascending: false });
        // Map to Document type (handling potential snake_case from DB)
        if (docsData) {
            setDocuments(docsData.map((d: any) => ({
                id: d.id,
                propertyId: d.property_id,
                fileName: d.file_name,
                type: d.type,
                fileUrl: d.file_url,
                uploadDate: d.upload_date,
                notes: d.notes
            })));
        }

        // Fetch Occurrences
        const { data: occData } = await supabase
            .from('maintenance_occurrences')
            .select('*')
            .eq('property_id', property.id)
            .order('problem_date', { ascending: false });
        
        if (occData) {
             setOccurrences(occData.map((o: any) => ({
                 id: o.id,
                 propertyId: o.property_id,
                 problemType: o.problem_type,
                 description: o.description,
                 problemDate: o.problem_date,
                 cost: o.cost,
                 status: o.status,
                 attachmentUrls: o.attachment_urls,
                 createdAt: o.created_at
             })));
        }

        setLoading(false);
    };

    if (!isOpen || !property) return null;

    const renderTabContent = () => {
        if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>A carregar dados...</div>;

        switch (activeTab) {
            case 'info':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                         {property.image_url && (
                            <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                                <Image 
                                    src={property.image_url} 
                                    alt={property.title || property.address}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Morada</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                                    <MapPin size={18} />
                                    <span>{property.address}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Valor da Renda</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                                    <Euro size={18} />
                                    <span>{property.rentAmount} / mês</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Dia de Pagamento</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                                    <Calendar size={18} />
                                    <span>Dia {property.paymentDay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'tenants':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tenants.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                                Nenhum inquilino associado.
                            </div>
                        ) : (
                            tenants.map(tenant => (
                                <div key={tenant.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600, color: '#0f172a' }}>{tenant.name}</h4>
                                        <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
                                            {tenant.email} • {tenant.phone}
                                        </div>
                                        {tenant.nif && (
                                             <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                                                NIF: {tenant.nif}
                                             </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {/* Actions for tenant could go here */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'documents':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {documents.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                                Nenhum documento encontrado.
                            </div>
                        ) : (
                            documents.map(doc => (
                                <div key={doc.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '6px' }}>
                                            <FileText size={20} color="#64748b" />
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 600, color: '#0f172a' }}>{doc.fileName}</h4>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {doc.type} • {new Date(doc.uploadDate!).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <a 
                                        href={doc.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ padding: '0.5rem', color: '#3b82f6', cursor: 'pointer' }}
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'occurrences':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {occurrences.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                                Nenhuma ocorrência registada.
                            </div>
                        ) : (
                            occurrences.map(occ => (
                                <div key={occ.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ 
                                            fontSize: '0.8rem', 
                                            fontWeight: 600, 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: '999px',
                                            background: occ.status === 'Resolvido' ? '#dcfce7' : occ.status === 'Em andamento' ? '#dbeafe' : '#fee2e2',
                                            color: occ.status === 'Resolvido' ? '#166534' : occ.status === 'Em andamento' ? '#1e40af' : '#991b1b'
                                        }}>
                                            {occ.status}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {new Date(occ.problemDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{occ.problemType}</h4>
                                    <p style={{ color: '#334155', fontSize: '0.95rem' }}>{occ.description}</p>
                                    {occ.cost && (
                                        <div style={{ marginTop: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
                                            € {occ.cost}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                );
        }
    };

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
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{property.title || property.address}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{property.address}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button 
                            onClick={() => onEdit(property)}
                            style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#475569' }}
                            title="Editar Imóvel"
                        >
                            <Edit size={20} />
                        </button>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', padding: '0 1.5rem', borderBottom: '1px solid #e2e8f0', gap: '1.5rem' }}>
                    {[
                        { id: 'info', label: 'Info', icon: Home },
                        { id: 'tenants', label: 'Inquilinos', icon: Users },
                        { id: 'documents', label: 'Documentos', icon: FileText },
                        { id: 'occurrences', label: 'Ocorrências', icon: Wrench },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid #0f172a' : '2px solid transparent',
                                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
