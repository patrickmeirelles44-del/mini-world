# FORGE 2.0 — plano de reconstrução e confiança

## Objetivo
Reconstruir a experiência visual da FORGE em uma branch isolada, preservando `main` sem alterações. O desenvolvimento inicial deve usar apenas a stack já instalada e dados demonstrativos claramente marcados; nenhuma verificação real deve ser simulada como concluída.

## Política de acesso escolhida
- Acesso exclusivo a pessoas com 18 anos ou mais.
- Para liberar a conta: idade/documento verificados por fornecedor adequado, prova de vida facial concluída e pelo menos uma conta de jogo vinculada.
- A conta de jogo vinculada, a identidade humana verificada e o rank oficial são três sinais distintos.
- Não armazenar imagens de documentos, selfies ou templates biométricos no banco da FORGE. Preferir receber do fornecedor apenas resultado, identificador de referência opaco e datas necessárias; confirmar contrato, retenção, segurança e base legal antes de ativar.
- Não prometer proteção absoluta contra bots ou fraude. Usar camadas de prevenção, limites, detecção e revisão.
- Negar acesso às funcionalidades sociais enquanto os requisitos obrigatórios estiverem pendentes/reprovados; oferecer fluxo de correção e contestação.

## Reconstrução visual
### Direção
- Interface dark premium, identidade FORGE, superfícies profundas e contrastes legíveis.
- Roxo e azul elétrico como acentos, brilho contido, tipografia clara e hierarquia consistente.
- O perfil/“Templo Gamer” deve ser a experiência principal: identidade, jogos conectados, ranks comprovados, atividade e reputação.
- Navegação responsiva para celular primeiro; cards consistentes; animações Motion apenas quando ajudam a orientação e não prejudicam acessibilidade/desempenho.
- Estados explícitos: não verificado, em análise, verificado, expirado e ação necessária. Não mostrar selo de verificação em dados de demonstração.
- Preservar componentes e recursos existentes até a nova tela ser testada; refatorar por partes em vez de reescrever tudo de uma vez.

### Sequência de telas
1. **Entrada e elegibilidade 18+** — explicar requisitos, privacidade e etapas antes de coletar dados.
2. **Centro de confiança** — checklist de documento/idade, prova de vida e conta de jogo vinculada; status, data e ação necessária.
3. **Templo/perfil gamer** — avatar, identidade FORGE, jogos, ranks confirmados via API oficial, atividade e personalização.
4. **Feed** — publicações e atividade de contas elegíveis; denúncia, bloqueio e controles de privacidade.
5. **Descobrir/comunidades** — filtros por jogo e rank comprovado, sem aceitar rank enviado livremente pelo usuário.
6. **Mensagens** — só para usuários elegíveis, com bloqueio/denúncia e limites anti-spam.
7. **Admin/moderação** — acesso restrito, trilha de auditoria e fila de denúncias; não expor documentos ou dados biométricos.

## Arquitetura de confiança (alvo)
### Estados de conta
`pending_age` → `pending_identity` → `pending_liveness` → `pending_game_link` → `active`
Estados adicionais: `rejected`, `review_required`, `suspended`, `revoked`.

O estado efetivo deve ser calculado no servidor a partir de verificações persistidas, nunca aceito de um campo editável pelo cliente. A UI apenas apresenta o resultado.

### Separar três conceitos
1. **Identidade humana/idade:** resultado de fornecedor de verificação documental e prova de vida.
2. **Conta de jogo:** vínculo OAuth/fluxo oficial do publisher; nunca solicitar ou armazenar a senha do jogo.
3. **Competição/rank:** consulta server-side à API oficial e registro do jogo/região/ID, rank, temporada e data da última sincronização. Capturas de tela e valores digitados não comprovam rank.

### Riot / League of Legends
- Começar com modo de desenvolvimento e dados fictícios rotulados como demonstração.
- Antes de uso público, registrar o produto e solicitar as chaves/aprovações necessárias à Riot; chaves de desenvolvimento temporárias não são uma solução de produção.
- Quando aprovado, consultar APIs oficiais no servidor e guardar apenas os campos necessários. Não expor chaves no frontend.
- Não afirmar que Riot Sign On ou ranks reais estão ativos até que a aprovação e a integração estejam concluídas.
- Planejar adaptadores por publisher para que cada jogo tenha políticas, escopos e estados próprios.

## Dados e segurança
- Reutilizar Supabase existente somente após auditar esquema, políticas RLS, Auth e secrets. Não apagar tabelas nem dados nesta etapa.
- RLS deny-by-default; usuário só lê/edita os campos próprios que forem permitidos. Operações de confiança e moderação somente por função server-side autorizada.
- Nunca confiar em `is_verified`, rank, idade ou papel enviados pelo cliente.
- Segredos de API somente em secrets server-side/Edge Functions; limitar permissões e rotacionar em caso de exposição.
- Rate limits, proteção contra replay, idempotência nos callbacks, logs sem documentos/selfies, auditoria de alterações de status e alertas para tentativas repetidas.
- Coletar o mínimo de dados, definir prazo de retenção e processo de exclusão/atendimento de titulares. Documento e biometria são dados de alto risco; validar LGPD, contratos e política de privacidade com orientação jurídica antes do lançamento.
- Verificação externa e API de jogo podem gerar custos ou exigir aprovação. Não ativar sem validar preço, termos, segurança e orçamento.

## Plano gratuito por fases
### Fase 0 — agora, sem custo de API
- Trabalhar na branch `forge-redesign`; `main` permanece intacta.
- Criar tokens CSS, componentes de layout e estados visuais.
- Usar perfis e ranks fictícios com selo “DEMONSTRAÇÃO”.
- Escrever testes de UI e de autorização com fixtures locais; não coletar documentos ou selfies reais.
### Fase 1 — estrutura técnica
- Auditar schema/RLS existente e documentar mudanças antes de aplicar migrations.
- Criar modelo de status e adaptadores server-side com fornecedor simulado em testes.
- Criar testes para transições inválidas e acesso negado antes de `active`.
### Fase 2 — integrações reais, somente após aprovação
- Escolher fornecedor de identidade e confirmar preço, LGPD, retenção e tratamento de menores (produto 18+).
- Solicitar aprovação e chaves de produção do publisher; testar com contas autorizadas.
- Revisar segurança e privacidade antes de abrir acesso público.

## Critérios para considerar pronto
- `main` não recebe mudanças desta reconstrução até revisão explícita.
- Nenhum selo, rank ou identidade de demonstração parece real.
- Usuário incompleto/suspenso não consegue acessar feed, mensagens ou APIs protegidas, mesmo chamando endpoints diretamente.
- O cliente não consegue alterar rank, idade ou estado de verificação.
- Nenhum segredo aparece no bundle frontend ou no repositório.
- Mobile, acessibilidade, estados de erro e fluxo de contestação foram testados.
- Documentação e consentimentos estão prontos antes de dados reais serem processados.

## Fontes oficiais a validar durante integração
- Riot Developer Portal: https://developer.riotgames.com/docs/portal
- League of Legends API: https://developer.riotgames.com/docs/lol
- LGPD (Lei 13.709/2018): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

Este documento é um plano de implementação, não uma declaração de que verificações reais estão ativas ou de que a arquitetura já foi auditada.
