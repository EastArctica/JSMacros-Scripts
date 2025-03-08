const fs = require('fs');

const metadata = {};
const srcDir = fs.readdirSync('./src');
for (const entry of srcDir) {
    let files = fs.readdirSync(`./src/${entry}`);
    console.log(entry, files);
    if (!files.includes('metadata.json') || !files.includes('main.ts')) {
        continue;
    }

    const data = fs.readFileSync(`./src/${entry}/metadata.json`, 'utf8');
    metadata[entry] = JSON.parse(data);
}

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

fs.writeFileSync('./dist/metadata.json', JSON.stringify(metadata, null, 4));
