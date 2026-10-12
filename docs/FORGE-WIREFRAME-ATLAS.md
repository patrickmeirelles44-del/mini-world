# FORGE — Atlas de wireframes e mapa de implementação

**Status:** especificação de wireframes, não implementação.  
**Branch:** `forge-redesign`  
**Regra:** nenhum redesenho funcional amplo antes de revisar e aprovar este atlas.

Este atlas converte o inventário em layouts repetíveis. O design final deve desenhar cada tela/estado identificado, mas os padrões abaixo evitam 100 layouts inconsistentes.

## 1. Estrutura base da aplicação

### Desktop (>= 1200px)
```text
┌──────────────────────────────────────────────────────────────────────┐
│ FORGE        Busca global                 Criar   Notificações  Perfil│
├───────────────┬──────────────────────────────────┬───────────────────┤
│ Feed          │ Título / contexto / ações        │ Painel contextual │
│ Descobrir     │                                  │ sugestões /       │
│ Arena         │ Conteúdo da tela                 │ atividade /       │
│ Comunidades   │                                  │ informações       │
│ Mensagens     │                                  │                   │
│               │                                  │                   │
│ Meu perfil    │                                  │                   │
│ Configurações │                                  │                   │
└───────────────┴──────────────────────────────────┴───────────────────┘
```
Sidebar sugerida: 224–248px; conteúdo com largura máxima legível; painel direito opcional. Não forçar três colunas em páginas de chat ou formulários.

### Tablet (768–1199px)
```text
┌──────────────────────────────────────────────────────────────┐
│ FORGE     Busca                     Notificações      Perfil │
├─────────┬────────────────────────────────────────────────────┤
│ ícones  │ Conteúdo principal                                  │
│ + labels│ Painéis secundários abaixo ou recolhidos            │
└─────────┴────────────────────────────────────────────────────┘
```
Sidebar recolhível; cartões reorganizados em duas colunas; filtros em drawer; tabelas com colunas prioritárias.

### Mobile (< 768px)
```text
┌─────────────────────────────┐
│ FORGE       Busca   Alertas │
├─────────────────────────────┤
│ Título / ações               │
│ Conteúdo em uma coluna       │
│ Cartões em largura integral  │
│ Filtros em bottom sheet      │
├─────────────────────────────┤
│ Feed Descobrir Arena Grupos  │
│ Perfil                       │
└─────────────────────────────┘
```
Bottom navigation com ícone e rótulo; safe areas; botões e alvos táteis adequados; formulários em uma coluna; chat usa tela inteira no celular. Não depender de hover.

## 2. Modelos de tela

### Modelo A — Feed / conteúdo social
**IDs:** 17–28, 50–51, 23–26.
- Topo: título da seção, alternância relevante (Seguindo/Recomendado) e botão de criar.
- Coluna principal: compositor (se autorizado), cartões de publicação e comentários.
- Painel lateral desktop: sugestões, comunidades e insígnias; ocultar/reordenar em mobile.
- Cartão de post: autor, estado de confiança quando aplicável, data, conteúdo, mídia, ações e comentários.
- Estados desenhados: novo usuário, feed vazio, carregamento, falha, conteúdo removido, denúncia em análise.

### Modelo B — Perfil competitivo
**IDs:** 70–80, 40–42, 44–46.
- Capa/hero com identidade de jogador, avatar, username, localização opcional e CTA contextual.
- Status de confiança em linha separada: identidade, conta vinculada e estatísticas oficiais.
- Tabs: Visão geral, Jogos, Estatísticas, Conquistas, Publicações.
- Desktop: painel de métricas secundário; mobile: métricas em cartões roláveis sem overflow de página.
- Ranks sempre com origem e data de atualização; placeholder explícito se sem dados oficiais.
- Meu perfil inclui Editar, Privacidade e prévia pública.

### Modelo C — Descoberta e diretório
**IDs:** 29–36, 49, 33.
- Cabeçalho com busca e descrição curta.
- Filtros em linha no desktop, drawer no mobile; chips mostram filtros ativos e ação “limpar”.
- Resultados em cards de jogador/comunidade com informação essencial e CTA.
- Nunca mostrar região precisa ou status de presença se a pessoa restringiu essa informação.
- Estados: sem resultados, filtro inválido, carregando e erro de consulta.

### Modelo D — Arena / leaderboard
**IDs:** 37–43, 47–48.
- Cabeçalho com jogo/competição, região e temporada.
- Barra de filtros e data da atualização.
- Tabela desktop; cards ordenados no mobile com posição, nome, rank e métrica principal.
- Mostrar fonte dos dados, definição da métrica e indicação de dados demonstrativos.
- Sem dados de API oficial: não inventar posição nem rank real; mostrar estado de integração indisponível/demo.

### Modelo E — Comunidades e eventos
**IDs:** 49–60.
- Explorar: busca, categorias e cards.
- Página interna: capa genérica autorizada, nome, descrição, regras, membros e CTA de entrada.
- Tabs: Feed, Membros, Eventos, Sobre; administração apenas para moderadores autorizados.
- Formulário de criação/edição em etapas curtas, com preview.
- Estados: privada, convite necessário, banido, removida, solicitação pendente.

### Modelo F — Mensagens
**IDs:** 61–69.
- Desktop: lista de conversas à esquerda, conversa ativa à direita; busca e solicitações.
- Mobile: lista e conversa em rotas/telas separadas, botão voltar evidente.
- Composer fixo acima do teclado, limite e validação de mensagem, status de envio e erro.
- Solicitações de desconhecidos separadas da caixa principal; bloqueio/denúncia acessível.
- Não desenhar “online”, “lido” ou criptografia como verdade se a arquitetura não suporta esses estados.

