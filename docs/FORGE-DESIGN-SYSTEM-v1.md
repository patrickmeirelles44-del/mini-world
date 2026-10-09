# FORGE Design System v1.0

Status: identidade visual oficial aprovada e fixa.

## Marca
- Símbolo: letra F geométrica integrada a um escudo.
- Arquivo: public/forge-mark.svg.
- Uso: marca principal no menu desktop e no cabeçalho mobile. Não substituir por ícone genérico.

## Cores oficiais
- Fundo profundo: #090711
- Painel: #12101B
- Roxo principal: #8B5CF6
- Violeta profundo: #6D28D9
- Lilás de destaque: #C4B5FD
- Ciano de acento: #22D3EE (discreto, apenas detalhes e estados especiais)
- Texto: #F5F3FF
- Texto secundário: #A29AAF
- Borda: #302442

## Linguagem visual
- Gamer premium, fantasia tecnológica e templos/portais.
- Profundidade por gradientes, luz volumétrica simulada, contornos luminosos e partículas leves.
- Motion visível, controlado e intencional; respeitar prefers-reduced-motion.
- Não trocar a paleta nem introduzir novos estilos de marca sem uma nova versão formal do sistema.

## Componentes
- Botões principais: gradiente violeta.
- Seleção de navegação: fundo violeta translúcido e indicador violeta.
- Cartões/templo: fundo escuro, borda violeta suave, ciano reservado para microdetalhes.
- Avatar: aro violeta com transição ciano sutil.

## Implementação
- CSS global em src/styles.css.
- Marca em public/forge-mark.svg.
- Ajustes de identidade em src/components/GamerNetwork.tsx.
- Responsividade existente deve ser preservada; mobile sem deslocamento lateral.

## Fora de escopo desta versão
- Não substituir backend/Supabase, rotas, autenticação ou dados.
- Não exigir API paga de geração 3D.
- Não reintroduzir estilos de marca conflitantes.
