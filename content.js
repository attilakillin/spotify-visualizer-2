// Hide every content div, and only show the one requested by the argument.
window.switchDisplay = (target, innerHTML) => {
    document.querySelectorAll('.content-container').forEach(node => node.setAttribute('hidden', 'true'));
    const content = document.querySelector('#' + target);
    if (innerHTML !== undefined) content.innerHTML = innerHTML;
    content.removeAttribute('hidden');
};

// Whether to show or hide the navigation bar items.
window.showNavigation = (bool) => {
    let navbar = document.querySelector('#content-navigation');
    if (bool) { navbar.removeAttribute('hidden'); } else { navbar.setAttribute('hidden', 'true'); };
}

// Set highlighted navigation item.
window.selectNavItem = (target) => {
    document.querySelectorAll('.nav-link').forEach(node => node.removeAttribute('active'));
    document.querySelector('#' + target).setAttribute('active', 'true');
}

// Store selected colorscale.
window.colorscale = 'Greens';
window.getColorscale = () => window.colorscale;

// Handle colorscale changes by re-rendering the selected graph.
window.currentGraphRenderer = undefined;
document.getElementById('colorscale-selector').addEventListener('change', () => {
    window.colorscale = document.getElementById('colorscale-selector').value;
    if (window.currentGraphRenderer) window.currentGraphRenderer();
});

// Show hourly display.
document.getElementById('link-hourly').addEventListener('click', () => {
    window.currentGraphRenderer = () => displayHourly('content-plotly');
    window.currentGraphRenderer();
    window.selectNavItem('link-hourly');
    window.switchDisplay('content-plotly');
});
