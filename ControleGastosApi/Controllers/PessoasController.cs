using ControleGastosApi.Dtos;
using ControleGastosApi.Repositorios;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly PessoaRepositorio _pessoaRepositorio;
        private readonly TransacaoRepositorio _transacaoRepositorio;

        public PessoasController(PessoaRepositorio pessoaRepositorio, TransacaoRepositorio transacaoRepositorio)
        {
            _pessoaRepositorio = pessoaRepositorio;
            _transacaoRepositorio = transacaoRepositorio;
        }

        // GET api/pessoas
        [HttpGet]
        public IActionResult Listar()
        {
            var pessoas = _pessoaRepositorio.ListarTodas();
            return Ok(pessoas);
        }

        // POST api/pessoas
        [HttpPost]
        public IActionResult Criar([FromBody] CriarPessoaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nome))
            {
                return BadRequest(new { mensagem = "O nome da pessoa é obrigatório." });
            }

            if (request.Idade < 0)
            {
                return BadRequest(new { mensagem = "A idade não pode ser negativa." });
            }

            var pessoaCriada = _pessoaRepositorio.Criar(request.Nome, request.Idade);
            return CreatedAtAction(nameof(Listar), new { id = pessoaCriada.Id }, pessoaCriada);
        }

        // DELETE api/pessoas/5
        [HttpDelete("{id}")]
        public IActionResult Remover(int id)
        {
            var pessoa = _pessoaRepositorio.BuscarPorId(id);
            if (pessoa == null)
            {
                return NotFound(new { mensagem = "Pessoa não encontrada." });
            }

            // Regra do enunciado: ao apagar a pessoa, apaga as transações dela também.
            _transacaoRepositorio.RemoverTodasDaPessoa(id);
            _pessoaRepositorio.Remover(id);

            return NoContent();
        }
    }
}
