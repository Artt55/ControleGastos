# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais com cadastro de pessoas, cadastro de
transações (receitas/despesas) e consulta de totais.

- **Back-end:** .NET 8 (C#) — API REST
- **Front-end:** React + TypeScript (Vite)
- **Persistência:** os dados são salvos em arquivos JSON dentro da pasta
  `ControleGastosApi/Dados`, então eles continuam existindo mesmo depois de
  fechar a aplicação.

---

## Como rodar o back-end (API)

Pré-requisito: ter o **.NET 8 SDK** instalado ([link para download](https://dotnet.microsoft.com/download)).

```bash
cd ControleGastosApi
dotnet run
```

A API vai subir em `http://localhost:5222`.

Na primeira execução, será criada automaticamente a pasta `Dados/` com os
arquivos `pessoas.json` e `transacoes.json`, que é onde as informações ficam
guardadas.

### Endpoints disponíveis

| Método | Rota                 | O que faz                                  |
|--------|----------------------|---------------------------------------------|
| GET    | `/api/pessoas`       | Lista todas as pessoas                      |
| POST   | `/api/pessoas`       | Cria uma pessoa (`{ "nome", "idade" }`)     |
| DELETE | `/api/pessoas/{id}`  | Remove a pessoa (e as transações dela)      |
| GET    | `/api/transacoes`    | Lista todas as transações                   |
| POST   | `/api/transacoes`    | Cria uma transação (veja exemplo abaixo)    |
| GET    | `/api/totais`        | Lista os totais de cada pessoa + total geral|

Exemplo de corpo para criar uma transação:

```json
{
  "descricao": "Supermercado",
  "valor": 150.50,
  "tipo": "Despesa",
  "pessoaId": 1
}
```

> Obs: não há tela do Swagger configurada neste projeto (para simplificar).
> Os testes foram feitos usando `curl` diretamente nos endpoints acima.

---

## Como rodar o front-end

Pré-requisito: ter o **Node.js** instalado.

```bash
cd controle-gastos-frontend
npm install
npm run dev
```

O front-end vai subir em `http://localhost:5173`. **Importante:** a API
precisa estar rodando em `http://localhost:5222` para o front-end conseguir
buscar os dados (o endereço está fixo no arquivo `src/api.ts`).

---

## Regras de negócio implementadas

- Cadastro de pessoas: criação, listagem e exclusão. Ao excluir uma pessoa,
  todas as transações associadas a ela são apagadas junto (`PessoasController`
  chama `TransacaoRepositorio.RemoverTodasDaPessoa`).
- Cadastro de transações: criação e listagem (sem edição/exclusão, conforme
  pedido). Toda transação precisa de uma pessoa existente
  (`TransacoesController` valida isso antes de criar).
- Pessoas menores de 18 anos só podem ter transações do tipo **Despesa**
  (validado tanto no back-end quanto avisado no front-end).
- Consulta de totais: soma receitas, despesas e calcula o saldo
  (receitas − despesas) de cada pessoa, além do total geral de todo mundo.

## Estrutura de pastas (back-end)

```
ControleGastosApi/
├── Controllers/       -> Endpoints da API (Pessoas, Transacoes, Totais)
├── Models/             -> Classes Pessoa, Transacao e enum TipoTransacao
├── Dtos/               -> Formatos de entrada/saída usados pela API
├── Repositorios/       -> Onde os dados são guardados e salvos em JSON
├── Dados/              -> Arquivos JSON gerados automaticamente (dados salvos)
└── Program.cs          -> Configuração inicial da aplicação
```

## Estrutura de pastas (front-end)

```
controle-gastos-frontend/
├── src/
│   ├── components/
│   │   ├── CadastroPessoas.tsx     -> Tela de cadastro de pessoas
│   │   ├── CadastroTransacoes.tsx  -> Tela de cadastro de transações
│   │   └── ConsultaTotais.tsx      -> Tela de consulta de totais
│   ├── api.ts        -> Funções que conversam com a API (fetch)
│   ├── types.ts       -> Tipos TypeScript usados no projeto
│   └── App.tsx         -> Componente principal com a navegação por abas
```

## Testes manuais realizados

Antes da entrega, os seguintes cenários foram testados manualmente via `curl`
direto na API (mais de 15 casos no total):

1. Listar pessoas com a lista vazia
2. Criar pessoa adulta e pessoa menor de idade
3. Criar receita e despesa para pessoa adulta
4. Tentar criar receita para menor de idade (deve bloquear)
5. Criar despesa para menor de idade (deve funcionar)
6. Criar transação com pessoa inexistente (deve bloquear)
7. Criar transação com valor negativo/zero (deve bloquear)
8. Criar pessoa sem nome (deve bloquear)
9. Consultar totais com valores calculados corretamente
10. Excluir pessoa e confirmar que as transações dela somem junto
11. Excluir pessoa inexistente (deve retornar 404)
12. Reiniciar a API e confirmar que os dados persistiram no arquivo JSON
13. Confirmar que os IDs não se repetem depois de reiniciar a aplicação
14. Testar pessoa com exatamente 18 anos (deve ser tratada como adulta)
15. Confirmar cabeçalhos de CORS liberados para o front-end
