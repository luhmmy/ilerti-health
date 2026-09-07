const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

const logoPath = path.join(publicDir, 'logo.jpg');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const dataUri = `data:image/jpeg;base64,${logoBase64}`;

// In a browser tab (especially dark mode like the user's Chrome),
// a clean rounded white squircle card containing the brand logo provides perfect visibility.
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="tabIconClip">
      <rect width="512" height="512" rx="110" />
    </clipPath>
  </defs>

  <!-- Crisp white rounded background for 100% dark/light browser tab contrast -->
  <rect width="512" height="512" rx="110" fill="#FFFFFF" />

  <!-- Official Brand Logo centered -->
  <image href="${dataUri}" x="16" y="16" width="480" height="480" preserveAspectRatio="xMidYMid meet" clip-path="url(#tabIconClip)" />
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);
console.log('Tab brand logo icon generated successfully!');
