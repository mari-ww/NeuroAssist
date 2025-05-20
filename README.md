Aqui está a versão corrigida do seu README.md:

**NeuroAssist: Extensão VS Code para Leitura Acessível**

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://marketplace.visualstudio.com/items?itemName=mari-ww.neuroassist)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/mari-ww.neuroassist)](https://marketplace.visualstudio.com/items?itemName=mari-ww.neuroassist)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📖 Descrição

A **NeuroAssist** é uma extensão inovadora para o Visual Studio Code, projetada para tornar a leitura e a escrita de código mais confortáveis e acessíveis. Ideal para desenvolvedores que buscam maior clareza visual e personalização, ela oferece:

* **Configurações Visuais**: Ajuste de fonte (incluindo suporte à OpenDyslexic), tamanho de texto, cor do texto, espaçamento entre linhas e letras para reduzir a fadiga ocular.
* **Modo Foco**: Destaque automático dos trechos de código selecionados, escurecendo o restante do editor para aumentar a concentração.
* **Marcação Dinâmica**: Ferramenta de marcação de texto que permite destacar partes específicas do código com a cor escolhida.
* **Gerenciamento de Variáveis via WebView**: Crie, liste e atualize variáveis personalizadas diretamente na interface web da extensão.

Com a NeuroAssist, você pode transformar seu ambiente de desenvolvimento num espaço mais confortável e adaptado às suas necessidades, especialmente se você busca maior legibilidade ou apresenta dificuldades de leitura.

---

## 🚀 Instalação

### 1. Instalação Local (Desenvolvimento)

1. **Clonar o repositório**:

   ```bash
   git clone https://github.com/mari-ww/NeuroAssist.git
   cd NeuroAssist
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Compilar (se necessário)**:

   > Caso você use ferramentas de build ou transpilações, execute o script apropriado. Exemplo:

   ```bash
   npm run compile
   ```

4. **Carregar a extensão no VS Code**:

   * Abra o VS Code.
   * Pressione `F5` para iniciar uma nova janela de desenvolvimento com a extensão carregada.
   * Na nova janela, você verá a extensão **NeuroAssist** disponível.

### 2. Instalação via Marketplace

1. Abra o **Visual Studio Code**.
2. Acesse a seção **Extensões** (`Ctrl+Shift+X`).
3. Pesquise por `NeuroAssist`.
4. Clique em **Instalar**.
5. Após a instalação, pressione `Ctrl+Alt+S` para abrir o painel de configurações visuais ou `Ctrl+Alt+F` para alternar o modo foco.

---

## 📺 Demonstração

<p align="center">
  ![Demonstração da NeuroAssist](images/demo.gif)
</p>

> *GIF ilustrando a abertura do painel de configurações, ajustes de fonte e ativação do modo foco.*

---

## 🛠️ Documentação Técnica das APIs Utilizadas

### 1. VS Code API (*vscode*)

* **`vscode.window.createWebviewPanel`**: Cria o painel de configurações interativo.
* **`vscode.workspace.getConfiguration`**: Gerencia as configurações do editor.
* **`vscode.window.createTextEditorDecorationType`**: Implementa as decorações de texto para marcações.

### 2. Node.js API

* **`os.platform()`**: Detecta o sistema operacional para configurações padrão.

---

## 📑 Documentação Técnica das APIs de Terceiros

* **Axios**: Preparado para futuras integrações com APIs externas.
* **Fast XML Parser**: Para possível manipulação de dados estruturados.

---

## ✅ Badges e Links Úteis

* **Marketplace**: [NeuroAssist no VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mari-ww.neuroassist)
* **Repositório GitHub**: [https://github.com/mari-ww/NeuroAssist](https://github.com/mari-ww/NeuroAssist)
* **Issues**: [Área de Issues no GitHub](https://github.com/mari-ww/NeuroAssist/issues)
* **Documentação VS Code**: [https://code.visualstudio.com/api](https://code.visualstudio.com/api)

---

## 📝 Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

> Mantenha seu ambiente de desenvolvimento mais acessível e confortável com a NeuroAssist. Contribuições e feedbacks são bem-vindos! ❤️
