'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Check, ShieldCheck, Banknote } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Left: text + CTA */}
        <div className={styles.content}>
          <motion.span
            className={styles.tag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.tagDot} />
            Gestão moderna
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            A forma mais inteligente de{' '}
            <span className={styles.titleHighlight}>gerir os seus imóveis</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
          >
            Tudo o que precisa para gerir as suas rendas num mesmo lugar.
            Centralize inquilinos, pagamentos e contratos e nunca mais perca uma data importante.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/signup" className={styles.primaryBtn}>
              Começar Agora
              <ArrowRight size={20} />
            </Link>
            <Link href="#features" className={styles.secondaryBtn}>
              Ver Funcionalidades
            </Link>
          </motion.div>

          <motion.div
            className={styles.benefits}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
          >
            <div className={styles.benefitItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <span>Gestão de Rendas</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <span>Alertas Automáticos</span>
            </div>
            <div className={styles.benefitItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <span>Contratos Organizados</span>
            </div>
          </motion.div>
        </div>

        {/* Right: illustration + floating icons */}
        <motion.div
          className={styles.illustrationWrap}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className={styles.curveBg} aria-hidden />
          <Image
            src="/hero-illustration.png"
            alt="Gestão de imóveis e rendas - RentCare"
            width={580}
            height={400}
            className={styles.heroImage}
            priority
            sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 580px"
          />
          {/* Floating: checklist */}
          <motion.div
            className={styles.iconChecklist}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className={styles.iconChecklistLines}>
              <div className={styles.iconChecklistLine} />
              <div className={styles.iconChecklistLine} />
              <div className={styles.iconChecklistLine} />
            </div>
            <div className={styles.iconChecklistCircle}>
              <Check size={16} strokeWidth={3} />
            </div>
          </motion.div>
          {/* Floating: payment */}
          <motion.div
            className={styles.iconPayment}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className={styles.iconPaymentLabel}>
              <Banknote size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} />
              Pago
            </div>
            <div className={styles.iconPaymentValue}>
              5 <small>€</small>
            </div>
          </motion.div>
          {/* Floating: shield */}
          <motion.div
            className={styles.iconShield}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <ShieldCheck size={26} strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
