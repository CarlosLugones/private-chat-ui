function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * Returns a data URL for a GitHub-style 5×5 symmetric identicon SVG.
 */
export function getAvatarUrl(username) {
  const str = username || "?";
  const hash = hashCode(str);
  const hue = Math.abs(hash) % 360;
  const fg = `hsl(${hue}, 65%, 60%)`;
  const bg = "#1e1e2e";

  const size = 64;
  const grid = 5;
  const pad = 8;
  const cell = (size - pad * 2) / grid;

  const cells = [];
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const mirrorCol = col < 3 ? col : grid - 1 - col;
      const bit = (Math.abs(hash) >> (row * 3 + mirrorCol)) & 1;
      if (bit) {
        const x = pad + col * cell;
        const y = pad + row * cell;
        cells.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cell - 1).toFixed(1)}" height="${(cell - 1).toFixed(1)}" fill="${fg}"/>`);
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${size / 2}" fill="${bg}"/>${cells.join("")}</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
