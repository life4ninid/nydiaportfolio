/* ============================================================
   PORTFOLIO — NYDIA HAVINA RAHMADIAN
   script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. NAVBAR — scrolled state + mobile toggle
     ========================================================== */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ==========================================================
     2. SMOOTH SCROLL with navbar offset
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ==========================================================
     3. TYPING EFFECT
     ========================================================== */
  const typedEl = document.getElementById('typed-text');

  // TODO: Ganti teks di sini sesuai headline yang kamu inginkan
  const phrases = [
    'Building functional web applications.',
    'Turning ideas into digital solutions.',
    'Learning through every line of code.',
    'Junior Web Developer · Based in Indonesia.',
  ];

  let pi = 0, ci = 0, deleting = false, paused = false;
  const TYPE_SPD = 55, DEL_SPD = 28, PAUSE = 2200;

  function typeLoop() {
    if (paused) return;
    const phrase = phrases[pi];
    if (!deleting) {
      ci++;
      typedEl.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; typeLoop(); }, PAUSE);
        return;
      }
    } else {
      ci--;
      typedEl.textContent = phrase.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? DEL_SPD : TYPE_SPD);
  }
  setTimeout(typeLoop, 1000);

  /* ==========================================================
     4. SCROLL REVEAL
     ========================================================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ==========================================================
     5. ACTIVE NAV HIGHLIGHT
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? '#f0f4ff' : '';
        });
      }
    });
  }, { threshold: 0.45 }).observe;

  // Simpler approach: scroll-based active link
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAs.forEach(a => {
      const active = a.getAttribute('href') === `#${current}`;
      a.style.color = active ? '#f0f4ff' : '';
    });
  }, { passive: true });

  /* ==========================================================
     6. CANVAS THUMBNAIL GENERATOR
     Draws an abstract placeholder for each project card.
     TODO: Replace canvas with <img> once you have screenshots.
     ========================================================== */
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return { r, g, b };
  }

  function drawThumb(canvas, color, num) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth  || 320;
    const h = canvas.offsetHeight || 180;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const { r, g, b } = hexToRgb(color);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, `rgb(${Math.max(r-30,0)},${Math.max(g-30,0)},${Math.max(b-30,0)})`);
    bg.addColorStop(1, `rgb(${Math.min(r+20,255)},${Math.min(g+20,255)},${Math.min(b+20,255)})`);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Dot grid
    ctx.fillStyle = `rgba(255,255,255,0.04)`;
    for (let x = 16; x < w; x += 24) {
      for (let y = 16; y < h; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Glow circle
    const glow = ctx.createRadialGradient(w*0.65, h*0.4, 0, w*0.65, h*0.4, w*0.45);
    glow.addColorStop(0, `rgba(255,255,255,0.1)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Abstract lines
    ctx.strokeStyle = `rgba(255,255,255,0.08)`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, h * (0.15 + i * 0.18));
      ctx.bezierCurveTo(
        w * 0.3, h * (0.1 + i * 0.18 - 0.05),
        w * 0.7, h * (0.2 + i * 0.18 + 0.05),
        w,       h * (0.15 + i * 0.18)
      );
      ctx.stroke();
    }

    // Accent corner bar
    ctx.fillStyle = `rgba(255,255,255,0.15)`;
    ctx.fillRect(0, 0, 3, h);

    // Project number watermark
    ctx.font = `bold ${h * 0.55}px 'Syne', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(num, w - 12, h - 8);

    // Small label
    ctx.font = `500 11px 'Inter', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('PROJECT PREVIEW', 16, 14);
  }

  /* ==========================================================
     7. PROJECT MODAL
     ========================================================== */
  const modal      = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalCanvas= document.getElementById('modalCanvas');

  function openModal(card) {
    const d = card.dataset;

    document.getElementById('modalNum').textContent      = d.num;
    document.getElementById('modalTitle').textContent    = d.title;
    document.getElementById('modalYear').textContent     = d.year;
    document.getElementById('modalOverview').textContent = d.overview;
    document.getElementById('modalRole').textContent     = d.role;
    document.getElementById('modalDuration').textContent = d.duration;

    // Stack pills
    const stackEl = document.getElementById('modalStack');
    stackEl.innerHTML = '';

    d.stack.split(',').forEach(tech => {
      const span = document.createElement('span');
      span.className = 'stack-tag';
      span.textContent = tech.trim();
      stackEl.appendChild(span);
    });

    // Live link
    const link = document.getElementById('modalLink');
    link.href = d.link || '#';
    link.style.display = (!d.link || d.link === '#') ? 'none' : 'inline-flex';

    // Generate swiper images
    const wrapper = document.getElementById('swiperWrapper');

    wrapper.innerHTML = '';

    const images = d.images
      .split(',')
      .map(img => img.trim())
      .filter(img => img !== '');

    images.forEach(img => {
      wrapper.innerHTML += `
        <div class="swiper-slide">
          <img src="${img}" alt="Project Image">
        </div>
      `;
    });

    // Destroy previous swiper
    if (window.projectSwiperInstance) {
      window.projectSwiperInstance.destroy(true, true);
    }

    // Initialize swiper
    window.projectSwiperInstance = new Swiper('.projectSwiper', {
      loop: true,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function drawModalThumb(canvas, color, num) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth  || 660;
    const h = canvas.offsetHeight || 250;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const { r, g, b } = hexToRgb(color);

    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, `rgb(${Math.max(r-40,0)},${Math.max(g-40,0)},${Math.max(b-40,0)})`);
    bg.addColorStop(0.5, `rgb(${r},${g},${b})`);
    bg.addColorStop(1, `rgb(${Math.min(r+30,255)},${Math.min(g+30,255)},${Math.min(b+30,255)})`);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 20; x < w; x += 28) {
      for (let y = 20; y < h; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Glow
    const glow = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, w*0.5);
    glow.addColorStop(0, 'rgba(255,255,255,0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, h * (0.1 + i * 0.16));
      ctx.bezierCurveTo(w*0.25, h*(0.08+i*0.16-0.04), w*0.75, h*(0.12+i*0.16+0.04), w, h*(0.1+i*0.16));
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.font = `bold ${h*0.7}px 'Syne', sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(num, w - 20, h);
  }

  // Click cards to open modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ==========================================================
     8. CARD TILT on mousemove
     ========================================================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y - r.height/2) / r.height) * -5;
      const ry = ((x - r.width/2)  / r.width)  *  5;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.3s';
    });
  });

});
