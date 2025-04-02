# Find-a-Friend

## Descrição
Find-a-Friend é uma aplicação para conectar pessoas com interesses em comum. Usuários podem se registrar como "amigos" para oferecer serviços ou como clientes para contratar.

## Configuração do Ambiente

### Pré-requisitos
- Node.js v20 ou superior
- PostgreSQL
- Firebase CLI (para configurar serviços do Firebase)

### Passos para Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/Find-a-Friend.git
   cd Find-a-Friend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Preencha as variáveis de ambiente no arquivo `.env` com suas chaves apropriadas.

4. Configure o Firebase:
   - Execute o comando `firebase login` para autenticar.
   - Inicialize o Firebase no projeto:
     ```bash
     firebase init
     ```
   - Selecione os serviços necessários, como Firestore, Authentication e Hosting.

5. Execute as migrações do banco de dados:
   ```bash
   npm run db:push
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

7. (Opcional) Execute os testes:
   ```bash
   npm test
   ```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run start`: Inicia o servidor em produção.
- `npm run check`: Verifica erros de digitação com o TypeScript.
- `npm run db:push`: Aplica migrações ao banco de dados.
- `npm test`: Executa os testes automatizados.

## Tecnologias Utilizadas
- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- React
- TailwindCSS
- Firebase
