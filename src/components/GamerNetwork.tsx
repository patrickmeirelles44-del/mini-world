import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles as ThreeSparkles } from "@react-three/drei";
import * as THREE from "three";
import { Gamepad2, Home, Users, MessageCircle, Search, Bell, Plus, MapPin, Trophy, Shield, Sparkles, ChevronRight, Heart, Send, LogOut, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "home" | "discover" | "communities" | "messages" | "profile";
type Profile = { id:string; username:string; display_name:string; bio:string|null; avatar_url:string|null; city:string|null; state:string|null; country:string|null; level:number; xp:number; status:string };
type Game = { id:string; name:string; slug:string; genre:string|null; accent:string };
type Post = { id:string; body:string; image_url:string|null; created_at:string; profile_id:string; profile?:Profile; likes?:number; liked?:boolean; comments?:number };

const fallbackGames: Game[] = [
 {id:"valorant",name:"VALORANT",slug:"valorant",genre:"FPS",accent:"#ff4655"},
 {id:"fortnite",name:"Fortnite",slug:"fortnite",genre:"Battle Royale",accent:"#7658ff"},
 {id:"gta-v",name:"GTA V",slug:"gta-v",genre:"Open World",accent:"#d7a83f"},
 {id:"minecraft",name:"Minecraft",slug:"minecraft",genre:"Sandbox",accent:"#55b66b"},
 {id:"cs2",name:"Counter-Strike 2",slug:"cs2",genre:"FPS",accent:"#d9a441"},
 {id:"ea-fc",name:"EA FC",slug:"ea-fc",genre:"Sports",accent:"#36a866"},
 {id:"apex-legends",name:"Apex Legends",slug:"apex-legends",genre:"Battle Royale",accent:"#e65b3d"},
 {id:"elden-ring",name:"Elden Ring",slug:"elden-ring",genre:"RPG",accent:"#c8a45a"},
];
const badges = [{icon:"♛",name:"Lenda",rarity:"LENDÁRIA"},{icon:"⚔",name:"Competidor",rarity:"ÉPICA"},{icon:"✦",name:"Colecionador",rarity:"RARA"},{icon:"◈",name:"Primeiro Spawn",rarity:"COMUM"}];
function getArchetype(games:Game[]){const text=games.map(g=>((g.genre||"")+" "+g.name).toLowerCase()).join(" ");if(/racing|corrida|car|f1|kart/.test(text))return "Piloto";if(/rpg|elden|adventure|aventura/.test(text))return "Aventureiro";if(/sandbox|minecraft|creative|criativo/.test(text))return "Criador";if(/open world|gta|explor/.test(text))return "Explorador";return games.length>=3?"Competidor":"Gamer";}

function useCurrentProfile() {
 const [profile,setProfile]=useState<Profile|null>(supabase ? null : {id:"demo-profile",username:"forge_player",display_name:"Gamer",bio:"Construindo meu universo gamer no FORGE.",avatar_url:null,city:"Brasil",state:null,country:"Brasil",level:1,xp:0,status:"online"});
 useEffect(()=>{ let active=true; (async()=>{if(!supabase)return; const {data:{user}}=await supabase.auth.getUser(); if(!user)return; const {data}=await supabase.from("profiles").select("*").eq("id",user.id).single(); if(active)setProfile(data);})(); return()=>{active=false}},[]);
 return {profile,setProfile};
}

function Torch({position,accent}:{position:[number,number,number];accent:string}){return <group position={position}><mesh position={[0,.42,0]}><cylinderGeometry args={[.06,.1,.8,10]}/><meshStandardMaterial color="#171217" metalness={.6}/></mesh><mesh position={[0,.9,0]}><sphereGeometry args={[.16,16,12]}/><meshStandardMaterial color={accent} emissive="#ff7b18" emissiveIntensity={5}/></mesh><pointLight color="#ff7b18" intensity={3} distance={2.8}/></group>}

function GamerAvatar3D({accent}:{accent:string}){return <group position={[0,.48,0]}><Float speed={1.5} rotationIntensity={.03} floatIntensity={.12}><mesh position={[0,1.45,0]}><capsuleGeometry args={[.34,.7,8,20]}/><meshStandardMaterial color="#14131a" roughness={.42} metalness={.25}/></mesh><mesh position={[0,2.05,0]}><sphereGeometry args={[.31,24,18]}/><meshStandardMaterial color="#b77d5d" roughness={.7}/></mesh><mesh position={[0,2.18,.08]} scale={[1.05,.55,.9]}><sphereGeometry args={[.3,24,18]}/><meshStandardMaterial color="#17151c" roughness={.7}/></mesh><mesh position={[-.43,1.55,0]} rotation={[0,0,-.16]}><capsuleGeometry args={[.09,.52,6,12]}/><meshStandardMaterial color="#181620" metalness={.25}/></mesh><mesh position={[.43,1.55,0]} rotation={[0,0,.16]}><capsuleGeometry args={[.09,.52,6,12]}/><meshStandardMaterial color="#181620" metalness={.25}/></mesh><mesh position={[-.18,.72,0]}><capsuleGeometry args={[.11,.68,6,12]}/><meshStandardMaterial color="#101016" roughness={.5}/></mesh><mesh position={[.18,.72,0]}><capsuleGeometry args={[.11,.68,6,12]}/><meshStandardMaterial color="#101016" roughness={.5}/></mesh><mesh position={[-.18,.3,.08]} scale={[1.15,.5,1.7]}><boxGeometry args={[.22,.22,.42]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} metalness={.4}/></mesh><mesh position={[.18,.3,.08]} scale={[1.15,.5,1.7]}><boxGeometry args={[.22,.22,.42]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} metalness={.4}/></mesh></Float></group>}

function TempleScene({accent}:{accent:string}){const ref=useRef<THREE.Group>(null);useFrame((state,delta)=>{if(ref.current){ref.current.rotation.y += delta*0.08; ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -0.025, 0.04);}});return <group ref={ref}>
 <mesh position={[0,.08,0]}><cylinderGeometry args={[2.35,2.65,.22,64]}/><meshStandardMaterial color="#0d0c12" metalness={.85} roughness={.26}/></mesh>
 <mesh position={[0,.2,0]}><torusGeometry args={[1.9,.055,16,96]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4}/></mesh>
 <mesh position={[0,.3,0]}><cylinderGeometry args={[1.72,1.9,.12,64]}/><meshStandardMaterial color="#1a1622" metalness={.75} roughness={.32}/></mesh>
 {[-1.65,1.65].map((x,i)=><group key={x} position={[x,1.35,-.18]}><mesh><boxGeometry args={[.34,2.35,.38]}/><meshStandardMaterial color="#19151d" metalness={.8} roughness={.3}/></mesh><mesh position={[0,1.28,0]}><coneGeometry args={[.58,.75,6]}/><meshStandardMaterial color="#211a28" metalness={.7} emissive={accent} emissiveIntensity={.15}/></mesh><mesh position={[0,.2,.22]}><boxGeometry args={[.5,.95,.08]}/><meshStandardMaterial color={i===0?"#2a1834":"#2a1834"} emissive={accent} emissiveIntensity={.2}/></mesh></group>)}
 <mesh position={[0,2.2,-.35]}><torusGeometry args={[1.45,.18,18,64,Math.PI]}/><meshStandardMaterial color="#201a25" metalness={.8}/></mesh>
 <mesh position={[0,2.2,-.32]}><torusGeometry args={[1.1,.045,12,64,Math.PI]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={4}/></mesh>
 <mesh position={[0,2.95,-.35]}><octahedronGeometry args={[.48,.2]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.2} metalness={.7}/></mesh>
 <Torch position={[-1.25,.35,.35]} accent={accent}/><Torch position={[1.25,.35,.35]} accent={accent}/>
 <GamerAvatar3D accent={accent}/>
 <ThreeSparkles count={130} scale={[5,3.8,4]} size={1.6} speed={.3} color={accent}/>
 </group>}

class ThreeDErrorBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(error:Error){console.error("FORGE 3D render failed:",error)}
 render(){return this.state.failed?this.props.fallback:this.props.children}
}
function supportsWebGL(){try{const canvas=document.createElement("canvas");return !!(window.WebGLRenderingContext&&(canvas.getContext("webgl2")||canvas.getContext("webgl")||canvas.getContext("experimental-webgl")))}catch{return false}}
function ThreeDFallback(){return <div className="temple-3d-fallback"><div className="fallback-core">✦</div><strong>Renderização 3D indisponível</strong><span>Verifique se o navegador permite WebGL e recarregue a página.</span></div>}
function Temple3D({accent}:{accent:string}){
 return <div className="temple-3d temple-static" aria-label="Templo gamer ilustrado">
  <div className="static-temple-scene">
   <div className="static-temple-halo"/><div className="static-temple-ring ring-one"/><div className="static-temple-ring ring-two"/>
   <div className="static-temple-arch"><i className="arch-inner"/><i className="arch-glow"/></div>
   <div className="static-temple-column column-left"><i/></div><div className="static-temple-column column-right"><i/></div>
   <div className="static-temple-pedestal"><i/><b>✦</b></div>
   <div className="static-temple-avatar">{/* Deliberately static visual: reliable on every phone and browser. */}<span>✦</span></div>
   <div className="static-temple-floor"/>
   <span className="static-temple-rune rune-left">◈</span><span className="static-temple-rune rune-right">✧</span><span className="static-temple-rune rune-top">✦</span>
  </div>
 </div>
}
function TempleProfile({profile,games}:{profile:Profile;games:Game[]}) {
 const themes={nexus:"temple-nexus",inferno:"temple-inferno",cyber:"temple-cyber",void:"temple-void"} as const;
 const [theme,setTheme]=useState<keyof typeof themes>("nexus");
 useEffect(()=>{const saved=window.localStorage.getItem("forge-theme") as keyof typeof themes | null;if(saved&&saved in themes) setTheme(saved)},[]);
 const pointerX=useSpring(useMotionValue(0),{stiffness:180,damping:24});
 const pointerY=useSpring(useMotionValue(0),{stiffness:180,damping:24});
 const tiltX=useTransform(pointerY,[-1,1],[4,-4]);
 const tiltY=useTransform(pointerX,[-1,1],[-5,5]);
 const bgX=useTransform(pointerX,[-1,1],[-18,18]);
 const bgY=useTransform(pointerY,[-1,1],[-12,12]);
 const contentX=useTransform(pointerX,[-1,1],[-5,5]);
 const contentY=useTransform(pointerY,[-1,1],[-3,3]);
 const handlePointerMove=(e:React.PointerEvent)=>{if(window.matchMedia("(pointer: coarse)").matches)return;const r=e.currentTarget.getBoundingClientRect();if(!r.width||!r.height)return;pointerX.set((e.clientX-r.left)/r.width*2-1);pointerY.set((e.clientY-r.top)/r.height*2-1)};
 const resetPointer=()=>{pointerX.set(0);pointerY.set(0)};
 const [customizing,setCustomizing]=useState(false);
 const xpNext=Math.max(100,profile.level*100);
 const xpPct=Math.min(100,Math.round((profile.xp/xpNext)*100));
 const choose=(t:keyof typeof themes)=>{setTheme(t);window.localStorage.setItem("forge-theme",t)};
 return <motion.section className={"temple-card "+themes[theme]} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:"easeOut"}} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} style={{perspective:1200,rotateX:tiltX,rotateY:tiltY}}>
  <motion.div className="temple-bg" style={{x:bgX,y:bgY,scale:1.04}}><div className="temple-noise"/><div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/><div className="temple-stars">{Array.from({length:22},(_,i)=><i key={i}/>)}</div><div className="grid-floor"/></motion.div>
  <Temple3D accent={theme==="inferno"?"#ff4d4d":theme==="cyber"?"#00e5ff":theme==="void"?"#a78bfa":"#a855f7"}/>
  <div className="temple-content">
   <div className="temple-top"><span>GAMER TEMPLE <b>/// {theme}</b></span><button onClick={()=>setCustomizing(v=>!v)}><Sparkles size={15}/> Personalizar</button></div>
   <div className="temple-hero">
    <div className="temple-runes" aria-hidden="true"><span>✦</span><span>◈</span><span>◆</span><span>✧</span></div>
    <div className="avatar-frame"><div className="avatar">{profile.avatar_url?<img src={profile.avatar_url} alt="Avatar"/>:profile.display_name?.[0]?.toUpperCase()||"G"}</div><span className={"online "+(profile.status!=="online"?"offline":"")}/></div>
    <div className="identity"><p className="eyebrow">NÍVEL {profile.level} · {getArchetype(games).toUpperCase()}</p><h1>{profile.display_name}</h1><p className="muted"><MapPin size={13}/>{[profile.city,profile.state,profile.country].filter(Boolean).join(" · ")||"Brasil"}</p><div className="xp-wrap"><div><span>PROGRESSÃO</span><b>{profile.xp} / {xpNext} XP</b></div><div className="xp-track"><i style={{width:xpPct+"%"}}/></div></div></div>
   </div>
   <div className="temple-slogan"><span>{getArchetype(games).toUpperCase()}</span><strong>Seu jogo. Seu mundo. Sua assinatura.</strong><small>Arquétipo evolutivo</small></div>
   <div className="stats"><div><strong>{games.length}</strong><span>JOGOS</span></div><div><strong>4</strong><span>INSÍGNIAS</span></div><div><strong>{profile.xp}</strong><span>XP</span></div><div><strong>0</strong><span>AMIGOS</span></div></div>
   <div className="temple-evolution"><div><span>EVOLUÇÃO DO TEMPLO</span><b>{Math.min(100, profile.level*12 + Math.floor(profile.xp/10))}%</b></div><div className="evolution-track"><i style={{width:Math.min(100, profile.level*12 + Math.floor(profile.xp/10))+"%"}}/></div><div className="evolution-nodes"><span>SPAWN</span><span>AWAKENED</span><span>LEGEND</span></div></div>
   <div className="game-row">{games.map(g=><div className="game-pill" key={g.id}><i style={{background:g.accent}}>{g.name[0]}</i><span>{g.name}</span></div>)}</div>
   {customizing&&<div className="temple-customizer"><div><span>ATMOSFERA DO TEMPLO</span><small>Escolha a identidade visual do seu perfil.</small></div><div className="theme-options">{(Object.keys(themes) as Array<keyof typeof themes>).map(t=><button key={t} className={theme===t?"active":""} onClick={()=>choose(t)}><i className={"theme-dot "+t}/>{t.toUpperCase()}</button>)}</div></div>}
   </div>
 </motion.section>
}
function Composer({profile,onCreated}:{profile:Profile;onCreated:(p:Post)=>void}) {
 const [body,setBody]=useState(""); const [busy,setBusy]=useState(false); const [file,setFile]=useState<File|null>(null);
 async function publish(){if(!supabase||(!body.trim()&&!file))return;setBusy(true);let image_url:null|string=null;if(file){const ext=file.name.split(".").pop()||"jpg";const path=profile.id+"/"+crypto.randomUUID()+"."+ext;const up=await supabase.storage.from("avatars").upload(path,file,{upsert:false,contentType:file.type});if(!up.error){const {data}=supabase.storage.from("avatars").getPublicUrl(path);image_url=data.publicUrl}}const {data,error}=await supabase.from("posts").insert({profile_id:profile.id,body:body.trim(),image_url}).select("*").single();setBusy(false);if(!error&&data){onCreated({...data,profile});setBody("");setFile(null)}}
 return <div className="post composer"><div className="post-head"><div className="mini-avatar">{profile.display_name[0]}</div><div><strong>{profile.display_name}</strong><small>Compartilhe o que está rolando no seu universo.</small></div></div><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="O que você está jogando?..." maxLength={5000}/><div className="composer-foot"><label className="file-pick">+ foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><span>{body.length}/5000</span><button className="primary" onClick={publish} disabled={busy||!body.trim()}><Send size={14}/>{busy?"Publicando":"Publicar"}</button></div></div>
}

