'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import styles from '@/components/AuthLayout.module.css';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message === "Invalid login credentials"
                ? "Email ou password incorretos."
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.splitLayout}>
            {/* Left Side: Brand */}
            <div className={styles.brandSection}>
                <div className={styles.brandPattern} />
                <div className={styles.brandContent}>
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.png" alt="Logo" width={40} height={40} />
                        <span style={{ color: 'var(--foreground)', fontWeight: 800 }}>Rent</span>Care
                    </Link>
                    <div>
                        <h1 className={styles.brandTitle}>Bem-vindo<br />de volta.</h1>
                        <p className={styles.brandText}>Aceda ao seu dashboard para gerir rendas, contratos e inquilinos.</p>
                    </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>© 2026 RentCare.</p>
            </div>

            {/* Right Side: Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Entrar</h2>
                        <p className={styles.subtitle}>Insira os seus dados de acesso.</p>
                    </div>

                    {message === 'check-email' && (
                        <div className={styles.error} style={{ background: '#ecfdf5', borderColor: '#6ee7b7', color: '#047857' }}>
                            <AlertCircle size={18} />
                            Verifique o seu email para confirmar a conta.
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        className={styles.googleBtn}
                        disabled={loading}
                        onClick={async () => {
                            setLoading(true);
                            setError(null);
                            const { error: oauthError } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: { redirectTo: `${window.location.origin}/auth/callback` },
                            });
                            if (oauthError) {
                                setError(oauthError.message);
                                setLoading(false);
                            }
                        }}
                    >
                        <GoogleIcon /> Continuar com Google
                    </button>

                    <div className={styles.divider}>ou</div>

                    <form onSubmit={handleLogin} className={styles.form}>
                        {/* Email */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    className={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className={styles.inputGroup}>
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="password">Password</label>
                                <Link href="#" className={styles.forgotLink}>
                                    Esqueceu-se?
                                </Link>
                            </div>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`${styles.input} ${styles.inputWithToggle}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'A entrar...' : (
                                <>
                                    Entrar
                                    <LogIn size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <div className={styles.row} style={{ justifyContent: 'center' }}>
                            Não tem conta?{' '}
                            <Link href="/signup" className={styles.link} style={{ marginLeft: '4px' }}>
                                Criar conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">A carregar...</div>}>
            <LoginForm />
        </Suspense>
    );
}
