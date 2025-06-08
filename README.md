# CaféGest - Sistema Integral de Gestión Cafetera ☕

**CaféGest** es un sistema web completo para la gestión integral de parcelas cafeteras, desarrollado específicamente para fincas que requieren un control detallado de la producción, ventas e insumos. El sistema incluye un dashboard principal interactivo y tres módulos especializados para cubrir todas las necesidades operativas de una finca cafetera.

## 🏠 Módulos del Sistema

### 1. 📊 Dashboard Principal (`main_cafegest.js`)
- **Interfaz de navegación animada** con efectos visuales atractivos
- **Menú principal interactivo** con botones de acceso rápido
- **Animaciones avanzadas**: Efectos de escritura, ripple, partículas flotantes
- **Navegación fluida** entre los diferentes módulos

### 2. ☕ Módulo de Recolección de Café (`cosecha_cafe/`)
- **Registro detallado** de jornadas de recolección
- **Múltiples unidades de medida** (kilogramos, gramos, arrobas)
- **Cálculo automático** de ganancias y pagos
- **Generación de recibos PDF** profesionales
- **Sistema de búsqueda** y filtrado avanzado

### 3. 📋 Módulo de Facturas de Venta (`factura_venta/`)
- **Gestión completa** de facturas de venta
- **Control de vendedores y clientes**
- **Exportación a Excel** y generación de PDFs
- **Sistema de paginación** inteligente
- **Búsqueda en tiempo real**

### 4. 📦 Módulo de Insumos (`insumos_cafe/`)
- **Control de inventario** de insumos cafeteros
- **Gestión de reabastecimientos** con trazabilidad
- **Registro de usos** y consumos
- **Alertas de disponibilidad** automáticas
- **Exportación de datos** completa

## 🚀 Características Principales

### ✨ Interfaz de Usuario
- **Diseño moderno y responsive** para todos los dispositivos
- **Animaciones fluidas** y efectos visuales atractivos
- **Navegación intuitiva** con menús animados
- **Experiencia de usuario optimizada** para dispositivos móviles

### 🔒 Sistema de Seguridad
- **Protección por contraseña** para operaciones críticas
- **Bloqueo automático** tras intentos fallidos
- **Contraseña predeterminada**: `cafe2025` (personalizable)
- **Sistema de intentos** con tiempo de espera

### 📄 Generación de Documentos
- **Recibos PDF profesionales** con diseño corporativo
- **Facturas de venta** con formato estándar
- **Exportación a Excel** de todos los módulos
- **Formatos colombianos** de moneda y fecha

### 💾 Almacenamiento de Datos
- **Persistencia local** con localStorage
- **Base de datos integrada** para cada módulo
- **Backup automático** de configuraciones
- **Recuperación de datos** al reiniciar

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Lógica de aplicación
- **Font Awesome** - Iconografía profesional

### Librerías Externas
- **SheetJS (XLSX)** - Exportación a Excel
- **jsPDF** - Generación de documentos PDF
- **html2canvas** - Captura de contenido HTML
- **Intl.NumberFormat** - Formateo de moneda colombiana

### APIs del Navegador
- **localStorage** - Almacenamiento persistente
- **Fetch API** - Manejo de recursos
- **DOM API** - Manipulación de elementos
- **Event API** - Gestión de eventos

## 📁 Estructura del Proyecto

```
cafegest/
├── index.html                    # Página principal
├── main_cafegest.js             # Módulo principal
├── styles.css                   # Estilos globales
├── README.md                    # Documentación
├── components/
│   ├── cosecha_cafe/
│   │   ├── cosecha.html
│   │   ├── cosecha.js
│   │   └── styles.css
│   ├── factura_venta/
│   │   ├── factura_venta.html
│   │   ├── factura_venta.js
│   │   └── styles.css
│   └── insumos_cafe/
│       ├── insumos_cafe.html
│       ├── insumos_cafe.js
│       └── styles.css
└── assets/
    ├── images/
    ├── fonts/
    └── icons/
```

## 🚀 Instalación y Configuración

