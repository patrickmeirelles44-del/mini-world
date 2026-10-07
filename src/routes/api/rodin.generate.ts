import { createFileRoute } from "@tanstack/react-router";

const REPLICATE_URL = "https://api.replicate.com/v1/models/hyper3d/rodin/predictions";

type GenerateBody = {
  images?: string[];
  prompt?: string;
};

export const Route = createFileRoute("/api/rodin/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["REPLICATE_API_TOKEN"];
        if (!token) {
          return Response.json(
            { error: "REPLICATE_API_TOKEN não configurado no servidor." },
            { status: 503 },
          );
        }

        let body: GenerateBody;
        try {
          body = (await request.json()) as GenerateBody;
        } catch {
          return Response.json({ error: "JSON inválido." }, { status: 400 });
        }

        const images = Array.isArray(body.images) ? body.images.slice(0, 5) : [];
        if (!images.length) {
          return Response.json({ error: "Envie pelo menos uma foto." }, { status: 400 });
        }

        if (
          images.some(
            (image) =>
              typeof image !== "string" ||
              !image.startsWith("data:image/") ||
              image.length > 360_000,
          )
        ) {
          return Response.json(
            { error: "Cada imagem precisa ser uma imagem comprimida válida." },
            { status: 400 },
          );
        }

        const prompt =
          body.prompt?.trim() ||
          [
            "Create a premium stylized 3D collectible human character from the reference photos.",
            "Preserve recognizable facial features, hair, skin tone, hairstyle, body proportions and clothing cues from the person.",
            "Use smooth rounded geometry, clean topology, detailed hands and shoes, expressive glossy eyes and polished PBR materials.",
            "Make it feel like a high-end animated toy character: sophisticated, cute and clearly human, not baby-like, not anime, not low-poly, not a generic avatar.",
            "Full body, centered, symmetrical, animation-friendly A/T pose.",
          ].join(" ");

        const response = await fetch(REPLICATE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Prefer: "wait=10",
          },
          body: JSON.stringify({
            input: {
              tier: "Gen-2",
              images,
              prompt,
              tapose: true,
              quality: "high",
              material: "PBR",
              mesh_mode: "Quad",
              preview_render: false,
              use_original_alpha: false,
              geometry_file_format: "glb",
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return Response.json(
            { error: data?.detail || data?.error || "Falha ao iniciar geração 3D." },
            { status: response.status },
          );
        }

        return Response.json({
          id: data.id,
          status: data.status,
          output: data.output ?? null,
        });
      },
    },
  },
});
