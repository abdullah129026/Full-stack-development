import { Gameboard } from './gameboard.js';
import { Ship } from './ship.js';

export const domManager = {
  /**
   * Render a 10x10 grid of cell elements inside the given container.
   * @param {HTMLElement} container
   * @param {Gameboard} gameboard
   * @param {boolean} hideShips - If true, do not render friendly ship locations (for enemy board)
   * @param {function(number, number)} [onCellClick] - Click handler for cells
   */
  renderBoard(container, gameboard, hideShips = false, onCellClick = null) {
    container.innerHTML = '';
    const grid = gameboard.grid;

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        cellEl.dataset.x = x;
        cellEl.dataset.y = y;

        const cellData = grid[y][x];

        // 1. Render ship position if visible
        if (cellData && !hideShips) {
          cellEl.classList.add('has-ship');
          if (cellData.ship.isSunk()) {
            cellEl.classList.add('sunk');
          }
        }

        // 2. Render attacks
        const key = `${x},${y}`;
        if (gameboard.attackedCoords.has(key)) {
          if (cellData !== null) {
            cellEl.classList.add('attack-hit');
            if (cellData.ship.isSunk()) {
              cellEl.classList.add('sunk');
            }
          } else {
            cellEl.classList.add('attack-miss');
          }
        }

        // 3. Attach click handler if applicable (and not already attacked)
        if (onCellClick && !gameboard.attackedCoords.has(key)) {
          cellEl.addEventListener('click', () => {
            onCellClick(x, y);
          });
        }

        container.appendChild(cellEl);
      }
    }
  },

  /**
   * Render the setup ship dock with draggable pieces.
   * @param {HTMLElement} container
   * @param {Array<{name: string, length: number}>} ships
   * @param {Set<string>} placedShips - Names of ships already placed
   */
  renderDock(container, ships, placedShips) {
    container.innerHTML = '';
    ships.forEach((shipInfo) => {
      const isPlaced = placedShips.has(shipInfo.name);
      
      const shipEl = document.createElement('div');
      shipEl.classList.add('dock-ship');
      if (isPlaced) {
        shipEl.classList.add('placed');
      } else {
        shipEl.setAttribute('draggable', 'true');
        shipEl.dataset.shipName = shipInfo.name;
        shipEl.dataset.shipLength = shipInfo.length;

        // Visual blocks preview inside dock element
        const blocksContainer = document.createElement('div');
        blocksContainer.classList.add('ship-preview-blocks');
        for (let i = 0; i < shipInfo.length; i++) {
          const block = document.createElement('div');
          block.classList.add('preview-block');
          blocksContainer.appendChild(block);
        }
        shipEl.appendChild(blocksContainer);
      }

      const infoEl = document.createElement('div');
      infoEl.classList.add('ship-info');
      
      const nameEl = document.createElement('span');
      nameEl.classList.add('ship-name');
      nameEl.textContent = shipInfo.name.toUpperCase();

      const sizeEl = document.createElement('span');
      sizeEl.classList.add('ship-size');
      sizeEl.textContent = `Size: ${shipInfo.length}`;

      infoEl.appendChild(nameEl);
      infoEl.appendChild(sizeEl);
      shipEl.appendChild(infoEl);

      container.appendChild(shipEl);
    });
  },

  /**
   * Set up drag and drop event listeners on the setup board.
   * @param {HTMLElement} gridContainer
   * @param {Gameboard} gameboard
   * @param {function} getPlacementDetails - Returns { shipName, shipLength, isVertical }
   * @param {function(string, number, number, boolean)} onShipPlaced - Success callback
   */
  setupDragAndDrop(gridContainer, gameboard, getPlacementDetails, onShipPlaced) {
    let dragOverCoords = [];

    const clearHighlights = () => {
      const cells = gridContainer.querySelectorAll('.cell');
      cells.forEach((cell) => {
        cell.classList.remove('drag-valid', 'drag-invalid');
      });
    };

    gridContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const cell = e.target.closest('.cell');
      if (!cell) return;

      const x = parseInt(cell.dataset.x, 10);
      const y = parseInt(cell.dataset.y, 10);

      const details = getPlacementDetails();
      if (!details || !details.shipLength) return;

      clearHighlights();

      const length = details.shipLength;
      const isVertical = details.isVertical;

      // Compute coordinate list for hover highlight
      const hoverCoords = [];
      let isValid = true;

      for (let i = 0; i < length; i++) {
        const cx = isVertical ? x : x + i;
        const cy = isVertical ? y + i : y;

        if (cx < 0 || cx >= 10 || cy < 0 || cy >= 10) {
          isValid = false;
        } else {
          // Check collision
          if (gameboard.grid[cy][cx] !== null) {
            isValid = false;
          }
          hoverCoords.push({ cx, cy });
        }
      }

      // Highlight the board cells
      hoverCoords.forEach(({ cx, cy }) => {
        const cellEl = gridContainer.querySelector(`.cell[data-x="${cx}"][data-y="${cy}"]`);
        if (cellEl) {
          cellEl.classList.add(isValid ? 'drag-valid' : 'drag-invalid');
        }
      });
    });

    gridContainer.addEventListener('dragleave', () => {
      clearHighlights();
    });

    gridContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      clearHighlights();
      const cell = e.target.closest('.cell');
      if (!cell) return;

      const x = parseInt(cell.dataset.x, 10);
      const y = parseInt(cell.dataset.y, 10);

      const details = getPlacementDetails();
      if (!details || !details.shipName) return;

      // Try placing using validation hook
      try {
        const dummyShip = new Ship(details.shipLength);
        // Will throw error if invalid placement
        gameboard.placeShip(dummyShip, x, y, details.isVertical);
        
        // Remove dummy ship from state since placement was a test (or commit it)
        // To be safe, we remove it from the grid array so the actual placement commits it cleanly
        for (let i = 0; i < details.shipLength; i++) {
          const cx = details.isVertical ? x : x + i;
          const cy = details.isVertical ? y + i : y;
          gameboard.grid[cy][cx] = null;
        }
        gameboard.ships.pop();

        // Successful placement callback
        onShipPlaced(details.shipName, x, y, details.isVertical);
      } catch (err) {
        // Placement invalid, ignore drop
        console.warn('Invalid ship placement:', err.message);
      }
    });
  }
};
