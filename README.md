# Sistema de Gestión de Insumos para Café ☕

Un sistema web completo para la gestión eficiente de insumos en negocios cafeteros, desarrollado en JavaScript vanilla con almacenamiento local.

## 📋 Características Principales

### Gestión de Insumos
- **Registro de insumos** con información detallada (nombre, cantidad, valor, fecha, disponibilidad)
- **Edición y eliminación** de registros existentes
- **Control automático de disponibilidad** basado en cantidades
- **Seguimiento de fechas** de registro y última reposición

### Sistema de Reabastecimiento
- **Registro de reabastecimientos** con trazabilidad completa
- **Actualización automática** de inventarios
- **Historial detallado** de todas las reposiciones
- **Control de responsables** y observaciones

### Control de Uso de Insumos
- **Registro de consumo** por usuario y fecha
- **Validación de disponibilidad** antes del uso
- **Actualización automática** de inventarios
- **Historial completo** de usos con detalles

### Funciones Adicionales
- **Búsqueda en tiempo real** en todas las tablas
- **Exportación a Excel** de todos los datos
- **Formato de moneda colombiana** (COP)
- **Interfaz responsive** y fácil de usar
- **Almacenamiento local** persistente

## 🚀 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Acceso a CDN para las librerías externas

### Instalación
1. Descarga el archivo `insumos_cafe.js`
2. Incluye las siguientes librerías en tu HTML:
   ```html
   <!-- Font Awesome para iconos -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
   
   <!-- SheetJS para exportación a Excel -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
   ```

3. Incluye el script en tu página HTML:
   ```html
   <script src="insumos_cafe.js"></script>
   ```

### Estructura HTML Requerida
El sistema requiere elementos HTML específicos con IDs predefinidos. Los principales incluyen:

#### Modales
- `modalInsumo` - Modal para registro/edición de insumos
- `modalReabastecer` - Modal para reabastecimiento
- `modalUso` - Modal para registro de uso

#### Tablas
- `insumosTableBody` - Cuerpo de tabla de insumos
- `usosTableBody` - Cuerpo de tabla de usos
- `reabastecimientosTableBody` - Cuerpo de tabla de reabastecimientos

#### Formularios
- `insumoForm` - Formulario de insumos
- `reabastecerForm` - Formulario de reabastecimiento
- `usoForm` - Formulario de uso

## 📊 Estructura de Datos

### Insumos
```javascript
{
  id: Number,              // ID único autoincrementable
  nombre: String,          // Nombre del insumo
  cantidad: Number,        // Cantidad en kilogramos
  valor: Number,           // Valor monetario
  fecha: String,           // Fecha de registro (YYYY-MM-DD)
  disponibilidad: String   // "Disponible" | "No Disponible"
}
```

### Reabastecimientos
```javascript
{
  id: Number,              // ID único autoincrementable
  insumoId: Number,        // ID del insumo reabastecido
  cantidad: Number,        // Cantidad reabastecida en kg
  valor: Number,           // Valor del reabastecimiento
  fecha: String,           // Fecha del reabastecimiento
  responsable: String,     // Persona responsable
  observaciones: String    // Observaciones adicionales
}
```

### Usos
```javascript
{
  id: Number,              // ID único autoincrementable
  insumoId: Number,        // ID del insumo utilizado
  cantidad: Number,        // Cantidad utilizada en kg
  usuario: String,         // Usuario que realizó el uso
  fecha: String,           // Fecha de uso
  detalles: String         // Detalles adicionales
}
```

## 🔧 Funciones Principales

### Gestión de Insumos
- `renderInsumosTable()` - Renderiza la tabla de insumos
- `openInsumoModal(edit)` - Abre modal para crear/editar insumo
- `saveInsumo()` - Guarda un insumo nuevo o editado
- `editarInsumo(id)` - Edita un insumo existente
- `eliminarInsumo(id)` - Elimina un insumo

