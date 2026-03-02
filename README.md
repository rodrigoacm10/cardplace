# 🃏 Inmeta Cards Marketplace

Um **Marketplace para Troca de Cartas** desenvolvido como desafio técnico para a vaga de Front-End Pleno. A aplicação permite que usuários se cadastrem, gerenciem sua própria coleção de cartas e realizem ofertas de troca com cartas de outros membros do marketplace.

---

## 🚀 Funcionalidades

A aplicação atende a todos os requisitos funcionais e técnicos estipulados no desafio:

- **Autenticação**: Registro e login de usuários com JWT, além de persistência de sessão.
- **Coleção Pessoal**: Visualização das cartas que o usuário possui na sua própria conta.
- **Adição de Cartas**: Interface fluida para buscar e adicionar novas cartas à própria coleção. A busca por nome foi adaptada para funcionar no lado do cliente, garantindo a melhor experiência possível.
- **Marketplace Público**: Listagem de todas as ofertas de trocas criadas pelos usuários, sendo visível também para visitantes não logados.
- **Solicitação de Troca**: Criação de propostas de troca, oferecendo as próprias cartas em favor de cartas desejadas do sistema.
- **Gerenciamento de Ofertas**: Exclusão de solicitações de troca previamente criadas.

## 🛠 Tecnologias e Decisões Arquiteturais

A aplicação foi construída com foco em **Qualidade, Performance e UX/UI Moderno**, utilizando as seguintes tecnologias:

- **[Vue 3](https://vuejs.org/) (Composition API)**: Framework SPA reativo e moderno.
- **[TypeScript](https://www.typescriptlang.org/)**: Para tipagem estática, garantindo segurança e melhor DX (Developer Experience).
- **[Pinia](https://pinia.vuejs.org/)**: Gerenciamento de estado global (utilizado para autenticação e sessão).
- **[TanStack Query (Vue Query)](https://tanstack.com/query/latest)**: Implementado como diferencial para gerenciar _server state_, implementando **cache**, dedultiplicação de requests e revalidação automática, otimizando a performance da aplicação.
- **[Tailwind CSS](https://tailwindcss.com/) v4 & [shadcn-vue](https://www.shadcn-vue.com/)**: Construção de uma interface agradável, responsiva, com componentes bem definidos e reutilizáveis, garantindo um design premium.
- **[Vee-Validate](https://vee-validate.logaretm.com/v4/) & [Zod](https://zod.dev/)**: Validação robusta de formulários e tratamento de erros integrado.
- **[Axios](https://axios-http.com/)**: Comunicação interceptada e padronizada com a API Rest, garantindo o envio do Bearer Token de forma automática.

## 📦 Estrutura do Projeto

O projeto segue uma arquitetura limpa, separando claramente as responsabilidades:

- `/src/components`: Componentes visuais e de UI (reutilizáveis).
- `/src/composables`: Lógicas de negócios e formulários componentizadas em _Vue Composables_ reutilizáveis.
- `/src/layouts`: Estruturas de página base, como Sidebars e Headers.
- `/src/lib`: Configurações utilitárias como instâncias do Axios.
- `/src/services`: Camada de comunicação com a API (Isolamento puro das chamadas externas).
- `/src/stores`: Gerenciadores de estado do Pinia.
- `/src/views`: Páginas completas (Screens/Routes) da aplicação.
- `/src/router`: Configuração de rotas e integração de _Route Guards_ para controle de acesso.

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos

- Node.js versão superior a `>=20`
- Gerenciador de pacotes (`npm`, `yarn` ou `pnpm`)

### 2. Instalação e Configuração

```bash
# Clone o repositório
git clone https://github.com/rodrigoacm10/cardplace.git

# Entre na pasta
cd cardplace

# Instale as dependências
npm install
```

Crie na raiz do projeto um arquivo `.env` (baseando-se no `.env.example`, caso exista) com a URL base da API:

```env
VITE_API_BASE_URL=https://cards-marketplace-api.onrender.com
```

### 3. Rodando o servidor local

```bash
npm run dev
```

Acesse o endereço exibido no terminal (normalmente `http://localhost:5173`) no seu navegador.

---

### Observação sobre a API OnRender

> ⚠️ **Atenção**: Como a API foi hospedada na plataforma Render no tier gratuito, ela hiberna após 30 segundos de inatividade. Em acessos iniciais, as requisições podem demorar cerca de 1 a 2 minutos até que o serviço seja reativado. Tratamentos de _loading screens_ e _skeletons_ foram implementados na UX para minimizar esse desconforto visual.

---

Desenvolvido para o **Teste INMETA**. 🚀
