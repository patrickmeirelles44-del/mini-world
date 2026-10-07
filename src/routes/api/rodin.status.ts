import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/rodin/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = process.env["REPLICATE_API_TOKEN"];
        if (!token) {
          return Response.json(
            { error: "REPLICATE_API_TOKEN não configurado no servidor." },
            { status: 503 },
          );
        }

        const id = new URL(request.url).searchParams.get("id");
        if (!id) {
          return Response.json({ error: "Informe o id da geração." }, { status: 400 });
        }

        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${encodeURIComponent(id)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return Response.json(
            { error: data?.detail || data?.error || "Falha ao consultar geração." },
            { status: response.status },
          );
        }

        const output =
          typeof data.output === "string"
            ? data.output
            : Array.isArray(data.output)
              ? data.output.find((value: unknown) => typeof value === "string") ?? null
              : null;

        return Response.json({
          id: data.id,
          status: data.status,
          output,
          error: data.error ?? null,
        });
      },
    },
  },
});
