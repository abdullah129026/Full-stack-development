const gridContainer = document.getElementById('grid-container');
const resizeBtn = document.getElementById('resize-btn');
const modeBtns = document.querySelectorAll('.mode-btn');

let currentSize = 16;
let currentMode = 'classic'; // 'classic', 'rgb', 'darkening'

// Initialize the sketchpad
function init() {
    createGrid(currentSize);
    setupEventListeners();
}

// Create the grid
function createGrid(size) {
    // Clear existing grid
    gridContainer.innerHTML = '';
    
    // Calculate the percentage width/height for flex-basis
    const cellSizePercent = 100 / size;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        
        // Use Flexbox to size the cell perfectly
        cell.style.flex = `0 0 ${cellSizePercent}%`;
        cell.style.height = `${cellSizePercent}%`;
        
        // For darkening mode, we need to track opacity/passes
        cell.dataset.passes = 0;

        cell.addEventListener('mouseover', handleHover);
        gridContainer.appendChild(cell);
    }
}

// Handle mouse hover over a cell
function handleHover(e) {
    const cell = e.target;
    
    if (currentMode === 'classic') {
        cell.style.backgroundColor = '#000000';
        cell.style.opacity = 1; // Reset opacity in case it was darkened
    } 
    else if (currentMode === 'rgb') {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        cell.style.opacity = 1;
    } 
    else if (currentMode === 'darkening') {
        let passes = parseInt(cell.dataset.passes);
        if (passes < 10) {
            passes += 1;
            cell.dataset.passes = passes;
            // Set background to black, but vary the opacity based on passes
            cell.style.backgroundColor = '#000000';
            cell.style.opacity = passes * 0.1;
        }
    }
}

// Set up UI event listeners
function setupEventListeners() {
    // Resize Button
    resizeBtn.addEventListener('click', () => {
        let newSize = prompt("Enter number of squares per side for the new grid (Max 100):");
        
        // Handle cancel or empty
        if (newSize === null || newSize.trim() === '') return;
        
        newSize = parseInt(newSize);
        
        if (isNaN(newSize) || newSize < 1 || newSize > 100) {
            alert("Invalid input. Please enter a number between 1 and 100.");
            return;
        }
        
        currentSize = newSize;
        createGrid(currentSize);
    });

    // Mode Toggle Buttons
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active styling
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update mode state
            currentMode = e.target.dataset.mode;
        });
    });
}

// Run initialization
init();
