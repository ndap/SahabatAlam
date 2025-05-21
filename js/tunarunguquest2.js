(() => {
  // --- DATA & VARIABEL ---
  const GAME_DURATION = 40;
  const INITIAL_BUG_SPAWN_INTERVAL = 1600;  // Increased from 2200 for slower spawn rate
  const MIN_BUG_SPAWN_INTERVAL = 1000;      // Increased from 800 for slower minimum spawn rate
  const TREE_STAGES = 4;
  const TREE_GROWTH_SCORE = 30;
  const TREE_MAX_HEALTH = 100;
  const TREE_HIT_DAMAGE = 20;
  const COMBO_THRESHOLD = 2;  // Number of consecutive successful catches for combo
  const COMBO_BONUS = 5;      // Extra points for each catch in combo
  const EDUCATIONAL_TIPS = [
    "Burung pemakan serangga mampu mengurangi populasi hama hingga 50% di beberapa pertanian.",
    "Tanaman pendamping seperti bunga marigold dapat mengusir beberapa jenis hama secara alami.",
    "Perangkap lengket organik lebih ramah lingkungan daripada pestisida kimia.",
    "Menjaga keseimbangan ekosistem membantu mengendalikan hama secara alami.",
    "Kupu-kupu dan lebah berperan penting dalam penyerbukan tanaman dan harus dilindungi.",
    "Pengendalian hama terintegrasi menggabungkan berbagai metode alami untuk hasil optimal.",
    "Rotasi tanaman dapat memutus siklus hidup hama dan mengurangi serangan.",
  ];
  
  const BUGS_DATA = [
    {
      id:'ulat', emoji:'🐛', isHama:true,
      goodTool:['spider','bird'],
      badTool:['pesticide','plasticNet'],
      description: 'Ulat pemakan daun',
      naturalControl: 'Laba-laba 🕷️ atau Burung 🐦',
      speed: 6000,  // Speed increased (longer duration = slower movement)
      points: 10
    },
    {
      id:'belalang', emoji:'🦗', isHama:true,
      goodTool:['stickyTrap','flower'],
      badTool:['plasticNet','pesticide'],
      description: 'Belalang pemakan tanaman',
      naturalControl: 'Daun lengket 🍃 atau Bunga 🌸',
      speed: 5500,  // Speed increased
      points: 15
    },
    {
      id:'wereng', emoji:'🪱', isHama:true,
      goodTool:['spider','bird'],
      badTool:['pesticide'],
      description: 'Wereng penghisap getah',
      naturalControl: 'Laba-laba 🕷️ atau Burung 🐦',
      speed: 5200,  // Speed increased
      points: 20
    },
    {
      id:'kupu', emoji:'🦋', isHama:false,
      goodTool:[],
      badTool:['chase','spray'],
      description: 'Kupu-kupu penyerbuk',
      naturalControl: 'Biarkan mereka bebas 🦋',
      speed: 7000,  // Speed increased
      points: 0
    },
    {
      id:'kumbang', emoji:'🐞', isHama:false,
      goodTool:[],
      badTool:['chase','spray'],
      description: 'Kumbang pemangsa hama',
      naturalControl: 'Biarkan membantu pohon 🐞',
      speed: 6500,  // Speed increased
      points: 0
    },
    {
      id:'semut', emoji:'🐜', isHama:true,
      goodTool:['stickyTrap','flower'],
      badTool:['pesticide'],
      description: 'Semut perusak batang',
      naturalControl: 'Daun lengket 🍃 atau Bunga 🌸',
      speed: 5000,  // Speed increased
      points: 15
    }
  ];

  // DOM Elements
  const startBtn = document.getElementById('startBtn');
  const scoreEl = document.getElementById('score');
  const timerCircle = document.getElementById('timerCircle');
  const bugArea = document.getElementById('bugArea');
  const tree = document.getElementById('tree');
  const messageBox = document.getElementById('messageBox');
  const avatarPakBurung = document.getElementById('avatarPakBurung');
  const toolsPanel = document.getElementById('toolsPanel');
  const eduBox = document.getElementById('eduBox');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const finalScoreText = document.getElementById('finalScoreText');
  const bugsDefeatedText = document.getElementById('bugsDefeatedText');
  const maxComboText = document.getElementById('maxComboText');
  const finalHealthText = document.getElementById('finalHealthText');
  const achievementText = document.getElementById('achievementText');
  const nextMissionBtn = document.getElementById('nextMissionBtn');
  const introOverlay = document.getElementById('introOverlay');
  const showHowToBtn = document.getElementById('showHowToBtn');
  const howToPlayOverlay = document.getElementById('howToPlayOverlay');
  const startGameBtn = document.getElementById('startGameBtn');
  const gameContainer = document.getElementById('gameContainer');
  const healthBar = document.getElementById('healthBar');
  const healthBarText = document.getElementById('healthBarText');
  const treeDeadOverlay = document.getElementById('treeDeadOverlay');
  const retryBtn = document.getElementById('retryBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseMenu = document.getElementById('pauseMenu');
  const resumeBtn = document.getElementById('resumeBtn');
  const restartBtn = document.getElementById('restartBtn');
  const howToPlayBtn = document.getElementById('howToPlayBtn');
  const comboIndicator = document.getElementById('combo-indicator');
  const comboCount = document.getElementById('combo-count');
  const powerups = {
    slowTime: document.getElementById('slowTime'),
    freezeBugs: document.getElementById('freezeBugs'),
    healthBoost: document.getElementById('healthBoost')
  };

  // Game state variables
  let gameTimer = null;
  let spawnTimer = null;
  let timeLeft = GAME_DURATION;
  let score = 0;
  let treeStage = 1;
  let bugsOnScreen = [];
  let gameRunning = false;
  let gamePaused = false;
  let selectedTool = null;
  let treeHealth = TREE_MAX_HEALTH;
  let currentBugSpawnInterval = INITIAL_BUG_SPAWN_INTERVAL;
  let consecutiveSuccess = 0;
  let maxCombo = 0;
  let difficultyFactor = 1.0;
  let bugsDefeated = 0;
  let currentTip = 0;
  let powerupStatus = {
    slowTimeAvailable: false,
    freezeBugsAvailable: false,
    healthBoostAvailable: false,
    bugsSlowed: false,
    bugsFrozen: false
  };

  // Map tool name to cursor css classes
  const toolCursorClasses = {
    spider: 'cursor-spider',
    bird: 'cursor-bird',
    stickyTrap: 'cursor-stickyTrap',
    flower: 'cursor-flower'
  };

  // --- Overlay Logic ---
  introOverlay.style.display = 'flex';
  howToPlayOverlay.style.display = 'none';
  gameContainer.classList.remove('active');
  pauseMenu.style.display = 'none';
  
  for (let key in powerups) {
    powerups[key].classList.remove('available');
  }

  // --- UTILITAS ---
  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  function updateTimerDisplay() {
    timerCircle.textContent = timeLeft;
    
    if (timeLeft <= 5) {
      timerCircle.style.color = '#b71c1c';
      timerCircle.style.borderColor = '#f44336';
      timerCircle.style.animation = 'pulse 0.5s infinite alternate';
    } else if (timeLeft <= 10) {
      timerCircle.style.color = '#ef6c00';
      timerCircle.style.borderColor = '#ff9800';
      timerCircle.style.animation = 'none';
    } else {
      timerCircle.style.color = 'var(--primary)';
      timerCircle.style.borderColor = 'var(--primary-light)';
      timerCircle.style.animation = 'none';
    }
  }
  
  function updateScoreDisplay() {
    scoreEl.textContent = score;
    
    // Check for tree growth based on score
    let newStage = Math.min(1 + Math.floor(score / TREE_GROWTH_SCORE), TREE_STAGES);
    if (newStage !== treeStage) {
      treeStage = newStage;
      updateTreeStage();
      
      // Show growing animation
      tree.style.filter = 'drop-shadow(0 4px 5px rgba(0,0,0,0.2)) brightness(1.3)';
      setTimeout(() => {
        tree.style.filter = 'drop-shadow(0 4px 5px rgba(0,0,0,0.2))';
      }, 500);
      
      // Show popup
      showPopup(tree.offsetLeft + tree.offsetWidth/2, tree.offsetTop + tree.offsetHeight/2, 
                "Pohon tumbuh! 🌿", "success");
      
      // Update tips based on tree stage
      showNextTip();
    }
    
    // Increase difficulty as score increases
    difficultyFactor = 1.0 + (score / 100);
    updateSpawnInterval();
    
    // Give power-ups based on score milestones
    if (score >= 30 && !powerupStatus.slowTimeAvailable) {
      powerupStatus.slowTimeAvailable = true;
      powerups.slowTime.classList.add('available');
      showMessage("Power-up Perlambat Waktu tersedia! ⏱️", 3000);
    }
    
    if (score >= 60 && !powerupStatus.freezeBugsAvailable) {
      powerupStatus.freezeBugsAvailable = true;
      powerups.freezeBugs.classList.add('available');
      showMessage("Power-up Bekukan Hama tersedia! ❄️", 3000);
    }
    
    if (score >= 100 && !powerupStatus.healthBoostAvailable) {
      powerupStatus.healthBoostAvailable = true;
      powerups.healthBoost.classList.add('available');
      showMessage("Power-up Boost Kesehatan tersedia! ❤️", 3000);
    }
  }
  
  function updateSpawnInterval() {
    // Gradually decrease spawn interval as game progresses
    currentBugSpawnInterval = Math.max(
      MIN_BUG_SPAWN_INTERVAL,
      INITIAL_BUG_SPAWN_INTERVAL - (timeLeft * 40) - (score * 2)
    );
    
    // If bugs are currently slowed, adjust accordingly
    if (powerupStatus.bugsSlowed) {
      currentBugSpawnInterval *= 2;
    }
    
    // Restart spawn timer with new interval
    if (spawnTimer) {
      clearInterval(spawnTimer);
      if (gameRunning && !gamePaused) {
        spawnTimer = setInterval(spawnBug, currentBugSpawnInterval);
      }
    }
  }
  
  function updateTreeStage() {
    tree.className = 'stage-' + treeStage;
    tree.alt = {
      1: 'Pohon kecil',
      2: 'Pohon bertunas',
      3: 'Pohon sedang tumbuh',
      4: 'Pohon dewasa kuat'
    }[treeStage];
  }
  
  function showMessage(text, duration=4000) {
    messageBox.textContent = text;
    messageBox.classList.add('visible');
    
    if(duration > 0){
      setTimeout(() => {
        messageBox.classList.remove('visible');
        setTimeout(() => {
          messageBox.textContent = '';
        }, 400);
      }, duration);
    }
  }
  
  function pakBurungSay(text, duration=5000) {
    showMessage("Pak Burung: " + text, duration);
    avatarPakBurung.classList.add('speaking');
    
    setTimeout(() => {
      avatarPakBurung.classList.remove('speaking');
    }, 1000);
  }
  
  function removeBug(bugElem) {
    let idx = bugsOnScreen.indexOf(bugElem);
    if(idx !== -1) bugsOnScreen.splice(idx, 1);
    if (bugElem.parentNode) bugElem.parentNode.removeChild(bugElem);
  }
  
  function updateHealthBar() {
    healthBar.style.width = treeHealth + "%";
    healthBarText.textContent = treeHealth + "%";
    
    if (treeHealth > 60) {
      healthBar.style.background = "linear-gradient(90deg, var(--primary-light) 60%, #a8e6cf 100%)";
      healthBarText.style.color = "var(--primary-dark)";
    } else if (treeHealth > 30) {
      healthBar.style.background = "linear-gradient(90deg, var(--warning) 60%, #ffe082 100%)";
      healthBarText.style.color = "#806000";
    } else {
      healthBar.style.background = "linear-gradient(90deg, var(--danger) 60%, #ffcdd2 100%)";
      healthBarText.style.color = "#7f0000";
      
      // Critical health animation
      if (treeHealth <= 20) {
        healthBar.style.animation = "pulse 0.8s infinite alternate";
      }
    }
  }
  
  function decreaseHealth(amount) {
    // Add screen shake effect for damage
    gameContainer.style.animation = "shake 0.3s";
    setTimeout(() => {
      gameContainer.style.animation = "";
    }, 300);
    
    treeHealth -= amount;
    if (treeHealth < 0) treeHealth = 0;
    updateHealthBar();
    
    if (treeHealth <= 0) {
      treeDies();
    }
  }
  
  function increaseHealth(amount) {
    treeHealth = Math.min(treeHealth + amount, TREE_MAX_HEALTH);
    updateHealthBar();
    
    // Show healing animation
    healthBar.style.filter = "brightness(1.3)";
    setTimeout(() => {
      healthBar.style.filter = "none";
    }, 500);
    
    showPopup(healthBarContainer.offsetLeft + healthBarContainer.offsetWidth/2, 
              healthBarContainer.offsetTop, "+" + amount + "% ❤️", "success");
  }
  
  function resetHealth() {
    treeHealth = TREE_MAX_HEALTH;
    updateHealthBar();
    healthBar.style.animation = "none";
  }
  
  function treeDies() {
    gameRunning = false;
    clearInterval(gameTimer);
    clearInterval(spawnTimer);
    resetSelectedTool();
    messageBox.classList.remove('visible');
    treeDeadOverlay.style.display = 'flex';
    
    // Show final tree state
    tree.style.filter = "grayscale(1) brightness(0.7)";
    tree.style.transform = "translateX(-50%) rotate(5deg)";
    
    // Stop all bug animations
    bugsOnScreen.forEach(bug => {
      bug.style.animationPlayState = 'paused';
    });
  }
  
  function bugReachedPohon(bugElem, bugData) {
    if (bugElem.dataset.killed === 'true' || gamePaused) return;
    
    if (bugData.isHama) {
      pakBurungSay(`Oh tidak! ${bugData.emoji} ${bugData.description} menyerang pohon!`);
      score = Math.max(0, score - 5);
      updateScoreDisplay();
      
      // Reset combo
      consecutiveSuccess = 0;
      comboIndicator.classList.remove('active');
      
      // Damage tree
      decreaseHealth(TREE_HIT_DAMAGE);
      
      // Show damage popup
      showPopup(tree.offsetLeft + tree.offsetWidth/2, 
                tree.offsetTop + tree.offsetHeight/2, 
                "-" + TREE_HIT_DAMAGE + "% ❤️", "error");
                
      // Weaken tree if it gets hit too much
      if (treeHealth < 50 && treeStage > 1) {
        weakenTree();
      }
    } else {
      pakBurungSay(`${bugData.emoji} ${bugData.description} membantu pohonmu tumbuh!`);
      increaseHealth(5);
      addScore(5);
    }
  }
  
  function weakenTree() {
    if (treeStage > 1) {
      treeStage--;
      updateTreeStage();
      showPopup(tree.offsetLeft + tree.offsetWidth/2, 
                tree.offsetTop + tree.offsetHeight/2, 
                "Pohon melemah! 😟", "error");
    }
  }
  
  function resetSelectedTool() {
    selectedTool = null;
    document.body.classList.remove(...Object.values(toolCursorClasses));
    toolsPanel.querySelectorAll('.tool').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-pressed', 'false');
    });
  }
  
  function selectTool(tool) {
    if (selectedTool === tool) {
      resetSelectedTool();
    } else {
      selectedTool = tool;
      document.body.classList.remove(...Object.values(toolCursorClasses));
      let cursorClass = toolCursorClasses[tool];
      if(cursorClass) document.body.classList.add(cursorClass);
      
      toolsPanel.querySelectorAll('.tool').forEach(t => {
        if (t.dataset.tool === tool) {
          t.classList.add('active');
          t.setAttribute('aria-pressed', 'true');
        }
        else {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        }
      });
      
      pakBurungSay(`Alat dipilih: ${toolToName(tool)}`);
    }
  }
  
  function toolToName(tool) {
    return {
      spider: 'Laba-laba',
      bird: 'Burung pemakan serangga',
      stickyTrap: 'Perangkap daun lengket',
      flower: 'Bunga pengusir hama',
      pesticide: 'Pestisida kimia',
      plasticNet: 'Jaring plastik',
      chase: 'Mengusir',
      spray: 'Menyemprot'
    }[tool] || tool;
  }
  
  function addScore(amount) {
    score += amount;
    if (score < 0) score = 0;
    updateScoreDisplay();
  }
  
  function showCatchAnimation(bugElem, bugData, success=true) {
    bugElem.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.5s ease';
    
    if (success) {
      // Success animation
      bugElem.style.transform = 'scale(0) rotate(180deg)';
      bugElem.style.opacity = '0';
      
      // Particle effect for success
      createParticles(
        bugElem.offsetLeft + bugElem.offsetWidth/2, 
        bugElem.offsetTop + bugElem.offsetHeight/2,
        success ? '#4caf50' : '#f44336'
      );
    } else {
      // Error animation
      bugElem.style.transform = 'scale(0.5) rotate(45deg)';
      bugElem.style.opacity = '0.3';
    }
  }
  
  function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.zIndex = '100';
      particle.style.pointerEvents = 'none';
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      const opacity = 0.7 + Math.random() * 0.3;
      
      particle.style.opacity = opacity;
      
      document.body.appendChild(particle);
      
      // Animate the particle
      let moveX = 0;
      let moveY = 0;
      const animateParticle = () => {
        moveX += Math.cos(angle) * speed;
        moveY += Math.sin(angle) * speed + 0.2; // Add a bit of gravity
        
        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        particle.style.opacity = parseFloat(particle.style.opacity) - 0.02;
        
        if (parseFloat(particle.style.opacity) > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animateParticle);
    }
  }
  
  function showPopup(x, y, text, type = 'success') {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 1200);
  }
  
  function updateCombo(success) {
    if (success) {
      consecutiveSuccess++;
      if (consecutiveSuccess >= COMBO_THRESHOLD) {
        comboCount.textContent = consecutiveSuccess;
        comboIndicator.classList.add('active');
        
        if (consecutiveSuccess > maxCombo) {
          maxCombo = consecutiveSuccess;
        }
      }
    } else {
      consecutiveSuccess = 0;
      comboIndicator.classList.remove('active');
    }
  }
  
  function showNextTip() {
    eduBox.innerHTML = `<b>Tips Alam:</b> ${EDUCATIONAL_TIPS[currentTip]}`;
    currentTip = (currentTip + 1) % EDUCATIONAL_TIPS.length;
  }
  
  function activatePowerup(type) {
    switch(type) {
      case 'slowTime':
        if (!powerupStatus.slowTimeAvailable) return;
        
        powerupStatus.slowTimeAvailable = false;
        powerupStatus.bugsSlowed = true;
        powerups.slowTime.classList.remove('available');
        
        // Slow down all bugs currently on screen
        bugsOnScreen.forEach(bug => {
          bug.classList.add('slow-motion');
        });
        
        showPopup(timerCircle.offsetLeft + timerCircle.offsetWidth/2, 
                  timerCircle.offsetTop + timerCircle.offsetHeight/2,
                  "Waktu Diperlambat!", "success");
        
        // Effect lasts for 5 seconds
        setTimeout(() => {
          powerupStatus.bugsSlowed = false;
          bugsOnScreen.forEach(bug => {
            bug.classList.remove('slow-motion');
          });
          updateSpawnInterval();
        }, 5000);
        break;
        
      case 'freezeBugs':
        if (!powerupStatus.freezeBugsAvailable) return;
        
        powerupStatus.freezeBugsAvailable = false;
        powerupStatus.bugsFrozen = true;
        powerups.freezeBugs.classList.remove('available');
        
        // Freeze all bugs currently on screen
        bugsOnScreen.forEach(bug => {
          const originalTransition = bug.style.transition;
          bug.style.transition = 'none';
          bug.dataset.frozen = 'true';
          
          // Add freeze effect
          bug.style.filter = 'drop-shadow(0 0 5px #42a5f5) brightness(1.2)';
          
          setTimeout(() => {
            bug.style.transition = originalTransition;
          }, 50);
        });
        
        showPopup(gameContainer.offsetWidth / 2, gameContainer.offsetHeight / 2,
                  "Hama Dibekukan!", "success");
        
        // Effect lasts for 3 seconds
        setTimeout(() => {
          powerupStatus.bugsFrozen = false;
          bugsOnScreen.forEach(bug => {
            bug.dataset.frozen = 'false';
            bug.style.filter = '';
          });
        }, 3000);
        break;
        
      case 'healthBoost':
        if (!powerupStatus.healthBoostAvailable) return;
        
        powerupStatus.healthBoostAvailable = false;
        powerups.healthBoost.classList.remove('available');
        
        // Boost tree health
        increaseHealth(20);
        showPopup(healthBarContainer.offsetLeft + healthBarContainer.offsetWidth/2, 
                  healthBarContainer.offsetTop,
                  "+20% Kesehatan!", "success");
        break;
    }
  }

  // --- GAME LOGIC ---
  function spawnBug() {
    if (!gameRunning || gamePaused) return;
    
    // Select random bug, with weighting that increases difficult bugs as game progresses
    let selection;
    let weightedSelection = Math.random() * difficultyFactor;
    
    if (weightedSelection > 0.8) {
      // More difficult/faster bugs
      selection = BUGS_DATA.filter(b => b.speed < 4000);
    } else if (weightedSelection > 0.4) {
      // Medium difficulty
      selection = BUGS_DATA.filter(b => b.speed >= 3800);
    } else {
      // Random selection from all bugs
      selection = BUGS_DATA;
    }
    
    // Add beneficial bugs (kupu-kupu & kumbang) periodically
    if (Math.random() < 0.15) {
      selection = BUGS_DATA.filter(b => !b.isHama);
    }
    
    const bugData = selection[Math.floor(Math.random() * selection.length)];
    const bugElem = document.createElement('div');
    bugElem.classList.add('bug');
    bugElem.setAttribute('aria-label', `${bugData.id}, ${bugData.isHama ? 'hama' : 'bukan hama'}`);
    bugElem.dataset.bugId = bugData.id;
    bugElem.dataset.isHama = bugData.isHama;
    bugElem.dataset.killed = 'false';
    bugElem.dataset.frozen = 'false';
    bugElem.style.top = Math.random() < 0.5 ? '-40px' : (Math.random() * (bugArea.clientHeight - 100)) + 'px';

    // Random side: true = left side, false = right side
    const fromLeft = Math.random() < 0.5;
    bugElem.style.left = fromLeft ? '-50px' : (bugArea.clientWidth + 50) + 'px';

    bugElem.innerHTML = `<div>${bugData.emoji}</div><div class="bug-label">
      <strong>${capitalize(bugData.id)}</strong><br>
      ${bugData.isHama ? 'Basmi: ' + bugData.naturalControl : 'Bukan hama! Biarkan!'}
    </div>`;

    bugElem.addEventListener('click', function(e) {
      if (!gameRunning || gamePaused) return;
      if (bugElem.dataset.killed === 'true') return;
      if (bugElem.dataset.frozen === 'true') return;
      
      if (!selectedTool) {
        pakBurungSay('Pilih alat terlebih dahulu untuk mengusir hama!');
        return;
      }
      
      const bugId = bugElem.dataset.bugId;
      const bugDataObj = BUGS_DATA.find(b => b.id === bugId);
      if (!bugDataObj) return;
      
      if (selectedTool === 'pesticide' || selectedTool === 'plasticNet' || 
          selectedTool === 'chase' || selectedTool === 'spray') {
        pakBurungSay('Hindari penggunaan cara kasar! Gunakan pengendalian alami.');
        updateCombo(false);
        return;
      }
      
      if (!bugDataObj.isHama) {
        if (['flower','spider','bird','stickyTrap'].includes(selectedTool)) {
          pakBurungSay(`${bugDataObj.emoji} ${bugDataObj.description} tidak perlu dibasmi!`);
          updateCombo(false);
          return;
        }
      }
      
      if (bugDataObj.goodTool.includes(selectedTool)) {
        pakBurungSay(`Bagus! ${toolToName(selectedTool)} efektif untuk menangani ${bugDataObj.emoji}.`, 3000);
        bugElem.dataset.killed = 'true';
        bugsDefeated++;
        
        // Calculate score with combo bonus if applicable
        let earnedPoints = bugDataObj.points;
        if (consecutiveSuccess >= COMBO_THRESHOLD) {
          earnedPoints += COMBO_BONUS;
        }
        addScore(earnedPoints);
        
        // Show score popup
        showPopup(
          bugElem.offsetLeft + bugElem.offsetWidth/2, 
          bugElem.offsetTop,
          "+" + earnedPoints, "success"
        );
        
        updateCombo(true);
        showCatchAnimation(bugElem, bugDataObj, true);
        setTimeout(() => {
          removeBug(bugElem);
        }, 600);
      } else if (bugDataObj.badTool.includes(selectedTool)) {
        pakBurungSay(`${toolToName(selectedTool)} tidak ramah lingkungan!`);
        addScore(-5);
        updateCombo(false);
        showPopup(
          bugElem.offsetLeft + bugElem.offsetWidth/2, 
          bugElem.offsetTop,
          "-5", "error"
        );
        showCatchAnimation(bugElem, bugDataObj, false);
        setTimeout(() => {
          removeBug(bugElem);
        }, 600);
      } else {
        pakBurungSay(`${toolToName(selectedTool)} kurang efektif untuk ${bugDataObj.emoji}, coba alat lain.`);
        addScore(-3);
        updateCombo(false);
        showPopup(
          bugElem.offsetLeft + bugElem.offsetWidth/2, 
          bugElem.offsetTop,
          "Tidak efektif", "warning"
        );
      }
    });

    bugArea.appendChild(bugElem);
    bugsOnScreen.push(bugElem);

    animateBugToTree(bugElem, bugData, fromLeft);
  }

  function animateBugToTree(bugElem, bugData, fromLeft) {
    const treeAreaWidth = bugArea.clientWidth;
    const treeAreaHeight = bugArea.clientHeight;
    let startX = parseFloat(bugElem.style.left);
    let startY = parseFloat(bugElem.style.top);
    let targetX = (treeAreaWidth / 2) - 15;
    let targetY = treeAreaHeight - 80; // Adjusted to be above ground
    
    // Variasi jalur (noise) untuk bug yang berbeda
    targetX += (Math.random() - 0.5) * 100;
    
    // For non-pests, make them move in a more wandering path
    if (!bugData.isHama) {
      targetX = startX + (Math.random() * 400 - 200);
      targetY = startY + (Math.random() * 300);
      
      if (targetX < 0) targetX = 50;
      if (targetX > treeAreaWidth) targetX = treeAreaWidth - 50;
      if (targetY < 0) targetY = 50;
      if (targetY > treeAreaHeight - 120) targetY = treeAreaHeight - 120; // Keep above ground
    }
    
    // Speed varies by bug type
    let duration = powerupStatus.bugsSlowed ? bugData.speed * 2 : bugData.speed;
    
    // Control points for bezier curve motion
    const cp1x = startX + (targetX - startX) * 0.3 + (Math.random() - 0.5) * 150;
    const cp1y = startY + (targetY - startY) * 0.1 + (Math.random() - 0.5) * 100;
    const cp2x = startX + (targetX - startX) * 0.7 + (Math.random() - 0.5) * 150;
    const cp2y = startY + (targetY - startY) * 0.9 + (Math.random() - 0.5) * 100;
    
    let startTime = null;

    function animate(time) {
      if (!gameRunning) return;
      if (gamePaused) {
        requestAnimationFrame(animate);
        return;
      }
      
      if (bugElem.dataset.frozen === 'true') {
        requestAnimationFrame(animate);
        return;
      }
      
      if (!startTime) startTime = time;
      let elapsed = time - startTime;
      let progress = Math.min(elapsed / duration, 1);
      
      // Cubic bezier calculation for smoother, more natural movement
      function calculateBezierPoint(t, p0, p1, p2, p3) {
        const cX = 3 * (p1 - p0);
        const bX = 3 * (p2 - p1) - cX;
        const aX = p3 - p0 - cX - bX;
        
        return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
      }
      
      let currentX = calculateBezierPoint(progress, startX, cp1x, cp2x, targetX);
      let currentY = calculateBezierPoint(progress, startY, cp1y, cp2y, targetY);
      
      bugElem.style.left = currentX + 'px';
      bugElem.style.top = currentY + 'px';
      
      // No rotation animation as requested
      // Just add a small vertical movement for butterflies/non-pests
      if (!bugData.isHama) {
        bugElem.style.transform = `translateY(${Math.sin(progress * 20) * 5}px)`;
      }
      
      if (progress < 1 && bugElem.dataset.killed !== 'true') {
        requestAnimationFrame(animate);
      } else if (progress >= 1 && bugElem.dataset.killed !== 'true') {
        bugReachedPohon(bugElem, bugData);
        removeBug(bugElem);
      }
    }
    
    requestAnimationFrame(animate);
  }

  function startGame() {
    if (gameRunning) return;
    
    // Initialize game state
    gameRunning = true;
    gamePaused = false;
    score = 0;
    timeLeft = GAME_DURATION;
    treeStage = 1;
    consecutiveSuccess = 0;
    maxCombo = 0;
    bugsDefeated = 0;
    difficultyFactor = 1.0;
    currentBugSpawnInterval = INITIAL_BUG_SPAWN_INTERVAL;
    currentTip = 0;
    
    // Reset power-ups
    powerupStatus = {
      slowTimeAvailable: false,
      freezeBugsAvailable: false,
      healthBoostAvailable: false,
      bugsSlowed: false,
      bugsFrozen: false
    };
    
    for (let key in powerups) {
      powerups[key].classList.remove('available');
    }
    
    // Reset UI
    resetHealth();
    updateTreeStage();
    updateScoreDisplay();
    updateTimerDisplay();
    messageBox.classList.remove('visible');
    comboIndicator.classList.remove('active');
    
    // Clear any bugs from previous game
    bugsOnScreen.forEach(bug => {
      if (bug.parentNode) bug.parentNode.removeChild(bug);
    });
    bugsOnScreen = [];
    
    // Reset visuals
    tree.style.filter = '';
    tree.style.transform = 'translateX(-50%)';
    
    // Hide overlays
    gameOverOverlay.style.display = 'none';
    treeDeadOverlay.style.display = 'none';
    pauseMenu.style.display = 'none';
    introOverlay.style.display = 'none';
    howToPlayOverlay.style.display = 'none';
    
    // Show game container
    gameContainer.classList.add('active');
    
    // Reset tool selection
    resetSelectedTool();
    
    // Show initial tip
    showNextTip();
    
    // Start timers
    gameTimer = setInterval(() => {
      if (gamePaused) return;
      
      timeLeft--;
      updateTimerDisplay();
      
      // Show next tip every 8 seconds
      if (timeLeft % 8 === 0) {
        showNextTip();
      }
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
    
    spawnTimer = setInterval(spawnBug, currentBugSpawnInterval);
    
    // Initial welcome message
    pakBurungSay("Lindungi pohon dari hama! Pilih alat yang tepat untuk setiap jenis hama.");
  }

  function pauseGame() {
    if (!gameRunning || gamePaused) return;
    
    gamePaused = true;
    pauseMenu.style.display = 'flex';
    
    // Pause all animations
    bugsOnScreen.forEach(bug => {
      bug.style.animationPlayState = 'paused';
    });
    
    clearInterval(gameTimer);
    clearInterval(spawnTimer);
  }
  
  function resumeGame() {
    if (!gameRunning || !gamePaused) return;
    
    gamePaused = false;
    pauseMenu.style.display = 'none';
    
    // Resume all animations
    bugsOnScreen.forEach(bug => {
      bug.style.animationPlayState = 'running';
    });
    
    // Restart timers
    gameTimer = setInterval(() => {
      if (gamePaused) return;
      
      timeLeft--;
      updateTimerDisplay();
      
      if (timeLeft % 8 === 0) {
        showNextTip();
      }
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
    
    spawnTimer = setInterval(spawnBug, currentBugSpawnInterval);
  }

  function endGame() {
    gameRunning = false;
    clearInterval(gameTimer);
    clearInterval(spawnTimer);
    resetSelectedTool();
    messageBox.classList.remove('visible');
    
    // Set final stats
    finalScoreText.textContent = score;
    bugsDefeatedText.textContent = bugsDefeated;
    maxComboText.textContent = maxCombo;
    finalHealthText.textContent = treeHealth + "%";
    
    // Determine achievement level
    let achievement = "Penjaga Pohon";
    if (score >= 150) achievement = "Pelindung Pohon Legendaris";
    else if (score >= 100) achievement = "Pakar Pengendalian Hama";
    else if (score >= 50) achievement = "Sahabat Lingkungan";
    
    achievementText.textContent = "Penghargaan: " + achievement + "!";
    
    // Show game over overlay
    gameOverOverlay.style.display = 'flex';
    
    // Show a celebratory message
    pakBurungSay(`Misi selesai! Kamu berhasil melindungi pohon dengan baik!`);
    
    // Final tree animation
    if (treeHealth > 50) {
      tree.style.filter = 'drop-shadow(0 8px 12px rgba(0,0,0,0.3)) brightness(1.1)';
      createParticles(
        tree.offsetLeft + tree.offsetWidth/2, 
        tree.offsetTop + tree.offsetHeight/2,
        '#4caf50'
      );
    }
  }

  // --- EVENT LISTENERS ---
  toolsPanel.querySelectorAll('.tool').forEach(toolElem => {
    toolElem.addEventListener('click', () => {
      if (!gameRunning || gamePaused) return;
      selectTool(toolElem.dataset.tool);
    });
    
    toolElem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!gameRunning || gamePaused) return;
        selectTool(toolElem.dataset.tool);
      }
    });
  });
  
  // Power-up listeners
  for (let key in powerups) {
    powerups[key].addEventListener('click', () => {
      if (!gameRunning || gamePaused) return;
      activatePowerup(key);
    });
  }
  
  // Pause button
  pauseBtn.addEventListener('click', () => {
    if (gamePaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  });
  
  // Pause menu buttons
  resumeBtn.addEventListener('click', resumeGame);
  restartBtn.addEventListener('click', startGame);
  howToPlayBtn.addEventListener('click', () => {
    pauseMenu.style.display = 'none';
    howToPlayOverlay.style.display = 'flex';
  });
  
  // Overlay buttons
  showHowToBtn.addEventListener('click', function() {
    introOverlay.style.display = 'none';
    howToPlayOverlay.style.display = 'flex';
  });
  
  startGameBtn.addEventListener('click', function() {
    howToPlayOverlay.style.display = 'none';
    startGame();
  });
  
  nextMissionBtn.addEventListener('click', () => {
    fadeTransition.classList.add('active');
    setTimeout(() => {
      window.location.href = 'game-tunarunguOceanMission.html';
    }, 700);
  });

  retryBtn.addEventListener('click', () => {
    treeDeadOverlay.style.display = 'none';
    startGame();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    switch(e.key) {
      case 'p':
      case 'P':
        if (gamePaused) resumeGame();
        else pauseGame();
        break;
      case '1':
        selectTool('spider');
        break;
      case '2':
        selectTool('bird');
        break;
      case '3':
        selectTool('stickyTrap');
        break;
      case '4':
        selectTool('flower');
        break;
      case 'Escape':
        if (gamePaused) resumeGame();
        else pauseGame();
        break;
    }
  });

  // Prevent scroll on mobile
  window.addEventListener('touchmove', function(e) {
    if (gameRunning) e.preventDefault();
  }, { passive: false });
  
  // Animation for pause button
  pauseBtn.addEventListener('mouseenter', () => {
    pauseBtn.style.transform = 'scale(1.1)';
  });
  
  pauseBtn.addEventListener('mouseleave', () => {
    pauseBtn.style.transform = 'scale(1)';
  });
  
  // Add CSS animation for critical effects
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  // --- FADING TRANSITION LOGIC ---
  const fadeTransition = document.getElementById('fadeTransition');
  // Pastikan elemen sudah ada
  if (fadeTransition) {
    // Fade out saat halaman selesai dimuat
    window.addEventListener('DOMContentLoaded', () => {
      fadeTransition.classList.add('active');
      setTimeout(() => {
        fadeTransition.classList.remove('active');
      }, 700);
    });
  }

  // Fade in saat klik next mission
  nextMissionBtn.addEventListener('click', () => {
    if (fadeTransition) {
      fadeTransition.classList.add('active');
      setTimeout(() => {
        window.location.href = 'game-tunarunguOceanMission.html';
      }, 700);
    } else {
      window.location.href = 'game-tunarunguOceanMission.html';
    }
  });
})();