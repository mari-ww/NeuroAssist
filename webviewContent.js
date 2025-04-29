function getWebviewContent() {
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
            font-family: 'Lexend', sans-serif;
            padding: 20px;
        }
  
        label { display: block; margin: 10px 0 5px; }
        input, select { width: 100%; padding: 5px; }
        button { margin-top: 10px; padding: 10px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2>⚙️ Configurações Visuais</h2>
  
      <label for="font">📄 Fonte:</label>
      <select id="font">
        <option value="Lexend">Lexend</option>
        <option value="OpenDyslexic">OpenDyslexic</option>
      </select>
  
      <label for="fontSize">🔡 Tamanho da Fonte:</label>
      <input type="number" id="fontSize" value="18" min="8" max="32">
  
      <label for="color">🎨 Cor do Texto:</label>
      <input type="color" id="color">
  
      <label for="letterSpacing">🔤 Espaçamento entre letras:</label>
      <input type="number" id="letterSpacing" value="0" min="0" max="10" step="0.5">
      
      <label for="lineHeight">📏 Espaçamento entre linhas:</label>
      <input type="number" id="lineHeight" value="1.5" min="1" max="3" step="0.1">

      <label for="focusOpacity">🌗 Intensidade do Modo Foco:</label>
      <input type="range" id="focusOpacity" min="0.1" max="1" step="0.05" value="0.7" oninput="handleOpacityChange(this.value)">
      <span id="opacityValue">0.7</span>

      <button onclick="saveSettings()">💾 Salvar Configurações</button>
      <button onclick="restoreDefaults()">🔄 Restaurar para Padrão</button>
      <button onclick="markText()">✍️ Marcar Código</button>
      <label for="highlightColor">🖍️ Cor da Marcação:</label>
      <input type="color" id="highlightColor" value="#ffff00">
      <button onclick="clearMarking()">🚫 Limpar Marcação</button>

      <script>
        const vscode = acquireVsCodeApi();

        window.addEventListener("message", event => {
          const message = event.data;

          if (message.command === "setTheme") {
            const theme = message.theme;
            
            // Defina a cor do texto baseada no tema
            if (theme === 2 || theme === 3) { // 2 = Dark, 3 = High Contrast
              document.body.style.color = "white";
            } else {
              document.body.style.color = "black"; // Ou a cor padrão do VS Code
            }
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
          
          vscode.postMessage({
          command: 'markText',
          highlightColor
        });
        }
  
        function clearMarking() {
          vscode.postMessage({ command: 'clearMarking' });
        }
        
        function updateOpacityLabel(value) {
          document.getElementById('opacityValue').textContent = value;
        }

      </script>
    </body>
    </html>`;
  }
  
  module.exports = { getWebviewContent };