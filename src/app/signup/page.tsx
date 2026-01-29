'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import styles from '@/components/AuthLayout.module.css';

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("As passwords não coincidem.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A password deve ter pelo menos 6 caracteres.");
            setLoading(false);
            return;
        }

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    },
                },
            });

            if (signUpError) throw signUpError;

            // Auto Sign In is handled by Supabase for email/pass usually if email confirm is off
            // If email confirm is on, they can't login yet. Assuming confirm is OFF for smooth demo.
            // Even if confirm is ON, we usually redirect to a "Check email" page.

            // Try to sign in immediately to be sure (optional if session is established)
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (!signInError) {
                router.push('/dashboard');
                router.refresh(); // Update Navbar state
            } else {
                // Maybe email confirmation is required
                router.push('/login?message=check-email');
            }

        } catch (err: any) {
            setError(err.message);
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
                        <h1 className={styles.brandTitle}>Comece a gerir<br />de forma inteligente.</h1>
                        <p className={styles.brandText}>Junte-se a milhares de senhorios que poupam tempo e evitam dores de cabeça com a RentCare.</p>
                    </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>© 2026 RentCare.</p>
            </div>

            {/* Right Side: Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Criar Conta</h2>
                        <p className={styles.subtitle}>Preencha os dados abaixo para começar.</p>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className={styles.form}>
                        {/* Name */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="name">Nome Completo</label>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.inputIcon} />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="João Silva"
                                    className={styles.input}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className={styles.label} htmlFor="password">Password</label>
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

                        {/* Confirm Password */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="confirmPassword">Confirmar Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'A criar conta...' : (
                                <>
                                    Criar Conta
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <div className={styles.row} style={{ justifyContent: 'center' }}>
                            Já tem conta?{' '}
                            <Link href="/login" className={styles.link} style={{ marginLeft: '4px' }}>
                                Entrar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
