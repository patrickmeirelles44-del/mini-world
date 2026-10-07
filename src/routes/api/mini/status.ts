import { createFileRoute } from "@tanstack/react-router";

const RODIN_URL = "https://api.hyper3d.com/api/v2/status";

export const Route = createFileRoute("/api/mini/status")({
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

        const body = await request.json().catch(() => null);
        const subscriptionKey = body?.subscriptionKey;

        if (!subscriptionKey || typeof subscriptionKey !== "string") {
          return Response.json({ error: "subscriptionKey is required." }, { status: 400 });
        }

        const response = await fetch(RODIN_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription_key: subscriptionKey }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          return Response.json(
            { error: data?.message || "Nao foi possivel consultar a geracao." },
            { status: response.status },
          );
        }

        const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
        const states = jobs
          .map((job: { status?: string }) => job.status)
          .filter((value: unknown): value is string => Boolean(value));

        const status =
          states.includes("Failed")
            ? "failed"
            : states.length > 0 && states.every((value: string) => value === "Done")
              ? "done"
              : "processing";

        return Response.json({
          status,
          jobs: jobs.map((job: { status?: string; error?: string; message?: string }) => ({
            status: job.status,
            error: job.error,
            message: job.message,
          })),
        });
      },
    },
  },
});
