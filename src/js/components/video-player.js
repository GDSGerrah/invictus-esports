/**
 * Video Player Component
 * Handles video player functionality with play/pause and mute controls
 */

import { getElement, addClass, removeClass, hasClass } from '../utils/dom-utils.js';
import { addSafeEventListener } from '../utils/event-utils.js';

export default class VideoPlayer {
  /**
   * Initialize video player
   * @param {Object} options - Configuration options
   * @param {string} options.videoSelector - Video element selector
   * @param {string} options.playPauseSelector - Play/pause button selector
   * @param {string} options.muteSelector - Mute button selector
   * @param {string} options.pauseIconSelector - Pause icon selector
   * @param {string} options.playIconSelector - Play icon selector
   * @param {string} options.unmuteIconSelector - Unmute icon selector
   * @param {string} options.muteIconSelector - Mute icon selector
   */
  constructor(options = {}) {
    // Default selectors
    this.options = {
      videoSelector: '#home-video',
      playPauseSelector: '#play-pause-btn',
      muteSelector: '#mute-btn',
      pauseIconSelector: '.pause-icon',
      playIconSelector: '.play-icon',
      unmuteIconSelector: '.unmute-icon',
      muteIconSelector: '.mute-icon',
      ...options
    };
    
    // Cache DOM elements
    this.video = getElement(this.options.videoSelector);
    this.playPauseBtn = getElement(this.options.playPauseSelector);
    this.muteBtn = getElement(this.options.muteSelector);
    
    // Bind methods to preserve 'this' context
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.updatePlayPauseUI = this.updatePlayPauseUI.bind(this);
    this.updateMuteUI = this.updateMuteUI.bind(this);
    
    // Initialize if all required elements exist
    if (this.video && this.playPauseBtn && this.muteBtn) {
      this.init();
    } else {
      console.warn('Video player elements not found in the DOM');
    }
  }
  
  /**
   * Initialize video player functionality
   */
  init() {
    // Set initial state
    this.video.muted = true;
    addClass(this.video, 'muted');
    
    if (this.video.paused) {
      addClass(this.video, 'paused');
    }
    
    // Initial UI update
    this.updatePlayPauseUI();
    this.updateMuteUI();
    
    // Add event listeners
    addSafeEventListener(this.playPauseBtn, 'click', this.togglePlayPause);
    addSafeEventListener(this.muteBtn, 'click', this.toggleMute);
    
    // Add video event listeners for syncing UI with video state
    addSafeEventListener(this.video, 'play', this.updatePlayPauseUI);
    addSafeEventListener(this.video, 'pause', this.updatePlayPauseUI);
    addSafeEventListener(this.video, 'volumechange', this.updateMuteUI);
  }
  
  /**
   * Toggle play/pause state
   */
  togglePlayPause() {
    if (this.video.paused) {
      // Try to play the video
      const playPromise = this.video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          removeClass(this.video, 'paused');
          this.updatePlayPauseUI();
        }).catch(error => {
          console.error("Play failed:", error);
          // Ensure UI shows correct state on failure
          addClass(this.video, 'paused');
          this.updatePlayPauseUI();
        });
      }
    } else {
      this.video.pause();
      addClass(this.video, 'paused');
      this.updatePlayPauseUI();
    }
  }
  
  /**
   * Toggle mute/unmute state
   */
  toggleMute() {
    this.video.muted = !this.video.muted;
    
    if (this.video.muted) {
      addClass(this.video, 'muted');
    } else {
      removeClass(this.video, 'muted');
    }
    
    this.updateMuteUI();
  }
  
  /**
   * Update play/pause button UI
   */
  updatePlayPauseUI() {
    const pauseIcon = this.playPauseBtn.querySelector(this.options.pauseIconSelector);
    const playIcon = this.playPauseBtn.querySelector(this.options.playIconSelector);
    
    if (pauseIcon && playIcon) {
      if (this.video.paused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
      } else {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
      }
    }
  }
  
  /**
   * Update mute button UI
   */
  updateMuteUI() {
    const unmuteIcon = this.muteBtn.querySelector(this.options.unmuteIconSelector);
    const muteIcon = this.muteBtn.querySelector(this.options.muteIconSelector);
    
    if (unmuteIcon && muteIcon) {
      if (this.video.muted) {
        unmuteIcon.style.display = 'none';
        muteIcon.style.display = 'block';
      } else {
        unmuteIcon.style.display = 'block';
        muteIcon.style.display = 'none';
      }
    }
  }
}
