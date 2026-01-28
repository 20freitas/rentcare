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
                        <span className={styles.copyright}>&copy; 2026 RentCare. Todos os direitos reservados.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
