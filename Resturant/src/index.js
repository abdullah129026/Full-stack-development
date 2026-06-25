import { loadHome } from './home.js';
import './style.css'; // If you have styling

const contentDiv = document.getElementById('content');

// Initial page load
function initializePage() {
    contentDiv.appendChild(loadHome());
}

initializePage();