// Disable Zooming (Mouse Wheel, Keyboard, etc.)
(function() {
    // Prevent zooming on mouse wheel
    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent zooming using keyboard shortcuts (Ctrl + "+" and Ctrl + "-")
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === '+') || (e.ctrlKey && e.key === '-')) {
            e.preventDefault();
        }
    });

    // Disable pinch-to-zoom on mobile (touch)
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Disable user-scalable meta tag dynamically
    var meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.getElementsByTagName('head')[0].appendChild(meta);
})();

// Disable Right-Click (Context Menu) on PC and Mobile
(function() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Disable right-click context menu
    });
})();

// Disable Text Selection (Copy, Cut, Paste)
(function() {
    document.addEventListener('selectstart', function(e) {
        e.preventDefault(); // Disable text selection
    });

    // Disable Copy (Ctrl+C) and Paste (Ctrl+V) keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
            e.preventDefault();
        }
    });

    // Disable text selection and copy using mouse
    document.body.style.userSelect = "none"; // For CSS-based text selection disable
})();
