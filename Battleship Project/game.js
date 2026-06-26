import { Player } from './player.js';
import { Ship } from './ship.js';
import { domManager } from './domManager.js';

// Fleet specification
const FLEET = [
  { name: 'carrier', length: 5 },
  { name: 'battleship', length: 4 },
  { name: 'destroyer', length: 3 },
  { name: 'submarine', length: 3 },
  { name: 'patrolboat', length: 2 }
];

// App state
let state = {
  gameMode: 'vs-cpu', // 'vs-cpu' or 'vs-player'
  gameState: 'menu',  // 'menu', 'setup-p1', 'setup-p2', 'playing', 'game-over'
  players: [],        // [Player1, Player2]
  activePlayerIndex: 0,
  
  // Placement / Setup variables
  isVertical: false,
  draggedShipInfo: null,
  placedShips: new Set(), // Track placed ship names for current player

  // Attack logs
  attackCount: 0,
  hitCount: 0
};

// DOM references
const screens = {
  menu: document.getElementById('screen-menu'),
  setup: document.getElementById('screen-setup'),
  battle: document.getElementById('screen-battle')
};

const menuButtons = {
  cpu: document.getElementById('btn-mode-cpu'),
  p2: document.getElementById('btn-mode-p2')
};

const setupControls = {
  title: document.getElementById('setup-title'),
  subtitle: document.getElementById('setup-subtitle'),
  ownerLabel: document.getElementById('setup-board-owner'),
  axisBtn: document.getElementById('btn-toggle-axis'),
  axisLabel: document.getElementById('current-axis-label'),
  autoBtn: document.getElementById('btn-auto-place'),
  startBtn: document.getElementById('btn-start-combat'),
  dock: document.getElementById('ship-yard-dock'),
  grid: document.getElementById('setup-board-grid')
};

const battleControls = {
  turnName: document.getElementById('current-turn-display'),
  log: document.getElementById('battle-log'),
  friendlyGrid: document.getElementById('friendly-board-grid'),
  enemyGrid: document.getElementById('enemy-board-grid'),
  friendlyLabel: document.getElementById('friendly-board-label'),
  enemyLabel: document.getElementById('enemy-board-label'),
  friendlySunk: document.getElementById('friendly-sunk-count'),
  enemySunk: document.getElementById('enemy-sunk-count'),
  friendlyCard: document.querySelector('.board-card.friendly'),
  enemyCard: document.querySelector('.board-card.enemy')
};

const overlays = {
  pass: document.getElementById('pass-interstitial'),
  passText: document.getElementById('pass-interstitial-text'),
  btnReveal: document.getElementById('btn-reveal-board'),
  
  gameOver: document.getElementById('game-over-overlay'),
  gameOverTitle: document.getElementById('game-over-title'),
  gameOverSubtitle: document.getElementById('game-over-subtitle'),
  summaryAttacks: document.getElementById('summary-attacks'),
  summaryAccuracy: document.getElementById('summary-accuracy'),
  btnRestart: document.getElementById('btn-restart')
};

// ─── INITIALIZATION ───

function init() {
  setupEventListeners();
  showScreen('menu');
}

function setupEventListeners() {
  // Main Menu mode selection
  menuButtons.cpu.addEventListener('click', () => startSetup('vs-cpu'));
  menuButtons.p2.addEventListener('click', () => startSetup('vs-player'));

  // Setup options
  setupControls.axisBtn.addEventListener('click', togglePlacementAxis);
  setupControls.autoBtn.addEventListener('click', handleAutoPlacement);
  setupControls.startBtn.addEventListener('click', handleSetupFinished);

  // Overlay actions
  overlays.btnReveal.addEventListener('click', dismissPassOverlay);
  overlays.btnRestart.addEventListener('click', resetToMenu);
}

// ─── NAVIGATION ───

function showScreen(screenKey) {
  Object.keys(screens).forEach((key) => {
    screens[key].classList.toggle('active', key === screenKey);
  });
}

// ─── SETUP FLOW ───

function startSetup(mode) {
  state.gameMode = mode;
  
  // Create Player 1
  const p1 = new Player('Player 1', 'real');
  
  // Create Player 2 / CPU
  let p2;
  if (mode === 'vs-cpu') {
    p2 = new Player('Computer', 'computer');
    // Pre-place computer ships randomly
    autoDeployFleet(p2.gameboard);
  } else {
    p2 = new Player('Player 2', 'real');
  }

  state.players = [p1, p2];
  state.activePlayerIndex = 0;
  
  enterSetupPhase('setup-p1');
}

