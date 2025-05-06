const vscode = require('vscode');
let settingsPanel = null;
const { listVariables, addVariable } = require('./variableManager');
const { getWebviewContent } = require('./webviewContent');
const { saveSettings, restoreDefaultSettings, markText, clearMarking } = require('./editorActions');

let currentDecoration = null;
let focusDecoration = null;
let focusModeActive = false;
let activeLinesSet = new Set();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("dislexia.toggleFocusMode", () => {
      toggleFocusMode();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dislexia.showSettingsPanel', () => {
      if (settingsPanel) {
        settingsPanel.reveal(vscode.ViewColumn.Two);
        return;
      }

      settingsPanel = vscode.window.createWebviewPanel(
        'settingsPanel',
        'Configurações Visuais',
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
        }
      );

      const variables = listVariables();
      settingsPanel.webview.html = getWebviewContent(variables);

      const themeKind = vscode.window.activeColorTheme.kind;
      settingsPanel.webview.postMessage({ command: "setTheme", theme: themeKind });

      settingsPanel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'saveSettings':
              saveSettings(message.font, message.fontSize, message.color, message.letterSpacing, message.lineHeight);
              vscode.window.showInformationMessage(
                `Configurações salvas: Fonte - ${message.font}, Tamanho - ${message.fontSize}, Cor - ${message.color}`
              );
              break;
            case 'restoreDefaults':
              restoreDefaultSettings(settingsPanel);
              break;
            case 'markText':
              markText(message.highlightColor || '#ffff00');
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

      settingsPanel.onDidDispose(() => {
        settingsPanel = null;
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dislexia.addVariable', async () => {
      const name = await vscode.window.showInputBox({ prompt: 'Nome da variável' });
      const type = await vscode.window.showQuickPick(['string', 'number', 'boolean'], { placeHolder: 'Tipo da variável' });
      const raw = await vscode.window.showInputBox({ prompt: 'Valor inicial' });
      let value = raw;
      if (type === 'number') value = Number(raw);
      else if (type === 'boolean') value = raw === 'true';

      try {
        addVariable(name, type, value);
        vscode.window.showInformationMessage(`Variável "${name}" adicionada!`);

        const variables = listVariables();

        if (settingsPanel) {
          settingsPanel.webview.postMessage({ command: 'updateVariables', variables });
        }
      } catch (e) {
        vscode.window.showErrorMessage(e.message);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dislexia.listVariables', () => {
      const vars = listVariables();
      console.table(vars);
    })
  );
}

function deactivate() {}

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
  const backgroundColor = config.get("focusModeBackground", "rgba(0, 0, 0, 1)");

  currentDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'transparent',
    isWholeLine: true,
  });

  focusDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'black',
    isWholeLine: true,
  });

  updateFocus(editor);
  vscode.window.onDidChangeTextEditorSelection(() => updateFocus(editor));
}

function updateFocus(editor) {
  if (!focusModeActive) return;

  const totalLines = editor.document.lineCount;
  const selections = editor.selections;

  for (const sel of selections) {
    for (let i = sel.start.line; i <= sel.end.line; i++) {
      activeLinesSet.add(i);
    }
  }

  const decorations = [];
  for (let i = 0; i < totalLines; i++) {
    if (!activeLinesSet.has(i)) {
      decorations.push(new vscode.Range(i, 0, i, editor.document.lineAt(i).text.length));
    }
  }

  editor.setDecorations(focusDecoration, decorations);

  const highlightDecorations = [];
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

module.exports = {
  activate,
  deactivate,
};