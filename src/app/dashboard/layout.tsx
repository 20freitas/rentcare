'use client';

import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                {children}
            </div>
            <MobileNav />
        </div>
    );
}
