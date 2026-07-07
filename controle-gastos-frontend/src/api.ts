import type { Pessoa, Transacao, TipoTransacao, TotalGeral } from "./types";

// Endereço onde a API em .NET está rodando.
// Se você mudar a porta da API, precisa atualizar aqui também.
const URL_BASE = "http://localhost:5222/api";

// Função auxiliar: pega a resposta da API e, se der erro, lança uma
// mensagem amigável usando o texto que o back-end retornou.
async function tratarResposta(resposta: Response) {
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    const mensagem = corpo?.mensagem ?? "Ocorreu um erro ao falar com o servidor.";
    throw new Error(mensagem);
  }

  // Requisições DELETE (204 No Content) não têm corpo para converter em JSON.
  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

// ---------- Pessoas ----------

export async function listarPessoas(): Promise<Pessoa[]> {
  const resposta = await fetch(`${URL_BASE}/pessoas`);
  return tratarResposta(resposta);
}

export async function criarPessoa(nome: string, idade: number): Promise<Pessoa> {
  const resposta = await fetch(`${URL_BASE}/pessoas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, idade }),
  });
  return tratarResposta(resposta);
}

export async function removerPessoa(id: number): Promise<void> {
  const resposta = await fetch(`${URL_BASE}/pessoas/${id}`, {
    method: "DELETE",
  });
  await tratarResposta(resposta);
}

// ---------- Transações ----------

export async function listarTransacoes(): Promise<Transacao[]> {
  const resposta = await fetch(`${URL_BASE}/transacoes`);
  return tratarResposta(resposta);
}

export async function criarTransacao(
  descricao: string,
  valor: number,
  tipo: TipoTransacao,
  pessoaId: number
): Promise<Transacao> {
  const resposta = await fetch(`${URL_BASE}/transacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descricao, valor, tipo, pessoaId }),
  });
  return tratarResposta(resposta);
}

// ---------- Totais ----------

export async function obterTotais(): Promise<TotalGeral> {
  const resposta = await fetch(`${URL_BASE}/totais`);
  return tratarResposta(resposta);
}
