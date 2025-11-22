// src/assets.js

// Using Data URIs for self-contained assets. This makes the project
// easy to manage without a separate asset pipeline.

// Player: Simple Snowman
export const snowmanAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><circle cx="50" cy="80" r="20" fill="white" stroke="%23cccccc" stroke-width="2"/><circle cx="50" cy="45" r="15" fill="white" stroke="%23cccccc" stroke-width="2"/><rect x="35" y="20" width="30" height="10" fill="%23c73b3b"/><rect x="25" y="30" width="50" height="5" fill="%23c73b3b"/></svg>`;

// Item: Gift Box (+10)
export const giftAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="10" fill="%23d9534f"/><rect x="45" y="10" width="10" height="80" fill="%23f0ad4e"/><rect x="10" y="45" width="80" height="10" fill="%23f0ad4e"/></svg>`;

// Item: Christmas Glasses (+20)
export const glassesAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 60"><circle cx="30" cy="30" r="25" fill="none" stroke="%232a8a46" stroke-width="8"/><circle cx="120" cy="30" r="25" fill="none" stroke="%232a8a46" stroke-width="8"/><path d="M55 30 h 40" stroke="%232a8a46" stroke-width="8"/></svg>`;

// Item: Star (+30)
export const starAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 61,40 98,40 68,62 79,96 50,75 21,96 32,62 2,40 39,40" fill="%23f0ad4e" stroke="%23db9a3a" stroke-width="3"/></svg>`;

// Item: Bomb (-30)
export const bombAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23333333"/><rect x="45" y="5" width="10" height="20" fill="%23555555"/><path d="M50 5 L 60 15" stroke="yellow" stroke-width="4"/></svg>`;

// Background: Soft snow effect (will be tiled)
export const backgroundAsset = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white"/><circle cx="50" cy="70" r="3" fill="white"/><circle cx="80" cy="40" r="2" fill="white"/><circle cx="90" cy="90" r="1.5" fill="white"/><circle cx="10" cy="50" r="1.5" fill="white"/></svg>`;
