import { Player } from './player.js';
import { Ship } from './ship.js';

describe('Player', () => {
  // ─── Constructor ─────────────────────────────────────────────────────────────
  describe('constructor', () => {
    test('sets name correctly', () => {
      const p = new Player('Alice', 'real');
      expect(p.name).toBe('Alice');
    });

    test('sets type correctly', () => {
      const p = new Player('HAL', 'computer');
      expect(p.type).toBe('computer');
    });

    test('defaults type to "real"', () => {
      const p = new Player('Bob');
      expect(p.type).toBe('real');
    });

    test('creates a Gameboard instance', () => {
      const p = new Player('Alice');
      expect(p.gameboard).toBeDefined();
      expect(p.gameboard.grid).toHaveLength(10);
    });

    test('throws on invalid type', () => {
      expect(() => new Player('X', 'alien')).toThrow();
    });
  });

  // ─── attack() ────────────────────────────────────────────────────────────────
  describe('attack()', () => {
    test('delegates to enemyBoard.receiveAttack()', () => {
      const player = new Player('Alice', 'real');
      const enemy = new Player('Bob', 'real');
      const ship = new Ship(2);
      enemy.gameboard.placeShip(ship, 0, 0, false);

      const result = player.attack(enemy.gameboard, 0, 0);
      expect(result).toBe('hit');
      expect(ship.hits).toBe(1);
    });

    test('returns "miss" when no ship at target', () => {
      const player = new Player('Alice');
      const enemy = new Player('Bob');
      expect(player.attack(enemy.gameboard, 5, 5)).toBe('miss');
    });
  });

  // ─── randomAttack() ──────────────────────────────────────────────────────────
  describe('randomAttack()', () => {
    let computer, enemy;

    beforeEach(() => {
      computer = new Player('CPU', 'computer');
      enemy = new Player('Human');
    });

    test('throws when called on a real player', () => {
      const human = new Player('Alice', 'real');
      expect(() => human.randomAttack(enemy.gameboard)).toThrow();
    });

    test('returns a result object with x, y, and result', () => {
      const move = computer.randomAttack(enemy.gameboard);
      expect(move).toHaveProperty('x');
      expect(move).toHaveProperty('y');
      expect(move).toHaveProperty('result');
    });

    test('x and y are within 0–9', () => {
      for (let i = 0; i < 20; i++) {
        const comp = new Player('CPU', 'computer');
        const { x, y } = comp.randomAttack(enemy.gameboard);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(9);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(9);
      }
    });

    test('never attacks the same coordinate twice', () => {
      const seen = new Set();
      for (let i = 0; i < 100; i++) {
        const { x, y } = computer.randomAttack(enemy.gameboard);
        const key = `${x},${y}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });

    test('result is "hit" when a ship is present', () => {
      // Place a ship covering every cell of a specific row so a hit is certain
      // We'll mock Math.random to control the coordinate
      const ship = new Ship(1);
      enemy.gameboard.placeShip(ship, 3, 3);

      const originalRandom = Math.random;
      // Force x=3, y=3: Math.random() called twice, returning 0.3 each time
      let callCount = 0;
      Math.random = jest.fn(() => {
        callCount++;
        return 0.35; // floor(0.35 * 10) = 3
      });

      const { result } = computer.randomAttack(enemy.gameboard);
      expect(result).toBe('hit');

      Math.random = originalRandom;
    });
  });
});
