namespace ControleGastosApi.Models
{
    // Tipo da transação: só pode ser Receita (dinheiro que entra)
    // ou Despesa (dinheiro que sai).
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }
}
