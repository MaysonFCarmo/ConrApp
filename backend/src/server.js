import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { users, publicUser, communities, memberships, posts, comments, events } from './data.js';

const app = express();
const port = Number(process.env.PORT || 3001);
app.use(cors({ origin: true })); // Apenas para protótipo local. Restringir origens antes de publicar.
app.use(express.json({ limit: '20kb' }));

// A sessão de demonstração é mantida em memória no servidor. NÃO equivale a auth de produção.
const sessions = new Map();
const eventRegistrations = new Map();
function auth(req, res, next) {
    const token = (req.headers.authorization || '').replace(/^Bearer /i, '');
    const id = sessions.get(token);
    const user = users.find(u => u.id === id);
    if (!token || !user) return res.status(401).json({ error: 'Faça login para continuar.' });
    req.user = user; req.token = token; next();
}
function hasMembership(userId, communityId) { return memberships.some(m => m.userId === userId && m.communityId === Number(communityId)); }
const nonblank = (value, max = 120) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
const userName = id => users.find(u => u.id === id)?.name || 'Usuário';
const mappedPost = p => ({ ...p, author: userName(p.authorId), comments: comments.filter(c => c.postId === p.id).map(c => ({ ...c, author: userName(c.authorId) })) });
app.get('/api/health', (_, res) => res.json({ status: 'ok', mode: 'demo' }));
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!nonblank(email, 200) || !nonblank(password, 200)) return res.status(400).json({ error: 'Informe e-mail e senha.' });
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    const token = crypto.randomUUID(); sessions.set(token, user.id);
    return res.json({ token, user: publicUser(user) });
});
app.get('/api/auth/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));
app.post('/api/auth/logout', auth, (req, res) => { sessions.delete(req.token); res.json({ message: 'Sessão encerrada.' }); });
app.get('/api/communities', auth, (req, res) => res.json(communities.map(c => ({ ...c, joined: hasMembership(req.user.id, c.id) }))));
app.get('/api/communities/:id', auth, (req, res) => {
    const community = communities.find(c => c.id === Number(req.params.id));
    if (!community) return res.status(404).json({ error: 'Comunidade não encontrada.' });
    res.json({ ...community, joined: hasMembership(req.user.id, community.id) });
});
app.post('/api/communities/:id/join', auth, (req, res) => {
    const community = communities.find(c => c.id === Number(req.params.id));
    if (!community) return res.status(404).json({ error: 'Comunidade não encontrada.' });
    if (hasMembership(req.user.id, community.id)) return res.json({ message: 'Você já participa desta comunidade.' });
    memberships.push({ userId: req.user.id, communityId: community.id }); community.members += 1;
    res.status(201).json({ message: 'Entrada na comunidade confirmada.' });
});
app.get('/api/communities/:id/posts', auth, (req, res) => {
    const id = Number(req.params.id);
    if (!communities.some(c => c.id === id)) return res.status(404).json({ error: 'Comunidade não encontrada.' });
    if (!hasMembership(req.user.id, id)) return res.status(403).json({ error: 'Entre na comunidade para consultar as publicações.' });
    res.json(posts.filter(p => p.communityId === id).map(mappedPost).sort((a, b) => b.id - a.id));
});
app.post('/api/communities/:id/posts', auth, (req, res) => {
    const id = Number(req.params.id);
    if (!communities.some(c => c.id === id)) return res.status(404).json({ error: 'Comunidade não encontrada.' });
    if (!hasMembership(req.user.id, id)) return res.status(403).json({ error: 'Participe da comunidade para publicar.' });
    if (!nonblank(req.body?.content, 2000)) return res.status(400).json({ error: 'Escreva uma publicação com até 2.000 caracteres.' });
    const post = { id: posts.reduce((m, p) => Math.max(m, p.id), 0) + 1, communityId: id, authorId: req.user.id, content: req.body.content.trim(), createdAt: new Date().toISOString() };
    posts.push(post); res.status(201).json(mappedPost(post));
});
app.post('/api/posts/:id/comments', auth, (req, res) => {
    const post = posts.find(p => p.id === Number(req.params.id));
    if (!post) return res.status(404).json({ error: 'Publicação não encontrada.' });
    if (!hasMembership(req.user.id, post.communityId)) return res.status(403).json({ error: 'Você não tem acesso a esta publicação.' });
    if (!nonblank(req.body?.content, 1000)) return res.status(400).json({ error: 'Escreva um comentário com até 1.000 caracteres.' });
    const comment = { id: comments.reduce((m, c) => Math.max(m, c.id), 0) + 1, postId: post.id, authorId: req.user.id, content: req.body.content.trim(), createdAt: new Date().toISOString() };
    comments.push(comment); res.status(201).json({ ...comment, author: req.user.name });
});

app.post('/api/events', auth, (req, res) => {
    // Somente professores podem cadastrar eventos.
    if (req.user.role !== 'professor') {
        return res.status(403).json({
            error: 'Somente professores podem cadastrar eventos.'
        });
    }

    const {
        title,
        description,
        date,
        time,
        category,
        communityId
    } = req.body || {};

    // Validar campos obrigatórios.
    if (!nonblank(title, 120) || !nonblank(description, 2000)) {
        return res.status(400).json({
            error: 'Informe o título e a descrição do evento.'
        });
    }

    // Validar data no formato AAAA-MM-DD.
    const validDate = (value) => {
        if (typeof value !== 'string') return false;

        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return false;

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);

        const parsed = new Date(Date.UTC(year, month - 1, day));

        return parsed.getUTCFullYear() === year
            && parsed.getUTCMonth() + 1 === month
            && parsed.getUTCDate() === day;
    };

    if (!validDate(date)) {
        return res.status(400).json({
            error: 'Informe uma data válida.'
        });
    }

    // Validar horário HH:MM.
    if (
        typeof time !== 'string' ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    ) {
        return res.status(400).json({
            error: 'Informe um horário válido.'
        });
    }
    // Impedir o cadastro de eventos no passado.
    if (isEventPast({ date, time })) {
        return res.status(400).json({
            error: 'Não é possível cadastrar eventos em datas ou horários passados.'
        });
    }

    // Categorias já utilizadas no calendário.
    const allowedCategories = [
        'workshop',
        'community',
        'lecture',
        'exam'
    ];

    if (!allowedCategories.includes(category)) {
        return res.status(400).json({
            error: 'Categoria de evento inválida.'
        });
    }

    // Validar comunidade organizadora.
    const id = Number(communityId);
    const community = communities.find(c => c.id === id);

    if (!Number.isInteger(id) || !community) {
        return res.status(404).json({
            error: 'Comunidade não encontrada.'
        });
    }

    // Regra provisória do MVP:
    // professor precisa participar da comunidade.
    if (!hasMembership(req.user.id, id)) {
        return res.status(403).json({
            error: 'Você precisa participar da comunidade para criar eventos.'
        });
    }

    // Evitar eventos duplicados na mesma comunidade.
    const duplicate = events.some(e =>
        e.communityId === id &&
        e.title.toLowerCase() === title.trim().toLowerCase() &&
        e.date === date &&
        e.time === time
    );

    if (duplicate) {
        return res.status(409).json({
            error: 'Já existe um evento com essas informações.'
        });
    }

    const event = {
        id: events.reduce((max, e) => Math.max(max, e.id), 0) + 1,
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        category,
        communityId: id
    };

    events.push(event);

    return res.status(201).json({
        message: 'Evento cadastrado com sucesso.',
        event
    });
});


