const vscode = require('vscode');
const { getWebviewContent } = require('./webviewContent');
const { saveSettings, restoreDefaultSettings, markText, clearMarking } = require('./editorActions');

let currentDecoration = null;
let focusDecoration = null;
let focusModeActive = false;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let disposableFocusMode = vscode.commands.registerCommand("dislexia.toggleFocusMode", function () {
    toggleFocusMode();
  });

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

      const themeKind = vscode.window.activeColorTheme.kind; // Pega o tema atual

      panel.webview.postMessage({ command: "setTheme", theme: themeKind });

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'saveSettings':
              saveSettings(message.font, message.fontSize, message.color, message.letterSpacing, message.lineHeight);
              vscode.window.showInformationMessage(
                `Configurações salvas: Fonte - ${message.font}, Tamanho - ${message.fontSize}, Cor - ${message.color}`
              );
              break;
            case 'restoreDefaults':
              restoreDefaultSettings(panel);
              break;
              case 'markText':
                markText(message.highlightColor || '#ffff00'); // padrão amarelo
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
  context.subscriptions.push(disposableFocusMode);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

function toggleFocusMode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  if (focusModeActive) {
    clearFocusMode();
  } else {
    applyFocusMode(editor);
  }
  focusModeActive = !focusModeActive;
}

function applyFocusMode(editor) {
  const config = vscode.workspace.getConfiguration("dislexia");
  const backgroundColor = config.get("focusModeBackground", "rgba(0, 0, 0, 1)"); // Padrão: preto opaco

  // Linha ativa: conteúdo visível e sem alteração
  currentDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'transparent', // Sem alteração no fundo da linha ativa
    isWholeLine: true,
  });

  // Linhas não ativas: fundo preto e texto oculto
  focusDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'black', // Fundo preto para as outras linhas
    color: 'black', // Texto oculto (pretas)
    isWholeLine: true,
  });

  updateFocus(editor);
  vscode.window.onDidChangeTextEditorSelection(() => updateFocus(editor));
}

function updateFocus(editor) {
  if (!focusModeActive) return;

  const totalLines = editor.document.lineCount;
  const activeLine = editor.selection.active.line;

  let decorations = [];

  // Adiciona decoração de fundo preto para as linhas não ativas
  for (let i = 0; i < totalLines; i++) {
    if (i !== activeLine) {
      decorations.push(new vscode.Range(i, 0, i, editor.document.lineAt(i).text.length));
    }
  }

  editor.setDecorations(focusDecoration, decorations); // Aplica a decoração de fundo preto para as linhas não ativas
  editor.setDecorations(currentDecoration, [new vscode.Range(activeLine, 0, activeLine, editor.document.lineAt(activeLine).text.length)]); // Destaca a linha ativa sem fundo preto
}

function clearFocusMode() {
  if (focusDecoration) {
    focusDecoration.dispose();
    focusDecoration = null;
  }
}