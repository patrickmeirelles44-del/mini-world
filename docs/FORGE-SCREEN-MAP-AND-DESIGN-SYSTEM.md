# FORGE — Mapa completo de telas e sistema visual

**Status:** planejamento e especificação; não representa telas implementadas nem integrações ativas.  
**Branch de trabalho:** `forge-redesign`  
**Princípios aprovados:** todas as telas desenhadas antes da implementação; assinatura visual esports competitivo; responsiva desde o início; desenvolvimento sem serviços pagos; `main` preservada.

## 1. Produto em uma frase

FORGE é uma rede social competitiva para jogadores adultos, centrada em identidade gamer, descoberta de jogadores, comunidades e reputação verificável — sem fingir que verificações ou estatísticas estão confirmadas quando ainda são demonstração.

## 2. Direção de design

### Personalidade
- Esports competitivo, preciso, tático e premium; evitar estética infantil, excesso de neon e aparência de painel administrativo genérico.
- Fundo carvão quase preto, superfícies grafite, texto de alto contraste e um acento elétrico consistente (violeta/azul). Cores semânticas separadas para sucesso, atenção e erro.
- Tipografia de interface condensada/forte para títulos e sans-serif legível para conteúdo; números de rank/estatísticas com alinhamento tabular.
- Bordas finas, divisores, grids e brilho apenas em foco, seleção ou informação de destaque.
- Movimento curto e funcional; respeitar `prefers-reduced-motion`. Nenhuma animação pode bloquear leitura ou navegação.
- Elementos de jogo, marcas e artes de terceiros só com uso autorizado ou substitutos genéricos. Não copiar logotipos, ícones ou identidade visual de jogos.

### Tokens iniciais
- `--forge-bg: #0A0C10`
- `--forge-surface: #12161D`
- `--forge-elevated: #191F29`
- `--forge-border: #2A3340`
- `--forge-text: #F3F6FA`
- `--forge-muted: #98A4B5`
- `--forge-accent: #7567FF`
- `--forge-accent-2: #35C8FF`
- `--forge-success: #36C98F`
- `--forge-warning: #F4B860`
- `--forge-danger: #FF647C`

Os tokens são uma proposta inicial para validar no protótipo, não uma obrigação irrevogável. Não usar cor como único indicador de estado.

### Componentes comuns
Botão primário/secundário/perigo; campo e busca; avatar; cartão de jogador; cartão de jogo; badge; status de verificação; rank; feed post; clip/media card; tabs; filtros; menu contextual; modal/confirm dialog; toast; skeleton; empty state; erro/retry; paginação ou carregamento incremental; breadcrumb no desktop; bottom sheet no mobile.

## 3. Navegação global

### Desktop
Sidebar persistente com: **Feed**, **Descobrir**, **Arena**, **Comunidades**, **Mensagens**. Acesso separado a **Meu perfil/Templo** e **Notificações**. Busca global no topo. Configurações, suporte e sair no menu do usuário. A administração não aparece para contas comuns.

### Mobile
Barra inferior com cinco destinos prioritários: **Feed**, **Descobrir**, **Arena**, **Comunidades**, **Perfil**. Mensagens e notificações ficam no topo; mensagens podem ocupar um dos cinco destinos após teste de usabilidade. Menus secundários em drawer/bottom sheet, alvos de toque confortáveis e sem rolagem horizontal da página.

### Regras
- Cada tela precisa ter estado ativo claro na navegação.
- Deep links devem abrir a tela correspondente ou uma tela de acesso/erro segura.
- Conteúdo privado não deve aparecer em prévias públicas ou notificações para quem não tem autorização.
- Desktop, tablet e mobile compartilham componentes e regras de conteúdo, não layouts rígidos.

## 4. Inventário completo de telas

### A. Entrada, conta e confiança
1. Landing pública / apresentação da FORGE.
2. Criar conta.
3. Login.
4. Recuperar acesso.
5. Confirmação de e-mail e estados de envio/reenvio.
6. Portão de idade: confirmar que tem 18 anos ou mais.
7. Explicação de verificação de identidade e privacidade.
8. Estado de envio de documento — apenas quando houver fornecedor e fluxo aprovados.
9. Estado de prova de vida — apenas quando houver fornecedor e fluxo aprovados.
10. Vincular conta de jogo.
11. Consentimentos, termos e política de privacidade.
12. Onboarding: nome público, região, idiomas, jogos e preferências.
13. Perfil incompleto / verificação pendente.
14. Verificação em análise, recusada, expirada ou que exige revisão.
15. Conta suspensa, acesso revogado e apelação.
16. Sessões e segurança da conta.

