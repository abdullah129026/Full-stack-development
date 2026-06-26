import { Ship } from './ship.js';

describe('Ship', () => {
  // ─── Constructor ─────────────────────────────────────────────────────────────
  describe('constructor', () => {
    test('creates a ship with the correct length', () => {
      const ship = new Ship(4);
      expect(ship.length).toBe(4);
    });

    test('starts with 0 hits', () => {
      const ship = new Ship(3);
      expect(ship.hits).toBe(0);
    });

    test('starts as not sunk', () => {
      const ship = new Ship(3);
      expect(ship.sunk).toBe(false);
    });

    test('throws an error for length < 1', () => {
      expect(() => new Ship(0)).toThrow();
      expect(() => new Ship(-2)).toThrow();
    });

    test('throws an error for non-integer length', () => {
      expect(() => new Ship(2.5)).toThrow();
    });
  });

  // ─── hit() ───────────────────────────────────────────────────────────────────
  describe('hit()', () => {
    test('increments the hit count by 1', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.hits).toBe(1);
    });

    test('can be hit multiple times', () => {
      const ship = new Ship(5);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.hits).toBe(3);
    });

    test('does not increment hits beyond length once sunk', () => {
      const ship = new Ship(2);
      ship.hit();
      ship.hit(); // sunk here
      ship.hit(); // should be ignored
      expect(ship.hits).toBe(2);
    });
  });

  // ─── isSunk() ────────────────────────────────────────────────────────────────
  describe('isSunk()', () => {
    test('returns false when hits < length', () => {
      const ship = new Ship(3);
      ship.hit();
      expect(ship.isSunk()).toBe(false);
    });

    test('returns true when hits === length', () => {
      const ship = new Ship(2);
      ship.hit();
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });

    test('sunk property is updated after final hit', () => {
      const ship = new Ship(1);
      expect(ship.sunk).toBe(false);
      ship.hit();
      expect(ship.sunk).toBe(true);
    });

    test('a length-1 ship is sunk after a single hit', () => {
      const ship = new Ship(1);
      ship.hit();
      expect(ship.isSunk()).toBe(true);
    });
  });
});
