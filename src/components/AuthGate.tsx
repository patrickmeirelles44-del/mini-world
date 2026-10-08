import { useEffect, useState } from "react";
import { LogIn, UserPlus, X, Gamepad2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(undefined);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (!supabase) { setSession({ demo: true }); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="auth-screen"><div className="auth-card"><Gamepad2 size={28}/><p>Carregando FORGE...</p></div></div>;
  if (session) return <>{children}</>;

  async function resetPassword() { setError(""); if (!email) { setError("Digite seu e-mail primeiro."); return; } setBusy(true); const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); setBusy(false); if (error) setError(error.message); else setError("Enviamos um link de recuperação para seu e-mail."); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    const result = mode === "login"
      ? await supabase!.auth.signInWithPassword({ email, password })
      : await supabase!.auth.signUp({ email, password, options: { data: { username, display_name: displayName || username } } });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else if (mode === "signup" && !result.data.session) setError("Conta criada. Confirme seu e-mail para entrar.");
  }

  return <div className="auth-screen">
    <div className="auth-card">
      <div className="brand-mark"><Gamepad2 size={22}/></div><span className="auth-brand">FORGE</span>
      <h1>{mode === "login" ? "Entre no seu universo." : "Crie sua identidade gamer."}</h1>
      <p>Seu perfil, seus jogos, suas comunidades.</p>
      <form onSubmit={submit}>
        {mode === "signup" && <><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required minLength={3}/></label><label>Nome<input value={displayName} onChange={e=>setDisplayName(e.target.value)} required/></label></>}
        <label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></label>
        {error && <div className="auth-error">{error}</div>}
        {mode === "login" && <button type="button" className="auth-switch" onClick={resetPassword} disabled={busy}>Esqueci minha senha</button>}
        <button className="primary auth-submit" disabled={busy}>{busy ? "Entrando..." : mode === "login" ? <><LogIn size={16}/> Entrar</> : <><UserPlus size={16}/> Criar conta</>}</button>
      </form>
      <button className="auth-switch" onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}}>
        {mode==="login" ? "Ainda não tenho conta" : "Já tenho uma conta"}
      </button>
    </div>
  </div>;
}