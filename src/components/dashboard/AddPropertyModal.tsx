
'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');


    // Atualiza campos se mudar o initialData (abrir outro imóvel)
    React.useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAddress(initialData.address || '');
            setRentAmount(initialData.rentAmount?.toString() || '');
            setPaymentDay(initialData.paymentDay?.toString() || '');
            setTenantName(initialData.tenantName || '');
            setImageUrl(initialData.image_url || '');
            setImageFile(null);
        } else {
            setTitle('');
            setAddress('');
            setRentAmount('');
            setPaymentDay('');
            setTenantName('');
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
        setImageFile(null);
        setImageUrl('');
        onClose();
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
                maxWidth: '500px',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.3s ease-out',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{isEdit ? 'Editar Imóvel' : 'Adicionar Imóvel'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Image Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Foto do Imóvel (Opcional)</label>
                        <div style={{
                            border: '2px dashed #e2e8f0',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: '#f8fafc',
                            transition: 'all 0.2s'
                        }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Título (Ex: Casa na Praia)</label>
                        <input
                            type="text"
                            placeholder="Nome para identificar o imóvel"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    {/* Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Morada do Imóvel *</label>
                        <input
                            type="text"
                            placeholder="Ex: Rua das Flores, 123"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Rent Amount */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Valor Renda (€) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                required
                                value={rentAmount}
                                onChange={(e) => setRentAmount(e.target.value)}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        {/* Payment Day */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Dia Pagamento *</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                placeholder="1-31"
                                required
                                value={paymentDay}
                                onChange={(e) => setPaymentDay(e.target.value)}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Tenant Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Nome do Inquilino (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Nome do inquilino atual"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                background: 'white',
                                color: '#475569',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 2,
                                padding: '0.75rem',
                                border: 'none',
                                borderRadius: '8px',
                                background: 'var(--brand-gradient, #7aa9ca)',
                                backgroundColor: '#7aa9ca',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Plus size={20} />
                            Adicionar Imóvel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
