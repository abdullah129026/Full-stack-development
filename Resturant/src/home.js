export function loadHome() {
    const container = document.createElement('div');
    container.classList.add('home-container');

    // 1. Create Headline
    const headline = document.createElement('h1');
    headline.textContent = "Welcome to Gourmet Bistro";
    container.appendChild(headline);

    const calltoAction = document.createElement('button');
    calltoAction.textContent = "View Menu";
    calltoAction.classList.add("view-menu");
    container.appendChild(calltoAction);

    // 2. Create Description
    const description = document.createElement('p');
    description.textContent = "Experience world-class culinary crafts prepared with locally sourced fresh ingredients. Our atmosphere matches our passion for wonderful dining.";
    container.appendChild(description);

    return container;
}