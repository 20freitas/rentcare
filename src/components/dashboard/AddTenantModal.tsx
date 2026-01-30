'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tenant } from '@/types/tenant';

interface PropertyOption {
    id: string;
    title: string;
    address: string;
    rent_amount: number;
    payment_day: number;
}

interface AddTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: Partial<Tenant>) => void;
    initialData?: Tenant;
    isEdit?: boolean;
}

export default function AddTenantModal({ isOpen, onClose, onAdd, initialData, isEdit }: AddTenantModalProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [nif, setNif] = useState(initialData?.nif || '');
    const [propertyId, setPropertyId] = useState(initialData?.property_id || '');
    const [rentAmount, setRentAmount] = useState(initialData?.rent_amount?.toString() || '');
    const [paymentDay, setPaymentDay] = useState(initialData?.payment_day?.toString() || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [properties, setProperties] = useState<PropertyOption[]>([]);

    useEffect(() => {
        const fetchProperties = async () => {
             const { data } = await supabase.from('properties').select('id, title, address, rent_amount, payment_day');
             if (data) setProperties(data);
        };
        if (isOpen) {
            fetchProperties();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setNif(initialData.nif || '');
            setPropertyId(initialData.property_id || '');
            setRentAmount(initialData.rent_amount?.toString() || '');
            setPaymentDay(initialData.payment_day?.toString() || '');
            setNotes(initialData.notes || '');
        } else {
             setName('');
             setEmail('');
             setPhone('');
             setNif('');
             setPropertyId('');
             setRentAmount('');
             setPaymentDay('');
             setNotes('');
        }
    }, [initialData, isOpen]);

    const handlePropertyChange = (propId: string) => {
        setPropertyId(propId);
        const prop = properties.find(p => p.id === propId);
        if (prop) {
            setRentAmount(prop.rent_amount.toString());
            setPaymentDay(prop.payment_day.toString());
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Partial<Tenant> = {
            name,
            email,
            phone,
            nif,
            property_id: propertyId || undefined,
            rent_amount: rentAmount ? Number(rentAmount) : undefined,
            payment_day: paymentDay ? Number(paymentDay) : undefined,
            notes
        };
        
        if (isEdit && initialData?.id) {
            data.id = initialData.id;
        }

        onAdd(data);
        onClose();
    };

    if (!isOpen) return null;

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
                maxWidth: '500px',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.3s ease-out',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                        {isEdit ? 'Editar Inquilino' : 'Adicionar Inquilino'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Nome *</label>
                        <input
                            type="text"
                            placeholder="Nome do inquilino"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                        />
                    </div>

                    {/* Contacts & NIF */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Telefone</label>
                            <input
                                type="tel"
                                placeholder="912 345 678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Email</label>
                            <input
                                type="email"
                                placeholder="email@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>NIF</label>
                            <input
                                type="text"
                                placeholder="123456789"
                                value={nif}
                                onChange={(e) => setNif(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    {/* Property */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Imóvel Associado</label>
                        <select
                            value={propertyId}
                            onChange={(e) => handlePropertyChange(e.target.value)}
                            style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', backgroundColor: 'white' }}
                        >
                            <option value="">Selecione um imóvel...</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.title || p.address}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rent & Payment Day */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Valor Renda (€)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={rentAmount}
                                onChange={(e) => setRentAmount(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Dia Pagamento</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Dia"
                                value={paymentDay}
                                onChange={(e) => setPaymentDay(e.target.value)}
                                style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Notas</label>
                        <textarea
                            placeholder="Ex: Paga sempre por MB Way..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 2, padding: '0.75rem', border: 'none', borderRadius: '8px', background: '#7aa9ca', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={20} />
                            {isEdit ? 'Salvar Alterações' : 'Adicionar Inquilino'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
