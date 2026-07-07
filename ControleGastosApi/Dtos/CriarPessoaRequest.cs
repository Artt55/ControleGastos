namespace ControleGastosApi.Dtos
{
    // Representa os dados que o front-end envia para criar uma pessoa.
    // Não usamos a classe Pessoa direto aqui porque o Id não deve
    // ser informado pelo cliente (ele é gerado pelo sistema).
    public class CriarPessoaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}
