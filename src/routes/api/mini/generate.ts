import { createFileRoute } from "@tanstack/react-router";

const RODIN_URL = "https://api.hyper3d.com/api/v2/rodin";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_FILES = 5;

export const Route = createFileRoute("/api/mini/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.RODIN_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "RODIN_API_KEY is not configured on the server." }, { status: 503 });
        }

        const form = await request.formData();
        const files = form.getAll("images").filter((value): value is File => value instanceof File);

        if (files.length < 1 || files.length > MAX_FILES) {
          return Response.json({ error: "Send between 1 and 5 images." }, { status: 400 });
        }

        const payload = new FormData();
        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            return Response.json({ error: "Only image files are allowed." }, { status: 400 });
          }
          if (file.size > MAX_FILE_SIZE) {
            return Response.json({ error: "Each image must be 25 MB or smaller." }, { status: 400 });
          }
          payload.append("images", file, file.name || "mini-reference.jpg");
        }

        payload.set("tier", "Gen-2.5-High");
        payload.set("mesh_mode", "Quad");
        payload.set("geometry_file_format", "glb");
        payload.set("texture_mode", "high");
        payload.set("TAPose", "true");

        const response = await fetch(RODIN_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}` },
          body: payload,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || data?.error || !data?.uuid || !data?.jobs?.subscription_key) {
          return Response.json(
            { error: data?.message || data?.error || "Rodin could not accept the generation request.", details: data?.error },
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
