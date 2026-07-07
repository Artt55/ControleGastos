using System.Text.Json.Serialization;
using ControleGastosApi.Repositorios;

var builder = WebApplication.CreateBuilder(args);

// Registra os repositórios como singletons: como eles guardam a lista
// de dados em memória (e sincronizam com o arquivo JSON), faz sentido
// que exista apenas UMA instância deles durante toda a execução da API.
builder.Services.AddSingleton<PessoaRepositorio>();
builder.Services.AddSingleton<TransacaoRepositorio>();

builder.Services.AddControllers().AddJsonOptions(opcoes =>
{
    // Faz o campo "Tipo" (enum) ser exibido como texto ("Receita"/"Despesa")
    // ao invés de número, para ficar mais fácil de ler no front-end.
    opcoes.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Libera o acesso da API para o front-end em React, que roda em outra porta.
builder.Services.AddCors(opcoes =>
{
    opcoes.AddPolicy("PermitirFrontend", politica =>
    {
        politica.WithOrigins("http://localhost:5173", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("PermitirFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
