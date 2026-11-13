<div align="center">CONRAPP
Conecte, organize e evolua na vida acadêmica.
Comunidades, discussões, calendário e eventos em um único ambiente.




</div>Versão documentada: estado do desenvolvimento até a Sprint 3 — novembro de 2026. O CONRAPP é um MVP acadêmico em evolução, com dados de demonstração mantidos em memória. Não está preparado para implantação em produção.

Sumário
- Sobre o projeto
- Objetivo e público-alvo
- Funcionalidades implementadas
- Experiência visual — Campus Blue
- Tecnologias utilizadas
- Arquitetura e organização
- Instalação e execução
- Contas de demonstração
- Regras de negócio e permissões
- Principais rotas da API
- Evolução por sprint
- Validações e testes
- Capturas de tela
- Limitações conhecidas
- Próximos passos
- Desenvolvimento
Sobre o projeto
O CONRAPP é uma plataforma web acadêmica concebida para aproximar estudantes e professores por meio de comunidades de interesse, discussões colaborativas, calendário acadêmico e eventos.

A proposta é reduzir a dispersão das informações acadêmicas: em vez de procurar eventos, conversar com colegas e acompanhar atividades em canais separados, o usuário encontra essas experiências em um ambiente integrado.

O projeto é desenvolvido de forma incremental, com histórias de usuário, entregas por sprint, validações funcionais e evolução contínua da interface.
Objetivo e público-alvo
Objetivo: facilitar a descoberta de atividades, a troca de conhecimentos e a participação dos estudantes na comunidade acadêmica.

Público-alvo:
- Alunos: acompanham calendário, entram em comunidades, participam de discussões e se inscrevem em eventos.
- Professores: participam de comunidades e podem cadastrar eventos nas comunidades às quais pertencem.
O sistema diferencia as permissões desses perfis nos fluxos já implementados.
Funcionalidades implementadas
1. Autenticação e acesso
- Login com contas demonstrativas de aluno e professor.
- Encerramento de sessão (logout).
- Rotas protegidas para usuários autenticados.
- Identificação do perfil utilizado na aplicação.
- Restrições de acesso aplicadas no Backend aos fluxos que exigem papel específico.
2. Calendário acadêmico
- Visualização mensal com navegação entre meses.
- Destaque de eventos nas respectivas datas.
- Seleção de um dia para consultar sua programação.
- Mini calendário na sidebar, sincronizado com o calendário principal.
- Identificação visual de categorias de evento:
Categoria	Cor funcional	Uso
Workshop	Verde	Atividades práticas
Encontro	Roxo	Atividades de comunidade
Palestra	Amarelo	Apresentações e palestras
Prova	Vermelho	Avaliações


As cores acima identificam categorias no calendário. As capas dos cards podem usar gradientes da identidade visual Campus Blue.

3. Comunidades acadêmicas
- Listagem das comunidades disponíveis.
- Exibição de categoria, descrição e quantidade de participantes.
- Consulta de detalhes de uma comunidade.
- Entrada em comunidades por meio do botão Participar.
- Acesso às comunidades das quais o usuário participa.
- Cards com identidade de cor estável: a mesma comunidade mantém o mesmo gradiente em diferentes páginas.
Comunidades utilizadas na demonstração: Desenvolvimento Web, Banco de Dados e Eventos Acadêmicos.
4. Discussões e interações
- Página de Discussões com acesso às comunidades em que o usuário participa.
- Abertura da área de publicações de cada comunidade.
- Criação de publicações nas comunidades, conforme o fluxo implementado.
- Comentários em publicações.
- Exibição da autoria das publicações e interações.
Organização atual: a página Discussões apresenta cards de comunidades, que levam às suas publicações. Não é, nesta versão, um feed global de tópicos individuais.

