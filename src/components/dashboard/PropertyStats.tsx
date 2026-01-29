import { Property } from '@/types/property';
import { CheckCircle, AlertCircle, Banknote } from 'lucide-react';

interface PropertyStatsProps {
    properties: Property[];
}

export default function PropertyStats({ properties }: PropertyStatsProps) {
    const paidCount = properties.filter(p => p.status === 'paid').length;
    const lateCount = properties.filter(p => p.status === 'late').length;
    const totalRent = properties.reduce((sum, p) => sum + p.rentAmount, 0);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {/* Paid Card */}
            <div style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                borderLeft: '4px solid #10b981',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '50%', color: '#059669' }}>
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Pagos este mês</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{paidCount}</p>
                </div>
            </div>

            {/* Late Card */}
            <div style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                borderLeft: '4px solid #ef4444',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '50%', color: '#dc2626' }}>
                    <AlertCircle size={24} />
                </div>
                <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Em atraso</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{lateCount}</p>
                </div>
            </div>

            {/* Total Value Card */}
            <div style={{
                background: 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                borderLeft: '4px solid #3b82f6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%', color: '#3b82f6' }}>
                    <Banknote size={24} />
                </div>
                <div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Previsto</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{totalRent}€</p>
                </div>
            </div>
        </div>
    );
}
