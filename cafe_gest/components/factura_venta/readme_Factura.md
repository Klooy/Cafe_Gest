# 📋 Módulo de Facturas de Venta - CaféGest

Sistema completo de gestión de facturas de venta para caficultores con interfaz web moderna, sistema de seguridad y funcionalidades avanzadas.

## 🚀 Características Principales

### ✨ Gestión de Facturas
- **Crear facturas** con información completa del vendedor, cliente, cantidad y precios
- **Editar facturas existentes** con sistema de verificación por contraseña
- **Eliminar facturas** con confirmación y protección por contraseña
- **Búsqueda en tiempo real** por vendedor, cliente, unidad o fecha
- **Exportación a Excel** de todas las facturas

### 🔒 Sistema de Seguridad
- **Protección por contraseña** para operaciones de edición y eliminación
- **Sistema de bloqueo automático** tras 3 intentos fallidos (10 minutos)
- **Contraseña por defecto**: `cafe2025` (recomendamos cambiarla)

### 📄 Generación de PDFs
- **Vista previa en modal** antes de descargar
- **Diseño profesional** con logo y formato de factura
- **Descarga automática** con nombre personalizado

### 📊 Paginación Inteligente
- **10 registros por página** para mejor rendimiento
- **Registros más recientes primero** (ordenados por ID descendente)
- **Navegación intuitiva** con botones anterior/siguiente
- **Información de registros** mostrados (ej: "1 a 10 de 25 registros")
- **Diseño responsive** para dispositivos móviles

### 💾 Almacenamiento Local
- **Persistencia automática** en localStorage del navegador
- **Recuperación de datos** al recargar la página
- **Contador automático** de IDs para nuevas facturas

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+** - Lógica principal
- **HTML5** - Estructura
- **CSS3** - Estilos y responsive design
- **Font Awesome** - Iconografía
- **SheetJS (XLSX)** - Exportación a Excel
- **jsPDF + html2canvas** - Generación de PDFs
- **localStorage API** - Almacenamiento local

## 📁 Estructura del Proyecto

```
cafegest/
├── factura_venta.js          # Módulo principal
├── index.html                # Interfaz HTML
├── styles.css               # Estilos CSS
├── README.md               # Documentación
└── assets/
    ├── fonts/              # Fuentes
    └── icons/              # Iconos
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación
1. **Descargar archivos** del proyecto
2. **Incluir librerías externas** en tu HTML:
   ```html
   <!-- Font Awesome -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   
   <!-- SheetJS para Excel -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
   
   <!-- jsPDF para PDFs -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
   ```

3. **Incluir el módulo** en tu HTML:
   ```html
   <script src="factura_venta.js"></script>
   ```

### Configuración Inicial
1. **Cambiar contraseña por defecto**:
   ```javascript
   const ADMIN_PASSWORD = "tu_nueva_contraseña_segura";
   ```

2. **Personalizar nombre de base de datos**:
   ```javascript
   const DB_NAME = 'tu_empresa_db';
   ```

## 📖 Uso del Sistema

### Crear Nueva Factura
1. Completar el formulario con:
   - Nombre del vendedor
   - Nombre del cliente
   - Cantidad y unidad
   - Precio de venta
   - Fecha (se establece automáticamente)
2. Hacer clic en "Guardar Factura"

### Editar Factura Existente
1. Hacer clic en el botón de editar (✏️) en la tabla
2. Ingresar la contraseña de administrador
3. Modificar los datos en el formulario
4. Hacer clic en "Actualizar Factura"

### Eliminar Factura
1. Hacer clic en el botón de eliminar (🗑️) en la tabla
2. Ingresar la contraseña de administrador
3. Confirmar la eliminación

### Generar PDF
1. Hacer clic en el botón PDF (📄) en la tabla
2. Revisar la vista previa en el modal
3. Hacer clic en "Descargar PDF"

### Buscar Facturas
- Escribir en el campo de búsqueda
- La búsqueda filtra por: vendedor, cliente, unidad o fecha
- Los resultados se muestran en tiempo real

### Exportar a Excel
1. Hacer clic en "Exportar a Excel"
2. El archivo se descarga automáticamente con fecha actual

## 🔧 API de Funciones Principales

### Funciones de Datos
```javascript
// Guardar datos en localStorage
guardarDatos()

