/**
 * Content Carousel Component
 * Handles the content carousel functionality for the homepage
 */

export default class ContentCarousel {
    /**
     * Initialize content carousel
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Default selectors and values
        this.options = {
            sectionSelector: '.content-carousel-section',
            wrapSelector: '.carousel-wrap',
            trackSelector: '.carousel-track',
            cardSelector: '.video-card',
            prevArrowSelector: '.prev-arrow',
            nextArrowSelector: '.next-arrow',
            visibleCardsMobile: 1,
            visibleCardsTablet: 2,
            visibleCardsDesktop: 3,
            ...options
        };
        
        // Find elements
        this.section = document.querySelector(this.options.sectionSelector);
        
        // Only proceed if we found a content carousel section
        if (!this.section) {
            console.log('ContentCarousel: No carousel section found');
            return;
        }
        
        // Get main elements
        this.track = this.section.querySelector(this.options.trackSelector);
        this.wrap = this.section.querySelector(this.options.wrapSelector);
        this.prevButton = this.section.querySelector(this.options.prevArrowSelector);
        this.nextButton = this.section.querySelector(this.options.nextArrowSelector);
        this.cards = Array.from(this.section.querySelectorAll(this.options.cardSelector));
        
        // Early return if missing essential elements
        if (!this.track || !this.wrap || this.cards.length === 0) {
            console.log('ContentCarousel: Missing essential elements', {
                track: this.track,
                wrap: this.wrap,
                cardsCount: this.cards?.length
            });
            return;
        }
        
        // State
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.visibleCards = this.calculateVisibleCards();
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the carousel
     */
    init() {
        console.log(`ContentCarousel: Initializing with ${this.cards.length} cards`);
        
        // Set initial layout
        this.updateLayout();
        
        // Add button event listeners
        this.setupButtonListeners();
        
        // Add resize listener
        window.addEventListener('resize', this.debounce(() => {
            const oldVisibleCards = this.visibleCards;
            this.visibleCards = this.calculateVisibleCards();
            
            // Only update layout if visible cards changed
            if (oldVisibleCards !== this.visibleCards) {
                console.log(`ContentCarousel: Visible cards changed from ${oldVisibleCards} to ${this.visibleCards}`);
                this.updateLayout();
                
                // Adjust index if needed
                const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
                if (this.currentIndex > maxIndex) {
                    this.currentIndex = maxIndex;
                    this.updatePosition();
                }
            }
        }, 200));
    }
    
    /**
     * Set up button event listeners
     */
    setupButtonListeners() {
        // Previous button
        if (this.prevButton) {
            // Clean up existing listeners by cloning
            const newPrevButton = this.prevButton.cloneNode(true);
            this.prevButton.parentNode.replaceChild(newPrevButton, this.prevButton);
            this.prevButton = newPrevButton;
            
            // Add new listener
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(-1);
            });
        }
        
        // Next button
        if (this.nextButton) {
            // Clean up existing listeners by cloning
            const newNextButton = this.nextButton.cloneNode(true);
            this.nextButton.parentNode.replaceChild(newNextButton, this.nextButton);
            this.nextButton = newNextButton;
            
            // Add new listener
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(1);
            });
        }
    }
    
    /**
     * Calculate how many cards should be visible
     */
    calculateVisibleCards() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth >= 1400) {
            return this.options.visibleCardsDesktop;
        } else if (windowWidth >= 992) {
            return this.options.visibleCardsTablet;
        } else {
            return this.options.visibleCardsMobile;
        }
    }
    
    /**
     * Update the carousel layout based on screen size
     */
    updateLayout() {
        // Skip if elements don't exist
        if (!this.track || !this.wrap || this.cards.length === 0) return;
        
        const windowWidth = window.innerWidth;
        
        // Card width calculation
        let cardWidth = 754; // Default for desktop
        if (windowWidth < 1600 && windowWidth >= 992) {
            cardWidth = 700;
        } else if (windowWidth < 992) {
            // For mobile, card width is container width
            cardWidth = this.wrap.offsetWidth;
        }
        
        // Get gap between cards
        const computedStyle = window.getComputedStyle(this.track);
        const gap = parseInt(computedStyle.gap) || 35;
        
        // Set proper track width
        if (windowWidth >= 992) {
            // Calculate total width based on all cards
            const totalWidth = (this.cards.length * cardWidth) + ((this.cards.length - 1) * gap);
            this.track.style.width = `${totalWidth}px`;
            
            // Ensure all cards have proper positioning
            this.cards.forEach((card, index) => {
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.transform = 'none';
                
                // Make sure card width is set correctly
                card.style.width = `${cardWidth}px`;
            });
        } else {
            // For mobile view
            this.track.style.width = '100%';
            this.cards.forEach(card => {
                card.style.width = '100%';
            });
        }
        
        // Update position and button states
        this.updatePosition();
    }
    
    /**
     * Navigate the carousel
     * @param {number} direction - Direction to navigate (1 for next, -1 for previous)
     */
    navigate(direction) {
        if (this.isTransitioning) return;
        
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        const newIndex = Math.min(Math.max(0, this.currentIndex + direction), maxIndex);
        
        if (newIndex !== this.currentIndex) {
            console.log(`ContentCarousel: Moving from index ${this.currentIndex} to ${newIndex}`);
            this.currentIndex = newIndex;
            this.updatePosition();
        }
    }
    
    /**
     * Update the carousel position
     */
    updatePosition() {
        if (!this.track || this.cards.length === 0) return;
        
        this.isTransitioning = true;
        
        // Get card width and gap
        const cardWidth = this.cards[0].offsetWidth;
        const computedStyle = window.getComputedStyle(this.track);
        const gap = parseInt(computedStyle.gap) || 35;
        
        // Calculate translation
        const translateX = -this.currentIndex * (cardWidth + gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.updateButtonStates();
        
        // Reset transitioning state after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    /**
     * Update button states based on current index
     */
    updateButtonStates() {
        const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
        
        if (this.prevButton) {
            const isAtStart = this.currentIndex <= 0;
            this.prevButton.disabled = isAtStart;
            this.prevButton.style.opacity = isAtStart ? '0.5' : '1';
            this.prevButton.style.pointerEvents = isAtStart ? 'none' : 'auto';
        }
        
        if (this.nextButton) {
            const isAtEnd = this.currentIndex >= maxIndex;
            this.nextButton.disabled = isAtEnd;
            this.nextButton.style.opacity = isAtEnd ? '0.5' : '1';
            this.nextButton.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }
    }
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    debounce(func, wait = 100) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}