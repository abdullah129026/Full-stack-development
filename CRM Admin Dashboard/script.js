// Essence CRM Dashboard - Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Note: The previous preventDefault() was blocking the actual page navigation!
    // Since we have separate HTML files for each page, we don't need to manually
    // handle the active state with JS on click; the browser will simply navigate
    // to the new file, which already has the correct "active" class hardcoded.

    // You can add other JS interactivity here (e.g., modals, form toggles)
    const actionButtons = document.querySelectorAll('.btn-primary');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Action clicked:', btn.innerText);
        });
    });
});
