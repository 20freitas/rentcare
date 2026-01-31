'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Share, Plus } from 'lucide-react';
import styles from './IOSInstallPrompt.module.css';

/**
 * IOSInstallPrompt Component
 * 
 * Shows a bottom sheet popup for iPhone Safari users explaining how to
 * add the app to their home screen. Only shows if:
 * - User is on iPhone
 * - Using Safari browser
 * - App is not already running in standalone mode
 * - User has not previously dismissed the popup
 */
export default function IOSInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Run detection after a small delay to ensure the page is loaded
        const timer = setTimeout(() => {
            if (shouldShowPrompt()) {
                setShowPrompt(true);
            }
        }, 5000); // Show after 5 seconds as requested

        return () => clearTimeout(timer);
    }, []);

    /**
     * Checks if we should show the install prompt
     * Returns true only if:
     * 1. Running on iPhone
     * 2. Using Safari (not Chrome or other browsers)
     * 3. Not already in standalone mode (already installed)
     * 4. User hasn't dismissed the popup before
     */
    const shouldShowPrompt = (): boolean => {
        // Only run on client
        if (typeof window === 'undefined') return false;

        const ua = window.navigator.userAgent;

        // Check if running on iPhone
        const isIPhone = /iPhone/.test(ua);
        if (!isIPhone) return false;

        // Check if running in standalone mode (already installed)
        // @ts-ignore - standalone is a Safari-specific property
        const isStandalone = window.navigator.standalone === true;
        if (isStandalone) return false;

        // Check if using Safari (not Chrome, Firefox, etc. on iOS)
        // Safari on iOS doesn't have 'CriOS' (Chrome), 'FxiOS' (Firefox), etc.
        const isSafari = !(/CriOS|FxiOS|OPiOS|mercury/.test(ua));
        if (!isSafari) return false;

        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('ios-install-dismissed');
        if (dismissed === 'true') return false;

        return true;
    };

    /**
     * Handle user dismissing the prompt
     * Saves preference to localStorage so it won't show again
     */
    const handleDismiss = () => {
        localStorage.setItem('ios-install-dismissed', 'true');
        setShowPrompt(false);
    };

    // Don't render anything if prompt shouldn't be shown
    if (!showPrompt) return null;

    return (
        <div className={styles.overlay} onClick={handleDismiss}>
            <div
                className={styles.prompt}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    className={styles.closeButton}
                    onClick={handleDismiss}
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* App icon and title */}
                <div className={styles.header}>
                    <div className={styles.appIcon}>
                        <Image
                            src="/logo.png"
                            alt="RentCare"
                            width={48}
                            height={48}
                        />
                    </div>
                    <h3 className={styles.title}>Instalar RentCare no seu iPhone</h3>
                </div>

                {/* Instructions */}
                <div className={styles.steps}>
                    {/* Step 1 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepContent}>
                            <div className={styles.stepIcon}>
                                <Share size={18} />
                            </div>
                            <p>Toque no botão <strong>Partilhar</strong> (ícone quadrado com seta para cima)</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                            <div className={styles.stepIcon}>
                                <Plus size={18} />
                            </div>
                            <p>Escolha <strong>&quot;Adicionar ao Ecrã Principal&quot;</strong></p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                            <div className={styles.stepIconCheck}>✓</div>
                            <p>Confirme para instalar como app</p>
                        </div>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    className={styles.dismissButton}
                    onClick={handleDismiss}
                >
                    Agora não
                </button>
            </div>
        </div>
    );
}
