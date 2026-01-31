'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './CallToAction.module.css';

const benefits = [
    'Gestão completa de imóveis e inquilinos',
    'Lembretes automáticos de pagamentos',
    'Dashboard com visão geral financeira',
    'Acesso em qualquer dispositivo',
];

export default function CallToAction() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>
                        Pronto para simplificar a gestão dos seus imóveis?
                    </h2>
                    <p className={styles.subtitle}>
                        Comece hoje a organizar os seus imóveis, inquilinos e rendas.
                        Crie a sua conta gratuitamente em menos de 2 minutos.
                    </p>

                    <ul className={styles.benefitsList}>
                        {benefits.map((benefit, index) => (
                            <motion.li
                                key={index}
                                className={styles.benefitItem}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                <span>{benefit}</span>
                            </motion.li>
                        ))}
                    </ul>

                    <div className={styles.actions}>
                        <Link href="/register" className={styles.primaryBtn}>
                            Criar Conta Grátis
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/login" className={styles.secondaryBtn}>
                            Já tenho conta
                        </Link>
                    </div>

                    <p className={styles.note}>
                        Sem cartão de crédito. Cancele quando quiser.
                    </p>
                </motion.div>
            </div>

            {/* Background decoration */}
            <div className={styles.bgDecoration} />
        </section>
    );
}
