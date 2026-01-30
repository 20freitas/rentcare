'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Mail, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import styles from './Settings.module.css';

interface NotificationSettings {
  email_enabled: boolean;
  notify_5days: boolean;
  notify_1day: boolean;
  notify_overdue?: boolean;
  email?: string | null;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [settings, setSettings] = useState<NotificationSettings>({
    email_enabled: false,
    notify_5days: true,
    notify_1day: true,
    notify_overdue: true,
    email: '',
  });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      const uemail = session?.user?.email || '';
      setUserEmail(uemail);
      if (!uid) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      if (!data) {
        await supabase
          .from('notification_settings')
          .insert({
            user_id: uid,
            email_enabled: false,
            notify_5days: true,
            notify_1day: true,
            notify_overdue: true,
            email: null,
          });
        setSettings({
          email_enabled: false,
          notify_5days: true,
          notify_1day: true,
          notify_overdue: true,
          email: '',
        });
        setEmailInput('');
      } else {
        const emailVal = (data.email as string) || '';
        setSettings({
          email_enabled: !!data.email_enabled,
          notify_5days: !!data.notify_5days,
          notify_1day: !!data.notify_1day,
          notify_overdue: data.notify_overdue !== false,
          email: emailVal,
        });
        setEmailInput(emailVal);
      }
      setLoading(false);
    };
    init();
  }, []);

  const updateSetting = async (patch: Partial<NotificationSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) return;
    await supabase
      .from('notification_settings')
      .update(patch)
      .eq('user_id', uid);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Definições</h1>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <Bell size={22} />
          </div>
          <div>
            <p className={styles.cardTitle}>Notificações por email</p>
            <p className={styles.cardDescription}>
              Receba alertas de pagamentos, fim de contratos e pagamentos em atraso.
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
            <span>A carregar...</span>
          </div>
        ) : (
          <>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>
                <div className={styles.toggleTitle}>Ativar emails</div>
                <div className={styles.toggleHint}>
                  Enviar para: <strong>{settings.email?.trim() || userEmail || '—'}</strong>
                </div>
              </div>
              <label className={styles.switch} title={settings.email_enabled ? 'Desativar' : 'Ativar'}>
                <input
                  type="checkbox"
                  checked={settings.email_enabled}
                  onChange={(e) => updateSetting({ email_enabled: e.target.checked })}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <div className={styles.emailRow}>
              <label htmlFor="notification-email" className={styles.emailLabel}>
                Email das notificações
              </label>
              <input
                id="notification-email"
                type="email"
                placeholder={userEmail || 'exemplo@email.com'}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onBlur={() => {
                  const v = emailInput.trim() || null;
                  updateSetting({ email: v ?? null });
                  setSettings((s) => ({ ...s, email: v ?? null }));
                }}
                className={styles.emailInput}
                disabled={!settings.email_enabled}
              />
              <p className={styles.emailHint}>
                Deixe em branco para usar o email da sua conta ({userEmail || '—'}).
              </p>
            </div>

            <div
              className={styles.optionsGrid}
              style={{ opacity: settings.email_enabled ? 1 : 0.6 }}
            >
              <div
                className={clsx(
                  styles.optionCard,
                  settings.notify_5days && styles.optionCardActive
                )}
              >
                <div className={styles.optionCardHeader}>
                  <Clock size={18} className={styles.optionCardIcon} />
                  <span className={styles.optionCardTitle}>Aviso 5 dias antes</span>
                </div>
                <p className={styles.optionCardDescription}>
                  Receber um email 5 dias antes da data de pagamento ou fim de contrato.
                </p>
                <div className={styles.optionCardToggle}>
                  <span>{settings.notify_5days ? 'Ativo' : 'Inativo'}</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      disabled={!settings.email_enabled}
                      checked={settings.notify_5days}
                      onChange={(e) => updateSetting({ notify_5days: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>

              <div
                className={clsx(
                  styles.optionCard,
                  settings.notify_1day && styles.optionCardActive
                )}
              >
                <div className={styles.optionCardHeader}>
                  <Mail size={18} className={styles.optionCardIcon} />
                  <span className={styles.optionCardTitle}>Aviso 1 dia antes</span>
                </div>
                <p className={styles.optionCardDescription}>
                  Receber um email 1 dia antes da data.
                </p>
                <div className={styles.optionCardToggle}>
                  <span>{settings.notify_1day ? 'Ativo' : 'Inativo'}</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      disabled={!settings.email_enabled}
                      checked={settings.notify_1day}
                      onChange={(e) => updateSetting({ notify_1day: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>

              <div
                className={clsx(
                  styles.optionCard,
                  settings.notify_overdue !== false && styles.optionCardActive
                )}
              >
                <div className={styles.optionCardHeader}>
                  <AlertCircle size={18} className={styles.optionCardIcon} />
                  <span className={styles.optionCardTitle}>Pagamento em atraso</span>
                </div>
                <p className={styles.optionCardDescription}>
                  Avisar quando o prazo de pagamento já tiver sido ultrapassado.
                </p>
                <div className={styles.optionCardToggle}>
                  <span>{settings.notify_overdue !== false ? 'Ativo' : 'Inativo'}</span>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      disabled={!settings.email_enabled}
                      checked={settings.notify_overdue !== false}
                      onChange={(e) => updateSetting({ notify_overdue: e.target.checked })}
                    />
                    <span className={styles.slider} />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
