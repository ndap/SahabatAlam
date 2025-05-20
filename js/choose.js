// Tambahkan variabel untuk background music
      const backgroundMusic = new Audio("../assets/sounds/BackSoundChoose.mp3"); // Sesuaikan path dengan file audio yang tersedia
      const chooseSound = new Audio("../assets/sounds/ChooseKriteria.mp3");
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.2; // Volume default 30%
      chooseSound.volume = 0.8; // Volume default 50%

      document.addEventListener("DOMContentLoaded", function () {
        // Ambil elemen overlay intro
        const introOverlay = document.getElementById("intro-overlay");
        const gameContainer = document.querySelector(".game-container");

        // Sembunyikan game container sampai intro selesai
        gameContainer.style.opacity = "0";

        // Tambahkan event listener untuk klik pada overlay
        introOverlay.addEventListener("click", function (e) {
          // Buat efek klik visual
          const clickEffect = document.createElement("div");
          clickEffect.className = "click-effect";
          clickEffect.style.left = e.clientX + "px";
          clickEffect.style.top = e.clientY + "px";
          clickEffect.style.animation = "click-wave 1s forwards";
          document.body.appendChild(clickEffect);

          // Mulai memainkan musik latar
          if (audioEnabled) {
            backgroundMusic
              .play()
              .catch((error) =>
                console.log("Autoplay diblokir oleh browser:", error)
              );
            chooseSound
              .play()
              .catch((error) =>
                console.log("Autoplay diblokir oleh browser:", error)
              );
          }

          // Fade out overlay intro
          introOverlay.style.opacity = "0";

          // Setelah animasi fade out selesai, hapus overlay dan tampilkan game container
          setTimeout(() => {
            introOverlay.style.display = "none";
            // Mulai animasi fade in untuk game container
            gameContainer.style.opacity = "1";

            // Jalankan efek partikel selamat datang setelah intro selesai
            setTimeout(() => {
              // Welcome particles
              for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                  createParticleBurst(
                    window.innerWidth * Math.random(),
                    window.innerHeight * Math.random(),
                    ["#ffea00", "#ff9900", "#ff6600", "#ffffff"][
                      Math.floor(Math.random() * 4)
                    ],
                    20
                  );
                }, i * 400);
              }
              playSound("welcome");
            }, 500);
          }, 1500);

          // Hapus efek click setelah animasi selesai
          setTimeout(() => {
            if (document.body.contains(clickEffect)) {
              document.body.removeChild(clickEffect);
            }
          }, 1000);
        });

        // Tambahkan efek highlight ke overlay saat mouse bergerak
        introOverlay.addEventListener("mousemove", function (e) {
          if (Math.random() < 0.1) {
            // Hanya buat partikel sesekali
            createParticle(e.pageX, e.pageY, "#ffea00");
          }
        });

        // Update fungsi toggle audio untuk juga mengontrol background music
        audioToggle.addEventListener("click", function () {
          audioEnabled = !audioEnabled;
          audioIcon.style.opacity = audioEnabled ? 1 : 0.5;
          playSound("click");

          // Kontrol background music
          if (audioEnabled) {
            backgroundMusic.play();
          } else {
            backgroundMusic.pause();
          }

          // Kontrol explanation audio
          if (!audioEnabled && currentExplanationAudio) {
            currentExplanationAudio.pause();
            currentExplanationAudio.currentTime = 0;
            currentExplanationAudio = null;
          }
        });
      });

      document.addEventListener("DOMContentLoaded", function () {
        // Start with opacity 0 (set in CSS)
        setTimeout(() => {
          document.body.style.opacity = "1"; // Fade in
        }, 100); // Slight delay to ensure transition works
      });

      // DOM Elements
      const tunarunguPanel = document.getElementById("tunarungu-panel");
      const tunanetraPanel = document.getElementById("tunanetra-panel");
      const startButton = document.getElementById("start-button");
      const tunarunguHighlight = document.getElementById("tunarungu-highlight");
      const tunanetraHighlight = document.getElementById("tunanetra-highlight");
      const particlesContainer = document.getElementById("particles-container");
      const audioToggle = document.getElementById("audio-toggle");
      const audioIcon = document.getElementById("audio-icon");

      // Game state
      let selectedCharacter = null;
      let audioEnabled = true;
      let isNavigating = false; // Flag to prevent multiple navigations

      // Tambahkan di bagian awal script atau deklarasi variabel
      const tunarunguAudio = new Audio("../assets/sounds/Tunarungu.mp3");
      const tunanetraAudio = new Audio("../assets/sounds/Tunanetra.mp3");
      let currentExplanationAudio = null;

      // Sound effects
      const playSound = (sound) => {
        if (!audioEnabled) return;
        console.log(`Playing sound: ${sound}`);
        // Here you would actually play the sound
        // const audio = new Audio(`sounds/${sound}.mp3`);
        // audio.play();
      };

      // Fungsi untuk memutar audio penjelasan
      function playExplanationAudio(audioElement) {
        if (!audioEnabled) return;

        // Hentikan audio yang sedang diputar
        if (currentExplanationAudio) {
          currentExplanationAudio.pause();
          currentExplanationAudio.currentTime = 0;
        }

        // Putar audio baru
        currentExplanationAudio = audioElement;
        currentExplanationAudio.play();
      }

      // Function to navigate to the next page with fade effect
      function navigateToGame(character) {
        // Prevent multiple navigations
        if (isNavigating) return;
        isNavigating = true;

        // Select the character for visual feedback
        selectedCharacter = character;

        // Reset highlights
        tunarunguHighlight.classList.remove("show-highlight");
        tunanetraHighlight.classList.remove("show-highlight");

        // Update UI based on selection
        if (character === "tunarungu") {
          tunarunguHighlight.classList.add("show-highlight");
        } else {
          tunanetraHighlight.classList.add("show-highlight");
        }

        // Play sound and create particle effect
        playSound("start");
        createParticleBurst(
          window.innerWidth / 2,
          window.innerHeight / 2,
          "#ff6600",
          30
        );

        // Fade out animation
        document.body.style.transition = "opacity 1s";
        document.body.style.opacity = 0;

        // Navigate to the appropriate page after fade completes
        setTimeout(() => {
          console.log(`Navigating to ${character} game page`);
          window.location.href = `game-${character}.html`;
        }, 1000);
      }

      // Particle system
      function createParticle(x, y, color) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particlesContainer.appendChild(particle);

        // Animate and remove
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        const size = 5 + Math.random() * 10;
        let opacity = 0.7;
        let posX = x;
        let posY = y;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const animation = setInterval(() => {
          posX += Math.cos(angle) * speed;
          posY += Math.sin(angle) * speed - 0.5; // Slight upward drift
          opacity -= 0.01;

          particle.style.left = `${posX}px`;
          particle.style.top = `${posY}px`;
          particle.style.opacity = opacity;

          if (opacity <= 0) {
            clearInterval(animation);
            particlesContainer.removeChild(particle);
          }
        }, 20);
      }

      function createParticleBurst(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            createParticle(
              x - 10 + Math.random() * 20,
              y - 10 + Math.random() * 20,
              color
            );
          }, i * 20);
        }
      }

      // Character selection function (visual only now)
      function selectCharacter(character) {
        selectedCharacter = character;

        // Reset highlights
        tunarunguHighlight.classList.remove("show-highlight");
        tunanetraHighlight.classList.remove("show-highlight");

        // Update UI based on selection
        if (character === "tunarungu") {
          tunarunguHighlight.classList.add("show-highlight");
          createParticleBurst(
            tunarunguPanel.offsetLeft + tunarunguPanel.offsetWidth / 2,
            tunarunguPanel.offsetTop + tunarunguPanel.offsetHeight / 2,
            "#ffea00"
          );
        } else {
          tunanetraHighlight.classList.add("show-highlight");
          createParticleBurst(
            tunanetraPanel.offsetLeft + tunanetraPanel.offsetWidth / 2,
            tunanetraPanel.offsetTop + tunanetraPanel.offsetHeight / 2,
            "#ffea00"
          );
        }

        // Show start button
        startButton.classList.add("show-button");

        playSound("select");
      }

      // Update toggle audio
      audioToggle.addEventListener("click", function () {
        audioEnabled = !audioEnabled;
        audioIcon.style.opacity = audioEnabled ? 1 : 0.5;
        playSound("click");

        // Control background music
        if (audioEnabled) {
          backgroundMusic.play();
        } else {
          backgroundMusic.pause();
        }

        // Jika audio dimatikan, hentikan penjelasan yang sedang diputar
        if (!audioEnabled && currentExplanationAudio) {
          currentExplanationAudio.pause();
          currentExplanationAudio.currentTime = 0;
          currentExplanationAudio = null;
        }
      });

      // Event listeners for panels
      tunarunguPanel.addEventListener("mouseover", function () {
        playExplanationAudio(tunarunguAudio);

        if (selectedCharacter !== "tunarungu") {
          playSound("hover");
        }
      });

      tunarunguPanel.addEventListener("mouseout", function () {
        if (currentExplanationAudio === tunarunguAudio) {
          currentExplanationAudio.pause();
          currentExplanationAudio.currentTime = 0;
          currentExplanationAudio = null;
        }
      });

      tunanetraPanel.addEventListener("mouseover", function () {
        playExplanationAudio(tunanetraAudio);

        if (selectedCharacter !== "tunanetra") {
          playSound("hover");
        }
      });

      tunanetraPanel.addEventListener("mouseout", function () {
        if (currentExplanationAudio === tunanetraAudio) {
          currentExplanationAudio.pause();
          currentExplanationAudio.currentTime = 0;
          currentExplanationAudio = null;
        }
      });

      // Update panel click event listeners to navigate directly
      tunarunguPanel.addEventListener("click", function (e) {
        // Create particle burst at click position first for visual feedback
        createParticleBurst(e.pageX, e.pageY, "#ff9900", 10);
        playSound("select");

        // Select character visually
        selectCharacter("tunarungu");

        // Navigate after a short delay to allow visual feedback
        setTimeout(() => {
          navigateToGame("tunarungu");
        }, 300);
      });

      tunanetraPanel.addEventListener("click", function (e) {
        // Create particle burst at click position first for visual feedback
        createParticleBurst(e.pageX, e.pageY, "#ff9900", 10);
        playSound("select");

        // Select character visually
        selectCharacter("tunanetra");

        // Navigate after a short delay to allow visual feedback
        setTimeout(() => {
          navigateToGame("tunanetra");
        }, 300);
      });

      // Update start button to navigate if a character is selected
      startButton.addEventListener("click", function () {
        if (!selectedCharacter || isNavigating) return;
        navigateToGame(selectedCharacter);
      });

      // Create initial particle effects
      window.addEventListener("load", function () {
        // Welcome particles
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            createParticleBurst(
              window.innerWidth * Math.random(),
              window.innerHeight * Math.random(),
              ["#ffea00", "#ff9900", "#ff6600"][Math.floor(Math.random() * 3)],
              15
            );
          }, i * 500);
        }

        playSound("welcome");
      });

      // Interactive background particles on mouse move
      document.addEventListener("mousemove", function (e) {
        if (Math.random() < 0.03) {
          // Only create particles occasionally
          createParticle(e.pageX, e.pageY, "#ffffff");
        }
      });