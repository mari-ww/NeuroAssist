# NeuroAssist: Extensão VS Code para Leitura Acessível

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Downloads](https://img.shields.io/badge/downloads-1k%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 📖 Descrição
A **NeuroAssist** é uma extensão para o Visual Studio Code que oferece ferramentas de **acessibilidade visual** para programadores. 

### Principais recursos:
- **Configurações Visuais**: Personalize fonte (OpenDyslexic incluso), tamanho, cor, espaçamento de linhas/letras.
- **Modo Foco**: Realce de trechos selecionados com escurecimento do contexto.
- **Marcação Dinâmica**: Destaque de código com cores personalizadas.
- **WebView Integrado**: Painel interativo para configurações e gerenciamento de variáveis.

## 🚀 Instalação

### Via Marketplace
1. Abra o VS Code
2. Pressione `Ctrl+Shift+X`
3. Busque por **"NeuroAssist"**
4. Clique em **Instalar**

> Atalhos:
> - `Ctrl+Alt+S` para abrir configurações
> - `Ctrl+Alt+F` para ativar o Modo Foco

### Desenvolvimento
```bash
git clone https://github.com/mari-ww/NeuroAssist.git
cd NeuroAssist
npm install
# Pressione F5 no VS Code para testar
```

## 📺 Demonstração
<p align="center">
  <img src="images/demo.gif" alt="Demonstração da NeuroAssist" width="600">
</p>

## 🛠️ Integração Técnica

### 1. VS Code API
| Função                         | Descrição                 | Uso no Projeto             |
|-------------------------------|----------------------------|----------------------------|
| `createWebviewPanel`         | Cria interfaces web        | Painel de configurações    |
| `getConfiguration`           | Gerencia preferências      | Ajustes de fonte/cor       |
| `createTextEditorDecorationType` | Estiliza texto             | Realces e Modo Foco        |

### 2. Node.js Core
| Módulo | Função                  | Uso                        |
|--------|------------------------|-----------------------------|
| `os`   | Sistema operacional     | Define fontes padrão por OS |

## 📦 Dependências
```json
"dependencies": {
  "axios": "^1.7.9",          // (Reservado para futuras integrações)
  "fast-xml-parser": "^4.5.1" // (Planejado para exportação de dados)
}
```

## 🔗 Links Úteis
- [Repositório GitHub](https://github.com/mari-ww/NeuroAssist)
- [Relatar Issues](https://github.com/mari-ww/NeuroAssist/issues)
- [Documentação VS Code API](https://code.visualstudio.com/api)

## 📝 Licença
MIT License - Consulte o arquivo LICENSE para mais detalhes.

Seu feedback ajuda a melhorar a NeuroAssist! ✨

> Encontrou um bug? Tem uma sugestão? Abra uma [issue](https://github.com/mari-ww/NeuroAssist/issues).
