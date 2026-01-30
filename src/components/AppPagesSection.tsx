'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Home,
  Users,
  FileText,
  Wrench,
  Calendar,
  Settings,
} from 'lucide-react';
import styles from './AppPagesSection.module.css';

const pages = [
  {
    icon: <LayoutDashboard size={22} />,
    title: 'Dashboard',
    description: 'Resumo com rendimento mensal, número de imóveis e inquilinos, próximos pagamentos e alertas.',
  },
  {
    icon: <Home size={22} />,
    title: 'Imóveis',
    description: 'Lista de imóveis com morada, renda, dia de pagamento, inquilino e estado (pago / em atraso).',
  },
  {
    icon: <Users size={22} />,
    title: 'Inquilinos',
    description: 'Ficha de cada inquilino: contacto, NIF, imóvel associado e valor da renda.',
  },
  {
    icon: <FileText size={22} />,
    title: 'Documentos',
    description: 'Contratos, recibos e outros documentos por imóvel. Upload e organização simples.',
  },
  {
    icon: <Wrench size={22} />,
    title: 'Manutenção',
    description: 'Registo de avarias, custos e estado. Histórico de reparações por imóvel.',
  },
  {
    icon: <Calendar size={22} />,
    title: 'Lembretes / Datas',
    description: 'Calendário e avisos de pagamentos, fins de contrato e datas importantes.',
  },
  {
    icon: <Settings size={22} />,
    title: 'Definições',
    description: 'Notificações por email: avisos 5 dias e 1 dia antes, pagamentos em atraso.',
  },
];

export default function AppPagesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.label}>Páginas da aplicação</span>
          <h2 className={styles.title}>Tudo numa só aplicação</h2>
          <p className={styles.subtitle}>
            Dashboard, imóveis, inquilinos, documentos, manutenção e lembretes. Acesso no browser ou no telemóvel.
          </p>
        </motion.div>

        <motion.div
          className={styles.list}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {pages.map((page, index) => (
            <div key={page.title} className={styles.row}>
              <div className={styles.iconWrap}>{page.icon}</div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{page.title}</h3>
                <p className={styles.cardDesc}>{page.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
