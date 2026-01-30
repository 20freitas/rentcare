'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, Banknote, Users, Menu, X, FileText, Wrench, Calendar, Settings, LogOut } from 'lucide-react';
import styles from './MobileNav.module.css';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className={styles.mobileNav}>
                <Link href="/dashboard" className={styles.logo}>
                    <Image src="/logo.png" alt="RentCare" width={32} height={32} />
                    <span><b>Rent</b>Care</span>
                </Link>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className={styles.menuButton}
                >
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            zIndex: 200,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            backdropFilter: 'blur(4px)' // Glass effect
                        }}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                width: '85%',
                                maxWidth: '300px',
                                height: '100%',
                                background: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >

                            <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#0f172a' }}>Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', padding: '0.25rem', cursor: 'pointer' }}>
                                    <X size={24} color="#64748b" />
                                </button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <FullSidebarContent closeMenu={() => setIsMenuOpen(false)} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1 }
};

function FullSidebarContent({ closeMenu }: { closeMenu: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const isActive = (path: string) => pathname === path;
    const itemStyle = (path: string) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '1rem 1.5rem',
        textDecoration: 'none',
        color: isActive(path) ? '#0f172a' : '#64748b',
        fontWeight: isActive(path) ? 600 : 500,
        background: isActive(path) ? '#f8fafc' : 'transparent',
        borderLeft: isActive(path) ? '4px solid #7aa9ca' : '4px solid transparent',
        fontSize: '1rem',
        width: '100%'
    });

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <motion.h3 variants={itemVariants} style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#94a3b8',
            padding: '1.5rem 1.5rem 0.5rem 1.5rem',
            letterSpacing: '0.05em'
        }}>
            {children}
        </motion.h3>
    );

    // Helper component for motion links
    const MenuLink = ({ href, children, icon: Icon }: any) => (
        <motion.div variants={itemVariants}>
            <Link href={href} style={itemStyle(href)} onClick={closeMenu}>
                <Icon size={22} /> {children}
            </Link>
        </motion.div>
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}
        >
            <SectionTitle>Principal</SectionTitle>
            <MenuLink href="/dashboard" icon={LayoutDashboard}>Dashboard</MenuLink>
            <MenuLink href="/dashboard/calendar" icon={Calendar}>Lembretes / Datas</MenuLink>

            <SectionTitle>Gestão</SectionTitle>
            <MenuLink href="/dashboard/properties" icon={Home}>Imóveis</MenuLink>
            <MenuLink href="/dashboard/tenants" icon={Users}>Inquilinos</MenuLink>
            <MenuLink href="/dashboard/documents" icon={FileText}>Documentos</MenuLink>
            <MenuLink href="/dashboard/maintenance" icon={Wrench}>Manutenção</MenuLink>

            <motion.div variants={itemVariants} style={{ height: '1px', background: '#f1f5f9', margin: '1.5rem 0' }} />

            <MenuLink href="/dashboard/settings" icon={Settings}>Definições</MenuLink>

            <motion.button
                variants={itemVariants}
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '1rem 1.5rem',
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                }}
            >
                <LogOut size={22} /> Sair da conta
            </motion.button>
        </motion.div>
    );
}
