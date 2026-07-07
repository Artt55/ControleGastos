using System.Text.Json;
using System.Text.Json.Serialization;
using ControleGastosApi.Models;

namespace ControleGastosApi.Repositorios
{
    // Assim como o PessoaRepositorio, essa classe guarda as transações
    // em um arquivo JSON para que os dados não se percam ao fechar a aplicação.
    public class TransacaoRepositorio
    {
        private readonly string _caminhoArquivo;
        private readonly List<Transacao> _transacoes;
        private int _proximoId;

        private static readonly object _trava = new();

        private static readonly JsonSerializerOptions _opcoesJson = new()
        {
            WriteIndented = true,
            Converters = { new JsonStringEnumConverter() }
        };

        public TransacaoRepositorio(IWebHostEnvironment ambiente)
        {
            var pastaDados = Path.Combine(ambiente.ContentRootPath, "Dados");
            Directory.CreateDirectory(pastaDados);
            _caminhoArquivo = Path.Combine(pastaDados, "transacoes.json");

            _transacoes = CarregarDoArquivo();
            _proximoId = _transacoes.Count > 0 ? _transacoes.Max(t => t.Id) + 1 : 1;
        }

        public List<Transacao> ListarTodas()
        {
            return _transacoes;
        }

        public List<Transacao> ListarPorPessoa(int pessoaId)
        {
            return _transacoes.Where(t => t.PessoaId == pessoaId).ToList();
        }

        public Transacao Criar(string descricao, decimal valor, TipoTransacao tipo, int pessoaId)
        {
            lock (_trava)
            {
                var novaTransacao = new Transacao
                {
                    Id = _proximoId,
                    Descricao = descricao,
                    Valor = valor,
                    Tipo = tipo,
                    PessoaId = pessoaId
                };

                _proximoId++;
                _transacoes.Add(novaTransacao);
                Salvar();

                return novaTransacao;
            }
        }

        // Usado quando uma pessoa é excluída: todas as transações dela
        // também precisam ser apagadas (regra do enunciado).
        public void RemoverTodasDaPessoa(int pessoaId)
        {
            lock (_trava)
            {
                _transacoes.RemoveAll(t => t.PessoaId == pessoaId);
                Salvar();
            }
        }

        private List<Transacao> CarregarDoArquivo()
        {
            if (!File.Exists(_caminhoArquivo))
            {
                return new List<Transacao>();
            }

            var textoJson = File.ReadAllText(_caminhoArquivo);

            if (string.IsNullOrWhiteSpace(textoJson))
            {
                return new List<Transacao>();
            }

            var transacoes = JsonSerializer.Deserialize<List<Transacao>>(textoJson, _opcoesJson);
            return transacoes ?? new List<Transacao>();
        }

        private void Salvar()
        {
            var textoJson = JsonSerializer.Serialize(_transacoes, _opcoesJson);
            File.WriteAllText(_caminhoArquivo, textoJson);
        }
    }
}
