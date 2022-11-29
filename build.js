const fs = require('fs');

const includeFiles = [
    'assets/shaders/phong.vert', //
    'assets/shaders/phong.frag',
    'easings.js',
    'mathutils.js',
    'particlesystem.js',
    'shaders.js',
    'shapes.js',
];

const outputFile = 'framework.js';

fs.writeFileSync(outputFile, includeFiles.map((file) => '// ' + file + '\n\n' + fs.readFileSync(file, 'utf-8')).join('\n'));
