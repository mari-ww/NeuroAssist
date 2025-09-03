const vscode = require('vscode');
let settingsPanel = null;
const { listVariables, addVariable } = require('./variableManager');
const { getWebviewContent } = require('./webviewContent');
const { saveSettings, restoreDefaultSettings, markText, clearMarking } = require('./editorActions');
const { distance } = require('fastest-levenshtein');

const path = require('path');
const fs = require('fs');


let currentDecoration = null;
let focusDecoration = null;
let focusModeActive = false;
let activeLinesSet = new Set();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("neuroassist.toggleFocusMode", () => {
      toggleFocusMode();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('neuroassist.showSettingsPanel', () => {
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
      const config = vscode.workspace.getConfiguration('neuroassist');
      const savedSettings = {
        font: config.get('font', 'Lexend'),
        fontSize: config.get('fontSize', 18),
        color: config.get('color', '#000000'),
        letterSpacing: config.get('letterSpacing', 0),
        lineHeight: config.get('lineHeight', 1.5),
        focusOpacity: config.get('focusModeOpacity', 0.7)
      };

      settingsPanel.webview.html = getWebviewContent(variables, savedSettings);

      const themeKind = vscode.window.activeColorTheme.kind;
      settingsPanel.webview.postMessage({ command: "setTheme", theme: themeKind });

      settingsPanel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'saveSettings':
              saveSettings(
                message.font, 
                message.fontSize, 
                message.color, 
                message.letterSpacing, 
                message.lineHeight,
                message.focusOpacity
              );
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
    vscode.commands.registerCommand('neuroassist.listVariables', () => {
      const vari = listVariables();
      console.table(vari);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('neuroassist.addVariable', async () => {
      const name = await vscode.window.showInputBox({ prompt: 'Nome da variável' });
      if (!name) return;
  
      // Verificação de similaridade
      checkSimilarVariable(name);
  
      const type = await vscode.window.showQuickPick(['string', 'number', 'boolean'], { placeHolder: 'Tipo da variável' });
      if (!type) return;
  
      const raw = await vscode.window.showInputBox({ prompt: 'Valor inicial' });
      if (raw === undefined) return;
  
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
    vscode.commands.registerCommand('dislexia.openPomodoroTimer', () => {
      openPomodoroTimer(context);
    })
  );
  
}
function checkSimilarVariable(newVarName) {
  const variables = listVariables();
  for (const variable of variables) {
    const existingName = variable.name;
    const dist = distance(newVarName, existingName);
    if (dist <= 2 && newVarName.length >= 4) {
      vscode.window.showWarningMessage(`A variável "${newVarName}" é parecida com "${existingName}". Você quis dizer "${existingName}"?`);
    }
  }
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

  // Atualiza configuração global
  const config = vscode.workspace.getConfiguration('neuroassist');
  config.update('focusModeOpacity', opacity, vscode.ConfigurationTarget.Global);

  // Recria a decoração com nova opacidade
  focusDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    color: 'black',
    isWholeLine: true,
  });

  // Aplica imediatamente se o modo foco estiver ativo
  const editor = vscode.window.activeTextEditor;
  if (editor && focusModeActive) {
    updateFocus(editor);
  }
}

function applyFocusMode(editor) {
  const config = vscode.workspace.getConfiguration("neuroassist");
  const opacity = config.get("focusModeOpacity", 0.7);

  currentDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'transparent',
    isWholeLine: true,
  });

  focusDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    color: 'black',
    isWholeLine: true,
  });

  // Limpa linhas ativas anteriores
  activeLinesSet.clear();
  
  updateFocus(editor);
  vscode.window.onDidChangeTextEditorSelection(() => updateFocus(editor));
}

function updateFocus(editor) {
  if (!focusModeActive) return;

  const totalLines = editor.document.lineCount;
  const selections = editor.selections;

  // Limpa set antes de adicionar novas linhas
  activeLinesSet.clear();

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
  
  if (currentDecoration) {
    currentDecoration.dispose();
    currentDecoration = null;
  }
  
  activeLinesSet.clear();
  focusModeActive = false;
}


let pomodoroPanel = null;

function openPomodoroTimer(context) {
  if (pomodoroPanel) {
    pomodoroPanel.reveal(vscode.ViewColumn.Two);
    return;
  }

  pomodoroPanel = vscode.window.createWebviewPanel(
    'pomodoroTimer',
    'Timer Pomodoro',
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  pomodoroPanel.webview.html = getPomodoroHtml(context);


  pomodoroPanel.onDidDispose(() => {
    pomodoroPanel = null;
  });
}
function getPomodoroHtml(context) {
  const filePath = path.join(context.extensionPath, 'pomodoro.html');
  return fs.readFileSync(filePath, 'utf8');
}


module.exports = {
  activate,
  deactivate,
};