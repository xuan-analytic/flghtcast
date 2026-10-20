/**
 * Flightcast Main Interactive & Responsive Handler
 */
import createGlobe from 'cobe';

document.addEventListener('DOMContentLoaded', () => {
  initGlobalRedirect();
  initThemeToggle();
  initAccordions();
  initShowAllFaq();
  initMobileNav();
  initGlobe();
});

let currentGlobe = null;
let globeAnimFrame = null;

/**
 * 1. Theme Toggle (Light / Dark)
 */
function initThemeToggle() {
  const lightBtn = document.querySelector('button[aria-label="Light theme"]');
  const darkBtn = document.querySelector('button[aria-label="Dark theme"]');
  const root = document.documentElement;

  function updateActiveTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
      if (darkBtn) darkBtn.classList.add('theme-active');
      if (lightBtn) lightBtn.classList.remove('theme-active');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
      if (lightBtn) lightBtn.classList.add('theme-active');
      if (darkBtn) darkBtn.classList.remove('theme-active');
    }
    // Re-initialize globe with theme colors
    initGlobe();
  }

  // Check current theme
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  updateActiveTheme(currentTheme);

  if (lightBtn) {
    lightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateActiveTheme('light');
    });
  }

  if (darkBtn) {
    darkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateActiveTheme('dark');
    });
  }
}

/**
 * 2. FAQ Accordion Interaction
 */
function initAccordions() {
  const accordionButtons = document.querySelectorAll('button[data-radix-collection-item], button[aria-controls]');

  accordionButtons.forEach((btn) => {
    const parent = btn.parentElement;
    const region = (parent && parent.nextElementSibling && parent.nextElementSibling.getAttribute('role') === 'region')
      ? parent.nextElementSibling
      : btn.nextElementSibling;

    if (!region || region.getAttribute('role') !== 'region') return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = btn.getAttribute('data-state') === 'open';

      if (isOpen) {
        btn.setAttribute('data-state', 'closed');
        btn.setAttribute('aria-expanded', 'false');
        region.setAttribute('data-state', 'closed');
        region.style.display = 'none';
      } else {
        btn.setAttribute('data-state', 'open');
        btn.setAttribute('aria-expanded', 'true');
        region.setAttribute('data-state', 'open');
        region.style.display = 'block';
      }
    });
  });
}

/**
 * 3. FAQ "Show All" Expand/Collapse
 */
