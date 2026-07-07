namespace ControleGastosApi.Models
{
    // Essa classe representa uma pessoa cadastrada no sistema.
    public class Pessoa
    {
        // O Id é gerado automaticamente pelo sistema (ver PessoaRepositorio).
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public int Idade { get; set; }

        // Facilita saber rapidamente se a pessoa é menor de idade.
        // Usado na regra de negócio de transações (menores só podem ter despesas).
        public bool EhMenorDeIdade()
        {
            return Idade < 18;
        }
    }
}
