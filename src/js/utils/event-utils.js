/**
 * Event Utility Functions
 * Helper functions for event handling
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 100) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  };
  
  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} - Throttled function
   */
  export const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  /**
   * Add event listener with error handling
   * @param {Element} element - DOM element
   * @param {string} eventType - Event type (e.g., 'click')
   * @param {Function} handler - Event handler
   * @param {Object} [options] - Event options
   */
  export const addSafeEventListener = (element, eventType, handler, options) => {
    if (!element) {
      console.warn(`Cannot add ${eventType} listener to non-existent element`);
      return;
    }
    
    try {
      element.addEventListener(eventType, handler, options);
    } catch (error) {
      console.error(`Error adding ${eventType} listener:`, error);
    }
  };
  
  /**
   * Remove event listener with error handling
   * @param {Element} element - DOM element
   * @param {string} eventType - Event type (e.g., 'click')
   * @param {Function} handler - Event handler
   * @param {Object} [options] - Event options
   */
  export const removeSafeEventListener = (element, eventType, handler, options) => {
    if (!element) {
      console.warn(`Cannot remove ${eventType} listener from non-existent element`);
      return;
    }
    
    try {
      element.removeEventListener(eventType, handler, options);
    } catch (error) {
      console.error(`Error removing ${eventType} listener:`, error);
    }
  };
  
  /**
   * Trigger an event on an element
   * @param {Element} element - DOM element
   * @param {string} eventType - Event type to trigger
   */
  export const triggerEvent = (element, eventType) => {
    if (!element) return;
    
    const event = new Event(eventType, {
      bubbles: true,
      cancelable: true
    });
    
    element.dispatchEvent(event);
  };