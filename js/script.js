const words = ["can you hear it?",
    "what?",
    "who?",
    "you",
    "you me?",
    "yes you you",
    "i stopped my game to be here",
    "i stopped my life to be here",
    "have you?",
    "i live in the future",
    "so you already know?",
    "what?",
    "who?",
    "you",
    "who? me?", 
    "zoomout",
    "i am full", 
    "of what?",
    "abstract feeling",
    "o but what about love?",
    "i forget love",
    "not that i am incapable of love",
    "it's just that i see love as odd as wearing shoes",
    "...",
    "the world owes me a million",
    "computer crash",
    "i am free",
    "destroy" ];
    
    let currentWordIndex = 0;
    let customCursor = document.getElementById('cursor');
    const positions = []; // Store the position of each word
    const clickSound = document.getElementById('clickSound'); // Get the click sound element
    const explosionGif = document.getElementById('explosionGif'); // Get the GIF element
    const explosionSound = document.getElementById('explosionSound'); // Get the explosion sound element
    let gifShown = false; // Flag to ensure the GIF is shown only once

    // Function to wrap text nodes into individual letters and select other elements
    function wrapElements(element) {
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text.length > 0) {
            const wrappedText = [...text]
              .map((letter) => `<span class="letter">${letter}</span>`)
              .join('');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = wrappedText;
            node.replaceWith(wrapper);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          node.classList.add('falling-element'); // Add class to handle falling effect
          wrapElements(node); // Recursively wrap child nodes
        }
      });
    }

    // New function: Falling animation for elements
    function startFallingInAllDirections() {
      // Apply wrapElements to specified elements
      const elementsToWrap = document.querySelectorAll('#index, #exhibit, .container, p, li, a, img, div');
      elementsToWrap.forEach(wrapElements);

      const fallingItems = document.querySelectorAll('.letter, .falling-element');

      fallingItems.forEach((item) => {
        // Immediately apply falling effect
        const randomOffsetX = Math.random() * 300 - 150; // Random horizontal movement between -150 and 150
        const randomOffsetY = Math.random() * 300 - 150; // Random vertical movement between -150 and 150
        const fallDuration = Math.random() * 2 + 1; // Fall duration between 1 and 3 seconds

        item.style.transition = `transform ${fallDuration}s ease-in`;
        item.style.transform = `translate(${randomOffsetX}px, ${randomOffsetY}px) rotate(${Math.random() * 360}deg)`;
      });
    }

    // Canvas setup
    const canvas = document.getElementById('lineCanvas');
    const ctx = canvas.getContext('2d');

    // Resize the canvas to fit the screen
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

// Mouse movement to update custom cursor position and display word
document.addEventListener('mousemove', (e) => {
  customCursor.style.left = e.pageX + 'px';
  customCursor.style.top = e.pageY + 'px';
  customCursor.textContent = words[currentWordIndex]; // Show current word in the cursor

  // If there is at least one word placed, draw a line from the last word to the mouse
  if (positions.length > 0 && currentWordIndex < words.length) {
    const lastPosition = positions[positions.length - 1];
    drawLine(lastPosition.x, lastPosition.y, e.pageX, e.pageY);
  }
});

// On mouse click, place the current word on the screen
document.addEventListener('click', (e) => {
  if (currentWordIndex < words.length) {
    // Create a new element for the word
    const newWord = document.createElement('div');
    newWord.classList.add('text');
    newWord.style.left = e.pageX + 'px';
    newWord.style.top = e.pageY + 'px';
    newWord.textContent = words[currentWordIndex];

    // Append the word to the body
    document.body.appendChild(newWord);

    // Store the position of the word
    positions.push({ x: e.pageX, y: e.pageY });

    // Draw a permanent line if there's a previous word
    if (positions.length > 1) {
      const prevPos = positions[positions.length - 2];
      drawLine(prevPos.x, prevPos.y, e.pageX, e.pageY, true);
    }

    // Play the click sound
    clickSound.currentTime = 0; // Reset sound to start
    clickSound.play(); // Play the sound

    // Move to the next word
    currentWordIndex++;
  }

  // If we've finished all the words, hide the custom cursor and trigger the GIF and sound, but only once
  if (currentWordIndex === words.length && !gifShown) {
    customCursor.style.display = 'none';

    // Show the GIF and play the explosion sound, then start breaking effect
    setTimeout(() => {
      explosionGif.style.display = 'block'; // Show the GIF
      explosionSound.currentTime = 0; // Reset sound to start
      
      // Hide the GIF after 3 seconds (or however long you want the GIF to be visible)
      setTimeout(() => {
        explosionGif.style.display = 'none'; // Hide the GIF
      }, 2000); 

      gifShown = true; // Mark the GIF as shown to prevent future displays

      explosionSound.play(); // Play the explosion sound

      // Start the falling effect immediately after showing the GIF and sound
      startFallingInAllDirections();

    }, 1000); // 1000ms = 1 second
  }
});

// Draw a line on the canvas
function drawLine(x1, y1, x2, y2, permanent = false) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (permanent || positions.length > 1) {
        for (let i = 0; i < positions.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[i + 1].x, positions[i + 1].y);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }

      if (!permanent && positions.length > 0) {
        ctx.beginPath();
        const lastPosition = positions[positions.length - 1];
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    }
