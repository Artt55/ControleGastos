import { useEffect, useState } from "react";
import type { Pessoa, Transacao, TipoTransacao } from "../types";
import { listarPessoas, listarTransacoes, criarTransacao } from "../api";

// Essa tela cuida do cadastro de transações (receitas e despesas).
// Aqui não tem edição/exclusão, só criação e listagem (conforme pedido).
function CadastroTransacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [pessoaId, setPessoaId] = useState("");

  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [listaPessoas, listaTransacoes] = await Promise.all([
        listarPessoas(),
        listarTransacoes(),
      ]);
      setPessoas(listaPessoas);
      setTransacoes(listaTransacoes);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    }
  }

  // Descobre se a pessoa selecionada é menor de idade, para avisar o usuário
  // antes mesmo de tentar cadastrar uma receita (o back-end também valida isso).
  const pessoaSelecionada = pessoas.find((p) => p.id === Number(pessoaId));
  const pessoaEhMenorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  async function aoEnviarFormulario(evento: React.FormEvent) {
    evento.preventDefault();
    setMensagemErro("");

    if (descricao.trim() === "") {
      setMensagemErro("Digite a descrição da transação.");
      return;
    }

    const valorNumero = Number(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      setMensagemErro("Digite um valor maior que zero.");
      return;
    }

    if (pessoaId === "") {
      setMensagemErro("Selecione a pessoa dona da transação.");
      return;
    }

    setCarregando(true);
    try {
      await criarTransacao(descricao, valorNumero, tipo, Number(pessoaId));
      setDescricao("");
      setValor("");
      setTipo("Despesa");
      setPessoaId("");
      await carregarDados();
    } catch (erro: any) {
      setMensagemErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  // Ajuda a mostrar o nome da pessoa na tabela de transações,
  // em vez de mostrar só o pessoaId (número), que é menos legível.
  function obterNomeDaPessoa(idDaPessoa: number): string {
    const pessoa = pessoas.find((p) => p.id === idDaPessoa);
    return pessoa ? pessoa.nome : `Id ${idDaPessoa}`;
  }

  return (
    <div className="cartao">
      <h2>Cadastro de Transações</h2>

      {pessoas.length === 0 && (
        <p className="aviso">
          Cadastre pelo menos uma pessoa antes de lançar uma transação.
        </p>
      )}

      <form onSubmit={aoEnviarFormulario} className="formulario">
        <div className="campo">
          <label>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Supermercado"
          />
        </div>

        <div className="campo">
          <label>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 150.00"
          />
        </div>

        <div className="campo">
          <label>Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoTransacao)}>
            <option value="Despesa">Despesa</option>
            <option value="Receita" disabled={pessoaEhMenorDeIdade}>
              Receita
            </option>
          </select>
        </div>

        <div className="campo">
          <label>Pessoa</label>
          <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
            <option value="">Selecione...</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome} {pessoa.idade < 18 ? "(menor de idade)" : ""}
              </option>
            ))}
          </select>
        </div>

        {pessoaEhMenorDeIdade && (
          <p className="aviso">
            Essa pessoa é menor de idade: só é possível cadastrar despesas para ela.
          </p>
        )}

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar transação"}
        </button>
      </form>

      {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>}

      <table className="tabela">
        <thead>
          <tr>
            <th>Id</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Pessoa</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((transacao) => (
            <tr key={transacao.id}>
              <td>{transacao.id}</td>
              <td>{transacao.descricao}</td>
              <td>R$ {transacao.valor.toFixed(2)}</td>
              <td>
                <span className={transacao.tipo === "Receita" ? "tag-receita" : "tag-despesa"}>
                  {transacao.tipo}
                </span>
              </td>
              <td>{obterNomeDaPessoa(transacao.pessoaId)}</td>
            </tr>
          ))}

          {transacoes.length === 0 && (
            <tr>
              <td colSpan={5} className="tabela-vazia">
                Nenhuma transação cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CadastroTransacoes;
