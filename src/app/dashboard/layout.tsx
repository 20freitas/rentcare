'use client';

import Sidebar from '@/components/Sidebar';
import styles from '@/components/Sidebar.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ marginLeft: '280px', flex: 1, padding: '2rem', width: 'calc(100% - 280px)' }}>
                {children}
            </div>
        </div>
    );
}
