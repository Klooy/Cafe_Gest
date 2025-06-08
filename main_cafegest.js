document.addEventListener('DOMContentLoaded', function() {
            const btnRecogida = document.getElementById('btn-recogida');
            const btnFacturas = document.getElementById('btn-facturas');
            const btnInsumos = document.getElementById('btn-insumos');
            const recogidaLoading = document.getElementById('recogida-loading');
            const facturasLoading = document.getElementById('facturas-loading');
            const insumosLoading = document.getElementById('insumos-loading');
            const btnRecogidaContent = btnRecogida.querySelector('.btn-content');
            const btnFacturasContent = btnFacturas.querySelector('.btn-content');
            const btnInsumosContent = btnInsumos.querySelector('.btn-content');
            
            btnRecogida.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Ocultar contenido original y mostrar animación
                btnRecogidaContent.style.display = 'none';
                recogidaLoading.style.display = 'flex';
                
                // Simular carga y redirección
                setTimeout(function() {
                    window.location.href = 'components/cosecha_cafe/cosecha.html';
                }, 1500);
            });
            
            btnFacturas.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Ocultar contenido original y mostrar animación
                btnFacturasContent.style.display = 'none';
                facturasLoading.style.display = 'flex';
                
                // Simular carga y redirección
                setTimeout(function() {
                    window.location.href = 'components/factura_venta/factura_venta.html';
                }, 1500);
            });
            
            btnInsumos.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Ocultar contenido original y mostrar animación
                btnInsumosContent.style.display = 'none';
                insumosLoading.style.display = 'flex';
                
                // Simular carga y redirección
                setTimeout(function() {
                    window.location.href = 'components/insumos_cafe/insumos_cafe.html';
                }, 1500);
            });
        });
        
        // Código existente de main_cafegest.js
        document.addEventListener('DOMContentLoaded', function() {
            const homeBtn = document.getElementById('home-button');
            
            homeBtn.addEventListener('mousedown', function(e) {
                createRippleEffect(e, this);
            });
            
            function createRippleEffect(e, button) {
                // Eliminar círculos antiguos
                const circles = button.getElementsByClassName('circle');
                while(circles.length > 0) {
                    circles[0].remove();
                }
                
                const circle = document.createElement('span');
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                
                circle.style.width = circle.style.height = `${diameter}px`;
                
                const rect = button.getBoundingClientRect();
                circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
                circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
                
                circle.classList.add('circle');
                button.appendChild(circle);
                
                setTimeout(() => {
                    circle.remove();
                }, 600);
            }

            // Código para los botones del menú principal
            const btnRecogida = document.getElementById('btn-recogida');
            const btnFacturas = document.getElementById('btn-facturas');
            const btnInsumos = document.getElementById('btn-insumos');
            
            // Efecto de escritura para el título
            const typingText = document.getElementById('typing-text');
            const text = "Parcela Los Toches";
            let isDeleting = false;
            let charIndex = 0;
            let typingSpeed = 150;
            let pauseTime = 2000; // Tiempo de pausa cuando el texto está completamente escrito
            
            function typeWriter() {
                // Si está borrando texto
                if (isDeleting) {
                    // Borrar un carácter
                    typingText.textContent = text.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50; // Velocidad para borrar (más rápido)
                } else {
                    // Escribir un carácter
                    typingText.textContent = text.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 150; // Velocidad para escribir (más lento)
                }
                
                // Si terminó de escribir, pausar y luego borrar
                if (!isDeleting && charIndex === text.length) {
                    isDeleting = true;
                    typingSpeed = pauseTime; // Pausa antes de empezar a borrar
                } 
                // Si terminó de borrar, empezar a escribir de nuevo
                else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    typingSpeed = 500; // Pausa antes de empezar a escribir
                }
                
                setTimeout(typeWriter, typingSpeed);
            }
            
            // Iniciar la animación de escritura
            typeWriter();
            
            // ** NUEVO CÓDIGO DE ANIMACIONES **
            // Referencia a los botones
            const buttons = [btnRecogida, btnFacturas, btnInsumos];
            
            // Añadir elementos para las nuevas animaciones
            buttons.forEach(button => {
                // Añadir contenedor de partículas
                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'particles-container';
                button.appendChild(particlesContainer);
                
                // Añadir 12 partículas a cada botón
                for (let i = 0; i < 12; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    // Posiciones aleatorias iniciales
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 2}s`;
                    particle.style.animationDuration = `${2 + Math.random() * 3}s`;
                    
                    particlesContainer.appendChild(particle);
                }
                
                // Añadir capa para efecto flash
                const flashOverlay = document.createElement('div');
                flashOverlay.className = 'flash-overlay';
                button.appendChild(flashOverlay);
                
                // Evento de clic para efecto flash
                button.addEventListener('mousedown', function() {
                    this.classList.add('flash');
                    
                    // Mostrar animación de carga correspondiente
                    const buttonId = this.id;
                    const loadingId = buttonId.replace('btn-', '') + '-loading';
                    const loadingContainer = document.getElementById(loadingId);
                    
                    if (loadingContainer) {
                        // Retraso antes de mostrar la animación para permitir el efecto flash
                        setTimeout(() => {
                            loadingContainer.style.display = 'flex';
                            
                            // Simular tiempo de carga (opcional: quitar en producción)
                            setTimeout(() => {
                                loadingContainer.style.display = 'none';
                            }, 2000);
                        }, 300);
                    }
                    
                    // Quitar clase flash después de la animación
                    setTimeout(() => {
                        this.classList.remove('flash');
                    }, 500);
                });
                
                // Efectos para partículas en hover
                button.addEventListener('mouseenter', function() {
                    const particles = this.querySelectorAll('.particle');
                    particles.forEach(particle => {
                        // Reiniciar animación
                        particle.style.animation = 'none';
                        particle.offsetHeight; // Forzar reflow
                        particle.style.animation = `float ${2 + Math.random() * 3}s ease-in-out infinite`;
                        particle.style.animationDelay = `${Math.random() * 1}s`;
                    });
                });
            });
            
            // Función para manejar animación de botones
            function animateButtonContent() {
                buttons.forEach(button => {
                    // Obtener el icono dentro del botón
                    const icon = button.querySelector('.icon');
                    
                    // Efecto flotante sutil continuo
                    if (icon) {
                        setInterval(() => {
                            if (!button.matches(':hover')) {
                                icon.style.transform = 'translateY(0)';
                                setTimeout(() => {
                                    icon.style.transform = 'translateY(-3px)';
                                }, 1500);
                                setTimeout(() => {
                                    icon.style.transform = 'translateY(0)';
                                }, 3000);
                            }
                        }, 4000);
                    }
                });
            }
            
            // Iniciar animación sutil de botones
            animateButtonContent();
        });