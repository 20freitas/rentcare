import { Property } from '@/types/property';
import { MapPin, User, Banknote, Calendar, CheckCircle, AlertCircle, Clock, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
    property: Property;
    onMarkPaid: (id: string) => void;
    onDelete?: (id: string) => void;
    onDetails?: () => void;
}

export default function PropertyCard({ property, onMarkPaid, onDelete, onDetails = () => { } }: PropertyCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
            case 'late': return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'late': return 'Em atraso';
            default: return 'Pendente';
        }
    };

    const styles = getStatusColor(property.status);

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            position: 'relative',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}>

            {/* Image Section */}
            <div style={{
                height: '200px', // Taller image for impact
                width: '100%',
                position: 'relative',
                background: '#f8fafc',
            }}>
                {property.image_url ? (
                    <Image
                        src={property.image_url}
                        alt={property.address}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                        <HomePlaceholder />
                    </div>
                )}

                {/* Status Badge - Floating Pill */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: styles.text,
                    border: `1px solid ${styles.border}`
                }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: styles.text }} />
                    {getStatusLabel(property.status)}
                </div>

                {/* Price Overlay - Bottom Left of Image */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(2px)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px'
                }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.rentAmount}€</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>/mês</span>
                </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>

                {/* Title & Address */}
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }} title={property.title || property.address}>
                    {property.title || property.address}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <MapPin size={14} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.address}</span>
                </div>

                <div style={{ width: '100%', height: '1px', background: '#f1f5f9', marginBottom: '1rem' }} />

                {/* Details Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>

                    {/* Tenant Information */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#64748b'
                        }}>
                            <User size={16} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Inquilino</p>
                            <p style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>
                                {property.tenantName ? property.tenantName.split(' ')[0] : 'Vazio'}
                            </p>
                        </div>
                    </div>

                    {/* Payment Day */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            background: '#f8fafc', // lighter
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#64748b',
                            border: '1px solid #f1f5f9'
                        }}>
                            <Calendar size={16} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Dia Pag.</p>
                            <p style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>
                                {property.paymentDay}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onDetails}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#475569',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Detalhes
                    </button>

                    {property.status !== 'paid' && (
                        <button
                            onClick={() => onMarkPaid(property.id)}
                            style={{
                                flex: 2, // Dominant button
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#10b981', // Emerald 500
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <CheckCircle size={18} />
                            Marcar Pago
                        </button>
                    )}

                    <button
                        onClick={() => onDelete && onDelete(property.id)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: '#fff1f2',
                            color: '#e11d48',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}

// Icon helper for placeholder
function HomePlaceholder() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </div>
    );
}
