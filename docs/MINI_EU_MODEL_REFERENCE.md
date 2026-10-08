# Mini Eu — 3D modeler test

Use the generated Mini Eu character sheet from this chat as the visual reference.

The repository already contains the `mini-persona` Edge Function and a provider abstraction for Hyper3D/TRELLIS. The intended output is a textured, rigged GLB suitable for the Mini World client.

## Visual target
- Premium cinematic toy-like 3D
- Adult male character stylized into a polished Mini
- Buzz cut and full beard
- Strong eyebrows and expressive eyes
- Neck cross tattoo and forearm tattoos
- Chain necklace and watch
- Navy blue shirt, dark shorts, white socks and white sneakers with purple accents
- Consistent front/profile/back/detail views

## Important
The reference sheet itself is attached in the ChatGPT conversation. This branch contains the machine-readable modeler payload so the generation request can be wired into the existing `mini-persona` pipeline without changing the production branch yet.

## Existing generation path
`mini-persona` supports Hyper3D by default and exposes a provider abstraction for a future free/open-source provider.