function PostActions({post,profile,onLike}:{post:Post;profile:Profile;onLike:()=>void}) {
 const [open,setOpen]=useState(false); const [text,setText]=useState(""); const [comments,setComments]=useState<any[]>([]);
 async function load(){if(!supabase||!open)return;const {data}=await supabase.from("comments").select("id,body,created_at,profile_id,profiles(display_name,username)").eq("post_id",post.id).order("created_at");setComments(data||[])}
 useEffect(()=>{load()},[open,post.id]);
 async function send(){if(!supabase||!text.trim())return;const {data}=await supabase.from("comments").insert({post_id:post.id,profile_id:profile.id,body:text.trim()}).select("*").single();if(data){setText("");load()}}
 return <><div className="post-actions"><button onClick={onLike} className={post.liked?"liked":""}><Heart size={14} fill={post.liked?"currentColor":"none"}/> {post.likes||0}</button><button onClick={()=>setOpen(v=>!v)}><MessageCircle size={14}/> {post.comments||comments.length||0} comentários</button><button onClick={()=>navigator.clipboard?.writeText(window.location.href)}><Send size={14}/> Compartilhar</button></div>{open&&<div className="comments-box">{comments.map(c=><div className="comment" key={c.id}><strong>{c.profiles?.display_name||"Gamer"}</strong><p>{c.body}</p></div>)}<div className="comment-compose"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escreva um comentário..."/><button className="primary" onClick={send}><Send size={12}/></button></div></div>}</>
}

function HomeWelcome({profile,games}:{profile:Profile;games:Game[]}) {
 return <section className="home-welcome">
  <div className="home-welcome-copy"><span className="eyebrow">SEU UNIVERSO GAMER</span><h1>Bem-vindo à <span>FORGE</span></h1><p>Descubra jogadores, encontre comunidades e mostre ao mundo os jogos que fazem parte da sua história.</p><div className="home-welcome-stats"><span><i/> Comunidade ativa</span><b>{games.length} jogos para explorar</b></div></div>
  <div className="home-welcome-art" aria-hidden="true"><div className="home-orbit home-orbit-a"/><div className="home-orbit home-orbit-b"/><div className="home-crystal"><Gamepad2 size={40}/></div><span className="home-spark home-spark-a">✦</span><span className="home-spark home-spark-b">✧</span></div>
 </section>
}

function HomeFeed({profile,games}:{profile:Profile;games:Game[]}) {
 const [posts,setPosts]=useState<Post[]>([]); const [loading,setLoading]=useState(true);
 async function load(){if(!supabase)return;const {data}=await supabase.from("posts").select("id,body,image_url,created_at,profile_id,profiles(id,username,display_name,bio,avatar_url,city,state,country,level,xp,status)").order("created_at",{ascending:false}).limit(30);const rows=(data||[]).map((p:any)=>({...p,profile:Array.isArray(p.profiles)?p.profiles[0]:p.profiles}));const ids=rows.map(p=>p.id);let likes:any[]=[];if(ids.length){const r=await supabase.from("likes").select("post_id,profile_id").in("post_id",ids);likes=r.data||[]}setPosts(rows.map(p=>({...p,likes:likes.filter(l=>l.post_id===p.id).length,liked:likes.some(l=>l.post_id===p.id&&l.profile_id===profile.id)})));setLoading(false)}
 useEffect(()=>{load();if(!supabase)return;const ch=supabase.channel("forge-feed").on("postgres_changes",{event:"*",schema:"public",table:"posts"},()=>load()).subscribe();return()=>{supabase.removeChannel(ch)}},[profile.id]);
 async function toggleLike(post:Post){if(!supabase)return;if(post.liked)await supabase.from("likes").delete().eq("post_id",post.id).eq("profile_id",profile.id);else await supabase.from("likes").insert({post_id:post.id,profile_id:profile.id});setPosts(ps=>ps.map(p=>p.id===post.id?{...p,liked:!p.liked,likes:(p.likes||0)+(p.liked?-1:1)}:p))}
 return <div className="page-grid"><main><TempleProfile profile={profile} games={games}/><div className="section-head"><div><span className="eyebrow">ATIVIDADE</span><h2>Seu universo gamer</h2></div></div><Composer profile={profile} onCreated={p=>setPosts(ps=>[p,...ps])}/>{loading?<div className="post">Carregando atividade...</div>:posts.length===0?<div className="post empty-state"><h3>Seu primeiro post começa aqui.</h3><p>Conte para a comunidade o que você está jogando.</p></div>:posts.map(p=><article className="post" key={p.id}><div className="post-head"><div className="mini-avatar">{p.profile?.display_name?.[0]||"G"}</div><div><strong>{p.profile?.display_name||"Gamer"}</strong><span> · {new Date(p.created_at).toLocaleString("pt-BR")}</span><small>@{p.profile?.username}</small></div></div><p>{p.body}</p>{p.image_url&&<img className="post-image" src={p.image_url} alt="Imagem do post"/>}<PostActions post={p} profile={profile} onLike={()=>toggleLike(p)} /></article>)}</main><aside><div className="side-card"><div className="side-title"><span>INSÍGNIAS</span><Trophy size={16}/></div><div className="badge-grid">{badges.map(b=><div className="badge" key={b.name}><span>{b.icon}</span><strong>{b.name}</strong><small>{b.rarity}</small></div>)}</div></div><div className="side-card"><div className="side-title"><span>JOGOS DISPONÍVEIS</span></div>{games.slice(0,5).map(g=><div className="community-row" key={g.id}><i style={{background:g.accent}}>{g.name[0]}</i><div><strong>{g.name}</strong><small>{g.genre||"Game"}</small></div></div>)}</div></aside></div>
}

function Discover({profile,games}:{profile:Profile;games:Game[]}) {
 const [players,setPlayers]=useState<Profile[]>([]);const [query,setQuery]=useState("");const [sent,setSent]=useState<string[]>([]);
 useEffect(()=>{(async()=>{if(!supabase)return;let q=supabase.from("profiles").select("*").neq("id",profile.id).limit(30);if(query.trim())q=q.or("display_name.ilike.%"+query.trim()+"%,username.ilike.%"+query.trim()+"%");const {data}=await q;setPlayers(data||[])})()},[profile.id,query]);
 async function addFriend(id:string){if(!supabase)return;await supabase.from("friendships").upsert({requester_id:profile.id,addressee_id:id,status:"pending"});setSent(s=>[...s,id])}
 return <div className="discover-page"><div className="discover-hero"><span className="eyebrow">DESCOBRIR</span><h1>Encontre quem joga<br/><em>o que você joga.</em></h1><p>Pesquise jogadores e encontre seu próximo squad.</p><div className="search-box"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar jogador ou username..."/></div></div><div className="section-head"><div><span className="eyebrow">JOGADORES</span><h2>{query?"Resultados":"Sugestões para você"}</h2></div></div><div className="players">{players.map((n,i)=><div className="player" key={n.id}><div className={"player-avatar a"+(i%4)}>{n.display_name?.[0]}</div><div><strong>{n.display_name}</strong><small>@{n.username} · {n.city||"Brasil"}</small><span>{n.status==="online"?"Online agora":"Gamer"}</span></div><button onClick={()=>addFriend(n.id)} disabled={sent.includes(n.id)}>{sent.includes(n.id)?"Solicitado":"Adicionar"}</button></div>)}</div></div>
}

function Communities({profile}:{profile:Profile}) {
 const [communities,setCommunities]=useState<any[]>([]);const [joined,setJoined]=useState<string[]>([]);
 async function load(){if(!supabase)return;const {data}=await supabase.from("communities").select("id,name,slug,description,member_count,game_id,games(name,accent)").order("member_count",{ascending:false});setCommunities(data||[]);const m=await supabase.from("community_members").select("community_id").eq("profile_id",profile.id);setJoined((m.data||[]).map(x=>x.community_id))}
 useEffect(()=>{load()},[profile.id]);
 async function toggle(c:any){if(!supabase)return;if(joined.includes(c.id))await supabase.from("community_members").delete().eq("community_id",c.id).eq("profile_id",profile.id);else await supabase.from("community_members").insert({community_id:c.id,profile_id:profile.id});await load()}
 return <div className="communities-page"><div className="section-head"><div><span className="eyebrow">COMUNIDADES</span><h1>Seu Orkut gamer.</h1><p className="muted">Encontre sua turma, entre, participe e construa sua reputação.</p></div><button className="primary" onClick={async()=>{const name=window.prompt("Nome da comunidade");if(!name?.trim()||!supabase)return;const description=window.prompt("Descrição curta")||"Comunidade criada no FORGE";const slug=name.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now();await supabase.from("communities").insert({name:name.trim(),slug,description,member_count:1});load()}}><Plus size={17}/> Criar comunidade</button></div><div className="community-grid">{communities.map(c=>{const g=Array.isArray(c.games)?c.games[0]:c.games;return <div className="community-card" key={c.id}><div className="community-cover" style={{"--accent":g?.accent||"#8b5cf6"} as React.CSSProperties}><span>{g?.name||"FORGE"}</span></div><div className="community-body"><h3>{c.name}</h3><p>{c.member_count} membros</p><small>{c.description}</small><button onClick={()=>toggle(c)}>{joined.includes(c.id)?"Sair da comunidade":"Entrar na comunidade"} <ChevronRight size={15}/></button></div></div>})}</div></div>
}

function Messages({profile}:{profile:Profile}) {
 const [friends,setFriends]=useState<Profile[]>([]);const [active,setActive]=useState<Profile|null>(null);const [messages,setMessages]=useState<any[]>([]);const [body,setBody]=useState("");
 useEffect(()=>{(async()=>{if(!supabase)return;const {data}=await supabase.from("friendships").select("requester_id,addressee_id").or("requester_id.eq."+profile.id+",addressee_id.eq."+profile.id).eq("status","accepted");const ids=(data||[]).map(f=>f.requester_id===profile.id?f.addressee_id:f.requester_id);if(ids.length){const r=await supabase.from("profiles").select("*").in("id",ids);setFriends(r.data||[])}})()},[profile.id]);
 async function loadMessages(other:Profile){setActive(other);if(!supabase)return;const {data}=await supabase.from("messages").select("*").or("and(sender_id.eq."+profile.id+",recipient_id.eq."+other.id+"),and(sender_id.eq."+other.id+",recipient_id.eq."+profile.id+")").order("created_at");setMessages(data||[])}
 async function send(){if(!supabase||!active||!body.trim())return;const {data}=await supabase.from("messages").insert({sender_id:profile.id,recipient_id:active.id,body:body.trim()}).select("*").single();if(data)setMessages(m=>[...m,data]);setBody("")}
 useEffect(()=>{if(!supabase||!active)return;const ch=supabase.channel("forge-chat-"+active.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:"recipient_id=eq."+profile.id},payload=>{if(payload.new.sender_id===active.id)setMessages(m=>[...m,payload.new])}).subscribe();return()=>{supabase.removeChannel(ch)}},[active?.id,profile.id]);
 return <div className="messages-page"><div className="section-head"><div><span className="eyebrow">CHAT</span><h1>Mensagens</h1></div></div><div className="chat-shell"><div className="conversation-list">{friends.length===0?<div className="chat-empty small"><p>Adicione amigos para começar a conversar.</p></div>:friends.map(f=><button className={"conversation "+(active?.id===f.id?"active":"")} key={f.id} onClick={()=>loadMessages(f)}><div className="mini-avatar">{f.display_name[0]}</div><div><strong>{f.display_name}</strong><small>@{f.username}</small></div></button>)}</div><div className="chat-panel">{active?<><div className="chat-title"><strong>{active.display_name}</strong><small>@{active.username}</small></div><div className="chat-messages">{messages.map(m=><div className={"bubble "+(m.sender_id===profile.id?"mine":"")} key={m.id}>{m.body}</div>)}</div><div className="chat-compose"><input value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Digite uma mensagem..."/><button className="primary" onClick={send}><Send size={14}/></button></div></>:<div className="chat-empty"><MessageCircle size={35}/><h3>Seu chat gamer</h3><p>Adicione amigos e combine sua próxima partida.</p></div>}</div></div></div>
}

function Profile({profile,games,setProfile}:{profile:Profile;games:Game[];setProfile:(p:Profile)=>void}) {
 const [name,setName]=useState(profile.display_name);const [bio,setBio]=useState(profile.bio||"");const [city,setCity]=useState(profile.city||"");const [avatar,setAvatar]=useState<File|null>(null);const [editing,setEditing]=useState(false);const [mine,setMine]=useState<any[]>([]);
 useEffect(()=>{(async()=>{if(!supabase)return;const {data}=await supabase.from("profile_games").select("game_id,hours,role,games(id,name,accent,genre)").eq("profile_id",profile.id);setMine(data||[])})()},[profile.id]);
 async function save(){if(!supabase)return;let avatar_url=profile.avatar_url;if(avatar){const ext=avatar.name.split(".").pop()||"jpg";const path=profile.id+"/avatar."+ext;const up=await supabase.storage.from("avatars").upload(path,avatar,{upsert:true,contentType:avatar.type});if(!up.error){avatar_url=supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl}}const {data,error}=await supabase.from("profiles").update({display_name:name,bio,city,avatar_url}).eq("id",profile.id).select("*").single();if(!error&&data){setProfile(data);setEditing(false)}}
 async function addGame(game:Game){if(!supabase)return;await supabase.from("profile_games").upsert({profile_id:profile.id,game_id:game.id,hours:0,role:"favorite"});const {data}=await supabase.from("profile_games").select("game_id,hours,role,games(id,name,accent,genre)").eq("profile_id",profile.id);setMine(data||[])}
 async function signOut(){await supabase?.auth.signOut()}
 return <div className="profile-page"><TempleProfile profile={profile} games={mine.map(x=>Array.isArray(x.games)?x.games[0]:x.games).filter(Boolean)}/><div className="profile-sections"><div><div className="section-head"><div><span className="eyebrow">IDENTIDADE</span><h2>Meu perfil</h2></div><button className="ghost" onClick={()=>setEditing(!editing)}><Settings size={14}/> {editing?"Cancelar":"Editar"}</button></div>{editing?<div className="post edit-form"><label>Foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setAvatar(e.target.files?.[0]||null)}/></label><label>Nome<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Cidade<input value={city} onChange={e=>setCity(e.target.value)} /></label><label>Bio<textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={500}/></label><button className="primary" onClick={save}>Salvar perfil</button></div>:<div className="post"><strong>{profile.display_name}</strong><p>{profile.bio||"Sua bio gamer ainda está vazia."}</p><small>@{profile.username} · {profile.city||"Brasil"}</small></div>}<button className="logout" onClick={signOut}><LogOut size={14}/> Sair da conta</button></div><div><div className="section-head"><div><span className="eyebrow">JOGOS</span><h2>Minha biblioteca gamer</h2></div></div><div className="profile-games">{mine.map(x=>{const g=Array.isArray(x.games)?x.games[0]:x.games;return g?<div key={g.id} className="profile-game"><i style={{background:g.accent}}>{g.name[0]}</i><div><strong>{g.name}</strong><small>{x.hours} horas · {x.role}</small></div><button onClick={()=>supabase?.from("profile_games").delete().eq("profile_id",profile.id).eq("game_id",g.id).then(()=>setMine(m=>m.filter(y=>y.game_id!==g.id)))}>×</button></div>:null})}</div><div className="game-picker">{games.filter(g=>!mine.some(m=>m.game_id===g.id)).map(g=><button key={g.id} onClick={()=>addGame(g)}><i style={{background:g.accent}}>{g.name[0]}</i>{g.name}</button>)}</div></div></div></div>
}