### Requisitos del Sistema
- **Navegador web moderno** (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Servidor web local** (opcional para desarrollo)
- **Conexión a internet** para CDN de librerías

### Instalación Paso a Paso

1. **Descargar el proyecto**
   ```bash
   git clone https://github.com/tu-usuario/cafegest.git
   cd cafegest
   ```

2. **Configurar dependencias CDN**
   
   Incluir en cada archivo HTML:
   ```html
   <!-- Font Awesome -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   
   <!-- SheetJS para Excel -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
   
   <!-- jsPDF para PDFs -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
   ```

3. **Configuración inicial**
   
   Personalizar en cada módulo:
   ```javascript
   // Cambiar contraseña predeterminada
   const ADMIN_PASSWORD = "tu_contraseña_segura";
   
   // Configurar empresa
   const NOMBRE_EMPRESA = "Parcela Los Toches";
   const TELEFONO_EMPRESA = "300-123-4567";
   ```

4. **Ejecutar la aplicación**
   - Abrir `index.html` en un navegador
   - O usar un servidor local como Live Server en VS Code

### Configuración Avanzada

#### Personalización de Animaciones
```javascript
// En main_cafegest.js
const TYPING_SPEED = 150;        // Velocidad de escritura (ms)
const ERASING_SPEED = 50;        // Velocidad de borrado (ms)
const PARTICLE_COUNT = 12;       // Número de partículas por botón
```

#### Configuración de Paginación
```javascript
// En cada módulo
const RECORDS_PER_PAGE = 10;     // Registros por página
const MAX_PAGINATION_BUTTONS = 5; // Botones de paginación visibles
```

#### Personalización de Moneda
```javascript
// Formato de moneda colombiana
const formatoPesosCol = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
```

## 📖 Guía de Uso

### Navegación Principal
1. **Acceder al sistema** abriendo `index.html`
2. **Observar animaciones** del título y botones
3. **Seleccionar módulo** haciendo clic en los botones principales
4. **Navegación con efectos** de carga y transiciones

### Módulo de Recolección de Café
1. **Registrar recolección**:
   - Completar formulario con datos del recolector
   - Seleccionar unidad de medida
   - Ingresar cantidad y precio
   - Guardar registro

2. **Gestionar registros**:
   - Buscar por nombre, fecha o unidad
   - Editar registros existentes (requiere contraseña)
   - Eliminar registros (requiere contraseña)
   - Generar recibos PDF individuales

3. **Exportar datos**:
   - Exportar todos los registros a Excel
   - Calcular totales por fecha específica
   - Generar reportes de producción

### Módulo de Facturas de Venta
1. **Crear facturas**:
   - Ingresar datos del vendedor y cliente
   - Especificar cantidad, unidad y precio
   - Guardar factura automáticamente

2. **Administrar facturas**:
   - Buscar facturas por cualquier campo
   - Navegar con paginación
   - Editar facturas existentes
   - Eliminar facturas con confirmación

3. **Generar documentos**:
   - Vista previa de PDFs en modal
   - Descargar facturas individuales
   - Exportar todas las facturas a Excel

### Módulo de Insumos
1. **Gestionar inventario**:
   - Registrar insumos con cantidad y valor
   - Control automático de disponibilidad
   - Actualización de inventarios en tiempo real

2. **Registrar reabastecimientos**:
   - Seleccionar insumo a reabastecer
   - Ingresar cantidad y responsable
   - Agregar observaciones
   - Actualización automática de inventario

3. **Controlar usos**:
   - Registrar consumo de insumos
   - Validar disponibilidad antes del uso
   - Mantener historial detallado
   - Seguimiento por usuario y fecha

## 🔧 Funciones Técnicas Avanzadas

### Dashboard Principal
```javascript
// Animación de escritura
function typeWriter() {
    // Efecto de máquina de escribir
    // Ciclo automático de escritura/borrado
}

// Efectos de botones
function createRippleEffect(e, button) {
    // Efecto de ondas al hacer clic
}

function createFloatingParticles(button) {
    // Partículas flotantes animadas
}
```

### Sistema de Búsqueda Universal
```javascript
// Búsqueda en tiempo real
function setupSearch(inputId, tableBodyId, searchFunction) {
    // Configuración de búsqueda para cualquier tabla
    // Filtrado instantáneo
    // Destacado de resultados
}
```

### Generación de PDFs
```javascript
// Generación de recibos
function generarReciboPDF(registro) {
    // Crear contenido HTML
    // Convertir a PDF con jsPDF
    // Descargar automáticamente
}

// Vista previa de documentos
function mostrarVistaPrevia(contenido) {
    // Modal con vista previa
    // Opción de descargar o cancelar
}
```

### Exportación de Datos
```javascript
// Exportar a Excel
function exportarAExcel(datos, nombreArchivo) {
    // Formatear datos
    // Crear libro de Excel
    // Descargar automáticamente
}
```

## 📊 Estructura de Datos

### Base de Datos Local
```javascript
// Estructura de almacenamiento
const DB_STRUCTURE = {
    // Recolección de café
    'cafegest_db_recoleccion': [],
    'cafegest_db_recoleccion_counter': 0,
    
    // Facturas de venta
    'cafegest_db_facturas': [],
    'cafegest_db_facturas_counter': 0,
    
    // Insumos
    'cafegest_db_insumos': [],
    'cafegest_db_usos': [],
    'cafegest_db_reabastecimientos': [],
    
    // Seguridad
    'cafegest_db_intentos_fallidos': 0,
    'cafegest_db_tiempo_bloqueado': null
};
```

### Modelo de Datos - Recolección
```javascript
{
    id: Number,                    // ID único
    nombreRecolector: String,      // Nombre del recolector
    cantidad: Number,              // Cantidad recolectada
    unidad: String,               // kg, gramos, arrobas
    fecha: String,                // ISO date string
    ganancia: Number,             // Ganancia calculada
    valorPorUnidad: Number        // Precio por unidad
}
```

### Modelo de Datos - Facturas
```javascript
{
    id: Number,                   // ID único
    vendedor: String,            // Nombre del vendedor
    cliente: String,             // Nombre del cliente
    cantidad: Number,            // Cantidad vendida
    unidad: String,              // Unidad de medida
    precioVenta: Number,         // Precio de venta
    fecha: String,               // Fecha de la factura
    total: Number                // Total calculado
}
```

### Modelo de Datos - Insumos
```javascript
{
    id: Number,                  // ID único
    nombre: String,              // Nombre del insumo
    cantidad: Number,            // Cantidad en kg
    valor: Number,               // Valor monetario
    fecha: String,               // Fecha de registro
    disponibilidad: String       // "Disponible" | "No Disponible"
}
```

## 🔐 Sistema de Seguridad

### Configuración de Seguridad
```javascript
const SECURITY_CONFIG = {
    ADMIN_PASSWORD: "cafe2025",      // Contraseña predeterminada
    MAX_ATTEMPTS: 3,                 // Intentos máximos
    LOCKOUT_TIME: 10 * 60 * 1000,   // 10 minutos en ms
    PROTECTED_OPERATIONS: [
        'edit', 'delete', 'export'
    ]
};
```

### Funciones de Seguridad
```javascript
// Verificar contraseña
function verificarPassword(operacion, callback) {
    // Validar contraseña para operaciones críticas
    // Manejar intentos fallidos
    // Aplicar bloqueo temporal
}

// Verificar estado de bloqueo
function estaBloqueado() {
    // Verificar si el sistema está bloqueado
    // Calcular tiempo restante
    // Mostrar mensaje de bloqueo
}
```

## 📱 Diseño Responsive

### Breakpoints CSS
```css
/* Móvil */
@media (max-width: 480px) {
    .container { padding: 10px; }
    .btn-group { flex-direction: column; }
}

/* Tablet */
@media (max-width: 768px) {
    .table-responsive { overflow-x: auto; }
    .pagination { flex-wrap: wrap; }
}

/* Desktop */
@media (min-width: 1024px) {
    .main-content { max-width: 1200px; }
    .grid-layout { grid-template-columns: repeat(3, 1fr); }
}
```

### Adaptaciones Móviles
- **Botones táctiles** optimizados (mínimo 44px)
- **Formularios responsivos** con campos apilados
- **Tablas horizontales** con scroll en móviles
- **Menús colapsables** para navegación
- **Modales fullscreen** en pantallas pequeñas

## 🎨 Personalización Visual

### Variables CSS Globales
```css
:root {
    /* Colores principales */
    --primary-color: #8B4513;
    --secondary-color: #D2691E;
    --accent-color: #F4A460;
    
    /* Colores de estado */
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    
    /* Tipografía */
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --font-size-base: 14px;
    --font-size-large: 18px;
    --font-size-small: 12px;
    
    /* Espaciado */
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    /* Bordes y sombras */
    --border-radius: 8px;
    --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    --transition: all 0.3s ease;
}
```

### Temas Personalizables
```javascript
// Configuración de temas
const THEMES = {
    default: {
        primary: '#8B4513',
        secondary: '#D2691E',
        background: '#F5F5F5'
    },
    dark: {
        primary: '#5D4037',
        secondary: '#8D6E63',
        background: '#2E2E2E'
    },
    light: {
        primary: '#A0522D',
        secondary: '#DEB887',
        background: '#FFFFFF'
    }
};
```

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. Los datos no se guardan
**Síntomas**: Los registros desaparecen al recargar la página
**Soluciones**:
- Verificar que localStorage esté habilitado
- Comprobar que no esté en modo incógnito
- Verificar permisos del navegador
- Limpiar cookies y cache

#### 2. Las librerías no cargan
**Síntomas**: Funciones de PDF o Excel no funcionan
**Soluciones**:
- Verificar conexión a internet
- Comprobar URLs de CDN
- Usar versiones alternativas de las librerías
- Descargar librerías localmente

#### 3. Problemas de rendimiento
**Síntomas**: La aplicación se vuelve lenta
**Soluciones**:
- Limpiar datos antiguos
- Reducir registros por página
- Optimizar búsquedas
- Usar navegador actualizado

#### 4. Errores de formato
**Síntomas**: Monedas o fechas mal formateadas
**Soluciones**:
- Verificar configuración regional
- Actualizar navegador
- Limpiar cache del navegador
- Verificar zona horaria

### Comandos de Depuración

```javascript
// Verificar estado de la aplicación
console.log('Estado de localStorage:', localStorage);

// Ver datos de cada módulo
console.log('Recolección:', JSON.parse(localStorage.getItem('cafegest_db_recoleccion')));
console.log('Facturas:', JSON.parse(localStorage.getItem('cafegest_db_facturas')));
console.log('Insumos:', JSON.parse(localStorage.getItem('cafegest_db_insumos')));

// Limpiar datos específicos
localStorage.removeItem('cafegest_db_recoleccion');

// Limpiar todos los datos (¡Cuidado!)
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('cafegest_db_')) {
        localStorage.removeItem(key);
    }
});

// Verificar estado de seguridad
console.log('Intentos fallidos:', localStorage.getItem('cafegest_db_intentos_fallidos'));
console.log('Tiempo de bloqueo:', localStorage.getItem('cafegest_db_tiempo_bloqueado'));
```

## 🚀 Optimización y Rendimiento

### Mejores Prácticas Implementadas
- **Lazy loading** de contenido pesado
- **Paginación** para grandes volúmenes de datos
- **Debouncing** en funciones de búsqueda
- **Event delegation** para manejo eficiente de eventos
- **Memory cleanup** para prevenir memory leaks

### Configuración de Rendimiento
```javascript
// Configuración de paginación
const PERFORMANCE_CONFIG = {
    RECORDS_PER_PAGE: 10,           // Registros por página
    SEARCH_DEBOUNCE_TIME: 300,      // Tiempo de espera para búsqueda (ms)
    ANIMATION_DURATION: 300,        // Duración de animaciones (ms)
    MAX_CACHE_SIZE: 1000,          // Máximo de registros en cache
    CLEANUP_INTERVAL: 5 * 60 * 1000 // Limpieza cada 5 minutos
};
```

### Monitoreo de Rendimiento
```javascript
// Medir tiempo de carga
function measurePerformance(operacion, funcion) {
    const inicio = performance.now();
    const resultado = funcion();
    const tiempo = performance.now() - inicio;
    console.log(`${operacion} completada en ${tiempo.toFixed(2)}ms`);
    return resultado;
}

// Monitorear uso de memoria
function monitorearMemoria() {
    if (performance.memory) {
        console.log('Memoria usada:', performance.memory.usedJSHeapSize);
        console.log('Memoria total:', performance.memory.totalJSHeapSize);
        console.log('Límite de memoria:', performance.memory.jsHeapSizeLimit);
    }
}
```

## 📈 Métricas y Análisis

### Datos de Producción
```javascript
// Calcular métricas de recolección
function calcularMetricasRecoleccion() {
    const registros = JSON.parse(localStorage.getItem('cafegest_db_recoleccion')) || [];
    
    return {
        totalRegistros: registros.length,
        totalKilos: registros.reduce((sum, r) => sum + convertirAKilos(r.cantidad, r.unidad), 0),
        totalGanancias: registros.reduce((sum, r) => sum + r.ganancia, 0),
        promedioGanancia: registros.length > 0 ? 
            registros.reduce((sum, r) => sum + r.ganancia, 0) / registros.length : 0,
        recolectoresUnicos: [...new Set(registros.map(r => r.nombreRecolector))].length
    };
}

// Análisis de ventas
function analizarVentas() {
    const facturas = JSON.parse(localStorage.getItem('cafegest_db_facturas')) || [];
    
    return {
        totalFacturas: facturas.length,
        totalVentas: facturas.reduce((sum, f) => sum + f.total, 0),
        clientesUnicos: [...new Set(facturas.map(f => f.cliente))].length,
        vendedoresUnicos: [...new Set(facturas.map(f => f.vendedor))].length,
        promedioVenta: facturas.length > 0 ? 
            facturas.reduce((sum, f) => sum + f.total, 0) / facturas.length : 0
    };
}
```

## 🔄 Actualizaciones y Mantenimiento

### Historial de Versiones
- **v1.0.0** - Versión inicial con dashboard y módulo de recolección
- **v1.1.0** - Agregado módulo de facturas de venta
- **v1.2.0** - Implementado módulo de insumos
- **v1.3.0** - Mejoras en diseño responsive y animaciones
- **v1.4.0** - Sistema de seguridad mejorado
- **v1.5.0** - Optimizaciones de rendimiento

### Roadmap Futuro
- [ ] **Integración con base de datos externa** (MySQL, PostgreSQL)
- [ ] **API REST** para integración con otros sistemas
- [ ] **Aplicación móvil nativa** (React Native)
- [ ] **Sistema de usuarios múltiples** con roles y permisos
- [ ] **Reportes avanzados** con gráficos y análisis
- [ ] **Sincronización en la nube** para backup automático
- [ ] **Notificaciones push** para alertas importantes
- [ ] **Integración con WhatsApp** para envío de recibos
- [ ] **Modo offline** con sincronización posterior
- [ ] **Análisis predictivo** de producción

### Plan de Mantenimiento
```javascript
// Mantenimiento automático
function mantenimientoAutomatico() {
    // Limpiar datos antiguos (opcional)
    limpiarDatosAntiguos();
    
    // Optimizar almacenamiento
    optimizarAlmacenamiento();
    
    // Verificar integridad de datos
    verificarIntegridadDatos();
    
    // Generar backup
    generarBackup();
}

// Ejecutar mantenimiento cada 24 horas
setInterval(mantenimientoAutomatico, 24 * 60 * 60 * 1000);
```

## 📞 Soporte y Contacto

### Soporte Técnico
Para obtener ayuda técnica:
1. **Consultar esta documentación** para problemas comunes
2. **Revisar la consola del navegador** para errores específicos
3. **Verificar dependencias** y configuración del entorno
4. **Contactar al equipo de desarrollo** para casos complejos

### Canales de Soporte
- **Documentación**: Este README completo
- **Issues**: Crear issue en el repositorio
- **Email**: soporte@cafegest.com
- **WhatsApp**: +57 300-123-4567

### Información de Contacto
- **Desarrollador**: Equipo CaféGest
- **Email**: info@cafegest.com
- **Sitio web**: www.cafegest.com
- **Versión**: 1.5.0
- **Última actualización**: Junio 2025

## 📄 Licencia y Términos

### Licencia
Este proyecto está bajo la **Licencia MIT**. Puedes usar, modificar y distribuir este software según los términos de la licencia.

### Términos de Uso
- **Uso comercial**: Permitido con atribución
- **Modificación**: Permitida manteniendo la licencia
- **Distribución**: Permitida con la licencia original
- **Garantía**: Sin garantía implícita o explícita

### Atribución
Si utilizas este sistema, por favor incluye:
```
CaféGest - Sistema de Gestión Cafetera
Desarrollado por: Equipo CaféGest
Licencia: MIT
```

---

## 🌟 Agradecimientos

Agradecemos a todos los caficultores que han contribuido con sus ideas y retroalimentación para hacer de CaféGest una herramienta útil y práctica para la gestión de fincas cafeteras.

**¡Gracias por elegir CaféGest para la gestión de tu parcela cafetera!** ☕🌱

---

*Sistema desarrollado con amor para la comunidad cafetera colombiana* 🇨🇴

**CaféGest v1.5.0** - Junio 2025
