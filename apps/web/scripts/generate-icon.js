const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

const logoPath = path.join(publicDir, 'logo.jpg');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const dataUri = `data:image/jpeg;base64,${logoBase64}`;

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="roundedClip">
      <rect width="512" height="512" rx="100" />
    </clipPath>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Clean rounded container for dark/light browser tab contrast -->
  <rect width="512" height="512" rx="100" fill="#FFFFFF" filter="url(#cardShadow)" />
  <rect x="8" y="8" width="496" height="496" rx="92" stroke="#E2E8F0" stroke-width="8" fill="none" />

  <!-- Actual Official Brand Logo image centered -->
  <image href="${dataUri}" x="16" y="16" width="480" height="480" preserveAspectRatio="xMidYMid meet" clip-path="url(#roundedClip)" />
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);
console.log('Successfully generated official brand logo icon.svg files!');
