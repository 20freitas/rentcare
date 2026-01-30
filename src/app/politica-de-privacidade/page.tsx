import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../termos/Legal.module.css';

export const metadata: Metadata = {
  title: 'Política de Privacidade | RentCare',
  description: 'Política de privacidade e proteção de dados da RentCare.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className={styles.wrapper}>
      <article className={styles.article}>
        <Link href="/" className={styles.back}>← Voltar ao início</Link>
        <h1 className={styles.title}>Política de Privacidade</h1>
        <p className={styles.updated}>Última atualização: janeiro de 2026</p>

        <section className={styles.section}>
          <h2>1. Responsável pelo tratamento</h2>
          <p>
            A RentCare é a entidade responsável pelo tratamento dos dados pessoais dos utilizadores da plataforma, no sentido do Regulamento Geral de Proteção de Dados (RGPD) e da lei portuguesa de proteção de dados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Dados que recolhemos</h2>
          <p>
            Recolhemos os dados que o utilizador nos fornece ao criar conta e ao utilizar o serviço, nomeadamente: nome, endereço de email, foto de perfil (quando utiliza login social, ex. Google) e dados que introduz na aplicação, como informações sobre imóveis, inquilinos, contratos e documentos. Também podemos recolher dados técnicos, como endereço IP e tipo de browser, para fins de segurança e funcionamento do serviço.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Finalidades do tratamento</h2>
          <p>
            Os dados são utilizados para: (i) criar e gerir a sua conta; (ii) prestar as funcionalidades da plataforma (gestão de imóveis, inquilinos, documentos, notificações); (iii) comunicar consigo sobre o serviço ou alterações relevantes; (iv) melhorar a segurança e a experiência de utilização; (v) cumprir obrigações legais.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Base legal</h2>
          <p>
            O tratamento assenta na execução do contrato (prestação do serviço), no seu consentimento (quando aplicável, ex. marketing) e, quando necessário, no legítimo interesse da RentCare (segurança, melhoria do serviço) ou no cumprimento de obrigações legais.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Partilha de dados</h2>
          <p>
            Os seus dados podem ser processados por prestadores de serviços que nos apoiam na infraestrutura e na operação da plataforma (por exemplo, alojamento e autenticação), sob obrigações de confidencialidade e apenas para as finalidades indicadas. Não vendemos os seus dados pessoais a terceiros. Podemos divulgar dados quando exigido por lei ou para defender direitos legítimos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Conservação</h2>
          <p>
            Conservamos os dados enquanto a sua conta estiver ativa e, após o encerramento, durante o período necessário para cumprir obrigações legais, resolver litígios e fazer cumprir os nossos acordos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Os seus direitos</h2>
          <p>
            Nos termos do RGPD, pode exercer os direitos de acesso, retificação, apagamento, limitação do tratamento, portabilidade e oposição. Pode também apresentar reclamação junto da autoridade de controlo (em Portugal, a CNPD). Para exercer estes direitos, contacte-nos através dos meios indicados na aplicação ou no site.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Segurança</h2>
          <p>
            Aplicamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado, perda ou alteração. A comunicação com a plataforma é cifrada (HTTPS). A autenticação pode ser feita por email/password ou através de fornecedores de identidade (ex. Google), em conformidade com as suas políticas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Alterações</h2>
          <p>
            Podemos atualizar esta Política de Privacidade. Alterações relevantes serão comunicadas através da plataforma ou por email. A utilização continuada do serviço após a publicação das alterações constitui aceitação da política atualizada.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contacto</h2>
          <p>
            Para questões sobre privacidade ou exercício de direitos, contacte-nos através dos meios indicados na aplicação ou no site da RentCare.
          </p>
        </section>
      </article>
    </div>
  );
}
