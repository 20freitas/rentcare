
'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tenant } from '@/types/tenant';
import styles from './Modal.module.css';

interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => void;
    initialData?: any;
    isEdit?: boolean;
}

export default function AddPropertyModal({ isOpen, onClose, onAdd, initialData, isEdit }: AddPropertyModalProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [address, setAddress] = useState(initialData?.address || '');
    const [rentAmount, setRentAmount] = useState(initialData?.rentAmount?.toString() || '');
    const [paymentDay, setPaymentDay] = useState(initialData?.paymentDay?.toString() || '');
    const [tenantName, setTenantName] = useState(initialData?.tenantName || '');
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
    const [tenants, setTenants] = useState<Tenant[]>([]);

    // Fetch tenants for dropdown
    useEffect(() => {
        if (isOpen) {
            const fetchTenants = async () => {
                const { data } = await supabase.from('tenants').select('*');
                if (data) setTenants(data);
            };
            fetchTenants();
        }
    }, [isOpen]);

    // Fetch current tenant for this property if editing
    useEffect(() => {
        if (isOpen && isEdit && initialData?.id) {
            const fetchCurrentTenant = async () => {
                const { data } = await supabase
                    .from('tenants')
                    .select('id')
                    .eq('property_id', initialData.id)
                    .single();
                if (data) {
                    setSelectedTenantId(data.id);
                }
            };
            fetchCurrentTenant();
        }
    }, [isOpen, isEdit, initialData]);

    // Update fields when initialData changes
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAddress(initialData.address || '');
            setRentAmount(initialData.rentAmount?.toString() || '');
            setPaymentDay(initialData.paymentDay?.toString() || '');
            setTenantName(initialData.tenantName || '');
            setImageUrl(initialData.image_url || '');
            setImageFile(null);
            // selectedTenantId is handled by the other useEffect
        } else {
            setTitle('');
            setAddress('');
            setRentAmount('');
            setPaymentDay('');
            setTenantName('');
            setSelectedTenantId('');
            setImageUrl('');
            setImageFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = {
            title: title || address,
            address,
            rentAmount: Number(rentAmount),
            paymentDay: Number(paymentDay),
            tenantName,
            selectedTenantId, // Pass this to parent
            imageFile,
            image_url: imageUrl
        };
        if (isEdit && initialData?.id) {
            data.id = initialData.id;
            data.status = initialData.status;
        } else {
            data.status = 'pending';
        }
        onAdd(data);
        // Reset and close
        setTitle('');
        setAddress('');
        setRentAmount('');
        setPaymentDay('');
        setTenantName('');
        setSelectedTenantId('');
        setImageFile(null);
        setImageUrl('');
        onClose();
    };

    const handleTenantSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedTenantId(id);
        if (id) {
            const tenant = tenants.find(t => t.id === id);
            if (tenant) setTenantName(tenant.name);
        } else {
            setTenantName('');
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{isEdit ? 'Editar Imóvel' : 'Adicionar Imóvel'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Image Upload */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Foto do Imóvel (Opcional)</label>
                        <div className={styles.imageUpload}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                style={{ display: 'none' }}
                                id="property-image"
                            />
                            <label htmlFor="property-image" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                {imageFile ? (
                                    <span style={{ color: '#059669', fontWeight: 500 }}>{imageFile.name} (Selecionado)</span>
                                ) : imageUrl ? (
                                    <span style={{ color: '#059669', fontWeight: 500 }}>Imagem atual carregada</span>
                                ) : (
                                    <>
                                        <span style={{ color: '#64748b' }}>Clique para fazer upload de uma imagem</span>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PNG, JPG até 5MB</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Title */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Título (Ex: Casa na Praia)</label>
                        <input
                            type="text"
                            placeholder="Nome para identificar o imóvel"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    {/* Address */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Morada do Imóvel *</label>
                        <input
                            type="text"
                            placeholder="Ex: Rua das Flores, 123"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputRow}>
                        {/* Rent Amount */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Valor Renda (€) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                required
                                inputMode="decimal"
                                value={rentAmount}
                                onChange={(e) => setRentAmount(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Payment Day */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Dia Pagamento *</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                placeholder="1-31"
                                required
                                inputMode="numeric"
                                value={paymentDay}
                                onChange={(e) => setPaymentDay(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    {/* Tenant Name */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Inquilino</label>

                        {/* Select Existing Tenant */}
                        <select
                            value={selectedTenantId}
                            onChange={handleTenantSelect}
                            className={styles.input}
                        >
                            <option value="">-- Selecionar Inquilino Existente --</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.name} {t.nif ? `(NIF: ${t.nif})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                        >
                            <Plus size={20} />
                            {isEdit ? 'Guardar Alterações' : 'Adicionar Imóvel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

