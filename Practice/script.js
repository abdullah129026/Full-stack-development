// --- Phase 1: Skeleton Setup & Core Logic ---

const myLibrary = [];

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    // Ensure uniqueness for DOM manipulation tracking
    this.id = crypto.randomUUID();
}

// Add a prototype method to toggle read status
Book.prototype.toggleReadStatus = function () {
    this.isRead = !this.isRead;
};

function addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    myLibrary.push(newBook);
}

// Add some mock data to start with so the user sees something beautiful immediately
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, true);
addBookToLibrary("1984", "George Orwell", 328, false);


// --- Phase 2: Dynamic UI Rendering ---

function displayBooks() {
    const container = document.getElementById("library-container");
    // Clear out existing content
    container.innerHTML = "";

    myLibrary.forEach((book) => {
        // Create the card container
        const card = document.createElement("div");
        card.classList.add("book-card");
        // Link the DOM element to the data object via data-id
        card.dataset.id = book.id;

        // Create inner HTML structure for the book details
        card.innerHTML = `
            <div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
            </div>
            <div class="book-pages">${book.pages} pages</div>
            <div class="book-status ${book.isRead ? 'status-read' : 'status-unread'}">
                ${book.isRead ? 'Read' : 'Not Read Yet'}
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary toggle-read-btn">Toggle Status</button>
                <button class="btn btn-danger delete-btn">Delete</button>
            </div>
        `;

        container.appendChild(card);
    });
}


// --- Phase 3 & 4: Forms, Data Entry, and Interactivity ---

document.addEventListener("DOMContentLoaded", () => {
    // Initial render
    displayBooks();

    const dialog = document.getElementById("book-dialog");
    const newBookBtn = document.getElementById("new-book-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const form = document.getElementById("book-form");
    const libraryContainer = document.getElementById("library-container");

    // Open Modal
    newBookBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    // Close Modal without saving
    cancelBtn.addEventListener("click", () => {
        dialog.close();
        form.reset();
    });

    // Form Submission
    form.addEventListener("submit", (event) => {
        // Prevent page refresh!
        event.preventDefault();

        // Extract values
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = parseInt(document.getElementById("pages").value, 10);
        const isRead = document.getElementById("isRead").checked;

        // Add to array
        addBookToLibrary(title, author, pages, isRead);

        // Reset form and close dialog
        form.reset();
        dialog.close();

        // Refresh UI
        displayBooks();
    });

    // Event Delegation for Delete and Toggle actions on dynamic cards
    libraryContainer.addEventListener("click", (event) => {
        const target = event.target;
        
        // Find the closest book card and its ID
        const card = target.closest(".book-card");
        if (!card) return;
        
        const bookId = card.dataset.id;
        
        // Handle Delete Button
        if (target.classList.contains("delete-btn")) {
            // Find index of the book
            const index = myLibrary.findIndex(b => b.id === bookId);
            if (index !== -1) {
                // Remove from array
                myLibrary.splice(index, 1);
                // Re-render
                displayBooks();
            }
        }

        // Handle Toggle Read Status Button
        if (target.classList.contains("toggle-read-btn")) {
            const book = myLibrary.find(b => b.id === bookId);
            if (book) {
                // Call prototype method
                book.toggleReadStatus();
                // Re-render
                displayBooks();
            }
        }
    });
});
