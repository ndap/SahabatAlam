// DOM Elements
      const welcomeModal = document.getElementById("welcome-modal");
      const startBtn = document.getElementById("start-btn");
      const showHowtoBtn = document.getElementById("show-howto-btn");
      const howtoModal = document.getElementById("howto-modal");
      const closeHowtoBtn = document.getElementById("close-howto-btn");
      const gameOverlay = document.getElementById("game-overlay");
      const gameArea = document.querySelector(".game-area");
      const ground = document.getElementById("ground");
      const plantingHole = document.getElementById("planting-hole");
      const waterNeedIndicator = document.getElementById("water-need-indicator");
      const tools = document.getElementById("tools");
      const waterTool = document.getElementById("water-tool");
      const bugSprayTool = document.getElementById("bug-spray-tool");
      const progressContainer = document.getElementById("progress-container");
      const progressBar = document.getElementById("progress-bar");
      const progressLabel = document.getElementById("progress-label");
      const infoText = document.getElementById("info-text");
      const timerText = document.getElementById("timer");
      const dayCount = document.getElementById("day-count");
      const healthText = document.getElementById("health");
      const healthBar = document.getElementById("health-bar");
      const levelText = document.getElementById("level-text");
      const resultModal = document.getElementById("result-modal");
      const resultTitle = document.getElementById("result-title");
      const resultMsg = document.getElementById("result-msg");
      const resultNext = document.getElementById("result-next");
      const resultRetry = document.getElementById("result-retry");
      const factPopup = document.getElementById("fact-popup");
      const factText = document.getElementById("fact-text");
      const stageTransition = document.getElementById("stage-transition");
      const stageMessage = document.getElementById("stage-message");
      const sun = document.getElementById("sun");
      const moon = document.getElementById("moon");
      const stars = document.getElementById("stars");
      const dayNightIndicator = document.getElementById("day-night-indicator");
      const dayNightIcon = document.getElementById("day-night-icon");
      const dayNightText = document.getElementById("day-night-text");

      // Tree stages elements
      const treeStagesImg = [
        document.getElementById("tree-stage-0"),
        document.getElementById("tree-stage-1"),
        document.getElementById("tree-stage-2"),
        document.getElementById("tree-stage-3"),
      ];

      // Game State
      let gameStarted = false;
      let treePlanted = false;
      let treeGrown = false;
      let growTime = 60; // 1 minute total
      let timeElapsed = 0;
      let dayCounter = 1;
      let growStage = 0;
      let currentTool = null;
      let healthValue = 100;
      let wateringNeeded = false;
      let isWateringNeededIndicatorVisible = false;
      let bugPresent = false;
      let activeBugs = [];
      let factShown = false;
      let isNight = false;
      let dayNightCycle = 20; // 20 seconds per cycle
      let gameInterval = null;
      let starsGenerated = false;

      // Tree growth stages configuration
      const growStages = [
        { id: "tree-stage-0", duration: 10, name: "Bibit Kecil", icon: "🌱" },
        { id: "tree-stage-1", duration: 15, name: "Tunas Pohon", icon: "🌿" },
        { id: "tree-stage-2", duration: 15, name: "Pohon Kecil", icon: "🌲" },
        { id: "tree-stage-3", duration: 20, name: "Pohon Besar", icon: "🌳" },
      ];

      // Educational facts
      const treeFacts = [
        "Satu pohon besar dapat menghasilkan oksigen untuk 4 orang setiap hari!",
        "Pohon membantu menyerap air hujan dan mencegah banjir.",
        "Akar pohon membantu menjaga tanah agar tidak longsor.",
        "Pohon adalah rumah bagi banyak hewan seperti burung dan tupai.",
        "Pohon membantu udara menjadi lebih sejuk saat cuaca panas.",
        "Daun pohon menangkap debu dan polusi udara.",
        "Pohon dapat hidup selama ratusan tahun!",
        "Pohon membantu menjaga kesuburan tanah.",
        "Satu hektar pohon dapat menyerap 6 ton karbon dioksida setiap tahun.",
        "Pohon bakau melindungi pantai dari abrasi dan badai."
      ];

      // Bug information
      const bugTypes = [
        { 
          name: "Hama", 
          speed: 0.6, 
          damage: 5, 
          size: 50, 
          image: "../assets/Sprite/insect1.png" 
        },
        { 
          name: "Hama", 
          speed: 0.8, 
          damage: 8, 
          size: 45, 
          image: "../assets/Sprite/insect2.png" 
        }
      ];

      // Initial Game Setup
      gameArea.style.filter = "blur(3px)";
      gameArea.style.pointerEvents = "none";
      tools.style.display = "none";

      // Generate stars for night sky
      function generateStars() {
        if (starsGenerated) return;
        
        const starsContainer = document.getElementById("stars");
        const numberOfStars = 50;
        
        for (let i = 0; i < numberOfStars; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 60}%`;
          star.style.width = `${2 + Math.random() * 3}px`;
          star.style.height = star.style.width;
          star.style.animationDelay = `${Math.random() * 1.5}s`;
          starsContainer.appendChild(star);
        }
        
        starsGenerated = true;
      }

      // Initialize Button Event Listeners
      showHowtoBtn.addEventListener("click", function () {
        howtoModal.style.display = "block";
      });

      closeHowtoBtn.addEventListener("click", function () {
        howtoModal.style.display = "none";
      });

      startBtn.addEventListener("click", function () {
        welcomeModal.style.display = "none";
        howtoModal.style.display = "none";
        gameOverlay.classList.add("hidden");
        gameArea.style.filter = "none";
        gameArea.style.pointerEvents = "auto";
        gameStarted = true;
        startDayNightCycle();
        generateStars();
        
        // Play initial welcome sound
        playSound("start");
      });

      // Ground Click (Plant Tree)
      ground.addEventListener("click", function () {
        if (treePlanted || !gameStarted) return;

        // Hide plant hint
        document.getElementById("plant-hint").style.display = "none";

        // Animate soil for digging
        ground.style.animation = "soil-dig 0.6s ease";
        playSound("dig");
        
        setTimeout(() => {
          ground.style.animation = "";
        }, 600);

        // Show planting hole
        plantingHole.classList.add("visible");

        // Wait a moment before showing the tree
        setTimeout(() => {
          treePlanted = true;
          ground.classList.add("clicked");
          updateInfoText("Pohon mulai tumbuh! Jaga agar selalu sehat.", true);
          progressContainer.style.display = "flex";
          tools.style.display = "flex";
          levelText.textContent = "1";
          growStage = 0;
          showTreeStage(0);
          startGrowth();
          showRandomFact();
          playSound("plant");
        }, 800);
      });

      // Tool Selection
      waterTool.addEventListener("click", function () {
        if (!treePlanted) return;

        currentTool = "water";
        waterTool.classList.add("active");
        bugSprayTool.classList.remove("active");
        updateInfoText("Alat siram dipilih. Klik pohon untuk menyiram.", true);
        playSound("select");
      });

      bugSprayTool.addEventListener("click", function () {
        if (!treePlanted) return;

        currentTool = "spray";
        bugSprayTool.classList.add("active");
        waterTool.classList.remove("active");
        updateInfoText("Alat pengusir hama dipilih. Klik hama untuk mengusirnya.", true);
        playSound("select");
      });

      // Tree Interaction
      for (let i = 0; i < treeStagesImg.length; i++) {
        treeStagesImg[i].addEventListener("click", function (e) {
          e.stopPropagation();
          if (currentTool === "water" && wateringNeeded) {
            waterTree();
          }
        });
      }

      // Update Info Text with animation
      function updateInfoText(text, animate = false) {
        infoText.textContent = text;
        if (animate) {
          infoText.classList.remove("update");
          void infoText.offsetWidth; // Trigger reflow
          infoText.classList.add("update");
        }
      }

      // Sound Effects Function
      function playSound(type) {
        // In a real implementation, you would have actual sound files
        // Here we're just logging what sound would play
        console.log(`Playing sound: ${type}`);
        // This is a placeholder for actual sound implementation
      }

      // Functions
      function startGrowth() {
        timeElapsed = 0;
        updateProgress();

        // Start the growth timer
        gameInterval = setInterval(() => {
          timeElapsed++;
          timerText.textContent = timeElapsed;

          // Update progress bar
          updateProgress();

          // Check for tree stage changes
          checkGrowthStage();

          // Randomly trigger watering need (except during night)
          if (!isNight && !wateringNeeded && treePlanted && !treeGrown && Math.random() < 0.03) {
            triggerWateringNeed();
          }

          // Randomly spawn bugs (more likely at night)
          const bugChance = isNight ? 0.04 : 0.015;
          if (activeBugs.length < 3 && treePlanted && !treeGrown && Math.random() < bugChance) {
            spawnBug();
          }

          // Reduce health if tree needs water
          if (wateringNeeded) {
            reduceHealth(0.5);
          }

          // Game over if health reaches 0
          if (healthValue <= 0) {
            clearInterval(gameInterval);
            gameOver(false);
          }

          // Win condition
          if (growStage >= growStages.length - 1 && timeElapsed >= growTime) {
            clearInterval(gameInterval);
            treeGrown = true;
            gameOver(true);
          }
        }, 1000);
      }

      function startDayNightCycle() {
        setInterval(() => {
          isNight = !isNight;
          dayCounter = isNight ? dayCounter : dayCounter + 1;
          dayCount.textContent = dayCounter;

          if (isNight) {
            // Night time
            document.body.style.background = "url('../assets/Background/tunarunguMalam.jpg') no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            sun.style.opacity = "0";
            moon.style.opacity = "1";
            stars.style.opacity = "1";
            dayNightIndicator.className = "day-night-indicator night";
            dayNightIcon.textContent = "🌙";
            dayNightText.textContent = "Malam Hari";
            updateInfoText("Malam hari telah tiba. Pohon istirahat dan tumbuh lebih lambat.");
            
            // Make tree sleep animation
            const activeTree = treeStagesImg[growStage];
            if (activeTree.classList.contains("active")) {
              activeTree.classList.remove("growing");
            }
            
            showRandomFact();
            playSound("night");
          } else {
            // Day time
            document.body.style.background = "url('../assets/Background/TunarunguBG.jpg') no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            sun.style.opacity = "1";
            moon.style.opacity = "0";
            stars.style.opacity = "0";
            dayNightIndicator.className = "day-night-indicator day";
            dayNightIcon.textContent = "☀️";
            dayNightText.textContent = "Siang Hari";
            updateInfoText("Siang hari telah tiba. Pohon tumbuh lebih cepat dengan bantuan matahari.");
            
            // Make tree growing animation
            const activeTree = treeStagesImg[growStage];
            if (activeTree.classList.contains("active")) {
              activeTree.classList.add("growing");
            }
            
            playSound("day");
          }
        }, dayNightCycle * 1000);
      }

      function showTreeStage(stageIdx) {
        // Show stage transition
        if (stageIdx > 0) {
          stageMessage.textContent = `Pohon tumbuh ke tahap ${growStages[stageIdx].name}! ${growStages[stageIdx].icon}`;
          stageTransition.classList.add("show");
          playSound("grow");
          
          setTimeout(() => {
            stageTransition.classList.remove("show");
          }, 1500);
        }
        
        treeStagesImg.forEach((img, idx) => {
          if (idx === stageIdx) {
            img.classList.add("active");
            if (!isNight) img.classList.add("growing");
          }
          else {
            img.classList.remove("active", "growing");
          }
        });

        // Hide planting hole after first stage
        if (stageIdx > 0) {
          plantingHole.classList.remove("visible");
          progressLabel.textContent = `${growStages[stageIdx].icon} ${growStages[stageIdx].name}`;
          showRandomFact();
          
          // Celebratory effect for new stage
          createConfetti();
        }
      }

      function checkGrowthStage() {
        const currentStageTime = growStages
          .slice(0, growStage + 1)
          .reduce((acc, stage) => acc + stage.duration, 0);
          
        if (timeElapsed >= currentStageTime && growStage < growStages.length - 1) {
          growStage++;
          showTreeStage(growStage);

          // Show achievement message
          updateInfoText(`Pohon tumbuh ke tahap ${growStages[growStage].name}! ${growStages[growStage].icon}`, true);

          // Reset watering state
          wateringNeeded = false;
          ground.classList.remove("dry");
          waterNeedIndicator.classList.remove("show");
          
          // Increase health slightly as a reward
          increaseHealth(10);
        }
      }

      function updateProgress() {
        const progressPercentage = Math.min((timeElapsed / growTime) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
      }

      function triggerWateringNeed() {
        if (!treePlanted || treeGrown) return;

        wateringNeeded = true;
        isWateringNeededIndicatorVisible = true;
        ground.classList.add("dry");
        ground.classList.remove("watered");
        waterNeedIndicator.classList.add("show");
        updateInfoText("Pohon butuh air! Gunakan alat siram sekarang!", true);
        playSound("needWater");
        
        // Auto-select water tool as a hint
        currentTool = "water";
        waterTool.classList.add("active");
        bugSprayTool.classList.remove("active");
      }

      function waterTree() {
        if (!wateringNeeded) return;

        // Create water animation
        for (let i = 0; i < 8; i++) {
          const drop = document.createElement("div");
          drop.className = "water-drop";
          drop.style.left = `${Math.random() * 60 + 45}%`;
          drop.style.top = `${Math.random() * 10 + 30}%`;
          gameArea.appendChild(drop);

          // Create water splash effect
          setTimeout(() => {
            const splash = document.createElement("div");
            splash.className = "water-splash";
            splash.style.left = drop.style.left;
            splash.style.top = "85%";
            gameArea.appendChild(splash);
            
            // Remove splash after animation
            setTimeout(() => {
              splash.remove();
            }, 600);
          }, 800);

          // Remove water drop after animation
          setTimeout(() => {
            drop.remove();
          }, 1000);
        }

        // Reset watering state
        wateringNeeded = false;
        isWateringNeededIndicatorVisible = false;
        ground.classList.remove("dry");
        ground.classList.add("watered");
        waterNeedIndicator.classList.remove("show");

        // Increase health
        increaseHealth(15);

        updateInfoText("Bagus! Pohon sudah disiram dan sehat kembali.", true);
        playSound("water");

        // Remove watered class after a while
        setTimeout(() => {
          ground.classList.remove("watered");
        }, 3000);
      }

      function spawnBug() {
        if (!treePlanted || treeGrown) return;

        // Select bug type
        const bugType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
        
        // Create bug element
        const bug = document.createElement("div");
        bug.className = "bug";
        bug.style.backgroundImage = `url('${bugType.image}')`;
        bug.style.width = `${bugType.size}px`;
        bug.style.height = `${bugType.size}px`;
        
        // Add warning label
        const warning = document.createElement("div");
        warning.className = "bug-warning";
        warning.innerHTML = `⚠️ ${bugType.name}`;
        bug.appendChild(warning);

        // Position around the tree based on tree stage
        const treeBase = document.getElementById(`tree-stage-${growStage}`);
        const treeRect = treeBase.getBoundingClientRect();

        // Random position around the tree
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const x = Math.cos(angle) * distance + window.innerWidth / 2;
        const y = Math.sin(angle) * distance + treeRect.top + treeRect.height / 2;

        bug.style.left = `${x}px`;
        bug.style.top = `${y}px`;

        gameArea.appendChild(bug);
        
        // Track this bug
        const bugData = {
          element: bug,
          type: bugType,
          intervalId: null
        };
        
        activeBugs.push(bugData);

        // Bug movement animation
        let targetX = window.innerWidth / 2;
        let targetY = treeRect.top + treeRect.height / 2;
        
        bugData.intervalId = setInterval(() => {
          const bugRect = bug.getBoundingClientRect();
          const dx = targetX - (bugRect.left + bugRect.width / 2);
          const dy = targetY - (bugRect.top + bugRect.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            // Bug reached tree, damage it
            reduceHealth(bugType.damage);
            clearInterval(bugData.intervalId);
            
            // Create bug splat animation
            const splat = document.createElement("div");
            splat.className = "bug-splat";
            splat.style.left = bug.style.left;
            splat.style.top = bug.style.top;
            gameArea.appendChild(splat);
            
            // Remove splat after animation
            setTimeout(() => {
              splat.remove();
            }, 600);
            
            if (bug.parentNode) bug.remove();
            activeBugs = activeBugs.filter(b => b !== bugData);
            
            updateInfoText(`${bugType.name} merusak pohon! Kesehatan pohon berkurang ${bugType.damage}%.`, true);
            playSound("damage");
          } else {
            // Move bug toward tree - with slight randomness for more natural movement
            const randomOffset = Math.random() * 0.4 - 0.2;
            bug.style.left = `${bugRect.left + (dx * (bugType.speed + randomOffset)) / dist}px`;
            bug.style.top = `${bugRect.top + (dy * (bugType.speed + randomOffset)) / dist}px`;
          }
        }, 50);

        // Bug click event (spray)
        bug.addEventListener("click", () => {
          if (currentTool === "spray") {
            clearInterval(bugData.intervalId);
            
            // Create spray effect
            createSprayEffect(bug);
            
            // Create bug splat animation
            const splat = document.createElement("div");
            splat.className = "bug-splat";
            splat.style.left = bug.style.left;
            splat.style.top = bug.style.top;
            gameArea.appendChild(splat);
            
            // Remove splat after animation
            setTimeout(() => {
              splat.remove();
            }, 600);
            
            bug.remove();
            activeBugs = activeBugs.filter(b => b !== bugData);
            
            updateInfoText(`Kamu berhasil mengusir ${bugType.name}!`, true);
            playSound("spray");
            
            // Slight health bonus for quick reaction
            increaseHealth(2);
          }
        });

        updateInfoText(`Awas! Ada ${bugType.name} mendekati pohon. Gunakan alat pengusir hama!`, true);
        playSound("bug");
        
        // Auto-select spray tool as a hint
        currentTool = "spray";
        bugSprayTool.classList.add("active");
        waterTool.classList.remove("active");
      }

      function createSprayEffect(targetElement) {
        const sprayParticles = document.createElement("div");
        sprayParticles.className = "spray-particles";
        
        // Position spray near the bug
        const rect = targetElement.getBoundingClientRect();
        sprayParticles.style.left = `${rect.left}px`;
        sprayParticles.style.top = `${rect.top}px`;
        
        gameArea.appendChild(sprayParticles);
        
        // Create particles
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement("div");
          particle.className = "spray-particle";
          
          // Random position and direction
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 40;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          particle.style.setProperty('--x', `${x}px`);
          particle.style.setProperty('--y', `${y}px`);
          
          sprayParticles.appendChild(particle);
        }
        
        // Remove spray effect after animation
        setTimeout(() => {
          sprayParticles.remove();
        }, 800);
      }

      function increaseHealth(amount) {
        healthValue = Math.min(healthValue + amount, 100);
        healthText.textContent = Math.floor(healthValue);
        updateHealthBar();
      }

      function reduceHealth(amount) {
        healthValue = Math.max(healthValue - amount, 0);
        healthText.textContent = Math.floor(healthValue);
        updateHealthBar();
      }

      function updateHealthBar() {
        healthBar.style.width = `${healthValue}%`;
        
        // Update health bar color based on health value
        if (healthValue < 30) {
          healthBar.className = "health-bar danger";
          healthText.style.color = "#F44336";
        } else if (healthValue < 60) {
          healthBar.className = "health-bar warning";
          healthText.style.color = "#FF9800";
        } else {
          healthBar.className = "health-bar";
          healthText.style.color = "#4CAF50";
        }
      }

      function showRandomFact() {
        if (factShown) return;

        factShown = true;
        const randomFact = treeFacts[Math.floor(Math.random() * treeFacts.length)];
        factText.textContent = randomFact;
        factPopup.classList.add("show");

        setTimeout(() => {
          factPopup.classList.remove("show");
          factShown = false;
        }, 7000);
      }

      function createConfetti() {
        const confettiContainer = document.createElement("div");
        confettiContainer.className = "confetti-container";
        document.body.appendChild(confettiContainer);
        
        const colors = ["#4CAF50", "#8BC34A", "#FFEB3B", "#FF9800", "#2196F3"];
        
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement("div");
          confetti.className = "confetti";
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.width = `${5 + Math.random() * 10}px`;
          confetti.style.height = `${5 + Math.random() * 10}px`;
          confetti.style.opacity = Math.random();
          confetti.style.animationDuration = `${1 + Math.random() * 3}s`;
          
          confettiContainer.appendChild(confetti);
        }
        
        setTimeout(() => {
          confettiContainer.remove();
        }, 3000);
      }

      function gameOver(isWin) {
        // Clear all active timers and bugs
        clearInterval(gameInterval);
        activeBugs.forEach(bug => {
          clearInterval(bug.intervalId);
          if (bug.element.parentNode) bug.element.remove();
        });
        activeBugs = [];
        
        // Create confetti effect for win
        if (isWin) {
          createConfetti();
          resultTitle.textContent = "Pohonmu Sudah Tumbuh Besar! 🎉";
          resultMsg.textContent = `Selamat! Kamu berhasil menanam dan merawat pohon hingga tumbuh besar dalam ${dayCounter} hari dengan kesehatan ${Math.floor(healthValue)}%.`;
          resultNext.style.display = "flex";
          document.getElementById("achievement").style.display = "block";
          playSound("win");
        } else {
          resultTitle.textContent = "Pohonmu Tidak Sehat 😢";
          resultMsg.textContent = "Sayang sekali pohonmu tidak bisa tumbuh dengan baik. Mungkin perlu lebih sering disiram atau dilindungi dari hama.";
          resultNext.style.display = "none";
          document.getElementById("achievement").style.display = "none";
          playSound("lose");
        }

        resultRetry.style.display = "inline-block";
        resultModal.style.display = "block";
      }

      // Reset the game
      resultRetry.addEventListener("click", function() {
        location.reload();
      });

      // Fix for water need indicator positioning
      window.addEventListener("resize", function() {
        if (isWateringNeededIndicatorVisible) {
          // Reposition water need indicator with tree
          const treeBase = document.getElementById(`tree-stage-${growStage}`);
          if (treeBase) {
            const treeRect = treeBase.getBoundingClientRect();
            waterNeedIndicator.style.top = `${treeRect.top - 40}px`;
          }
        }
      });