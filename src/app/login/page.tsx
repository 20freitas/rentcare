'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, LogIn } from 'lucide-react';
import styles from '@/components/AuthLayout.module.css';

export default function Login() {
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
