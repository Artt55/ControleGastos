using System.Text.Json;
using System.Text.Json.Serialization;
using ControleGastosApi.Models;

namespace ControleGastosApi.Repositorios
{
    // Essa classe é responsável por guardar e recuperar as pessoas.
    // Para não precisar de um banco de dados de verdade, os dados são
    // salvos em um arquivo JSON dentro da pasta "Dados".
    // Assim, mesmo fechando a aplicação, as informações continuam lá.
    public class PessoaRepositorio
    {
        private readonly string _caminhoArquivo;
        private readonly List<Pessoa> _pessoas;
        private int _proximoId;

        // Trava usada para evitar problemas quando duas requisições
        // tentam alterar a lista ao mesmo tempo.
        private static readonly object _trava = new();

        private static readonly JsonSerializerOptions _opcoesJson = new()
        {
            WriteIndented = true,
            Converters = { new JsonStringEnumConverter() }
        };

        public PessoaRepositorio(IWebHostEnvironment ambiente)
        {
            var pastaDados = Path.Combine(ambiente.ContentRootPath, "Dados");
            Directory.CreateDirectory(pastaDados);
            _caminhoArquivo = Path.Combine(pastaDados, "pessoas.json");

            _pessoas = CarregarDoArquivo();

            // Descobre qual o próximo Id disponível olhando o maior Id já usado.
            _proximoId = _pessoas.Count > 0 ? _pessoas.Max(p => p.Id) + 1 : 1;
        }

        public List<Pessoa> ListarTodas()
        {
            return _pessoas;
        }

        public Pessoa? BuscarPorId(int id)
        {
            return _pessoas.FirstOrDefault(p => p.Id == id);
        }

        public Pessoa Criar(string nome, int idade)
        {
            lock (_trava)
            {
                var novaPessoa = new Pessoa
                {
                    Id = _proximoId,
                    Nome = nome,
                    Idade = idade
                };

                _proximoId++;
                _pessoas.Add(novaPessoa);
                Salvar();

                return novaPessoa;
            }
        }

        // Remove a pessoa da lista. Retorna true se conseguiu remover.
        public bool Remover(int id)
        {
            lock (_trava)
            {
                var pessoa = BuscarPorId(id);
                if (pessoa == null)
                {
                    return false;
                }

                _pessoas.Remove(pessoa);
                Salvar();
                return true;
            }
        }

        private List<Pessoa> CarregarDoArquivo()
        {
            if (!File.Exists(_caminhoArquivo))
            {
                return new List<Pessoa>();
            }

            var textoJson = File.ReadAllText(_caminhoArquivo);

            if (string.IsNullOrWhiteSpace(textoJson))
            {
                return new List<Pessoa>();
            }

            var pessoas = JsonSerializer.Deserialize<List<Pessoa>>(textoJson, _opcoesJson);
            return pessoas ?? new List<Pessoa>();
        }

        private void Salvar()
        {
            var textoJson = JsonSerializer.Serialize(_pessoas, _opcoesJson);
            File.WriteAllText(_caminhoArquivo, textoJson);
        }
    }
}