export function GamerNetwork(){
 const [tab,setTab]=useState<Tab>("home");const {profile,setProfile}=useCurrentProfile();const [games,setGames]=useState<Game[]>([]);
 const [deviceMode,setDeviceMode]=useState<"mobile"|"tablet"|"desktop">("desktop");
 useEffect(()=>{const detect=()=>{const width=Math.min(window.innerWidth,document.documentElement.clientWidth||window.innerWidth,window.visualViewport?.width||window.innerWidth);const touch=window.matchMedia("(pointer: coarse)").matches;setDeviceMode(width<=600?"mobile":width<=1024||(touch&&width<=1100)?"tablet":"desktop")};detect();window.addEventListener("resize",detect);window.addEventListener("orientationchange",detect);window.visualViewport?.addEventListener("resize",detect);return()=>{window.removeEventListener("resize",detect);window.removeEventListener("orientationchange",detect);window.visualViewport?.removeEventListener("resize",detect)}},[]);
 useEffect(()=>{if(!supabase)return;supabase.from("games").select("*").order("name").then(({data})=>setGames(data||[]))},[]);
 const activeGames=games.length?games:fallbackGames;
 const title=useMemo(()=>({home:"Início",discover:"Descobrir",communities:"Comunidades",messages:"Mensagens",profile:"Meu perfil"}[tab]),[tab]);
 if(!profile)return <div className="auth-screen"><div className="auth-card"><Gamepad2 size={28}/><p>Preparando seu perfil gamer...</p></div></div>;
 return <div className="gamer-app" data-device={deviceMode}><aside className="nav"><div className="brand"><div className="brand-mark"><Gamepad2 size={20}/></div><span>FORGE</span></div><nav>{[["home",Home,"Início"],["discover",Search,"Descobrir"],["communities",Users,"Comunidades"],["messages",MessageCircle,"Mensagens"],["profile",Shield,"Meu perfil"]].map(([id,Icon,label])=><button className={tab===id?"selected":""} onClick={()=>setTab(id as Tab)} key={id as string}><Icon size={18}/><span>{label as string}</span></button>)}</nav><div className="nav-user"><div className="mini-avatar">{profile.display_name[0]}</div><div><strong>{profile.display_name}</strong><small>LV.{profile.level} · {profile.xp} XP</small></div></div></aside><div className="app-main"><header><div><span className="mobile-brand">FORGE</span><span className="header-title">{title}</span></div><div className="header-actions"><button onClick={()=>setTab("discover")} aria-label="Buscar"><Search size={18}/></button><button onClick={()=>window.alert("Notificações do FORGE estarão aqui: novos amigos, curtidas e comunidades.")} aria-label="Notificações"><Bell size={18}/><i/></button><div className="mini-avatar">{profile.display_name[0]}</div></div></header><div className="content">{tab==="home"&&<><HomeWelcome profile={profile} games={activeGames}/><HomeFeed profile={profile} games={activeGames}/></>} {tab==="discover"&&<Discover profile={profile} games={activeGames}/>} {tab==="communities"&&<Communities profile={profile}/>} {tab==="messages"&&<Messages profile={profile}/>} {tab==="profile"&&<Profile profile={profile} games={activeGames} setProfile={setProfile}/>}</div></div><div className="mobile-nav">{[["home",Home],["discover",Search],["communities",Users],["messages",MessageCircle],["profile",Shield]].map(([id,Icon])=><button className={tab===id?"selected":""} onClick={()=>setTab(id as Tab)} key={id as string}><Icon size={20}/><small>{id==="home"?"Início":id==="discover"?"Buscar":id==="communities"?"Comunidades":id==="messages"?"Chat":"Perfil"}</small></button>)}</div></div>
}
