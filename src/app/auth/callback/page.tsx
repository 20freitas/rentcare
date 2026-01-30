'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function getHashParams(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const hash = window.location.hash.replace(/^#/, '');
    return Object.fromEntries(new URLSearchParams(hash));
}

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const next = searchParams.get('next') ?? '/dashboard';
        const path = next.startsWith('/') ? next : '/dashboard';

        (async () => {
            const code = searchParams.get('code');

            if (code) {
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                if (exchangeError) {
                    setError(exchangeError.message);
                    return;
                }
                router.replace(path);
                router.refresh();
                return;
            }

            const hashParams = getHashParams();
            const access_token = hashParams.access_token;
            const refresh_token = hashParams.refresh_token;

            if (access_token) {
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token,
                    refresh_token: refresh_token ?? '',
                });
                if (sessionError) {
                    setError(sessionError.message);
                    return;
                }
                router.replace(path);
                router.refresh();
                return;
            }

            setError('Código de autenticação em falta. Tente novamente.');
        })();
    }, [searchParams, router]);

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                <p style={{ color: '#ef4444' }}>{error}</p>
                <a href="/login" style={{ color: 'var(--secondary)', fontWeight: 500 }}>Voltar ao login</a>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#64748b' }}>A iniciar sessão...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A carregar...</div>}>
            <AuthCallbackContent />
        </Suspense>
    );
}
