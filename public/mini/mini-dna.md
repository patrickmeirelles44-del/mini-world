# Mini DNA — Base Oficial

## Regra principal

O Mini não é regenerado do zero para cada usuário.

Existe uma **base 3D oficial A — Humano Premium**. O usuário recebe uma instância dessa mesma base e a IA apenas escolhe/ajusta componentes compatíveis.

### O que fica travado

- skeleton / rig;
- proporções corporais;
- escala;
- posições das articulações;
- mãos e pés;
- silhueta principal;
- pontos de encaixe;
- conjunto de animações;
- qualidade visual e materiais-base.

### O que pode mudar

- tom de pele;
- cabelo: estilo, volume e cor;
- sobrancelhas e detalhes faciais;
- roupa e cor;
- sapatos e cor;
- acessórios;
- pequenos detalhes de identidade.

A foto do usuário **não cria outro personagem**. Ela gera parâmetros de personalização para esta base.

## Duas bases oficiais

- Masculino: `mini-base-male`
- Feminino: `mini-base-female`

As duas devem compartilhar a mesma linguagem visual, escala, qualidade, sistema de materiais, pontos de encaixe e rig de animação compatível. A versão feminina será criada a partir desta especificação, não como um avatar independente.

## Animações obrigatórias

`idle`, `blink`, `wave`, `walk`, `run`, `jump`, `land`, `sit`, `stand`, `happy`, `sad`, `curious`, `celebrate`, `interact`, `lookAtCamera`.

O runtime já possui um controlador preparado para selecionar esses clips no GLB oficial.

## Asset final

`public/mini/mini-official.glb`

O GLB deve conter rig, materiais PBR, meshes separados por componente quando possível e todos os clips de animação necessários. O formato glTF/GLB é adequado ao runtime porque suporta meshes, materiais, skins, morph targets e animações.