// Variables de estado para el sidebar
let sidebarCollapsed = false;

// Referencias a elementos del DOM
const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const mobileToggle = document.querySelector('.mobile-toggle');

// Función para colapsar/expandir el sidebar
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    content.classList.toggle('content-expanded', sidebarCollapsed);
}

// Event listener para el botón toggle
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevenir propagación
    toggleSidebar();
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    mobileToggle.classList.toggle('menu-open');
});

// Category expansion
const categories = document.querySelectorAll('.category-header');
categories.forEach(category => {
    category.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevenir propagación
        
        // No colapsar categorías en modo móvil o si el sidebar está colapsado
        if (window.innerWidth <= 992 || !sidebarCollapsed) {
            const parent = category.parentElement;
            parent.classList.toggle('category-expanded');
        }
    });
});

// Active menu item
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // No prevenir la propagación por defecto aquí para permitir que el enlace funcione
        
        // Solo establecer activo y manejar el sidebar móvil
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Cerrar sidebar en móvil al seleccionar una opción
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('mobile-open');
            mobileToggle.classList.remove('menu-open');
        }
        
        // No alterar el estado colapsado/expandido del sidebar al hacer clic en un elemento
    });
});

// Expandir automáticamente la primera categoría al cargar
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.category').classList.add('category-expanded');
});

// Botón salir
document.getElementById('btn-salir').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación
    
    if (confirm('¿Está seguro que desea salir?')) {
        // Aquí redirigir a la página de login o salida
        window.location.href = 'index.html';
    }
});

// Ajustar el sidebar al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    if (window.innerWidth <= 992) {
        // En móvil siempre mostrar el sidebar completo
        sidebarCollapsed = false;
        sidebar.classList.remove('sidebar-collapsed');
        content.classList.remove('content-expanded');
    }
});