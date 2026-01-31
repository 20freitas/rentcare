'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './AppPagesSection.module.css';

export default function AppPagesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.twoColumn}>
          {/* Premium iPhone Mockup - Left side */}
          <motion.div
            className={styles.phoneWrapper}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.phoneFrame}>
              {/* Side buttons */}
              <div className={styles.silencer}></div>
              <div className={styles.volumeUp}></div>
              <div className={styles.volumeDown}></div>
              <div className={styles.buttonOn}></div>

              {/* Screen */}
              <div className={styles.phoneScreen}>
                <Image
                  src="/telemovelapp.jpg"
                  alt="RentCare App"
                  fill
                  className={styles.phoneImage}
                />
              </div>

              {/* Home indicator */}
              <div className={styles.homeIndicator}></div>
            </div>
          </motion.div>

          {/* Text content - Right side */}
          <motion.div
            className={styles.textContent}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.comingSoonBadge}>Em Breve</span>
            <h2 className={styles.appTitle}>
              A App RentCare está a chegar
            </h2>
            <p className={styles.appDescription}>
              Em breve terás acesso a uma aplicação nativa completa para iOS e Android.
              Gere os teus imóveis, inquilinos e rendas diretamente do telemóvel,
              com notificações push e uma experiência ainda mais rápida.
            </p>
            <div className={styles.storeButtons}>
              <div className={styles.storeButton}>
                <div className={styles.storeIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                <div className={styles.storeText}>
                  <span className={styles.storeSmall}>Disponível na</span>
                  <span className={styles.storeName}>App Store</span>
                </div>
              </div>
              <div className={styles.storeButton}>
                <div className={styles.storeIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.001l-2.302 2.302-8.634-8.645z" />
                  </svg>
                </div>
                <div className={styles.storeText}>
                  <span className={styles.storeSmall}>Disponível no</span>
                  <span className={styles.storeName}>Google Play</span>
                </div>
              </div>
            </div>
            <p className={styles.notifyText}>
              Fica atento às novidades!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
