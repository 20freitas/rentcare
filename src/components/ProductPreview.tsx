'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ProductPreview.module.css';

export default function ProductPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.label}>Aplicação</span>
          <h2 className={styles.title}>O seu resumo, num relance</h2>
          <p className={styles.subtitle}>
            Dashboard com rendimento mensal, imóveis, inquilinos e próximos pagamentos. Acesso no telemóvel ou no computador.
          </p>
        </motion.div>

        <motion.div
          className={styles.screenshotWrap}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.browserChrome}>
            <div className={styles.browserDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <div className={styles.browserUrl}>rentcare.pt/dashboard</div>
          </div>
          <div className={styles.imageWrap}>
            <Image
              src="/dashboard.png"
              alt="Dashboard RentCare - resumo de imóveis, rendimentos e próximos pagamentos"
              width={1200}
              height={760}
              className={styles.screenshot}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
