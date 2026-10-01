// PARTICULES FLOTTANTES
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth, height = window.innerHeight;
    let particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// GESTION DE LA NAVIGATION MOBILE
const mobileBtn = document.getElementById('mobileToggle');
const navUl = document.getElementById('navLinks');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });
}

// ANIMATION AU SCROLL (Intersection Observer)
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const bars = entry.target.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const pct = bar.getAttribute('data-pct');
                if (pct && bar.style.width !== pct + '%') {
                    setTimeout(() => { bar.style.width = pct + '%'; }, 100);
                }
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

// OBSERVER SPÉCIFIQUE POUR LES CARTES DE COMPÉTENCES
document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
document.querySelectorAll('.timeline-item').forEach(t => observer.observe(t));
document.querySelectorAll('.projet-card').forEach(p => observer.observe(p));

// ACTIVE LINK AU SCROLL
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// FERMER LE MENU MOBILE APRÈS CLIC SUR UN LIEN
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navUl) navUl.classList.remove('active');
    });
});

// INITIALISATION DES BARRES DÉJÀ VISIBLES AU CHARGEMENT
setTimeout(() => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
            const innerBars = el.querySelectorAll('.bar-fill');
            innerBars.forEach(bar => {
                if (bar.dataset.pct) bar.style.width = bar.dataset.pct + '%';
            });
        }
    });
}, 200);


// ============================================
// PAGE DE CHARGEMENT (0% → 100%)
// ============================================

