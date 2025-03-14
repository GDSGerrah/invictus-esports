// Debugging version with extensive console logs
document.addEventListener('DOMContentLoaded', function() {
    console.log("==== DOM LOADED ====");
    console.log("Document readyState:", document.readyState);
    
    // Video player functionality
    const videoElement = document.getElementById('home-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    
    console.log("Video element found:", videoElement ? "YES" : "NO");
    console.log("Play/Pause button found:", playPauseBtn ? "YES" : "NO");
    console.log("Mute button found:", muteBtn ? "YES" : "NO");
    
    // Debug elements on page
    console.log("All video elements on page:", document.querySelectorAll('video'));
    console.log("All buttons on page:", document.querySelectorAll('button'));
    
    if (videoElement && playPauseBtn && muteBtn) {
        console.log("==== VIDEO PLAYER SETUP ====");
        console.log("Video attributes:", {
            src: videoElement.currentSrc || "not set",
            muted: videoElement.muted,
            paused: videoElement.paused,
            autoplay: videoElement.autoplay,
            loop: videoElement.loop
        });
        
        // Set initial states
        videoElement.muted = true;
        videoElement.classList.add('muted');
        
        if (videoElement.paused) {
            console.log("Video is initially paused");
            videoElement.classList.add('paused');
        } else {
            console.log("Video is initially playing");
        }
        
        // Debug button elements
        console.log("Play/Pause button children:", playPauseBtn.children);
        console.log("Mute button children:", muteBtn.children);
        
        // Debug CSS class state
        console.log("Video element classes:", videoElement.className);
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function(e) {
            console.log("==== PLAY/PAUSE CLICKED ====");
            console.log("Event object:", e);
            console.log("Current video paused state:", videoElement.paused);
            
            try {
                if (videoElement.paused) {
                    console.log("Attempting to play video");
                    const playPromise = videoElement.play();
                    
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log("Play successful");
                            videoElement.classList.remove('paused');
                            console.log("Removed 'paused' class, new classes:", videoElement.className);
                        }).catch(error => {
                            console.error("Play failed:", error);
                        });
                    }
                } else {
                    console.log("Attempting to pause video");
                    videoElement.pause();
                    videoElement.classList.add('paused');
                    console.log("Added 'paused' class, new classes:", videoElement.className);
                }
                
                console.log("Manual UI update for play/pause");
                const pauseIcon = playPauseBtn.querySelector('.pause-icon');
                const playIcon = playPauseBtn.querySelector('.play-icon');
                
                console.log("Pause icon element:", pauseIcon);
                console.log("Play icon element:", playIcon);
                
                if (videoElement.paused) {
                    if (pauseIcon) {
                        pauseIcon.style.display = 'none';
                        console.log("Set pause icon display to none");
                    }
                    if (playIcon) {
                        playIcon.style.display = 'block';
                        console.log("Set play icon display to block");
                    }
                } else {
                    if (pauseIcon) {
                        pauseIcon.style.display = 'block';
                        console.log("Set pause icon display to block");
                    }
                    if (playIcon) {
                        playIcon.style.display = 'none';
                        console.log("Set play icon display to none");
                    }
                }
            } catch (error) {
                console.error("Error in play/pause handler:", error);
            }
        });
        
        // Mute/Unmute functionality
        muteBtn.addEventListener('click', function(e) {
            console.log("==== MUTE/UNMUTE CLICKED ====");
            console.log("Event object:", e);
            console.log("Current video muted state:", videoElement.muted);
            
            try {
                if (videoElement.muted) {
                    console.log("Attempting to unmute video");
                    videoElement.muted = false;
                    videoElement.classList.remove('muted');
                    console.log("Removed 'muted' class, new classes:", videoElement.className);
                } else {
                    console.log("Attempting to mute video");
                    videoElement.muted = true;
                    videoElement.classList.add('muted');
                    console.log("Added 'muted' class, new classes:", videoElement.className);
                }
                
                console.log("Manual UI update for mute/unmute");
                const unmuteIcon = muteBtn.querySelector('.unmute-icon');
                const muteIcon = muteBtn.querySelector('.mute-icon');
                
                console.log("Unmute icon element:", unmuteIcon);
                console.log("Mute icon element:", muteIcon);
                
                if (videoElement.muted) {
                    if (unmuteIcon) {
                        unmuteIcon.style.display = 'none';
                        console.log("Set unmute icon display to none");
                    }
                    if (muteIcon) {
                        muteIcon.style.display = 'block';
                        console.log("Set mute icon display to block");
                    }
                } else {
                    if (unmuteIcon) {
                        unmuteIcon.style.display = 'block';
                        console.log("Set unmute icon display to block");
                    }
                    if (muteIcon) {
                        muteIcon.style.display = 'none';
                        console.log("Set mute icon display to none");
                    }
                }
            } catch (error) {
                console.error("Error in mute/unmute handler:", error);
            }
        });
        
        // Listen for video events to debug
        videoElement.addEventListener('play', () => {
            console.log("Video PLAY event fired");
        });
        
        videoElement.addEventListener('pause', () => {
            console.log("Video PAUSE event fired");
        });
        
        videoElement.addEventListener('volumechange', () => {
            console.log("Video VOLUMECHANGE event fired, muted:", videoElement.muted);
        });
    } else {
        console.error("==== MISSING REQUIRED ELEMENTS ====");
        if (!videoElement) console.error("Video element not found");
        if (!playPauseBtn) console.error("Play/Pause button not found");
        if (!muteBtn) console.error("Mute button not found");
        
        console.log("DOM Structure:", document.body.innerHTML);
    }
});