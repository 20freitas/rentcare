import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.logo}>
                        Rent<b>Care</b>
                    </div>
                    <div className={styles.links}>
                        <Link href="/termos" className={styles.legalLink}>
                            Termos e Condições
                        </Link>
                        <Link href="/politica-de-privacidade" className={styles.legalLink}>
                            Política de Privacidade
                        </Link>
                        <span className={styles.copyright}>&copy; 2026 RentCare. Todos os direitos reservados.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
