/**
 * Word Rush Client - Phaser Game Component
 * React component that integrates Phaser 3 game engine for the core gameplay
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Phaser game configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current || undefined,
      backgroundColor: '#2c3e50',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    // Create the Phaser game instance
    gameRef.current = new Phaser.Game(config);

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

/**
 * Phaser preload function - loads game assets
 */
function preload(this: Phaser.Scene) {
  // Create simple colored rectangles for testing
  this.add.rectangle(400, 50, 200, 60, 0x4a90e2);
  this.add
    .text(400, 50, 'Assets Loading...', {
      fontSize: '16px',
      color: '#ffffff',
    })
    .setOrigin(0.5);
}

/**
 * Phaser create function - initializes the game scene
 */
function create(this: Phaser.Scene) {
  // Clear the loading message
  this.children.removeAll();

  // Create a simple letter grid placeholder
  const gridStartX = 200;
  const gridStartY = 150;
  const tileSize = 60;
  const gridSize = 4;

  // Create grid background
  this.add.rectangle(
    gridStartX + (gridSize * tileSize) / 2,
    gridStartY + (gridSize * tileSize) / 2,
    gridSize * tileSize + 20,
    gridSize * tileSize + 20,
    0x34495e
  );

  // Create letter tiles
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = gridStartX + col * tileSize + tileSize / 2;
      const y = gridStartY + row * tileSize + tileSize / 2;

      // Create tile background
      const tile = this.add.rectangle(
        x,
        y,
        tileSize - 5,
        tileSize - 5,
        0xecf0f1
      );
      tile.setInteractive();

      // Add sample letters
      const letters = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
      ];
      const letter = letters[row * gridSize + col];

      this.add
        .text(x, y, letter, {
          fontSize: '24px',
          color: '#2c3e50',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Add hover effect
      tile.on('pointerover', () => {
        tile.setFillStyle(0x3498db);
      });

      tile.on('pointerout', () => {
        tile.setFillStyle(0xecf0f1);
      });
    }
  }

  // Add title
  this.add
    .text(400, 50, 'Word Rush - Game Board', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    })
    .setOrigin(0.5);

  // Add instructions
  this.add
    .text(
      400,
      500,
      'Phaser 3 integration successful!\nGame mechanics will be implemented in future phases.',
      {
        fontSize: '16px',
        color: '#bdc3c7',
        align: 'center',
      }
    )
    .setOrigin(0.5);
}

/**
 * Phaser update function - called every frame
 */
function update(this: Phaser.Scene) {
  // Game loop logic will be added here in future phases
}

export default PhaserGame;
