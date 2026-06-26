import { Player } from './player.js';
import { Ship } from './ship.js';

describe('Player Smart AI (Hunt & Target Mode)', () => {
  let computer, enemy;

  beforeEach(() => {
    computer = new Player('CPU', 'computer');
    enemy = new Player('Human');
  });

  test('starts in hunt mode', () => {
    expect(computer.aiState).toBe('hunt');
    expect(computer.huntHits).toHaveLength(0);
  });

  test('stays in hunt mode on miss', () => {
    // Ship is placed away from potential hit area for first test, or we test return result
    const ship = new Ship(3);
    enemy.gameboard.placeShip(ship, 5, 5, false); // occupies (5,5), (6,5), (7,5)

    // Force a miss by targeting somewhere else
    const originalHuntCoord = computer._getHuntCoordinate;
    computer._getHuntCoordinate = () => ({ x: 0, y: 0 });

    const move = computer.smartAttack(enemy.gameboard);
    expect(move.result).toBe('miss');
    expect(computer.aiState).toBe('hunt');

    computer._getHuntCoordinate = originalHuntCoord;
  });

  test('switches to target mode on first hit and identifies adjacent targets', () => {
    const ship = new Ship(3);
    enemy.gameboard.placeShip(ship, 5, 5, false); // occupies (5,5), (6,5), (7,5)

    // Force hit at (5, 5)
    computer._getHuntCoordinate = () => ({ x: 5, y: 5 });

    const move = computer.smartAttack(enemy.gameboard);
    expect(move.result).toBe('hit');
    expect(computer.aiState).toBe('target');
    expect(computer.huntHits).toEqual([{ x: 5, y: 5 }]);

    // Adjacent spaces should be (5,4), (5,6), (6,5), (4,5)
    const targets = computer._getPotentialTargets(enemy.gameboard);
    expect(targets).toContainEqual({ x: 5, y: 4 });
    expect(targets).toContainEqual({ x: 5, y: 6 });
    expect(targets).toContainEqual({ x: 6, y: 5 });
    expect(targets).toContainEqual({ x: 4, y: 5 });
    expect(targets).toHaveLength(4);
  });

  test('locks direction axis on consecutive hit', () => {
    const ship = new Ship(3);
    enemy.gameboard.placeShip(ship, 5, 5, false); // occupies (5,5), (6,5), (7,5)

    // Force first hit at (5, 5)
    computer._getHuntCoordinate = () => ({ x: 5, y: 5 });
    computer.smartAttack(enemy.gameboard);

    // The potential targets will have (5,4), (5,6), (6,5), (4,5)
    // Let's mock _getPotentialTargets to return (6,5) first (which is a hit on the horizontal ship)
    const originalTargets = computer._getPotentialTargets;
    computer._getPotentialTargets = () => [{ x: 6, y: 5 }];

    const move = computer.smartAttack(enemy.gameboard);
    expect(move.result).toBe('hit');
    expect(computer.aiState).toBe('target');
    expect(computer.huntHits).toEqual([{ x: 5, y: 5 }, { x: 6, y: 5 }]);

    // Restore targets function to calculate axis-locked targets
    computer._getPotentialTargets = originalTargets;

    // Now it should be locked to horizontal (since y coordinates are equal)
    // The next targets should be at the edges: (4,5) and (7,5)
    const targets = computer._getPotentialTargets(enemy.gameboard);
    expect(targets).toContainEqual({ x: 4, y: 5 });
    expect(targets).toContainEqual({ x: 7, y: 5 });
    expect(targets).toHaveLength(2);
  });

  test('reverts to hunt mode when ship is sunk', () => {
    const ship = new Ship(2);
    enemy.gameboard.placeShip(ship, 5, 5, false); // occupies (5,5), (6,5)

    // First hit at (5, 5)
    computer._getHuntCoordinate = () => ({ x: 5, y: 5 });
    computer.smartAttack(enemy.gameboard);

    // Second hit at (6, 5), which sinks the ship
    computer._getPotentialTargets = () => [{ x: 6, y: 5 }];
    const move = computer.smartAttack(enemy.gameboard);

    expect(move.result).toBe('hit');
    expect(enemy.gameboard.grid[5][6].ship.isSunk()).toBe(true);
    // Reverts to hunt
    expect(computer.aiState).toBe('hunt');
    expect(computer.huntHits).toHaveLength(0);
  });
});
