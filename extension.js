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
              case 'updateFocusOpacity':
              updateFocusOpacity(message.focusOpacity);
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

function updateFocusOpacity(opacity) {
  if (!focusDecoration) return;

  focusDecoration.dispose(); 

  focusDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    color: 'black',
    isWholeLine: true,
  });

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    updateFocus(editor);
  }
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
    backgroundColor:'rgba(0, 0, 0, 0.6)', // Fundo preto para as outras linhas
    color: 'black', // Texto oculto (pretas)
    isWholeLine: true,
  });

  updateFocus(editor);
  vscode.window.onDidChangeTextEditorSelection(() => updateFocus(editor));
}

let activeLinesSet = new Set(); // variável global para guardar as linhas visíveis

function updateFocus(editor) {
  if (!focusModeActive) return;

  const totalLines = editor.document.lineCount;
  const selections = editor.selections;

  // Adiciona novas linhas ativas ao conjunto
  for (const sel of selections) {
    for (let i = sel.start.line; i <= sel.end.line; i++) {
      activeLinesSet.add(i);
    }
  }

  let decorations = [];

  for (let i = 0; i < totalLines; i++) {
    if (!activeLinesSet.has(i)) {
      decorations.push(new vscode.Range(i, 0, i, editor.document.lineAt(i).text.length));
    }
  }

  // Aplica a decoração escura para linhas fora do foco
  editor.setDecorations(focusDecoration, decorations);

  // Destaca as linhas visíveis
  let highlightDecorations = [];
  for (let line of activeLinesSet) {
    highlightDecorations.push(new vscode.Range(line, 0, line, editor.document.lineAt(line).text.length));
  }
  editor.setDecorations(currentDecoration, highlightDecorations);
}

function clearFocusMode() {
  if (focusDecoration) {
    focusDecoration.dispose();
    focusDecoration = null;
  }
}

function clearFocus(editor) {
  activeLinesSet.clear();

  if (focusDecoration) {
    editor.setDecorations(focusDecoration, []);
  }

  if (currentDecoration) {
    editor.setDecorations(currentDecoration, []);
  }
}