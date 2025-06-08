# CaféGest - Sistema de Gestión de Recolección de Café ☕

**CaféGest** es un sistema web completo para la gestión y administración de registros de recolección de café. Desarrollado específicamente para fincas cafeteras que necesitan llevar un control detallado de la producción, pagos y documentación de sus recolectores.

## 🌟 Características Principales

### 📊 Gestión de Registros
- **Registro de recolección**: Captura información completa de cada jornada
- **Múltiples unidades**: Soporte para kilogramos, gramos y arrobas
- **Cálculo automático**: Ganancia calculada automáticamente según cantidad × valor por unidad
- **Formato colombiano**: Moneda en pesos colombianos (COP) con formato local

### 🔒 Sistema de Seguridad
- **Protección con contraseña**: Operaciones críticas requieren autenticación
- **Bloqueo automático**: Sistema se bloquea tras 3 intentos fallidos por 10 minutos
- **Contraseña predeterminada**: `cafe2025` (recomendamos cambiarla)

### 📄 Generación de Documentos
- **Recibos PDF**: Genera comprobantes oficiales de pago
- **Exportación Excel**: Exporta todos los datos a formato XLSX
- **Formato profesional**: Documentos con diseño corporativo

### 🔍 Sistema de Búsqueda y Filtrado
- **Búsqueda en tiempo real**: Por nombre, unidad o fecha
- **Paginación inteligente**: 10 registros por página
- **Ordenamiento**: Registros más recientes primero

### 📱 Diseño Responsivo
- **Compatible con móviles**: Interfaz adaptativa para cualquier dispositivo
- **Experiencia optimizada**: Navegación fluida en tablets y smartphones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Almacenamiento**: LocalStorage del navegador
- **Librerías externas**:
  - Font Awesome (iconos)
  - SheetJS/XLSX (exportación Excel)
  - jsPDF (generación PDF)
  - html2canvas (conversión HTML a imagen)
- **Formato**: Intl.NumberFormat para formato colombiano

## 📋 Requisitos del Sistema

### Navegadores Soportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dependencias CDN
```html
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- SheetJS para Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<!-- jsPDF para generación PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- html2canvas para captura HTML -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

## 🚀 Instalación y Configuración

### 1. Estructura de Archivos
```
cafegst/
├── index.html
├── styles.css
├── cosecha.js
└── README.md
```

### 2. Configuración Inicial
```javascript
// Cambiar contraseña predeterminada (recomendado)
const ADMIN_PASSWORD = "tu_nueva_contraseña_segura";

// Configurar registros por página (opcional)
const recordsPerPage = 10; // Cambiar si necesitas diferente cantidad
```

### 3. Elementos HTML Requeridos
Tu archivo HTML debe incluir estos elementos con los IDs correspondientes:

```html
<!-- Formulario de registro -->
<form id="recoleccionForm">
    <input type="text" id="nombreRecolector" required>
    <input type="number" id="cantidad" required>
    <select id="unidad" required>
        <option value="kilogramos">Kilogramos</option>
        <option value="gramos">Gramos</option>
        <option value="arrobas">Arrobas</option>
    </select>
    <input type="number" id="valorPorUnidad" required>
    <button type="submit" id="guardarBtn">Guardar</button>
</form>

<!-- Tabla de registros -->
<table>
    <tbody id="recoleccionTableBody"></tbody>
</table>

<!-- Estado vacío -->
<div id="emptyState">No hay registros</div>

<!-- Controles -->
<input type="text" id="searchInput" placeholder="Buscar...">
<button id="exportBtn">Exportar Excel</button>
<button id="totalKilosBtn">Calcular Total</button>

