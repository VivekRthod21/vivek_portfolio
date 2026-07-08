/**
 * Refactored Portfolio Interactions (Bootstrap 5.3 compliant)
 * Custom built for Vivek Rathod
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Native Bootstrap 5.3 Color Modes (Dark/Light Theme Toggle) ---
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  
  // Get active theme from localStorage or system preference, default to dark
  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Set initial theme
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  // Bind click event
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // --- Dynamic Typewriter Roles Animation ---
  const roles = [
    'Full-Stack Web Developer',
    'Laravel & PHP Specialist',
    'Generative AI Integrator'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typingElement = document.querySelector('.hero-role .typing-text');
  
  if (typingElement) {
    const type = () => {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        speed = 2000; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 300; // Pause before next role
      }

      setTimeout(type, speed);
    };

    setTimeout(type, 1000);
  }

  // --- Dynamic Projects Category Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCols = document.querySelectorAll('.project-col');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active styling
      filterButtons.forEach(b => {
        b.classList.remove('btn-indigo-gradient', 'active');
        b.classList.add('btn-outline-secondary');
      });
      
      btn.classList.add('btn-indigo-gradient', 'active');
      btn.classList.remove('btn-outline-secondary');

      const filter = btn.getAttribute('data-filter');

      projectCols.forEach(col => {
        const category = col.getAttribute('data-category') || '';
        
        if (filter === 'all' || category.includes(filter)) {
          // Fade in matching items
          col.style.display = 'block';
          setTimeout(() => {
            col.style.opacity = '1';
            col.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Fade out non-matching items
          col.style.opacity = '0';
          col.style.transform = 'scale(0.9)';
          setTimeout(() => {
            col.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Interactive Contact Form Handling with FormSubmit ---
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      
      const formName = document.getElementById('formName').value;
      const formEmail = document.getElementById('formEmail').value;
      const formSubject = document.getElementById('formSubject').value;
      const formMessage = document.getElementById('formMessage').value;
      
      // Toggle button sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';

      const showSuccessToast = () => {
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Message Sent!';
        submitBtn.className = 'btn btn-success rounded-pill px-4';
        contactForm.reset();
        
        // Render success notification popup
        const alertDiv = document.createElement('div');
        alertDiv.className = 'position-fixed bottom-0 end-0 m-4 alert alert-success alert-dismissible fade show shadow-lg border-0';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.style.zIndex = '9999';
        alertDiv.style.borderRadius = '12px';
        alertDiv.innerHTML = `
          <strong><i class="bi bi-emoji-smile me-1"></i> Thank You!</strong> Your message has been sent successfully.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Remove toast notification alert after 4 seconds
        setTimeout(() => {
          const bsAlert = new bootstrap.Alert(alertDiv);
          bsAlert.close();
        }, 4000);
        
        // Reset submit button state
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          submitBtn.className = 'btn btn-indigo-gradient rounded-pill px-4';
        }, 3000);
      };

      const showErrorToast = (err) => {
        submitBtn.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> Failed to Send';
        submitBtn.className = 'btn btn-danger rounded-pill px-4';
        console.error('Submission Error:', err);

        const alertDiv = document.createElement('div');
        alertDiv.className = 'position-fixed bottom-0 end-0 m-4 alert alert-danger alert-dismissible fade show shadow-lg border-0';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.style.zIndex = '9999';
        alertDiv.style.borderRadius = '12px';
        alertDiv.innerHTML = `
          <strong><i class="bi bi-x-circle-fill me-1"></i> Error!</strong> Failed to deliver email. Please check your internet connection and try again.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
          const bsAlert = new bootstrap.Alert(alertDiv);
          bsAlert.close();
        }, 5000);

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          submitBtn.className = 'btn btn-indigo-gradient rounded-pill px-4';
        }, 3000);
      };

      // AJAX Send via FormSubmit.co API (directly forwards to vivekrathod212002@gmail.com)
      fetch("https://formsubmit.co/ajax/vivekrathod212002@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          _subject: `New Portfolio Message: ${formSubject}`,
          message: formMessage
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data.success === 'true') {
          showSuccessToast();
        } else {
          showErrorToast(data.message || 'FormSubmit failed.');
        }
      })
      .catch(error => {
        showErrorToast(error);
      });
      });
    });
  }

  // --- Back to Top Button Control ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Dynamic Active Navbar Link Scroll Spy ---
  const sections = document.querySelectorAll('section, header');
  const navLinksItems = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for fixed navbar
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navLinksItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
});

