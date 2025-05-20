function getWebviewContent(variables = []) {
  const variableRows = variables.map(v => `
    <tr>
      <td>${v.name}</td>
      <td>${v.type}</td>
      <td>${v.value}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configurações Visuais</title>
  <style>
  @font-face {
    font-family: 'Lexend';
    src: url('vscode-resource:/fonts/Lexend-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'OpenDyslexic';
    src: url('vscode-resource:/fonts/OpenDyslexic-Regular.otf') format('opentype');
  }

  body {
    font-family: 'Lexend', 'OpenDyslexic', 'Comic Sans MS', Verdana, sans-serif;
    padding: 20px;
    background-color: inherit;
    color: inherit;
  }

  label, input, select, button, table, th, td {
    color: inherit;
    background-color: inherit;
  }

  input, select {
    width: 100%;
    padding: 5px;
    background-color: var(--vscode-input-background); /* Usa o tema do VS Code */
    color: var(--vscode-input-foreground); /* Usa a cor do texto do tema */
    border: 1px solid var(--vscode-input-border);
  }

  input:focus, select:focus {
  outline: 2px solid var(--vscode-focusBorder);
  }

  button {
    margin-top: 10px;
    padding: 10px;
    cursor: pointer;
  }

  label {
    display: block;
    margin: 10px 0 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  .row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  .row > div {
    flex: 1;
  }

  .button-row {
    display: flex;
    gap: 15px;
    margin: 20px 0;
  }

  .marking-row {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
  }

</style>
</head>
<body>
  <h2>⚙️ Configurações Visuais</h2>

 <div class="row">
  <div>
    <label for="font">📄 Fonte:</label>
    <select id="font">
      <option value="Lexend">Lexend</option>
      <option value="OpenDyslexic">OpenDyslexic</option>
      <option value="Comic Sans MS">Comic Sans MS</option>
      <option value="Verdana">Verdana</option>
    </select>
  </div>
  <div>
    <label for="fontSize">🔡 Tamanho da Fonte:</label>
    <input type="number" id="fontSize" value="18" min="8" max="32">
  </div>
</div>

<div class="row">
  <div>
    <label for="color">🎨 Cor do Texto:</label>
    <input type="color" id="color">
  </div>
  <div>
    <label for="focusOpacity">🌗 Intensidade do Modo Foco:</label>
    <input type="range" id="focusOpacity" min="0.1" max="1" step="0.05" value="0.7" oninput="handleOpacityChange(this.value)">
  </div>
</div>

<div class="row">
  <div>
    <label for="lineHeight">📏 Espaçamento entre linhas:</label>
    <input type="number" id="lineHeight" value="1.5" min="1" max="3" step="0.1">
  </div>
  <div>
    <label for="letterSpacing">🔤 Espaçamento entre letras:</label>
    <input type="number" id="letterSpacing" value="0" min="0" max="10" step="0.5">
  </div>
</div>

 <div class="button-row">
    <button onclick="saveSettings()">💾 Salvar Configurações</button>
    <button onclick="restoreDefaults()">🔄 Restaurar para Padrão</button>
  </div>

  <div class="marking-row">
    <label for="highlightColor">🖍️ Cor da Marcação:</label>
    <input type="color" id="highlightColor" value="#ffff00">
    <button onclick="markText()">Marcar Código</button>
    <button onclick="clearMarking()">Limpar Marcação</button>
  </div>

  <h2>📋 Variáveis Criadas</h2>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Tipo</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      ${variableRows}
    </tbody>
  </table>

  <script>
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", event => {
      const message = event.data;

      switch (message.command) {
        case "setTheme":
          document.body.style.color = (message.theme === 2 || message.theme === 3) ? "white" : "black";
          break;
        case "updateVariables":
          updateVariableTable(message.variables);
          break;
      }
    });

    function saveSettings() {
      const font = document.getElementById('font').value;
      const fontSize = document.getElementById('fontSize').value;
      const color = document.getElementById('color').value;
      const letterSpacing = document.getElementById('letterSpacing').value + 'px';
      const lineHeight = document.getElementById('lineHeight').value;
      const focusOpacity = document.getElementById('focusOpacity').value;

      document.body.style.fontFamily = font;
      document.body.style.fontSize = fontSize + 'px';
      document.body.style.color = color;
      document.body.style.letterSpacing = letterSpacing;
      document.body.style.lineHeight = lineHeight;

      vscode.postMessage({
        command: 'saveSettings',
        font,
        fontSize,
        color,
        letterSpacing,
        lineHeight,
        focusOpacity
      });

      updateOpacityLabel(focusOpacity);
    }

    function restoreDefaults() {
      vscode.postMessage({ command: 'restoreDefaults' });
    }

    function handleOpacityChange(value) {
      updateOpacityLabel(value);
      vscode.postMessage({
        command: 'updateFocusOpacity',
        focusOpacity: value
      });
    }

    function markText() {
      const highlightColor = document.getElementById('highlightColor').value;
      vscode.postMessage({ command: 'markText', highlightColor });
    }

    function clearMarking() {
      vscode.postMessage({ command: 'clearMarking' });
    }

    function updateOpacityLabel(value) {
      document.getElementById('opacityValue').textContent = value;
    }

    function updateVariableTable(variables) {
      const tableBody = document.querySelector("tbody");
      tableBody.innerHTML = '';
      variables.forEach(v => {
        const row = document.createElement("tr");
        row.innerHTML = \`
          <td>\${v.name}</td>
          <td>\${v.type}</td>
          <td>\${v.value}</td>
        \`;
        tableBody.appendChild(row);
      });
    }
  </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };
