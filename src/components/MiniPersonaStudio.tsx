import { useEffect, useRef, useState } from "react";

type GenerationState = "idle" | "uploading" | "processing" | "done" | "error";

type Props = {
  onModelReady: (url: string) => void;
};

const MAX_FILES = 5;
const MINI_PERSONA_URL = "https://ujohhylcrkyoqhkpnhyt.supabase.co/functions/v1/mini-persona";

export function MiniPersonaStudio({ onModelReady }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<GenerationState>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (inputRef.current) inputRef.current.value = "";
    };
  }, []);

  const chooseFiles = (selected: FileList | null) => {
    if (!selected) return;
    const next = Array.from(selected).filter((file) => file.type.startsWith("image/")).slice(0, MAX_FILES);
    setFiles(next);
    setMessage(next.length > 1 ? `${next.length} fotos selecionadas` : next.length === 1 ? "1 foto selecionada" : "");
  };

  const generate = async () => {
    if (!files.length) {
      setMessage("Escolha pelo menos 1 foto.");
      return;
    }

    setState("uploading");
    setProgress(8);
    setMessage("Preparando suas fotos…");

    try {
      const body = new FormData();
      files.forEach((file) => body.append("images", file, file.name));

      const createResponse = await fetch(MINI_PERSONA_URL, { method: "POST", headers: { "x-mini-action": "generate" }, body });
      const created = await createResponse.json();
      if (!createResponse.ok) throw new Error(created.error || "Não foi possível iniciar a geração.");

      setState("processing");
      setProgress(20);
      setMessage("Criando seu Mini em 3D…");

      const started = Date.now();
      const deadline = 20 * 60 * 1000;

      while (Date.now() - started < deadline) {
        await new Promise((resolve) => window.setTimeout(resolve, 6000));

        const statusResponse = await fetch("/api/mini/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionKey: created.subscriptionKey }),
        });
        const status = await statusResponse.json();
        if (!statusResponse.ok) throw new Error(status.error || "Não foi possível consultar a geração.");

        if (status.status === "failed") {
          throw new Error("A geração 3D falhou. Tente outra foto com corpo inteiro e fundo simples.");
        }

        if (status.status === "done") {
          setProgress(92);
          setMessage("Finalizando seu Mini…");

          const downloadResponse = await fetch(MINI_PERSONA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-mini-action": "download" },
            body: JSON.stringify({ taskUuid: created.taskUuid }),
          });
          const downloaded = await downloadResponse.json();
          if (!downloadResponse.ok) throw new Error(downloaded.error || "Não foi possível recuperar o modelo.");

          setProgress(100);
          setState("done");
          setMessage("Seu Mini nasceu. ✨");
          onModelReady(downloaded.url);
          return;
        }

        setProgress((value) => Math.min(88, value + 7));
      }

      throw new Error("A geração demorou mais que o esperado. Você pode tentar novamente.");
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
        <p>Envie uma foto de corpo inteiro. Se tiver mais ângulos, pode enviar até 5 fotos para ajudar a IA a reconstruir melhor seu personagem.</p>
      </div>

      <button className="mini-upload-zone" type="button" onClick={() => inputRef.current?.click()}>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => chooseFiles(event.target.files)}
        />
        <span className="mini-upload-icon">＋</span>
        <strong>{files.length ? `${files.length} foto${files.length > 1 ? "s" : ""} pronta${files.length > 1 ? "s" : ""}` : "Adicionar foto(s)"}</strong>
        <small>JPG, PNG, WebP • até 5 fotos</small>
      </button>

      {files.length > 0 && (
        <div className="mini-photo-strip">
          {files.map((file) => (
            <img key={`${file.name}-${file.lastModified}`} src={URL.createObjectURL(file)} alt="Prévia da foto enviada" />
          ))}
        </div>
      )}

      {state !== "idle" && (
        <div className="mini-generation-status">
          <div className="mini-progress"><span style={{ width: `${progress}%` }} /></div>
          <span>{message}</span>
        </div>
      )}

      <button className="mini-generate-button" type="button" disabled={!files.length || state === "uploading" || state === "processing"} onClick={generate}>
        {state === "uploading" ? "Preparando…" : state === "processing" ? "Criando seu Mini…" : state === "done" ? "Criado ✓" : "Criar meu Mini"}
      </button>

      {state === "error" && <button className="mini-retry" type="button" onClick={generate}>Tentar novamente</button>}
    </section>
  );
}
