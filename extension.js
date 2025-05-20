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
    vscode.commands.registerCommand('neuroassist.addVariable', async () => {
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
    vscode.commands.registerCommand('neuroassist.listVariables', () => {
      const vars = listVariables();
      console.table(vars);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('dislexia.openPomodoroTimer', () => {
      openPomodoroTimer(context);
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
  const config = vscode.workspace.getConfiguration("neuroassist");
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

  pomodoroPanel.webview.html = getPomodoroHtml();

  pomodoroPanel.onDidDispose(() => {
    pomodoroPanel = null;
  });
}
function getPomodoroHtml() {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>Pomodoro Timer</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #1e1e1e;
      color: white;
      text-align: center;
    }
    input, select, button {
      font-size: 1.1em;
      padding: 8px;
      margin: 5px 0;
      border-radius: 5px;
      border: none;
    }
    input, select {
      width: 200px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    button {
      cursor: pointer;
      background-color: #007acc;
      color: white;
      border: none;
      border-radius: 5px;
      margin: 5px 10px;
    }
    button:hover {
      background-color: #005f9e;
    }
    #timer {
      font-size: 5em;
      margin: 20px 0;
    }
    ul {
      list-style: none;
      padding-left: 0;
      max-height: 150px;
      overflow-y: auto;
      margin-bottom: 20px;
      border: 1px solid #444;
      border-radius: 5px;
    }
    ul li {
      padding: 6px 10px;
      border-bottom: 1px solid #333;
      text-align: left;
    }
  </style>
</head>
<body>
  <h1>Pomodoro Timer</h1>
  
  <label for="taskName">Nome da tarefa:</label>
  <input type="text" id="taskName" placeholder="Digite o nome da tarefa" />
  
  <label for="taskTime">Tempo (minutos):</label>
  <select id="taskTime">
    <option value="15">15</option>
    <option value="25" selected>25</option>
    <option value="50">50</option>
  </select>
  
  <button id="addTask">Adicionar tarefa</button>
  
  <h3>Lista de tarefas</h3>
  <ul id="taskList"></ul>
  
  <div id="timer">00:00</div>
  
  <button id="start">Iniciar</button>
  <button id="pause">Pausar</button>
  <button id="reset">Resetar</button>

  <script>
    let tasks = [];
    let timerInterval;
    let totalSeconds = 0;
    let isRunning = false;

    const taskNameInput = document.getElementById('taskName');
    const taskTimeSelect = document.getElementById('taskTime');
    const taskListUl = document.getElementById('taskList');
    const timerEl = document.getElementById('timer');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const addTaskBtn = document.getElementById('addTask');

    function updateTaskList() {
      taskListUl.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = \`\${task.name} - \${task.time} min\`;
        taskListUl.appendChild(li);
      });
    }

    function updateTimerDisplay(seconds) {
      const min = Math.floor(seconds / 60).toString().padStart(2, '0');
      const sec = (seconds % 60).toString().padStart(2, '0');
      timerEl.textContent = \`\${min}:\${sec}\`;
    }

    addTaskBtn.onclick = () => {
      const name = taskNameInput.value.trim();
      const time = parseInt(taskTimeSelect.value);

      if (!name) {
        alert('Por favor, digite o nome da tarefa.');
        return;
      }

      tasks.push({ name, time });
      updateTaskList();
      taskNameInput.value = '';

      // Se for a primeira tarefa adicionada, já atualiza o timer para ela
      if (tasks.length === 1) {
        totalSeconds = time * 60;
        updateTimerDisplay(totalSeconds);
      }
    };

    startBtn.onclick = () => {
      if (isRunning) return;

      if (tasks.length === 0) {
        alert('Adicione pelo menos uma tarefa antes de iniciar o timer.');
        return;
      }

      if (totalSeconds === 0) {
        totalSeconds = tasks[0].time * 60;
      }

      isRunning = true;
      timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
          clearInterval(timerInterval);
          alert(\`Tarefa "\${tasks[0].name}" concluída! Faça uma pausa.\`);
          tasks.shift();
          updateTaskList();
          isRunning = false;

          if (tasks.length > 0) {
            totalSeconds = tasks[0].time * 60;
            updateTimerDisplay(totalSeconds);
          } else {
            totalSeconds = 0;
            updateTimerDisplay(totalSeconds);
          }
          return;
        }

        totalSeconds--;
        updateTimerDisplay(totalSeconds);
      }, 1000);
    };

    pauseBtn.onclick = () => {
      clearInterval(timerInterval);
      isRunning = false;
    };

    resetBtn.onclick = () => {
      clearInterval(timerInterval);
      isRunning = false;
      if (tasks.length > 0) {
        totalSeconds = tasks[0].time * 60;
      } else {
        totalSeconds = 0;
      }
      updateTimerDisplay(totalSeconds);
    };

    // Inicializa o display
    updateTimerDisplay(0);
  </script>
</body>
</html>`;
}

module.exports = {
  activate,
  deactivate,
};