'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Home,
    Banknote,
    Users,
    FileText,
    Wrench,
    Calendar,
    Settings,
    LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
                <Image src="/logo.png" alt="RentCare" width={40} height={40} className={styles.logoIcon} />
                <span><b>Rent</b>Care</span>
            </Link>

            {/* Principal */}
            <div className={styles.navSection}>
                <h3 className={styles.sectionTitle}>Principal</h3>
                <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.navLinkActive : ''}`}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link href="/dashboard/calendar" className={`${styles.navLink} ${isActive('/dashboard/calendar') ? styles.navLinkActive : ''}`}>
                    <Calendar size={20} />
                    Lembretes / Datas
                </Link>
            </div>

            {/* Gestão */}
            <div className={styles.navSection}>
                <h3 className={styles.sectionTitle}>Gestão</h3>
                <Link href="/dashboard/properties" className={`${styles.navLink} ${isActive('/dashboard/properties') ? styles.navLinkActive : ''}`}>
                    <Home size={20} />
                    Imóveis
                </Link>
                <Link href="/dashboard/tenants" className={`${styles.navLink} ${isActive('/dashboard/tenants') ? styles.navLinkActive : ''}`}>
                    <Users size={20} />
                    Inquilinos
                </Link>
                <Link href="/dashboard/documents" className={`${styles.navLink} ${isActive('/dashboard/documents') ? styles.navLinkActive : ''}`}>
                    <FileText size={20} />
                    Documentos
                </Link>
                <Link href="/dashboard/maintenance" className={`${styles.navLink} ${isActive('/dashboard/maintenance') ? styles.navLinkActive : ''}`}>
                    <Wrench size={20} />
                    Manutenção
                </Link>
            </div>

            {/* Footer / Settings */}
            <div className={styles.footer}>
                <Link href="/dashboard/settings" className={`${styles.navLink} ${isActive('/dashboard/settings') ? styles.navLinkActive : ''}`} style={{ marginBottom: '0.5rem' }}>
                    <Settings size={20} />
                    Definições
                </Link>

                {user && (
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                            {(user.user_metadata?.avatar_url ?? user.user_metadata?.picture) ? (
                                <img
                                    src={user.user_metadata.avatar_url ?? user.user_metadata.picture}
                                    alt=""
                                    className={styles.avatarImg}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                (user.user_metadata?.name?.charAt(0) ?? user.email?.charAt(0) ?? '?').toUpperCase()
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>
                                {user.user_metadata?.name || 'Utilizador'}
                            </span>
                            <span className={styles.userEmail}>
                                {user.email}
                            </span>
                        </div>
                        <button type="button" onClick={handleLogout} className={styles.logoutBtn} aria-label="Sair">
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
