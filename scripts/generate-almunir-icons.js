const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon-almunir.svg');
const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Generated icon-192.png');

  // Generate 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Generated icon-512.png');

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));
  console.log('Generated favicon-32.png');

  // Copy SVG as favicon.svg for Next.js
  fs.copyFileSync(svgPath, path.join(publicDir, 'favicon.svg'));
  console.log('Copied favicon.svg');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
