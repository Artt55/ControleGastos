namespace ControleGastosApi.Dtos
{
    // Representa a resposta completa da consulta de totais:
    // o total de cada pessoa + o total geral somando todo mundo.
    public class TotalGeralResponse
    {
        public List<TotalPessoaResponse> Pessoas { get; set; } = new();
        public decimal TotalReceitasGeral { get; set; }
        public decimal TotalDespesasGeral { get; set; }
        public decimal SaldoGeral { get; set; }
    }
}
