/**
 * Navbar Component
 * Handles fixed navbar with dynamic background on scroll
 */

import { getElement } from '../utils/dom-utils.js';
import { addSafeEventListener, throttle } from '../utils/event-utils.js';

export default class Navbar {
  /**
   * Initialize navbar
   * @param {Object} options - Configuration options
   * @param {string} options.navbarSelector - Navbar element selector
   * @param {string} options.videoSectionSelector - Video section selector
   * @param {string} options.logoWhiteSelector - White logo selector
   * @param {string} options.logoDarkSelector - Dark logo selector
   * @param {number} options.defaultThreshold - Default scroll threshold
   * @param {number} options.thresholdOffset - Threshold offset
   */
  constructor(options = {}) {
    // Default selectors and values
    this.options = {
      navbarSelector: '.navbar-main',
      videoSectionSelector: '.video-player-background',
      logoWhiteSelector: '.logo-white',
      logoDarkSelector: '.logo-dark',
      defaultThreshold: 300, // Default threshold if video section isn't found
      thresholdOffset: 100, // Offset from bottom of video section
      ...options
    };
    
    // Cache DOM elements
    this.navbar = getElement(this.options.navbarSelector);
    this.videoSection = getElement(this.options.videoSectionSelector);
    this.logoWhite = getElement(this.options.logoWhiteSelector);
    this.logoDark = getElement(this.options.logoDarkSelector);
    
    // State
    this.scrollThreshold = this.options.defaultThreshold;
    
    // Bind methods to preserve 'this' context
    this.calculateThreshold = this.calculateThreshold.bind(this);
    this.checkScrollPosition = this.checkScrollPosition.bind(this);
    this.handleResize = throttle(this.handleResize.bind(this), 100);
    
    // Initialize if navbar exists
    if (this.navbar) {
      this.init();
    } else {
      console.warn('Navbar element not found in the DOM');
    }
  }
  
  /**
   * Initialize navbar functionality
   */
  init() {
    // Calculate initial threshold
    this.scrollThreshold = this.calculateThreshold();
    
    // Add event listeners
    addSafeEventListener(window, 'scroll', throttle(this.checkScrollPosition, 10));
    addSafeEventListener(window, 'resize', this.handleResize);
    
    // Check position on initial load
    this.checkScrollPosition();
  }
  
  /**
   * Calculate scroll threshold for navbar color change
   * @returns {number} - Scroll threshold in pixels
   */
  calculateThreshold() {
    if (this.videoSection) {
      // The threshold is the bottom of the video section minus offset
      return this.videoSection.offsetHeight - this.options.thresholdOffset;
    }
    return this.options.defaultThreshold;
  }
  
  /**
   * Check scroll position and update navbar appearance
   */
  checkScrollPosition() {
    const isScrolledPast = window.scrollY >= this.scrollThreshold;
    
    // Update navbar class
    if (isScrolledPast) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    
    // Update logo visibility if logos exist
    if (this.logoWhite && this.logoDark) {
      this.logoWhite.style.display = isScrolledPast ? 'none' : 'block';
      this.logoDark.style.display = isScrolledPast ? 'block' : 'none';
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate threshold
    this.scrollThreshold = this.calculateThreshold();
    
    // Update navbar appearance based on new threshold
    this.checkScrollPosition();
  }
}