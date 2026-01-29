'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
            setLoading(false);
        };
        checkUser();
    }, [router]);

    if (loading) return <div className="p-8">A carregar...</div>;

    return (
        <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Dashboard</h1>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ color: '#64748b' }}>Bem-vindo à sua área de gestão. (Em construção)</p>
                </div>
            </div>
        </main>
    );
}
