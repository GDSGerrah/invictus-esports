/**
 * Main script for Invictus Esports website
 * Handles dropdown menu, video player, and carousel functionality
 */

import VideoPlayer from './components/video-player.js';
import ContentCarousel from './components/content-carousel.js';
import TimelineCarousel from './components/timeline-carousel.js';

// Store a reference to our initialization time to prevent excessive reinits
let lastInitTime = 0;

/**
 * Initialize all site functionality
 */
export function initSite() {
  // Prevent excessive re-initialization
  const now = Date.now();
  if (now - lastInitTime < 500) {
    return;
  }
  lastInitTime = now;
  
  console.log("Initializing site functionality");
  
  // Initialize components in order
  initDropdown();
  initVideoPlayer();
  initCarousels();
}

/**
 * Initialize dropdown menu functionality
 */
function initDropdown() {
  console.log("Initializing dropdown menu");
  
  // Fix ESPORTS links first
  fixEsportsLinks();
  
  // Then handle dropdown functionality
  setupDropdownBehavior();
}

/**
 * Fix standalone ESPORTS links to prevent "file not found" errors
 */
function fixEsportsLinks() {
  // Find all ESPORTS links that are not part of a dropdown
  const esportsLinks = Array.from(document.querySelectorAll('a')).filter(link => 
    link.textContent.trim().toUpperCase() === 'ESPORTS' && 
    !link.closest('.dropdown')
  );
  
  esportsLinks.forEach(link => {
    console.log("Found standalone ESPORTS link:", link);
    // Remove old event listeners
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    
    // Add click handler to navigate to schedule page
    newLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/src/pages/esport-schedule.html';
    });
  });
}

/**
 * Set up dropdown behavior with both hover and click support
 */
function setupDropdownBehavior() {
  // Get all dropdowns
  const dropdowns = document.querySelectorAll('.dropdown');
  if (dropdowns.length === 0) {
    console.log("No dropdown elements found");
    return;
  }
  
  console.log("Found", dropdowns.length, "dropdown elements");
  
  // Create new event handlers for each dropdown
  dropdowns.forEach(dropdown => {
    // Get the toggle element (will be a link or span with class nav-link)
    const toggle = dropdown.querySelector('.nav-link');
    if (!toggle) {
      console.log("No toggle element found in dropdown");
      return;
    }
    
    console.log("Found toggle element:", toggle);
    
    // Remove existing event listeners
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Get dropdown menu
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) {
      console.log("No dropdown menu found");
      return;
    }
    
    // Ensure dropdown has position relative
    dropdown.style.position = 'relative';
    
    // Make dropdown menu visible on hover
    dropdown.addEventListener('mouseenter', function() {
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      if (menu.style.transform) {
        menu.style.transform = menu.style.transform.replace('translateY(-30px)', 'translateY(0)');
      }
    });
    
    dropdown.addEventListener('mouseleave', function() {
      if (!dropdown.classList.contains('active')) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        if (menu.style.transform) {
          menu.style.transform = menu.style.transform.replace('translateY(0)', 'translateY(-30px)');
        }
      }
    });
    
    // Add click handler for toggle
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle active state
      dropdown.classList.toggle('active');
      
      if (dropdown.classList.contains('active')) {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        if (menu.style.transform) {
          menu.style.transform = menu.style.transform.replace('translateY(-30px)', 'translateY(0)');
        }
      } else {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        if (menu.style.transform) {
          menu.style.transform = menu.style.transform.replace('translateY(0)', 'translateY(-30px)');
        }
      }
    });
  });
  
  // Close active dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      // Close all active dropdowns
      document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          if (menu.style.transform) {
            menu.style.transform = menu.style.transform.replace('translateY(0)', 'translateY(-30px)');
          }
        }
      });
    }
  });
}

/**
 * Initialize the video player component
 */
function initVideoPlayer() {
  // Check if video element exists
  const videoElement = document.getElementById('home-video');
  if (!videoElement) {
    console.log('Video initializer: No video element found');
    return;
  }
  
  console.log('Video initializer: Found video element, initializing player');
  
  // Create new VideoPlayer instance
  const videoPlayer = new VideoPlayer();
  
  // Keep a reference to the player in window for debugging
  window.videoPlayer = videoPlayer;
  
  // Add direct button handlers as a fallback
  addDirectButtonHandlers();
}

/**
 * Add direct click handlers to video control buttons
 * This works as a backup method if the class-based approach fails
 */
