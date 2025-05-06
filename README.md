# 📖 Dislexia Helper — Extensão para VS Code

A **Dislexia Helper** é uma extensão para o Visual Studio Code projetada para tornar o ambiente de programação mais acessível a pessoas com dislexia. Ela permite **personalizações visuais detalhadas**, como escolha de fonte, espaçamento entre letras e linhas, cor do texto e **um modo de foco que melhora a concentração durante a leitura de código**.

---

## ✨ Funcionalidades

- 🛠 **Painel de Configuração Visual (WebView)**  
  Interface intuitiva para customizar fonte, tamanho, cor do texto, espaçamento entre letras e entre linhas, com visualização em tempo real.

- 🌗 **Modo de Leitura Aprimorado (Modo Foco)**  
  Escurece as demais linhas do editor e realça a linha atual para ajudar na concentração e reduzir distrações.

- 🖍️ **Marcação Personalizada de Código**  
  Destaque visual de trechos importantes com a cor de sua escolha — configurável diretamente no painel.

- ♻ **Restauração Rápida para Padrões**  
  Retorne às configurações padrão do VS Code com um clique, mantendo a flexibilidade e controle.

- 📋 **Criação de Variáveis de Acessibilidade**  
  Armazene configurações e preferências como variáveis reutilizáveis no editor.

---

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/dislexia-helper.git
   cd dislexia-helper
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```
3. Abra o projeto no VS Code e pressione F5 para iniciar a extensão em modo de desenvolvimento.

---

## 🖥 Como Usar

### ⚙ Abrir Painel de Configurações Visuais
- **Atalho:** `Ctrl + Alt + S`  
- **Comando:** `Dislexia: Abrir Configurações Visuais`

### 🌙 Ativar/Desativar Modo Foco
- **Atalho:** `Ctrl + Alt + F`  
- **Comando:** `Dislexia: Alternar Modo de Leitura Aprimorado`

### 🖍 Marcar ou Limpar Código
- Selecione um trecho e execute:
  - `Dislexia: Marcar Texto` para destacar
  - `Dislexia: Limpar Marcação` para remover o destaque

### ♻ Restaurar Padrões
- No painel de configurações, clique em **Restaurar para Padrão**

---

## 🔧 Configurações Avançadas (`settings.json`)

Você também pode personalizar valores via arquivo de configuração do VS Code:

```json
{
  "dislexia.focusModeBackground": "rgba(0, 0, 0, 0.7)",
  "dislexia.font": "Lexend",
  "dislexia.highlightColor": "#ffff00"
}
```

---

## 📚 Tecnologias Utilizadas

- **Node.js**
- **JavaScript**
- **VS Code Extension API**
- **WebView para UI personalizada**

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.
