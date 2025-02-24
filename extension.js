const vscode = require('vscode');
const os = require('os');

let currentDecoration = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'dislexia.showSettingsPanel',
    function () {
      const panel = vscode.window.createWebviewPanel(
        'settingsPanel',
        'Configurações Visuais',
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'saveSettings':
              saveSettings(message.font, message.fontSize, message.color);
              vscode.window.showInformationMessage(
                `Configurações salvas: Fonte - ${message.font}, Tamanho - ${message.fontSize}, Cor - ${message.color}`
              );
              break;
            case 'restoreDefaults':
              restoreDefaultSettings(panel);
              break;
            case 'markText':
              markText();
              break;
            case 'clearMarking':
              clearMarking();
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurações Visuais</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      label { display: block; margin: 10px 0 5px; }
      input, select { width: 100%; padding: 5px; }
      button { margin-top: 10px; padding: 10px; cursor: pointer; }
    </style>
  </head>
  <body>
    <h2>⚙️ Configurações Visuais</h2>

    <label for="font">📄 Fonte:</label>
    <select id="font">
      <option value="Arial">Arial</option>
      <option value="Verdana">Verdana</option>
      <option value="Tahoma">Tahoma</option>
      <option value="Lexend">Lexend</option>
      <option value="OpenDyslexic">OpenDyslexic</option>
    </select>

    <label for="fontSize">🔡 Tamanho da Fonte:</label>
    <input type="number" id="fontSize" value="14" min="8" max="32">

    <label for="color">🎨 Cor do Texto:</label>
    <input type="color" id="color">

    <button onclick="saveSettings()">💾 Salvar Configurações</button>
    <button onclick="restoreDefaults()">🔄 Restaurar para Padrão</button>
    <button onclick="markText()">✍️ Marcar Código</button>
    <button onclick="clearMarking()">🚫 Limpar Marcação</button>

    <script>
      const vscode = acquireVsCodeApi();

      function saveSettings() {
        const font = document.getElementById('font').value;
        const fontSize = document.getElementById('fontSize').value;
        const color = document.getElementById('color').value;

        vscode.postMessage({
          command: 'saveSettings',
          font, fontSize, color
        });
      }

      function restoreDefaults() {
        vscode.postMessage({ command: 'restoreDefaults' });
      }

      function markText() {
        vscode.postMessage({ command: 'markText' });
      }

      function clearMarking() {
        vscode.postMessage({ command: 'clearMarking' });
      }
    </script>
  </body>
  </html>`;
}

function saveSettings(font, fontSize, color) {
  const configuration = vscode.workspace.getConfiguration('editor');
  
  const userOS = os.platform();
  let defaultFont = 'monospace';

  if (userOS === 'win32') {
    defaultFont = 'Consolas';
  } else if (userOS === 'darwin') {
    defaultFont = 'Monaco';
  } else if (userOS === 'linux') {
    defaultFont = 'Ubuntu Mono';
  }

  const fontToUse = font === 'monospace' ? defaultFont : font; 
  configuration.update('fontFamily', fontToUse, vscode.ConfigurationTarget.Global);
  configuration.update('fontSize', parseInt(fontSize), vscode.ConfigurationTarget.Global);

  const userSettings = vscode.workspace.getConfiguration('workbench');
  const editorColorSettings = {
    "colorCustomizations": {
      "editor.foreground": color 
    }
  };

  userSettings.update('colorCustomizations', editorColorSettings.colorCustomizations, vscode.ConfigurationTarget.Global);
}

function markText() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showInformationMessage("Por favor, selecione um trecho de código.");
      return;
    }

 
    const decorationType = createMarkingDecoration();
    editor.setDecorations(decorationType, [selection]);
    currentDecoration = decorationType;

    vscode.window.showInformationMessage("Texto marcado.");
  }
}


function clearMarking() {
  const editor = vscode.window.activeTextEditor;
  if (editor && currentDecoration) {
    editor.setDecorations(currentDecoration, []); 
    currentDecoration.dispose(); 
    currentDecoration = null; 
    vscode.window.showInformationMessage("Marcação removida.");
  } else {
    vscode.window.showInformationMessage("Nenhuma marcação encontrada para remover.");
  }
}

function createMarkingDecoration() {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 255, 0, 0.3)', // Cor de marcação (amarelo)
    isWholeLine: false,
  });
}

function restoreDefaultSettings(panel) {
  const configuration = vscode.workspace.getConfiguration('editor');
  const userOS = os.platform();
  let defaultFont = 'monospace';

  if (userOS === 'win32') {
    defaultFont = 'Consolas';
  } else if (userOS === 'darwin') {
    defaultFont = 'Monaco';
  } else if (userOS === 'linux') {
    defaultFont = 'Ubuntu Mono';
  }

  configuration.update('fontFamily', defaultFont, vscode.ConfigurationTarget.Global);
  configuration.update('fontSize', 14, vscode.ConfigurationTarget.Global);

  const theme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
  let defaultColor = '#ffffff'; 
  
  if (theme && theme.toLowerCase().includes('dark')) {
    defaultColor = '#000000'; 
  }

  const userSettings = vscode.workspace.getConfiguration('workbench');
  const editorColorSettings = {
    "colorCustomizations": {
      "editor.foreground": defaultColor
    }
  };

  userSettings.update('colorCustomizations', editorColorSettings.colorCustomizations, vscode.ConfigurationTarget.Global);

  panel.webview.postMessage({
    command: 'restoreDefaults',
    font: defaultFont,
    fontSize: 14,
    color: defaultColor,
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
