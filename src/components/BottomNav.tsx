'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Home,
    Users,
    FileText,
    MoreHorizontal
} from 'lucide-react';
import styles from './BottomNav.module.css';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Início' },
    { href: '/dashboard/properties', icon: Home, label: 'Imóveis' },
    { href: '/dashboard/tenants', icon: Users, label: 'Inquilinos' },
    { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
    { href: '/dashboard/settings', icon: MoreHorizontal, label: 'Mais' },
];

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                    >
                        <item.icon
                            size={22}
                            strokeWidth={active ? 2.5 : 2}
                            className={styles.navIcon}
                        />
                        <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
