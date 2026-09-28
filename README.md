# TechStore - Frontend (Next.js)

Página única para consultar e cadastrar produtos, consumindo a API em http://localhost:3001.

## Como rodar (Node.js 18 ou superior)

    npm install
    npm run dev

Acesse http://localhost:3000 e clique em "Buscar produtos".

O backend (Express) precisa estar rodando na porta 3001 com GET e POST em /produtos.
Para usar outra URL, altere a constante API_URL no início de app/page.js.
