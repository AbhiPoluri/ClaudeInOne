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
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Loading <span class='blue'>53</span> core commands..." },
        { type: 'delay', ms: 200 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Activating <span class='purple'>34</span> specialized agents..." },
        { type: 'delay', ms: 400 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> Injecting <span class='orange'>108</span> engineering skills..." },
        { type: 'delay', ms: 600 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> <span class='green'>Success! Your workspace is supercharged.</span>" },
        { type: 'text', content: "" },
        { type: 'delay', ms: 300 },
        { type: 'text', content: "Type <span class='blue'>help</span> to see available commands or <span class='purple'>docs</span> for documentation." },
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

    processSequence();

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
                printLine("Available commands:");
                printLine("  <span class='blue'>co doctor</span>     - Check system health and installation");
                printLine("  <span class='orange'>co init</span>       - Initialize claudeinone framework");
                printLine("  <span class='purple'>docs</span>          - Open the complete skills, agents, and commands library");
                printLine("  <span class='green'>clear</span>         - Clear the terminal output");
                printLine("  <span class='dim'>help</span>          - Show this help message");
                break;
            case 'co':
                if (args[1] === 'doctor') {
                    printLine("<span class='dim'>[Running system checks...]</span>");
                    setTimeout(() => {
                        printLine("Checking Claude Code installation... <span class='green'>OK</span>");
                        printLine("Verifying workspace architecture... <span class='green'>OK</span>");
                        printLine("Validating skills configuration... <span class='green'>OK</span>");
                        printLine("<br>Doctor check passed.");
                    }, 400);
                } else if (args[1] === 'init') {
                    printLine("<span class='dim'>[Initializing environment...]</span>");
                    setTimeout(() => {
                        printLine("Loading <span class='blue'>53</span> core commands...");
                        printLine("Activating <span class='purple'>34</span> specialized agents...");
                        printLine("Injecting <span class='orange'>108</span> engineering skills...");
                        printLine("<span class='green'>Success! Your workspace is supercharged.</span>");
                    }, 500);
                } else if (args[1]) {
                    printLine(`co: unknown command '${args[1]}'`);
                    printLine("Run 'help' for usage.");
                } else {
                    printLine("Usage: co &lt;command&gt; [options]");
                    printLine("Commands:");
                    printLine("  init    Detect .claude/ → diff → merge/overwrite per-file");
                    printLine("  doctor  Check Claude Code installed, structure, configs.");
                }
                break;
            case 'docs':
                printLine("<span class='dim'>Opening documentation...</span>");
                setTimeout(() => {
                    window.location.href = "docs.html";
                }, 400);
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case '':
                break;
            default:
                printLine(`command not found: ${command}`);
                break;
        }
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const cmd = input.value;
            input.value = "";
            executeCommand(cmd);
        }
    });
});