### Modelo G — Autenticação e confiança
**IDs:** 2–16.
- Layout focado, sem feed/sidebar social.
- Uma tarefa principal por tela, progresso em etapas, texto claro sobre por que o dado é solicitado.
- Aviso de elegibilidade 18+ antes de qualquer fluxo de identidade.
- Estados separados: pendente, em análise, rejeitado, revisão manual, aprovado e expirado.
- Prova de vida/documento não serão simulados como verificação real. O protótipo utiliza dados sintéticos e banners de demonstração.
- Nunca armazenar documento/selfie real em um fluxo de protótipo.

### Modelo H — Configurações e direitos
**IDs:** 85–98.
- Desktop: menu interno de configurações à esquerda; painel do formulário à direita.
- Mobile: índice de categorias e detalhe por tela.
- Ações destrutivas exigem confirmação com consequências explícitas; exclusão/exportação mostra status do pedido.
- Permissões de privacidade em linguagem comum, com prévia de como o perfil aparece para terceiros.

### Modelo I — Administração e moderação
**IDs:** 99–107.
- Área visualmente distinta com banner de acesso restrito.
- Fila com prioridade, tipo, data e status; detalhe com contexto mínimo necessário.
- Ações com confirmação e justificativa obrigatória; apelação e trilha de auditoria.
- Não expor documento, selfie, biometria, token, chave de API ou dados desnecessários.
- O protótipo não dá poderes administrativos reais nem modifica registros de produção.

### Modelo J — Landing e ajuda
**IDs:** 1, 93–95.
- Landing: proposta de valor, exemplos de telas com conteúdo fictício, explicação do modelo de confiança e CTA de cadastro.
- Não prometer “verificado” nem integração ativa antes de existir.
- Ajuda/legal: índice, busca opcional, texto legível e navegação de retorno.

## 3. Navegação e rotas propostas

As rotas são sugestões de arquitetura; não adicionar tudo ao router automaticamente antes da revisão.

| Área | Rota proposta |
|---|---|
| Landing | `/` |
| Login / cadastro | `/login`, `/signup`, `/recover` |
| Confiança | `/onboarding/age`, `/onboarding/identity`, `/onboarding/game`, `/trust/status` |
| Feed | `/feed`, `/posts/:postId`, `/saved` |
| Descobrir | `/discover`, `/players/:username`, `/games/:slug` |
| Arena | `/arena`, `/arena/:game`, `/arena/:game/season/:season` |
| Comunidades | `/communities`, `/communities/:slug`, `/communities/:slug/events` |
| Mensagens | `/messages`, `/messages/:conversationId`, `/message-requests` |
| Perfil | `/profile/:username`, `/settings/profile` |
| Notificações | `/notifications` |
| Configurações | `/settings`, `/settings/privacy`, `/settings/security`, `/settings/data` |
| Ajuda/legal | `/help`, `/terms`, `/privacy-policy` |
| Administração | `/admin/reports`, `/admin/reviews`, `/admin/audit` |

As rotas privadas precisam de validação no servidor, não apenas ocultar links na interface. A tela de acesso negado é parte do design.

## 4. Leitura do código existente (branch forge-redesign)

A inspeção inicial indica que o protótipo atual concentra Feed, Descobrir, Comunidades, Mensagens, Perfil e componentes de Templo em `src/components/GamerNetwork.tsx`, com estilos extensos em `src/styles.css`. O router gerado lista atualmente `/` e `/temple-test`.

Implicações:
- Não reescrever o componente gigante de uma vez; primeiro decompor responsabilidades com testes e limites claros.
- Separar shell/navegação, páginas, componentes compartilhados, dados de demonstração e adaptadores de dados.
- Tratar o Templo atual como uma peça do perfil, não como linguagem visual dominante. A assinatura global passa a ser esports competitivo.
- Revisar Supabase schema/RLS e os acessos atuais antes de considerar qualquer integração existente segura.
- Preservar componentes atuais até que as telas substitutas estejam revisadas; mudanças isoladas somente na branch de trabalho.

Estrutura candidata:
```text
src/
  components/
    app-shell/
    navigation/
    ui/
    players/
    posts/
    games/
    trust/
  features/
    auth/
    feed/
    discover/
    arena/
    communities/
    messages/
    profile/
    notifications/
    settings/
    moderation/
  lib/
    supabase/
    repositories/
    demo-data/
  routes/
    ...
```
É uma estrutura-alvo, não instrução para criar todas as pastas imediatamente.

## 5. Checklist para cada wireframe

Cada ID de tela precisa de:
- versão mobile, tablet e desktop;
- objetivo da tela e ação principal;
- origem/destino de cada CTA;
- estados carregando, vazio, erro, sucesso, sem permissão e sessão expirada quando aplicável;
- rótulo para dado demo;
- navegação por teclado, foco visível, contraste e redução de movimento;
- dados que a tela lê e permissões necessárias;
- regra de acesso e tratamento de erro;
- decisão: lançamento inicial, fase futura ou bloqueada por integração.

## 6. Próxima ordem de execução

1. Desenhar o shell e os 10 modelos acima em baixa fidelidade.
2. Instanciar os wireframes de todos os IDs do inventário, inclusive estados alternativos.
3. Fazer revisão desktop/mobile e consistência visual.
4. Converter para UI de alta fidelidade esports e aprovar.
5. Só então alterar os componentes funcionais, em lotes pequenos, na branch `forge-redesign`.

**Nenhum merge para `main` sem aprovação explícita.**