### B. Feed
17. Feed principal: seguindo / recomendado.
18. Compositor de publicação.
19. Publicação de texto, imagem, screenshot ou clip.
20. Detalhe da publicação e comentários.
21. Respostas encadeadas.
22. Compartilhar publicação.
23. Salvos.
24. Histórico das próprias publicações.
25. Editar/excluir publicação própria.
26. Denunciar publicação/comentário.
27. Conteúdo oculto, removido ou indisponível.
28. Estados vazios, carregamento, erro e sem conexão.

### C. Descobrir
29. Explorar jogadores.
30. Resultados de busca global.
31. Filtros por jogo, região, idioma, estilo e disponibilidade.
32. Sugestões de jogadores.
33. Criadores e perfis em destaque.
34. Detalhe de jogo (página comunitária genérica, sem marcas não autorizadas).
35. Convites para jogar / encontrar squad.
36. Nenhum resultado e filtros sem correspondência.

### D. Arena e identidade competitiva
37. Hub Arena.
38. Rankings por jogo.
39. Rankings por região/temporada.
40. Detalhe de jogador no ranking.
41. Comparação de perfis/estatísticas, quando houver dados permitidos.
42. Histórico de temporada.
43. Desafios e objetivos.
44. Equipes/squads: visão geral.
45. Criar/editar equipe.
46. Página de equipe, roster e convites.
47. Torneios — fase futura, apenas quando regras e operação estiverem definidas.
48. Estado sem dados oficiais / integração indisponível.

### E. Comunidades
49. Explorar comunidades.
50. Página da comunidade.
51. Feed da comunidade.
52. Lista de membros.
53. Regras e informações.
54. Criar comunidade.
55. Editar comunidade e permissões.
56. Gerenciar solicitações de entrada.
57. Eventos/calendário.
58. Criar/editar evento.
59. Moderação interna da comunidade.
60. Comunidade privada / acesso negado / removida.

### F. Mensagens
61. Caixa de entrada.
62. Conversa direta.
63. Conversa em grupo.
64. Criar grupo.
65. Convites e solicitações de mensagem.
66. Compartilhamento de perfil/publicação.
67. Silenciar, bloquear e denunciar.
68. Estados de mensagem falha, enviada, lida e indisponível.
69. Preferências de privacidade das mensagens.

### G. Perfil / Templo gamer
70. Perfil público do jogador.
71. Meu perfil em modo de edição.
72. Capa, avatar e identidade visual.
73. Jogos vinculados.
74. Estatísticas e ranks com origem e data da última atualização.
75. Insígnias/conquistas e histórico.
76. Publicações, clips e atividade.
77. Seguidores/seguindo ou conexões.
78. Lista de jogos favoritos.
79. Privacidade do perfil e visibilidade por seção.
80. Perfil não encontrado, bloqueado ou indisponível.

### H. Notificações
81. Central de notificações.
82. Preferências por tipo de notificação.
83. Notificação individual e destino relacionado.
84. Estados vazios e falha ao carregar.

### I. Configurações, suporte e direitos
85. Configurações gerais.
86. Perfil e identidade pública.
87. Privacidade e descoberta.
88. Segurança, sessões e dispositivos.
89. Contas de jogo vinculadas.
90. Notificações.
91. Usuários bloqueados.
92. Preferências de conteúdo/acessibilidade.
93. Central de ajuda e contato.
94. Termos de uso.
95. Política de privacidade e tratamento de dados.
96. Solicitar exportação de dados.
97. Solicitar exclusão de conta.
98. Confirmação de exclusão e período/estado do pedido.

### J. Administração e moderação (somente equipe autorizada)
99. Visão geral operacional.
100. Fila de denúncias.
101. Detalhe de denúncia e contexto autorizado.
102. Ações de moderação e justificativa.
103. Revisão de apelações.
104. Gestão de suspensões e bloqueios.
105. Gestão de comunidades denunciadas.
106. Trilha de auditoria.
107. Estado de integração e falhas operacionais sem exposição de segredos.

**Nota de escopo:** o inventário descreve todas as telas previstas, mas não exige que todas sejam funcionais no primeiro lançamento. Cada tela será prototipada antes de escolher o que implementar. Fases como torneios, equipes avançadas, chat em tempo real e verificação de identidade ficam bloqueadas até haver desenho, revisão de segurança e caminho técnico viável.

## 5. Matriz de estados obrigatórios

Toda tela relevante deve considerar:
- carregando;
- conteúdo disponível;
- vazio / primeira utilização;
- erro com tentativa de novo;
- sem conexão ou indisponibilidade temporária, quando aplicável;
- sem permissão;
- sessão expirada;
- conteúdo removido ou indisponível;
- sucesso / confirmação;
- estado de demonstração, claramente identificado.

Não simular confirmação real de identidade, idade, prova de vida, rank, conta vinculada ou denúncia processada. Dados de demonstração devem exibir rótulo visível como **DEMO — não verificado**.

