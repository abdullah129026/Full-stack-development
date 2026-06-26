import { Ship } from './ship.js';
import { Gameboard } from './gameboard.js';

describe('Gameboard', () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  // ─── Initial state ───────────────────────────────────────────────────────────
  describe('initial state', () => {
    test('starts with an empty 10×10 grid', () => {
      expect(board.grid.length).toBe(10);
      board.grid.forEach((row) => {
        expect(row.length).toBe(10);
        row.forEach((cell) => expect(cell).toBeNull());
      });
    });

    test('starts with no placed ships', () => {
      expect(board.ships).toHaveLength(0);
    });

    test('starts with no missed coordinates', () => {
      expect(board.missedCoords.size).toBe(0);
    });
  });

  // ─── placeShip ───────────────────────────────────────────────────────────────
  describe('placeShip()', () => {
    test('places a horizontal ship correctly', () => {
      const ship = new Ship(3);
      board.placeShip(ship, 0, 0, false);
      expect(board.grid[0][0]).not.toBeNull();
      expect(board.grid[0][1]).not.toBeNull();
      expect(board.grid[0][2]).not.toBeNull();
      expect(board.grid[0][3]).toBeNull();
    });

    test('places a vertical ship correctly', () => {
      const ship = new Ship(3);
      board.placeShip(ship, 0, 0, true);
      expect(board.grid[0][0]).not.toBeNull();
      expect(board.grid[1][0]).not.toBeNull();
      expect(board.grid[2][0]).not.toBeNull();
      expect(board.grid[3][0]).toBeNull();
    });

    test('adds ship to the ships array', () => {
      const ship = new Ship(2);
      board.placeShip(ship, 3, 3);
      expect(board.ships).toContain(ship);
    });

    test('throws when horizontal ship overflows right edge', () => {
      const ship = new Ship(4);
      expect(() => board.placeShip(ship, 8, 0, false)).toThrow();
    });

    test('throws when vertical ship overflows bottom edge', () => {
      const ship = new Ship(4);
      expect(() => board.placeShip(ship, 0, 8, true)).toThrow();
    });

    test('throws on ship collision', () => {
      const shipA = new Ship(3);
      const shipB = new Ship(3);
      board.placeShip(shipA, 0, 0, false);
      expect(() => board.placeShip(shipB, 2, 0, false)).toThrow();
    });

    test('allows placement at the last valid cell on the edge', () => {
      const ship = new Ship(1);
      expect(() => board.placeShip(ship, 9, 9)).not.toThrow();
    });
  });

  // ─── receiveAttack ───────────────────────────────────────────────────────────
  describe('receiveAttack()', () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(3);
      board.placeShip(ship, 0, 0, false); // occupies (0,0), (1,0), (2,0)
    });

    test('returns "hit" when a ship occupies the coordinate', () => {
      expect(board.receiveAttack(0, 0)).toBe('hit');
    });

    test('calls hit() on the ship when it is struck', () => {
      board.receiveAttack(1, 0);
      expect(ship.hits).toBe(1);
    });

    test('returns "miss" when no ship occupies the coordinate', () => {
      expect(board.receiveAttack(5, 5)).toBe('miss');
    });

    test('records missed coordinate in missedCoords', () => {
      board.receiveAttack(5, 5);
      expect(board.missedCoords.has('5,5')).toBe(true);
    });

    test('does NOT record a hit in missedCoords', () => {
      board.receiveAttack(0, 0);
      expect(board.missedCoords.has('0,0')).toBe(false);
    });

    test('returns "already_attacked" for duplicate attacks', () => {
      board.receiveAttack(0, 0);
      expect(board.receiveAttack(0, 0)).toBe('already_attacked');
    });

    test('does not double-count hits on duplicate attacks', () => {
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 0);
      expect(ship.hits).toBe(1);
    });

    test('returns "out_of_bounds" for coordinates outside the grid', () => {
      expect(board.receiveAttack(-1, 0)).toBe('out_of_bounds');
      expect(board.receiveAttack(0, 10)).toBe('out_of_bounds');
    });
  });

  // ─── allShipsSunk ────────────────────────────────────────────────────────────
  describe('allShipsSunk()', () => {
    test('returns false when no ships are placed', () => {
      expect(board.allShipsSunk()).toBe(false);
    });

    test('returns false when some ships are still afloat', () => {
      const shipA = new Ship(1);
      const shipB = new Ship(2);
      board.placeShip(shipA, 0, 0);
      board.placeShip(shipB, 5, 5);
      board.receiveAttack(0, 0); // sinks shipA
      expect(board.allShipsSunk()).toBe(false);
    });

    test('returns true when all ships are sunk', () => {
      const shipA = new Ship(1);
      const shipB = new Ship(2);
      board.placeShip(shipA, 0, 0);
      board.placeShip(shipB, 5, 5, false); // occupies (5,5), (6,5)
      board.receiveAttack(0, 0);
      board.receiveAttack(5, 5);
      board.receiveAttack(6, 5);
      expect(board.allShipsSunk()).toBe(true);
    });

    test('returns false after only partial hits', () => {
      const ship = new Ship(3);
      board.placeShip(ship, 0, 0, false);
      board.receiveAttack(0, 0);
      board.receiveAttack(1, 0);
      expect(board.allShipsSunk()).toBe(false);
    });
  });
});
