import { useEffect, useRef, useState } from "react";

type GenerationState = "idle" | "uploading" | "processing" | "done" | "error";

type Props = {
  onModelReady: (url: string) => void;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YdbAQ0h6x7tTqocPTEb1pA_TjhqPJeK";
const MINI_PERSONA_URL = "https://ujohhylcrkyoqhkpnhyt.supabase.co/functions/v1/mini-persona";

// Supabase publishable keys belong in the apikey header.
// They are not JWTs and must not be sent as Authorization: Bearer.
function supabaseHeaders(contentType?: string): Record<string, string> {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    ...(contentType ? { "Content-Type": contentType } : {}),
  };
}

function errorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const value = payload as Record<string, unknown>;
  if (typeof value.error === "string" && value.error.trim()) return value.error;
  if (typeof value.message === "string" && value.message.trim()) return value.message;
  return fallback;
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
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
    };
  }, []);

  const chooseFiles = (selected: FileList | null) => {
    if (!selected?.length) return;

    // Copy the FileList immediately. Safari/iOS owns the live FileList.
    const picked = Array.from(selected);
    if (inputRef.current) inputRef.current.value = "";

    const valid = picked.filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE,
    );
    const rejected = picked.filter(
      (file) => !file.type.startsWith("image/") || file.size > MAX_FILE_SIZE,
    );

    // Selecting photos again adds them instead of silently replacing the previous selection.
    setFiles((current) => {
      const existing = new Set(current.map(fileKey));
      const additions = valid.filter((file) => !existing.has(fileKey(file)));
      const next = [...current, ...additions].slice(0, MAX_FILES);

      setPreviewUrls((currentUrls) => {
        currentUrls.forEach((url) => URL.revokeObjectURL(url));
        const urls = next.map((file) => URL.createObjectURL(file));
        previewUrlsRef.current = urls;
        return urls;
      });

      setState("idle");
      setProgress(0);

      if (rejected.length) {
        setMessage("Algumas fotos foram ignoradas. Use imagens de até 25 MB.");
      } else if (additions.length === 0) {
        setMessage("Essas fotos já estão selecionadas.");
      } else if (next.length === MAX_FILES && current.length + additions.length > MAX_FILES) {
        setMessage(`Limite de ${MAX_FILES} fotos atingido. As primeiras ${MAX_FILES} serão usadas.`);
      } else if (next.length > 1) {
        setMessage(`${next.length} fotos selecionadas — quanto mais ângulos, melhor.`);
      } else {
        setMessage("1 foto selecionada. Uma foto já é suficiente para começar.");
      }

      return next;
    });
  };

  const removeFile = (index: number) => {
    setFiles((current) => {
      const next = current.filter((_, fileIndex) => fileIndex !== index);

      setPreviewUrls((currentUrls) => {
        currentUrls.forEach((url) => URL.revokeObjectURL(url));
        const urls = next.map((file) => URL.createObjectURL(file));
        previewUrlsRef.current = urls;
        return urls;
      });

      setState("idle");
      setProgress(0);
      setMessage(
        next.length > 1
          ? `${next.length} fotos selecionadas.`
          : next.length === 1
            ? "1 foto selecionada."
            : "Escolha pelo menos 1 foto.",
      );

      return next;
    });
  };

  const generate = async () => {
    if (!files.length) {
      setMessage("Escolha pelo menos 1 foto.");
      return;
    }

    setState("uploading");
    setProgress(8);
    setMessage(`Enviando ${files.length} ${files.length === 1 ? "foto" : "fotos"}…`);

    try {
      const body = new FormData();
      files.forEach((file) => body.append("images", file, file.name));

      const createResponse = await fetch(`${MINI_PERSONA_URL}?action=generate`, {
        method: "POST",
        headers: supabaseHeaders(),
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
          headers: supabaseHeaders("application/json"),
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
            headers: supabaseHeaders("application/json"),
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

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => chooseFiles(event.target.files)}
      />

      <button
        className="mini-upload-zone"
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state === "uploading" || state === "processing" || files.length >= MAX_FILES}
      >
        <span className="mini-upload-icon">＋</span>
        <strong>
          {files.length
            ? `Adicionar mais fotos (${files.length}/${MAX_FILES})`
            : "Adicionar foto(s)"}
        </strong>
        <small>JPG, PNG, WebP e outros formatos de imagem • até 5 fotos • 25 MB por foto</small>
      </button>

      {previewUrls.length > 0 && (
        <div className="mini-photo-strip" aria-label="Fotos selecionadas">
          {previewUrls.map((url, index) => (
            <div className="mini-photo-item" key={url}>
              <img src={url} alt={`Prévia da foto ${index + 1}`} />
              <button
                type="button"
                className="mini-photo-remove"
                aria-label={`Remover foto ${index + 1}`}
                onClick={() => removeFile(index)}
                disabled={state === "uploading" || state === "processing"}
              >
                ×
              </button>
            </div>
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
          ? "Enviando fotos…"
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
