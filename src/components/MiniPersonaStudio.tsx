import { useEffect, useRef, useState } from "react";

type GenerationState = "idle" | "uploading" | "processing" | "done" | "error";

type Props = {
  onModelReady: (url: string) => void;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YdbAQ0h6x7tTqocPTEb1pA_TjhqPJeK";
const MINI_PERSONA_URL = "https://ujohhylcrkyoqhkpnhyt.supabase.co/functions/v1/mini-persona";

function errorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const value = payload as Record<string, unknown>;
  if (typeof value.error === "string" && value.error.trim()) return value.error;
  if (typeof value.message === "string" && value.message.trim()) return value.message;
  return fallback;
}

export function MiniPersonaStudio({ onModelReady }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [state, setState] = useState<GenerationState>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      if (inputRef.current) inputRef.current.value = "";
    };
  }, []);

  const chooseFiles = (selected: FileList | null) => {
    if (!selected) return;

    const rejected = Array.from(selected).filter(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE,
    );

    const next = Array.from(selected)
      .filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE)
      .slice(0, MAX_FILES);

    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const urls = next.map((file) => URL.createObjectURL(file));
    previewUrlsRef.current = urls;

    setFiles(next);
    setPreviewUrls(urls);
    setState("idle");
    setProgress(0);

    if (rejected.length) {
      setMessage("Algumas fotos foram ignoradas. Use JPG, PNG ou WebP de até 25 MB.");
    } else if (next.length > 1) {
      setMessage(`${next.length} fotos selecionadas — quanto mais ângulos, melhor.`);
    } else if (next.length === 1) {
      setMessage("1 foto selecionada. Uma foto já é suficiente para começar.");
    } else {
      setMessage("Escolha pelo menos 1 foto.");
    }
  };

  const generate = async () => {
    if (!files.length) {
      setMessage("Escolha pelo menos 1 foto.");
      return;
    }

    setState("uploading");
    setProgress(8);
    setMessage("Analisando suas fotos…");

    try {
      const body = new FormData();
      files.forEach((file) => body.append("images", file, file.name));

      const createResponse = await fetch(`${MINI_PERSONA_URL}?action=generate`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body,
      });

      const created = await createResponse.json().catch(() => ({}));
      if (!createResponse.ok) {
        throw new Error(errorMessage(created, "Não foi possível iniciar a criação do seu Mini."));
      }

      if (!created.taskUuid || !created.subscriptionKey) {
        throw new Error("O Hyper3D não retornou uma tarefa válida.");
      }

      setState("processing");
      setProgress(20);
      setMessage("Construindo rosto, cabelo e corpo em 3D…");

      const started = Date.now();
      const deadline = 20 * 60 * 1000;

      while (Date.now() - started < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 6000));

        const statusResponse = await fetch(`${MINI_PERSONA_URL}?action=status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            subscriptionKey: created.subscriptionKey,
          }),
        });

        const status = await statusResponse.json().catch(() => ({}));

        if (!statusResponse.ok) {
          throw new Error(errorMessage(status, "Não foi possível consultar a criação."));
        }

        if (status.status === "failed") {
          const detail = errorMessage(status, "");
          throw new Error(
            detail ||
              "A geração 3D falhou. Tente uma foto de corpo inteiro, bem iluminada e sem objetos cobrindo o corpo.",
          );
        }

        if (status.status === "done") {
          setProgress(92);
          setMessage("Aplicando materiais e preparando seu Mini…");

          const downloadResponse = await fetch(`${MINI_PERSONA_URL}?action=download`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              taskUuid: created.taskUuid,
            }),
          });

          const downloaded = await downloadResponse.json().catch(() => ({}));

          if (!downloadResponse.ok || !downloaded.url) {
            throw new Error(
              errorMessage(downloaded, "Não foi possível recuperar o modelo 3D."),
            );
          }

          setProgress(100);
          setState("done");
          setMessage("Seu Mini nasceu. ✨");
          onModelReady(downloaded.url);
          return;
        }

        setProgress((value) => Math.min(88, value + 7));
      }

      throw new Error("A geração demorou mais que o esperado. Tente novamente.");
    } catch (error) {
      setState("error");
      setProgress(0);
      setMessage(error instanceof Error ? error.message : "Algo deu errado.");
    }
  };

  return (
    <section className="mini-persona-studio">
      <div className="mini-persona-copy">
        <span className="eyebrow">CRIAR SEU MINI</span>
        <h2>Uma foto. Um Mini seu.</h2>
        <p>
          Envie uma foto de corpo inteiro. Se tiver outros ângulos, envie até 5
          fotos para ajudar o Hyper3D a reconstruir melhor seu personagem.
        </p>
      </div>

      <button
        className="mini-upload-zone"
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state === "uploading" || state === "processing"}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => chooseFiles(event.target.files)}
        />
        <span className="mini-upload-icon">＋</span>
        <strong>
          {files.length
            ? `${files.length} foto${files.length > 1 ? "s" : ""} pronta${files.length > 1 ? "s" : ""}`
            : "Adicionar foto(s)"}
        </strong>
        <small>JPG, PNG, WebP • até 5 fotos • 25 MB por foto</small>
      </button>

      {previewUrls.length > 0 && (
        <div className="mini-photo-strip">
          {previewUrls.map((url, index) => (
            <img key={url} src={url} alt={`Prévia da foto ${index + 1}`} />
          ))}
        </div>
      )}

      {message && (
        <div className={`mini-generation-status mini-generation-status--${state}`}>
          {state !== "idle" && (
            <div className="mini-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          )}
          <span>{message}</span>
        </div>
      )}

      <button
        className="mini-generate-button"
        type="button"
        disabled={
          !files.length || state === "uploading" || state === "processing"
        }
        onClick={generate}
      >
        {state === "uploading"
          ? "Analisando fotos…"
          : state === "processing"
            ? "Criando seu Mini…"
            : state === "done"
              ? "Criado ✓"
              : "Criar meu Mini ✨"}
      </button>

      {state === "error" && (
        <button className="mini-retry" type="button" onClick={generate}>
          Tentar novamente
        </button>
      )}
    </section>
  );
}