(function() {
    // Créer l'overlay de chargement
    const loaderOverlay = document.createElement('div');
    loaderOverlay.id = 'loader-overlay';
    loaderOverlay.innerHTML = `
        <div class="loader-container">
            <div class="loader-ring">
                <div class="loader-ring-inner"></div>
                <svg class="loader-svg" viewBox="0 0 100 100">
                    <circle class="loader-bg" cx="50" cy="50" r="45" fill="none" stroke="rgba(0,230,255,0.2)" stroke-width="3"/>
                    <circle class="loader-progress" cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" stroke-width="4" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00e6ff"/>
                            <stop offset="100%" stop-color="#00f5a0"/>
                        </linearGradient>
                    </defs>
                </svg>
                <div class="loader-percentage">
                    <span id="loading-percent">0</span><span>%</span>
                </div>
            </div>
            <div class="loader-text">
                <span class="loader-greeting">Chargement de l'univers</span>
                <span class="loader-name">Evrard AYIDEDJI</span>
            </div>
            <div class="loader-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    // Styles pour le loader
    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        #loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 20%, #03050b, #010101);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1);
            opacity: 1;
            backdrop-filter: blur(0px);
        }
        
        .loader-container {
            text-align: center;
            position: relative;
            animation: fadeInScale 0.5s ease;
        }
        
        .loader-ring {
            position: relative;
            width: 180px;
            height: 180px;
            margin: 0 auto;
        }
        
        .loader-svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }
        
        .loader-progress {
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            transition: stroke-dashoffset 0.05s linear;
            filter: drop-shadow(0 0 8px rgba(0,230,255,0.5));
        }
        
        .loader-percentage {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.8rem;
            font-weight: 800;
            font-family: 'Space Grotesk', monospace;
            background: linear-gradient(135deg, #fff, #00e6ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .loader-percentage span:first-child {
            font-size: 3.2rem;
            font-weight: 800;
        }
        
        .loader-text {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .loader-greeting {
            font-size: 0.9rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: rgba(0,230,255,0.7);
            font-weight: 500;
        }
        
        .loader-name {
            font-size: 1.4rem;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, #fff, #00e6ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .loader-dots {
            margin-top: 1.5rem;
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        
        .loader-dots span {
            width: 8px;
            height: 8px;
            background: #00e6ff;
            border-radius: 50%;
            animation: dotPulse 1.2s infinite ease-in-out;
        }
        
        .loader-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .loader-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes dotPulse {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.4;
            }
            40% {
                transform: scale(1);
                opacity: 1;
                box-shadow: 0 0 10px #00e6ff;
            }
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes glowPulse {
            0% {
                box-shadow: 0 0 0px rgba(0,230,255,0);
            }
            100% {
                box-shadow: 0 0 20px rgba(0,230,255,0.6);
            }
        }
        
        /* Animation de sortie du loader */
        .loader-hidden {
            opacity: 0;
            pointer-events: none;
            visibility: visible;
        }
        
        /* Contenu principal masqué initialement */
        body.loading main,
        body.loading header,
        body.loading footer {
            opacity: 0;
            visibility: hidden;
        }
        
        body.loaded main,
        body.loaded header,
        body.loaded footer {
            animation: contentReveal 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        
        @keyframes contentReveal {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(loaderStyles);
    document.body.insertBefore(loaderOverlay, document.body.firstChild);
    
    // Ajouter la classe loading au body pour masquer le contenu
    document.body.classList.add('loading');
    
    // Animation de progression
    let percentage = 0;
    const percentElement = document.getElementById('loading-percent');
    const progressCircle = document.querySelector('.loader-progress');
    const circumference = 2 * Math.PI * 45; // ~282.74
    const maxOffset = circumference;
    
    // Simuler le chargement (0 à 100%)
    const interval = setInterval(() => {
        if (percentage < 100) {
            // Incrémentation variable pour un effet plus naturel
            const increment = Math.floor(Math.random() * 5) + 1;
            percentage = Math.min(percentage + increment, 100);
            
            // Mettre à jour l'affichage
            if (percentElement) {
                percentElement.textContent = percentage;
            }
            
            // Mettre à jour le cercle de progression
            if (progressCircle) {
                const offset = maxOffset - (percentage / 100) * maxOffset;
                progressCircle.style.strokeDashoffset = offset;
            }
        } else {
            clearInterval(interval);
            
            // Petite animation finale avant la disparition
            const loaderOverlayElem = document.getElementById('loader-overlay');
            if (loaderOverlayElem) {
                // Ajouter un effet de brillance final
                const ring = document.querySelector('.loader-ring');
                if (ring) {
                    ring.style.animation = 'glowPulse 0.3s ease-out';
                }
                
                // Attendre un court instant pour l'effet final
                setTimeout(() => {
                    loaderOverlayElem.classList.add('loader-hidden');
                    
                    // Révéler le contenu principal
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                    
                    // Supprimer l'overlay après la transition
                    setTimeout(() => {
                        if (loaderOverlayElem && loaderOverlayElem.parentNode) {
                            loaderOverlayElem.remove();
                        }
                    }, 800);
                    
                    // Déclencher manuellement l'IntersectionObserver pour les éléments déjà visibles
                    setTimeout(() => {
                        const fadeElements = document.querySelectorAll('.fade-up');
                        fadeElements.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            if (rect.top < window.innerHeight - 100) {
                                el.classList.add('visible');
                                const innerBars = el.querySelectorAll('.bar-fill');
                                innerBars.forEach(bar => {
                                    if (bar.dataset.pct && !bar.style.width) {
                                        bar.style.width = bar.dataset.pct + '%';
                                    }
                                });
                            }
                        });
                    }, 100);
                }, 300);
            }
        }
    }, 35);
    
    // Option : ajouter un message de bienvenue personnalisé selon le pourcentage
    const greetingElement = document.querySelector('.loader-greeting');
    const greetings = [
        'Initialisation du système',
        'Chargement des compétences',
        'Préparation de l\'univers',
        'Calibration visuelle',
        'Activation des animations',
        'Bienvenue dans mon monde'
    ];
    
    let greetingIndex = 0;
    const greetingInterval = setInterval(() => {
        if (percentage < 95 && greetingElement) {
            greetingIndex = Math.min(greetingIndex + 1, greetings.length - 1);
            greetingElement.textContent = greetings[greetingIndex];
        } else if (percentage >= 95) {
            greetingElement.textContent = 'Prêt à explorer';
            clearInterval(greetingInterval);
        }
    }, 380);
})();