using ControleGastosApi.Dtos;
using ControleGastosApi.Models;
using ControleGastosApi.Repositorios;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly TransacaoRepositorio _transacaoRepositorio;
        private readonly PessoaRepositorio _pessoaRepositorio;

        public TransacoesController(TransacaoRepositorio transacaoRepositorio, PessoaRepositorio pessoaRepositorio)
        {
            _transacaoRepositorio = transacaoRepositorio;
            _pessoaRepositorio = pessoaRepositorio;
        }

        // GET api/transacoes
        [HttpGet]
        public IActionResult Listar()
        {
            var transacoes = _transacaoRepositorio.ListarTodas();
            return Ok(transacoes);
        }

        // POST api/transacoes
        [HttpPost]
        public IActionResult Criar([FromBody] CriarTransacaoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Descricao))
            {
                return BadRequest(new { mensagem = "A descrição da transação é obrigatória." });
            }

            if (request.Valor <= 0)
            {
                return BadRequest(new { mensagem = "O valor da transação deve ser maior que zero." });
            }

            // A pessoa informada precisa existir no cadastro de pessoas.
            var pessoa = _pessoaRepositorio.BuscarPorId(request.PessoaId);
            if (pessoa == null)
            {
                return BadRequest(new { mensagem = "Pessoa não encontrada. Informe o Id de uma pessoa cadastrada." });
            }

            // Regra do enunciado: pessoa menor de idade (< 18 anos) só pode ter despesas.
            if (pessoa.EhMenorDeIdade() && request.Tipo == TipoTransacao.Receita)
            {
                return BadRequest(new { mensagem = "Pessoas menores de idade só podem cadastrar despesas, não receitas." });
            }

            var transacaoCriada = _transacaoRepositorio.Criar(
                request.Descricao,
                request.Valor,
                request.Tipo,
                request.PessoaId
            );

            return CreatedAtAction(nameof(Listar), new { id = transacaoCriada.Id }, transacaoCriada);
        }
    }
}
