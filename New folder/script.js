/**
 * ===================================================================
 * SAIDAHMAD BOBOKULOV — PERSONAL PORTFOLIO JAVASCRIPT
 * Vanilla JavaScript (ES6+), Zero Dependencies, Production Quality
 * ===================================================================
 */

(function () {
  'use strict';

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     1. DYNAMIC ROLE ROTATOR (HERO TYPING EFFECT)
     =================================================================== */
  const roleDynamicElement = document.getElementById('role-dynamic');
  
  if (roleDynamicElement) {
    const roles = [
      'Full Stack Engineer',
      'Software Architect',
      'JavaScript Specialist',
      'UI/UX Craftsman',
      'Problem Solver'
    ];

    if (prefersReducedMotion) {
      roleDynamicElement.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 100;

      function typeRole() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
          roleDynamicElement.textContent = currentRole.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 50;
        } else {
          roleDynamicElement.textContent = currentRole.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
          // Pause at end of word
          typingSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingSpeed = 400;
        }

        setTimeout(typeRole, typingSpeed);
      }

      // Initialize typing
      setTimeout(typeRole, 600);
    }
  }

  /* ===================================================================
     2. STICKY NAVBAR & SCROLL DETECTOR
     =================================================================== */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header background blur on scroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ===================================================================
     3. ACTIVE NAVIGATION LINK ON SCROLL
     =================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav-link');

  function highlightActiveNav() {
    const scrollY = window.pageYOffset + 140;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  /* ===================================================================
     4. MOBILE NAVIGATION DRAWER
     =================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-contact-btn');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ===================================================================
     5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     =================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If not supported or user prefers reduced motion, reveal instantly
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ===================================================================
     6. PROJECT FILTERING
     =================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Smooth fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===================================================================
     7. TIMELINE TAB SELECTOR (EXPERIENCE / EDUCATION)
     =================================================================== */
  const tabButtons = document.querySelectorAll('.timeline-tab-btn');
  const timelinePanels = document.querySelectorAll('.timeline-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      timelinePanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanelId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetPanelId);

      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ===================================================================
     8. PROJECT DETAILS MODAL
     =================================================================== */
  const projectDetails = {
    nexus: {
      title: 'Nexus Cloud Analytics Platform',
      category: 'Full Stack & DevOps',
      description:
        'A comprehensive cloud monitoring and system telemetry suite engineered to monitor server uptime, network latency, and memory footprint in real-time. Features automated health alerts, custom alert webhooks, and sub-second WebSocket metric streams.',
      highlights: [
        'Built full real-time event streaming pipeline using WebSockets and Node.js.',
        'High-density dashboard UI with custom-rendered CSS charts and zero external heavyweight charting dependencies.',
        'Resilient architecture handling 10,000+ synthetic telemetry ticks per second with PostgreSQL indexing.',
        'Zero downtime deployment setup with Docker containerization.'
      ],
      tags: ['JavaScript (ES6+)', 'Node.js', 'PostgreSQL', 'WebSockets', 'CSS Grid', 'Docker'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0E111C; color: #818CF8; font-family: monospace; font-size: 0.95rem;">
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 6px;">⚡ Nexus Telemetry Hub</div>
            <div style="color: #10B981;">STATUS: 99.98% HEALTHY • 14 ACTIVE NODES</div>
          </div>
        </div>
      `
    },
    aura: {
      title: 'Aura Modern E-Commerce Storefront',
      category: 'Frontend & UI Engineering',
      description:
        'A blazing-fast headless e-commerce store with instant product searching, faceted filtering, a persistent sliding cart drawer, and responsive checkout flows. Built from the ground up focusing on Core Web Vitals and accessible screen-reader experiences.',
      highlights: [
        'Sub-second first contentful paint (FCP) achieved through optimized vanilla DOM updates and zero script bloat.',
        'Robust client-side cart management with localStorage synchronization and price recalculation.',
        'Fluid checkout micro-animations and accessibility compliance (WCAG 2.1 AA compliant).',
        'Ready for integration with Stripe and Shopify Storefront APIs.'
      ],
      tags: ['HTML5 Semantic', 'Modern CSS3', 'Vanilla JS ES6+', 'Local Storage', 'Stripe API Ready'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #13101E; color: #C084FC; font-family: monospace;">
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; margin-bottom: 6px;">🛍️ Aura Storefront Preview</div>
            <div style="color: #38BDF8;">Cart Persistence & Live Product Filtering</div>
          </div>
        </div>
      `
    },
    devflow: {
      title: 'DevFlow Collaborative Sprint Board',
      category: 'Web Application & Workflow',
      description:
        'An agile workspace management tool enabling developer teams to orchestrate sprint backlogs, track tickets, manage epics, and visualize velocity with an intuitive drag-and-drop board.',
      highlights: [
        'Native HTML5 Drag and Drop API implementation with custom touch fallback for tablets and mobile devices.',
        'Real-time markdown previewer for ticket descriptions and task checklists.',
        'Modular object-oriented architecture designed for seamless backend synchronization.',
        'Clean keyboard navigation support for creating and moving tasks without mouse interaction.'
      ],
      tags: ['Drag & Drop API', 'JavaScript OOP', 'CSS Flex/Grid', 'REST Endpoints', 'Task Engine'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0C121C; color: #38BDF8; font-family: monospace;">
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; margin-bottom: 6px;">📋 DevFlow Agile Board</div>
            <div style="color: #34D399;">Sprint Active: 12 Tasks in Flight</div>
          </div>
        </div>
      `
    },
    pulse: {
      title: 'Pulse AI Copilot Playground',
      category: 'Full Stack & AI Integration',
      description:
        'A developer playground for large language model exploration. Enables multi-turn conversational agents, token expenditure monitoring, custom system prompts, and exportable chat sessions.',
      highlights: [
        'Server-Sent Events (SSE) streaming engine for smooth, word-by-word token generation without UI lag.',
        'Custom code syntax highlighting wrapper and instant copy-to-clipboard for generated snippets.',
        'Configurable parameter sliders for Temperature, Top-P, and Max Tokens.',
        'Secure API token management and local session history persistence.'
      ],
      tags: ['JavaScript', 'OpenAI API', 'Node.js Server', 'Server-Sent Events', 'Async Streams'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0A0B14; color: #A5B4FC; font-family: monospace;">
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; margin-bottom: 6px;">✨ Pulse AI Copilot Engine</div>
            <div style="color: #F43F5E;">Streaming Response Simulation Active</div>
          </div>
        </div>
      `
    },
    cryptovault: {
      title: 'CryptoVault Asset Tracker',
      category: 'Financial Web App',
      description:
        'A clean multi-currency crypto portfolio analytics portal. Features live cryptocurrency pricing, automated fiat currency conversions, profit/loss calculations, and interactive candlestick price trends.',
      highlights: [
        'Asynchronous data fetching with graceful API rate-limit handling and offline cache fallbacks.',
        'Custom SVG sparklines and interactive trend visuals rendered on the fly.',
        'Watchlist feature with live price change indicators and color-coded volatility metrics.',
        'Clean responsive layout tailored for finance enthusiasts on both desktop and mobile.'
      ],
      tags: ['CoinGecko API', 'Chart Engine', 'Async JS', 'Responsive UI', 'Financial Modeling'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #07130F; color: #10B981; font-family: monospace;">
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; margin-bottom: 6px;">📈 CryptoVault Analytics</div>
            <div style="color: #6EE7B7;">Live Market Feeds & Asset Allocations</div>
          </div>
        </div>
      `
    },
    prism: {
      title: 'Prism Design System & UI Kit',
      category: 'Frontend & UI Framework',
      description:
        'An accessible, production-ready vanilla component kit designed for enterprise web applications. Includes buttons, inputs, modals, tabs, accordions, and tooltip utilities styled with pure CSS custom properties.',
      highlights: [
        'Comprehensive theme token system supporting both dark and light modes with seamless contrast switching.',
        'Full keyboard navigation, focus management, and ARIA attributes built into every interactive component.',
        'Zero runtime dependencies, weighing less than 15KB gzipped.',
        'Documented component playground with live copy-paste code snippets.'
      ],
      tags: ['Pure CSS Variables', 'HTML5 a11y', 'Modular JS', 'Design Tokens', 'Web Standards'],
      github: 'https://github.com',
      previewHtml: `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0F0B14; color: #C084FC; font-family: monospace;">
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; margin-bottom: 6px;">🎨 Prism UI System</div>
            <div style="color: #A5B4FC;">Semantic Tokens & Accessible Controls</div>
          </div>
        </div>
      `
    }
  };

  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalDescription = document.getElementById('modal-project-description');
  const modalHighlights = document.getElementById('modal-project-highlights');
  const modalTags = document.getElementById('modal-project-tags');
  const modalPreview = document.getElementById('modal-project-preview');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalDemoBtn = document.getElementById('modal-demo-btn');
  const projectDetailButtons = document.querySelectorAll('.project-details-btn');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !modalBackdrop) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalDescription.textContent = data.description;
    modalPreview.innerHTML = data.previewHtml;
    modalGithubLink.setAttribute('href', data.github);

    // Populate highlights
    modalHighlights.innerHTML = '';
    data.highlights.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      modalHighlights.appendChild(li);
    });

    // Populate tags
    modalTags.innerHTML = '';
    data.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // Configure demo button
    modalDemoBtn.onclick = () => {
      showToast(`Launching interactive preview of ${data.title}...`, 'info');
    };

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectDetailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeProjectModal();
    }
  });

  /* ===================================================================
     9. TOAST NOTIFICATION SYSTEM
     =================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      `;
    } else if (type === 'error') {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F43F5E" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#06B6D4" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  /* ===================================================================
     10. COPY EMAIL TO CLIPBOARD
     =================================================================== */
  const emailToCopy = 'saidahmad.bobokulov@example.com';
  const copyHeroBtn = document.getElementById('copy-email-hero-btn');
  const copyContactBtn = document.getElementById('copy-email-btn');

  function copyEmailToClipboard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(emailToCopy)
        .then(() => {
          showToast(`Copied to clipboard: ${emailToCopy}`, 'success');
        })
        .catch(() => {
          fallbackCopyText(emailToCopy);
        });
    } else {
      fallbackCopyText(emailToCopy);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`, 'success');
    } catch (err) {
      showToast('Please copy the email address manually.', 'info');
    }
    document.body.removeChild(textArea);
  }

  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', copyEmailToClipboard);
  }

  if (copyContactBtn) {
    copyContactBtn.addEventListener('click', copyEmailToClipboard);
  }

  /* ===================================================================
     11. CONTACT FORM VALIDATION & SUBMISSION
     =================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  // Character counter for message
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 950) {
        charCounter.style.color = '#F59E0B';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Email regex validation
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Clear single field error
  function clearFieldError(input, errorElement) {
    input.classList.remove('input-error');
    if (errorElement) errorElement.textContent = '';
  }

  // Set field error
  function setFieldError(input, errorElement, msg) {
    input.classList.add('input-error');
    if (errorElement) errorElement.textContent = msg;
  }

  // Real-time input listeners to remove error state
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) clearFieldError(nameInput, nameError);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value.trim())) clearFieldError(emailInput, emailError);
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      if (subjectInput.value.trim().length >= 3) clearFieldError(subjectInput, subjectError);
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) clearFieldError(messageInput, messageError);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setFieldError(nameInput, nameError, 'Please enter your name.');
        hasError = true;
      } else if (nameVal.length < 2) {
        setFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
        hasError = true;
      } else {
        clearFieldError(nameInput, nameError);
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setFieldError(emailInput, emailError, 'Please provide your email address.');
        hasError = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        hasError = true;
      } else {
        clearFieldError(emailInput, emailError);
      }

      // Validate Subject
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        setFieldError(subjectInput, subjectError, 'Please enter a subject.');
        hasError = true;
      } else if (subjectVal.length < 3) {
        setFieldError(subjectInput, subjectError, 'Subject must be at least 3 characters.');
        hasError = true;
      } else {
        clearFieldError(subjectInput, subjectError);
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setFieldError(messageInput, messageError, 'Please write your message.');
        hasError = true;
      } else if (messageVal.length < 10) {
        setFieldError(messageInput, messageError, 'Message must be at least 10 characters.');
        hasError = true;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (hasError) {
        showToast('Please fix the highlighted fields in the form.', 'error');
        return;
      }

      // Form is valid: initiate submission state
      const btnText = submitBtn.querySelector('.btn-text');
      const submitIcon = submitBtn.querySelector('.submit-icon');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');

      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending message...';
      if (submitIcon) submitIcon.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      // Simulate network request
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
        if (submitIcon) submitIcon.classList.remove('hidden');
        if (btnSpinner) btnSpinner.classList.add('hidden');

        // Show success in form feedback banner
        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.textContent =
            `Thank you, ${nameVal}! Your message has been received. Saidahmad will get back to you within 24 hours.`;
          formFeedback.classList.remove('hidden');

          setTimeout(() => {
            formFeedback.classList.add('hidden');
          }, 8000);
        }

        // Show toast
        showToast('Message sent successfully! Thank you for reaching out.', 'success');

        // Reset form inputs
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 1000';
      }, 1200);
    });
  }

  /* ===================================================================
     12. FOOTER DYNAMIC YEAR
     =================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ===================================================================
     13. CONSOLE GREETING (EASTER EGG FOR DEVELOPERS)
     =================================================================== */
  console.log(
    '%c Saidahmad Bobokulov — Portfolio %c Built with HTML5, CSS3, & Vanilla JS',
    'background: #6366F1; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: #0E111C; color: #38BDF8; padding: 4px 8px; border-radius: 4px;'
  );

})();
