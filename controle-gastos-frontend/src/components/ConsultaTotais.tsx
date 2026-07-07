import { useEffect, useState } from "react";
import type { TotalGeral } from "../types";
import { obterTotais } from "../api";

// Essa tela mostra o total de receitas, despesas e saldo de cada pessoa,
// além do total geral somando todo mundo.
function ConsultaTotais() {
  const [totais, setTotais] = useState<TotalGeral | null>(null);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    carregarTotais();
  }, []);

  async function carregarTotais() {
    try {
      const resultado = await obterTotais();
      setTotais(resultado);
    } catch (erro: any) {
      setMensagemErro(erro.message);
    }
  }

  // Formata número como dinheiro em Real (R$).
  function formatarMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="cartao">
      <div className="cabecalho-totais">
        <h2>Consulta de Totais</h2>
        <button onClick={carregarTotais}>Atualizar</button>
      </div>

      {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>}

      <table className="tabela">
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Total Receitas</th>
            <th>Total Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totais?.pessoas.map((pessoa) => (
            <tr key={pessoa.pessoaId}>
              <td>{pessoa.nome}</td>
              <td>{formatarMoeda(pessoa.totalReceitas)}</td>
              <td>{formatarMoeda(pessoa.totalDespesas)}</td>
              <td className={pessoa.saldo >= 0 ? "saldo-positivo" : "saldo-negativo"}>
                {formatarMoeda(pessoa.saldo)}
              </td>
            </tr>
          ))}

          {totais?.pessoas.length === 0 && (
            <tr>
              <td colSpan={4} className="tabela-vazia">
                Nenhuma pessoa cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totais && (
        <div className="totais-gerais">
          <h3>Total Geral</h3>
          <p>Total de receitas: {formatarMoeda(totais.totalReceitasGeral)}</p>
          <p>Total de despesas: {formatarMoeda(totais.totalDespesasGeral)}</p>
          <p>
            Saldo líquido:{" "}
            <strong className={totais.saldoGeral >= 0 ? "saldo-positivo" : "saldo-negativo"}>
              {formatarMoeda(totais.saldoGeral)}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default ConsultaTotais;
