import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './Legal.module.css';

export const metadata: Metadata = {
  title: 'Termos e Condições | RentCare',
  description: 'Termos e condições de utilização da plataforma RentCare.',
};

export default function TermosPage() {
  return (
    <div className={styles.wrapper}>
      <article className={styles.article}>
        <Link href="/" className={styles.back}>← Voltar ao início</Link>
        <h1 className={styles.title}>Termos e Condições de Utilização</h1>
        <p className={styles.updated}>Última atualização: janeiro de 2026</p>

        <section className={styles.section}>
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao aceder ou utilizar a plataforma RentCare (&quot;Plataforma&quot;), o utilizador aceita estar vinculado a estes Termos e Condições. Se não concordar com qualquer parte destes termos, não deve utilizar os nossos serviços.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descrição do serviço</h2>
          <p>
            A RentCare é uma aplicação de gestão de imóveis que permite a senhorios e gestores registar imóveis, inquilinos, contratos, documentos e lembretes de pagamento. O serviço é prestado através da aplicação web e está sujeito à disponibilidade e às condições aqui descritas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Registo e conta</h2>
          <p>
            Para utilizar a Plataforma, o utilizador deve criar uma conta, fornecendo informações verdadeiras e atualizadas. O utilizador é responsável por manter a confidencialidade das suas credenciais e por toda a atividade na sua conta. Deve informar-nos imediatamente de qualquer uso não autorizado.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Uso aceitável</h2>
          <p>
            O utilizador compromete-se a utilizar a Plataforma apenas para fins legítimos e de acordo com a lei aplicável. É proibido utilizar o serviço para atividades ilegais, fraudulentas ou que prejudiquem terceiros. A RentCare reserva-se o direito de suspender ou encerrar contas que violem estes termos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Dados e propriedade</h2>
          <p>
            Os dados introduzidos na Plataforma pertencem ao utilizador. A RentCare não reivindica propriedade sobre o conteúdo que o utilizador cria. O utilizador concede à RentCare as licenças necessárias para operar, armazenar e exibir esse conteúdo no âmbito do serviço.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Disponibilidade e alterações</h2>
          <p>
            A RentCare esforça-se por manter o serviço disponível, mas não garante funcionamento ininterrupto. Podemos alterar, suspender ou descontinuar funcionalidades, com aviso prévio quando razoável. Alterações substanciais aos presentes termos serão comunicadas através da Plataforma ou por email.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitação de responsabilidade</h2>
          <p>
            Na medida máxima permitida por lei, a RentCare não será responsável por danos indiretos, incidentais ou consequenciais resultantes do uso ou da impossibilidade de uso da Plataforma. A responsabilidade total não excederá o valor pago pelo utilizador nos últimos 12 meses, quando aplicável.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Rescisão</h2>
          <p>
            O utilizador pode encerrar a sua conta a qualquer momento através das definições da conta. A RentCare pode suspender ou terminar o acesso em caso de violação destes termos ou por razões operacionais, com aviso quando apropriado.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Lei aplicável</h2>
          <p>
            Estes termos são regidos pela lei portuguesa. Qualquer litígio será submetido aos tribunais competentes em Portugal.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contacto</h2>
          <p>
            Para questões sobre estes Termos e Condições, contacte-nos através dos meios indicados na aplicação ou no site da RentCare.
          </p>
        </section>
      </article>
    </div>
  );
}