5. Eventos acadêmicos
Cadastro — perfil professor
- Formulário com título, descrição, data, horário, categoria e comunidade.
- Cadastro permitido somente para professor, respeitando o vínculo com a comunidade.
- Validação de campos obrigatórios e formatos.
- Recusa de datas impossíveis, horários incorretos, categorias inválidas e comunidades inexistentes.
- Bloqueio de cadastros duplicados segundo os critérios implementados na API.
- Bloqueio de cadastro com data e horário já passados.
Consulta e descoberta
- Cards de eventos com categoria, data, horário, descrição e comunidade.
- Pesquisa por título e descrição.
- Filtros por categoria: todas, workshops, palestras, encontros e provas.
- Indicação de eventos encerrados.
- Layout responsivo para desktop e dispositivos móveis.
Inscrições — perfil aluno
- Inscrição em eventos futuros acessíveis ao aluno.
- Verificação do estado atual da participação.
- Prevenção de inscrições duplicadas.
- Cancelamento de uma inscrição existente.
- Bloqueio de novas inscrições em eventos que já começaram ou terminaram.
- Estado visual Inscrições encerradas para eventos passados.
Experiência visual — Campus Blue
A interface foi revisada para oferecer consistência entre Calendário, Comunidades, Discussões e Eventos.
Identidade visual
Elemento	Cor	Hexadecimal
Azul-marinho	Base institucional	#172B5A
Azul de ação	Botões e destaques	#3568E8
Turquesa	Cor complementar	#43BFC7
Lavanda	Destaques secundários	#A78BFA
Fundo claro	Superfícies de página	#F5F7FC


Gradientes por comunidade
Comunidade	Identidade adotada
Desenvolvimento Web	Azul e turquesa
Banco de Dados	Roxo e lavanda
Eventos Acadêmicos	Verde-água


Os mesmos gradientes são utilizados nas páginas de Comunidades e Discussões, evitando que uma comunidade aparente mudar de identidade conforme a tela.

Diretrizes implementadas: cards com bordas arredondadas, capas em gradiente, espaçamentos consistentes, hierarquia visual, estados de interação e adaptação a telas menores.
Tecnologias utilizadas
Área	Tecnologia	Finalidade
Frontend	React	Construção da interface com componentes
Build e desenvolvimento	Vite	Servidor de desenvolvimento e geração de build
Linguagem	JavaScript / JSX	Lógica da interface e componentes
Estilos	CSS	Identidade visual e responsividade
Navegação	React Router	Rotas e navegação entre páginas
Ícones	Lucide React	Ícones da interface
Backend	Node.js	Execução da API
API HTTP	Express	Rotas e regras de negócio
Dados	Estruturas em memória	Dados e sessões da demonstração
Versionamento	Git / GitHub	Histórico e colaboração


Não utilizados nesta versão: banco de dados persistente, Docker como requisito de execução, serviço externo de autenticação ou implantação de produção.
Arquitetura e organização
┌─────────────────────────────┐
│ Navegador                   │
│ React + Vite + React Router │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│ API Node.js + Express       │
│ Autenticação e permissões   │
│ Comunidades e publicações   │
│ Eventos e inscrições       │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│ Dados demonstrativos       │
│ Arrays / Map em memória     │
└─────────────────────────────┘
Principais diretórios e arquivos
ConrApp/
├── backend/
│   └── src/
│       ├── data.js            # Dados iniciais da demonstração
│       └── server.js          # API e regras de negócio
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── MiniCalendar.jsx
│       │   ├── MiniCalendar.css
│       │   └── EventRegistrationButton.jsx
│       ├── App.jsx            # Páginas e rotas da aplicação
│       ├── api.js             # Chamadas ao Backend
│       ├── main.jsx           # Inicialização do React
│       └── style.css          # Estilos e design Campus Blue
└── package.json              # Scripts utilizados na raiz
Esta árvore representa os arquivos principais conhecidos até a Sprint 3 e não necessariamente todos os itens presentes no repositório.

Instalação e execução
Pré-requisitos
- Node.js e npm instalados.
- Git para clonar o repositório.
- Terminal local ou ambiente de desenvolvimento como GitHub Codespaces.
1. Clonar o projeto
git clone <URL_DO_REPOSITORIO>
cd ConrApp
Substitua <URL_DO_REPOSITORIO> pela URL de clonagem do projeto no GitHub.
2. Instalar as dependências
npm run install:all
3. Iniciar o Backend
Em um terminal, execute:
npm run dev:backend
Endereço utilizado na demonstração: http://localhost:3001.
4. Iniciar o Frontend
Em outro terminal, execute:
npm run dev:frontend
Acesse o endereço exibido pelo Vite, normalmente http://localhost:5173. Se a porta estiver ocupada, o Vite poderá indicar outra, como 5174.
5. Verificar a aplicação
# Verificação de sintaxe do Backend
node --check backend/src/server.js

