document.addEventListener('DOMContentLoaded', () => {
    // Determine language mode
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get('lang') === 'node' ? 'node' : 'c';
    
    // Update UI based on language
    const badge = document.getElementById('current-lang-badge');
    badge.textContent = currentLang === 'node' ? 'Node.js (node-raylib)' : 'C / C++ (Raylib)';
    badge.style.background = currentLang === 'node' ? '#00e448' : '#00d4ff';
    badge.style.color = currentLang === 'node' ? '#000' : '#000';

    if (currentLang === 'node') {
        document.getElementById('getting-started-node').style.display = 'block';
    }

    // State
    let currentModule = 'all';
    let currentView = 'functions';
    let searchQuery = '';

    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const detailsPanel = document.getElementById('details-panel');
    const detailsBody = document.getElementById('details-body');
    const closeDetailsBtn = document.getElementById('close-details');
    const welcomeMsg = document.getElementById('welcome-msg');

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'light') {
            root.removeAttribute('data-theme');
            themeToggle.textContent = '☀️';
        } else {
            root.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Sidebar navigation
    document.querySelectorAll('.sidebar li').forEach(li => {
        li.addEventListener('click', (e) => {
            document.querySelectorAll('.sidebar li').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');

            if (e.target.dataset.module) {
                currentModule = e.target.dataset.module;
                currentView = 'functions';
            } else if (e.target.dataset.view) {
                currentView = e.target.dataset.view;
                currentModule = null;
            }
            
            searchInput.value = '';
            searchQuery = '';
            renderContent();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderContent();
    });

    closeDetailsBtn.addEventListener('click', () => {
        detailsPanel.classList.remove('open');
    });

    // Highlight text utility
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Render functions
    function renderFunctions() {
        if (!raylibData || !raylibData.functions) return;
        
        welcomeMsg.style.display = (searchQuery === '' && currentModule === 'all') ? 'block' : 'none';
        
        let filtered = raylibData.functions;
        
        if (currentModule && currentModule !== 'all') {
            filtered = filtered.filter(f => f.module === currentModule);
        }

        if (searchQuery) {
            filtered = filtered.filter(f => 
                f.name.toLowerCase().includes(searchQuery) || 
                f.desc_pt.toLowerCase().includes(searchQuery)
            );
        }

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<p class="text-muted">Nenhum resultado encontrado.</p>';
            return;
        }

        // Group by subcategory
        const groups = {};
        filtered.forEach(f => {
            const cat = f.subcategory || 'Diversos';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(f);
        });

        let html = '';
        for (const [cat, funcs] of Object.entries(groups)) {
            html += `<div class="func-group">
                <h3>${cat}</h3>
                <div>`;
            
            funcs.forEach(f => {
                const sig = currentLang === 'node' ? f.node_sig : f.c_sig;
                html += `
                    <div class="func-card" onclick="showFunctionDetails('${f.name}')">
                        <div class="func-name">${highlightText(f.name, searchQuery)}</div>
                        <div class="func-desc">${highlightText(f.desc_pt, searchQuery)}</div>
                        <div style="font-size:0.8rem; margin-top:5px; color:var(--text-muted)">
                            <code>${sig}</code>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        resultsContainer.innerHTML = html;
    }

    // Render Structs
    function renderStructs() {
        welcomeMsg.style.display = 'none';
        
        let filtered = raylibData.structs;
        if (searchQuery) {
            filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery));
        }

        let html = '<h2>Estruturas de Dados (Structs)</h2><div class="func-group"><div>';
        filtered.forEach(s => {
            html += `
                <div class="func-card">
                    <div class="func-name">${highlightText(s.name, searchQuery)}</div>
                    <div class="func-desc">${highlightText(s.desc_pt, searchQuery)}</div>
                </div>
            `;
        });
        html += '</div></div>';
        resultsContainer.innerHTML = html;
    }

    // Render Colors
    function renderColors() {
        welcomeMsg.style.display = 'none';
        
        let filtered = raylibData.colors;
        if (searchQuery) {
            filtered = filtered.filter(c => c.name.toLowerCase().includes(searchQuery));
        }

        let html = '<h2>Paleta de Cores</h2><div class="color-grid">';
        filtered.forEach(c => {
            html += `
                <div class="color-card">
                    <div class="color-swatch" style="background-color: rgba(${c.r}, ${c.g}, ${c.b}, ${c.a/255})"></div>
                    <div class="func-name" style="font-size:0.9rem;">${highlightText(c.name, searchQuery)}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted)">RGBA: ${c.r}, ${c.g}, ${c.b}, ${c.a}</div>
                </div>
            `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    // Main render router
    function renderContent() {
        if (currentView === 'functions') {
            renderFunctions();
        } else if (currentView === 'structs') {
            renderStructs();
        } else if (currentView === 'colors') {
            renderColors();
        }
    }

    // Details panel logic
    window.showFunctionDetails = function(funcName) {
        const func = raylibData.functions.find(f => f.name === funcName);
        if (!func) return;

        let html = `
            <h2>${func.name}</h2>
            <p style="color: var(--accent);">${func.desc_pt}</p>
            <p class="text-muted" style="font-size: 0.9em; font-style: italic;">Original: ${func.desc}</p>
            
            <div style="margin-top:20px;">
                <strong>Assinatura (${currentLang === 'node' ? 'Node.js' : 'C'}):</strong>
                <div class="detail-sig">${currentLang === 'node' ? func.node_sig : func.c_sig}</div>
            </div>
            
            <div style="margin-top:20px;">
                <strong>Outra linguagem (${currentLang === 'node' ? 'C' : 'Node.js'}):</strong>
                <div class="detail-sig" style="opacity: 0.7; border-left-color: var(--text-muted);">${currentLang === 'node' ? func.c_sig : func.node_sig}</div>
            </div>
        `;

        if (func.examples) {
            html += `
                <div class="detail-example">
                    <strong>Exemplo de Código:</strong>
                    <pre><code>${currentLang === 'node' ? func.examples.node : func.examples.c}</code></pre>
                </div>
            `;
        }

        detailsBody.innerHTML = html;
        detailsPanel.classList.add('open');
    };

    // Initial render
    renderContent();
});
