using ControleGastosApi.Dtos;
using ControleGastosApi.Models;
using ControleGastosApi.Repositorios;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TotaisController : ControllerBase
    {
        private readonly PessoaRepositorio _pessoaRepositorio;
        private readonly TransacaoRepositorio _transacaoRepositorio;

        public TotaisController(PessoaRepositorio pessoaRepositorio, TransacaoRepositorio transacaoRepositorio)
        {
            _pessoaRepositorio = pessoaRepositorio;
            _transacaoRepositorio = transacaoRepositorio;
        }

        // GET api/totais
        // Lista todas as pessoas com o total de receitas, despesas e saldo,
        // além do total geral somando todo mundo.
        [HttpGet]
        public IActionResult ObterTotais()
        {
            var pessoas = _pessoaRepositorio.ListarTodas();
            var resposta = new TotalGeralResponse();

            foreach (var pessoa in pessoas)
            {
                var transacoesDaPessoa = _transacaoRepositorio.ListarPorPessoa(pessoa.Id);

                var totalReceitas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = transacoesDaPessoa
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                var totalPessoa = new TotalPessoaResponse
                {
                    PessoaId = pessoa.Id,
                    Nome = pessoa.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = totalReceitas - totalDespesas
                };

                resposta.Pessoas.Add(totalPessoa);

                // Vai somando no total geral enquanto percorre as pessoas.
                resposta.TotalReceitasGeral += totalReceitas;
                resposta.TotalDespesasGeral += totalDespesas;
            }

            resposta.SaldoGeral = resposta.TotalReceitasGeral - resposta.TotalDespesasGeral;

            return Ok(resposta);
        }
    }
}
