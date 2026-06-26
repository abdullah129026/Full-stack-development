/**
 * Ship factory / class
 * Represents a single ship on the Battleship board.
 */
export class Ship {
  /**
   * @param {number} length - The number of cells this ship occupies.
   */
  constructor(length) {
    if (!Number.isInteger(length) || length < 1) {
      throw new Error('Ship length must be a positive integer.');
    }
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  /** Registers a hit on this ship. */
  hit() {
    if (this.sunk) return; // can't hit an already-sunk ship
    this.hits += 1;
    this.sunk = this.isSunk();
  }

  /** @returns {boolean} true if the ship has been completely sunk. */
  isSunk() {
    return this.hits >= this.length;
  }
}
