/* ==========================================
   PL AUTO DETAILING — MAIN JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========= CUSTOM CURSOR ========= */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (window.innerWidth > 640) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animateFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  /* ========= NAVBAR SCROLL ========= */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ========= HAMBURGER MENU ========= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========= SCROLL REVEAL ========= */
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ========= HERO STATS COUNTER ========= */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ========= TESTIMONIALS SLIDER ========= */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const total = cards.length;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'test-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      const cardWidth = cards[0].offsetWidth + 24;
      const trackWidth = track.parentElement.offsetWidth;
      let offset = current * cardWidth;
      const maxOffset = (total * cardWidth) - trackWidth;
      offset = Math.min(offset, Math.max(0, maxOffset));
      track.style.transform = `translateX(-${offset}px)`;
      dotsContainer.querySelectorAll('.test-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-slide
    let autoSlide = setInterval(() => goTo(current + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 5000); });

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }, { passive: true });
  }

/* ========= CONTACT FORM — FORMSUBMIT.CO ========= */
const YOUR_EMAIL = 'e53eae6d53bb562434cb5035bbcf5070'; 
// const YOUR_EMAIL = '7164187388@vtext.com'; 

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('formSubmit');
const submitText = document.querySelector('.submit-text');
const submitArrow = document.querySelector('.submit-arrow');
const successMsg = document.getElementById('formSuccess');
const errorMsg = document.getElementById('formError');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    if (!name || !email) {
      form.querySelector('#name').style.borderColor = !name ? 'var(--red)' : '';
      form.querySelector('#email').style.borderColor = !email ? 'var(--red)' : '';
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitText.textContent = 'SENDING...';
    submitArrow.textContent = '⟳';
    successMsg.classList.remove('show');
    errorMsg.classList.remove('show');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${YOUR_EMAIL}`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
        body: JSON.stringify({
  name: form.querySelector('#name').value.trim(),
  phone: form.querySelector('#phone').value.trim(),
  email: form.querySelector('#email').value.trim(),
  vehicle: form.querySelector('#vehicle').value.trim(),
  service: form.querySelector('#service').value,
  message: form.querySelector('#message').value.trim(),
  _captcha: 'false',
  _honey: '',
  _subject: 'New Detailing Request — PL Auto Detailing',
})
      });

      const data = await response.json();

      if (data.success === 'true' || data.success === true) {
        form.reset();
        submitBtn.style.display = 'none';
        successMsg.classList.add('show');

        setTimeout(() => {
          submitBtn.style.display = 'flex';
          submitBtn.style.opacity = '1';
          submitBtn.disabled = false;
          submitText.textContent = 'SEND REQUEST';
          submitArrow.textContent = '→';
          successMsg.classList.remove('show');
        }, 6000);

      } else {
        throw new Error('Failed');
      }

    } catch (err) {
      errorMsg.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitText.textContent = 'SEND REQUEST';
      submitArrow.textContent = '→';
      setTimeout(() => errorMsg.classList.remove('show'), 6000);
    }
  });

  // Clear red border on re-focus
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => { input.style.borderColor = ''; });
  });
}

  /* ========= FORM INPUT FOCUS ANIMATIONS ========= */
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label').style.color = 'var(--red)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('label').style.color = '';
    });
  });

  /* ========= SMOOTH PARALLAX ON HERO ========= */
  const heroBg = document.querySelector('.hero-glow');
  if (heroBg && window.innerWidth > 960) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ========= SERVICE CARD TILT EFFECT ========= */
  if (window.innerWidth > 960) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 4;
        const tiltY = -(x / rect.width) * 4;
        card.style.transform = `translateY(-4px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ========= GALLERY PARALLAX ========= */
  if (window.innerWidth > 640) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.1 });
    galleryItems.forEach(item => galleryObserver.observe(item));
  }

  /* ========= PROCESS STEP PROGRESS ANIMATION ========= */
  const processSteps = document.querySelectorAll('.process-step');
  const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 150);
      }
    });
  }, { threshold: 0.3 });
  processSteps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    processObserver.observe(step);
  });

  /* ========= PRICING CARD HOVER GLOW ========= */
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 60px rgba(204,0,0,0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  /* ========= SCROLL PROGRESS INDICATOR ========= */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #cc0000, #ff4444);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(204,0,0,0.5);
  `;
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });

  /* ========= ACTIVE NAV HIGHLIGHT ========= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          if (link.classList.contains('active')) {
            link.style.color = '#fff';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(section => sectionObserver.observe(section));

  /* ========= GALLERY ITEM HOVER RIPPLE ========= */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = item.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(204,0,0,0.15);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-out 0.6s ease forwards;
        pointer-events: none;
        z-index: 10;
      `;
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-out {
      to { transform: scale(2); opacity: 0; }
    }
    .nav-link.active { color: #fff !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);

  /* ========= HIGHLIGHT ITEMS STAGGER ========= */
  document.querySelectorAll('.highlight-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `all 0.5s ease ${i * 0.15}s`;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(item);
  });

});