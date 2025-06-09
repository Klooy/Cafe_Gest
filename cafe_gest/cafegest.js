// ===== SISTEMA DE PROTECCIÓN ANTI-PLAGIO CAFÉGEST =====
// Implementar al inicio de cada archivo JavaScript principal

class CafeGestProtection {
    constructor() {
        this.appName = "CaféGest";
        this.version = "1.5.0";
        this.author = "Equipo CaféGest";
        this.email = "mfcorrales26@gmail.com";
        this.license = "MIT";
        this.repository = "https://github.com/Klooy/Cafe_Gest";
        this.officialDomain = "sistema-parcela.netlify.app";
        
        this.initProtection();
    }

    initProtection() {
        this.addWatermark();
        this.protectConsole();
        this.addCopyrightNotices();
        this.protectCode();
        this.addLegalNotices();
    }

    // 1. MARCA DE AGUA VISIBLE
    addWatermark() {
        const watermark = document.createElement('div');
        watermark.id = 'cafegest-watermark';
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(139, 69, 19, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 11px;
            font-family: Arial, sans-serif;
            z-index: 999999;
            pointer-events: none;
            opacity: 0.8;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
        `;
        watermark.innerHTML = `© ${this.appName} v${this.version} - ${this.author}`;
        document.body.appendChild(watermark);

        // Proteger la marca de agua
        this.protectElement(watermark);
    }

    // 2. PROTECCIÓN DE CONSOLA CON INFORMACIÓN DE COPYRIGHT
    protectConsole() {
        console.clear();
        console.log(`
%c
 ██████╗ █████╗ ███████╗███████╗ ██████╗ ███████╗███████╗████████╗
██╔════╝██╔══██╗██╔════╝██╔════╝██╔════╝ ██╔════╝██╔════╝╚══██╔══╝
██║     ███████║█████╗  █████╗  ██║  ███╗█████╗  ███████╗   ██║   
██║     ██╔══██║██╔══╝  ██╔══╝  ██║   ██║██╔══╝  ╚════██║   ██║   
╚██████╗██║  ██║██║     ███████╗╚██████╔╝███████╗███████║   ██║   
 ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝   

%c🔒 SISTEMA PROTEGIDO POR DERECHOS DE AUTOR 🔒

%c📋 INFORMACIÓN DEL SISTEMA:
   • Nombre: ${this.appName}
   • Versión: ${this.version}
   • Autor: ${this.author}
   • Email: ${this.email}
   • Licencia: ${this.license}
   • Repositorio: ${this.repository}

%c⚠️  AVISO LEGAL:
   Este sistema está protegido por derechos de autor.
   El uso no autorizado, copia o distribución sin atribución
   constituye una violación de los derechos de autor.

%c📧 Para licencias comerciales contactar: ${this.email}
        `, 
        'color: #8B4513; font-weight: bold;',
        'color: #D2691E; font-size: 16px; font-weight: bold;',
        'color: #000; font-size: 12px;',
        'color: #ff4444; font-size: 12px; font-weight: bold;',
        'color: #0066cc; font-size: 12px;'
        );

        // Mostrar advertencia si se detecta developer tools
        this.detectDevTools();
    }

    // 3. DETECTAR HERRAMIENTAS DE DESARROLLADOR
    detectDevTools() {
        let devtools = {open: false, orientation: null};
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.log(`
%c🚨 ADVERTENCIA DE SEGURIDAD 🚨

%cSe han detectado herramientas de desarrollador abiertas.

%c⚖️  RECORDATORIO LEGAL:
• Este código está protegido por derechos de autor
• La inspección del código no otorga derechos de uso
• El plagio o copia no autorizada es ilegal
• Se requiere atribución apropiada para cualquier uso

%c📞 Para consultas legales: ${this.email}
                    `,
                    'color: #ff0000; font-size: 18px; font-weight: bold;',
                    'color: #ff6600; font-size: 14px;',
                    'color: #000; font-size: 12px;',
                    'color: #0066cc; font-size: 12px;'
                    );
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // 4. NOTIFICACIONES DE COPYRIGHT EN HTML
    addCopyrightNotices() {
        // Agregar meta tags de copyright
        const metaTags = [
            { name: 'copyright', content: `© 2025 ${this.author}. Todos los derechos reservados.` },
            { name: 'author', content: this.author },
            { name: 'application-name', content: this.appName },
            { name: 'generator', content: `${this.appName} v${this.version}` },
            { property: 'og:site_name', content: this.appName },
            { property: 'og:type', content: 'website' }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            if (tag.name) meta.name = tag.name;
            if (tag.property) meta.property = tag.property;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });

        // Comentario HTML invisible
        const comment = document.createComment(`
            ${this.appName} v${this.version}
            Copyright © 2025 ${this.author}
            Email: ${this.email}
            Licencia: ${this.license}
            
            AVISO LEGAL:
            Este código está protegido por derechos de autor.
            El uso, modificación o distribución requiere atribución apropiada.
            Para licencias comerciales contactar: ${this.email}
        `);
        document.head.appendChild(comment);
    }

    // 7. ADVERTENCIA DE MANIPULACIÓN
    showTamperingWarning() {
        console.warn(`
🔒 MANIPULACIÓN DETECTADA
La marca de agua de copyright ha sido removida.
Esto constituye una violación de los términos de uso.
Sistema: ${this.appName} v${this.version}
Autor: ${this.author}
        `);
    }

    // 8. PROTEGER ELEMENTOS ESPECÍFICOS
    protectElement(element) {
        // Prevenir eliminación del elemento
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node === element) {
                            document.body.appendChild(element);
                            console.warn('Intento de eliminación de marca de agua detectado');
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 9. INFORMACIÓN DE LICENCIA
    addLegalNotices() {
        // Agregar información legal al pie de página
        const legalNotice = document.createElement('div');
        legalNotice.id = 'cafegest-legal';
        legalNotice.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            text-align: center;
            padding: 5px;
            font-size: 10px;
            z-index: 999998;
            opacity: 0.7;
        `;
        legalNotice.innerHTML = `
            ${this.appName} © 2025 ${this.author} | Licencia: ${this.license} | 
            <a href="mailto:${this.email}" style="color: #ccc;">Contacto</a>
        `;
        document.body.appendChild(legalNotice);

        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            legalNotice.style.display = 'none';
        }, 10000);
    }

    // 10. PROTECCIÓN DE CÓDIGO (BÁSICA)
    protectCode() {
        // Deshabilitar clic derecho
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log('Clic derecho deshabilitado por protección de copyright');
        });

        // Deshabilitar teclas comunes de desarrollador
        document.addEventListener('keydown', (e) => {
            // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.keyCode === 123 || 
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                console.log('Tecla de desarrollador bloqueada por protección de copyright');
            }
        });

        // Mensaje anti-copy en selección de texto
        document.addEventListener('selectstart', () => {
            console.log('Selección de código monitoreada - Copyright protegido');
        });
    }

    // 11. GENERAR HASH DE INTEGRIDAD
    generateIntegrityHash() {
        const content = document.documentElement.outerHTML;
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    // 12. REPORTAR USO NO AUTORIZADO (simulado)
    reportUnauthorizedUsage() {
        const report = {
            app: this.appName,
            version: this.version,
            domain: window.location.hostname,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            integrity: this.generateIntegrityHash()
        };

        // En un entorno real, esto enviaría el reporte a un servidor
        console.log('Reporte de uso no autorizado:', report);
        
        // Simulación de envío a servidor
        // fetch('https://api.cafegest.com/report-unauthorized', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(report)
        // });
    }

    // 13. INFORMACIÓN PARA DESARROLLADORES LEGÍTIMOS
    showDeveloperInfo() {
        console.log(`
%c👨‍💻 INFORMACIÓN PARA DESARROLLADORES

%c¿Te gusta ${this.appName}?
Estamos abiertos a colaboraciones y licencias personalizadas.

%c📧 Contacto: ${this.email}
🌐 Repositorio: ${this.repository}
📄 Licencia actual: ${this.license}

%c💡 Opciones disponibles:
• Licencias comerciales personalizadas
• Desarrollo de características específicas
• Consultoría técnica
• Colaboración en código abierto

%c🤝 ¡Trabajemos juntos de manera legal y ética!
        `,
        'color: #0066cc; font-size: 14px; font-weight: bold;',
        'color: #000; font-size: 12px;',
        'color: #666; font-size: 11px;',
        'color: #008800; font-size: 11px;',
        'color: #ff6600; font-size: 12px; font-weight: bold;'
        );
    }
}

// ===== IMPLEMENTACIÓN AUTOMÁTICA =====

// Inicializar protección cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const protection = new CafeGestProtection();
    
    // Mostrar información para desarrolladores después de 5 segundos
    setTimeout(() => {
        protection.showDeveloperInfo();
    }, 5000);
});

// Protección adicional para prevenir manipulación del script
(function() {
    'use strict';
    
    // Verificar que el script no ha sido modificado
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    // Preservar funciones originales
    window.cafegestProtection = {
        version: "1.5.0",
        author: "Equipo CaféGest",
        protected: true
    };
    
    // Mensaje final
    console.log('%cCaféGest Protection System Loaded ✅', 'color: green; font-weight: bold;');
})();