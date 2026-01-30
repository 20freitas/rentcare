'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './Dashboard.module.css';

interface DashboardStats {
    propertiesCount: number;
    tenantsCount: number;
    documentsCount: number;
    maintenancePendingCount: number;
    totalRent: number;
    lateCount: number;
}

interface NextPayment {
    id: string;
    title: string | null;
    address: string;
    rent_amount: number;
    payment_day: number;
    status: string;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

function getNextPaymentLabel(day: number): string {
    const today = new Date().getDate();
    const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
    ).getDate();
    if (day >= today) {
        const diff = day - today;
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Amanhã';
        return `Dia ${day}`;
    }
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return `Dia ${day} (próx. mês)`;
}

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>('');
    const [stats, setStats] = useState<DashboardStats>({
        propertiesCount: 0,
        tenantsCount: 0,
        documentsCount: 0,
        maintenancePendingCount: 0,
        totalRent: 0,
        lateCount: 0,
    });
    const [nextPayments, setNextPayments] = useState<NextPayment[]>([]);

    useEffect(() => {
        const load = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const name =
                (session.user.user_metadata?.name as string) ||
                session.user.email?.split('@')[0] ||
                'Utilizador';
            setUserName(name);

            const [
                propsRes,
                tenantsRes,
                docsRes,
                maintenanceRes,
            ] = await Promise.all([
                supabase
                    .from('properties')
                    .select('id, rent_amount, status')
                    .order('created_at', { ascending: false }),
                supabase.from('tenants').select('*', { count: 'exact', head: true }),
                supabase.from('documents').select('*', { count: 'exact', head: true }),
                supabase
                    .from('maintenance')
                    .select('id')
                    .eq('status', 'Por resolver'),
            ]);

            const properties = propsRes.data ?? [];
            const totalRent = properties.reduce(
                (sum, p) => sum + (Number(p.rent_amount) || 0),
                0
            );
            const lateCount = properties.filter((p) => p.status === 'late').length;

            const tenantsCount = (tenantsRes as { count?: number }).count ?? 0;
            const documentsCount = (docsRes as { count?: number }).count ?? 0;

            setStats({
                propertiesCount: properties.length,
                tenantsCount,
                documentsCount,
                maintenancePendingCount: maintenanceRes.data?.length ?? 0,
                totalRent,
                lateCount,
            });

            const { data: propsForPayments } = await supabase
                .from('properties')
                .select('id, title, address, rent_amount, payment_day, status')
                .order('payment_day', { ascending: true });

            const list: NextPayment[] = (propsForPayments ?? []).slice(0, 5).map((p) => ({
                id: p.id,
                title: p.title ?? null,
                address: p.address,
                rent_amount: Number(p.rent_amount) || 0,
                payment_day: p.payment_day ?? 1,
                status: p.status ?? 'pending',
            }));
            setNextPayments(list);
            setLoading(false);
        };
        load();
    }, [router]);

    if (loading) {
        return (
            <main className={styles.wrapper}>
                <div className={styles.loadingWrap}>
                    <p>A carregar...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.wrapper}>
            <header className={styles.header}>
                <p className={styles.greeting}>Olá, {userName}</p>
                <h1 className={styles.title}>Resumo</h1>
            </header>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statCardHighlight}`}>
                    <span className={styles.statLabel}>Rendimento mensal</span>
                    <span className={styles.statValue}>
                        {formatCurrency(stats.totalRent)}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Imóveis</span>
                    <span className={styles.statValue}>{stats.propertiesCount}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Inquilinos</span>
                    <span className={styles.statValue}>{stats.tenantsCount}</span>
                </div>
                {stats.lateCount > 0 && (
                    <div className={`${styles.statCard} ${styles.statCardDanger}`}>
                        <span className={styles.statLabel}>Em atraso</span>
                        <span className={styles.statValue}>{stats.lateCount}</span>
                    </div>
                )}
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Documentos</span>
                    <span className={styles.statValue}>{stats.documentsCount}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Manutenção por resolver</span>
                    <span className={styles.statValue}>
                        {stats.maintenancePendingCount}
                    </span>
                </div>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Próximos pagamentos</h2>
                    <Link href="/dashboard/calendar" className={styles.sectionLink}>
                        Ver calendário
                    </Link>
                </div>
                <div className={styles.nextPaymentsCard}>
                    {nextPayments.length === 0 ? (
                        <div className={styles.emptyState}>
                            Ainda não tem imóveis. Adicione um imóvel para ver os
                            pagamentos aqui.
                        </div>
                    ) : (
                        nextPayments.map((p) => (
                            <Link
                                key={p.id}
                                href={`/dashboard/properties?highlight=${p.id}`}
                                className={`${styles.paymentRow} ${
                                    p.status === 'late' ? styles.paymentRowLate : ''
                                }`}
                            >
                                <div className={styles.paymentLeft}>
                                    <span className={styles.paymentAddress}>
                                        {p.title || p.address}
                                    </span>
                                    <span className={styles.paymentMeta}>
                                        {getNextPaymentLabel(p.payment_day)}
                                    </span>
                                </div>
                                <span className={styles.paymentAmount}>
                                    {formatCurrency(p.rent_amount)}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
