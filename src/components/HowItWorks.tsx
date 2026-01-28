'use client';

import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';
import { UserPlus, Home, Smile } from 'lucide-react';

const steps = [
    {
        icon: <Home size={28} />,
        title: "1. Adicione o Imóvel",
        desc: "Registe a morada e os detalhes básicos do seu apartamento ou casa."
    },
    {
        icon: <UserPlus size={28} />,
        title: "2. Associe o Inquilino",
        desc: "Adicione o contrato, valor da renda e data de pagamento."
    },
    {
        icon: <Smile size={28} />,
        title: "3. Tudo Controlado!",
        desc: "Receba alertas automáticos e nunca mais perca um pagamento."
    }
];

export default function HowItWorks() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Simples, como deve ser.</h2>
                    <p className={styles.subtitle}>Comece a organizar a sua carteira de imóveis em menos de 2 minutos.</p>
                </div>

                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.stepWrapper}>
                            <motion.div
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className={styles.iconCircle}>
                                    {step.icon}
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                            </motion.div>
                            {/* Connector Line (except for last item) */}
                            {index < steps.length - 1 && (
                                <div className={styles.connector} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