// Cargar tabla con paginación
cargarTabla(datos = facturasVenta)

// Formatear moneda colombiana
formatearMonedaCOP(valor)

// Formatear fechas para mostrar
formatearFechaParaMostrar(fechaStr)
```

### Funciones de Paginación
```javascript
// Cambiar página
cambiarPagina(nuevaPagina)

// Ir a primera página
irAPrimeraPagina()

// Actualizar controles del paginador
actualizarPaginador()
```

### Funciones de Seguridad
```javascript
// Verificar contraseña para operaciones
verificarPassword(accion, id)

// Verificar si sistema está bloqueado
estaBloqueado()

// Calcular tiempo restante de bloqueo
calcularTiempoRestante()
```

## 🎨 Personalización de Estilos

### Variables CSS Principales
```css
:root {
  --color-amber-50: #fffbeb;
  --color-amber-100: #fef3c7;
  --color-amber-600: #d97706;
  --color-amber-700: #b45309;
  --color-stone-300: #d6d3d1;
  --color-stone-600: #57534e;
}
```

### Clases CSS Importantes
- `.pagination-container` - Contenedor del paginador
- `.pagination-btn` - Botones de navegación
- `.pagination-number` - Números de página
- `.table-actions` - Acciones de la tabla
- `.btn-icon` - Botones con iconos

## 🔐 Seguridad

### Sistema de Contraseñas
- **Contraseña por defecto**: `cafe2025`
- **Intentos permitidos**: 3 antes del bloqueo
- **Tiempo de bloqueo**: 10 minutos
- **Almacenamiento**: En localStorage (no recomendado para producción)

### Recomendaciones de Seguridad
1. **Cambiar contraseña por defecto** inmediatamente
2. **Usar HTTPS** en producción
3. **Implementar autenticación de servidor** para aplicaciones críticas
4. **Hacer backups regulares** de los datos

## 📱 Responsive Design

El sistema es completamente responsive y se adapta a:
- **Desktop** (> 768px) - Vista completa
- **Tablet** (768px - 480px) - Adaptación de controles
- **Mobile** (< 480px) - Vista compacta

## 🚨 Manejo de Errores

### Errores Comunes
- **Datos no guardados**: Verificar localStorage habilitado
- **PDF no generado**: Verificar librerías jsPDF y html2canvas
- **Excel no exportado**: Verificar librería SheetJS
- **Sistema bloqueado**: Esperar 10 minutos o limpiar localStorage

### Debug
```javascript
// Ver datos almacenados
console.log(localStorage.getItem('cafegest_db_facturas'));

// Limpiar datos (¡Cuidado!)
localStorage.clear();

// Ver estado del sistema
console.log('Intentos fallidos:', intentosFallidos);
console.log('Tiempo bloqueado:', tiempoBloqueado);
```

## 📈 Rendimiento

### Optimizaciones Implementadas
- **Paginación**: Solo renderiza 10 registros por vez
- **Búsqueda eficiente**: Filtrado en memoria
- **Lazy loading**: Carga datos solo cuando es necesario
- **Event delegation**: Manejo eficiente de eventos

### Límites Recomendados
- **Máximo de facturas**: ~1000 registros para rendimiento óptimo
- **Datos por factura**: Campos estándar sin archivos adjuntos
- **Navegadores soportados**: Últimas 2 versiones principales

## 🤝 Contribución

### Para Contribuir
1. Fork del repositorio
2. Crear rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **JavaScript**: ES6+ con comentarios descriptivos
- **CSS**: Usar variables CSS y nomenclatura BEM
- **HTML**: Semántico y accesible
- **Commits**: Mensajes descriptivos en español

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o reportar bugs:
- **Issues**: Crear issue en el repositorio
- **Documentación**: Consultar este README
- **Email**: contacto@cafegest.com

## 🔄 Changelog

### v1.0.0 - Versión Inicial
- ✅ CRUD completo de facturas
- ✅ Sistema de seguridad con contraseñas
- ✅ Generación de PDFs
- ✅ Exportación a Excel
- ✅ Paginación inteligente
- ✅ Búsqueda en tiempo real
- ✅ Diseño responsive

---

**CaféGest** - Sistema de Gestión para Caficultores 🌱☕