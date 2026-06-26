import { Gameboard } from './gameboard.js';

/**
 * Player class
 * Encapsulates a player's identity, type, and their own Gameboard.
 */
export class Player {
  /**
   * @param {string} name
   * @param {'real'|'computer'} type
   */
  constructor(name, type = 'real') {
    if (type !== 'real' && type !== 'computer') {
      throw new Error("Player type must be 'real' or 'computer'.");
    }
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();

    /** Tracks coordinates this player has already attacked (as "x,y" keys) */
    this._attacked = new Set();

    // AI targeting state machine (Hunt & Target modes)
    this.aiState = 'hunt'; // 'hunt' or 'target'
    this.huntHits = []; // array of {x, y} coordinates of hits on current ship(s)
  }

  // ─── Human attack ───────────────────────────────────────────────────────────

  /**
   * Fires at a specific coordinate on the enemy board.
   * @param {Gameboard} enemyBoard
   * @param {number} x
   * @param {number} y
   * @returns {string} result from receiveAttack
   */
  attack(enemyBoard, x, y) {
    const key = `${x},${y}`;
    this._attacked.add(key);
    return enemyBoard.receiveAttack(x, y);
  }

  // ─── Computer random attack ──────────────────────────────────────────────────

  /**
   * Fires a random, legal move at the enemy board.
   * Guarantees no repeated coordinates.
   * @param {Gameboard} enemyBoard
   * @returns {{ x: number, y: number, result: string }}
   */
  randomAttack(enemyBoard) {
    if (this.type !== 'computer') {
      throw new Error('randomAttack() is only available for computer players.');
    }

    // Build the full set of untargeted coordinates
    let attempts = 0;
    let x, y, key;

    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
      key = `${x},${y}`;
      attempts++;
      if (attempts > 200) throw new Error('No legal moves remaining.');
    } while (this._attacked.has(key));

    this._attacked.add(key);
    const result = enemyBoard.receiveAttack(x, y);
    return { x, y, result };
  }

  // ─── Computer smart attack (Hunt & Target State Machine) ──────────────────

  /**
   * Fires a smart move at the enemy board.
   * @param {Gameboard} enemyBoard
   * @returns {{ x: number, y: number, result: string }}
   */
  smartAttack(enemyBoard) {
    if (this.type !== 'computer') {
      throw new Error('smartAttack() is only available for computer players.');
    }

    let targetCoord;

    if (this.aiState === 'hunt') {
      targetCoord = this._getHuntCoordinate();
    } else {
      const potentialTargets = this._getPotentialTargets(enemyBoard);
      if (potentialTargets.length > 0) {
        targetCoord = potentialTargets[0];
      } else {
        // Fallback to hunt if somehow trapped
        this.aiState = 'hunt';
        this.huntHits = [];
        targetCoord = this._getHuntCoordinate();
      }
    }

    const { x, y } = targetCoord;
    const key = `${x},${y}`;
    this._attacked.add(key);

    const result = enemyBoard.receiveAttack(x, y);

    if (result === 'hit') {
      this.huntHits.push({ x, y });
      
      const cell = enemyBoard.grid[y][x];
      if (cell && cell.ship.isSunk()) {
        // Clean up hits belonging to this sunk ship
        const sunkShip = cell.ship;
        this.huntHits = this.huntHits.filter(h => {
          const hitCell = enemyBoard.grid[h.y][h.x];
          return hitCell && hitCell.ship !== sunkShip;
        });

        if (this.huntHits.length === 0) {
          this.aiState = 'hunt';
        } else {
          this.aiState = 'target';
        }
      } else {
        this.aiState = 'target';
      }
    }

    return { x, y, result };
  }

  _getHuntCoordinate() {
    const boardSize = 10;
    const parityCoords = [];
    const fallbackCoords = [];

    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        const key = `${x},${y}`;
        if (!this._attacked.has(key)) {
          if ((x + y) % 2 === 0) {
            parityCoords.push({ x, y });
          } else {
            fallbackCoords.push({ x, y });
          }
        }
      }
    }

    const targetList = parityCoords.length > 0 ? parityCoords : fallbackCoords;
    if (targetList.length === 0) {
      throw new Error('No legal moves remaining.');
    }

    const index = Math.floor(Math.random() * targetList.length);
    return targetList[index];
  }

  _getPotentialTargets(enemyBoard) {
    if (this.huntHits.length === 0) return [];

    if (this.huntHits.length === 1) {
      const { x, y } = this.huntHits[0];
      const adjacents = [
        { x, y: y - 1 }, // North
        { x, y: y + 1 }, // South
        { x: x + 1, y }, // East
        { x: x - 1, y }  // West
      ];

      return adjacents.filter(({ x: ax, y: ay }) => {
        const key = `${ax},${ay}`;
        return ax >= 0 && ax < 10 && ay >= 0 && ay < 10 && !this._attacked.has(key);
      });
    }

    const xs = this.huntHits.map(h => h.x);
    const ys = this.huntHits.map(h => h.y);

    const isVertical = xs.every(x => x === xs[0]);
    const isHorizontal = ys.every(y => y === ys[0]);

    const targets = [];

    if (isVertical) {
      const x = xs[0];
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      targets.push({ x, y: minY - 1 });
      targets.push({ x, y: maxY + 1 });
    } else if (isHorizontal) {
      const y = ys[0];
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);

      targets.push({ x: minX - 1, y });
      targets.push({ x: maxX + 1, y });
    } else {
      const { x, y } = this.huntHits[this.huntHits.length - 1];
      targets.push({ x, y: y - 1 });
      targets.push({ x, y: y + 1 });
      targets.push({ x: x + 1, y });
      targets.push({ x: x - 1, y });
    }

    return targets.filter(({ x: ax, y: ay }) => {
      const key = `${ax},${ay}`;
      return ax >= 0 && ax < 10 && ay >= 0 && ay < 10 && !this._attacked.has(key);
    });
  }
}

