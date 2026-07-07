// Esse arquivo só tem os "formatos" (tipos) dos dados que a gente troca
// com a API. Isso ajuda o TypeScript a nos avisar se a gente usar
// alguma propriedade errada em algum lugar do código.

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

// O tipo da transação: só pode ser um desses dois textos.
export type TipoTransacao = "Receita" | "Despesa";

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}

// Total de receitas/despesas/saldo de uma pessoa (usado na tela de totais).
export interface TotalPessoa {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

// Resposta completa da consulta de totais.
export interface TotalGeral {
  pessoas: TotalPessoa[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoGeral: number;
}
