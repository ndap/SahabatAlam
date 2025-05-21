 document.addEventListener("DOMContentLoaded", function () {
        // Elements
        const fadeOverlay = document.getElementById("fadeOverlay");
        const backgroundImg = document.getElementById("backgroundImg");
        const contentImg = document.getElementById("contentImg");
        const loadingText = document.getElementById("loadingText");
        const instructions = document.getElementById("instructions");
        const audioControls = document.getElementById("audioControls");
        const volumeIndicator = document.getElementById("volumeIndicator");
        const trackInfo = document.getElementById("trackInfo");
        const audioPlayer = document.getElementById("audioPlayer");
        const volumeFill = document.getElementById("volumeFill");
        const volumeText = document.getElementById("volumeText");
        const progressBar = document.getElementById("progressBar");
        const progressContainer = document.getElementById("progressContainer");
        const trackTitle = document.getElementById("trackTitle");
        const trackNumber = document.getElementById("trackNumber");
        const timeDisplay = document.getElementById("timeDisplay");

        // Buttons
        const playBtn = document.getElementById("playBtn");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const repeatBtn = document.getElementById("repeatBtn");
        const shuffleBtn = document.getElementById("shuffleBtn");

        // State
        let backgroundLoaded = false;
        let contentLoaded = false;
        let isPlaying = false;
        let currentVolume = 0.7;
        let isRepeating = false;
        let isShuffling = false;
        let currentTrack = 0;
        let duration = 0;
        let currentTime = 0;

        // Sample audio tracks with demo URLs
        const audioTracks = [
          {
            title: "Introduce",
            src: "../assets/sounds/TNsound1.mp3",
            artist: "Keira",
          },
          {
            title: "Ready For Adventure",
            src: "../assets/sounds/TNsound2.mp3",
            artist: "Keira",
          },
          {
            title: "Exploring nature",
            src: "../assets/sounds/TNsound3.mp3",
            artist: "Keira",
          },
          {
            title: "So much many trash in the forest",
            src: "../assets/sounds/TNsound4.mp3",
            artist: "Keira",
          },
          {
            title: "Help Keira Grabbing trash",
            src: "../assets/sounds/TNsound5.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "The forest is clean",
            src: "../assets/sounds/TNsound7.mp3",
            artist: "Keira",
          },
          {
            title: "The Sound of the Waves and introduce to ocean",
            src: "../assets/sounds/TNsound8.mp3",
            artist: "Keira",
          },
          {
            title: "Mistake in the ocean",
            src: "../assets/sounds/TNsound9.mp3",
            artist: "Keira",
          },
          {
            title: "Help The Turtle",
            src: "../assets/sounds/TNsound10.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Grabbing trash",
            src: "../assets/sounds/TNsound6.mp3",
            artist: "Keira",
          },
          {
            title: "Greetings to player",
            src: "../assets/sounds/TNsound11.mp3",
            artist: "Keira",
          },
          {
            title: "The End",
            src: "../assets/sounds/TNsound12.mp3",
            artist: "Keira",
          },
        ];

        // Initialize fade-out animation
        setTimeout(() => {
          fadeOverlay.classList.add("fade-out");
        }, 500);

        // Remove overlay after animation
        setTimeout(() => {
          fadeOverlay.remove();
        }, 2000);

        // Initialize
        audioPlayer.volume = currentVolume;
        updateVolumeDisplay();
        updateTrackInfo();

        // Function to check if both images are loaded
        function checkAllLoaded() {
          if (backgroundLoaded && contentLoaded) {
            loadingText.style.display = "none";
            contentImg.classList.remove("loading-hidden");
            contentImg.classList.add("loaded");

            // Show UI after loading
            setTimeout(() => {
              instructions.classList.add("show");
              audioControls.classList.add("show");
            }, 1000);

            // Hide instructions after 5 seconds
            setTimeout(() => {
              instructions.classList.remove("show");
            }, 6000);
          }
        }

        // Image loading events
        backgroundImg.addEventListener("load", function () {
          backgroundLoaded = true;
          checkAllLoaded();
        });

        contentImg.addEventListener("load", function () {
          contentLoaded = true;
          checkAllLoaded();
        });

        // Error handling for images
        backgroundImg.addEventListener("error", function () {
          console.log("Background image failed to load, using fallback");
          backgroundLoaded = true;
          checkAllLoaded();
        });

        contentImg.addEventListener("error", function () {
          console.log("Content image failed to load, using fallback");
          contentLoaded = true;
          checkAllLoaded();
        });

        // Audio player functions
        function playPause() {
          try {
            if (isPlaying) {
              audioPlayer.pause();
              playBtn.textContent = "Play";
              playBtn.classList.remove("active");
              contentImg.classList.remove("focused");
            } else {
              if (
                audioTracks.length > 0 &&
                (!audioPlayer.src || audioPlayer.src === "")
              ) {
                loadTrack(currentTrack);
              }
              const playPromise = audioPlayer.play();

              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    playBtn.textContent = "Pause";
                    playBtn.classList.add("active");
                    contentImg.classList.add("focused");
                    showTrackInfo();
                  })
                  .catch((error) => {
                    console.log("Playback failed:", error);
                    announceToScreenReader("Audio gagal diputar");
                  });
              }
            }
            isPlaying = !isPlaying;

            // Announce to screen readers
            announceToScreenReader(
              isPlaying ? "Audio dimulai" : "Audio dijeda"
            );
          } catch (error) {
            console.error("Error in playPause:", error);
            announceToScreenReader("Terjadi kesalahan audio");
          }
        }

        function previousTrack() {
          if (audioTracks.length === 0) return;

          if (isShuffling) {
            currentTrack = Math.floor(Math.random() * audioTracks.length);
          } else {
            currentTrack =
              (currentTrack - 1 + audioTracks.length) % audioTracks.length;
          }

          loadTrack(currentTrack);
          if (isPlaying) {
            audioPlayer.play();
          }
          announceToScreenReader(
            `Pindah ke ${audioTracks[currentTrack].title}`
          );
          showTrackInfo();
        }

        function nextTrack() {
          if (audioTracks.length === 0) return;

          if (isShuffling) {
            currentTrack = Math.floor(Math.random() * audioTracks.length);
          } else {
            currentTrack = (currentTrack + 1) % audioTracks.length;
          }

          loadTrack(currentTrack);
          if (isPlaying) {
            audioPlayer.play();
          }
          announceToScreenReader(
            `Pindah ke ${audioTracks[currentTrack].title}`
          );
          showTrackInfo();
        }

        function toggleRepeat() {
          isRepeating = !isRepeating;
          audioPlayer.loop = isRepeating;
          repeatBtn.classList.toggle("active", isRepeating);
          announceToScreenReader(
            isRepeating ? "Repeat aktif" : "Repeat nonaktif"
          );
        }

        function toggleShuffle() {
          isShuffling = !isShuffling;
          shuffleBtn.classList.toggle("active", isShuffling);
          announceToScreenReader(
            isShuffling ? "Shuffle aktif" : "Shuffle nonaktif"
          );
        }

        function loadTrack(index) {
          if (audioTracks[index]) {
            audioPlayer.src = audioTracks[index].src;
            audioPlayer.load();
            updateTrackInfo();
          }
        }

        function updateVolumeDisplay() {
          const percentage = Math.round(currentVolume * 100);
          volumeFill.style.width = percentage + "%";
          volumeText.textContent = percentage + "%";
        }

        function updateTrackInfo() {
          if (audioTracks[currentTrack]) {
            trackTitle.textContent = audioTracks[currentTrack].title;
            trackNumber.textContent = `${currentTrack + 1} / ${
              audioTracks.length
            }`;
          } else {
            trackTitle.textContent = "No Track Selected";
            trackNumber.textContent = "0 / 0";
          }
        }

        function updateProgressBar() {
          if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = progress + "%";

            const currentMinutes = Math.floor(currentTime / 60);
            const currentSeconds = Math.floor(currentTime % 60);
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = Math.floor(duration % 60);

            timeDisplay.textContent = `${currentMinutes}:${currentSeconds
              .toString()
              .padStart(2, "0")} / ${durationMinutes}:${durationSeconds
              .toString()
              .padStart(2, "0")}`;
          }
        }

        function showVolumeIndicator() {
          volumeIndicator.classList.add("show");
          setTimeout(() => {
            volumeIndicator.classList.remove("show");
          }, 2000);
        }

        function showTrackInfo() {
          trackInfo.classList.add("show");
          setTimeout(() => {
            trackInfo.classList.remove("show");
          }, 3000);
        }

        function announceToScreenReader(message) {
          const announcement = document.createElement("div");
          announcement.setAttribute("aria-live", "polite");
          announcement.setAttribute("aria-atomic", "true");
          announcement.className = "sr-only";
          announcement.textContent = message;
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }

        // Event listeners
        playBtn.addEventListener("click", playPause);
        prevBtn.addEventListener("click", previousTrack);
        nextBtn.addEventListener("click", nextTrack);
        repeatBtn.addEventListener("click", toggleRepeat);
        shuffleBtn.addEventListener("click", toggleShuffle);

        // Progress bar click to seek
        progressContainer.addEventListener("click", function (e) {
          if (duration > 0) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const newTime = percentage * duration;

            audioPlayer.currentTime = newTime;
            announceToScreenReader(
              `Pindah ke ${Math.floor(newTime / 60)}:${Math.floor(newTime % 60)
                .toString()
                .padStart(2, "0")}`
            );
          }
        });

        // Keyboard controls
        document.addEventListener("keydown", function (event) {
          // Prevent default only for our handled keys
          const handledKeys = [
            " ",
            "Spacebar",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "r",
            "R",
            "s",
            "S",
            "Escape",
          ];
          if (handledKeys.includes(event.key)) {
            event.preventDefault();
          }

          switch (event.key) {
            case " ":
            case "Spacebar":
              playPause();
              break;
            case "ArrowLeft":
              previousTrack();
              break;
            case "ArrowRight":
              nextTrack();
              break;
            case "ArrowUp":
              currentVolume = Math.min(1, currentVolume + 0.1);
              audioPlayer.volume = currentVolume;
              updateVolumeDisplay();
              showVolumeIndicator();
              break;
            case "ArrowDown":
              currentVolume = Math.max(0, currentVolume - 0.1);
              audioPlayer.volume = currentVolume;
              updateVolumeDisplay();
              showVolumeIndicator();
              break;
            case "r":
            case "R":
              toggleRepeat();
              break;
            case "s":
            case "S":
              toggleShuffle();
              break;
            case "Escape":
              instructions.classList.toggle("show");
              break;
          }
        });

        // Audio player events
        audioPlayer.addEventListener("loadedmetadata", function () {
          duration = audioPlayer.duration;
          updateProgressBar();
        });

        audioPlayer.addEventListener("timeupdate", function () {
          currentTime = audioPlayer.currentTime;
          updateProgressBar();
        });

        audioPlayer.addEventListener("ended", function () {
          if (!isRepeating) {
            if (currentTrack === audioTracks.length - 1) {
              // Jika sudah di track terakhir, redirect ke halaman berikutnya
              window.location.href = "../index.html"; // Ganti dengan URL tujuan Anda
            } else {
              nextTrack();
            }
          }
        });

        audioPlayer.addEventListener("play", function () {
          isPlaying = true;
          playBtn.textContent = "Pause";
          playBtn.classList.add("active");
          contentImg.classList.add("focused");
        });

        audioPlayer.addEventListener("pause", function () {
          isPlaying = false;
          playBtn.textContent = "Play";
          playBtn.classList.remove("active");
          contentImg.classList.remove("focused");
        });

        audioPlayer.addEventListener("error", function (e) {
          console.error("Audio error:", e);
          announceToScreenReader("Terjadi kesalahan saat memuat audio");
          isPlaying = false;
          playBtn.textContent = "Play";
          playBtn.classList.remove("active");
        });

        // Focus management
        contentImg.addEventListener("focus", function () {
          announceToScreenReader(
            "Interface audio. Tekan spasi untuk play/pause."
          );
        });

        // Mouse interaction
        contentImg.addEventListener("click", playPause);

        // Window events
        window.addEventListener("resize", function () {
          // Handle responsive adjustments if needed
        });

        // Initialize first track
        if (audioTracks.length > 0) {
          loadTrack(0);
        }

        // Also trigger checkAllLoaded in case images are already cached
        setTimeout(checkAllLoaded, 100);
      });