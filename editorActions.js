const vscode = require('vscode');
const os = require('os');

let currentDecoration = null;

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
        "A fonte OpenDyslexic pode não estar instalada no seu sistema. Caso não funcione, baixe e instale pelo site: https://opendyslexic.org/"
      );
    }
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
  }
}

function createMarkingDecoration() {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
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
    configuration.update('fontSize', 18, vscode.ConfigurationTarget.Global);
    configuration.update('letterSpacing', 0, vscode.ConfigurationTarget.Global);
    configuration.update('lineHeight', 1.5, vscode.ConfigurationTarget.Global);
  
    // Detectando o tema do VS Code
    const theme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
    let defaultColor = undefined; // Se undefined, o VS Code usa a cor padrão do tema
  
    if (theme && theme.toLowerCase().includes('dark')) {
      defaultColor = '#ffffff'; // Letras brancas para temas escuros
    }
  
    const userSettings = vscode.workspace.getConfiguration('workbench');
    const editorColorSettings = {
      "colorCustomizations": {
        "editor.foreground": defaultColor
      }
    };
  
    userSettings.update('colorCustomizations', editorColorSettings.colorCustomizations, vscode.ConfigurationTarget.Global);
  
    // Envia os valores padrão de volta para o WebView
    panel.webview.postMessage({
      command: 'restoreDefaults',
      font: defaultFont,
      fontSize: 18,
      color: defaultColor,
      letterSpacing: 0,
      lineHeight: 1.5
    });
  }  

module.exports = { saveSettings, markText, clearMarking, restoreDefaultSettings };
