/**
 * Main JavaScript Entry Point
 * Initializes all components and functionality
 */

import VideoPlayer from './components/video-player.js';
import Carousel from './components/carousel.js';
import Navbar from './components/navbar.js';

/**
 * Initialize all components when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Initialize video player component
   */
  const videoPlayer = new VideoPlayer({
    videoSelector: '#home-video',
    playPauseSelector: '#play-pause-btn',
    muteSelector: '#mute-btn',
    pauseIconSelector: '.pause-icon',
    playIconSelector: '.play-icon',
    unmuteIconSelector: '.unmute-icon',
    muteIconSelector: '.mute-icon'
  });
  
  /**
   * Initialize carousel component
   */
  const carousel = new Carousel({
    trackSelector: '.carousel-track',
    cardSelector: '.video-card',
    nextSelector: '.next-arrow',
    prevSelector: '.prev-arrow',
    gapWidth: 35,
    swipeThreshold: 50
  });
  
  /**
   * Initialize navbar component
   */
  const navbar = new Navbar({
    navbarSelector: '.navbar-main',
    videoSectionSelector: '.video-player-background',
    logoWhiteSelector: '.logo-white',
    logoDarkSelector: '.logo-dark',
    defaultThreshold: 300,
    thresholdOffset: 100
  });
  
  // Force a resize event to calculate proper thresholds on load
  window.dispatchEvent(new Event('resize'));
});