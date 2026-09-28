/**
 * ===================================================================
 * HANDMADE DIGITAL KEEPSAKE - script.js
 * ===================================================================
 */

// ===================================================================
// 1. MUSIC PLAYER LOGIC
// ===================================================================
function togglePlay(trackId) {
  const allAudio = document.querySelectorAll('audio');
  const clickedAudio = document.getElementById(trackId);
  const clickedIcon = document.getElementById('icon-' + trackId);
  const clickedTrackItem = clickedAudio.closest('.track');

  const isPlaying = !clickedAudio.paused;

  // Pause ALL songs and reset ALL icons/highlights
  allAudio.forEach(audio => {
    audio.pause();
    const icon = document.getElementById('icon-' + audio.id);
    if (icon) icon.textContent = '▶️';
    const track = audio.closest('.track');
    if (track) track.classList.remove('playing');
  });

  // Play if it wasn't playing
  if (!isPlaying) {
    clickedAudio.play();
    clickedIcon.textContent = '⏸️';
    clickedTrackItem.classList.add('playing');
  }
}

// Reset when a song ends naturally
document.querySelectorAll('audio').forEach(audio => {
  audio.addEventListener('ended', function () {
    const icon = document.getElementById('icon-' + this.id);
    if (icon) icon.textContent = '▶️';
    const track = this.closest('.track');
    if (track) track.classList.remove('playing');
  });
});


// ===================================================================
// 2. PASSWORD LOCK LOGIC
// ===================================================================
function unlockMessage() {
  const input = document.getElementById('passcode-input');
  const errorMsg = document.getElementById('passcode-error');
  const overlay = document.getElementById('lock-screen');
  const content = document.getElementById('secret-text');

  // CHANGE THIS TO WHATEVER 3 NUMBERS YOU WANT!
  const correctPassword = "928";

  if (input.value === correctPassword) {
    // Success! Hide the overlay and remove the blur
    overlay.classList.add('hidden');
    content.classList.remove('blurred');
    errorMsg.classList.remove('show');
  } else {
    // Fail! Show error text and shake the input box
    errorMsg.classList.add('show');
    input.classList.add('shake');

    // Remove the shake class after animation finishes so it can shake again next time
    setTimeout(() => {
      input.classList.remove('shake');
    }, 300);

    // Clear what they typed
    input.value = '';
  }
}


// ===================================================================
// 3. CONTINUOUS "PASSING BY" PHOTO CAROUSEL
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector('.photo-carousel');

  if (carousel) {
    // 1. Clone the photos so it creates a seamless infinite loop!
    const photos = Array.from(carousel.children);
    photos.forEach(photo => {
      const clone = photo.cloneNode(true);
      carousel.appendChild(clone);
    });

    let isPaused = false;
    let scrollSpeed = 0.8; // Adjust this! Higher = faster, Lower = slower (e.g., 0.5 or 1.5)

    // 2. The function that constantly moves the scrollbar
    function continuousScroll() {
      if (!isPaused) {
        carousel.scrollLeft += scrollSpeed;

        // If we've scrolled exactly halfway (the end of the original photos),
        // instantly and invisibly jump back to the beginning so it never stops!
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      // Tell the browser to run this function again on the next frame
      requestAnimationFrame(continuousScroll);
    }

    // Start the animation
    requestAnimationFrame(continuousScroll);

    // 3. INTERACTIVITY: Pause the glide if she touches or hovers over it
    ['mouseenter', 'touchstart', 'mousedown'].forEach(evt => {
      carousel.addEventListener(evt, () => isPaused = true);
    });

    // Resume the glide when she lets go
    ['mouseleave', 'touchend', 'mouseup'].forEach(evt => {
      carousel.addEventListener(evt, () => isPaused = false);
    });
  }
});

// ===================================================================
// 4. INTERACTIVE FLOWER LOADER LOGIC
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById('interactive-flower-loader');
  const flowerField = document.getElementById('flower-field');
  const bouquetBox = document.getElementById('bouquet-box');
  const boxLabel = document.querySelector('.box-label');
  const collectedFlowersContainer = document.getElementById('collected-flowers');

  if (!loader || !flowerField) return;

  const totalFlowers = 3;
  let collectedCount = 0;
  const flowerTypes = ['🌸', '🌷', '🌻', '🌼', '🌺'];

  // 1. SCATTER THE FLOWERS ACROSS THE SCREEN
  for (let i = 0; i < totalFlowers; i++) {
    const flower = document.createElement('div');
    flower.classList.add('scattered-flower');
    flower.textContent = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    // Randomize position
    const randomX = Math.floor(Math.random() * 70) + 10;
    const randomY = Math.floor(Math.random() * 50) + 15;

    flower.style.left = `${randomX}vw`;
    flower.style.top = `${randomY}vh`;
    flower.style.animationDelay = `${Math.random() * 2}s`;

    // 2. WHEN SHE CLICKS A FLOWER
    flower.addEventListener('click', function () {
      if (!this.classList.contains('collected')) {
        // Hide it from the field
        this.classList.add('collected');
        collectedCount++;

        // Make it appear in the box
        const boxedFlower = document.createElement('span');
        boxedFlower.textContent = this.textContent;
        boxedFlower.classList.add('flower-pop');

        const randomTilt = Math.floor(Math.random() * 30) - 15;
        boxedFlower.style.transform = `rotate(${randomTilt}deg)`;

        collectedFlowersContainer.appendChild(boxedFlower);

        // Update the text & bounce the box
        boxLabel.textContent = `${collectedCount} / ${totalFlowers} collected`;
        bouquetBox.style.transform = 'scale(1.05)';
        setTimeout(() => bouquetBox.style.transform = 'scale(1)', 150);

        // 3. CHECK IF ALL FLOWERS ARE COLLECTED
        if (collectedCount === totalFlowers) {
          boxLabel.textContent = "Bouquet complete! 💐";

          setTimeout(() => {
            // Step A: Hide the instructions and the small collection box
            const instruction = document.querySelector('.loader-instruction');
            if (instruction) instruction.style.opacity = '0';
            bouquetBox.style.opacity = '0';

            // Step B: Copy the collected flowers into the giant center bouquet
            const bigBouquetFlowers = document.getElementById('big-bouquet-flowers');
            if (bigBouquetFlowers) bigBouquetFlowers.innerHTML = collectedFlowersContainer.innerHTML;

            // Step C: Trigger the big reveal animation
            const bigReveal = document.getElementById('big-bouquet-reveal');
            if (bigReveal) bigReveal.classList.add('show');

            // Step D: Let her admire it for 2.5 seconds, then load the main website
            setTimeout(() => {
              loader.classList.add('hidden');

              // (Optional) Paste it to the bottom of the page as a keepsake
              const finalDisplay = document.getElementById('final-bouquet-display');
              const keepsakeFlowers = document.getElementById('keepsake-flowers');
              if (finalDisplay && keepsakeFlowers) {
                keepsakeFlowers.innerHTML = collectedFlowersContainer.innerHTML;
                finalDisplay.style.display = 'flex';
              }
            }, 2500);

          }, 600); // Waits half a second after the last flower enters the small box
        }
      }
    });

    flowerField.appendChild(flower);
  }
});