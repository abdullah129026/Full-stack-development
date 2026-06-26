import { Ship } from './ship.js';

/**
 * Gameboard class
 * Manages a 10×10 grid, ship placement, attacks, and win detection.
 */
export class Gameboard {
  constructor() {
    /** 10×10 grid. Each cell is null or { ship, index } */
    this.grid = Array.from({ length: 10 }, () => Array(10).fill(null));

    /** Array of all placed ships */
    this.ships = [];

    /** Set of coordinates that were misses: stored as "x,y" strings */
    this.missedCoords = new Set();

    /** Set of all attacked coordinates (hits + misses) */
    this.attackedCoords = new Set();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _key(x, y) {
    return `${x},${y}`;
  }

  _inBounds(x, y) {
    return x >= 0 && x < 10 && y >= 0 && y < 10;
  }

  // ─── placeShip ──────────────────────────────────────────────────────────────

  /**
   * Places a ship on the board.
   * @param {Ship} ship
   * @param {number} x - Column (0–9)
   * @param {number} y - Row (0–9)
   * @param {boolean} isVertical - true → ship extends downward; false → rightward
   * @throws {Error} if placement is out of bounds or overlaps another ship
   */
  placeShip(ship, x, y, isVertical = false) {
    // Compute all cells the ship would occupy
    const cells = [];
    for (let i = 0; i < ship.length; i++) {
      const cx = isVertical ? x : x + i;
      const cy = isVertical ? y + i : y;

      if (!this._inBounds(cx, cy)) {
        throw new Error(
          `Ship placement out of bounds at (${cx}, ${cy}).`
        );
      }
      if (this.grid[cy][cx] !== null) {
        throw new Error(
          `Ship collision at (${cx}, ${cy}).`
        );
      }
      cells.push({ cx, cy, index: i });
    }

    // All cells valid — commit placement
    cells.forEach(({ cx, cy, index }) => {
      this.grid[cy][cx] = { ship, index };
    });
    this.ships.push(ship);
  }

  // ─── receiveAttack ──────────────────────────────────────────────────────────

  /**
   * Processes an attack at (x, y).
   * @param {number} x - Column
   * @param {number} y - Row
   * @returns {'hit'|'miss'|'already_attacked'|'out_of_bounds'}
   */
  receiveAttack(x, y) {
    if (!this._inBounds(x, y)) return 'out_of_bounds';

    const key = this._key(x, y);
    if (this.attackedCoords.has(key)) return 'already_attacked';

    this.attackedCoords.add(key);

    const cell = this.grid[y][x];
    if (cell !== null) {
      cell.ship.hit();
      return 'hit';
    } else {
      this.missedCoords.add(key);
      return 'miss';
    }
  }

  // ─── allShipsSunk ───────────────────────────────────────────────────────────

  /**
   * @returns {boolean} true if every placed ship is sunk.
   */
  allShipsSunk() {
    if (this.ships.length === 0) return false;
    return this.ships.every((ship) => ship.isSunk());
  }
}
