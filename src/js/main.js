document.addEventListener('DOMContentLoaded', function() {
    // NAVEGACIÓN MÓVIL
    const navToggle = document.querySelector("#navToggle");
    const mobilePanel = document.querySelector("#mobilePanel");
    
    if (navToggle && mobilePanel) {
        function closeMenu() {
            navToggle.setAttribute("aria-expanded", "false");
            mobilePanel.hidden = true;
        }
        
        function openMenu() {
            navToggle.setAttribute("aria-expanded", "true");
            mobilePanel.hidden = false;
        }
        
        navToggle.addEventListener("click", function() {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            if (expanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        document.querySelectorAll(".panel-link, .panel-cta").forEach(function(link) {
            link.addEventListener("click", closeMenu);
        });
        
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                closeMenu();
            }
        });
        
        document.addEventListener("click", function(e) {
            if (!mobilePanel.hidden && 
                !mobilePanel.contains(e.target) && 
                e.target !== navToggle) {
                closeMenu();
            }
        });
    }
    
    // COOKIE BANNER
    const cookieBanner = document.getElementById("cookie-banner");
    if (cookieBanner) {
        const cookieBtn = document.getElementById("cookieBtn");
        if (cookieBtn) {
            // Mostrar banner después de 2 segundos
            setTimeout(() => {
                if (!localStorage.getItem('cookiesAccepted')) {
                    cookieBanner.classList.add('show');
                }
            }, 2000);
            
            cookieBtn.addEventListener("click", function() {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.remove('show');
            });
        }
    }
    
    // CAMBIO DE TEMA (CLARO/OSCURO)
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    
    function initTheme() {
        // Verificar preferencia guardada o del sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    }
    
    function setLightTheme() {
        document.body.classList.add('light-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
        }
        if (themeToggleMobile) {
            themeToggleMobile.innerHTML = '<i class="fas fa-sun"></i> Modo oscuro';
        }
        localStorage.setItem('theme', 'light');
    }
    
    function setDarkTheme() {
        document.body.classList.remove('light-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
        }
        if (themeToggleMobile) {
            themeToggleMobile.innerHTML = '<i class="fas fa-moon"></i> Modo claro';
        }
        localStorage.setItem('theme', 'dark');
    }
    
    function toggleTheme() {
        if (document.body.classList.contains('light-theme')) {
            setDarkTheme();
        } else {
            setLightTheme();
        }
    }
    
    // Inicializar tema
    initTheme();
    
    // Agregar event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function() {
            toggleTheme();
            closeMenu(); // Cerrar menú móvil después de cambiar tema
        });
    }
    
    // FORMULARIO DE CONTACTO
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validación básica
            if (!name || !email || !message) {
                showFormMessage('Por favor, completa todos los campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Por favor, ingresa un email válido.', 'error');
                return;
            }
            
            // Simular envío (en un proyecto real, aquí iría el envío real)
            showFormMessage('Enviando mensaje...', 'success');
            
            // Simular retraso de red
            setTimeout(() => {
                showFormMessage('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
                contactForm.reset();
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }
    
    function showFormMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ANIMACIÓN DE SKILLS AL SCROLL
    function animateOnScroll() {
        const elements = document.querySelectorAll('.project-card, .contact-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
    // Iniciar animaciones
    setTimeout(animateOnScroll, 500);
    
    // ACTUALIZAR AÑO EN FOOTER
    const yearElements = document.querySelectorAll('footer small');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        if (el.textContent.includes('2025')) {
            el.textContent = el.textContent.replace('2025', currentYear);
        }
    });
    
    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log("Portafolio de Juan Elias cargado correctamente");
});