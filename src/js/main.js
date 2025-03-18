document.addEventListener('DOMContentLoaded', function() {
    // Video player functionality
    const videoElement = document.getElementById('home-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    
    if (videoElement && playPauseBtn && muteBtn) {
        // Set initial states
        videoElement.muted = true;
        videoElement.classList.add('muted');
        
        if (videoElement.paused) {
            videoElement.classList.add('paused');
        }
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function() {
            if (videoElement.paused) {
                const playPromise = videoElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        videoElement.classList.remove('paused');
                    }).catch(error => {
                        console.error("Play failed:", error);
                    });
                }
            } else {
                videoElement.pause();
                videoElement.classList.add('paused');
            }
            
            // Manual UI update for play/pause
            const pauseIcon = playPauseBtn.querySelector('.pause-icon');
            const playIcon = playPauseBtn.querySelector('.play-icon');
            
            if (videoElement.paused) {
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (playIcon) playIcon.style.display = 'block';
            } else {
                if (pauseIcon) pauseIcon.style.display = 'block';
                if (playIcon) playIcon.style.display = 'none';
            }
        });
        
        // Mute/Unmute functionality
        muteBtn.addEventListener('click', function() {
            if (videoElement.muted) {
                videoElement.muted = false;
                videoElement.classList.remove('muted');
            } else {
                videoElement.muted = true;
                videoElement.classList.add('muted');
            }
            
            // Manual UI update for mute/unmute
            const unmuteIcon = muteBtn.querySelector('.unmute-icon');
            const muteIcon = muteBtn.querySelector('.mute-icon');
            
            if (videoElement.muted) {
                if (unmuteIcon) unmuteIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            } else {
                if (unmuteIcon) unmuteIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        });
    }
    
    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.video-card'));
    const nextButton = document.querySelector('.next-arrow');
    const prevButton = document.querySelector('.prev-arrow');
    
    if (track && cards.length && nextButton && prevButton) {
        // Set initial values
        let currentIndex = 0;
        
        // Calculate visible cards based on screen width
        const calculateVisibleCards = () => {
            const viewportWidth = window.innerWidth;
            if (viewportWidth >= 1200) {
                return 3; // Show 3 cards on large screens
            } else if (viewportWidth >= 768) {
                return 2; // Show 2 cards on medium screens
            } else {
                return 1; // Show 1 card on small screens
            }
        };
        
        let visibleCards = calculateVisibleCards();
        
        // Calculate the maximum index
        const updateMaxIndex = () => {
            return Math.max(0, cards.length - visibleCards);
        };
        
        let maxIndex = updateMaxIndex();
        
        // Function to update carousel position
        function updateCarouselPosition() {
            // Calculate card width and gap
            const cardWidth = cards[0].offsetWidth;
            const gapWidth = 35; // This should match the gap in CSS
            const slideAmount = cardWidth + gapWidth;
            
            // Apply transform
            const offset = -currentIndex * slideAmount;
            track.style.transform = `translateX(${offset}px)`;
            
            // Update button states
            prevButton.disabled = currentIndex <= 0;
            prevButton.style.opacity = currentIndex <= 0 ? "0.5" : "1";
            
            nextButton.disabled = currentIndex >= maxIndex;
            nextButton.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
        }
        
        // Initialize carousel
        updateCarouselPosition();
        
        // Event listeners for buttons
        nextButton.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarouselPosition();
            }
        });
        
        prevButton.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselPosition();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Recalculate visible cards
            visibleCards = calculateVisibleCards();
            const newMaxIndex = updateMaxIndex();
            
            // Make sure current index is valid
            if (currentIndex > newMaxIndex) {
                currentIndex = newMaxIndex;
            }
            
            maxIndex = newMaxIndex;
            
            // Update carousel
            updateCarouselPosition();
        });
        
        // Add touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - go to next card
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarouselPosition();
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - go to previous card
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarouselPosition();
                }
            }
        }
    }
    
    // Fixed dynamic navbar with logo switching
    const navbar = document.querySelector('.navbar-main');
    const videoSection = document.querySelector('.video-player-background');
    const logoWhite = document.querySelector('.logo-white');
    const logoDark = document.querySelector('.logo-dark');
    
    let scrollThreshold;
    
    // Calculate the threshold point where navbar should change
    function calculateThreshold() {
        if (videoSection) {
            // The threshold is the bottom of the video section minus navbar height
            return videoSection.offsetHeight - 100; // Adjusted threshold
        }
        return 300; // Default threshold if video section isn't found
    }
    
    // Set initial threshold
    scrollThreshold = calculateThreshold();
    
    // Recalculate threshold on window resize
    window.addEventListener('resize', function() {
        scrollThreshold = calculateThreshold();
    });
    
    // Function to check scroll position and update navbar
    function checkScrollPosition() {
        if (window.scrollY >= scrollThreshold) {
            // We've scrolled past the video section - change navbar to white
            navbar.classList.add('scrolled');
            
            // Explicitly handle logo visibility
            if (logoWhite && logoDark) {
                logoWhite.style.display = 'none';
                logoDark.style.display = 'block';
            }
        } else {
            // We're still in the video section - keep navbar transparent
            navbar.classList.remove('scrolled');
            
            // Explicitly handle logo visibility
            if (logoWhite && logoDark) {
                logoWhite.style.display = 'block';
                logoDark.style.display = 'none';
            }
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', checkScrollPosition);
    
    // Check position on initial page load
    checkScrollPosition();
    
    // Force a resize event to calculate proper thresholds on load
    window.dispatchEvent(new Event('resize'));
});