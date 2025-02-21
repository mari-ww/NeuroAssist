const vscode = require('vscode');

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
    </script>
  </body>
  </html>`;
}

function saveSettings(font, fontSize, color) {
  const configuration = vscode.workspace.getConfiguration('editor');

  // Salvar configurações
  configuration.update('fontFamily', font, vscode.ConfigurationTarget.Global);
  configuration.update('fontSize', parseInt(fontSize), vscode.ConfigurationTarget.Global);
  
  // Alterar a cor do texto
  const userSettings = vscode.workspace.getConfiguration('workbench.colorCustomizations');
  const editorColorSettings = {
    "editor.foreground": color
  };
  
  userSettings.update('editor', editorColorSettings, vscode.ConfigurationTarget.Global);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
