import { useMemo, useState } from "react";
import { Gamepad2, Home, Users, MessageCircle, Search, Bell, Plus, MapPin, Trophy, Shield, Sparkles, ChevronRight } from "lucide-react";

type Tab = "home" | "discover" | "communities" | "messages" | "profile";

const games = [
  { name: "VALORANT", tag: "FPS", color: "#ff4655", icon: "V" },
  { name: "Fortnite", tag: "Battle Royale", color: "#7658ff", icon: "F" },
  { name: "GTA V", tag: "Open World", color: "#d7a83f", icon: "G" },
  { name: "Minecraft", tag: "Sandbox", color: "#55b66b", icon: "M" },
];

const badges = [
  { icon: "♛", name: "Lenda", rarity: "LENDÁRIA" },
  { icon: "⚔", name: "Competidor", rarity: "ÉPICA" },
  { icon: "✦", name: "Colecionador", rarity: "RARA" },
  { icon: "◈", name: "Primeiro Spawn", rarity: "COMUM" },
];

const communities = [
  { name: "VALORANT BRASIL", members: "128 mil", game: "VALORANT", accent: "#ff4655" },
  { name: "GTA V ONLINE", members: "94 mil", game: "GTA V", accent: "#d7a83f" },
  { name: "MINECRAFT BR", members: "81 mil", game: "Minecraft", accent: "#55b66b" },
];

function TempleProfile() {
  return (
    <section className="temple-card">
      <div className="temple-bg"><div className="orb orb-a" /><div className="orb orb-b" /><div className="grid-floor" /></div>
      <div className="temple-content">
        <div className="temple-top"><span>GAMER TEMPLE</span><button><Sparkles size={15}/> Personalizar</button></div>
        <div className="temple-hero">
          <div className="avatar-frame"><div className="avatar">P</div><span className="online" /></div>
          <div><p className="eyebrow">NÍVEL 47 · COMPETIDOR</p><h1>Patrick</h1><p className="muted"><MapPin size={13}/> São Leopoldo · Brasil</p></div>
        </div>
        <div className="stats"><div><strong>38</strong><span>JOGOS</span></div><div><strong>142</strong><span>INSÍGNIAS</span></div><div><strong>1.8K</strong><span>XP</span></div><div><strong>23</strong><span>AMIGOS</span></div></div>
        <div className="game-row">{games.map(g=><div className="game-pill" key={g.name}><i style={{background:g.color}}>{g.icon}</i><span>{g.name}</span></div>)}</div>
      </div>
    </section>
  );
}

function HomeFeed() {
  return <div className="page-grid">
    <main>
      <TempleProfile />
      <div className="section-head"><div><span className="eyebrow">ATIVIDADE</span><h2>Seu universo gamer</h2></div><button className="ghost"><Plus size={16}/> Publicar</button></div>
      <article className="post">
        <div className="post-head"><div className="mini-avatar">P</div><div><strong>Patrick</strong><span> · agora</span><small>Está jogando VALORANT</small></div><button>•••</button></div>
        <p>Finalmente subi de elo. 🔥 Quem estiver procurando duo, manda convite.</p>
        <div className="post-game"><span style={{background:"#ff4655"}}>V</span><div><strong>VALORANT</strong><small>Competitivo · Online</small></div><b>DIAMANTE</b></div>
        <div className="post-actions"><button>♡ 24</button><button>💬 8 comentários</button><button>↗ Compartilhar</button></div>
      </article>
      <article className="post">
        <div className="post-head"><div className="mini-avatar blue">L</div><div><strong>Lucas</strong><span> · 12 min</span><small>Entrou em uma comunidade</small></div></div>
        <p>Alguém de São Leopoldo joga GTA Online hoje?</p>
        <div className="location-card"><MapPin size={17}/><div><strong>Jogadores próximos</strong><small>14 gamers jogando GTA V perto de você</small></div><ChevronRight size={17}/></div>
        <div className="post-actions"><button>♡ 11</button><button>💬 3 comentários</button><button>↗ Compartilhar</button></div>
      </article>
    </main>
    <aside>
      <div className="side-card"><div className="side-title"><span>INSÍGNIAS</span><Trophy size={16}/></div><div className="badge-grid">{badges.map(b=><div className="badge" key={b.name}><span>{b.icon}</span><strong>{b.name}</strong><small>{b.rarity}</small></div>)}</div><button className="full-btn">Ver coleção</button></div>
      <div className="side-card"><div className="side-title"><span>COMUNIDADES</span><button>Ver todas</button></div>{communities.map(c=><div className="community-row" key={c.name}><i style={{background:c.accent}}>{c.game[0]}</i><div><strong>{c.name}</strong><small>{c.members} membros</small></div><ChevronRight size={15}/></div>)}</div>
    </aside>
  </div>;
}

