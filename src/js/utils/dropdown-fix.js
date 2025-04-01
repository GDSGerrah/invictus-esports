/**
 * FINAL DROPDOWN FIX FOR INVICTUS ESPORTS
 * This script specifically targets the issue with dropdowns not working after navigation
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Dropdown Fix: Initializing');
  
  // Function to apply dropdown functionality
  function initializeDropdowns() {
    // Find all dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');
    
    console.log(`Dropdown Fix: Found ${dropdowns.length} dropdowns`);
    
    if (dropdowns.length === 0) {
      // Try to find the ESPORTS link and transform it
      const esportsLinks = Array.from(document.querySelectorAll('.nav-link')).filter(
        link => link.textContent.trim() === 'ESPORTS'
      );
      
      if (esportsLinks.length > 0) {
        console.log('Dropdown Fix: Found ESPORTS link that needs transformation');
        convertEsportsLink(esportsLinks[0]);
        // Run initialization again after conversion
        setTimeout(initializeDropdowns, 50);
      } else {
        console.log('Dropdown Fix: No dropdown elements found and no ESPORTS link found');
      }
      return;
    }
    
    // Process each dropdown
    dropdowns.forEach(function(dropdown, index) {
      // Find the dropdown toggle and menu
      const toggle = dropdown.querySelector('.dropdown-toggle') || 
                     dropdown.querySelector('.nav-link');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (!menu) {
        console.log(`Dropdown Fix: Dropdown #${index} has no menu`);
        return;
      }
      
      // Clean up any existing event listeners
      cleanupListeners(dropdown, toggle, menu);
      
      // Apply important styles directly
      applyForceStyles(dropdown, menu);
      
      console.log(`Dropdown Fix: Initialized dropdown #${index}`);
    });
  }
  
  // Function to convert a standalone ESPORTS link to a dropdown
  function convertEsportsLink(link) {
    // Only proceed if it's not already in a dropdown
    if (link.closest('.dropdown')) {
      return;
    }
    
    console.log('Dropdown Fix: Converting ESPORTS link to dropdown');
    
    // Create the dropdown HTML
    const listItem = link.parentNode;
    listItem.classList.add('dropdown');
    
    // Replace the link with a span
    const toggleSpan = document.createElement('span');
    toggleSpan.className = 'nav-link dropdown-toggle';
    toggleSpan.textContent = 'ESPORTS';
    
    // Create dropdown menu
    const menuDiv = document.createElement('div');
    menuDiv.className = 'dropdown-menu';
    menuDiv.innerHTML = `
      <ul class="dropdown-list">
        <li><a href="/src/pages/esport-schedule.html" class="dropdown-link">MATCH SCHEDULE</a></li>
        <li><a href="/src/pages/esport-our-teams.html" class="dropdown-link">OUR TEAMS</a></li>
      </ul>
    `;
    
    // Replace the link with our new elements
    listItem.replaceChild(toggleSpan, link);
    listItem.appendChild(menuDiv);
    
    console.log('Dropdown Fix: ESPORTS link converted successfully');
  }
  
  // Function to clean up existing event listeners
  function cleanupListeners(dropdown, toggle, menu) {
    // The safest way to clear listeners is to clone and replace
    if (dropdown._hasListeners) {
      const newDropdown = dropdown.cloneNode(true);
      dropdown.parentNode.replaceChild(newDropdown, dropdown);
      return newDropdown;
    }
    
    // Mark this dropdown as having listeners
    dropdown._hasListeners = true;
    
    // Add mouseenter/mouseleave events
    dropdown.addEventListener('mouseenter', function() {
      menu.style.opacity = '1';
      menu.style.visibility = 'visible'; 
      menu.style.transform = 'translateX(-50%) translateY(0)';
      menu.style.pointerEvents = 'auto';
    });
    
    dropdown.addEventListener('mouseleave', function() {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.transform = 'translateX(-50%) translateY(-15px)';
      menu.style.pointerEvents = 'none';
    });
    
    // If toggle is a link (not a span), prevent navigation
    if (toggle && toggle.tagName.toLowerCase() === 'a') {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  }
  
  // Function to apply critical styles directly via JS
  function applyForceStyles(dropdown, menu) {
    // Dropdown styles
    dropdown.style.position = 'relative';
    
    // Menu styles
    menu.style.position = 'absolute';
    menu.style.top = '100%';
    menu.style.left = '50%';
    menu.style.transform = 'translateX(-50%) translateY(-15px)';
    menu.style.minWidth = '200px';
    menu.style.backgroundColor = '#1e1e1e';
    menu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    menu.style.zIndex = '1000';
    menu.style.padding = '8px 0';
    menu.style.borderRadius = '4px';
    menu.style.marginTop = '4px';
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transition = 'all 0.3s ease';
    menu.style.pointerEvents = 'none';
  }
  
  // Run initialization immediately
  initializeDropdowns();
  
  // Create and insert CSS with !important rules
  function addImportantCSS() {
    const style = document.createElement('style');
    style.id = 'dropdown-fix-style';
    style.textContent = `
      /* Critical dropdown styles with !important */
      .dropdown {
        position: relative !important;
      }
      
      .dropdown-menu {
        position: absolute !important;
        top: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(-15px) !important;
        min-width: 200px !important;
        background-color: #1e1e1e !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
        z-index: 1000 !important;
        padding: 8px 0 !important;
        border-radius: 4px !important;
        margin-top: 4px !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.3s ease !important;
        pointer-events: none !important;
      }
      
      .dropdown:hover .dropdown-menu {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateX(-50%) translateY(0) !important;
        pointer-events: auto !important;
      }
      
      .dropdown-list {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      .dropdown-link {
        display: block !important;
        padding: 8px 16px !important;
        color: white !important;
        text-decoration: none !important;
        text-align: center !important;
      }
      
      .dropdown-link:hover {
        color: #8738ff !important;
      }
      
      /* Scrolled state for navbar */
      .navbar-main.scrolled .dropdown-menu {
        background-color: white !important;
      }
      
      .navbar-main.scrolled .dropdown-link {
        color: #333333 !important;
      }
      
      .navbar-main.scrolled .dropdown-link:hover {
        color: #8738ff !important;
      }
    `;
    
    // Add to document head
    document.head.appendChild(style);
    console.log('Dropdown Fix: Added CSS with !important rules');
  }
  
  // Add the CSS
  addImportantCSS();
  
  // Handle page show event (for back navigation)
  window.addEventListener('pageshow', function(event) {
    console.log(`Dropdown Fix: Page show event, persisted: ${event.persisted}`);
    
    // Small delay to ensure DOM is ready
    setTimeout(initializeDropdowns, 100);
  });
  
  // Also handle load event
  window.addEventListener('load', function() {
    console.log('Dropdown Fix: Window load event');
    initializeDropdowns();
  });
  
  // Run periodically for the first few seconds
  for (let i = 1; i <= 5; i++) {
    setTimeout(initializeDropdowns, i * 500);
  }
  
  // Make available globally for debugging
  window.fixDropdowns = initializeDropdowns;
  
  console.log('Dropdown Fix: Setup complete');
});