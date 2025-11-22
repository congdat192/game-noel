import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { snowmanAsset, giftAsset, glassesAsset, starAsset, bombAsset, backgroundAsset } from '../assets';
import './Game.css';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 720;

function Game({ onGameOver }) {
  const ref = useRef(null);
  const [pixiApp, setPixiApp] = useState(null);
      const [score, setScore] = useState(0);
      const [timeLeft, setTimeLeft] = useState(20);

  // 1. Initialize Pixi Application
  useEffect(() => {
    if (!ref.current) return;

    const app = new PIXI.Application({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x87CEEB, // Light Sky Blue
    });
    
    ref.current.appendChild(app.view);
    setPixiApp(app);

    return () => {
      app.destroy(true);
    };
  }, []);

  // 2. Load assets and set up the game scene
  useEffect(() => {
    if (!pixiApp) return;

    const setup = async () => {
      // Load assets
      // Load all assets at once
      PIXI.Assets.add('snowman', snowmanAsset);
      PIXI.Assets.add('background', backgroundAsset);
      PIXI.Assets.add('gift', giftAsset);
      PIXI.Assets.add('glasses', glassesAsset);
      PIXI.Assets.add('star', starAsset);
      PIXI.Assets.add('bomb', bombAsset);
      const textures = await PIXI.Assets.load(['snowman', 'background', 'gift', 'glasses', 'star', 'bomb']);

      // Create a tiling sprite for the background
      const tilingBackground = new PIXI.TilingSprite(
        textures.background,
        GAME_WIDTH,
        GAME_HEIGHT
      );
      pixiApp.stage.addChild(tilingBackground);

      // Create player sprite
      const player = new PIXI.Sprite(textures.snowman);
      player.anchor.set(0.5);
      player.x = GAME_WIDTH / 2;
      player.y = GAME_HEIGHT - 80;
      player.width = 80;
      player.height = 100;
      pixiApp.stage.addChild(player);

      // -- Game State --
      const items = [];
      let isGameOver = false;

      // -- Player Controls --
      player.interactive = true;
      player.cursor = 'pointer';
      let dragging = false;

      player.on('pointerdown', () => { dragging = true; });
      player.on('pointerup', () => { dragging = false; });
      player.on('pointerupoutside', () => { dragging = false; });
      player.on('globalpointermove', (event) => {
        if (dragging) {
          player.x = Math.max(player.width / 2, Math.min(GAME_WIDTH - player.width / 2, event.global.x));
        }
      });
      
      // -- Item Spawning --
      const itemTypes = [
        { texture: 'gift', score: 10 },
        { texture: 'glasses', score: 20 },
        { texture: 'star', score: 30 },
        { texture: 'bomb', score: -30 },
      ];
      
      const spawnItem = () => {
        const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const item = new PIXI.Sprite(PIXI.Assets.get(itemType.texture));
        item.anchor.set(0.5);
        item.x = Math.random() * (GAME_WIDTH - 60) + 30;
        item.y = -50;
        item.width = 50;
        item.height = 50;
        item.score = itemType.score;
        pixiApp.stage.addChild(item);
        items.push(item);
      };

      let itemSpawnTimer = 0;

      // -- Collision Detection --
      const hitTest = (sprite1, sprite2) => {
        const bounds1 = sprite1.getBounds();
        const bounds2 = sprite2.getBounds();
        return bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y;
      };
      
      // -- Game Loop --
      pixiApp.ticker.add((delta) => {
        if (isGameOver) return;

        tilingBackground.tilePosition.y += 0.5 * delta;

        itemSpawnTimer += delta;
        if (itemSpawnTimer > 50 - (20 - timeLeft)) { // Spawn faster over time
          spawnItem();
          itemSpawnTimer = 0;
        }

        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          item.y += (3 + (20 - timeLeft) / 5) * delta; // Fall faster over time

          if (hitTest(player, item)) {
            setScore(prevScore => prevScore + item.score);
            // Visual feedback
            const effect = item.score > 0 ? 0x00FF00 : 0xFF0000;
            player.tint = effect;
            setTimeout(() => { player.tint = 0xFFFFFF; }, 100);
            
            pixiApp.stage.removeChild(item);
            items.splice(i, 1);
            continue;
          }

          if (item.y > GAME_HEIGHT + 50) {
            pixiApp.stage.removeChild(item);
            items.splice(i, 1);
          }
        }
      });

      // -- Timer --
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            isGameOver = true;
            pixiApp.ticker.stop();
            onGameOver(score);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timerId);
    };

    setup();

  }, [pixiApp, onGameOver, score]);

  return (
    <div className="game-container">
      <div ref={ref} />
      <div className="game-ui">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timeLeft}</div>
      </div>
    </div>
  );
}

export default Game;