# Build de produção do Frontend
npm run build --prefix frontend
Importante: as duas aplicações precisam estar em execução durante os testes locais. Em Codespaces, confira o encaminhamento e a visibilidade das portas necessárias.
Contas de demonstração
Papel	E-mail	Senha
Aluno	aluno@conrapp.demo	Aluno123!
Professor	professor@conrapp.demo	Professor123!


Essas credenciais são exclusivamente demonstrativas. Não devem ser tratadas como contas reais nem reutilizadas em produção.
Regras de negócio e permissões
Operação	Aluno	Professor
Acessar áreas autenticadas	Sim	Sim
Consultar comunidades e eventos acessíveis	Sim	Sim
Participar de comunidades	Sim	Sim
Acessar publicações de comunidades em que participa	Sim	Sim
Cadastrar evento	Não	Sim, se vinculado à comunidade
Inscrever-se em evento	Sim, se elegível e antes do início	Não
Cancelar inscrição própria	Sim	Não se aplica


Outras regras verificadas:
- O cadastro de eventos exige informações válidas e impede determinadas duplicidades.
- Eventos passados não aceitam novas inscrições nem novos cadastros retroativos.
- A autorização é verificada pela API, não apenas pela interface.
- O registro de inscrição é mantido na memória enquanto o Backend está executando.
Principais rotas da API
A API usa o prefixo /api. A tabela abaixo apresenta as rotas principais utilizadas durante o desenvolvimento; ela não é uma especificação completa de todas as respostas ou contratos.
Método	Rota	Finalidade
GET	/api/health	Verificar a disponibilidade da API
POST	/api/auth/login	Autenticar conta demonstrativa
GET	/api/auth/me	Consultar usuário autenticado
POST	/api/auth/logout	Encerrar sessão
GET	/api/communities	Listar comunidades
POST	/api/communities/:id/join	Participar de uma comunidade
GET	/api/events	Listar eventos acessíveis
POST	/api/events	Cadastrar evento como professor
GET	/api/calendar	Consultar informações do calendário
GET	/api/events/:id/registration	Consultar estado da inscrição
POST	/api/events/:id/register	Confirmar participação
DELETE	/api/events/:id/register	Cancelar participação


Autorização: as operações protegidas utilizam token na requisição, conforme o fluxo de login demonstrativo.
Evolução por sprint
Sprint 1 — Acesso e calendário
História	Entrega	Situação nos testes realizados
HU-004	Login, logout e proteção de rotas	Aprovada
HU-005	Calendário mensal e destaque de eventos	Aprovada


Resultados: acesso com perfis demonstrativos, validação de credenciais, navegação entre meses e cores para categorias do calendário.
Sprint 2 — Comunidades e colaboração
História	Entrega	Situação
HU-001	Participação em comunidades	Implementada; fluxo de participação verificado
HU-008	Publicações em comunidades	Implementada
HU-009	Comentários em publicações	Implementada


As funcionalidades de publicações e comentários existem no MVP. Não há, neste registro, uma matriz completa de testes finais da Sprint 2 equivalente à da Sprint 3.
Sprint 3 — Eventos e evolução da interface
História	Entrega	Situação nos testes realizados
HU-002	Cadastro de eventos por professores	Aprovada
HU-006	Validação de cadastro, permissões e duplicidades	Cenários técnicos aprovados
HU-010	Inscrição e cancelamento de participação	Aprovada nos cenários testados


Melhorias adicionais da Sprint 3:
- Identidade visual Campus Blue.
- Mini calendário integrado à sidebar.
- Cards padronizados para Eventos, Comunidades e Discussões.
- Identidade de cor consistente entre Comunidades e Discussões.
- Busca textual e filtros por categoria nos eventos.
- Layout responsivo em telas menores.
- Comunicação visual de inscrições encerradas.
Nota sobre a HU-006: foram verificadas as validações técnicas implementadas. Caso a definição formal dessa história também inclua um fluxo de aprovação/rejeição administrativa de eventos, esse fluxo não deve ser considerado entregue sem implementação e teste específicos.

