import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    useNavigate,
    useParams,
    useSearchParams,
    Outlet,
    useLocation,
} from "react-router-dom";
import {
    CalendarDays,
    Users,
    MessagesSquare,
    CalendarCheck,
    UserRound,
    LogOut,
    GraduationCap,
    Menu,
    Plus,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";
import { api } from "./api.js";
import MiniCalendar from "./components/MiniCalendar.jsx";
import EventRegistrationButton from "./components/EventRegistrationButton.jsx";

const storeKey = "conrapp_demo_token";
function getToken() {
    return sessionStorage.getItem(storeKey);
}

function AppShell({ user, onLogout }) {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarDate, setSidebarDate] = useState(() => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get("date");

        if (/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
            setSidebarDate(date);
        }
    }, [location.search]);

    function handleSidebarDateSelect(date) {
        setSidebarDate(date);
        navigate(`/?date=${date}`);
        setOpen(false);
    }
    const links = [
        ["/", "Calendário", CalendarDays],
        ["/comunidades", "Comunidades", Users],
        ["/discussoes", "Discussões", MessagesSquare],
        ["/eventos", "Eventos", CalendarCheck],
        ["/perfil", "Meu Perfil", UserRound],
    ];
    return (
        <div className="shell">
            <aside className={"sidebar " + (open ? "visible" : "")}>
                <div className="brand">
                    <GraduationCap size={28} />
                    <span>CONRAPP</span>
                </div>
                <p className="side-label">MENU PRINCIPAL</p>
                <nav>
                    {links.map(([path, label, Icon]) => (
                        <NavLink
                            onClick={() => setOpen(false)}
                            key={path}
                            to={path}
                            end={path === "/"}
                            className={({ isActive }) => (isActive ? "nav active" : "nav")}
                        >
                            <Icon size={19} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-calendar">
                    <p className="side-label">CALENDÁRIO</p>

                    <MiniCalendar
                        selectedDate={sidebarDate}
                        onDateSelect={handleSidebarDateSelect}
                    />
                </div>

                <div className="side-bottom">
                    <div className="avatar small">{user.name.slice(0, 1)}</div>
                    <div>
                        <strong>{user.name}</strong>
                        <small>{user.role === "professor" ? "Professor" : "Aluno"}</small>
                    </div>
                    <button onClick={onLogout} aria-label="Sair" title="Sair">
                        <LogOut size={19} />
                    </button>
                </div>
            </aside>
            <div className="main">
                <header className="top">
                    <button
                        className="mobile-menu"
                        onClick={() => setOpen(!open)}
                        aria-label="Abrir menu"
                    >
                        <Menu />
                    </button>
                    <div className="top-title">Comunidade Acadêmica</div>
                    <div className="top-user">
                        <span className="status-dot" />
                        {user.name}{" "}
                        <span className="role">
                            {user.role === "professor" ? "Professor" : "Aluno"}
                        </span>
                    </div>
                </header>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
function Login({ onLogin }) {
    const [email, setEmail] = useState("aluno@conrapp.demo"),
        [password, setPassword] = useState("Aluno123!"),
        [show, setShow] = useState(false),
        [error, setError] = useState(""),
        [busy, setBusy] = useState(false);
    async function submit(e) {
        e.preventDefault();
        setError("");
        if (!email.trim() || !password.trim()) {
            setError("Preencha o e-mail e a senha.");
            return;
        }
        setBusy(true);
        try {
            const data = await api("/auth/login", {
                method: "POST",
                body: { email, password },
            });
            onLogin(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }
    return (
        <div className="login-layout">
            <div className="login-hero">
                <div className="brand big">
                    <GraduationCap size={32} /> CONRAPP
                </div>
                <div className="hero-content">
                    <span className="eyebrow">CONECTE • COMPARTILHE • APRENDA</span>
                    <h1>
                        Seu espaço para <em>conectar ideias</em> e construir conhecimento.
                    </h1>
                    <p>Comunidades, discussões e eventos acadêmicos em um só lugar.</p>
                    <div className="hero-illustration">
                        <div className="bubble b1">💬 Discussões</div>
                        <div className="illustration-people">🎓 👩🏽‍💻 📚</div>
                        <div className="bubble b2">📅 Eventos</div>
                    </div>
                </div>
                <small>CONRAPP — Projeto Acadêmico</small>
            </div>
            <div className="login-form-wrap">
                <div className="login-card">
                    <div className="mobile-brand">
                        <GraduationCap /> CONRAPP
                    </div>
                    <h2>Bem-vindo de volta!</h2>
                    <p>Entre com seus dados para acessar a comunidade.</p>
                    <form onSubmit={submit}>
                        <label>
                            E-mail
                            <input
                                type="email"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seuemail@exemplo.com"
                            />
                        </label>
                        <label>
                            Senha
                            <div className="password">
                                <input
                                    type={show ? "text" : "password"}
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                                    onClick={() => setShow(!show)}
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </label>
                        {error && (
                            <div role="alert" className="error">
                                {error}
                            </div>
                        )}
                        <button className="primary full" disabled={busy}>
                            {busy ? "Entrando..." : "Entrar na plataforma"}{" "}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                    <div className="demo-help">
                        <strong>Contas para demonstração</strong>
                        <p>Aluno: aluno@conrapp.demo / Aluno123!</p>
                        <p>Professor: professor@conrapp.demo / Professor123!</p>
                        <div className="demo-actions">
                            <button
                                onClick={() => {
                                    setEmail("aluno@conrapp.demo");
                                    setPassword("Aluno123!");
                                }}
                            >
                                Usar aluno
                            </button>
                            <button
                                onClick={() => {
                                    setEmail("professor@conrapp.demo");
                                    setPassword("Professor123!");
                                }}
                            >
                                Usar professor
                            </button>
                        </div>
                    </div>
                    <small>
                        Cadastro e recuperação de senha serão implementados em outras
                        histórias de usuário.
                    </small>
                </div>
            </div>
        </div>
    );
}
function useData(path, token, dep = "") {
    const [data, setData] = useState(null),
        [error, setError] = useState("");
    useEffect(() => {
        let live = true;
        setData(null);
        setError("");
        api(path, { token })
            .then((d) => {
                if (live) setData(d);
            })
            .catch((e) => {
                if (live) setError(e.message);
            });
        return () => {
            live = false;
        };
    }, [path, token, dep]);
    return { data, error, setData };
}
function Heading({ label, title, description, children }) {
    return (
        <div className="page-heading">
            <div>
                <span className="eyebrow blue">{label}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {children}
        </div>
    );
}
const EVENT_COLORS = {
    workshop: "#DCFCE7",   // Verde
    community: "#EDE9FE",  // Roxo
    lecture: "#FEF3C7",    // Amarelo
    exam: "#FEE2E2",       // Vermelho
};

function getEventColor(category) {
    return EVENT_COLORS[category] || "#F8FAFC";
}

function Calendar({ token }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const dateParam = searchParams.get("date");

    const isValidDate = (value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
            return false;
        }

        const parsed = new Date(`${value}T12:00:00`);

        if (Number.isNaN(parsed.getTime())) {
            return false;
        }

        return (
            parsed.getFullYear() === Number(value.slice(0, 4)) &&
            parsed.getMonth() + 1 === Number(value.slice(5, 7)) &&
            parsed.getDate() === Number(value.slice(8, 10))
        );
    };

    const selected = isValidDate(dateParam) ? dateParam : null;

    const today = new Date();

    const selectedDate = selected
        ? new Date(`${selected}T12:00:00`)
        : today;

    const [offset, setOffset] = useState(0);

    const current = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + offset,
        1
    );

    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = (current.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();

    const { data, error } = useData("/calendar", token);
    const events = data || [];

    function selectDate(date) {
        setSearchParams({ date });
        setOffset(0);
    }
    const dateKey = (day) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const selectedEvents = events.filter((e) => e.date === selected);
    return (
        <>
            <Heading
                label="PÁGINA INICIAL"
                title="Calendário Acadêmico"
                description="Consulte os eventos das comunidades das quais você participa."
            />
            <div className="calendar-grid">
                <section className="panel">
                    <div className="calendar-toolbar">
                        <h2>
                            {current.toLocaleDateString("pt-BR", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h2>
                        <div>
                            <button className="ghost" onClick={() => setOffset((n) => n - 1)}>
                                ‹ Anterior
                            </button>
                            <button
                                className="ghost"
                                onClick={() => {
                                    setOffset(0);
                                    setSearchParams({});
                                }}
                            >
                                Hoje
                            </button>
                            <button className="ghost" onClick={() => setOffset((n) => n + 1)}>
                                Próximo ›
                            </button>
                        </div>
                    </div>
                    <div className="month-grid">
                        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                            <b key={d} className="week-label">
                                {d}
                            </b>
                        ))}
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div className="day empty" key={"empty" + i} />
                        ))}
                        {Array.from({ length: days }, (_, i) => {
                            const day = i + 1,
                                key = dateKey(day),
                                mine = events.filter((e) => e.date === key);
                            const categories = [...new Set(mine.map((e) => e.category))];

                            const dayColor =
                                categories.length === 1
                                    ? getEventColor(categories[0])
                                    : "#F8FAFC";
                            return (

                                <button
                                    key={day}
                                    onClick={() => selectDate(key)}
                                    className={"day " + (selected === key ? "selected" : "")}
                                    style={{ backgroundColor: dayColor }}
                                >
                                    <strong>{day}</strong>
                                    {mine.map((e) => (
                                        <span
                                            title={e.title}
                                            key={e.id}
                                            className="event-chip"
                                            style={{
                                                backgroundColor: getEventColor(e.category),
                                                color: "#1E293B",
                                            }}
                                        >
                                            {e.title}
                                        </span>
                                    ))}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <aside className="panel aside-panel">
                    <h3>Eventos do dia</h3>

                    <p className="muted">
                        {selected
                            ? new Date(selected + "T12:00:00").toLocaleDateString("pt-BR")
                            : "Selecione um dia no calendário"}
                    </p>

                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((e) => (
                            <div
                                className="event-row"
                                key={e.id}
                                style={{
                                    backgroundColor: getEventColor(e.category),
                                    borderLeft: "4px solid #64748B",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <b>{e.title}</b>
                                <small>
                                    {e.time} • {e.description}
                                </small>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            Nenhum evento para esta data.
                        </div>
                    )}

                    <hr />

                    <h3>Próximos eventos</h3>

                    {events
                        .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(0, 4)
                        .map((e) => (
                            <div
                                className="event-row"
                                key={e.id}
                                style={{
                                    backgroundColor: getEventColor(e.category),
                                    borderLeft: "4px solid #64748B",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <b>{e.title}</b>
                                <small>
                                    {new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR")}
                                    {" às "}
                                    {e.time}
                                </small>
                            </div>
                        ))}

                    {error && <p className="error">{error}</p>}

                    <small className="muted">
                        Nesta sprint, o calendário mostra eventos de comunidades
                        participantes. Cadastro de atividades e inscrições entram nas
                        próximas HUs.
                    </small>
                </aside>

            </div>
        </>
    );
}
function Communities({ token }) {
    const [version, setVersion] = useState(0),
        [loading, setLoading] = useState(null),
        [error, setError] = useState("");
    const { data } = useData("/communities", token, version);
    const nav = useNavigate();
    async function join(id) {
        setLoading(id);
        setError("");
        try {
            await api(`/communities/${id}/join`, { token, method: "POST" });
            setVersion((v) => v + 1);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    }
    return (
        <>
            <Heading
                label="CONEXÕES"
                title="Comunidades Acadêmicas"
                description="Encontre pessoas e assuntos relacionados aos seus estudos."
            />

            <div className="academic-community-grid">
                {(data || []).map((c) => (
                    <article className="academic-community-card" key={c.id}>
                        <div
                            className={`academic-community-cover ${c.category === "Eventos"
                                ? "community-theme-events"
                                : c.name === "Banco de Dados"
                                    ? "community-theme-database"
                                    : "community-theme-web"
                                }`}
                        >
                            <span className="academic-community-mark">
                                CONRAPP / COMUNIDADES
                            </span>

                            <div className="academic-community-cover-bottom">
                                <span className="academic-community-symbol">
                                    {c.category === "Eventos" ? "📅" : "💻"}
                                </span>

                                <span className="academic-community-category">
                                    {c.category}
                                </span>
                            </div>
                        </div>

                        <div className="academic-community-body">
                            <h3>{c.name}</h3>

                            <p className="academic-community-description">
                                {c.description}
                            </p>

                            <div className="academic-community-members">
                                <Users size={16} />
                                <span>{c.members} participantes</span>
                            </div>

                            <div className="academic-community-actions">
                                {c.joined ? (
                                    <button
                                        className="primary"
                                        onClick={() =>
                                            nav(`/comunidades/${c.id}`)
                                        }
                                    >
                                        Abrir comunidade
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="outline"
                                            onClick={() =>
                                                nav(`/comunidades/${c.id}`)
                                            }
                                        >
                                            Detalhes
                                        </button>

                                        <button
                                            className="primary"
                                            disabled={loading === c.id}
                                            onClick={() => join(c.id)}
                                        >
                                            Participar
                                            <Plus size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {error && (
                <p role="alert" className="error">
                    {error}
                </p>
            )}
        </>
    );
}
function CommunityDetail({ token }) {
    const { id } = useParams(),
        [rev, setRev] = useState(0),
        [text, setText] = useState(""),
        [commentsText, setCommentsText] = useState({}),
        [error, setError] = useState("");
    const community = useData(`/communities/${id}`, token, rev),
        postData = useData(`/communities/${id}/posts`, token, rev);
    async function run(action) {
        setError("");
        try {
            await action();
            setRev((n) => n + 1);
        } catch (e) {
            setError(e.message);
        }
    }
    const c = community.data;
    if (!c)
        return (
            <div className="panel">
                {community.error || "Carregando comunidade..."}
            </div>
        );
    return (
        <>
            <Heading label="COMUNIDADE" title={c.name} description={c.description} />
            {!c.joined ? (
                <div className="panel">
                    <p>
                        Entre para consultar as publicações e participar das discussões.
                    </p>
                    <button
                        className="primary"
                        onClick={() =>
                            run(() =>
                                api(`/communities/${id}/join`, { token, method: "POST" }),
                            )
                        }
                    >
                        Participar desta comunidade
                    </button>
                </div>
            ) : (
                <>
                    <section className="panel compose">
                        <h3>Nova publicação</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                run(async () => {
                                    await api(`/communities/${id}/posts`, {
                                        token,
                                        method: "POST",
                                        body: { content: text },
                                    });
                                    setText("");
                                });
                            }}
                        >
                            <textarea
                                maxLength={2000}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Compartilhe uma dúvida ou informação acadêmica..."
                            />
                            <button disabled={!text.trim()} className="primary">
                                Publicar <ArrowRight size={16} />
                            </button>
                        </form>
                    </section>
                    {postData.error && <p className="error">{postData.error}</p>}
                    {(postData.data || []).map((post) => (
                        <article className="panel post" key={post.id}>
                            <div className="post-by">
                                <div className="avatar">{post.author[0]}</div>
                                <div>
                                    <strong>{post.author}</strong>
                                    <small>
                                        {new Date(post.createdAt).toLocaleString("pt-BR")}
                                    </small>
                                </div>
                            </div>
                            <p>{post.content}</p>
                            <div className="comments">
                                <strong>Comentários ({post.comments.length})</strong>
                                {post.comments.map((com) => (
                                    <div className="comment" key={com.id}>
                                        <b>{com.author}</b>
                                        <p>{com.content}</p>
                                    </div>
                                ))}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        run(async () => {
                                            await api(`/posts/${post.id}/comments`, {
                                                token,
                                                method: "POST",
                                                body: { content: commentsText[post.id] || "" },
                                            });
                                            setCommentsText((old) => ({ ...old, [post.id]: "" }));
                                        });
                                    }}
                                >
                                    <input
                                        maxLength={1000}
                                        placeholder="Escreva um comentário..."
                                        value={commentsText[post.id] || ""}
                                        onChange={(e) =>
                                            setCommentsText((old) => ({
                                                ...old,
                                                [post.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <button
                                        className="outline"
                                        disabled={!(commentsText[post.id] || "").trim()}
                                    >
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        </article>
                    ))}
                </>
            )}
            {error && (
                <p className="error" role="alert">
                    {error}
                </p>
            )}
        </>
    );
}
function Discussions({ token }) {
    const nav = useNavigate(),
        { data } = useData("/communities", token);
    return (
        <>
            <Heading
                label="CONVERSAS"
                title="Discussões"
                description="Acesse as discussões das comunidades em que você participa."
            />

            <div className="academic-discussion-grid">
                {(data || [])
                    .filter((c) => c.joined)
                    .map((c) => (
                        <article
                            className="academic-discussion-card"
                            key={c.id}
                        >
                            <div
                                className={`academic-discussion-cover ${c.category === "Eventos"
                                        ? "community-theme-events"
                                        : c.name === "Banco de Dados"
                                            ? "community-theme-database"
                                            : "community-theme-web"
                                    }`}
                            >
                                <span className="academic-discussion-mark">
                                    CONRAPP / DISCUSSÕES
                                </span>

                                <div className="academic-discussion-cover-bottom">
                                    <span className="academic-discussion-symbol">
                                        💬
                                    </span>

                                    <span className="academic-discussion-category">
                                        {c.category}
                                    </span>
                                </div>
                            </div>

                            <div className="academic-discussion-body">
                                <h3>{c.name}</h3>

                                <p className="academic-discussion-description">
                                    {c.description}
                                </p>

                                <div className="academic-discussion-info">
                                    <Users size={16} />
                                    <span>
                                        Discussões da comunidade
                                    </span>
                                </div>

                                <button
                                    className="primary academic-discussion-button"
                                    onClick={() =>
                                        nav(`/comunidades/${c.id}`)
                                    }
                                >
                                    Ver discussões
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </article>
                    ))}
            </div>

        </>
    );
}

function Events({ token, user }) {
    const { data, error } = useData("/events", token);
    const { data: communities } = useData("/communities", token);

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [formError, setFormError] = useState("");
    const [createdEvents, setCreatedEvents] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "workshop",
        communityId: "",
    });

    const isProfessor = user?.role === "professor";

    const joinedCommunities = (communities || []).filter(
        (community) => community.joined
    );

    const events = [
        ...(data || []).filter(
            (event) => !createdEvents.some((created) => created.id === event.id)
        ),
        ...createdEvents,
    ];

    const filteredEvents = events
        .filter((event) => {
            const matchesSearch = [
                event.title,
                event.description,
            ].some((value) =>
                String(value || "")
                    .toLocaleLowerCase("pt-BR")
                    .includes(searchTerm.trim().toLocaleLowerCase("pt-BR"))
            );

            const matchesCategory =
                categoryFilter === "all" ||
                event.category === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) =>
            `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
        );

    function updateField(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function createEvent(event) {
        event.preventDefault();

        setSaving(true);
        setFormError("");
        setMessage("");

        try {
            const result = await api("/events", {
                token,
                method: "POST",
                body: {
                    ...form,
                    communityId: Number(form.communityId),
                },
            });

            setCreatedEvents((previous) => [
                ...previous,
                result.event,
            ]);

            setMessage("Evento cadastrado com sucesso!");
            setShowForm(false);

            setForm({
                title: "",
                description: "",
                date: "",
                time: "",
                category: "workshop",
                communityId: "",
            });
        } catch (error) {
            setFormError(
                error.message || "Não foi possível cadastrar o evento."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Heading
                label="AGENDA ACADÊMICA"
                title="Eventos Acadêmicos"
                description="Descubra atividades, workshops e encontros das suas comunidades."
            />

            <div className="events-toolbar">
                <div>
                    <h2>Explore os próximos eventos</h2>
                    <p className="muted">
                        Aprenda, participe e conecte-se à comunidade acadêmica.
                    </p>
                </div>

                {isProfessor && (
                    <button
                        type="button"
                        className="event-primary-button"
                        onClick={() => {
                            setShowForm((previous) => !previous);
                            setFormError("");
                            setMessage("");
                        }}
                    >
                        <Plus size={18} />
                        {showForm ? "Fechar formulário" : "Criar evento"}
                    </button>
                )}
            </div>

            {message && (
                <div className="event-feedback success" role="status">
                    {message}
                </div>
            )}

            {isProfessor && showForm && (
                <form className="event-form" onSubmit={createEvent}>
                    <h3>Novo evento acadêmico</h3>

                    <div className="event-form-grid">
                        <label>
                            Título
                            <input
                                name="title"
                                value={form.title}
                                onChange={updateField}
                                maxLength={120}
                                placeholder="Ex.: Workshop de React"
                                required
                            />
                        </label>

                        <label>
                            Comunidade organizadora
                            <select
                                name="communityId"
                                value={form.communityId}
                                onChange={updateField}
                                required
                            >
                                <option value="">Selecione</option>

                                {joinedCommunities.map((community) => (
                                    <option key={community.id} value={community.id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Data
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={updateField}
                                required
                            />
                        </label>

                        <label>
                            Horário
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={updateField}
                                required
                            />
                        </label>

                        <label>
                            Categoria
                            <select
                                name="category"
                                value={form.category}
                                onChange={updateField}
                            >
                                <option value="workshop">Workshop</option>
                                <option value="lecture">Palestra</option>
                                <option value="community">Encontro</option>
                                <option value="exam">Prova</option>
                            </select>
                        </label>
                    </div>

                    <label className="event-description-field">
                        Descrição
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={updateField}
                            maxLength={2000}
                            rows={4}
                            placeholder="Descreva o objetivo e o conteúdo do evento."
                            required
                        />
                    </label>

                    {formError && (
                        <p className="event-feedback error" role="alert">
                            {formError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="event-primary-button"
                        disabled={saving || joinedCommunities.length === 0}
                    >
                        {saving ? "Salvando..." : "Cadastrar evento"}
                    </button>
                </form>
            )}

            {error && <p role="alert">{error.message}</p>}


            <div className="events-filters">
                <label className="events-search">
                    <span>Buscar eventos</span>

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar por título ou descrição..."
                    />
                </label>

                <label className="events-category-filter">
                    <span>Categoria</span>

                    <select
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                        <option value="all">Todas as categorias</option>
                        <option value="workshop">Workshops</option>
                        <option value="lecture">Palestras</option>
                        <option value="community">Encontros</option>
                        <option value="exam">Provas</option>
                    </select>
                </label>
            </div>

            <p className="events-result-count">
                {filteredEvents.length} evento(s) encontrado(s)
            </p>

            <div className="events-discovery-grid">
                {filteredEvents.map((event) => {
                    const categoryInfo = {
                        workshop: {
                            label: "Workshop",
                            theme: "workshop",
                        },
                        lecture: {
                            label: "Palestra",
                            theme: "lecture",
                        },
                        community: {
                            label: "Encontro",
                            theme: "community",
                        },
                        exam: {
                            label: "Prova",
                            theme: "exam",
                        },
                    }[event.category] || {
                        label: "Evento",
                        theme: "default",
                    };

                    const date = new Date(`${event.date}T12:00:00`);

                    const formattedDate = date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                    });

                    const isPast = `${event.date}T${event.time}` <
                        `${new Date().getFullYear()}-${String(
                            new Date().getMonth() + 1
                        ).padStart(2, "0")}-${String(
                            new Date().getDate()
                        ).padStart(2, "0")}T${new Date()
                            .toTimeString()
                            .slice(0, 5)}`;

                    const communityName = (communities || []).find(
                        (community) => community.id === event.communityId
                    )?.name || "Comunidade acadêmica";

                    return (
                        <article
                            key={event.id}
                            className="academic-event-card"
                        >
                            <div
                                className={`academic-event-cover theme-${categoryInfo.theme}`}
                            >
                                <span className="academic-cover-mark">
                                    CONRAPP / EVENTOS
                                </span>

                                <CalendarDays size={38} strokeWidth={1.5} />

                                <span className="academic-cover-category">
                                    {categoryInfo.label}
                                </span>
                            </div>

                            <div className="academic-event-body">
                                <div className="academic-event-meta">
                                    <span>{formattedDate}</span>
                                    <span>•</span>
                                    <span>{event.time}</span>

                                    {isPast && (
                                        <span className="academic-event-past">
                                            Encerrado
                                        </span>
                                    )}
                                </div>

                                <h3>{event.title}</h3>

                                <p className="academic-event-description">
                                    {event.description}
                                </p>

                                <div className="academic-event-community">
                                    <Users size={15} />
                                    <span>{communityName}</span>
                                </div>

                                <EventRegistrationButton
                                    eventId={event.id}
                                    token={token}
                                    eventDate={event.date}
                                    eventTime={event.time}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}

function Profile({ user }) {
    return (
        <>
            <Heading
                label="CONTA"
                title="Meu Perfil"
                description="Dados de demonstração para os perfis de aluno e professor."
            />
            <div className="panel profile">
                <div className="avatar large">{user.name[0]}</div>
                <h2>{user.name}</h2>
                <span className="tag">
                    {user.role === "professor" ? "Professor" : "Aluno"}
                </span>
                <dl>
                    <dt>E-mail</dt>
                    <dd>{user.email}</dd>
                    <dt>Instituição</dt>
                    <dd>{user.institution}</dd>
                    <dt>Curso / atuação</dt>
                    <dd>{user.course}</dd>
                </dl>
                <small>Edição de perfil: HU-007 (a desenvolver).</small>
            </div>
        </>
    );
}
export default function App() {
    const [token, setToken] = useState(getToken()),
        [user, setUser] = useState(null),
        [loading, setLoading] = useState(!!getToken());
    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        let alive = true;
        setLoading(true);
        api("/auth/me", { token })
            .then((d) => {
                if (alive) setUser(d.user);
            })
            .catch(() => {
                if (alive) {
                    sessionStorage.removeItem(storeKey);
                    setToken(null);
                    setUser(null);
                }
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [token]);
    function onLogin(data) {
        sessionStorage.setItem(storeKey, data.token);
        setUser(data.user);
        setToken(data.token);
    }
    async function onLogout() {
        try {
            await api("/auth/logout", { token, method: "POST" });
        } catch { }
        sessionStorage.removeItem(storeKey);
        setToken(null);
        setUser(null);
    }
    if (loading) return <div className="loading">Carregando CONRAPP...</div>;
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" replace /> : <Login onLogin={onLogin} />
                    }
                />
                <Route
                    element={
                        user ? (
                            <AppShell user={user} onLogout={onLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    <Route index element={<Calendar token={token} />} />
                    <Route path="comunidades" element={<Communities token={token} />} />
                    <Route
                        path="comunidades/:id"
                        element={<CommunityDetail token={token} />}
                    />
                    <Route path="discussoes" element={<Discussions token={token} />} />
                    <Route
                        path="eventos"
                        element={<Events token={token} user={user} />}
                    />
                    <Route path="perfil" element={<Profile user={user} />} />
                </Route>
                <Route
                    path="*"
                    element={<Navigate to={user ? "/" : "/login"} replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
