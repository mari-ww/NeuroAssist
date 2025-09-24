# NeuroAssist: Extensão VS Code para Acessibilidade Neurodivergente

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Downloads](https://img.shields.io/badge/downloads-1k%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)
![VS Code](https://img.shields.io/badge/VS%20Code-Extension-purple)

## 📖 Descrição
A **NeuroAssist** é uma extensão para Visual Studio Code projetada especificamente para **programadores neurodivergentes**, oferecendo ferramentas de acessibilidade visual avançadas para melhorar a experiência de codificação. 

### ✨ Recursos Principais:
- **Interface Acessível**: Design limpo com temas claro/escuro e fontes otimizadas para dislexia
- **Modo Foco Inteligente**: Realce de código selecionado com escurecimento contextual
- **Pomodoro Integrado**: Timer de produtividade embutido no painel de configurações
- **Marcação Dinâmica**: Sistema de realce de código com cores personalizáveis
- **Configurações Neuro-inclusivas**: Ajustes finos para necessidades sensoriais específicas

## 🚀 Instalação

### Via Marketplace
1. Abra o VS Code
2. Pressione `Ctrl+Shift+X`
3. Busque por **"NeuroAssist"**
4. Clique em **Instalar**

> **Atalhos:**
> - `Ctrl+Alt+S` para abrir configurações
> - `Ctrl+Alt+F` para ativar o Modo Foco
> - `Ctrl+Alt+V` para adicionar variável

## Desenvolvimento
```bash
git clone https://github.com/mari-ww/NeuroAssist.git
cd NeuroAssist
npm install
# Pressione F5 no VS Code para testar
```

## 🎯 Como Usar
### Painel de Configurações Visuais (Ctrl+Alt+S)
- Fontes Acessíveis: OpenDyslexic, Comic Sans MS, Verdana
- Ajustes Sensoriais: Espaçamento de linhas/letras personalizável
- Temas: Alternância instantânea entre claro/escuro
- Prévia em Tempo Real: Visualização imediata das alterações

### Sistema Pomodoro Integrado
- Timer de produtividade 25/5 embutido
- Controles diretos no painel principal
- Visualização clara do tempo restante

### Marcação de Código
- Cores totalmente personalizáveis
- Múltiplas marcações simultâneas
- Limpeza rápida com um clique

## 📺 Demonstração
<p align="center">
  <img src="images/demo.gif" alt="Demonstração da NeuroAssist" width="600">
</p>

## 🛠️ Integração Técnica

### VS Code API
| Função                         | Descrição                 | Uso no Projeto             |
|-------------------------------|----------------------------|----------------------------|
| `createWebviewPanel`         | Cria interfaces web        | Painel de configurações    |
| `getConfiguration`           | Gerencia preferências      | Ajustes de fonte/cor       |
| `createTextEditorDecorationType` | Estiliza texto             | Realces e Modo Foco        |

## 📦 Dependências
```json
"dependencies": {
  "fastest-levenshtein": "^1.0.16"
}
```

## 🔧 Desenvolvimento
```bash
git clone https://github.com/mari-ww/NeuroAssist.git
cd NeuroAssist
npm install
# Pressione F5 no VS Code para testar
```

## 🤝 Contribuindo
1. Reporte Bugs: [Abrir Issue](https://github.com/mari-ww/NeuroAssist/issues)
2. Sugira Funcionalidades: Use o template de feature request
3. Envie Pull Requests: Siga as guidelines de contribuição

## 🔗 Links Úteis
- [Repositório GitHub](https://github.com/mari-ww/NeuroAssist)
- [Relatar Issues](https://github.com/mari-ww/NeuroAssist/issues)
- [Documentação VS Code API](https://code.visualstudio.com/api)

## 📝 Licença
MIT License - Consulte o arquivo LICENSE para mais detalhes.

✨ Desenvolvido com acessibilidade em mente ✨

> Encontrou um bug? Tem uma sugestão? Abra uma [issue](https://github.com/mari-ww/NeuroAssist/issues).

💡 Dica: A extensão é totalmente gratuita e de código aberto. Sua contribuição é bem-vinda!
