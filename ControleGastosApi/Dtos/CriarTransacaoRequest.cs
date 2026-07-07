using ControleGastosApi.Models;

namespace ControleGastosApi.Dtos
{
    // Representa os dados que o front-end envia para criar uma transação.
    public class CriarTransacaoRequest
    {
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public int PessoaId { get; set; }
    }
}
