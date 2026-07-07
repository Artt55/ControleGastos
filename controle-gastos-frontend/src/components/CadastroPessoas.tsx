import { useEffect, useState } from "react";
import type { Pessoa } from "../types";
import { listarPessoas, criarPessoa, removerPessoa } from "../api";

// Essa tela cuida do CRUD (bom, só criar, listar e apagar) de pessoas.
function CadastroPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Busca a lista de pessoas assim que o componente aparece na tela.
  useEffect(() => {
    carregarPessoas();
  }, []);

  async function carregarPessoas() {
    try {
      const lista = await listarPessoas();
      setPessoas(lista);
    } catch (erro) {
      console.error("Erro ao carregar pessoas:", erro);
    }
  }

  async function aoEnviarFormulario(evento: React.FormEvent) {
    evento.preventDefault();
    setMensagemErro("");

    // Validação simples no front, mesmo o back-end já validando também.
    if (nome.trim() === "") {
      setMensagemErro("Digite o nome da pessoa.");
      return;
    }

    const idadeNumero = Number(idade);
    if (isNaN(idadeNumero) || idadeNumero < 0) {
      setMensagemErro("Digite uma idade válida.");
      return;
    }

    setCarregando(true);
    try {
      await criarPessoa(nome, idadeNumero);
      setNome("");
      setIdade("");
      await carregarPessoas();
    } catch (erro: any) {
      setMensagemErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  async function aoClicarExcluir(id: number) {
    const confirmou = window.confirm(
      "Tem certeza que deseja excluir essa pessoa? Todas as transações dela também serão apagadas."
    );

    if (!confirmou) {
      return;
    }

    try {
      await removerPessoa(id);
      await carregarPessoas();
    } catch (erro: any) {
      setMensagemErro(erro.message);
    }
  }

  return (
    <div className="cartao">
      <h2>Cadastro de Pessoas</h2>

      <form onSubmit={aoEnviarFormulario} className="formulario">
        <div className="campo">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria"
          />
        </div>

        <div className="campo">
          <label>Idade</label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            placeholder="Ex: 25"
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar pessoa"}
        </button>
      </form>

      {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>}

      <table className="tabela">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Idade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td>{pessoa.id}</td>
              <td>{pessoa.nome}</td>
              <td>
                {pessoa.idade}
                {pessoa.idade < 18 && <span className="tag-menor"> (menor de idade)</span>}
              </td>
              <td>
                <button className="botao-excluir" onClick={() => aoClicarExcluir(pessoa.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {pessoas.length === 0 && (
            <tr>
              <td colSpan={4} className="tabela-vazia">
                Nenhuma pessoa cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CadastroPessoas;
