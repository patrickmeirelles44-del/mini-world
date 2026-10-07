import { createFileRoute } from "@tanstack/react-router";

const RODIN_URL = "https://api.hyper3d.com/api/v2/rodin";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 5;
const IMAGE_LABELS = ["F", "B", "L", "R", "?"];

export const Route = createFileRoute("/api/mini/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["RODIN_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "RODIN_API_KEY is not configured on the server." },
            { status: 503 },
          );
        }

        const form = await request.formData();
        const files = form
          .getAll("images")
          .filter((value): value is File => value instanceof File);

        if (files.length < 1 || files.length > MAX_FILES) {
          return Response.json({ error: "Envie de 1 a 5 fotos." }, { status: 400 });
        }

        const payload = new FormData();

        for (const [index, file] of files.entries()) {
          if (!file.type.startsWith("image/")) {
            return Response.json(
              { error: "Apenas arquivos de imagem sao aceitos." },
              { status: 400 },
            );
          }

          if (file.size > MAX_FILE_SIZE) {
            return Response.json(
              { error: "Cada foto precisa ter no maximo 25 MB." },
              { status: 400 },
            );
          }

          payload.append("images", file, file.name || `mini-reference-${index + 1}.jpg`);
        }

        // Rodin Gen-2.5: foco em fidelidade humana, materiais PBR e geometria pronta
        // para um personagem que sera usado dentro do Mini World.
        payload.set("tier", "Gen-2.5-High");
        payload.set("mesh_mode", "Quad");
        payload.set("quality_override", "200000");
        payload.set("geometry_file_format", "glb");
        payload.set("texture_mode", "high");
        payload.set("material", "PBR");
        payload.set("TAPose", "true");
        payload.set("geometry_instruct_mode", "faithful");
        payload.set("is_symmetric", "balanced");
        payload.set("preview_render", "true");
        payload.set(
          "prompt",
          "Premium stylized 3D collectible human character. Clearly human, expressive and attractive, slightly oversized head but not baby-like or chibi, detailed natural hair, expressive eyes, modeled hands and shoes, clean anatomy, polished PBR materials, high-end toy/product render quality. Preserve the person's identity and visible clothing characteristics from the reference photos. No Funko, no anime, no low-poly.",
        );

        // A ordem das fotos pode ser informada pelo studio. Isso melhora bastante
        // a reconstrução quando o usuario envia multiplos angulos.
        const labels = form
          .getAll("imageLabels")
          .filter((value): value is string => typeof value === "string")
          .slice(0, files.length);

        const safeLabels = labels.length === files.length
          ? labels.map((label, index) => IMAGE_LABELS.includes(label) ? label : IMAGE_LABELS[Math.min(index, IMAGE_LABELS.length - 1)])
          : files.map((_, index) => IMAGE_LABELS[Math.min(index, IMAGE_LABELS.length - 1)]);

        for (const label of safeLabels) {
          payload.append("image_label", label ?? "?");
        }

        const response = await fetch(RODIN_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: payload,
        });

        const data = await response.json().catch(() => null);

        // Rodin pode devolver HTTP 201 mesmo quando a aplicacao rejeita o job.
        if (!response.ok || data?.error || !data?.uuid || !data?.jobs?.subscription_key) {
          return Response.json(
            {
              error:
                data?.message ||
                data?.error ||
                "A Hyper3D nao aceitou a geracao.",
              details: data?.error ?? null,
            },
            { status: response.ok ? 422 : response.status },
          );
        }

        return Response.json({
          taskUuid: data.uuid,
          subscriptionKey: data.jobs.subscription_key,
          consumed: data.consumed ?? null,
        });
      },
    },
  },
});
