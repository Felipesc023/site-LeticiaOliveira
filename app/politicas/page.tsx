import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Políticas de Privacidade e Termos",
  description:
    "Como o site de Letícia Oliveira Advocacia trata dados de navegação (Google Analytics) e o uso do WhatsApp como canal de contato.",
  robots: { index: true, follow: false },
};

export default function PoliticasPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Reveal>
        <span className="label-caps">Documento legal</span>
        <h1 className="mt-4 font-serif text-4xl text-espresso">
          Política de Privacidade e Termos de Uso
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Última atualização: setembro de 2026.
        </p>
      </Reveal>

      <div className="prose-editorial mt-10 text-ink/85">
        <h2>1. Quem somos</h2>
        <p>
          Este site é mantido por Letícia Oliveira Advocacia, dedicada a leilões
          de imóveis judiciais e extrajudiciais, com atuação nacional e
          exclusivamente digital.
        </p>

        <h2>2. Quais dados tratamos</h2>
        <p>
          O site <strong>não possui formulário de contato</strong> e não coleta
          nome, e-mail ou telefone diretamente. Os únicos dados tratados são:
        </p>
        <ul>
          <li>
            <strong>Dados de navegação</strong>, por meio do Google Analytics
            (páginas visitadas, tempo de permanência, tipo de dispositivo,
            origem do acesso), com IP anonimizado. Esses cookies só são ativados
            após o seu consentimento no aviso exibido na primeira visita.
          </li>
          <li>
            <strong>Dados que você envia voluntariamente pelo WhatsApp</strong>,
            ao iniciar uma conversa. Essa troca ocorre na plataforma do WhatsApp,
            sujeita à política de privacidade da Meta, e é utilizada apenas para
            responder à sua solicitação de triagem ou consultoria.
          </li>
        </ul>

        <h2>3. Base legal e finalidade</h2>
        <p>
          O tratamento de dados de navegação se dá mediante consentimento
          (art. 7º, I, da LGPD), para fins de medição de audiência e melhoria do
          conteúdo. O tratamento de dados enviados por WhatsApp se dá para
          execução de procedimentos preliminares a pedido do titular (art. 7º,
          V, da LGPD).
        </p>

        <h2>4. Compartilhamento</h2>
        <p>
          Não vendemos nem cedemos seus dados. Dados de navegação são
          processados pelo Google como operador. Dados de WhatsApp permanecem na
          infraestrutura da Meta.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Utilizamos apenas cookies de análise (Google Analytics). Você pode
          recusá-los no aviso inicial ou limpar os cookies do navegador a
          qualquer momento sem prejuízo à navegação.
        </p>

        <h2>6. Seus direitos</h2>
        <p>
          Você pode solicitar confirmação de tratamento, acesso, correção,
          anonimização ou eliminação dos seus dados, bem como revogar o
          consentimento, pelo canal de WhatsApp informado no site.
        </p>

        <h2>7. Publicidade e conteúdo</h2>
        <p>
          O conteúdo do blog tem caráter informativo e não constitui consulta
          jurídica. O site não veicula depoimentos de clientes e segue as
          diretrizes de publicidade da advocacia previstas no Provimento da OAB.
        </p>

        <h2>8. Alterações</h2>
        <p>
          Esta política pode ser atualizada. A data no topo indica a versão
          vigente.
        </p>
      </div>
    </div>
  );
}
