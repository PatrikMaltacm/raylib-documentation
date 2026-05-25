const fs = require('fs');
const path = require('path');

const files = [
    { file: 'module-rcore.md', name: 'rcore', category: 'Core' },
    { file: 'module-rshapes.md', name: 'rshapes', category: 'Shapes' },
    { file: 'module-rtextures.md', name: 'rtextures', category: 'Textures' },
    { file: 'module-rtext.md', name: 'rtext', category: 'Text' },
    { file: 'module-rmodels.md', name: 'rmodels', category: 'Models' },
    { file: 'module-raudio.md', name: 'raudio', category: 'Audio' }
];

const { translateText } = require('./translator.js');

function translateDescription(desc) {
    return translateText(desc);
}

const customExamples = {
    'InitWindow': {
        c: 'InitWindow(800, 450, "Minha Janela");',
        node: 'r.InitWindow(800, 450, "Minha Janela");'
    },
    'CloseWindow': {
        c: 'CloseWindow();',
        node: 'r.CloseWindow();'
    },
    'WindowShouldClose': {
        c: 'while (!WindowShouldClose()) {\n    // Game loop\n}',
        node: 'while (!r.WindowShouldClose()) {\n    // Game loop\n}'
    },
    'BeginDrawing': {
        c: 'BeginDrawing();',
        node: 'r.BeginDrawing();'
    },
    'EndDrawing': {
        c: 'EndDrawing();',
        node: 'r.EndDrawing();'
    },
    'ClearBackground': {
        c: 'ClearBackground(RAYWHITE);',
        node: 'r.ClearBackground(r.RAYWHITE);'
    },
    'DrawText': {
        c: 'DrawText("Olá Raylib!", 10, 10, 20, DARKGRAY);',
        node: 'r.DrawText("Olá Raylib!", 10, 10, 20, r.DARKGRAY);'
    },
    'LoadTexture': {
        c: 'Texture2D texture = LoadTexture("imagem.png");',
        node: 'const texture = r.LoadTexture("imagem.png");'
    },
    'DrawTexture': {
        c: 'DrawTexture(texture, 100, 100, WHITE);',
        node: 'r.DrawTexture(texture, 100, 100, r.WHITE);'
    }
};

const functions = [];

files.forEach(f => {
    const filePath = path.join(__dirname, '../src', f.file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        let currentSubcategory = '';

        lines.forEach(line => {
            const trimLine = line.trim();
            if (trimLine.startsWith('//') && !trimLine.includes('NOTE') && !trimLine.includes('WARNING') && trimLine.length > 5) {
                if (!trimLine.includes('(') && !trimLine.includes(';')) {
                    currentSubcategory = trimLine.replace('//', '').trim();
                }
            } else if (trimLine.includes('(') && trimLine.includes(');')) {
                // Parse function
                // e.g., void InitWindow(int width, int height, const char *title);  // Initialize window and OpenGL context
                const match = trimLine.match(/^(.*?)\s+([A-Za-z0-9_]+)\((.*?)\);\s*\/\/\s*(.*)$/);
                if (match) {
                    const retType = match[1].trim();
                    const name = match[2].trim();
                    const params = match[3].trim();
                    const desc = match[4].trim();

                    const ptDesc = translateDescription(desc);
                    
                    // Generate node equivalent (approximate)
                    let nodeParams = params;
                    if (nodeParams === 'void') nodeParams = '';
                    nodeParams = nodeParams.replace(/(const\s+)?(unsigned\s+)?([A-Za-z0-9_]+)\s*(\*?)([A-Za-z0-9_]+)/g, '$5');

                    functions.push({
                        name: name,
                        c_sig: `${retType} ${name}(${params});`,
                        node_sig: `r.${name}(${nodeParams});`,
                        desc: desc,
                        desc_pt: ptDesc,
                        module: f.name,
                        category: f.category,
                        subcategory: currentSubcategory,
                        examples: customExamples[name] || null
                    });
                }
            }
        });
    }
});

// Parse structs
const structs = [];
const structsPath = path.join(__dirname, '../src', 'structs.md');
if (fs.existsSync(structsPath)) {
    const content = fs.readFileSync(structsPath, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(line => {
        const trimLine = line.trim();
        const match = trimLine.match(/^struct\s+([A-Za-z0-9_]+);\s*\/\/\s*(.*)$/);
        if (match) {
            structs.push({
                name: match[1],
                desc: match[2],
                desc_pt: translateDescription(match[2])
            });
        }
    });
}

// Parse colors
const colors = [];
const colorsPath = path.join(__dirname, '../src', 'colors.md');
if (fs.existsSync(colorsPath)) {
    const content = fs.readFileSync(colorsPath, 'utf-8');
    const lines = content.split('\n');
    lines.forEach(line => {
        const trimLine = line.trim();
        const match = trimLine.match(/^#define\s+([A-Za-z0-9_]+)\s+\(Color\)\{\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\}\s*\/\/\s*(.*)$/);
        if (match) {
            colors.push({
                name: match[1],
                r: parseInt(match[2]),
                g: parseInt(match[3]),
                b: parseInt(match[4]),
                a: parseInt(match[5]),
                desc: match[6],
                desc_pt: translateDescription(match[6])
            });
        }
    });
}

const finalData = {
    functions,
    structs,
    colors
};

fs.writeFileSync(path.join(__dirname, '../public/data.js'), `const raylibData = ${JSON.stringify(finalData, null, 2)};`);
console.log('data.js generated successfully.');
