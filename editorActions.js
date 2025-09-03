const vscode = require('vscode');
const os = require('os');

let currentDecorations = [];

function saveSettings(font, fontSize, color, letterSpacing, lineHeight) {
    const configuration = vscode.workspace.getConfiguration('editor');
  
    // Verifica se a fonte está instalada antes de aplicar
    checkFontAvailability(font);
  
    // Se a fonte escolhida for "OpenDyslexic", definir corretamente
    if (font === "OpenDyslexic") {
      configuration.update('fontFamily', "'OpenDyslexic', sans-serif", vscode.ConfigurationTarget.Global);
    } else {
      configuration.update('fontFamily', font, vscode.ConfigurationTarget.Global);
    }
  
    configuration.update('fontSize', parseInt(fontSize), vscode.ConfigurationTarget.Global);
    configuration.update('letterSpacing', parseFloat(letterSpacing), vscode.ConfigurationTarget.Global);
    configuration.update('lineHeight', parseFloat(lineHeight), vscode.ConfigurationTarget.Global);
  
    const userSettings = vscode.workspace.getConfiguration('workbench');
    const editorColorSettings = {
      "colorCustomizations": {
        "editor.foreground": color
      }
    };
  
    userSettings.update('colorCustomizations', editorColorSettings.colorCustomizations, vscode.ConfigurationTarget.Global);
  }
  
  // Função para verificar se a fonte está instalada
  function checkFontAvailability(font) {
    if (font === "OpenDyslexic") {
      vscode.window.showWarningMessage(
        "A fonte openDyslexic pode não estar instalada no seu sistema. Caso não funcione, baixe e instale pelo site: https://opendyslexic.org/"
      );
    }
  }  
  function markText(color = '#ffff00') {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showInformationMessage("Por favor, selecione um trecho de código.");
        return;
      }
  
      const decorationType = createMarkingDecoration(color);
      editor.setDecorations(decorationType, [selection]);
      currentDecorations.push(decorationType);
  
      vscode.window.showInformationMessage("Texto marcado.");
    } else {
      vscode.window.showWarningMessage("Nenhum editor ativo encontrado.");
    }
  }
  

  function clearMarking() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      for (const decoration of currentDecorations) {
        editor.setDecorations(decoration, []);
        decoration.dispose();
      }
      currentDecorations = []; 
      vscode.window.showInformationMessage("Todas as marcações foram removidas.");
    }
  }

function createMarkingDecoration(color) {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: color,
    isWholeLine: false,
  });
}
function restoreDefaultSettings(panel) {
  const configuration = vscode.workspace.getConfiguration('editor');
  const userSettings = vscode.workspace.getConfiguration('workbench');

  // Remover personalizações de editor
  configuration.update('fontFamily', undefined, vscode.ConfigurationTarget.Global);
  configuration.update('fontSize', undefined, vscode.ConfigurationTarget.Global);
  configuration.update('letterSpacing', undefined, vscode.ConfigurationTarget.Global);
  configuration.update('lineHeight', undefined, vscode.ConfigurationTarget.Global);

  // Remover personalizações de cor
  userSettings.update('colorCustomizations', undefined, vscode.ConfigurationTarget.Global);

  // Envia os valores padrão de volta para o WebView (informativo)
  panel.webview.postMessage({
      command: 'restoreDefaults',
      font: undefined,
      fontSize: undefined,
      color: undefined,
      letterSpacing: undefined,
      lineHeight: undefined
  });

  vscode.window.showInformationMessage("As configurações foram restauradas para os valores padrão do VS Code.");
}
module.exports = { saveSettings, markText, clearMarking, restoreDefaultSettings };