Validações e testes
As verificações foram realizadas manualmente na interface e por chamadas HTTP à API durante o desenvolvimento.
Área	Cenários observados	Resultado registrado
Sintaxe	node --check backend/src/server.js	Sem erros
Build	npm run build --prefix frontend	Compilação concluída
Cadastro de eventos	Professor autorizado, aluno sem permissão, comunidade sem vínculo, duplicidade	Restrições verificadas
HU-006	Título vazio, descrição vazia, data impossível, horário inválido, categoria inválida, comunidade inexistente	6/6 aprovados
HU-010	Inscrição futura, prevenção de duplicidade, cancelamento, bloqueio de evento encerrado	Fluxos verificados
Interface de eventos	Busca por título e descrição, filtros, casos sem resultado, responsividade	9/9 aprovados
Cards de eventos	Gradientes, disposição, inscrição no card e mobile	6/6 aprovados
Cards de comunidades	Visual, participação, detalhes, navegação e mobile	7/7 aprovados
Bloqueio visual de eventos	Mensagem de encerramento, evento futuro e cancelamento	6/6 aprovados


Importante: esses resultados representam os cenários documentados nas sessões de desenvolvimento, e não uma suíte de testes automatizada, uma auditoria de segurança ou a certificação de prontidão para produção. O redesign da página Discussões foi implementado, mas seu checklist final não foi formalmente registrado nesta versão da documentação.
Capturas de tela
A pasta sugerida para as imagens do projeto é docs/screenshots/. Após adicionar os arquivos, remova os comentários das linhas abaixo para exibi-los no GitHub:
<!-- ![Calendário e sidebar](docs/screenshots/calendario.png) -->
<!-- ![Comunidades acadêmicas](docs/screenshots/comunidades.png) -->
<!-- ![Discussões](docs/screenshots/discussoes.png) -->
<!-- ![Eventos acadêmicos](docs/screenshots/eventos.png) -->
<!-- ![Cadastro de evento](docs/screenshots/cadastro-evento.png) -->
<!-- ![Inscrição confirmada](docs/screenshots/inscricao-confirmada.png) -->
Sugestão editorial: destaque quatro telas no README público (Calendário, Comunidades, Discussões e Eventos) e mantenha as capturas de testes detalhados na documentação da Sprint Review.
Limitações conhecidas
1. Dados não persistentes: reiniciar o Backend pode restaurar os dados iniciais e apagar inscrições, publicações e eventos criados durante a execução.
2. Autenticação demonstrativa: contas e sessões foram criadas para testes acadêmicos, sem a infraestrutura necessária para produção.
3. Sem banco de dados persistente: a versão atual utiliza estruturas de dados em memória.
4. Testes predominantemente manuais: ainda não existe cobertura automatizada abrangente de frontend e API documentada.
5. Fluxos avançados ainda não concluídos: notificações, recuperação de senha, moderação e evolução dos perfis dependem das próximas entregas.
6. Aprovação administrativa de eventos: não foi confirmada como fluxo funcional entregue, caso faça parte da especificação da HU-006.
Próximos passos
Os itens a seguir são planejados ou candidatos para a próxima sprint, não funcionalidades já entregues:
- HU-003: notificações.
- HU-007: evolução dos perfis.
- HU-011: denúncia ou sinalização de conteúdo.
- HU-012: recuperação de senha.
- Refinamento da experiência de publicações e comentários.
- Evolução das validações, da segurança e da cobertura de testes.
- Planejamento de persistência em banco de dados para versões futuras.
Atualização após a próxima sprint
Ao concluir a próxima sprint, atualizar principalmente:
- A tabela Evolução por sprint, com histórias realmente concluídas.
- As seções Funcionalidades implementadas e Regras de negócio.
- A seção Validações e testes, com resultados reproduzíveis.
- As Capturas de tela das novas funcionalidades.
- As Limitações conhecidas, removendo apenas as que tiverem sido efetivamente resolvidas.
Desenvolvimento
Projeto acadêmico: CONRAPP
Desenvolvedor: MaysonFCarmo
Período documentado: até novembro de 2026 (Sprint 3)

O CONRAPP reúne práticas de desenvolvimento frontend e backend, integração de API REST, autorização por perfil, modelagem de regras de negócio, evolução de interface e organização incremental por histórias de usuário.
<div align="center">CONRAPP — Um espaço para aprender, conectar e participar.

Documentação do MVP até a Sprint 3.
</div>
