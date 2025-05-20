document.addEventListener("DOMContentLoaded", function () {
        // Create audio elements
        const bgMusic = new Audio();
        bgMusic.src = "./assets/sounds/BackSoundStart.mp3"; // Placeholder
        bgMusic.loop = true;
        bgMusic.volume = 0.2;

        const buttonSound = new Audio();
        buttonSound.src = "https://example.com/button-click.mp3"; // Placeholder
        buttonSound.volume = 0.6;

        const characterSound = new Audio();
        characterSound.src = "https://example.com/character-sound.mp3"; // Placeholder

        const collectSound = new Audio();
        collectSound.src = "https://example.com/collect.mp3"; // Placeholder
        collectSound.volume = 0.5;

        const successSound = new Audio();
        successSound.src = "https://example.com/success.mp3"; // Placeholder
        successSound.volume = 0.7;

        let isSoundOn = false;
        const soundButton = document.getElementById("sound-button");

        // Game state
        let score = 0;
        let isMinigameActive = false;
        let collectibles = [];
        let characterPhrases = [
          "Halo! Aku Keira, sahabat alammu!",
          "Ayo kita jelajahi alam bersama!",
          "Lingkungan yang bersih membuat semua makhluk bahagia!",
          "Tahukah kamu bahwa pohon menghasilkan oksigen untuk kita?",
          "Rawatlah alam seperti kamu merawat temanmu!",
          "Jangan lupa untuk mematikan lampu saat tidak digunakan!",
          "Air adalah sumber kehidupan, jangan sia-siakan!",
          "Ayo kumpulkan sampah dan buang pada tempatnya!",
          "Sayangi hewan dan tumbuhan di sekitarmu!",
        ];

        let natureFacts = [
          "Kupu-kupu memiliki rasa dengan kaki mereka!",
          "Lebah harus mengunjungi sekitar 2 juta bunga untuk membuat 500 gram madu!",
          "Jerapah bisa membersihkan telinganya dengan lidahnya!",
          "Pohon membantu kita bernapas dengan menghasilkan oksigen!",
          "Air menutupi 70% permukaan bumi kita!",
          "Lumba-lumba tidur dengan setengah otaknya tetap terjaga!",
          "Bintang laut bisa menumbuhkan kembali lengannya yang hilang!",
          "Satu pohon besar dapat memberikan oksigen untuk 4 orang!",
          "Semut dapat mengangkat 50 kali berat tubuhnya!",
          "Kumbang badak bisa mengangkat 850 kali berat tubuhnya!",
        ];

        // Audio untuk aksesibilitas
        const playButtonHoverSound = new Audio();
        playButtonHoverSound.src = "./assets/sounds/Play.mp3"; // Ganti dengan path yang benar
        playButtonHoverSound.volume = 0.5;

        const quitButtonHoverSound = new Audio();
        quitButtonHoverSound.src = "./assets/sounds/Quit.mp3"; // Ganti dengan path yang benar
        quitButtonHoverSound.volume = 0.5;

        // Tambahkan event listener untuk aksesibilitas pada tombol Play
        const playButton = document.getElementById("play-button");
        playButton.addEventListener("mouseenter", function () {
          playButtonHoverSound.currentTime = 0;
          playButtonHoverSound.play();

          // Tambahkan aria-live untuk aksesibilitas screen reader
          this.setAttribute("aria-live", "polite");
          this.setAttribute("aria-label", "Tombol Main");
        });

        // Tambahkan event listener untuk aksesibilitas pada tombol Quit
        const quitButton = document.getElementById("quit-button");
        quitButton.addEventListener("mouseenter", function () {
          quitButtonHoverSound.currentTime = 0;
          quitButtonHoverSound.play();

          // Tambahkan aria-live untuk aksesibilitas screen reader
          this.setAttribute("aria-live", "polite");
          this.setAttribute("aria-label", "Tombol Keluar");
        });

        // Tambahkan atribut aksesibilitas pada tombol-tombol
        playButton.setAttribute("tabindex", "0");
        playButton.setAttribute("role", "button");
        quitButton.setAttribute("tabindex", "0");
        quitButton.setAttribute("role", "button");

        // Tambahkan aksesibilitas keyboard
        playButton.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click(); // Trigger click event saat tombol Enter atau Space ditekan
          }
        });

        quitButton.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click(); // Trigger click event saat tombol Enter atau Space ditekan
          }
        });

        // Tambahkan focus style untuk menunjukkan tombol mana yang aktif
        const style = document.createElement("style");
        style.textContent = `
    .button:focus {
        outline: 3px solid #ffcc00;
        box-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
    }
`;

        // Buat overlay intro
        const introOverlay = document.createElement("div");
        introOverlay.className = "intro-overlay";

        // Tambahkan logo jika ada
        const introLogo = document.createElement("img");
        introLogo.className = "intro-logo";
        introLogo.src = "./assets/SahabatAlam.png"; // Gunakan logo game
        introLogo.alt = "Sahabat Alam";
        introOverlay.appendChild(introLogo);

        // Tambahkan teks intro
        const introText = document.createElement("div");
        introText.className = "intro-text";
        introText.textContent = "Klik untuk melanjutkan";
        introOverlay.appendChild(introText);

        // Tambahkan overlay ke body saat DOM selesai dimuat
        document.body.appendChild(introOverlay);

        // Event listener untuk klik pada overlay
        introOverlay.addEventListener("click", function () {
          // Buat sparkle effect
          createSparkleEffect(introText);

          // Fade out overlay
          introOverlay.style.opacity = "0";

          // Hapus overlay setelah transisi selesai
          setTimeout(() => {
            introOverlay.remove();
          }, 1500);

          // Otomatis putar musik latar
          bgMusic.play();
          isSoundOn = true;

          // Update tampilan tombol sound
          soundButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#007833"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

          // Tampilkan welcome message dengan smooth fade in
          const welcomeMessage = document.querySelector(".welcome-message");
          welcomeMessage.style.animation = "none";
          welcomeMessage.style.opacity = "0";

          setTimeout(() => {
            welcomeMessage.style.animation = "appear 2s forwards";
          }, 500);

          // Tambahkan efek masuk untuk karakter dan tombol
          const character = document.querySelector(".character");
          character.style.transition = "transform 1s ease-out, opacity 1s";
          character.style.transform = "translateY(50px)";
          character.style.opacity = "0";

          setTimeout(() => {
            character.style.transform = "";
            character.style.opacity = "1";
          }, 300);

          // Audio untuk aksesibilitas saat hover pada karakter Keira
          const keiraHoverSound = new Audio();
          keiraHoverSound.src = "./assets/sounds/ImKeira.mp3"; // Ganti dengan path yang benar
          keiraHoverSound.volume = 0.5;

          // Karakter Keira sudah didefinisikan sebagai variabel 'character' di kode utama

          // Tambahkan event listener untuk hover pada karakter
          character.addEventListener("mouseenter", function () {
            keiraHoverSound.currentTime = 0;
            keiraHoverSound.play();

            // Tambahkan atribut ARIA untuk screen reader
            this.setAttribute("aria-live", "polite");
            this.setAttribute("aria-label", "Karakter Keira, Sahabat Alam");
          });

          // Menambahkan aksesibilitas keyboard
          character.setAttribute("tabindex", "0");
          character.setAttribute("role", "button");

          // Event listener untuk aksesibilitas keyboard
          character.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this.click(); // Memicu event klik saat tombol Enter atau Space ditekan
            }
          });

          // Tambahkan gaya fokus untuk menunjukkan karakter sedang aktif
          const characterFocusStyle = document.createElement("style");
          characterFocusStyle.textContent = `
    .character:focus {
        outline: 3px solid #ffcc00;
        box-shadow: 0 0 10px rgba(255, 204, 0, 0.8);
        transform: translateY(-10px);
    }
`;
          document.head.appendChild(characterFocusStyle);

          // Tambahkan tooltip untuk karakter Keira
          character.setAttribute(
            "title",
            "Keira, Sahabat Alam - Klik untuk berinteraksi"
          );

          // Menambahkan event listener untuk hover keluar (opcional)
          character.addEventListener("mouseleave", function () {
            // Reset atribut ARIA jika diperlukan
            this.removeAttribute("aria-live");
          });

          const buttons = document.querySelector(".buttons-container");
          buttons.style.transition = "transform 1s ease-out, opacity 1s";
          buttons.style.transform = "translateY(30px)";
          buttons.style.opacity = "0";

          setTimeout(() => {
            buttons.style.transform = "";
            buttons.style.opacity = "1";
          }, 800);
        });

        document.head.appendChild(style);
        // Update score display
        function updateScore(points) {
          score += points;
          document.getElementById("score").textContent = score;

          // Show animation on score change
          const scoreDisplay = document.querySelector(".score-display");
          scoreDisplay.style.animation = "none";
          void scoreDisplay.offsetWidth; // Trigger reflow
          scoreDisplay.style.animation = "bounce 0.5s";

          if (score > 0 && score % 10 === 0) {
            successSound.play();
            showCharacterSpeech(
              "Hebat! Kamu sudah mendapat " + score + " poin!"
            );
          }
        }

        // Function to toggle sound
        function toggleSound() {
          if (isSoundOn) {
            bgMusic.pause();
            soundButton.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#007833"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
            isSoundOn = false;
          } else {
            bgMusic.play();
            soundButton.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#007833"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
            isSoundOn = true;
          }

          // Create sparkle effect
          createSparkleEffect(soundButton);
        }

        // Add click event to sound button
        soundButton.addEventListener("click", toggleSound);

        // Load animated background elements
        const cloudUrls = [
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M10,30 Q15,10 30,20 T60,20 T80,30 Q95,30 90,40 T75,45 T30,45 T15,40 Q5,35 10,30 Z" fill="white"/></svg>',
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60"><path d="M10,40 Q20,20 40,30 T80,25 T100,35 Q115,35 110,45 T85,50 T35,50 T15,45 Q0,40 10,40 Z" fill="white"/></svg>',
        ];

        const birdUrls = [
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30"><path d="M5,15 Q10,5 20,10 L30,5 L35,10 L45,5 L35,15 L25,10 Q15,15 5,15 Z" fill="%23558822"/></svg>',
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30"><path d="M5,15 Q15,5 25,10 L35,5 L40,10 L45,15 L35,10 L25,15 Q15,20 5,15 Z" fill="%23336699"/></svg>',
        ];

        const butterflyUrls = [
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><path d="M20,5 Q10,0 5,10 T10,20 T20,15 T30,20 T35,10 T20,5 Z M18,5 L22,5 L20,25 Z" fill="%23FF9900"/></svg>',
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><path d="M20,5 Q10,0 5,10 T10,20 T20,15 T30,20 T35,10 T20,5 Z M18,5 L22,5 L20,25 Z" fill="%23CC66FF"/></svg>',
        ];

        const animalUrls = [
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23CC9966"/><circle cx="35" cy="40" r="5" fill="%23000"/><circle cx="65" cy="40" r="5" fill="%23000"/><path d="M40,65 Q50,75 60,65" stroke="%23000" stroke-width="3" fill="none"/><circle cx="50" cy="50" r="3" fill="%23000"/></svg>', // Simple bear face
        ];

        const collectibleImages = [
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="%23FFCC00"/><circle cx="25" cy="25" r="10" fill="%23FF9900"/></svg>', // Star
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M10,25 L25,10 L40,25 L25,40 Z" fill="%2300AA55"/></svg>', // Leaf
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M15,35 C15,25 25,15 25,15 C25,15 35,25 35,35 C35,42 30,45 25,45 C20,45 15,42 15,35 Z" fill="%2366CCFF"/></svg>', // Water drop
        ];

        // Add images to elements
        document.querySelectorAll(".cloud").forEach((cloud, index) => {
          cloud.style.backgroundImage = `url('${
            cloudUrls[index % cloudUrls.length]
          }')`;
          cloud.style.backgroundSize = "contain";
          cloud.style.backgroundRepeat = "no-repeat";

          // Make clouds interactive
          cloud.style.pointerEvents = "all";
          cloud.addEventListener("click", function () {
            // Rain effect when clicking clouds
            createRaindrops(cloud);
            updateScore(1);
            showNatureFact();
          });
        });

        document.querySelectorAll(".bird").forEach((bird, index) => {
          bird.style.backgroundImage = `url('${
            birdUrls[index % birdUrls.length]
          }')`;
          bird.style.backgroundSize = "contain";
          bird.style.backgroundRepeat = "no-repeat";
          bird.style.pointerEvents = "all";

          // Make birds interactive
          bird.addEventListener("click", function () {
            // Bird flying animation
            this.style.transition = "transform 0.5s";
            this.style.transform = "translateY(-30px)";
            setTimeout(() => {
              this.style.transform = "";
            }, 500);

            updateScore(2);
            showNatureFact();
          });
        });

        document.querySelectorAll(".butterfly").forEach((butterfly, index) => {
          butterfly.style.backgroundImage = `url('${
            butterflyUrls[index % butterflyUrls.length]
          }')`;
          butterfly.style.backgroundSize = "contain";
          butterfly.style.backgroundRepeat = "no-repeat";

          // Make butterflies interactive
          butterfly.addEventListener("click", function () {
            // Butterfly dancing animation
            this.style.animation = "none";
            void this.offsetWidth; // Trigger reflow
            this.style.animation = "wiggle 0.5s ease-in-out";

            // After wiggle, continue normal animation
            setTimeout(() => {
              this.style.animation = "flutter 3s ease-in-out infinite";
            }, 500);

            updateScore(3);
            showNatureFact();
          });
        });

        document.querySelectorAll(".animal").forEach((animal, index) => {
          animal.style.backgroundImage = `url('${
            animalUrls[index % animalUrls.length]
          }')`;
          animal.style.backgroundSize = "contain";
          animal.style.backgroundRepeat = "no-repeat";

          // Add interactivity to animals
          animal.addEventListener("click", function () {
            characterSound.play();
            createSparkleEffect(animal);

            // Animal animation
            this.style.animation = "bounce 1s ease-in-out";
            setTimeout(() => {
              this.style.animation = "";
            }, 1000);

            updateScore(5);
            showCharacterSpeech("Hewan adalah teman kita! Lindungi mereka!");
          });
        });

        // Speech bubble functionality
        const speechBubble = document.getElementById("speech-bubble");
        let speechTimeout;

        function showCharacterSpeech(text) {
          clearTimeout(speechTimeout);

          speechBubble.textContent = text;
          speechBubble.style.opacity = "1";

          // Clear speech bubble after 4 seconds
          speechTimeout = setTimeout(() => {
            speechBubble.style.opacity = "0";
          }, 4000);
        }

        // Show random character speech on start
        setTimeout(() => {
          showCharacterSpeech(
            characterPhrases[
              Math.floor(Math.random() * characterPhrases.length)
            ]
          );
        }, 2000);

        // Fact popup functionality
        const factPopup = document.getElementById("fact-popup");
        let factTimeout;

        function showNatureFact() {
          clearTimeout(factTimeout);

          // Position the fact randomly
          const x = 100 + Math.random() * (window.innerWidth - 400);
          const y = 100 + Math.random() * (window.innerHeight - 200);

          factPopup.style.left = `${x}px`;
          factPopup.style.top = `${y}px`;

          // Select random fact
          const factContent =
            natureFacts[Math.floor(Math.random() * natureFacts.length)];
          factPopup.querySelector(".fact-content").textContent = factContent;

          // Show with animation
          factPopup.style.animation = "none";
          void factPopup.offsetWidth; // Trigger reflow
          factPopup.style.animation = "pop 0.5s forwards";
          factPopup.style.opacity = "1";

          // Hide fact after 5 seconds
          factTimeout = setTimeout(() => {
            factPopup.style.opacity = "0";
          }, 5000);
        }

        // Function to create raindrops
        function createRaindrops(cloud) {
          const rect = cloud.getBoundingClientRect();

          for (let i = 0; i < 10; i++) {
            const raindrop = document.createElement("div");
            raindrop.style.position = "absolute";
            raindrop.style.width = "5px";
            raindrop.style.height = "15px";
            raindrop.style.backgroundColor = "#66CCFF";
            raindrop.style.borderRadius = "50%";
            raindrop.style.opacity = "0.7";
            raindrop.style.zIndex = "2";
            raindrop.style.pointerEvents = "none";

            // Position under the cloud
            const x = rect.left + Math.random() * rect.width;
            const y = rect.bottom;

            raindrop.style.left = `${x}px`;
            raindrop.style.top = `${y}px`;

            // Add falling animation
            raindrop.style.transition = "top 1.5s, opacity 1.5s";

            document.body.appendChild(raindrop);

            // Start falling
            setTimeout(() => {
              raindrop.style.top = `${y + 200}px`;
              raindrop.style.opacity = "0";
            }, 50);

            // Remove raindrop after animation
            setTimeout(() => {
              document.body.removeChild(raindrop);
            }, 1600);
          }
        }

        // Function to create sparkle effect
        function createSparkleEffect(element) {
          const rect = element.getBoundingClientRect();

          for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";

            // Position around the element
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;

            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            sparkle.style.animation = `sparkle-fade 1s forwards`;

            document.body.appendChild(sparkle);

            // Remove sparkle after animation
            setTimeout(() => {
              document.body.removeChild(sparkle);
            }, 1000);
          }
        }

        // Function to create collectible items
        function createCollectible() {
          if (collectibles.length > 10) return; // Limit number of collectibles

          const collectible = document.createElement("div");
          collectible.className = "collectible";

          // Random position within game container
          const x = 50 + Math.random() * (window.innerWidth - 100);
          const y = 50 + Math.random() * (window.innerHeight - 100);

          collectible.style.left = `${x}px`;
          collectible.style.top = `${y}px`;

          // Random collectible type
          const imageIndex = Math.floor(
            Math.random() * collectibleImages.length
          );
          collectible.style.backgroundImage = `url('${collectibleImages[imageIndex]}')`;

          // Value based on rarity
          collectible.dataset.value = (imageIndex + 1) * 2;

          // Animation
          collectible.style.animation =
            "pop 0.5s forwards, float 3s ease-in-out infinite";

          // Click event to collect
          collectible.addEventListener("click", function () {
            collectSound.play();
            createSparkleEffect(this);

            // Update score
            const value = parseInt(this.dataset.value);
            updateScore(value);

            // Remove from collectibles array
            const index = collectibles.indexOf(this);
            if (index > -1) {
              collectibles.splice(index, 1);
            }

            // Remove from DOM
            this.parentNode.removeChild(this);

            // Show character reaction
            if (value >= 4) {
              showCharacterSpeech(
                "Wah, kamu menemukan yang langka! +" + value + " poin!"
              );
            } else {
              showCharacterSpeech("Bagus! +" + value + " poin!");
            }
          });

          document.querySelector(".game-container").appendChild(collectible);
          collectibles.push(collectible);
        }

        // Regularly spawn collectibles
        setInterval(createCollectible, 5000);

        // Character interactions
        const character = document.getElementById("character");
        let characterAnimationTimeout;

        character.addEventListener("click", function () {
          clearTimeout(characterAnimationTimeout);
          characterSound.play();

          // Random animation
          const animations = [
            "transform: translateY(-20px) rotate(5deg);",
            "transform: translateY(-15px) translateX(10px);",
            "transform: scale(1.1);",
          ];

          const randomAnimation =
            animations[Math.floor(Math.random() * animations.length)];
          this.style.cssText = randomAnimation;

          // Reset after animation
          characterAnimationTimeout = setTimeout(() => {
            this.style.transform = "";
          }, 500);

          createSparkleEffect(this);

          // Show random character speech
          showCharacterSpeech(
            characterPhrases[
              Math.floor(Math.random() * characterPhrases.length)
            ]
          );
        });

        // Create simple drag functionality for character
        let isDragging = false;
        let offsetX, offsetY;

        character.addEventListener("mousedown", function (e) {
          isDragging = true;
          offsetX = e.clientX - character.getBoundingClientRect().left;
          offsetY = e.clientY - character.getBoundingClientRect().top;
          character.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", function (e) {
          if (!isDragging) return;

          // Keep character within game container
          const x = Math.max(
            0,
            Math.min(
              e.clientX - offsetX,
              window.innerWidth - character.offsetWidth
            )
          );
          const y = Math.max(
            0,
            Math.min(
              e.clientY - offsetY,
              window.innerHeight - character.offsetHeight
            )
          );

          character.style.left = `${x}px`;
          character.style.bottom = "auto";
          character.style.top = `${y}px`;
        });

        document.addEventListener("mouseup", function () {
          if (isDragging) {
            isDragging = false;
            character.style.cursor = "pointer";

            // Show reaction
            showCharacterSpeech(
              "Terima kasih sudah membantuku berpindah tempat!"
            );
          }
        });

        // Minigame functionality
        const minigameButton = document.getElementById("minigame-button");

        function startButterflyMinigame() {
          if (isMinigameActive) return;

          isMinigameActive = true;

          // Show instructions
          showCharacterSpeech(
            "Tangkap kupu-kupu sebanyak mungkin dalam 10 detik!"
          );

          // Create flying butterflies
          for (let i = 0; i < 8; i++) {
            createFlyingButterfly();
          }

          // End minigame after 10 seconds
          setTimeout(() => {
            // Remove all minigame butterflies
            document.querySelectorAll(".minigame-butterfly").forEach((b) => {
              b.parentNode.removeChild(b);
            });

            isMinigameActive = false;

            // Show end message
            showCharacterSpeech("Permainan selesai! Kamu hebat!");
          }, 10000);
        }

        function createFlyingButterfly() {
          const butterfly = document.createElement("div");
          butterfly.className = "floating-item butterfly minigame-butterfly";

          // Random position
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;

          butterfly.style.left = `${x}px`;
          butterfly.style.top = `${y}px`;

          // Random butterfly image
          const imageIndex = Math.floor(Math.random() * butterflyUrls.length);
          butterfly.style.backgroundImage = `url('${butterflyUrls[imageIndex]}')`;
          butterfly.style.backgroundSize = "contain";
          butterfly.style.backgroundRepeat = "no-repeat";

          // Larger size for game
          butterfly.style.width = "50px";
          butterfly.style.height = "50px";

          // Random movement
          butterfly.style.transition =
            "left 2s ease-in-out, top 2s ease-in-out";

          document.querySelector(".game-container").appendChild(butterfly);

          // Move randomly
          function moveButterfly() {
            if (!document.body.contains(butterfly)) return;

            const newX = Math.random() * window.innerWidth;
            const newY = Math.random() * window.innerHeight;

            butterfly.style.left = `${newX}px`;
            butterfly.style.top = `${newY}px`;

            setTimeout(moveButterfly, 2000);
          }

          moveButterfly();

          // Click to catch
          butterfly.addEventListener("click", function () {
            collectSound.play();
            createSparkleEffect(this);
            this.parentNode.removeChild(this);
            updateScore(5);
          });
        }

        minigameButton.addEventListener("click", function () {
          buttonSound.play();
          createSparkleEffect(this);
          startButterflyMinigame();
        });

        // Add event listeners to buttons with sound effects
        document
          .getElementById("play-button")
          .addEventListener("click", function () {
            buttonSound.play();
            createSparkleEffect(this);

            // Add exciting animation when clicking play
            const gameContainer = document.querySelector(".game-container");
            gameContainer.style.transition =
              "transform 0.5s ease-out, opacity 1.5s ease-in-out";
            gameContainer.style.transform = "scale(1.05)";

            setTimeout(() => {
              gameContainer.style.transform = "";
              console.log("Play button clicked");
              // Start game
              showCharacterSpeech("Ayo mulai bermain dan menjelajahi alam!");
              updateScore(10); // Bonus points for starting

              // Start fade out animation
              setTimeout(() => {
                gameContainer.style.opacity = "0";

                // Navigate to next page after fade out completes
                setTimeout(() => {
                  window.location.href = "./html/choose.html"; // Ganti dengan URL halaman berikutnya
                }, 1500); // Waktu untuk menyelesaikan fade out
              }, 1000); // Delay sebelum memulai fade out
            }, 500);
          });

        document
          .getElementById("quit-button")
          .addEventListener("click", function () {
            buttonSound.play();
            console.log("Quit button clicked");

            // Show confirmation
            showCharacterSpeech(
              "Sampai jumpa lagi, teman! Jangan lupa untuk selalu menjaga alam!"
            );
          });

        // Add hover sound effects
        const buttons = document.querySelectorAll(".button");
        const hoverSound = new Audio();
        hoverSound.src = "https://example.com/hover-sound.mp3"; // Placeholder
        hoverSound.volume = 0.3;

        buttons.forEach((button) => {
          button.addEventListener("mouseenter", function () {
            hoverSound.currentTime = 0;
            hoverSound.play();
          });
        });

        // Create occasional random animations for background elements
        setInterval(() => {
          const butterflies = document.querySelectorAll(
            ".butterfly:not(.minigame-butterfly)"
          );
          if (butterflies.length > 0) {
            const randomButterfly =
              butterflies[Math.floor(Math.random() * butterflies.length)];
            randomButterfly.style.animation = "none";
            void randomButterfly.offsetWidth; // Trigger reflow
            randomButterfly.style.animation = "flutter 3s ease-in-out infinite";
          }
        }, 5000);

        // Create occasional random messages
        const messages = [
          "Mari Kita Jelajahi Alam!",
          "Lindungi Alammu!",
          "Ayo Bermain Bersama!",
          "Petualangan Menunggu!",
          "Sahabat Alam Siap Bermain!",
        ];

        function showRandomMessage() {
          const welcomeMessage = document.querySelector(".welcome-message");
          welcomeMessage.style.opacity = 0;

          setTimeout(() => {
            welcomeMessage.textContent =
              messages[Math.floor(Math.random() * messages.length)];
            welcomeMessage.style.animation = "none";
            void welcomeMessage.offsetWidth; // Trigger reflow
            welcomeMessage.style.animation = "appear 1s forwards";
          }, 1000);
        }

        // Change message every 8 seconds
        setInterval(showRandomMessage, 8000);

        // Start with one collectible
        setTimeout(createCollectible, 1000);
      });