'use client';

import { motion } from 'framer-motion';
import { Home, Users, Wallet, Bell, FileText, BarChart3, Hammer, CreditCard, TrendingUp, ShieldCheck } from 'lucide-react';
import styles from './Features.module.css';

const allFeatures = [
    {
        icon: <Home size={24} />,
        title: "Gestão de Imóveis",
        description: "Adicione imóveis com detalhes completos e associe inquilinos facilmente."
    },
    {
        icon: <Users size={24} />,
        title: "Gestão de Inquilinos",
        description: "Guarde contactos, NIF e histórico de pagamentos de cada inquilino."
    },
    {
        icon: <Wallet size={24} />,
        title: "Controlo de Rendas",
        description: "Defina valores, datas de pagamento e marque rendas como pagas ou em atraso."
    },
    {
        icon: <Bell size={24} />,
        title: "Lembretes Automáticos",
        description: "Receba avisos de rendas em atraso, fins de contrato e atualizações de renda."
    },
    {
        icon: <FileText size={24} />,
        title: "Documentos",
        description: "Upload de contratos e recibos, tudo organizado por imóvel."
    },
    {
        icon: <BarChart3 size={24} />,
        title: "Dashboard Visão Geral",
        description: "Saiba instantaneamente o total recebido e o que está pendente no mês."
    },
    {
        icon: <CreditCard size={24} />,
        title: "Pagamentos Avançados",
        description: "Registo de pagamentos parciais e históricos anuais."
    },
    {
        icon: <TrendingUp size={24} />,
        title: "Relatórios Financeiros",
        description: "Exportação para PDF/Excel para facilitar o seu IRS."
    },
    {
        icon: <Hammer size={24} />,
        title: "Gestão de Manutenção",
        description: "Registe reparações, custos e mantenha um histórico por imóvel."
    },
    {
        icon: <ShieldCheck size={24} />,
        title: "Contratos Inteligentes",
        description: "Alertas avançados de término e sugestões de atualização de renda."
    }
];

export default function Features() {
    return (
        <section id="features" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.label}>Funcionalidades</span>
                    <h2 className={styles.title}>Tudo o que precisa para gerir</h2>
                    <p className={styles.subtitle}>
                        Ferramentas poderosas para simplificar o seu dia a dia: imóveis, inquilinos, rendas, documentos, manutenção e lembretes.
                    </p>
                </div>

                <p className={styles.gridLabel}>Ferramentas incluídas</p>
                <div className={styles.grid}>
                    {allFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDesc}>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
