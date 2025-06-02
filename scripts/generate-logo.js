const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateLogo() {
  try {
    // Create a 512x512 transparent background
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#000000"/>
        <text x="50%" y="50%" font-family="Arial" font-size="120" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
          LV
        </text>
        <circle cx="256" cy="256" r="240" stroke="#ffffff" stroke-width="8" fill="none"/>
      </svg>
    `;

    // Convert SVG to PNG
    await sharp(Buffer.from(svg))
      .resize(512, 512)
      .png()
      .toFile(path.join(__dirname, '../public/logo.png'));

    console.log('Logo generated successfully!');
  } catch (error) {
    console.error('Error generating logo:', error);
    process.exit(1);
  }
}

generateLogo(); 