function getWebviewContent(variables = [], settings = {}, focusModeActive = false) {
  // Configurações padrão
  const defaultSettings = {
    font: 'Lexend',
    fontSize: 18,
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 1.5,
    focusOpacity: 0.7
  };

  // Mescla as configurações salvas com as padrão
  const currentSettings = { ...defaultSettings, ...settings };

  const variableRows = variables.map(v => `
    <tr>
      <td>${v.name}</td>
      <td>${v.type}</td>
      <td>${v.value}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuroAssist - Configurações</title>
    <style>
        :root {
            --primary: #4a6fa5;
            --primary-light: #6b8cbe;
            --secondary: #6d9dc5;
            --accent: #7db4b5;
            --background: #f8f9fa;
            --card-bg: #ffffff;
            --text: #333333;
            --text-light: #6c757d;
            --border: #dee2e6;
            --success: #28a745;
            --warning: #ffc107;
            --danger: #dc3545;
            --focus-bg: rgba(125, 180, 181, 0.15);
            --font-dyslexic: 'OpenDyslexic', sans-serif;
        }

        /* Modo Escuro */
        [data-theme="dark"] {
            --primary: #5c8ac0;
            --primary-light: #7ba0d4;
            --secondary: #85b3de;
            --accent: #8fc5c6;
            --background: #1a1a1a;
            --card-bg: #2d2d2d;
            --text: #e6e6e6;
            --text-light: #a0a0a0;
            --border: #404040;
            --focus-bg: rgba(143, 197, 198, 0.2);
        }

        @font-face {
            font-family: 'OpenDyslexic';
            src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/otf/OpenDyslexic-Regular.otf') format('opentype');
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
            padding: 20px;
            transition: background-color 0.3s, color 0.3s;
        }

        .dyslexic {
            font-family: var(--font-dyslexic);
            letter-spacing: 0.05em;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: background-color 0.3s, box-shadow 0.3s;
        }

        header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo h1 {
            font-size: 24px;
            font-weight: 600;
        }

        .logo-icon {
            font-size: 28px;
        }

        .theme-toggle {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: background 0.3s;
        }

        .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
        }

        .settings-panel {
            padding: 25px;
            border-right: 1px solid var(--border);
        }

        .preview-panel {
            padding: 25px;
            background-color: rgba(0, 0, 0, 0.03);
            display: flex;
            flex-direction: column;
            transition: background-color 0.3s;
        }

        [data-theme="dark"] .preview-panel {
            background-color: rgba(255, 255, 255, 0.05);
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-icon {
            font-size: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text);
        }

        select, input, .slider-container {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background-color: var(--card-bg);
            color: var(--text);
            font-family: inherit;
            transition: background-color 0.3s, border-color 0.3s;
        }

        .slider-container {
            display: flex;
            align-items: center;
            padding: 0 12px;
        }

        input[type="range"] {
            border: none;
            padding: 0;
            flex-grow: 1;
            background: transparent;
        }

        .value-display {
            min-width: 40px;
            text-align: right;
            color: var(--text-light);
            font-size: 14px;
        }

        .color-picker {
            height: 40px;
            padding: 3px;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--accent);
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }

        .action-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 25px;
        }

        .btn-action {
            padding: 12px;
            border-radius: 6px;
            border: 1px solid var(--border);
            background: var(--card-bg);
            color: var(--text);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-action:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        [data-theme="dark"] .btn-action:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .btn-danger {
            color: var(--danger);
            border-color: rgba(220, 53, 69, 0.3);
        }

        .btn-danger:hover {
            background: rgba(220, 53, 69, 0.1);
        }

        .btn-success {
            color: var(--success);
            border-color: rgba(40, 167, 69, 0.3);
        }

        .btn-success:hover {
            background: rgba(40, 167, 69, 0.1);
        }

        .preview-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--text);
        }

        .code-preview {
            flex-grow: 1;
            background: #2d2d2d;
            color: #f8f8f2;
            border-radius: 6px;
            padding: 16px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            overflow: auto;
            line-height: 1.5;
        }

        .code-line {
            display: block;
            margin-bottom: 4px;
        }

        .comment { color: #75715e; }
        .keyword { color: #f92672; }
        .function { color: #66d9ef; }
        .string { color: #a6e22e; }
        .variable { color: #fd971f; }
        .number { color: #ae81ff; }

        .pomodoro-container {
            background: var(--card-bg);
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            border: 1px solid var(--border);
            transition: background-color 0.3s, border-color 0.3s;
        }

        .pomodoro-display {
            text-align: center;
            font-size: 32px;
            font-weight: 600;
            margin: 15px 0;
            color: var(--primary);
        }

        .pomodoro-controls {
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .btn {
            padding: 10px 18px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background-color: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            background-color: #6ba1a2;
        }

        .btn-secondary {
            background-color: rgba(0, 0, 0, 0.1);
            color: var(--text);
        }

        .btn-secondary:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

        [data-theme="dark"] .btn-secondary {
            background-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }

        .focus-highlight {
            background-color: var(--focus-bg);
            padding: 2px 4px;
            border-radius: 3px;
        }

        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
            
            .settings-panel {
                border-right: none;
                border-bottom: 1px solid var(--border);
            }
        }
    </style>
</head>
<body data-theme="light">
    <div class="container">
        <header>
            <div class="logo">
                <span class="logo-icon">🧠</span>
                <h1>NeuroAssist</h1>
            </div>
            <button class="theme-toggle" id="themeToggle">🌙</button>
        </header>

        <div class="content">
            <div class="settings-panel">
                <div class="section-title">
                    <span class="section-icon">🎨</span>
                    Configurações Visuais
                </div>

                <div class="form-group">
                    <label for="fontFamily">Fonte</label>
                    <select id="fontFamily">
                        <option value="default" ${currentSettings.font === 'default' ? 'selected' : ''}>Padrão do Sistema</option>
                        <option value="opendyslexic" ${currentSettings.font === 'OpenDyslexic' ? 'selected' : ''}>OpenDyslexic</option>
                        <option value="arial" ${currentSettings.font === 'Arial' ? 'selected' : ''}>Arial</option>
                        <option value="verdana" ${currentSettings.font === 'Verdana' ? 'selected' : ''}>Verdana</option>
                        <option value="comic" ${currentSettings.font === 'Comic Sans MS' ? 'selected' : ''}>Comic Sans MS</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="fontSize">Tamanho da Fonte</label>
                    <div class="slider-container">
                        <input type="range" id="fontSize" min="12" max="24" value="${currentSettings.fontSize}">
                        <span class="value-display" id="fontSizeValue">${currentSettings.fontSize}px</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="textColor">Cor do Texto</label>
                    <input type="color" id="textColor" class="color-picker" value="${currentSettings.color}">
                </div>

                <div class="form-group">
                    <label for="lineHeight">Espaçamento entre linhas</label>
                    <div class="slider-container">
                        <input type="range" id="lineHeight" min="1" max="2.5" step="0.1" value="${currentSettings.lineHeight}">
                        <span class="value-display" id="lineHeightValue">${currentSettings.lineHeight}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="letterSpacing">Espaçamento entre letras</label>
                    <div class="slider-container">
                        <input type="range" id="letterSpacing" min="0" max="0.2" step="0.01" value="${currentSettings.letterSpacing}">
                        <span class="value-display" id="letterSpacingValue">${currentSettings.letterSpacing}em</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="dyslexicMode">Modo Dislexia</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dyslexicMode" ${settings.dyslexicMode ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="action-buttons">
                    <button class="btn-action btn-success" id="saveSettingsBtn">
                        <span>💾</span> Salvar Configurações
                    </button>
                    <button class="btn-action" id="restoreDefaultsBtn">
                        <span>↩️</span> Restaurar Padrão
                    </button>
                    <button class="btn-action btn-danger" id="clearMarkingBtn">
                        <span>🗑️</span> Limpar Marcação
                    </button>
                    <button class="btn-action" id="focusModeBtn">
                        <span>🎯</span> ${focusModeActive ? 'Desativar Modo Foco' : 'Modo Foco'}
                    </button>
                </div>
            </div>

            <div class="preview-panel">
                <div class="preview-title">Prévia do Código</div>
                <div class="code-preview" id="codePreview">
                    <span class="code-line comment">// Exemplo de código JavaScript</span>
                    <span class="code-line keyword">function</span> <span class="code-line function">calcularSoma</span>(a, b) {
                    <span class="code-line">  <span class="keyword">const</span> <span class="variable">resultado</span> = a + b;</span>
                    <span class="code-line">  <span class="keyword">return</span> <span class="variable">resultado</span>;</span>
                    <span class="code-line">}</span>
                    <span class="code-line"></span>
                    <span class="code-line comment">// Usando a função</span>
                    <span class="code-line keyword">const</span> <span class="variable">soma</span> = <span class="function">calcularSoma</span>(<span class="number">5</span>, <span class="number">7</span>);
                    <span class="code-line"><span class="function">console</span>.<span class="function">log</span>(<span class="string">"Resultado:"</span>, <span class="variable">soma</span>);</span>
                </div>

                <div class="pomodoro-container">
                    <div class="section-title">
                        <span class="section-icon">⏱️</span>
                        Técnica Pomodoro
                    </div>
                    <div class="pomodoro-display" id="pomodoroTimer">25:00</div>
                    <div class="pomodoro-controls">
                        <button class="btn btn-primary" id="startPomodoro">Iniciar</button>
                        <button class="btn btn-secondary" id="pausePomodoro">Pausar</button>
                        <button class="btn btn-secondary" id="resetPomodoro">Reiniciar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // Inicializar com o tema salvo
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        document.getElementById('themeToggle').textContent = savedTheme === 'light' ? '🌙' : '☀️';

        // Controles de interface
        document.getElementById('fontSize').addEventListener('input', function() {
            document.getElementById('fontSizeValue').textContent = this.value + 'px';
            document.getElementById('codePreview').style.fontSize = this.value + 'px';
        });

        document.getElementById('lineHeight').addEventListener('input', function() {
            document.getElementById('lineHeightValue').textContent = this.value;
            document.getElementById('codePreview').style.lineHeight = this.value;
        });

        document.getElementById('letterSpacing').addEventListener('input', function() {
            document.getElementById('letterSpacingValue').textContent = this.value + 'em';
            document.getElementById('codePreview').style.letterSpacing = this.value + 'em';
        });

        document.getElementById('fontFamily').addEventListener('change', function() {
            if (this.value === 'opendyslexic') {
                document.getElementById('codePreview').classList.add('dyslexic');
            } else {
                document.getElementById('codePreview').classList.remove('dyslexic');
            }
        });

        document.getElementById('dyslexicMode').addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dyslexic');
            } else {
                document.body.classList.remove('dyslexic');
            }
        });

        document.getElementById('textColor').addEventListener('input', function() {
            document.getElementById('codePreview').style.color = this.value;
        });

        // Alternância de tema claro/escuro
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
            
            // Salvar preferência
            localStorage.setItem('theme', newTheme);
        });

        // Botões de ação
        document.getElementById('saveSettingsBtn').addEventListener('click', function() {
            const font = document.getElementById('fontFamily').value;
            const fontSize = document.getElementById('fontSize').value;
            const color = document.getElementById('textColor').value;
            const letterSpacing = document.getElementById('letterSpacing').value;
            const lineHeight = document.getElementById('lineHeight').value;
            const dyslexicMode = document.getElementById('dyslexicMode').checked;

            vscode.postMessage({
                command: 'saveSettings',
                font,
                fontSize,
                color,
                letterSpacing,
                lineHeight,
                dyslexicMode
            });
        });

        document.getElementById('restoreDefaultsBtn').addEventListener('click', function() {
            vscode.postMessage({ command: 'restoreDefaults' });
        });

        document.getElementById('clearMarkingBtn').addEventListener('click', function() {
            vscode.postMessage({ command: 'clearMarking' });
        });

        document.getElementById('focusModeBtn').addEventListener('click', function() {
            vscode.postMessage({ command: 'toggleFocusMode' });
        });

        // Simulação do Pomodoro
        let pomodoroInterval;
        let pomodoroTime = 25 * 60;
        let isPomodoroRunning = false;

        function updatePomodoroDisplay() {
            const minutes = Math.floor(pomodoroTime / 60);
            const seconds = pomodoroTime % 60;
            document.getElementById('pomodoroTimer').textContent = 
                \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        }

        document.getElementById('startPomodoro').addEventListener('click', function() {
            if (!isPomodoroRunning) {
                isPomodoroRunning = true;
                pomodoroInterval = setInterval(function() {
                    if (pomodoroTime > 0) {
                        pomodoroTime--;
                        updatePomodoroDisplay();
                    } else {
                        clearInterval(pomodoroInterval);
                        isPomodoroRunning = false;
                        vscode.postMessage({
                            command: 'showInformationMessage',
                            text: 'Tempo do Pomodoro acabou! Hora de uma pausa.'
                        });
                    }
                }, 1000);
            }
        });

        document.getElementById('pausePomodoro').addEventListener('click', function() {
            clearInterval(pomodoroInterval);
            isPomodoroRunning = false;
        });

        document.getElementById('resetPomodoro').addEventListener('click', function() {
            clearInterval(pomodoroInterval);
            isPomodoroRunning = false;
            pomodoroTime = 25 * 60;
            updatePomodoroDisplay();
        });

        // Inicializar display
        updatePomodoroDisplay();

        // Escutar mensagens da extensão
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'updateFocusMode':
                    const focusModeBtn = document.getElementById('focusModeBtn');
                    focusModeBtn.innerHTML = message.active ? 
                        '<span>🎯</span> Desativar Modo Foco' : 
                        '<span>🎯</span> Modo Foco';
                    break;
                case 'setTheme':
                    document.body.setAttribute('data-theme', message.theme === 2 || message.theme === 3 ? 'dark' : 'light');
                    break;
            }
        });
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };