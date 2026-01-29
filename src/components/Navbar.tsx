'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Hide Navbar on Dashboard routes
    const isDashboard = pathname?.startsWith('/dashboard');

    useEffect(() => {
        // Initial check
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();

        // Realtime listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_OUT') {
                setUser(null);
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    if (isDashboard) return null;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="RentCare Logo"
                        width={48}
                        height={48}
                        className={styles.logoIcon}
                    />
                    <span><b>Rent</b>Care</span>
                </Link>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <a href="/#features" className={styles.link}>Funcionalidades</a>
                    {user ? (
                        <Link href="/dashboard" className={styles.button}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/signup" className={styles.button}>Começar Agora</Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.mobileLinks}>
                            <a
                                href="/#features"
                                className={styles.mobileLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Funcionalidades
                            </a>
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className={styles.mobileButton}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Ir para Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/signup"
                                    className={styles.mobileButton}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Começar Agora
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
