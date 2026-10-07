import { createFileRoute } from "@tanstack/react-router";

const RODIN_URL = "https://api.hyper3d.com/api/v2/download";

export const Route = createFileRoute("/api/mini/download")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["RODIN_API_KEY"];
        if (!apiKey) {
          return Response.json({ error: "RODIN_API_KEY is not configured on the server." }, { status: 503 });
        }

        const body = await request.json().catch(() => null);
        const taskUuid = body?.taskUuid;

        if (!taskUuid || typeof taskUuid !== "string") {
          return Response.json({ error: "taskUuid is required." }, { status: 400 });
        }

        const response = await fetch(RODIN_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task_uuid: taskUuid }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok || !Array.isArray(data?.list)) {
          return Response.json({ error: data?.message || "Could not retrieve the generated asset." }, { status: response.ok ? 422 : response.status });
        }

        const glb = data.list.find((item: { name?: string; url?: string }) =>
          item?.name?.toLowerCase().endsWith(".glb"),
        );

        if (!glb?.url) {
          return Response.json({ error: "Rodin finished, but no GLB was returned." }, { status: 422 });
        }

        return Response.json({ url: glb.url, name: glb.name ?? "mini.glb" });
      },
    },
  },
});