function Discover() {
  return <div className="discover-page"><div className="discover-hero"><span className="eyebrow">DESCOBRIR</span><h1>Encontre quem joga<br/><em>o que você joga.</em></h1><p>Jogadores, comunidades e squads próximos de você.</p><div className="search-box"><Search size={19}/><input placeholder="Buscar jogador, jogo ou comunidade..." /></div></div><div className="section-head"><div><span className="eyebrow">PERTO DE VOCÊ</span><h2>Jogadores próximos</h2></div><span className="distance">até 10 km</span></div><div className="players">{["João","Lucas","Matheus","Rafael"].map((n,i)=><div className="player" key={n}><div className={"player-avatar a"+i}>{n[0]}</div><div><strong>{n}</strong><small>🎮 {games[i].name} · {2+i} km</small><span>Online agora</span></div><button>Ver perfil</button></div>)}</div></div>;
}

function Communities() {
  return <div className="communities-page"><div className="section-head"><div><span className="eyebrow">COMUNIDADES</span><h1>Seu Orkut gamer.</h1><p className="muted">Entre nas comunidades que fazem parte da sua história.</p></div><button className="primary"><Plus size={17}/> Criar comunidade</button></div><div className="community-grid">{communities.concat([{name:"FPS BRASIL",members:"56 mil",game:"FPS",accent:"#8b5cf6"},{name:"RPG & FANTASIA",members:"31 mil",game:"RPG",accent:"#d05cff"}]).map(c=><div className="community-card" key={c.name}><div className="community-cover" style={{"--accent":c.accent} as React.CSSProperties}><span>{c.game}</span></div><div className="community-body"><h3>{c.name}</h3><p>{c.members} membros</p><button>Entrar na comunidade <ChevronRight size={15}/></button></div></div>)}</div></div>;
}

function Messages() {
  return <div className="messages-page"><div className="section-head"><div><span className="eyebrow">CHAT</span><h1>Mensagens</h1></div><button className="ghost"><Plus size={16}/> Nova conversa</button></div><div className="chat-shell"><div className="conversation-list">{["Lucas","João","Rafael","Matheus"].map((n,i)=><div className={"conversation "+(i===0?"active":"")} key={n}><div className={"mini-avatar a"+i}>{n[0]}</div><div><strong>{n}</strong><small>{["Bora duo hoje?","Você subiu de elo?","Entrei na comunidade","🔥🔥🔥"][i]}</small></div><span>{i+1}</span></div>)}</div><div className="chat-empty"><MessageCircle size={35}/><h3>Seu chat gamer</h3><p>Converse com amigos, combine partidas e monte seu squad.</p></div></div></div>;
}

function Profile() {
  return <div className="profile-page"><TempleProfile /><div className="profile-sections"><div><div className="section-head"><div><span className="eyebrow">COLEÇÃO</span><h2>Insígnias conquistadas</h2></div></div><div className="big-badges">{badges.concat(badges).map((b,i)=><div className="big-badge" key={i}><span>{b.icon}</span><strong>{b.name}</strong><small>{b.rarity}</small></div>)}</div></div><div><div className="section-head"><div><span className="eyebrow">JOGOS</span><h2>Minha biblioteca gamer</h2></div></div><div className="profile-games">{games.concat(games).map((g,i)=><div key={i} className="profile-game"><i style={{background:g.color}}>{g.icon}</i><div><strong>{g.name}</strong><small>{120+i*43} horas · principal</small></div><b>LV.{12+i}</b></div>)}</div></div></div></div>;
}

export function GamerNetwork() {
  const [tab,setTab]=useState<Tab>("home");
  const title=useMemo(()=>({home:"Início",discover:"Descobrir",communities:"Comunidades",messages:"Mensagens",profile:"Meu perfil"}[tab]),[tab]);
  return <div className="gamer-app">
    <aside className="nav">
      <div className="brand"><div className="brand-mark"><Gamepad2 size={20}/></div><span>FORGE</span></div>
      <nav>{[["home",Home,"Início"],["discover",Search,"Descobrir"],["communities",Users,"Comunidades"],["messages",MessageCircle,"Mensagens"],["profile",Shield,"Meu perfil"]].map(([id,Icon,label])=><button className={tab===id?"selected":""} onClick={()=>setTab(id as Tab)} key={id as string}><Icon size={18}/><span>{label as string}</span></button>)}</nav>
      <div className="nav-user"><div className="mini-avatar">P</div><div><strong>Patrick</strong><small>LV.47 · 1.8K XP</small></div></div>
    </aside>
    <div className="app-main"><header><div><span className="mobile-brand">FORGE</span><span className="header-title">{title}</span></div><div className="header-actions"><button><Search size={18}/></button><button><Bell size={18}/><i /></button><div className="mini-avatar">P</div></div></header><div className="content">{tab==="home"&&<HomeFeed/>}{tab==="discover"&&<Discover/>}{tab==="communities"&&<Communities/>}{tab==="messages"&&<Messages/>}{tab==="profile"&&<Profile/>}</div></div>
    <div className="mobile-nav">{[["home",Home],["discover",Search],["communities",Users],["messages",MessageCircle],["profile",Shield]].map(([id,Icon])=><button className={tab===id?"selected":""} onClick={()=>setTab(id as Tab)} key={id as string}><Icon size={20}/><small>{id==="home"?"Início":id==="discover"?"Buscar":id==="communities"?"Comunidades":id==="messages"?"Chat":"Perfil"}</small></button>)}</div>
  </div>;
}