function enterSetupPhase(phase) {
  state.gameState = phase;
  state.placedShips.clear();
  state.isVertical = false;
  setupControls.axisLabel.textContent = 'Horizontal';

  const currentPlayer = state.players[state.activePlayerIndex];
  setupControls.ownerLabel.textContent = `${currentPlayer.name.toUpperCase()} WATERSPACE`;
  setupControls.title.textContent = `Deploy ${currentPlayer.name}'s Fleet`;
  setupControls.subtitle.textContent = `Drag and drop your ships onto the tactical ocean grid`;

  // Render setup components
  domManager.renderBoard(setupControls.grid, currentPlayer.gameboard, false);
  domManager.renderDock(setupControls.dock, FLEET, state.placedShips);

  // Hook drag and drop logic
  domManager.setupDragAndDrop(
    setupControls.grid,
    currentPlayer.gameboard,
    () => {
      // Getter for currently dragged ship details
      return {
        shipName: state.draggedShipInfo?.name,
        shipLength: state.draggedShipInfo?.length,
        isVertical: state.isVertical
      };
    },
    (shipName, x, y, isVertical) => {
      // Drag & drop drop-success callback
      const targetLength = FLEET.find(s => s.name === shipName).length;
      const ship = new Ship(targetLength);
      
      currentPlayer.gameboard.placeShip(ship, x, y, isVertical);
      state.placedShips.add(shipName);
      
      // Update displays
      domManager.renderBoard(setupControls.grid, currentPlayer.gameboard, false);
      domManager.renderDock(setupControls.dock, FLEET, state.placedShips);
      
      checkSetupStatus();
    }
  );

  // Enable dragging handlers on dynamically rendered pieces
  attachDragHandlers();
  checkSetupStatus();

  showScreen('setup');
}

function attachDragHandlers() {
  const dockShips = setupControls.dock.querySelectorAll('.dock-ship:not(.placed)');
  dockShips.forEach((shipEl) => {
    shipEl.addEventListener('dragstart', (e) => {
      state.draggedShipInfo = {
        name: shipEl.dataset.shipName,
        length: parseInt(shipEl.dataset.shipLength, 10)
      };
    });
    shipEl.addEventListener('dragend', () => {
      state.draggedShipInfo = null;
    });
  });
}

function togglePlacementAxis() {
  state.isVertical = !state.isVertical;
  setupControls.axisLabel.textContent = state.isVertical ? 'Vertical' : 'Horizontal';
}

function handleAutoPlacement() {
  const currentPlayer = state.players[state.activePlayerIndex];
  
  // Clear any partial placements
  currentPlayer.gameboard.grid = Array.from({ length: 10 }, () => Array(10).fill(null));
  currentPlayer.gameboard.ships = [];
  
  autoDeployFleet(currentPlayer.gameboard);

  // Mark all as placed
  FLEET.forEach(s => state.placedShips.add(s.name));

  domManager.renderBoard(setupControls.grid, currentPlayer.gameboard, false);
  domManager.renderDock(setupControls.dock, FLEET, state.placedShips);

  checkSetupStatus();
}

function autoDeployFleet(gameboard) {
  FLEET.forEach((shipInfo) => {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 1000) {
      const isVertical = Math.random() < 0.5;
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const ship = new Ship(shipInfo.length);
      
      try {
        gameboard.placeShip(ship, x, y, isVertical);
        placed = true;
      } catch (err) {
        attempts++;
      }
    }
  });
}

function checkSetupStatus() {
  const allPlaced = state.placedShips.size === FLEET.length;
  setupControls.startBtn.disabled = !allPlaced;
  setupControls.startBtn.classList.toggle('disabled', !allPlaced);
}

function handleSetupFinished() {
  if (state.gameMode === 'vs-cpu') {
    // Vs CPU: Setup finished for Player 1 -> directly start combat
    startCombatPhase();
  } else {
    // Vs Player: Setup finished for Player 1 -> proceed to Player 2 Setup
    if (state.gameState === 'setup-p1') {
      state.activePlayerIndex = 1;
      
      // Trigger short interstitial to avoid Player 2 seeing Player 1's board setup
      triggerPassDeviceOverlay("Player 1 has finished deployment. Hand device to Player 2 for setup.", () => {
        enterSetupPhase('setup-p2');
      });
    } else {
      // Player 2 setup finished -> start combat
      startCombatPhase();
    }
  }
}

// ─── COMBAT PHASE ───

function startCombatPhase() {
  state.gameState = 'playing';
  state.activePlayerIndex = 0; // Player 1 starts
  state.attackCount = 0;
  state.hitCount = 0;

  renderBattleGrids();
  updateBattleStatusDisplay();
  showScreen('battle');
}

