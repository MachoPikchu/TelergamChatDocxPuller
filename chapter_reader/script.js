// Load chapters.json
let currentChapterIndex = -1;
let chapters = [];

fetch('chapters.json')
  .then(res => res.json())
  .then(loadedChapters => {
    chapters = loadedChapters;
    const menu = document.getElementById('chapterMenu');
    const content = document.getElementById('content');

    chapters.forEach((ch, i) => {
      const li = document.createElement('li');
      li.textContent = ch.title;
      li.addEventListener('click', () => {
        loadChapter(i);
        closeMenu();
      });
      menu.appendChild(li);
    });

    // Enable navigation if chapters exist
    if (chapters.length > 0) {
      document.getElementById('prevChapter').disabled = false;
      document.getElementById('nextChapter').disabled = false;
    }
  })
  .catch(err => {
    console.error('Error loading chapters:', err);
    document.getElementById('content').innerHTML = `
      <h2>Error</h2>
      <p>Could not load chapters. Please try again later.</p>
    `;
  });

// Toggle menu functions
function openMenu() {
  document.body.classList.add('menu-open');
}

function closeMenu() {
  document.body.classList.remove('menu-open');
}

// Menu toggle button
document.getElementById('menuToggle').addEventListener('click', openMenu);

// Close menu button
document.getElementById('closeMenu').addEventListener('click', closeMenu);

// Close menu when clicking on overlay
document.getElementById('overlay').addEventListener('click', closeMenu);

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});

// Font family
document.getElementById('fontSelect').addEventListener('change', (e) => {
  document.body.style.fontFamily = e.target.value;
});

// Font size
document.getElementById('fontSize').addEventListener('input', (e) => {
  const content = document.querySelector('.chapter-text, .chapter-content');
  if (content) {
    content.style.fontSize = e.target.value + 'px';
  }
});

// Theme change
document.getElementById('themeSelect').addEventListener('change', (e) => {
  document.body.className = e.target.value;
});

function openSettings() {
  document.getElementById('settingsModal').classList.add('active');
  document.body.classList.add('modal-open');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Settings Toggle
document.getElementById('settingsToggle').addEventListener('click', openSettings);
document.getElementById('closeSettings').addEventListener('click', closeSettings);

// Close modal when clicking on overlay
document.getElementById('settingsModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('settingsModal')) {
    closeSettings();
  }
});

// Line Height Control
document.getElementById('lineHeight').addEventListener('input', (e) => {
  const value = e.target.value;
  document.getElementById('lineHeightValue').textContent = value;
  const content = document.querySelector('.chapter-text, .chapter-content');
  if (content) {
    content.style.lineHeight = value;
  }
});

// Font Size Value Display
document.getElementById('fontSize').addEventListener('input', (e) => {
  document.getElementById('fontSizeValue').textContent = e.target.value;
});

// Reset Settings
document.getElementById('resetSettings').addEventListener('click', () => {
  // Reset font family
  document.getElementById('fontSelect').value = 'serif';
  document.body.style.fontFamily = 'serif';

  // Reset font size
  document.getElementById('fontSize').value = '18';
  document.getElementById('fontSizeValue').textContent = '18';
  const content = document.querySelector('.chapter-text, .chapter-content');
  if (content) {
    content.style.fontSize = '18px';
  }

  // Reset line height
  document.getElementById('lineHeight').value = '1.6';
  document.getElementById('lineHeightValue').textContent = '1.6';
  if (content) {
    content.style.lineHeight = '1.6';
  }

  // Reset theme
  document.getElementById('themeSelect').value = 'light';
  document.body.className = 'light';

  closeSettings();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.body.classList.contains('menu-open')) {
      closeMenu();
    } else if (document.body.classList.contains('modal-open')) {
      closeSettings();
    }
  }
});


function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;

  currentChapterIndex = index;
  const ch = chapters[index];

  document.getElementById('content').innerHTML = `
    <div class="chapter-navigation">
      <button id="prevChapter" class="nav-button" ${index === 0 ? 'disabled' : ''}>
        <span class="nav-arrow">←</span>
        <span class="nav-title" id="prevChapterTitle">${index > 0 ? chapters[index-1].title : ''}</span>
      </button>
      <button id="nextChapter" class="nav-button" ${index === chapters.length-1 ? 'disabled' : ''}>
        <span class="nav-title" id="nextChapterTitle">${index < chapters.length-1 ? chapters[index+1].title : ''}</span>
        <span class="nav-arrow">→</span>
      </button>
    </div>
    <h2>${ch.title}</h2>
    <div class="chapter-text">${ch.content.replace(/\n/g, '<br>')}</div>
  `;

  // Reattach event listeners to new buttons
  document.getElementById('prevChapter').addEventListener('click', () => {
    if (currentChapterIndex > 0) {
      loadChapter(currentChapterIndex - 1);
    }
  });


  document.getElementById('nextChapter').addEventListener('click', () => {
    if (currentChapterIndex < chapters.length - 1) {
      loadChapter(currentChapterIndex + 1);
    }
  });

  // Scroll to top
  document.getElementById('content').scrollTo(0, 0);
}

// Add these to your existing event listeners section
document.addEventListener('click', (e) => {
  if (e.target.id === 'prevChapter' || e.target.parentElement.id === 'prevChapter') {
    if (currentChapterIndex > 0) {
      loadChapter(currentChapterIndex - 1);
    }
  }
  if (e.target.id === 'nextChapter' || e.target.parentElement.id === 'nextChapter') {
    if (currentChapterIndex < chapters.length - 1) {
      loadChapter(currentChapterIndex + 1);
    }
  }
});