## 6. Modelo de confiança e acesso

Separar três conceitos:
1. **Identidade e elegibilidade 18+** — verificação de pessoa/idade feita por processo confiável.
2. **Conta de jogo vinculada** — prova de controle/autorização da conta através de integração oficial.
3. **Rank/estatísticas** — dados fornecidos pela API autorizada, com fonte e data de atualização.

Status não podem ser definidos pelo cliente. Estados previstos: `pending_age`, `pending_identity`, `pending_liveness`, `pending_game_link`, `active`, `rejected`, `review_required`, `suspended`, `revoked`.

Enquanto não houver integração aprovada, a UI usa protótipo/demonstração e não coleta documentos ou selfies reais. Não guardar imagens de documento ou biometria no banco comum por conveniência; qualquer fluxo futuro exige fornecedor apropriado, revisão de LGPD, retenção mínima, controles de acesso e política clara. Nunca pedir a senha de conta de jogo.

## 7. Arquitetura técnica proposta

- **Frontend:** React + TypeScript + TanStack Start/Router + Vite, seguindo a estrutura que já existe no repositório.
- **UI:** componentes reutilizáveis; CSS/tokens centrais; ícones de biblioteca já instalada; layouts responsivos com breakpoints e estados acessíveis.
- **Dados:** camada de serviços/repositorios separada dos componentes visuais. Fixtures tipadas para protótipo, com sinalização explícita de dados fictícios.
- **Supabase:** somente após revisar schema atual. Auth, Postgres e Storage se forem necessários; RLS por padrão restritiva; autorização no servidor; migrations versionadas. Não apagar nem recriar tabelas como parte do redesign.
- **Integrações de jogos:** adaptadores server-side, segredos fora do frontend, termos e aprovação do provedor antes de produção. Sem integração oficial ativa, usar estado indisponível ou dados de demonstração rotulados.
- **Qualidade:** testes de componentes/rotas, lint, build, navegação por teclado, contraste, redução de movimento, teste em larguras mobile/tablet/desktop.
- **Segurança:** validação server-side, rate limit onde disponível, proteção contra abuso, logs sem segredos/dados sensíveis, permissões mínimas e revisão de acesso antes de produção.

## 8. Plano de trabalho sem serviços pagos

### Fase 0 — Especificação (agora)
- Fechar mapa de navegação e inventário.
- Definir tokens, componentes e padrões responsivos.
- Definir protótipos das telas com dados fictícios.
- Revisar conflitos com componentes existentes.

### Fase 1 — Protótipo visual de todas as telas
- Produzir mockups navegáveis de todas as telas do inventário.
- Cobrir desktop, tablet e mobile com layouts adaptáveis.
- Validar Feed, Perfil, Descobrir, Arena, Comunidades, Mensagens e confiança.
- Não conectar serviços pagos nem coletar dados sensíveis.

### Fase 2 — Revisão e priorização
- Conferir consistência, acessibilidade, fluxos de erro e permissões.
- Marcar cada tela como lançamento inicial, fase posterior ou bloqueada por integração.
- Obter aprovação explícita antes de substituir telas existentes.

### Fase 3 — Implementação incremental
- Implementar shell responsivo e componentes comuns.
- Conectar apenas funcionalidades com requisitos claros.
- Adicionar testes e validar build a cada lote.
- Manter commits na branch `forge-redesign`; não fazer merge em `main` sem aprovação explícita.

### Fase 4 — Integrações reais (não incluída no protótipo gratuito)
- Só depois de comprovar viabilidade, políticas do provedor, custos, segurança e obrigações legais.
- Até lá, nenhuma funcionalidade será apresentada como verificação real.

## 9. Critérios para aprovar o design

- [ ] Todas as telas do inventário possuem layout definido.
- [ ] Desktop, tablet e mobile foram considerados.
- [ ] Navegação principal é consistente e cada tela tem caminho de retorno.
- [ ] Estados vazio, carregando, erro e sem permissão estão desenhados.
- [ ] Dados fictícios estão identificados.
- [ ] Badges distinguem identidade, conta de jogo e rank.
- [ ] Não há logos ou assets de jogos usados sem autorização.
- [ ] A experiência não depende de movimento para comunicar informação.
- [ ] Acesso de moderação é visualmente separado e protegido.
- [ ] Nenhum serviço pago é exigido para revisar o protótipo.
- [ ] A branch `main` permanece intocada.

## 10. Próximo artefato

Após validar este mapa, criar um **atlas visual de telas** (wireframes de baixa fidelidade primeiro; depois acabamento esports), antes de alterar a implementação funcional. O atlas deve ter IDs de tela alinhados com este documento para que nenhuma tela seja esquecida.
