# 📖 Extensão VS Code - Dislexia Helper

Uma extensão para o VS Code que melhora a acessibilidade do editor para pessoas com dislexia, permitindo personalização da fonte, espaçamento, cor do texto e um modo de leitura aprimorado para facilitar o foco no código.

---

## ✨ Funcionalidades

- 🛠 **Personalização Visual**: Ajuste fonte, tamanho, cor do texto, espaçamento e altura da linha.
- 🔍 **Modo de Leitura Aprimorado**: Destaca apenas a linha ativa e escurece as demais para aumentar o foco.
- 📝 **Marcação de Texto**: Permite destacar trechos importantes do código.
- ♻ **Restauração de Padrões**: Volta para as configurações padrão do VS Code com um clique.

---

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/dislexia-helper.git
   cd Dislexia-master
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Abra no VS Code e pressione `F5` para testar a extensão.

---

## 🖥 Como Usar

### 📌 Abrir o Painel de Configuração:
- **Atalho:** `Ctrl + Alt + S`
- **Comando:** `Dislexia: Abrir Configurações Visuais`

### 🎯 Alternar Modo de Leitura Aprimorado:
- **Atalho:** `Ctrl + Alt + F`
- **Comando:** `Dislexia: Alternar Modo de Leitura Aprimorado`

### 🔖 Destacar Texto:
- Selecione um trecho do código e clique em `Dislexia: Marcar Texto`
- Para remover a marcação, clique em `Dislexia: Limpar Marcação`

### 🔄 Restaurar Configurações Padrão:
- No painel de configurações, clique em `Restaurar Padrões`

---

## 🔧 Configurações

A extensão permite personalizar algumas opções diretamente no `settings.json`:
```json
{
  "dislexia.focusModeBackground": "rgba(0, 0, 0, 0.7)",
  "dislexia.font": "Lexend"
}
```

---

## 📚 Tecnologias Utilizadas

- **Node.js**
- **Visual Studio Code API**
- **JavaScript**

---

## 📜 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir! 🎉

