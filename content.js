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

// Store color palettes.
window.COLORS = {
    green: [['0.0', '#60ad5e'], ['1.0', '#005005']],
    blue: [['0.0', '#5e92f3'], ['1.0', '#003c8f']],
    red: [['0.0', '#ff5f52'], ['1.0', '#8e0000']],
    purple: [['0.0', '#9c4dcc'], ['1.0', '#38006b']],
    amber: [['0.0', '#ffc046'], ['1.0', '#c56000']],
    gray: [['0.0', '#8e8e8e'], ['1.0', '#373737']]
};

// Store selected colorscale.
window.colorscale = window.COLORS.green;
window.getColorscale = () => window.colorscale;

// Handle colorscale changes by re-rendering the selected graph.
window.currentGraphRenderer = undefined;
document.getElementById('colorscale-selector').addEventListener('change', () => {
    window.colorscale = window.COLORS[document.getElementById('colorscale-selector').value];
    if (window.currentGraphRenderer) window.currentGraphRenderer();
});

// Show hourly display.
document.getElementById('link-hourly').addEventListener('click', () => {
    window.currentGraphRenderer = () => displayHourly('content-plotly');
    window.currentGraphRenderer();
    window.selectNavItem('link-hourly');
    window.switchDisplay('content-plotly');
});

// Show daily display.
document.getElementById('link-daily').addEventListener('click', () => {
    window.currentGraphRenderer = () => displayDaily('content-plotly');
    window.currentGraphRenderer();
    window.selectNavItem('link-daily');
    window.switchDisplay('content-plotly');
});
