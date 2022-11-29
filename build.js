const fs = require('fs');

const includeStrings = {
    phongVert: 'assets/shaders/phong.vert', //
    phongFrag: 'assets/shaders/phong.frag',
};

const includeFiles = [
    'easings.js', //
    'mathutils.js',
    'particlesystem.js',
    'shaders.js',
    'shapes.js',
];

const outputFile = 'framework.js';

let str = '';
for (const id in includeStrings) {
    const file = includeStrings[id];
    str += `// ${file}\nconst ${id} = \`${fs.readFileSync(file)}\`\n\n`;
}

for (const file of includeFiles) {
    str += `// ${file}\n\n${fs.readFileSync(file, 'utf-8')}\n\n`;
}

fs.writeFileSync(outputFile, str);