<!-- Mensajes -->
<div id="messageBox"></div>
```

## 📖 Guía de Uso

### Registrar Nueva Recolección
1. Completa el formulario con:
   - Nombre del recolector
   - Cantidad recolectada
   - Unidad (kg, gramos, arrobas)
   - Valor por unidad en pesos
2. Haz clic en "Guardar Recogida"
3. El sistema calculará automáticamente la ganancia total

### Editar/Eliminar Registros
1. Haz clic en el botón de editar (✏️) o eliminar (🗑️)
2. Ingresa la contraseña de administrador
3. Confirma la acción

### Generar Recibo PDF
1. Haz clic en el botón PDF (📄) del registro deseado
2. El sistema generará automáticamente un recibo profesional
3. El archivo se descargará con el formato: `Recibo_Recoleccion_ID_Nombre.pdf`

### Exportar Datos
1. Haz clic en "Exportar a Excel"
2. Se descargará un archivo XLSX con todos los registros
3. Formato: `Recogida_Cafe_YYYY-MM-DD.xlsx`

### Calcular Totales por Fecha
1. Haz clic en "Calcular Total Kilos"
2. Selecciona la fecha deseada
3. El sistema mostrará el total convertido a kilogramos

## 🔧 Personalización

### Cambiar Moneda
```javascript
const formatoPesosCol = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP', // Cambiar por USD, EUR, etc.
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});
```

### Modificar Unidades de Medida
```javascript
// En la función calcularTotalKilosPorFecha
switch(item.unidad.toLowerCase()) {
    case 'gramos':
        cantidadEnKilos /= 1000;
        break;
    case 'arrobas':
        cantidadEnKilos *= 12.5; // 1 arroba = 12.5 kg
        break;
    case 'libras': // Nueva unidad
        cantidadEnKilos *= 0.453592;
        break;
}
```

### Personalizar Diseño del Recibo
Modifica la función `crearContenidoRecibo()` para cambiar:
- Logo de la empresa
- Colores corporativos
- Información adicional
- Términos y condiciones

## 📊 Estructura de Datos

### Registro de Recolección
```javascript
{
    id: 1,                          // ID único autoincrementable
    nombreRecolector: "Juan Pérez", // Nombre del recolector
    cantidad: 25.5,                 // Cantidad recolectada
    unidad: "kilogramos",           // Unidad de medida
    fecha: "2025-06-07T10:30:00Z", // Fecha ISO
    ganancia: 127500,               // Ganancia total calculada
    valorPorUnidad: 5000           // Valor por unidad en pesos
}
```

### Almacenamiento LocalStorage
- `cafegest_db_recoleccion`: Array de registros
- `cafegest_db_recoleccion_counter`: Contador de IDs
- `cafegest_db_intentos_fallidos`: Intentos de contraseña fallidos
- `cafegest_db_tiempo_bloqueado`: Timestamp de bloqueo del sistema

## 🛡️ Seguridad

### Mejores Prácticas Implementadas
- ✅ Validación de contraseña para operaciones críticas
- ✅ Bloqueo temporal tras intentos fallidos
- ✅ Confirmación de eliminación
- ✅ Validación de formularios
- ✅ Sanitización de datos de entrada

### Recomendaciones de Seguridad
1. **Cambiar contraseña predeterminada** inmediatamente
2. **Hacer respaldos regulares** de los datos del LocalStorage
3. **Usar HTTPS** en producción
4. **Considerar base de datos externa** para datos críticos

## 📱 Compatibilidad Móvil

### Características Responsivas
- Diseño adaptativo para pantallas pequeñas
- Botones táctiles optimizados
- Formularios móvil-friendly
- Paginación responsive
- Tablas con scroll horizontal

### Breakpoints CSS
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔄 Actualizaciones y Mantenimiento

### Historial de Versiones
- **v1.0.0**: Versión inicial con funcionalidades básicas
- **v1.1.0**: Sistema de paginación y ordenamiento
- **v1.2.0**: Generación de recibos PDF
- **v1.3.0**: Exportación a Excel y cálculos por fecha

### Roadmap Futuro
- [ ] Integración con base de datos externa
- [ ] Sistema de usuarios múltiples
- [ ] Reportes y gráficos avanzados
- [ ] API REST para integración
- [ ] Aplicación móvil nativa

## 🐛 Solución de Problemas

### Problemas Comunes

**Los PDFs no se generan:**
- Verificar que las librerías jsPDF y html2canvas estén cargadas
- Revisar la consola del navegador para errores

**Los datos se pierden:**
- LocalStorage tiene límites de almacenamiento
- Hacer respaldos regulares exportando a Excel

**La búsqueda no funciona:**
- Verificar que el ID `searchInput` existe en el HTML
- Comprobar que los datos están cargados correctamente

**Sistema bloqueado permanentemente:**
- Limpiar LocalStorage del navegador
- O modificar manualmente las claves de bloqueo

### Depuración
```javascript
// Limpiar todos los datos (usar con precaución)
localStorage.removeItem('cafegest_db_recoleccion');
localStorage.removeItem('cafegest_db_recoleccion_counter');
localStorage.removeItem('cafegest_db_intentos_fallidos');
localStorage.removeItem('cafegest_db_tiempo_bloqueado');

// Ver datos actuales en consola
console.log('Registros:', JSON.parse(localStorage.getItem('cafegest_db_recoleccion')));
```

## 📞 Soporte

Para soporte técnico o reportar errores:
- Revisar este README
- Verificar la consola del navegador para errores
- Comprobar que todas las dependencias están cargadas

## 📄 Licencia

Este proyecto está desarrollado para uso interno de fincas cafeteras. El código es propietario y su uso está restringido según los términos acordados.

---

**CaféGest** - Desarrollado con ❤️ para la industria cafetera colombiana ☕🇨🇴
