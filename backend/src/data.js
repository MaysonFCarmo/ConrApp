// Dados de demonstração voláteis: reiniciar a API restaura o estado original.
export const users = [
    { id: 'aluno-1', name: 'Ana Martins', email: 'aluno@conrapp.demo', password: 'Aluno123!', role: 'aluno', course: 'Análise e Desenvolvimento de Sistemas', institution: 'Faculdade Exemplo' },
    { id: 'prof-1', name: 'Carlos Oliveira', email: 'professor@conrapp.demo', password: 'Professor123!', role: 'professor', course: 'Docente de Desenvolvimento Web', institution: 'Faculdade Exemplo' }
];
export const communities = [
    { id: 1, name: 'Desenvolvimento Web', description: 'React, JavaScript, HTML e CSS na prática.', category: 'Tecnologia', members: 24 },
    { id: 2, name: 'Banco de Dados', description: 'Modelagem, SQL e PostgreSQL.', category: 'Tecnologia', members: 18 },
    { id: 3, name: 'Eventos Acadêmicos', description: 'Workshops, palestras e encontros da faculdade.', category: 'Eventos', members: 31 }
];
export const memberships = [{ userId: 'aluno-1', communityId: 1 }, { userId: 'prof-1', communityId: 1 }, { userId: 'prof-1', communityId: 2 }];
export const posts = [
    { id: 1, communityId: 1, authorId: 'prof-1', content: 'Bem-vindos à comunidade de Desenvolvimento Web! Compartilhem dúvidas e materiais.', createdAt: '2026-10-27T14:00:00.000Z' },
    { id: 2, communityId: 1, authorId: 'aluno-1', content: 'Alguém tem dicas para organizar os componentes de um projeto React?', createdAt: '2026-10-28T16:30:00.000Z' }
];
export const comments = [{ id: 1, postId: 2, authorId: 'prof-1', content: 'Uma boa opção é separar componentes reutilizáveis de páginas e funcionalidades.', createdAt: '2026-10-28T17:00:00.000Z' }];
export const events = [{
    id: 1,
    title: 'Workshop de Desenvolvimento Web',
    date: '2026-11-04',
    time: '19:00',
    description: 'Introdução ao desenvolvimento de aplicações React.',
    communityId: 1,
    category: 'workshop'
},
{
    id: 2,
    title: 'Encontro sobre PostgreSQL',
    date: '2026-11-11',
    time: '19:30',
    description: 'Modelagem de dados e SQL.',
    communityId: 2,
    category: 'community'
},
{
    id: 3,
    title: 'Palestra de Inovação Acadêmica',
    date: '2026-11-18',
    time: '20:00',
    description: 'Projetos e soluções na educação.',
    communityId: 3,
    category: 'lecture'
}];
export const publicUser = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, course: u.course, institution: u.institution });
