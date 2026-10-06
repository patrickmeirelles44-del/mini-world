# Mini DNA — Base Oficial

## Regra principal

O Mini NÃO deve ser regenerado do zero para cada usuário.

Existe uma base 3D oficial com:
- proporções fixas;
- esqueleto/rig fixo;
- mãos, pés, cabeça e corpo compatíveis com todas as animações;
- materiais PBR premium;
- expressões faciais compatíveis;
- pontos de encaixe para cabelo, roupas e acessórios.

A personalização troca componentes e parâmetros sobre essa mesma base.

## Direção visual oficial

Escolha: **A — Humano Premium**.

Características:
- corpo inteiro;
- personagem humano estilizado premium;
- aparência de personagem 3D de animação de alto nível;
- cabeça levemente maior que a anatomia real, sem virar caricatura extrema;
- olhos grandes e extremamente expressivos;
- pele suave com acabamento PBR;
- cabelo em volumes/mechas 3D;
- hoodie lilás como outfit-base inicial;
- calça escura;
- tênis branco/lilás;
- mãos e dedos modelados para animação;
- silhueta limpa e reconhecível;
- iluminação cinematográfica;
- nenhum aspecto de avatar genérico, boneco low-poly ou flat.

## Personalização futura

A foto/imagem do usuário serve para inferir características e alterar:
- cabelo;
- cor/estilo do cabelo;
- sobrancelhas;
- tom de pele;
- formato e detalhes do rosto dentro dos limites da base;
- roupa;
- cores;
- tênis;
- acessórios;
- pequenos detalhes de identidade.

Não alterar:
- rig;
- proporções estruturais;
- escala do personagem;
- pontos de articulação;
- topologia principal;
- sistema de animação.

## Animações obrigatórias

O rig final deve permitir pelo menos:
- idle/breathing;
- blink;
- wave;
- walk;
- run;
- jump;
- land;
- sit;
- stand;
- happy;
- sad;
- curious;
- celebrate;
- interact/touch;
- look-at-camera.

## Pipeline

1. Criar o modelo-base masculino oficial.
2. Criar o modelo-base feminino usando exatamente a mesma linguagem, escala e rig.
3. Riggar e testar as animações.
4. Exportar GLB otimizado para mobile.
5. Separar componentes personalizáveis.
6. Só depois conectar geração por foto.
7. A IA deve produzir parâmetros/componentes de personalização, e não substituir o personagem-base.

Three.js carrega GLB/glTF diretamente e o formato suporta meshes, materiais, skins, morph targets e animações.
