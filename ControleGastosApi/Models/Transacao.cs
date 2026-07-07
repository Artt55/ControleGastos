namespace ControleGastosApi.Models
{
    // Essa classe representa uma transação financeira (uma receita ou uma despesa).
    public class Transacao
    {
        // O Id é gerado automaticamente pelo sistema (ver TransacaoRepositorio).
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public decimal Valor { get; set; }

        public TipoTransacao Tipo { get; set; }

        // Guarda apenas o Id da pessoa dona da transação.
        public int PessoaId { get; set; }
    }
}