function renderBattleGrids() {
  const activePlayer = state.players[state.activePlayerIndex];
  const opponent = state.players[1 - state.activePlayerIndex];

  // Friendly Board Label & Board
  battleControls.friendlyLabel.textContent = `${activePlayer.name.toUpperCase()} FLEET MAP`;
  domManager.renderBoard(battleControls.friendlyGrid, activePlayer.gameboard, false);

  // Enemy Board Label & Board (hide ships)
  battleControls.enemyLabel.textContent = `TARGET GRIDS (${opponent.name.toUpperCase()})`;
  domManager.renderBoard(
    battleControls.enemyGrid,
    opponent.gameboard,
    true, // hide ships
    (x, y) => handleAttack(x, y) // click handler
  );

  // Update sunk counters
  battleControls.friendlySunk.textContent = `${activePlayer.gameboard.ships.filter(s => s.isSunk()).length}/5`;
  battleControls.enemySunk.textContent = `${opponent.gameboard.ships.filter(s => s.isSunk()).length}/5`;
}

function updateBattleStatusDisplay() {
  const activePlayer = state.players[state.activePlayerIndex];
  battleControls.turnName.textContent = activePlayer.name.toUpperCase();
}

function handleAttack(x, y) {
  if (state.gameState !== 'playing') return;

  const opponent = state.players[1 - state.activePlayerIndex];
  const activePlayer = state.players[state.activePlayerIndex];

  const result = activePlayer.attack(opponent.gameboard, x, y);
  
  if (result === 'already_attacked' || result === 'out_of_bounds') return;

  state.attackCount++;
  if (result === 'hit') {
    state.hitCount++;
  }

  // Check if a ship was sunk
  const cell = opponent.gameboard.grid[y][x];
  let logText = `${activePlayer.name} fired at (${x}, ${y}) and ${result.toUpperCase()}!`;
  if (cell && cell.ship.isSunk()) {
    logText += ` Sunk ${opponent.name}'s ${cell.ship.length}-unit ship!`;
  }
  battleControls.log.textContent = logText;

  // Re-render
  renderBattleGrids();

  // Check win condition
  if (opponent.gameboard.allShipsSunk()) {
    handleGameOver(activePlayer);
    return;
  }

  // Next Turn
  advanceTurn();
}

function advanceTurn() {
  if (state.gameMode === 'vs-cpu') {
    // Switch to CPU turn
    state.activePlayerIndex = 1;
    battleControls.enemyCard.classList.add('disabled');
    battleControls.log.textContent += " Computer is calculating response...";

    setTimeout(() => {
      const cpu = state.players[1];
      const player1 = state.players[0];
      
      const move = cpu.smartAttack(player1.gameboard);
      
      let cpuLog = `Computer fired at (${move.x}, ${move.y}) and ${move.result.toUpperCase()}!`;
      const cell = player1.gameboard.grid[move.y][move.x];
      if (cell && cell.ship.isSunk()) {
        cpuLog += ` Sunk your ${cell.ship.length}-unit ship!`;
      }
      battleControls.log.textContent = cpuLog;

      // Switch back to player turn
      state.activePlayerIndex = 0;
      battleControls.enemyCard.classList.remove('disabled');
      renderBattleGrids();
      updateBattleStatusDisplay();

      // Check CPU win
      if (player1.gameboard.allShipsSunk()) {
        handleGameOver(cpu);
      }
    }, 1200);

  } else {
    // VS Player: Interstitial pass device overlay
    state.activePlayerIndex = 1 - state.activePlayerIndex;
    const nextPlayer = state.players[state.activePlayerIndex];
    
    triggerPassDeviceOverlay(`Pass the device to ${nextPlayer.name}!`, () => {
      renderBattleGrids();
      updateBattleStatusDisplay();
    });
  }
}

// ─── PASS DEVICE INTERSTITIAL ───

let postPassCallback = null;

function triggerPassDeviceOverlay(messageText, callback) {
  overlays.passText.textContent = messageText;
  postPassCallback = callback;
  overlays.pass.classList.add('active');
}

function dismissPassOverlay() {
  overlays.pass.classList.remove('active');
  if (postPassCallback) {
    postPassCallback();
    postPassCallback = null;
  }
}

// ─── GAME OVER ───

function handleGameOver(winner) {
  state.gameState = 'game-over';
  
  // Set labels
  overlays.gameOverTitle.textContent = winner.type === 'computer' ? 'DEFEAT' : 'VICTORY';
  overlays.gameOverSubtitle.textContent = `${winner.name} has completely destroyed the opposing fleet!`;
  
  // Calculate accuracy stats
  const accuracy = state.attackCount > 0 ? Math.round((state.hitCount / state.attackCount) * 100) : 0;
  overlays.summaryAttacks.textContent = state.attackCount;
  overlays.summaryAccuracy.textContent = `${accuracy}%`;

  overlays.gameOver.classList.add('active');
}

function resetToMenu() {
  overlays.gameOver.classList.remove('active');
  showScreen('menu');
  state.gameState = 'menu';
}

// Start app
init();
