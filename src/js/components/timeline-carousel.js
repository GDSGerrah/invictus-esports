/**
 * Timeline Carousel Component
 * Handles timeline carousel functionality with year tabs
 */

export default class TimelineCarousel {
    /**
     * Initialize timeline carousel
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Default selectors and values
        this.options = {
            sectionSelector: '.history-section',
            navSelector: '.timeline-nav',
            yearBtnSelector: '.timeline-year',
            carouselSelector: '.timeline-carousel',
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
        
        // Find main section
        this.section = document.querySelector(this.options.sectionSelector);
        
        // Only proceed if section is found
        if (!this.section) {
            console.log('TimelineCarousel: No history section found');
            return;
        }
        
        // Get year navigation elements
        this.nav = this.section.querySelector(this.options.navSelector);
        this.yearButtons = Array.from(this.section.querySelectorAll(this.options.yearBtnSelector));
        this.carousels = Array.from(this.section.querySelectorAll(this.options.carouselSelector));
        
        // Early return if missing essential elements
        if (!this.nav || this.yearButtons.length === 0 || this.carousels.length === 0) {
            console.log('TimelineCarousel: Missing essential elements', {
                nav: this.nav,
                yearButtonsCount: this.yearButtons?.length,
                carouselsCount: this.carousels?.length
            });
            return;
        }
        
        // State
        this.years = {};
        this.currentYear = this.getInitialYear();
        this.visibleCards = this.calculateVisibleCards();
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the timeline carousel
     */
    init() {
        console.log(`TimelineCarousel: Initializing with ${this.carousels.length} year sections`);
        
        // Set up each year's carousel
        this.carousels.forEach(carousel => {
            const year = carousel.getAttribute('data-year');
            const wrap = carousel.querySelector(this.options.wrapSelector);
            const track = carousel.querySelector(this.options.trackSelector);
            const cards = Array.from(carousel.querySelectorAll(this.options.cardSelector));
            const prevButton = carousel.querySelector(this.options.prevArrowSelector);
            const nextButton = carousel.querySelector(this.options.nextArrowSelector);
            
            if (track && cards.length > 0) {
                console.log(`TimelineCarousel: Setting up carousel for year ${year} with ${cards.length} cards`);
                
                // Store year data
                this.years[year] = {
                    element: carousel,
                    wrap: wrap,
                    track: track,
                    cards: cards,
                    prevButton: prevButton,
                    nextButton: nextButton,
                    currentIndex: 0,
                    isTransitioning: false
                };
                
                // Set up button listeners
                this.setupButtonListeners(year);
            }
        });
        
        // Set up year button listeners
        this.yearButtons.forEach(button => {
            button.addEventListener('click', () => {
                const year = button.getAttribute('data-year');
                this.setActiveYear(year);
            });
        });
        
        // Set initial layout
        this.updateAllCarousels();
        
        // Set initial active year
        this.setActiveYear(this.currentYear);
        
        // Add resize listener
        window.addEventListener('resize', this.debounce(() => {
            const oldVisibleCards = this.visibleCards;
            this.visibleCards = this.calculateVisibleCards();
            
            // Only update if visible cards changed
            if (oldVisibleCards !== this.visibleCards) {
                console.log(`TimelineCarousel: Visible cards changed from ${oldVisibleCards} to ${this.visibleCards}`);
                this.updateAllCarousels();
            }
        }, 200));
    }
    
    /**
     * Get the initial active year
     */
    getInitialYear() {
        const activeYearButton = this.yearButtons.find(btn => btn.classList.contains('active'));
        return activeYearButton ? activeYearButton.getAttribute('data-year') : this.yearButtons[0]?.getAttribute('data-year');
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
     * Set active year and show corresponding carousel
     * @param {string} year - Year to activate
     */
    setActiveYear(year) {
        if (!this.years[year]) {
            console.warn(`TimelineCarousel: No carousel data for year ${year}`);
            return;
        }
        
        console.log(`TimelineCarousel: Setting active year to ${year}`);
        
        // Update year buttons
        this.yearButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-year') === year);
        });
        
        // Show/hide carousels
        this.carousels.forEach(carousel => {
            carousel.style.display = carousel.getAttribute('data-year') === year ? 'block' : 'none';
        });
        
        // Update current year
        this.currentYear = year;
        
        // Reset index position for this year's carousel
        const yearData = this.years[year];
        yearData.currentIndex = 0;
        
        // Update carousel
        this.updateYearCarousel(year);
        
