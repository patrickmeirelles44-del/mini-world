# Mini 3D Asset Pipeline

O projeto trata o personagem como um **sistema 3D**, não como uma imagem.

## DNA oficial

- Direção: **A — Humano Premium**
- Masculino e feminino usam a mesma linguagem visual.
- O rig e a silhueta-base são preservados.
- Foto do usuário gera parâmetros de personalização, não um personagem novo.

## Estrutura

- `public/mini/mini-official.glb` — asset 3D oficial de runtime.
- `public/mini/reference/` — especificações das referências aprovadas.
- `public/mini/mini-dna.md` — regras visuais e técnicas.
- `public/mini/character-spec.json` — contrato estruturado da base.
- `src/components/MiniCharacterAsset.tsx` — carregador/controlador do GLB e das animações.

## Personalização

O sistema reserva slots para cabelo, cor do cabelo, pele, rosto, roupa, cor da roupa, sapatos e acessórios.

A IA de foto deverá retornar somente parâmetros de personalização.

## Animações

O controlador suporta: `idle`, `blink`, `wave`, `walk`, `run`, `jump`, `land`, `sit`, `stand`, `happy`, `sad`, `curious`, `celebrate`, `interact`, `lookAtCamera`.

O GLB final deve trazer os clips com esses nomes ou aliases compatíveis.

## Próximo asset

O modelo oficial precisa ser exportado como GLB otimizado para mobile. O GLB será conectado ao runtime quando o arquivo final for disponibilizado.