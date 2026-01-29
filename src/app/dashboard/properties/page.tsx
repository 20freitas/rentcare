'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyCard from '@/components/dashboard/PropertyCard';
import PropertyStats from '@/components/dashboard/PropertyStats';
import AddPropertyModal from '@/components/dashboard/AddPropertyModal';
import { supabase } from '@/lib/supabase';

// Map DB row to Property type
const mapProperty = (dbRow: any): Property => ({
    id: dbRow.id,
    title: dbRow.title, // Adicionado para mostrar o nome personalizado
    address: dbRow.address,
    rentAmount: dbRow.rent_amount,
    paymentDay: dbRow.payment_day,
    tenantName: dbRow.tenant_name,
    status: dbRow.status,
    image_url: dbRow.image_url
});

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'paid' | 'late'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
    const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

    const fetchProperties = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setProperties(data.map(mapProperty));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleEditProperty = async (data: any) => {
        let image_url = data.image_url;
        // Se for feito upload de nova imagem
        if (data.imageFile) {
            const fileName = `${Date.now()}-${data.imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('properties')
                .upload(fileName, data.imageFile);
            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(fileName);
                image_url = publicUrl;
            }
        }
        const { error } = await supabase.from('properties')
            .update({
                title: data.title || null,
                address: data.address,
                rent_amount: data.rentAmount,
                payment_day: data.paymentDay,
                tenant_name: data.tenantName || null,
                status: data.status || 'pending',
                image_url: image_url
            })
            .eq('id', data.id);
        if (!error) {
            fetchProperties();
        } else {
            console.error("Error editing property:", error);
            alert("Erro ao editar imóvel. Tente novamente.");
        }
        setPropertyToEdit(null);
    };
    const handleAddProperty = async (data: any) => {
        // 1. Upload Image (if exists)
        let image_url = null;
        if (data.imageFile) {
            const fileName = `${Date.now()}-${data.imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('properties')
                .upload(fileName, data.imageFile);

            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(fileName);
                image_url = publicUrl;
            }
        }

        // 2. Insert into DB
        const { error } = await supabase.from('properties').insert({
            title: data.title || null, // Adicionado para guardar o nome personalizado
            address: data.address,
            rent_amount: data.rentAmount,
            payment_day: data.paymentDay,
            tenant_name: data.tenantName || null,
            status: data.status || 'pending',
            image_url: image_url
        });

        if (!error) {
            fetchProperties(); // Reload list
        } else {
            console.error("Error adding property:", error);
            alert("Erro ao adicionar imóvel. Tente novamente.");
        }
    };

    const handleMarkPaid = async (id: string) => {
        // Optimistic update
        setProperties(properties.map(p =>
            p.id === id ? { ...p, status: 'paid' } : p
        ));

        const { error } = await supabase
            .from('properties')
            .update({ status: 'paid' })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            fetchProperties(); // Revert on error
        }
    };

    const confirmDeleteProperty = async () => {
        if (!propertyToDelete) return;
        const id = propertyToDelete;

        setProperties(properties.filter(p => p.id !== id)); // Optimistic delete
        setPropertyToDelete(null);

        const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting property:", error);
            alert("Erro ao eliminar imóvel.");
            fetchProperties();
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesFilter = filter === 'all' || property.status === filter || (filter === 'late' && property.status === 'late');
        const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.tenantName && property.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>Meus Imóveis</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                        background: '#7aa9ca', // Fixed: Brand Blue from Landing Page
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(122, 169, 202, 0.5)',
                        transition: 'transform 0.1s'
                    }}
                >
                    <Plus size={20} />
                    Adicionar Imóvel
                </button>
            </div>

            {/* Stats Summary */}
            <PropertyStats properties={properties} />

            {/* Filter & Search */}
            <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ position: 'relative', flex: 1 }}> {/* Fixed: Removed maxWidth */}
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Pesquisar por morada ou inquilino..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 2.8rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Filter Buttons */}
                    {['all', 'paid', 'late'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '8px',
                                border: filter === f ? '1px solid transparent' : '1px solid #e2e8f0',
                                background: filter === f ? '#e2e8f0' : 'white',
                                color: filter === f ? '#0f172a' : '#64748b',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f === 'all' ? 'Todos' : f === 'paid' ? 'Pagos' : 'Em Atraso'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {loading ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8' }}>A carregar imóveis...</p>
                ) : filteredProperties.map(property => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onMarkPaid={handleMarkPaid}
                        onDelete={(id) => setPropertyToDelete(id)}
                        onDetails={() => setPropertyToEdit(property)}
                    />
                ))}
            </div>

            {!loading && filteredProperties.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <p>Nenhum imóvel encontrado.</p>
                </div>
            )}

            <AddPropertyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProperty}
            />
            {/* Modal de editar imóvel */}
            {propertyToEdit && (
                <AddPropertyModal
                    isOpen={!!propertyToEdit}
                    onClose={() => setPropertyToEdit(null)}
                    onAdd={handleEditProperty}
                    initialData={propertyToEdit}
                    isEdit
                />
            )}

            {/* Custom Delete Confirmation Modal */}
            {propertyToDelete && (
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
                    zIndex: 1100,
                    backdropFilter: 'blur(2px)'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        animation: 'scaleIn 0.2s ease-out'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Eliminar Imóvel?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            Tem a certeza que deseja eliminar este imóvel? Esta ação não pode ser desfeita.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setPropertyToDelete(null)}
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#475569',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteProperty}
                                style={{
                                    padding: '0.6rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#ef4444',
                                    color: 'white',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
