'use client';

// TechStore - Frontend completo em um único arquivo (JSX, estado, fetch e estilos).
// Como usar: crie o projeto com `npx create-next-app@latest frontend`,
// substitua o conteúdo de app/page.js por este arquivo e rode `npm run dev`.
// Requer a API rodando em http://localhost:3001 (GET e POST em /produtos).

import { useState } from 'react';

const API_URL = '/api';

const formatarPreco = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const estilos = `
.loja, .loja *, .loja *::before, .loja *::after { box-sizing: border-box; }

.loja {
  min-height: 100vh;
  padding: 40px 20px;
  background: #F3F5F6;
  color: #17212B;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}

.loja .conteudo { max-width: 620px; margin: 0 auto; }

.loja h1 {
  margin: 0 0 24px;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.loja h2 { margin: 0; font-size: 1.05rem; font-weight: 650; }

.loja .painel {
  margin-bottom: 20px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid #D5DCE1;
  border-radius: 10px;
}

.loja .cabecalho-secao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.loja .lista { margin: 0; padding: 0; list-style: none; }

.loja .lista li {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #E4E9EC;
}

.loja .lista li:first-child { padding-top: 0; border-top: 0; }
.loja .lista .nome { font-weight: 500; }
.loja .lista .preco { font-variant-numeric: tabular-nums; white-space: nowrap; }

.loja .vazio { margin: 0; color: #52616E; }

.loja .campo { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.loja .campo label { font-size: 0.9rem; font-weight: 500; }

.loja .campo input {
  padding: 10px 12px;
  font: inherit;
  color: inherit;
  background: #FFFFFF;
  border: 1px solid #AEB9C2;
  border-radius: 8px;
}

.loja .botao {
  padding: 10px 16px;
  font: inherit;
  font-weight: 600;
  border: 1px solid #0B5C63;
  border-radius: 8px;
  cursor: pointer;
}

.loja .botao-primario { background: #0B5C63; color: #FFFFFF; }
.loja .botao-primario:hover { background: #094A50; }
.loja .botao-secundario { background: #FFFFFF; color: #0B5C63; }
.loja .botao-secundario:hover { background: #E8F1F2; }

.loja :focus-visible { outline: 3px solid #E08A00; outline-offset: 2px; }

.loja .aviso { margin: 0 0 20px; padding: 10px 12px; border-radius: 8px; font-size: 0.95rem; }
.loja .aviso-sucesso { background: #E3F3EA; color: #14532D; }
.loja .aviso-erro { background: #FDE8E6; color: #8A1C12; }

@media (max-width: 480px) {
  .loja { padding: 24px 14px; }
  .loja .cabecalho-secao { flex-direction: column; align-items: stretch; }
}
`;

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [aviso, setAviso] = useState(null); // { tipo: 'sucesso' | 'erro', texto: string }

  // fetch GET /produtos
  async function buscarProdutos() {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const dados = await response.json();

      if (!response.ok) {
        setAviso({ tipo: 'erro', texto: dados.erro || 'A API não conseguiu listar os produtos.' });
        return;
      }

      setProdutos(dados);
      setCarregado(true);
    } catch (erro) {
      setAviso({
        tipo: 'erro',
        texto: 'Não foi possível conectar à API. Verifique se o backend está rodando na porta 3001.',
      });
    }
  }

  // fetch POST /produtos
  async function novoProduto(evento) {
    evento.preventDefault();

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco: Number(preco) }),
      });
      const dados = await response.json();

      if (!response.ok) {
        setAviso({ tipo: 'erro', texto: dados.erro || 'A API não conseguiu cadastrar o produto.' });
        return;
      }

      setNome('');
      setPreco('');
      setAviso({ tipo: 'sucesso', texto: 'Produto cadastrado.' });
      buscarProdutos();
    } catch (erro) {
      setAviso({
        tipo: 'erro',
        texto: 'Não foi possível conectar à API. Verifique se o backend está rodando na porta 3001.',
      });
    }
  }

  function aoClicarEmBuscar() {
    setAviso(null);
    buscarProdutos();
  }

  return (
    <main className="loja">
      <style>{estilos}</style>

      <div className="conteudo">
        <h1>Produtos da TechStore</h1>

        {aviso && (
          <p role="status" className={`aviso aviso-${aviso.tipo}`}>
            {aviso.texto}
          </p>
        )}

        <section className="painel" aria-labelledby="titulo-catalogo">
          <div className="cabecalho-secao">
            <h2 id="titulo-catalogo">Catálogo</h2>
            <button type="button" className="botao botao-secundario" onClick={aoClicarEmBuscar}>
              Buscar produtos
            </button>
          </div>

          {!carregado ? (
            <p className="vazio">
              Nenhum produto carregado. Clique em Buscar produtos para ver o catálogo.
            </p>
          ) : produtos.length === 0 ? (
            <p className="vazio">
              Nenhum produto cadastrado ainda. Use o formulário abaixo para cadastrar o primeiro.
            </p>
          ) : (
            <ul className="lista">
              {produtos.map((produto) => (
                <li key={produto.id}>
                  <span className="nome">{produto.nome}</span>
                  <span className="preco">{formatarPreco(produto.preco)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="painel" aria-labelledby="titulo-cadastro">
          <div className="cabecalho-secao">
            <h2 id="titulo-cadastro">Cadastro</h2>
          </div>

          <form onSubmit={novoProduto}>
            <div className="campo">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex.: Notebook"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="preco">Preço (R$)</label>
              <input
                id="preco"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex.: 3500"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>

            <button type="submit" className="botao botao-primario">
              Novo produto
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