function initShowAllFaq() {
  const showAllBtn = Array.from(document.querySelectorAll('button')).find(
    (b) => b.textContent && b.textContent.trim().toLowerCase().includes('show all')
  );

  if (!showAllBtn) return;

  const btnWrapper = showAllBtn.parentElement;
  const parentContainer = btnWrapper.parentElement;
  const contentDiv = parentContainer ? parentContainer.querySelector('.overflow-hidden') : null;
  const gradientOverlay = parentContainer ? parentContainer.querySelector('.bg-gradient-to-t') : null;

  let isExpanded = false;

  showAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isExpanded = !isExpanded;

    if (isExpanded) {
      if (contentDiv) {
        contentDiv.style.height = 'auto';
        contentDiv.style.minHeight = 'auto';
        contentDiv.style.maxHeight = 'none';
      }
      if (gradientOverlay) {
        gradientOverlay.style.display = 'none';
      }
      showAllBtn.innerHTML = `
        <svg class="lucide lucide-arrow-up size-3.5" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m18 15-6-6-6 6"></path></svg>
        <span>Show Less</span>
      `;
    } else {
      if (contentDiv) {
        contentDiv.style.height = '590px';
        contentDiv.style.minHeight = '590px';
      }
      if (gradientOverlay) {
        gradientOverlay.style.display = 'block';
      }
      showAllBtn.innerHTML = `
        <svg class="lucide lucide-arrow-down size-3.5" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
        <span>Show All</span>
      `;
      parentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/**
 * 4. Mobile Navigation Menu
 */
function initMobileNav() {
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('nav') : null;
  if (!nav) return;

  let toggle = nav.querySelector('.mobile-nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'mobile-nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle Mobile Menu');
    toggle.innerHTML = `
      <svg class="lucide-menu size-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
      </svg>
    `;
    nav.appendChild(toggle);
  }

  let drawer = document.querySelector('.mobile-menu-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'mobile-menu-drawer';
    drawer.innerHTML = `
      <a href="https://toolsever.com/go/flightcast/" class="mobile-menu-link">Features</a>
      <a href="https://toolsever.com/go/flightcast/" class="mobile-menu-link">Pricing</a>
      <a href="https://toolsever.com/go/flightcast/" class="mobile-menu-link">FAQ</a>
      <div class="mobile-menu-cta-group">
        <a href="https://toolsever.com/go/flightcast/" class="inline-flex items-center justify-center h-9 px-4 rounded-full font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm">Log in</a>
        <a href="https://toolsever.com/go/flightcast/" class="inline-flex items-center justify-center h-9 px-4 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Explore Flightcast</a>
      </div>
    `;
    header.appendChild(drawer);
  }

  let isOpen = false;
  function toggleDrawer(open) {
    isOpen = open !== undefined ? open : !isOpen;
    if (isOpen) {
      drawer.classList.add('is-open');
      toggle.innerHTML = `
        <svg class="size-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" x2="6" y1="6" y2="18"></line>
          <line x1="6" x2="18" y1="6" y2="18"></line>
        </svg>
      `;
    } else {
      drawer.classList.remove('is-open');
      toggle.innerHTML = `
        <svg class="size-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      `;
    }
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleDrawer(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !drawer.contains(e.target) && !toggle.contains(e.target)) {
      toggleDrawer(false);
    }
  });
}

/**
 * 5. Global Link & Button Redirect Handler
 * Navigates to https://toolsever.com/go/flightcast/ on same tab without keeping page in history (cannot back)
 */
function initGlobalRedirect() {
  if (window.__redirectInstalled) return;
  window.__redirectInstalled = true;

  const REDIRECT_URL = 'https://toolsever.com/go/flightcast/';

  function isExcludedControl(el) {
    if (!el) return true;

    // 1. Exclude theme toggle buttons (Light / Dark mode in Footer)
    if (
      el.closest('div[aria-label="Color theme"]') ||
      el.closest('[data-tab-value="light"]') ||
      el.closest('[data-tab-value="dark"]') ||
      (el.getAttribute('aria-label') && el.getAttribute('aria-label').toLowerCase().includes('theme'))
    ) {
      return true;
    }

    // 2. Exclude mobile menu hamburger toggle button
    if (
      el.classList.contains('mobile-nav-toggle') ||
      (el.getAttribute('aria-label') && el.getAttribute('aria-label').toLowerCase().includes('mobile menu'))
    ) {
      return true;
    }

    // 3. Exclude FAQ Accordion question triggers & Show All / Show Less button
    if (el.closest('#faq')) {
      if (
        el.hasAttribute('data-radix-collection-item') ||
        el.hasAttribute('aria-controls') ||
        el.querySelector('.lucide-chevron-down, .lucide-chevron-up')
      ) {
        return true;
      }
      const text = (el.textContent || '').trim().toLowerCase();
      if (text.includes('show all') || text.includes('show less')) {
        return true;
      }
    }

    return false;
  }

  document.addEventListener('click', (e) => {
    const clickable = e.target.closest('button, a');
    if (!clickable) return;

    if (isExcludedControl(clickable)) {
      return;
    }

    // Redirect all other buttons and links
    e.preventDefault();
    e.stopPropagation();

    try {
      history.replaceState(null, '', REDIRECT_URL);
    } catch(err) {}
    window.location.replace(REDIRECT_URL);
  }, true);
}

/**
 * 6. 3D Interactive Rotating Globe (COBE) for "Advanced targeting"
 * Exact parameters from Flightcast production
 */
function initGlobe() {
  const canvas = document.querySelector('canvas.cursor-grab');
  if (!canvas) return;

  if (currentGlobe) {
    try { currentGlobe.destroy(); } catch (e) {}
    currentGlobe = null;
  }
  if (globeAnimFrame) {
    cancelAnimationFrame(globeAnimFrame);
    globeAnimFrame = null;
  }

  const isDark = document.documentElement.classList.contains('dark');

  const markers = [
    { location: [40.71, -74.01], size: 0.06 },
    { location: [34.05, -118.24], size: 0.05 },
    { location: [37.78, -122.44], size: 0.04 },
    { location: [41.88, -87.63], size: 0.04 },
    { location: [43.65, -79.38], size: 0.035 },
    { location: [29.76, -95.37], size: 0.03 },
    { location: [19.43, -99.13], size: 0.035 },
    { location: [51.51, -0.13], size: 0.05 },
    { location: [48.86, 2.35], size: 0.045 },
    { location: [52.52, 13.41], size: 0.04 },
    { location: [40.42, -3.7], size: 0.03 },
    { location: [59.33, 18.07], size: 0.025 },
    { location: [41.9, 12.5], size: 0.03 },
    { location: [35.68, 139.65], size: 0.055 },
    { location: [37.57, 126.98], size: 0.04 },
    { location: [22.28, 114.16], size: 0.035 },
    { location: [1.35, 103.82], size: 0.03 },
    { location: [28.61, 77.21], size: 0.04 },
    { location: [19.08, 72.88], size: 0.035 },
    { location: [39.9, 116.4], size: 0.04 },
    { location: [25.2, 55.27], size: 0.03 },
    { location: [30.04, 31.24], size: 0.025 },
    { location: [-33.93, 18.42], size: 0.03 },
    { location: [6.52, 3.38], size: 0.025 },
    { location: [-33.87, 151.21], size: 0.04 },
    { location: [-36.85, 174.76], size: 0.025 },
    { location: [-23.55, -46.63], size: 0.045 },
    { location: [-34.6, -58.38], size: 0.035 },
    { location: [4.71, -74.07], size: 0.025 }
  ];

  const arcs = [
    { from: [40.71, -74.01], to: [51.51, -0.13] },
    { from: [34.05, -118.24], to: [35.68, 139.65] },
    { from: [51.51, -0.13], to: [25.2, 55.27] },
    { from: [-23.55, -46.63], to: [6.52, 3.38] },
    { from: [-33.87, 151.21], to: [1.35, 103.82] },
    { from: [48.86, 2.35], to: [28.61, 77.21] }
  ];

  const themeConfig = isDark ? {
    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.1, 0.1, 0.12],
    glowColor: [1, 0.3, 0],
    arcColor: [0.95, 0.95, 0.95]
  } : {
    dark: 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 1.8,
    baseColor: [1, 1, 1],
    glowColor: [1, 0.3, 0],
    arcColor: [0.08, 0.08, 0.08]
  };

  let phi = 0;
  let isDragging = false;
  let startX = 0;
  let velocity = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  window.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const delta = e.clientX - startX;
      startX = e.clientX;
      velocity = delta * 0.005;
      phi += velocity;
    }
  });

  try {
    currentGlobe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1200,
      height: 1200,
      phi: 0,
      theta: 0.15,
      ...themeConfig,
      markerColor: [1, 0.3, 0],
      markers: markers,
      arcs: arcs,
      arcWidth: 0.4,
      arcHeight: 0.3,
      scale: 1.3,
      offset: [350, 350]
    });

    function loop() {
      if (!isDragging) {
        velocity *= 0.92;
        phi += 0.003 + velocity;
      }
      if (currentGlobe) {
        currentGlobe.update({ phi });
      }
      globeAnimFrame = requestAnimationFrame(loop);
    }
    loop();
  } catch (err) {
    console.error('Failed to init Cobe globe:', err);
  }
}