### Gestión de Reabastecimientos
- `renderReabastecimientosTable()` - Renderiza tabla de reabastecimientos
- `openReabastecerModal()` - Abre modal de reabastecimiento
- `saveReabastecimiento()` - Registra un nuevo reabastecimiento
- `updateReabastecerSelect()` - Actualiza lista de insumos para reabastecer

### Gestión de Usos
- `renderUsosTable()` - Renderiza tabla de usos
- `openUsoModal(edit)` - Abre modal para registrar/editar uso
- `saveUso()` - Guarda un uso nuevo o editado
- `editarUso(id)` - Edita un uso existente
- `eliminarUso(id)` - Elimina un registro de uso

### Utilidades
- `formatMonedaCOP(valor)` - Formatea valores en pesos colombianos
- `formatDate(dateString)` - Formatea fechas en formato colombiano
- `exportToExcel(tableId, fileName)` - Exporta datos a Excel
- `limpiarBaseDeDatos()` - Elimina todos los datos

## 💾 Almacenamiento de Datos

El sistema utiliza `localStorage` del navegador para persistir los datos:

- `cafegest_db_insumos` - Array de insumos
- `cafegest_db_usos` - Array de usos
- `cafegest_db_reabastecimientos` - Array de reabastecimientos
- `cafegest_db_insumos_counter` - Contador de IDs de insumos
- `cafegest_db_usos_counter` - Contador de IDs de usos
- `cafegest_db_reabastecimientos_counter` - Contador de IDs de reabastecimientos

## 🔍 Funciones de Búsqueda

El sistema incluye búsqueda en tiempo real que filtra por:

### Insumos
- Nombre del insumo
- Estado de disponibilidad
- Fecha de registro

### Usos
- Nombre del insumo
- Usuario
- Fecha de uso
- Detalles

### Reabastecimientos
- Nombre del insumo
- Responsable
- Fecha de reabastecimiento
- Observaciones

## 📤 Exportación de Datos

La funcionalidad de exportación a Excel incluye:
- Formato automático de moneda colombiana
- Fechas en formato local
- Nombres de columnas descriptivos
- Datos completos de todas las tablas

## ⚠️ Consideraciones Importantes

### Validaciones
- **Cantidad suficiente**: Verifica disponibilidad antes de registrar usos
- **Campos obligatorios**: Valida que todos los campos requeridos estén completos
- **Tipos de datos**: Valida que los números sean válidos
- **Integridad referencial**: Previene eliminación de insumos en uso

### Actualizaciones Automáticas
- **Disponibilidad**: Se actualiza automáticamente según la cantidad
- **Inventarios**: Se ajustan con cada uso y reabastecimiento
- **Selectores**: Se actualizan dinámicamente según disponibilidad

### Limitaciones
- **Almacenamiento local**: Los datos se pierden si se limpia el navegador
- **Un solo usuario**: No incluye sistema de autenticación multiusuario
- **Sin sincronización**: No hay respaldo automático en la nube

## 🤝 Uso Recomendado

1. **Registrar insumos** iniciales con sus cantidades y valores
2. **Configurar usuarios** responsables de reabastecimientos
3. **Mantener registro** constante de usos para control preciso
4. **Realizar reabastecimientos** oportunos basados en reportes
5. **Exportar datos** periódicamente como respaldo

## 📱 Compatibilidad

- **Navegadores**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Dispositivos**: Desktop, tablet y móvil (responsive)
- **Resoluciones**: Optimizado para pantallas desde 320px

## 🆘 Solución de Problemas

### Datos no se guardan
- Verificar que localStorage esté habilitado
- Comprobar que no esté en modo incógnito

### Errores de exportación
- Verificar que la librería XLSX esté cargada
- Comprobar permisos de descarga del navegador

### Problemas de formato
- Verificar configuración regional del navegador
- Comprobar que los datos sean números válidos

---

**Desarrollado para la gestión eficiente de insumos en negocios cafeteros** ☕

*Sistema desarrollado con JavaScript vanilla para máxima compatibilidad y rendimiento*