function addDirectButtonHandlers() {
  const video = document.getElementById('home-video');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const muteBtn = document.getElementById('mute-btn');
  
  if (!video) return;
  
  // Check initial state and update classes
  if (video.paused) {
    video.classList.add('paused');
  } else {
    video.classList.remove('paused');
  }
  
  if (video.muted) {
    video.classList.add('muted');
  } else {
    video.classList.remove('muted');
  }
  
  // Add click handler for play/pause button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Direct handler: Play/pause button clicked');
      
      if (video.paused) {
        // Try to play video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            video.classList.remove('paused');
            updateVideoControlIcons();
          }).catch(error => {
            console.error('Direct handler: Error playing video:', error);
            video.classList.add('paused');
            updateVideoControlIcons();
          });
        }
      } else {
        // Pause video
        video.pause();
        video.classList.add('paused');
        updateVideoControlIcons();
      }
    });
  }
  
  // Add click handler for mute button
  if (muteBtn) {
    muteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Direct handler: Mute button clicked');
      
      video.muted = !video.muted;
      
      if (video.muted) {
        video.classList.add('muted');
      } else {
        video.classList.remove('muted');
      }
      
      updateVideoControlIcons();
    });
  }
  
  // Update control icons based on video state
  function updateVideoControlIcons() {
    if (playPauseBtn) {
      const pauseIcon = playPauseBtn.querySelector('.pause-icon');
      const playIcon = playPauseBtn.querySelector('.play-icon');
      
      if (pauseIcon && playIcon) {
        pauseIcon.style.display = video.paused ? 'none' : 'block';
        playIcon.style.display = video.paused ? 'block' : 'none';
      }
    }
    
    if (muteBtn) {
      const unmuteIcon = muteBtn.querySelector('.unmute-icon');
      const muteIcon = muteBtn.querySelector('.mute-icon');
      
      if (unmuteIcon && muteIcon) {
        unmuteIcon.style.display = video.muted ? 'none' : 'block';
        muteIcon.style.display = video.muted ? 'block' : 'none';
      }
    }
  }
  
  // Set initial icon states
  updateVideoControlIcons();
  
  // Add video event listeners
  video.addEventListener('play', () => {
    video.classList.remove('paused');
    updateVideoControlIcons();
  });
  
  video.addEventListener('pause', () => {
    video.classList.add('paused');
    updateVideoControlIcons();
  });
  
  video.addEventListener('volumechange', () => {
    if (video.muted) {
      video.classList.add('muted');
    } else {
      video.classList.remove('muted');
    }
    updateVideoControlIcons();
  });
}

/**
 * Initialize both carousels (Content and Timeline)
 */
function initCarousels() {
  // Initialize Content Carousel if present
  initContentCarousel();
  
  // Initialize Timeline Carousel if present
  initTimelineCarousel();
}

/**
 * Initialize the content carousel for the homepage
 */
function initContentCarousel() {
  // Check if content carousel exists on page
  const contentCarouselSection = document.querySelector('.content-carousel-section');
  if (!contentCarouselSection) {
    console.log('Main: No content carousel found on page');
    return;
  }
  
  console.log('Main: Initializing content carousel');
  
  // Create Content Carousel instance
  const contentCarousel = new ContentCarousel();
  
  // Store instance for debugging
  window.contentCarousel = contentCarousel;
}

/**
 * Initialize the timeline carousel for the about page
 */
function initTimelineCarousel() {
  // Check if timeline section exists
  const timelineSection = document.querySelector('.history-section');
  if (!timelineSection) {
    console.log('Main: No timeline section found on page');
    return;
  }
  
  console.log('Main: Initializing timeline carousel');
  
  // Create Timeline Carousel instance
  const timelineCarousel = new TimelineCarousel();
  
  // Store instance for debugging
  window.timelineCarousel = timelineCarousel;
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initSite);

// Initialize on window load
window.addEventListener('load', initSite);

// Critical: Handle page navigation
window.addEventListener('pageshow', function(event) {
  console.log("Page show event, persisted:", event.persisted);
  initSite();
});

// Handle history navigation
window.addEventListener('popstate', function() {
  console.log("Pop state event");
  initSite();
});

// Add MutationObserver to detect DOM changes
const observer = new MutationObserver(function(mutations) {
  console.log("DOM mutations detected");
  initSite();
});

// Start observing after a short delay to let the page load
setTimeout(function() {
  observer.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}, 1000);