        // Fix any background issues
        this.fixBackgroundIssues();
    }
    
    /**
     * Set up button listeners for a specific year
     * @param {string} year - Year to set up
     */
    setupButtonListeners(year) {
        const yearData = this.years[year];
        if (!yearData) return;
        
        // Previous button
        if (yearData.prevButton) {
            // Clean up existing listeners
            const newPrevButton = yearData.prevButton.cloneNode(true);
            yearData.prevButton.parentNode.replaceChild(newPrevButton, yearData.prevButton);
            yearData.prevButton = newPrevButton;
            
            // Add new listener
            yearData.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(year, -1);
            });
        }
        
        // Next button
        if (yearData.nextButton) {
            // Clean up existing listeners
            const newNextButton = yearData.nextButton.cloneNode(true);
            yearData.nextButton.parentNode.replaceChild(newNextButton, yearData.nextButton);
            yearData.nextButton = newNextButton;
            
            // Add new listener
            yearData.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(year, 1);
            });
        }
    }
    
    /**
     * Navigate a specific year's carousel
     * @param {string} year - Year to navigate
     * @param {number} direction - Direction (1 for next, -1 for previous)
     */
    navigate(year, direction) {
        const yearData = this.years[year];
        if (!yearData || yearData.isTransitioning) return;
        
        const maxIndex = Math.max(0, yearData.cards.length - this.visibleCards);
        const newIndex = Math.min(Math.max(0, yearData.currentIndex + direction), maxIndex);
        
        if (newIndex !== yearData.currentIndex) {
            console.log(`TimelineCarousel: Year ${year} - Moving from index ${yearData.currentIndex} to ${newIndex}`);
            yearData.currentIndex = newIndex;
            this.updateYearCarousel(year);
        }
    }
    
    /**
     * Update all carousels' layouts
     */
    updateAllCarousels() {
        Object.keys(this.years).forEach(year => {
            this.updateCarouselLayout(year);
            this.updateYearCarousel(year);
        });
    }
    
    /**
     * Update a specific year's carousel layout
     * @param {string} year - Year to update
     */
    updateCarouselLayout(year) {
        const yearData = this.years[year];
        if (!yearData || !yearData.track || yearData.cards.length === 0) return;
        
        const windowWidth = window.innerWidth;
        
        // Card width calculation
        let cardWidth = 754; // Default for desktop
        if (windowWidth < 1600 && windowWidth >= 992) {
            cardWidth = 700;
        } else if (windowWidth < 992) {
            // For mobile, use container width
            cardWidth = yearData.wrap ? yearData.wrap.offsetWidth : this.section.offsetWidth - 40;
        }
        
        // Get gap between cards
        const computedStyle = window.getComputedStyle(yearData.track);
        const gap = parseInt(computedStyle.gap) || 35;
        
        // Adjust carousel layout based on screen size
        if (windowWidth >= 992) {
            // Calculate total width for all cards
            const totalWidth = (yearData.cards.length * cardWidth) + ((yearData.cards.length - 1) * gap);
            yearData.track.style.width = `${totalWidth}px`;
            
            // Make sure cards have proper styling
            yearData.cards.forEach((card, index) => {
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.transform = 'none';
                card.style.width = `${cardWidth}px`;
            });
        } else {
            // For mobile
            yearData.track.style.width = '100%';
            yearData.cards.forEach(card => {
                card.style.width = '100%';
            });
        }
        
        // Make sure max index is valid
        const maxIndex = Math.max(0, yearData.cards.length - this.visibleCards);
        if (yearData.currentIndex > maxIndex) {
            yearData.currentIndex = maxIndex;
        }
    }
    
    /**
     * Update a specific year's carousel position
     * @param {string} year - Year to update
     */
    updateYearCarousel(year) {
        const yearData = this.years[year];
        if (!yearData || !yearData.track || yearData.cards.length === 0) return;
        
        yearData.isTransitioning = true;
        
        // Calculate transform
        const cardWidth = yearData.cards[0].offsetWidth;
        const computedStyle = window.getComputedStyle(yearData.track);
        const gap = parseInt(computedStyle.gap) || 35;
        const translateX = -yearData.currentIndex * (cardWidth + gap);
        
        // Apply transform
        yearData.track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.updateButtonStates(year);
        
        // Reset transitioning state after animation
        setTimeout(() => {
            yearData.isTransitioning = false;
        }, 500);
    }
    
    /**
     * Update button states for a specific year
     * @param {string} year - Year to update
     */
    updateButtonStates(year) {
        const yearData = this.years[year];
        if (!yearData) return;
        
        const maxIndex = Math.max(0, yearData.cards.length - this.visibleCards);
        
        // Previous button
        if (yearData.prevButton) {
            const isAtStart = yearData.currentIndex <= 0;
            yearData.prevButton.disabled = isAtStart;
            yearData.prevButton.style.opacity = isAtStart ? '0.5' : '1';
            yearData.prevButton.style.pointerEvents = isAtStart ? 'none' : 'auto';
        }
        
        // Next button
        if (yearData.nextButton) {
            const isAtEnd = yearData.currentIndex >= maxIndex;
            yearData.nextButton.disabled = isAtEnd;
            yearData.nextButton.style.opacity = isAtEnd ? '0.5' : '1';
            yearData.nextButton.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }
    }
    
    /**
     * Fix background issues when switching between years
     */
    fixBackgroundIssues() {
        if (!this.section) return;
        
        // Ensure section has proper background color
        this.section.style.backgroundColor = 'var(--color-gray-darkest)';
        
        // Ensure proper z-index for stacking context
        this.section.style.zIndex = '1';
        
        // Fix current year's carousel
        const yearData = this.years[this.currentYear];
        if (yearData) {
            // Set background colors
            if (yearData.track) {
                yearData.track.style.backgroundColor = 'var(--color-gray-darkest)';
                yearData.track.style.zIndex = '1';
                yearData.track.style.position = 'relative';
            }
            
            if (yearData.wrap) {
                yearData.wrap.style.backgroundColor = 'var(--color-gray-darkest)';
                yearData.wrap.style.zIndex = '1';
                yearData.wrap.style.position = 'relative';
            }
            
            // Fix card positioning
            yearData.cards.forEach(card => {
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.transform = 'none';
            });
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