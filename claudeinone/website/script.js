document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const input = document.getElementById("cmd-input");
    const typingCursor = document.getElementById("typing-cursor");
    const terminalBody = document.getElementById("terminal");

    const sequence = [
        { type: 'text', content: "Welcome to <span class='white'>claudeinone</span> — The Production-Grade Framework for Claude Code." },
        { type: 'text', content: "Building autonomous agents, commands, and skills for modern development." },
        { type: 'text', content: "" },
        { type: 'input', content: "co doctor" },
        { type: 'delay', ms: 500 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Checking Claude Code installation... <span class='green'>OK</span>" },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Verifying workspace architecture... <span class='green'>OK</span>" },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Validating skills configuration... <span class='green'>OK</span>" },
        { type: 'text', content: "" },
        { type: 'input', content: "co init" },
        { type: 'delay', ms: 600 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:05]</span> Initializing claudeinone environment..." },
        { type: 'delay', ms: 300 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Loading <span class='blue'>95</span> /co: commands..." },
        { type: 'delay', ms: 200 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Activating <span class='purple'>37</span> specialist agents..." },
        { type: 'delay', ms: 400 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> Injecting <span class='orange'>213</span> production skills..." },
        { type: 'delay', ms: 600 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> <span class='green'>ClaudeInOne installed. Your Claude just got smarter.</span>" },
        { type: 'text', content: "" },
        { type: 'delay', ms: 300 },
        { type: 'text', content: "Type <span class='blue'>help</span> to learn more, <span class='blue'>docs</span> for the full reference." },
        { type: 'text', content: "" },
        { type: 'stop' }
    ];

    async function typeInput(text, element) {
        element.innerHTML = "<span class='prompt'>~ %</span> <span class='command-input-simulated'></span>";
        const textSpan = element.querySelector('.command-input-simulated');

        element.appendChild(typingCursor);
        typingCursor.classList.remove('hidden');

        for (let i = 0; i < text.length; i++) {
            textSpan.innerHTML += text.charAt(i);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            await new Promise(r => setTimeout(r, Math.random() * 50 + 30));
        }
    }

    async function processSequence() {
        for (const step of sequence) {
            if (step.type === 'delay') {
                await new Promise(r => setTimeout(r, step.ms));
            } else if (step.type === 'text') {
                const line = document.createElement('div');
                line.className = 'line';
                line.innerHTML = step.content;
                output.appendChild(line);
                await new Promise(r => setTimeout(r, 20));
            } else if (step.type === 'input') {
                const line = document.createElement('div');
                line.className = 'input-line-past';
                output.appendChild(line);
                await typeInput(step.content, line);
                await new Promise(r => setTimeout(r, 400));

                line.removeChild(typingCursor);
                line.innerHTML = `<span class='prompt'>~ %</span> <span class='command-input'>${step.content}</span>`;
            } else if (step.type === 'stop') {
                const inputLine = document.querySelector('.input-line');
                inputLine.insertBefore(typingCursor, input);
                typingCursor.classList.add('hidden');

                inputLine.removeChild(typingCursor);
                input.classList.remove('hidden');
                input.focus();
                break;
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    if (output && input && terminalBody && typingCursor) {
        processSequence();
    }

    function printLine(html) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = html;
        output.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function printCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'input-line-past';
        line.innerHTML = `<span class="prompt">~ %</span> <span class="command-input">${cmd}</span>`;
        output.appendChild(line);
    }

    function executeCommand(cmd) {
        printCommand(cmd);
        const args = cmd.trim().split(/\s+/);
        const command = args[0].toLowerCase();

        switch (command) {
            case 'help':
                printLine("");
                printLine("<span class='white'>claudeinone</span> is a production-grade framework for Claude Code.");
                printLine("It installs <span class='orange'>213 skills</span>, <span class='purple'>37 agents</span>, and <span class='blue'>95 /co: commands</span> into any project,");
                printLine("giving Claude expert-level knowledge across every major framework, pattern,");
                printLine("and deployment strategy — without you having to explain anything.");
                printLine("");
                printLine("Install it once with <span class='green'>npm install -g claudeinone-cli</span>, then run");
                printLine("<span class='green'>co init</span> inside any project. Claude Code picks it up automatically.");
                printLine("");
                printLine("  <span class='blue'>docs</span>      Open the full skills, agents, and commands reference");
                printLine("  <span class='blue'>github</span>    Open the GitHub repository");
                printLine("  <span class='blue'>clear</span>     Clear the terminal");
                printLine("");
                break;
            case 'docs':
                printLine("<span class='dim'>Opening documentation...</span>");
                setTimeout(() => { window.location.href = "docs.html"; }, 400);
                break;
            case 'github':
                printLine("<span class='dim'>Opening GitHub...</span>");
                setTimeout(() => { window.open("https://github.com/AbhiPoluri/ClaudeInOne", "_blank"); }, 400);
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case '':
                break;
            default:
                printLine(`command not found: <span class='orange'>${command}</span>. Type <span class='blue'>help</span> for available commands.`);
                break;
        }
    }

    if (input) {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const cmd = input.value;
                input.value = "";
                executeCommand(cmd);
            }
        });
    }

    // Theme Toggle Logic
    const themeCheckbox = document.querySelector(".theme-checkbox");

    // Check local storage or system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    // Set initial theme
    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeCheckbox) themeCheckbox.checked = false;
    }

    if (themeCheckbox) {
        themeCheckbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
            }
        });
    }
});
