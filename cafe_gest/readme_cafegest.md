# CafeGest - Main JavaScript Module

## Descripción
`main_cafegest.js` es el módulo principal de JavaScript para la aplicación **CafeGest**, un sistema de gestión para parcelas cafeteras. Este archivo maneja la interfaz de usuario interactiva del menú principal, incluyendo animaciones, efectos visuales y navegación entre módulos.

## Funcionalidades Principales

### 🎯 Navegación de Módulos
El sistema gestiona tres módulos principales:
- **Recogida de Café**: Navegación hacia `components/cosecha_cafe/cosecha.html`
- **Facturas**: Navegación hacia `components/factura_venta/factura_venta.html`
- **Insumos**: Navegación hacia `components/insumos_cafe/insumos_cafe.html`

### ✨ Efectos Visuales y Animaciones

#### Animación de Escritura
- Efecto de máquina de escribir para el título "Parcela Los Toches"
- Ciclo continuo de escritura y borrado
- Velocidades configurables para escritura (150ms) y borrado (50ms)

#### Efectos de Botones
- **Efecto Ripple**: Animación de ondas al hacer clic en el botón home
- **Partículas Flotantes**: 12 partículas animadas por botón con movimiento aleatorio
- **Efecto Flash**: Destello de luz al hacer clic en los botones principales
- **Animación Flotante**: Movimiento sutil y continuo de los íconos

#### Estados de Carga
- Animaciones de loading personalizadas para cada módulo
- Transiciones suaves entre estados
- Simulación de tiempo de carga (1.5 segundos)

## Estructura del Código

### Event Listeners Principales
```javascript
// Navegación de módulos
btnRecogida.addEventListener('click', ...)
btnFacturas.addEventListener('click', ...)
btnInsumos.addEventListener('click', ...)

// Efecto ripple para botón home
homeBtn.addEventListener('mousedown', ...)
```

### Funciones Clave

#### `createRippleEffect(e, button)`
Crea el efecto de ondas expansivas en los botones.

#### `typeWriter()`
Maneja la animación de escritura del título principal con lógica de escritura/borrado.

#### `animateButtonContent()`
Controla las animaciones sutiles y continuas de los íconos de botones.

## Elementos DOM Requeridos

### Botones Principales
- `#btn-recogida` - Botón para módulo de cosecha
- `#btn-facturas` - Botón para módulo de facturas  
- `#btn-insumos` - Botón para módulo de insumos
- `#home-button` - Botón de inicio con efecto ripple

### Contenedores de Carga
- `#recogida-loading` - Animación de carga para cosecha
- `#facturas-loading` - Animación de carga para facturas
- `#insumos-loading` - Animación de carga para insumos

### Elementos de Texto
- `#typing-text` - Contenedor para el efecto de escritura

### Estructura de Botones
Cada botón debe contener:
```html
<button id="btn-modulo">
    <div class="btn-content">
        <div class="icon"><!-- Ícono del módulo --></div>
        <!-- Contenido del botón -->
    </div>
</button>
```

## Configuración de Animaciones

### Timing de Escritura
- **Escritura**: 150ms por carácter
- **Borrado**: 50ms por carácter  
- **Pausa completa**: 2000ms
- **Pausa entre ciclos**: 500ms

### Partículas
- **Cantidad por botón**: 12 partículas
- **Duración de animación**: 2-5 segundos (aleatoria)
- **Delay inicial**: 0-2 segundos (aleatorio)

### Efectos de Carga
- **Delay de activación**: 300ms
- **Duración de simulación**: 2000ms
- **Tiempo de redirección**: 1500ms

## CSS Classes Generadas Dinámicamente

El script genera las siguientes clases CSS que deben estar definidas en el archivo de estilos:

- `.circle` - Para el efecto ripple
- `.particles-container` - Contenedor de partículas
- `.particle` - Partículas individuales flotantes
- `.flash-overlay` - Capa para efecto flash
- `.flash` - Estado activo del efecto flash

## Dependencias

- **DOM**: El script requiere que el DOM esté completamente cargado
- **CSS**: Archivo de estilos complementario con las animaciones definidas
- **Estructura HTML**: Elementos DOM con IDs específicos

## Compatibilidad

- **Navegadores Modernos**: ES6+ compatible
- **Eventos**: addEventListener API
- **Timing**: setTimeout y setInterval
- **DOM Manipulation**: Métodos estándar de manipulación DOM

## Instalación y Uso

1. Incluir el archivo en el HTML principal:
```html
<script src="main_cafegest.js"></script>
```

2. Asegurar que todos los elementos DOM requeridos estén presentes

3. Incluir los estilos CSS correspondientes para las animaciones

## Notas de Desarrollo

- El código incluye simulación de tiempos de carga que pueden ajustarse para producción
- Las animaciones están optimizadas para no interferir con la experiencia del usuario
- Se implementa limpieza automática de elementos temporales para evitar memory leaks
- El efecto de escritura es infinito y auto-reiniciable

## Autor
Sistema CafeGest - Gestión de Parcelas Cafeteras

---
*Última actualización: Junio 2025*