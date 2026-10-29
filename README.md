# CONRAPP — Base funcional das Sprints 1 e 2

Projeto de inovação acadêmica. **Demonstração local** com React + Express, sem banco de dados.

## Requisitos
- Node.js compatível com Vite 6 (Node 20.19+ ou 22.12+ recomendado)
- npm e Git

## Rodar
Na pasta raiz, execute:

```bash
npm run install:all
```

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

Acesse `http://localhost:5173`. O frontend usa proxy `/api` para a API Express na porta 3001.
No Codespaces, abra a porta 5173 pelo painel **Ports**; mantenha o backend na porta 3001.

## Credenciais DEMO (NÃO reais)
- Aluno: `aluno@conrapp.demo` / `Aluno123!`
- Professor: `professor@conrapp.demo` / `Professor123!`

## Mapeamento das HUs
| História | Status da base |
| --- | --- |
| HU-004 login | Demonstração com sessão temporária em memória e bloqueio de rotas; **não segura para produção** |
| HU-005 calendário | Calendário mensal com eventos de comunidades participantes, navegação por meses e seleção de dia |
| HU-001 comunidades | Listagem, detalhes e entrada em comunidade |
| HU-008 publicação | Criar e listar publicações na comunidade em que participa |
| HU-009 comentários | Criar e consultar comentários na publicação |
| HU-007 perfil | Somente visualização, sem edição (pendente) |
| HU-002/006 eventos | Somente dados de demonstração (pendente) |
| HU-003,010,011,012 | Pendentes |

## Limitações IMPORTANTES
- Usuários/senhas DEMO estão no código-fonte **apenas** para desenvolvimento local.
- Token aleatório em memória, sem cookie seguro, persistência ou tratamento para uso público.
- Todos os dados de comunidades e publicações são **voláteis** e reiniciam junto com o backend.
- Não publicar uma demo acessível ao público com estas credenciais nem utilizar dados pessoais reais.
- Antes da entrega final, implementar cadastro/autenticação real (HU-015), recuperação (HU-012), banco, validações e autorização, testes e políticas de privacidade.

## Fluxo de equipe
1. Cada tarefa vira uma Issue no GitHub, com ID da HU, responsável e critérios de aceite.
2. `git checkout main && git pull origin main`
3. `git checkout -b feature/hu-001-comunidades`
4. Fazer alterações e testar.
5. `git add . && git commit -m "feat: implementa HU-001"`
6. `git push -u origin feature/hu-001-comunidades`
7. Abrir Pull Request da branch para main, pedir revisão e integrar após aprovação.

## Próximas implementações
- Cadastro e login seguro com persistência, papel e RLS/autorização.
- CRUD de eventos e inscrições; sincronizar calendário.
- Edição de perfis, recuperação de senha, notificações e moderação.
