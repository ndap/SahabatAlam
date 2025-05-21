    // script.js

window.addEventListener("load", function () {
    const fadeElement = document.getElementById("fade");

    fadeElement.addEventListener("animationend", function () {
      fadeElement.style.display = "none";
    });
  });

  const gameContainer = document.querySelector(".game-container");
  const trashCan = document.getElementById("trashCan");
  const scoreDisplay = document.getElementById("score");
  const remainingDisplay = document.getElementById("remaining");
  const missionPopup = document.getElementById("missionPopup");
  const startPopup = document.getElementById("startPopup");
  const pickSound = document.getElementById("pickSound");
  const dropSound = document.getElementById("dropSound");
  const backgroundMusic = document.getElementById("backgroundMusic");
  let score = 0;
  let remainingTrash = 20;
  let isDragging = false;

  const trashImages = [
    "../assets/sprite/sampah7.png",
    "../assets/sprite/sampah2.png",
    "../assets/sprite/sampah3.png",
    "../assets/sprite/sampah4.png",
    "../assets/sprite/sampah5.png",
    "../assets/sprite/sampah6.png",
  ];

  function isInRestrictedArea(x, y, containerWidth, containerHeight) {
    const rightRestriction =
      x > containerWidth - 350 && y > containerHeight - 300;
    const leftRestriction = x < 200 && y > containerHeight - 300;
    return rightRestriction || leftRestriction;
  }

  function getRandomPosition() {
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    let x, y;
    do {
      x = Math.random() * (containerWidth - 100) + 50;
      y = Math.random() * (containerHeight - 100) + 50;
    } while (isInRestrictedArea(x, y, containerWidth, containerHeight));

    return { x, y };
  }

  function createScorePopup(x, y) {
    const popup = document.createElement("div");
    popup.classList.add("score-popup");
    popup.textContent = "+10";
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    gameContainer.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  function createTrash() {
    for (let i = 0; i < remainingTrash; i++) {
      let trash = document.createElement("div");
      trash.classList.add("trash");
      let trashType =
        trashImages[Math.floor(Math.random() * trashImages.length)];
      trash.style.background = `url('${trashType}') no-repeat center center/contain`;
      let position = getRandomPosition();
      trash.style.left = `${position.x}px`;
      trash.style.top = `${position.y}px`;
      trash.draggable = true;

      trash.addEventListener("dragstart", dragStart);
      trash.addEventListener("dragend", dragEnd);

      gameContainer.appendChild(trash);
    }
  }

  function dragStart(event) {
    isDragging = true;
    event.dataTransfer.setData("text", "");
    event.target.classList.add("dragging");
    trashCan.classList.add("highlight");
    if (pickSound) pickSound.play();
  }

  function dragEnd(event) {
    isDragging = false;
    event.target.classList.remove("dragging");
    trashCan.classList.remove("highlight");
  }

  trashCan.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (isDragging) {
      trashCan.classList.add("highlight");
    }
  });

  trashCan.addEventListener("dragleave", () => {
    trashCan.classList.remove("highlight");
  });

  trashCan.addEventListener("drop", (event) => {
    event.preventDefault();
    trashCan.classList.remove("highlight");

    let draggedItem = document.querySelector(".dragging");
    if (draggedItem) {
      const rect = draggedItem.getBoundingClientRect();
      createScorePopup(rect.left, rect.top);

      draggedItem.classList.add("collection-animation");
      if (dropSound) dropSound.play();

      setTimeout(() => {
        draggedItem.remove();
        score += 10;
        remainingTrash -= 1;
        scoreDisplay.textContent = score;
        remainingDisplay.textContent = remainingTrash;

        if (remainingTrash === 0) {
          setTimeout(() => {
            missionPopup.classList.add("show");
          }, 500);
        }
      }, 500);
    }
  });

  window.onload = function () {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("startPopup").style.display = "block";
  };

  function startGame() {
    const overlay = document.getElementById("overlay");
    const startPopup = document.getElementById("startPopup");

    // Start playing background music
    backgroundMusic.volume = 0.2; // Set volume to 50%
    backgroundMusic.play().catch((error) => {
      console.log("Audio play failed:", error);
    });

    overlay.style.opacity = "0";
    startPopup.style.opacity = "0";

    setTimeout(() => {
      overlay.style.display = "none";
      startPopup.style.display = "none";
      createTrash();
    }, 500);
  }

  function showVideo() {
    // Fade out background music
    const fadeOut = setInterval(() => {
      if (backgroundMusic.volume > 0.1) {
        backgroundMusic.volume -= 0.1;
      } else {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        clearInterval(fadeOut);
      }
    }, 100);
    // Add dark overlay to game
    const gameOverlay = document.createElement("div");
    gameOverlay.classList.add("game-overlay");
    document.body.appendChild(gameOverlay);

    // Fade in the dark overlay
    setTimeout(() => {
      gameOverlay.style.display = "block";
      gameOverlay.style.opacity = "1";
    }, 0);

    // Show video overlay
    const videoOverlay = document.getElementById("videoOverlay");
    const endVideo = document.getElementById("endVideo");

    videoOverlay.style.display = "block";
    endVideo.play();

    // Listen for video end
    endVideo.addEventListener("ended", () => {
      // Navigate to next page
      window.location.href = "../index.html";
    });
  }