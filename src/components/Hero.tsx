'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>

                {/* Centered Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={styles.tag}>
                        <span className={styles.tagDot} />
                        Gestão simplificada
                    </span>
                </motion.div>

                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    A forma mais inteligente de <br />
                    <span className={styles.gradientText}>gerir os seus imóveis</span>
                </motion.h1>

                <motion.p
                    className={styles.description}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Centralize inquilinos, pagamentos e contratos num só lugar.
                    Nunca mais perca uma data importante e mantenha tudo sob controlo.
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="#" className={styles.primaryBtn}>
                        Começar Grátis
                        <ArrowRight size={20} />
                    </Link>
                    <Link href="#features" className={styles.secondaryBtn}>
                        Ver Funcionalidades
                    </Link>
                </motion.div>

                <motion.div
                    className={styles.benefits}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
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

                {/* Dashboard Preview Section (Bottom) */}
                <motion.div
                    className={styles.previewSection}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <div className={styles.browserWindow}>
                        <div className={styles.browserHeader}>
                            <div className={styles.dots}>
                                <div className={styles.dot} style={{ background: '#EF4444' }}></div>
                                <div className={styles.dot} style={{ background: '#F59E0B' }}></div>
                                <div className={styles.dot} style={{ background: '#10B981' }}></div>
                            </div>
                            <div className={styles.addressBar}>rentcare.pt</div>
                        </div>
                        <div className={styles.browserContent}>
                            <div className={styles.placeholderState}>
                                <p>Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