function findAccessibleEvent(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "ID do evento inválido." });
        return null;
    }

    const event = events.find((item) => item.id === id);

    if (!event) {
        res.status(404).json({ error: "Evento não encontrado." });
        return null;
    }

    if (
        event.communityId &&
        !hasMembership(req.user.id, event.communityId)
    ) {
        res.status(403).json({
            error: "Você não participa da comunidade deste evento."
        });
        return null;
    }

    return event;
}


function isEventPast(event) {
    // Horário de referência para eventos acadêmicos no Brasil.
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    const currentDateTime =
        `${values.year}-${values.month}-${values.day}` +
        `T${values.hour}:${values.minute}`;

    const eventDateTime = `${event.date}T${event.time}`;

    return eventDateTime <= currentDateTime;
}


function requireStudent(req, res, next) {
    if (req.user.role !== "aluno") {
        return res.status(403).json({
            error: "Somente alunos podem confirmar participação."
        });
    }

    next();
}

// Consultar o status da própria inscrição.
app.get("/api/events/:id/registration", auth, requireStudent, (req, res) => {
    const event = findAccessibleEvent(req, res);
    if (!event) return;

    const registered = eventRegistrations.get(event.id)?.has(req.user.id)
        ?? false;

    res.json({ eventId: event.id, registered });
});

// Confirmar participação.
app.post("/api/events/:id/register", auth, requireStudent, (req, res) => {
    const event = findAccessibleEvent(req, res);
    if (!event) return;

    if (isEventPast(event)) {
        return res.status(409).json({
            error: "As inscrições para este evento estão encerradas."
        });
    }


    if (!eventRegistrations.has(event.id)) {
        eventRegistrations.set(event.id, new Set());
    }

    const participants = eventRegistrations.get(event.id);

    if (participants.has(req.user.id)) {
        return res.status(409).json({
            error: "Você já está inscrito neste evento."
        });
    }

    participants.add(req.user.id);

    return res.status(201).json({
        message: "Participação confirmada com sucesso.",
        eventId: event.id,
        registered: true
    });
});

// Cancelar a própria participação.
app.delete("/api/events/:id/register", auth, requireStudent, (req, res) => {
    const event = findAccessibleEvent(req, res);
    if (!event) return;

    const participants = eventRegistrations.get(event.id);

    if (!participants?.has(req.user.id)) {
        return res.status(404).json({
            error: "Você não possui inscrição neste evento."
        });
    }

    participants.delete(req.user.id);

    return res.json({
        message: "Participação cancelada com sucesso.",
        eventId: event.id,
        registered: false
    });
});


app.get('/api/events', auth, (req, res) => res.json(events.filter(e => !e.communityId || hasMembership(req.user.id, e.communityId))));
app.get('/api/calendar', auth, (req, res) => res.json(events.filter(e => !e.communityId || hasMembership(req.user.id, e.communityId))));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Falha inesperada no servidor.' }); });
app.listen(port, '0.0.0.0', () => console.log(`CONRAPP API: http://localhost:${port}`));
