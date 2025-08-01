// Load chapters.json
fetch('chapters.json')
  .then(res => res.json())
  .then(chapters => {
    const menu = document.getElementById('chapterMenu');
    const content = document.getElementById('content');

    chapters.forEach((ch, i) => {
      const li = document.createElement('li');
      li.textContent = ch.title;
      li.addEventListener('click', () => {
        content.innerHTML = `
          <h2>${ch.title}</h2>
          <div class="chapter-text">${ch.content.replace(/\n/g, '<br>')}</div>
        `;
        closeMenu();
        // Scroll to top when new chapter is selected
        content.scrollTo(0, 0);
      });
      menu.appendChild(li);
    });
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