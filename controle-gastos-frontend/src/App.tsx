import { useState } from "react";
import CadastroPessoas from "./components/CadastroPessoas";
import CadastroTransacoes from "./components/CadastroTransacoes";
import ConsultaTotais from "./components/ConsultaTotais";
import "./App.css";

// Abas disponíveis no sistema.
type Aba = "pessoas" | "transacoes" | "totais";

function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pessoas");

  return (
    <div className="container">
      <header className="cabecalho-app">
        <h1>Controle de Gastos Residenciais</h1>
      </header>

      <nav className="menu-abas">
        <button
          className={abaAtiva === "pessoas" ? "aba-ativa" : ""}
          onClick={() => setAbaAtiva("pessoas")}
        >
          Pessoas
        </button>
        <button
          className={abaAtiva === "transacoes" ? "aba-ativa" : ""}
          onClick={() => setAbaAtiva("transacoes")}
        >
          Transações
        </button>
        <button
          className={abaAtiva === "totais" ? "aba-ativa" : ""}
          onClick={() => setAbaAtiva("totais")}
        >
          Totais
        </button>
      </nav>

      <main>
        {abaAtiva === "pessoas" && <CadastroPessoas />}
        {abaAtiva === "transacoes" && <CadastroTransacoes />}
        {abaAtiva === "totais" && <ConsultaTotais />}
      </main>
    </div>
  );
}

export default App;
