      // Mobile Menu Toggle Functionality
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// Page Navigation Functionality
function showPage(pageName) {
    // Hide all page sections
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const currentLinks = document.querySelectorAll(`[data-page="${pageName}"]`);
    currentLinks.forEach(link => {
        link.classList.add('active');
    });
    
    // Close mobile menu after navigation
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
}

// Tab Switching Functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function downloadWorkflow() {
    const workflowContent = `
name: Yasiya-Md Bot Loop Runner

on:
  workflow_dispatch:

jobs:
  loop-task:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm install

      - name: Run Bot (loop & auto-restart if crash)
        continue-on-error: true 
        run: |
          echo "Running Yasiya Md bot in auto-restart mode..."
          timeout 18000 bash -c 'while true; do npm start || echo "Bot crashed, restarting..."; sleep 2; done'

      - name: Re-Trigger Workflow
        if: always()
        run: |
          echo "Re-running workflow..."
          curl -X POST \\
            -H "Authorization: Bearer \${{ secrets.PAT_TOKEN }}" \\
            -H "Accept: application/vnd.github.v3+json" \\
            https://api.github.com/repos/\${{ github.repository }}/actions/workflows/yasiya-md-deploy.yml/dispatches \\
            -d '{"ref":"main"}'
`;

    const blob = new Blob([workflowContent], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'yasiya-md-deploy.yml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation event listeners
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            if (pageName) {
                showPage(pageName);
            }
        });
    });
    
    // Set up tab button event listeners
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const tabName = this.onclick ? this.onclick.toString().match(/showTab\('(\w+)'\)/)[1] : null;
            if (tabName) {
                showTab(tabName);
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const navContainer = document.querySelector('.nav-container');
        
        if (!navContainer.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
    // Add parallax effect to floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        document.querySelectorAll('.floating-circle').forEach((circle, index) => {
            circle.style.transform = `translateY(${parallax * (index + 1) * 0.2}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
    
    // Add intersection observer for card animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards for animation
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add feature cards animation
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Add hover effects for cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });
    
    // Add typing effect for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add glowing effect to buttons on hover
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.5)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
        });
    });
    
    // Add dynamic background particles
    createParticles();
    
    // Form submission handling (if contact form exists)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }
});

// Create animated background particles
function createParticles() {
    const particlesContainer = document.querySelector('.floating-elements');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-circle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 100 + 50}px;
            background: linear-gradient(45deg, 
                rgba(139, 92, 246, ${Math.random() * 0.2}), 
                rgba(6, 182, 212, ${Math.random() * 0.2}));
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Add performance optimization for animations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler for better performance
const debouncedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    document.querySelectorAll('.floating-circle').forEach((circle, index) => {
        circle.style.transform = `translateY(${parallax * (index + 1) * 0.2}px) rotate(${scrolled * 0.1}deg)`;
    });
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Console welcome message
console.log(`
🤖 WhatsApp Bot OFC Platform
=========================
Welcome to the admin console!
Version: 2.0.0
Status: Ready ✅

Available functions:
- toggleMobileMenu()
- showPage(pageName)
- showTab(tabName)
- downloadWorkflow()
`);

// Export functions for global access (if needed)
window.WhatsAppBotOFC = {
    toggleMobileMenu,
    showPage,
    showTab,
    downloadWorkflow
};

  function openPair1() {
    window.open(
      "https://yasiya-md-session-server1.koyeb.app/pair/pair.html",
      "PairDevicePopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openQr1() {
    window.open(
      "https://yasiya-md-session-server1.koyeb.app/qr/qr.html",
      "QrCodePopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

  function openPair2() {
    window.open(
      "https://yasiya-md-session-server2.onrender.com/pair/pair.html",
      "PairDevicePopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openQr2() {
    window.open(
      "https://yasiya-md-session-server2.onrender.com/qr/qr.html",
      "QrCodePopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openheroku() {
    window.open(
      "https://dashboard.heroku.com/new?template=https://github.com/DarkYasiyaNew/YASIYA-MD",
      "HerokuDeployPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openRail() {
    window.open(
      "https://railway.app/dashboard",
      "RailwayDeployPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openRender() {
    window.open(
      "https://render.com/deploy?repo=https://github.com/DarkYasiyaNew/YASIYA-MD",
      "RenderDeployPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function openReplit() {
    window.open(
      "https://replit.com/github/DarkYasiyaNew/YASIYA-MD",
      "ReplitDeployPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }

    function forkRepo() {
    window.open(
      "https://github.com/DarkYasiyaNew/YASIYA-MD/fork",
      "RepoForkPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }
  
    function openRepo() {
    window.open(
      "https://github.com/DarkYasiyaNew/YASIYA-MD",
      "OpenRepoPopup",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  }
