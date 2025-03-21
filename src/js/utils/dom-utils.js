/**
 * DOM Utility Functions
 * Common DOM operations wrapped in easy-to-use functions
 */

/**
 * Get element by selector
 * @param {string} selector - CSS selector
 * @returns {Element|null} - DOM element or null
 */
export const getElement = (selector) => document.querySelector(selector);

/**
 * Get all elements matching selector
 * @param {string} selector - CSS selector
 * @returns {NodeList} - List of DOM elements
 */
export const getAllElements = (selector) => document.querySelectorAll(selector);

/**
 * Check if element exists in the DOM
 * @param {string|Element} element - Element or CSS selector
 * @returns {boolean} - True if element exists
 */
export const elementExists = (element) => {
  if (typeof element === 'string') {
    return document.querySelector(element) !== null;
  }
  return element !== null && element !== undefined;
};

/**
 * Add class to element
 * @param {Element} element - DOM element
 * @param {string} className - Class to add
 */
export const addClass = (element, className) => {
  if (element) element.classList.add(className);
};

/**
 * Remove class from element
 * @param {Element} element - DOM element
 * @param {string} className - Class to remove
 */
export const removeClass = (element, className) => {
  if (element) element.classList.remove(className);
};

/**
 * Toggle class on element
 * @param {Element} element - DOM element
 * @param {string} className - Class to toggle
 * @param {boolean} [force] - Force add/remove
 */
export const toggleClass = (element, className, force) => {
  if (element) element.classList.toggle(className, force);
};

/**
 * Check if element has class
 * @param {Element} element - DOM element
 * @param {string} className - Class to check
 * @returns {boolean} - True if element has class
 */
export const hasClass = (element, className) => {
  return element ? element.classList.contains(className) : false;
};

/**
 * Convert NodeList to Array
 * @param {NodeList} nodeList - NodeList to convert
 * @returns {Array} - Array of elements
 */
export const toArray = (nodeList) => Array.from(nodeList);