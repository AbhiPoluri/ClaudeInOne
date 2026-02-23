document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");
    const input = document.getElementById("cmd-input");
    const typingCursor = document.getElementById("typing-cursor");
    const terminalBody = document.getElementById("terminal");
    const docsWindow = document.getElementById("docs-window");
    const docsWindowFrame = document.getElementById("docs-window-frame");
    let closeDocsTimer = null;

    const sequence = [
        { type: 'text', content: "Welcome to <span class='white'>claudeinone</span> — The Production-Grade Framework for Claude Code." },
        { type: 'text', content: "Building autonomous agents, commands, and skills for modern development." },
        { type: 'text', content: "" },
        { type: 'input', content: "co doctor" },
        { type: 'delay', ms: 180 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Checking Claude Code installation... <span class='green'>OK</span>" },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Verifying workspace architecture... <span class='green'>OK</span>" },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:00]</span> Validating skills configuration... <span class='green'>OK</span>" },
        { type: 'text', content: "" },
        { type: 'input', content: "co init" },
        { type: 'delay', ms: 220 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:05]</span> Initializing claudeinone environment..." },
        { type: 'delay', ms: 140 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Loading <span class='blue'>95</span> /co: commands..." },
        { type: 'delay', ms: 120 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:06]</span> Activating <span class='orange'>37</span> specialist agents..." },
        { type: 'delay', ms: 180 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> Injecting <span class='orange'>213</span> production skills..." },
        { type: 'delay', ms: 220 },
        { type: 'text', content: "<span class='dim'>[2026-02-21 22:48:07]</span> <span class='green'>ClaudeInOne installed. Your Claude just got smarter.</span>" },
        { type: 'text', content: "" },
        { type: 'delay', ms: 260 },
        { type: 'text', content: "Type <span class='blue'>help</span> to learn more, <span class='blue'>docs</span> for the full reference." },
        { type: 'text', content: "" },
        { type: 'stop' }
    ];

    async function typeInput(text, element, options = {}) {
        const minDelay = options.minDelay ?? 20;
        const maxDelay = options.maxDelay ?? 45;
        element.innerHTML = "<span class='prompt'>~ %</span> <span class='command-input-simulated'></span>";
        const textSpan = element.querySelector('.command-input-simulated');

        element.appendChild(typingCursor);
        typingCursor.classList.remove('hidden');

        for (let i = 0; i < text.length; i++) {
            textSpan.innerHTML += text.charAt(i);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            await new Promise(r => setTimeout(r, Math.random() * (maxDelay - minDelay) + minDelay));
        }
    }

    async function runCommandWithTyping(cmd) {
        const line = document.createElement('div');
        line.className = 'input-line-past';
        output.appendChild(line);
        // Keep help typing slower so users can follow it.
        await typeInput(cmd, line, { minDelay: 38, maxDelay: 78 });
        await new Promise(r => setTimeout(r, 250));

        line.removeChild(typingCursor);
        line.innerHTML = `<span class='prompt'>~ %</span> <span class='command-input'>${cmd}</span>`;
        executeCommand(cmd, { skipPrintCommand: true });
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
                // Fast intro logs, slower for final guidance lines.
                const isGuidance = step.content.includes("Type <span class='blue'>help</span>");
                await new Promise(r => setTimeout(r, isGuidance ? 90 : 14));
            } else if (step.type === 'input') {
                const line = document.createElement('div');
                line.className = 'input-line-past';
                output.appendChild(line);
                // Intro bootstrap commands should feel snappy.
                await typeInput(step.content, line, { minDelay: 10, maxDelay: 24 });
                await new Promise(r => setTimeout(r, 220));

                line.removeChild(typingCursor);
                line.innerHTML = `<span class='prompt'>~ %</span> <span class='command-input'>${step.content}</span>`;
            } else if (step.type === 'stop') {
                const inputLine = document.querySelector('.input-line');
                inputLine.insertBefore(typingCursor, input);
                typingCursor.classList.add('hidden');

                inputLine.removeChild(typingCursor);
                input.classList.remove('hidden');
                input.focus();
                await runCommandWithTyping("help");
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

    async function printLinesSlow(lines, delayMs = 150) {
        for (const line of lines) {
            printLine(line);
            await new Promise((r) => setTimeout(r, delayMs));
        }
    }

    function printCommand(cmd) {
        const line = document.createElement('div');
        line.className = 'input-line-past';
        line.innerHTML = `<span class="prompt">~ %</span> <span class="command-input">${cmd}</span>`;
        output.appendChild(line);
    }

    function executeCommand(cmd, options = {}) {
        if (!options.skipPrintCommand) {
            printCommand(cmd);
        }
        const args = cmd.trim().split(/\s+/);
        const command = args[0].toLowerCase();

        switch (command) {
            case 'help': {
                const helpLines = [
                    "",
                    "<span class='white'>claudeinone</span> is a production-grade framework for Claude Code.",
                    "It installs <span class='orange'>213 skills</span>, <span class='orange'>37 agents</span>, and <span class='blue'>95 /co: commands</span> into any project,",
                    "giving Claude expert-level knowledge across every major framework, pattern,",
                    "and deployment strategy — without you having to explain anything.",
                    "",
                    "If you use Claude Code often, this removes repetitive prompt setup and",
                    "gives you a stronger baseline for planning, implementation, testing, and shipping.",
                    "Install once and reuse it across projects for faster, more consistent output.",
                    "",
                    "Install it once with <span class='green'>npm install -g claudeinone-cli</span>, then run",
                    "<span class='green'>co init</span> inside any project. Claude Code picks it up automatically.",
                    "",
                    "  <span class='terminal-link blue' data-cmd='docs'>docs</span>      Open the full skills, agents, and commands reference",
                    "  <span class='terminal-link blue' data-cmd='repo'>repo</span>      Open the GitHub repository",
                    "  <span class='terminal-link blue' data-cmd='clear'>clear</span>     Clear the terminal",
                    ""
                ];
                void printLinesSlow(helpLines, 175);
                break;
            }
            case 'docs':
                printLine("<span class='dim'>Opening documentation window...</span>");
                setTimeout(() => { openDocsWindow(); }, 250);
                break;
            case 'github':
            case 'repo':
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

    if (output) {
        output.addEventListener("click", (event) => {
            const target = event.target.closest(".terminal-link");
            if (!target) return;
            const cmd = target.getAttribute("data-cmd");
            if (!cmd) return;
            executeCommand(cmd);
        });
    }

    function openDocsWindow() {
        if (!docsWindow || !docsWindowFrame) {
            window.location.href = "docs.html";
            return;
        }
        if (closeDocsTimer) {
            clearTimeout(closeDocsTimer);
            closeDocsTimer = null;
        }
        if (docsWindowFrame.src.includes("about:blank")) {
            const theme = getCurrentTheme();
            docsWindowFrame.src = `docs.html?embed=1&theme=${encodeURIComponent(theme)}`;
        } else {
            applyThemeToDocsFrame();
        }
        docsWindow.hidden = false;
        requestAnimationFrame(() => {
            docsWindow.classList.add("is-open");
        });
    }

    function closeDocsWindow() {
        if (!docsWindow) return;
        docsWindow.classList.remove("is-open");
        closeDocsTimer = setTimeout(() => {
            docsWindow.hidden = true;
        }, 260);
    }

    if (docsWindow) {
        docsWindow.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.dataset.closeDocs === "true") {
                closeDocsWindow();
            }
        });
    }

    function getCurrentTheme() {
        return document.documentElement.getAttribute("data-theme") || "dark";
    }

    function applyThemeToDocsFrame() {
        if (!docsWindowFrame || !docsWindowFrame.contentDocument) return;
        const theme = getCurrentTheme();
        docsWindowFrame.contentDocument.documentElement.setAttribute("data-theme", theme);
    }

    if (docsWindowFrame) {
        docsWindowFrame.addEventListener("load", () => {
            applyThemeToDocsFrame();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeDocsWindow();
        }
    });

    // Theme Toggle Logic
    const themeCheckbox = document.querySelector(".theme-checkbox");
    const lockedTheme = document.documentElement.getAttribute("data-theme-lock");

    // Check local storage or system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    const isDark = lockedTheme
        ? lockedTheme === "dark"
        : storedTheme === "dark" || (!storedTheme && prefersDark);

    // Set initial theme
    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeCheckbox) themeCheckbox.checked = false;
    }

    if (themeCheckbox) {
        if (lockedTheme) {
            themeCheckbox.disabled = true;
        }
        themeCheckbox.addEventListener("change", (e) => {
            if (lockedTheme) {
                return;
            }
            if (e.target.checked) {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
            }
            applyThemeToDocsFrame();
        });
    }

    // Docs page CTA: jump to install section and copy command
    const docsInitBtn = document.querySelector(".docs-nav-btn");
    if (docsInitBtn) {
        docsInitBtn.addEventListener("click", async () => {
            const installSection = document.getElementById("installation");
            if (installSection) {
                installSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            let copied = false;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText("co init");
                    copied = true;
                }
            } catch (_) {
                copied = false;
            }

            const original = docsInitBtn.textContent;
            docsInitBtn.textContent = copied ? "Copied: co init" : "Run: co init";
            docsInitBtn.classList.add("is-copied");
            setTimeout(() => {
                docsInitBtn.textContent = original;
                docsInitBtn.classList.remove("is-copied");
            }, 1400);
        });
    }

    // Docs page: keep sidebar section links in sync with scroll position
    const docsMainArea = document.querySelector(".docs-main-area");
    const sidebarSectionLinks = Array.from(document.querySelectorAll(".docs-sidebar .sb-links a[href^='#']"));
    if (docsMainArea && sidebarSectionLinks.length > 0) {
        const sectionMap = sidebarSectionLinks
            .map((link) => {
                const targetId = link.getAttribute("href")?.slice(1) || "";
                const section = document.getElementById(targetId);
                return section ? { link, section } : null;
            })
            .filter(Boolean);

        const setActiveLink = (activeLink) => {
            sidebarSectionLinks.forEach((l) => l.classList.remove("active"));
            if (activeLink) activeLink.classList.add("active");
        };

        const updateActiveSection = () => {
            const containerTop = docsMainArea.getBoundingClientRect().top;
            const activationOffset = 120;
            let current = sectionMap[0] || null;

            for (const item of sectionMap) {
                const top = item.section.getBoundingClientRect().top - containerTop;
                if (top <= activationOffset) {
                    current = item;
                } else {
                    break;
                }
            }

            setActiveLink(current?.link);
        };

        let ticking = false;
        docsMainArea.addEventListener("scroll", () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
        });

        sidebarSectionLinks.forEach((link) => {
            link.addEventListener("click", () => {
                setActiveLink(link);
            });
        });

        updateActiveSection();
    }
});
