const fs = require('fs');

const includeStrings = {
    phongVert: 'assets/shaders/phongFog.vert', //
    phongFrag: 'assets/shaders/phongFog.frag',
};

const includeFiles = [
    'thirdparty/p5.Framebuffer.js',
    'easings.js', //
    'mathutils.js',
    'particlesystem.js',
    'fog.js',
    'shapes.js',
    'setup.js',
];

const outputFile = 'p5.boost.js';

let str = '';
for (const id in includeStrings) {
    const file = includeStrings[id];
    str += `// ${file}\nconst ${id} = \`${fs.readFileSync(file)}\`\n\n`;
}

for (const file of includeFiles) {
    str += `// ${file}\n\n${fs.readFileSync(file, 'utf-8')}\n\n`;
}

fs.writeFileSync(outputFile, str);
