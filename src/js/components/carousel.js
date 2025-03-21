/**
 * Carousel Component
 * Handles carousel functionality with responsive behavior
 */

import { getElement, getAllElements, toArray } from '../utils/dom-utils.js';
import { addSafeEventListener, throttle } from '../utils/event-utils.js';

export default class Carousel {
  /**
   * Initialize carousel
   * @param {Object} options - Configuration options
   * @param {string} options.trackSelector - Track element selector
   * @param {string} options.cardSelector - Card element selector
   * @param {string} options.nextSelector - Next button selector
   * @param {string} options.prevSelector - Previous button selector
   * @param {number} options.gapWidth - Gap between cards in pixels
   * @param {number} options.swipeThreshold - Threshold for swipe detection in pixels
   */
  constructor(options = {}) {
    // Default selectors and values
    this.options = {
      trackSelector: '.carousel-track',
      cardSelector: '.video-card',
      nextSelector: '.next-arrow',
      prevSelector: '.prev-arrow',
      gapWidth: 35, // Gap between cards in pixels
      swipeThreshold: 50, // Threshold for swipe detection
      ...options
    };
    
    // Cache DOM elements
    this.track = getElement(this.options.trackSelector);
    this.cards = toArray(getAllElements(this.options.cardSelector));
    this.nextButton = getElement(this.options.nextSelector);
    this.prevButton = getElement(this.options.prevSelector);
    
    // State
    this.currentIndex = 0;
    this.visibleCards = 1;
    this.maxIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    // Bind methods to preserve 'this' context
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.calculateVisibleCards = this.calculateVisibleCards.bind(this);
    this.updateMaxIndex = this.updateMaxIndex.bind(this);
    this.updateCarouselPosition = this.updateCarouselPosition.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleResize = throttle(this.handleResize.bind(this), 100);
    
    // Initialize if all required elements exist
    if (this.track && this.cards.length && this.nextButton && this.prevButton) {
      this.init();
    } else {
      console.warn('Carousel elements not found in the DOM');
    }
  }
  
  /**
   * Initialize carousel functionality
   */
  init() {
    // Set initial values
    this.visibleCards = this.calculateVisibleCards();
    this.maxIndex = this.updateMaxIndex();
    
    // Initialize carousel position
    this.updateCarouselPosition();
    
    // Add button event listeners
    addSafeEventListener(this.nextButton, 'click', this.next);
    addSafeEventListener(this.prevButton, 'click', this.prev);
    
    // Add touch/swipe support for mobile
    addSafeEventListener(this.track, 'touchstart', this.handleTouchStart, { passive: true });
    addSafeEventListener(this.track, 'touchend', this.handleTouchEnd, { passive: true });
    
    // Handle window resize
    addSafeEventListener(window, 'resize', this.handleResize);
  }
  
  /**
   * Calculate number of visible cards based on screen width
   * @returns {number} - Number of visible cards
   */
  calculateVisibleCards() {
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth >= 1200) {
      return 3; // Show 3 cards on large screens
    } else if (viewportWidth >= 768) {
      return 2; // Show 2 cards on medium screens
    } else {
      return 1; // Show 1 card on small screens
    }
  }
  
  /**
   * Calculate maximum index
   * @returns {number} - Maximum index
   */
  updateMaxIndex() {
    return Math.max(0, this.cards.length - this.visibleCards);
  }
  
  /**
   * Update carousel position
   */
  updateCarouselPosition() {
    if (!this.cards.length) return;
    
    // Calculate card width and slide amount
    const cardWidth = this.cards[0].offsetWidth;
    const slideAmount = cardWidth + this.options.gapWidth;
    
    // Apply transform
    const offset = -this.currentIndex * slideAmount;
    this.track.style.transform = `translateX(${offset}px)`;
    
    // Update button states
    this.updateButtonStates();
  }
  
  /**
   * Update button states (disabled/enabled)
   */
  updateButtonStates() {
    const isAtBeginning = this.currentIndex <= 0;
    const isAtEnd = this.currentIndex >= this.maxIndex;
    
    // Update previous button
    this.prevButton.disabled = isAtBeginning;
    this.prevButton.style.opacity = isAtBeginning ? "0.5" : "1";
    
    // Update next button
    this.nextButton.disabled = isAtEnd;
    this.nextButton.style.opacity = isAtEnd ? "0.5" : "1";
  }
  
  /**
   * Move to next slide
   */
  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarouselPosition();
    }
  }
  
  /**
   * Move to previous slide
   */
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarouselPosition();
    }
  }
  
  /**
   * Handle touch start event
   * @param {TouchEvent} e - Touch event
   */
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  /**
   * Handle touch end event
   * @param {TouchEvent} e - Touch event
   */
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  /**
   * Handle swipe gesture
   */
  handleSwipe() {
    if (this.touchEndX < this.touchStartX - this.options.swipeThreshold) {
      // Swipe left - go to next card
      this.next();
    } else if (this.touchEndX > this.touchStartX + this.options.swipeThreshold) {
      // Swipe right - go to previous card
      this.prev();
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate visible cards
    const newVisibleCards = this.calculateVisibleCards();
    
    if (newVisibleCards !== this.visibleCards) {
      this.visibleCards = newVisibleCards;
      const newMaxIndex = this.updateMaxIndex();
      
      // Make sure current index is valid
      if (this.currentIndex > newMaxIndex) {
        this.currentIndex = newMaxIndex;
      }
      
      this.maxIndex = newMaxIndex;
    }
    
    // Update carousel
    this.updateCarouselPosition();
  }
}