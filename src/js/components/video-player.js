/**
 * Fixed Video Player Component
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
    
    // Debug logging
    console.log('VideoPlayer: Initializing with elements:', {
      video: this.video,
      playPauseBtn: this.playPauseBtn,
      muteBtn: this.muteBtn
    });
    
    // Bind methods to preserve 'this' context
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.updatePlayPauseUI = this.updatePlayPauseUI.bind(this);
    this.updateMuteUI = this.updateMuteUI.bind(this);
    
    // Initialize if video element exists
    if (this.video) {
      this.init();
    } else {
      console.warn('Video player video element not found in the DOM');
    }
  }
  
  /**
   * Initialize video player functionality
   */
  init() {
    console.log('VideoPlayer: Initializing player functionality');
    
    // Set initial state
    this.video.muted = true;
    addClass(this.video, 'muted');
    
    if (this.video.paused) {
      addClass(this.video, 'paused');
    }
    
    // Initial UI update
    this.updatePlayPauseUI();
    this.updateMuteUI();
    
    // Clean up existing event listeners by cloning and replacing elements
    if (this.playPauseBtn) {
      const newPlayPauseBtn = this.playPauseBtn.cloneNode(true);
      this.playPauseBtn.parentNode.replaceChild(newPlayPauseBtn, this.playPauseBtn);
      this.playPauseBtn = newPlayPauseBtn;
      
      console.log('VideoPlayer: Adding click listener to play/pause button');
      addSafeEventListener(this.playPauseBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Play/pause button clicked');
        this.togglePlayPause();
      });
    }
    
    if (this.muteBtn) {
      const newMuteBtn = this.muteBtn.cloneNode(true);
      this.muteBtn.parentNode.replaceChild(newMuteBtn, this.muteBtn);
      this.muteBtn = newMuteBtn;
      
      console.log('VideoPlayer: Adding click listener to mute button');
      addSafeEventListener(this.muteBtn, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Mute button clicked');
        this.toggleMute();
      });
    }
    
    // Add video event listeners for syncing UI with video state
    addSafeEventListener(this.video, 'play', () => {
      console.log('VideoPlayer: Video play event');
      removeClass(this.video, 'paused');
      this.updatePlayPauseUI();
    });
    
    addSafeEventListener(this.video, 'pause', () => {
      console.log('VideoPlayer: Video pause event');
      addClass(this.video, 'paused');
      this.updatePlayPauseUI();
    });
    
    addSafeEventListener(this.video, 'volumechange', () => {
      console.log('VideoPlayer: Video volumechange event, muted:', this.video.muted);
      if (this.video.muted) {
        addClass(this.video, 'muted');
      } else {
        removeClass(this.video, 'muted');
      }
      this.updateMuteUI();
    });
    
    // Direct click handlers for icons as fallback
    this.addDirectIconHandlers();
  }
  
  /**
   * Add direct click handlers to icons as a fallback
   */
  addDirectIconHandlers() {
    if (!this.playPauseBtn) return;
    
    const pauseIcon = this.playPauseBtn.querySelector(this.options.pauseIconSelector);
    const playIcon = this.playPauseBtn.querySelector(this.options.playIconSelector);
    
    if (pauseIcon) {
      addSafeEventListener(pauseIcon, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Pause icon clicked directly');
        this.video.pause();
        addClass(this.video, 'paused');
        this.updatePlayPauseUI();
      });
    }
    
    if (playIcon) {
      addSafeEventListener(playIcon, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Play icon clicked directly');
        this.video.play().catch(err => console.error('VideoPlayer: Error playing video:', err));
        removeClass(this.video, 'paused');
        this.updatePlayPauseUI();
      });
    }
    
    if (!this.muteBtn) return;
    
    const muteIcon = this.muteBtn.querySelector(this.options.muteIconSelector);
    const unmuteIcon = this.muteBtn.querySelector(this.options.unmuteIconSelector);
    
    if (muteIcon) {
      addSafeEventListener(muteIcon, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Mute icon clicked directly');
        this.video.muted = false;
        removeClass(this.video, 'muted');
        this.updateMuteUI();
      });
    }
    
    if (unmuteIcon) {
      addSafeEventListener(unmuteIcon, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('VideoPlayer: Unmute icon clicked directly');
        this.video.muted = true;
        addClass(this.video, 'muted');
        this.updateMuteUI();
      });
    }
  }
  
  /**
   * Toggle play/pause state
   */
  togglePlayPause() {
    console.log('VideoPlayer: Toggling play/pause, current paused state:', this.video.paused);
    
    if (this.video.paused) {
      // Try to play the video
      const playPromise = this.video.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('VideoPlayer: Video playback started successfully');
          removeClass(this.video, 'paused');
          this.updatePlayPauseUI();
        }).catch(error => {
          console.error("VideoPlayer: Play failed:", error);
          // Ensure UI shows correct state on failure
          addClass(this.video, 'paused');
          this.updatePlayPauseUI();
        });
      }
    } else {
      this.video.pause();
      console.log('VideoPlayer: Video paused');
      addClass(this.video, 'paused');
      this.updatePlayPauseUI();
    }
  }
  
  /**
   * Toggle mute/unmute state
   */
  toggleMute() {
    this.video.muted = !this.video.muted;
    console.log('VideoPlayer: Toggled mute state to:', this.video.muted);
    
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
    if (!this.playPauseBtn) return;
    
    const pauseIcon = this.playPauseBtn.querySelector(this.options.pauseIconSelector);
    const playIcon = this.playPauseBtn.querySelector(this.options.playIconSelector);
    
    if (pauseIcon && playIcon) {
      console.log('VideoPlayer: Updating play/pause UI, paused:', this.video.paused);
      
      pauseIcon.style.display = this.video.paused ? 'none' : 'block';
      playIcon.style.display = this.video.paused ? 'block' : 'none';
    } else {
      console.warn('VideoPlayer: Play/pause icons not found');
    }
  }
  
  /**
   * Update mute button UI
   */
  updateMuteUI() {
    if (!this.muteBtn) return;
    
    const unmuteIcon = this.muteBtn.querySelector(this.options.unmuteIconSelector);
    const muteIcon = this.muteBtn.querySelector(this.options.muteIconSelector);
    
    if (unmuteIcon && muteIcon) {
      console.log('VideoPlayer: Updating mute UI, muted:', this.video.muted);
      
      unmuteIcon.style.display = this.video.muted ? 'none' : 'block';
      muteIcon.style.display = this.video.muted ? 'block' : 'none';
    } else {
      console.warn('VideoPlayer: Mute icons not found');
    }
  }
}