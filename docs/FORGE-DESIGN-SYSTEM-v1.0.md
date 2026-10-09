# FORGE — Design System v1.0

**Status:** Identidade visual oficial aprovada.  
**Slogan:** CONECTE. JOGUE. EVOLUA.  
**Conceito:** um templo digital onde gamers se conectam, competem, evoluem e constroem seu legado.

> Esta especificação é a fonte única de verdade visual do produto. Não alterar a direção de arte, a paleta ou a linguagem sem aprovar uma nova versão.

## 1. Identidade da marca
- Personalidade: épica, competitiva, sombria, energética e comunitária.
- Símbolo: letra F geométrica dentro de um escudo angular.
- Assinatura: emblema + wordmark FORGE; slogan é opcional.
- Direção visual: fantasia gamer premium, metal escuro, portais e energia violeta.
- Tecnologia visual da fase atual: ilustração 2D com motion; sem dependência de cenas 3D.
- A arte de jogos pode manter as cores originais dos jogos; a estrutura da interface mantém a paleta FORGE.

## 2. Paleta oficial
| Token | Hex | Uso |
|---|---|---|
| `--forge-bg` | `#08060E` | Fundo principal |
| `--forge-surface` | `#15121E` | Navegação e superfícies |
| `--forge-card` | `#11101A` | Cards e painéis |
| `--forge-border` | `#2A1B4A` | Bordas discretas |
| `--forge-purple` | `#6A2BE2` | Cor primária |
| `--forge-violet` | `#8B5CF6` | Estados ativos e luz |
| `--forge-energy` | `#C026FF` | Energia e acentos especiais |
| `--forge-cyan` | `#00D4FF` | Destaque secundário, uso moderado |
| `--forge-text` | `#EAE6F0` | Texto principal |
| `--forge-muted` | `#A1A1B5` | Texto secundário |

**Proporção visual:** superfícies escuras dominam; roxo/violeta identificam a marca; ciano é raro e secundário. Não transformar ciano em cor dominante.

## 3. Tipografia
- Títulos curtos, níveis e ranking: Orbitron ou alternativa geométrica equivalente.
- Texto de interface e leitura: Inter, com fallback de sistema.
- Não usar fontes futuristas em parágrafos longos. Priorizar legibilidade mobile.

## 4. Componentes
- **Primário:** fundo roxo, texto claro, raio consistente e brilho sutil em hover/foco.
- **Secundário:** superfície escura/transparente, borda discreta.
- **Cards:** superfície escura, borda violeta discreta; evitar neon intenso em todos os elementos.
- **XP:** preenchimento violeta com animação curta ao atualizar.
- **Insígnias:** a raridade pode ter acentos próprios, sem alterar o tema-base.
- **Navegação:** ícones consistentes, estado ativo violeta e áreas de toque confortáveis.

## 5. Cenários e motion 2D
- Cenários: templos, portais, arquitetura fantástica e energia violeta.
- Camadas: arte de fundo, efeitos/partículas independentes e conteúdo legível por cima.
- Portal: pulsação lenta e luz ambiente.
- Partículas: baixa densidade, flutuação e brilho moderados.
- Cards e botões: feedback curto ao interagir.
- Transições de tela: fade/slide discreto e consistente.
- Respeitar `prefers-reduced-motion`; não animar todos os elementos com intensidade ao mesmo tempo.
- Nenhum efeito pode reduzir a legibilidade ou bloquear interações.

## 6. Responsividade, acessibilidade e performance
- Mobile-first; sem overflow horizontal.
- Contraste suficiente e foco visível.
- Assets aprovados devem ser servidos como arquivos estáticos; não gerar arte por API a cada visita.
- Preferir SVG para marcas e ícones; otimizar imagens de cenário.
- Respeitar redução de movimento e evitar animações pesadas.
- Manter compatibilidade com build Vite/React e hospedagem Cloudflare.

## 7. Estrutura recomendada de assets
- `public/assets/brand/forge-logo.svg`
- `public/assets/brand/forge-icon.svg`
- `public/assets/backgrounds/`
- `public/assets/badges/`

## 8. Regras de consistência
1. Não trocar a paleta principal por tela.
2. Não criar novos estilos de marca sem atualizar este documento e aprovar uma versão.
3. Não substituir a logo por ícones genéricos de gamepad.
4. Não reintroduzir 3D como requisito para a experiência.
5. Reutilizar tokens e componentes antes de criar variações.
6. Mudanças de funcionalidade não justificam mudanças de identidade visual.

## 9. Checklist de aceitação
- [ ] Logo F geométrica em escudo consistente.
- [ ] Preto/roxo/violeta dominantes e ciano discreto.
- [ ] Motion visível, equilibrado e com redução de movimento.
- [ ] Texto e controles legíveis em celular.
- [ ] Assets servidos localmente, sem dependência de API paga.
- [ ] Nenhuma funcionalidade existente removida sem revisão.
- [ ] Testes/build verificados antes de propor merge.

## 10. Plano por etapas
1. Criar a branch de identidade e adicionar este documento, logo e tokens.
2. Aplicar a logo aos pontos de marca da aplicação.
3. Consolidar o tema sem apagar estilos ainda utilizados.
4. Atualizar home e perfil como primeiras telas.
5. Verificar build, lint, responsividade e motion.
6. Apresentar a branch para revisão; não mesclar em `main` sem aprovação explícita.
