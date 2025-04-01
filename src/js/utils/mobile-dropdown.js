/**
 * Fix specifically for the ESPORTS dropdown hover on home page
 * after navigation back to the page
 */
(function() {
  // Function to fix the dropdown
  function fixDropdown() {
    // Only run on home page
    if (window.location.pathname === '/' || 
        window.location.pathname === '/index.html' ||
        window.location.pathname.endsWith('/index')) {
      
      console.log("Running dropdown fix on home page");
      
      // Look specifically for the span.dropdown-toggle element
      const dropdownToggle = document.querySelector('.dropdown-toggle');
      if (!dropdownToggle) {
        console.log("No dropdown toggle found");
        return;
      }
      
      console.log("Found dropdown toggle:", dropdownToggle);
      
      // Find its parent dropdown container
      const dropdown = dropdownToggle.closest('.dropdown');
      if (!dropdown) {
        console.log("No dropdown container found");
        return;
      }
      
      console.log("Found dropdown container:", dropdown);
      
      // Find the dropdown menu
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (!dropdownMenu) {
        console.log("No dropdown menu found");
        return;
      }
      
      console.log("Found dropdown menu:", dropdownMenu);
      
      // Force the dropdown to have position relative (in case CSS is not applied)
      dropdown.style.cssText = "position: relative !important;";
      
      // Force the dropdown menu to have correct styles
      dropdownMenu.style.cssText = `
        position: absolute !important;
        top: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(-30px) !important;
        min-width: 200px !important;
        background-color: #1e1e1e !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        z-index: 1000 !important;
        padding: 8px 0 !important;
        border-radius: 4px !important;
        margin-top: 4px !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.3s ease !important;
      `;
      
      // Create a style element to ensure hover works
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        .dropdown:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateX(-50%) translateY(0) !important;
        }
      `;
      document.head.appendChild(styleEl);
      
      // Additionally, add mouseenter/mouseleave events as backup
      dropdown.addEventListener('mouseenter', function() {
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
        dropdownMenu.style.transform = 'translateX(-50%) translateY(0)';
      });
      
      dropdown.addEventListener('mouseleave', function() {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.transform = 'translateX(-50%) translateY(-30px)';
      });
      
      console.log("Dropdown fix applied successfully");
    }
  }
  
  // Run the fix on page load
  document.addEventListener('DOMContentLoaded', fixDropdown);
  
  // Run the fix when the page is shown (back navigation)
  window.addEventListener('pageshow', fixDropdown);
  
  // Run on hashchange
  window.addEventListener('hashchange', fixDropdown);
  
  // Run on popstate
  window.addEventListener('popstate', fixDropdown);
  
  // Run after a delay to catch any async loading
  setTimeout(fixDropdown, 500);
  
  // Run when resources are loaded
  window.addEventListener('load', fixDropdown);
})();