/**
 * CaféGest - Sistema Integral de Gestión Cafetera
 * Copyright © 2025 Michael Felipe Corrales Florez - Todos los derechos reservados
 * Email: mfcorrales26@gmail.com
 * 
 * Este código está protegido por derechos de autor.
 * El uso sin atribución apropiada está prohibido.
 * 
 * Licencia: MIT con términos específicos (ver LICENSE)
 * Repositorio oficial: https://github.com/Klooy/Cafe_Gest
 */

// Almacenamiento Local
const DB_NAME = 'cafegest_db';

// Configuración de formato para pesos colombianos
const formatoPesosCol = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

// Estructura de datos
let recoleccionCafe = JSON.parse(localStorage.getItem(`${DB_NAME}_recoleccion`)) || [];
let idCounter = parseInt(localStorage.getItem(`${DB_NAME}_recoleccion_counter`)) || 1;

// Configuración para el sistema de contraseña
const ADMIN_PASSWORD = "cafe2025"; // Contraseña predeterminada (recomendamos cambiarla)
let intentosFallidos = parseInt(localStorage.getItem(`${DB_NAME}_intentos_fallidos`)) || 0;
let tiempoBloqueado = localStorage.getItem(`${DB_NAME}_tiempo_bloqueado`) || null;

// Elementos DOM
const recoleccionForm = document.getElementById('recoleccionForm');
const recoleccionTableBody = document.getElementById('recoleccionTableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const totalKilosBtn = document.getElementById('totalKilosBtn');
const messageBox = document.getElementById('messageBox');

// Funciones para gestionar datos
function guardarDatos() {
    localStorage.setItem(`${DB_NAME}_recoleccion`, JSON.stringify(recoleccionCafe));
    localStorage.setItem(`${DB_NAME}_recoleccion_counter`, idCounter.toString());
    // Guardar también los intentos fallidos
    localStorage.setItem(`${DB_NAME}_intentos_fallidos`, intentosFallidos.toString());
    if (tiempoBloqueado) {
        localStorage.setItem(`${DB_NAME}_tiempo_bloqueado`, tiempoBloqueado);
    } else {
        localStorage.removeItem(`${DB_NAME}_tiempo_bloqueado`);
    }
}


// Variables para paginación
let currentPage = 1;
const recordsPerPage = 10;


function cargarTabla(datos = recoleccionCafe) {
    recoleccionTableBody.innerHTML = '';
    
    if (datos.length === 0) {
        emptyState.style.display = 'block';
        ocultarPaginacion();
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Ordenar datos por fecha de forma descendente (más recientes primero)
    const datosOrdenados = [...datos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const datosPaginados = datosOrdenados.slice(startIndex, endIndex);
    
    // Mostrar registros de la página actual
    datosPaginados.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombreRecolector}</td>
            <td>${item.cantidad.toLocaleString('es-CO')}</td>
            <td>${item.unidad}</td>
            <td>${new Date(item.fecha).toLocaleDateString()}</td>
            <td>${item.cosecha || 'N/A'}</td>
            <td>${formatoPesosCol.format(item.ganancia)}</td>
            <td class="table-actions">
                <button class="btn-icon btn-edit" onclick="verificarPassword('editar', ${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="verificarPassword('eliminar', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-icon btn-pdf" onclick="generarPDFRecibo(${item.id})">
                    <i class="fas fa-file-pdf"></i>
                </button>
            </td>
        `;
        recoleccionTableBody.appendChild(row);
    });
    
    // Actualizar controles de paginación
    actualizarPaginacion(datosOrdenados.length);
}

// Función para actualizar los controles de paginación
function actualizarPaginacion(totalRecords) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    
    // Obtener o crear el contenedor de paginación
    let paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        paginationContainer.className = 'pagination-container';
        
        // Insertar después de la tabla
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
        }
    }
    
    if (totalPages <= 1) {
        ocultarPaginacion();
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Información de registros
    const infoDiv = document.createElement('div');
    infoDiv.className = 'pagination-info';
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);
    infoDiv.textContent = `Mostrando ${startRecord}-${endRecord} de ${totalRecords} registros`;
    
    // Controles de navegación
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'pagination-controls';
    
    // Botón "Anterior"
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-btn';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            cargarTabla();
        }
    };
    
    // Números de página
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    
    // Mostrar páginas con lógica de truncamiento
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 4, 1);
    }
    
    // Primera página si no está visible
    if (startPage > 1) {
        const firstBtn = crearBotonPagina(1);
        pageNumbers.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            pageNumbers.appendChild(dots);
        }
    }
    
    // Páginas visibles
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = crearBotonPagina(i);
        pageNumbers.appendChild(pageBtn);
    }
    
    // Última página si no está visible
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            pageNumbers.appendChild(dots);
        }
        
        const lastBtn = crearBotonPagina(totalPages);
        pageNumbers.appendChild(lastBtn);
    }
    
    // Botón "Siguiente"
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-btn';
    nextButton.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            cargarTabla();
        }
    };
    
    // Ensamblar controles
    controlsDiv.appendChild(prevButton);
    controlsDiv.appendChild(pageNumbers);
    controlsDiv.appendChild(nextButton);
    
    paginationContainer.appendChild(infoDiv);
    paginationContainer.appendChild(controlsDiv);
}

// Función para crear botón de página
function crearBotonPagina(pageNumber) {
    const button = document.createElement('button');
    button.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
    button.textContent = pageNumber;
    button.onclick = () => {
        currentPage = pageNumber;
        cargarTabla();
    };
    return button;
}

// Función para ocultar paginación
function ocultarPaginacion() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (paginationContainer) {
        paginationContainer.style.display = 'none';
    }
}

// Función para resetear paginación
function resetearPaginacion() {
    currentPage = 1;
}


function mostrarMensaje(tipo, mensaje) {
    messageBox.className = `message ${tipo}`;
    messageBox.innerText = mensaje;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}


// Modificar funciones que afectan los datos para resetear paginación
const originalProcesarFormulario = procesarFormulario;
function procesarFormulario() {
    originalProcesarFormulario();
    resetearPaginacion(); // Volver a la primera página después de guardar
}

const originalEliminarRecoleccion = eliminarRecoleccion;
function eliminarRecoleccion(id) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        recoleccionCafe = recoleccionCafe.filter(item => item.id !== id);
        guardarDatos();
        
        // Ajustar página actual si es necesario
        const totalPages = Math.ceil(recoleccionCafe.length / recordsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 1;
        }
        
        cargarTabla();
        mostrarMensaje('success', 'Registro eliminado con éxito');
    }
}

// Función para procesar el formulario (separada para poder llamarla desde diferentes eventos)
function procesarFormulario() {
    const nombreRecolector = document.getElementById('nombreRecolector').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const unidad = document.getElementById('unidad').value;
    const valorPorUnidad = parseFloat(document.getElementById('valorPorUnidad').value);
    const cosecha = document.getElementById('cosecha').value; // AÑADIR ESTA LÍNEA
    
    // Calcular ganancia
    const ganancia = cantidad * valorPorUnidad;
    
    const editId = recoleccionForm.dataset.editId;
    
    if (editId) {
        // Editar existente
        const index = recoleccionCafe.findIndex(item => item.id === parseInt(editId));
        if (index !== -1) {
            recoleccionCafe[index] = {
                ...recoleccionCafe[index],
                nombreRecolector,
                cantidad,
                unidad,
                ganancia,
                valorPorUnidad,
                cosecha // AÑADIR ESTA LÍNEA
            };
            
            mostrarMensaje('success', 'Registro actualizado con éxito');
        }
        
        // Limpiar modo edición
        recoleccionForm.removeAttribute('data-edit-id');
        const guardarBtn = document.getElementById('guardarBtn');
        if (guardarBtn) {
            guardarBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Recogida';
        }
    } else {
        // Crear nuevo
        const nuevoRegistro = {
            id: idCounter++,
            nombreRecolector,
            cantidad,
            unidad,
            fecha: new Date().toISOString(),
            ganancia,
            valorPorUnidad,
            cosecha // AÑADIR ESTA LÍNEA
        };
        
        recoleccionCafe.push(nuevoRegistro);
        mostrarMensaje('success', 'Registro guardado con éxito');
    }
    
    guardarDatos();
    cargarTabla();
    recoleccionForm.reset();
}

// Sistema de verificación de contraseña
function verificarPassword(accion, id) {    
    // Verificar si el sistema está bloqueado por exceso de intentos
    if (estaBloqueado()) {
        const tiempoRestante = calcularTiempoRestante();
        mostrarMensaje('error', `Sistema bloqueado. Intente nuevamente en ${tiempoRestante} minutos.`);
        return;
    }
    
    // Crear diálogo modal para solicitar contraseña
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.minWidth = '300px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = accion === 'editar' ? 'Verificación para Editar' : 'Verificación para Eliminar';
    modalTitle.style.marginBottom = '16px';
    modalTitle.style.color = 'var(--color-amber-900)';
    
    const formGroup = document.createElement('div');
    formGroup.style.marginBottom = '16px';
    
    const label = document.createElement('label');
    label.textContent = 'Ingrese la contraseña de administrador:';
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '10px';
    passwordInput.style.borderRadius = '4px';
    passwordInput.style.border = '1px solid var(--color-stone-300)';
    passwordInput.style.marginBottom = '10px';
    
    const intentosTexto = document.createElement('div');
    intentosTexto.style.fontSize = '12px';
    intentosTexto.style.color = 'var(--color-stone-500)';
    intentosTexto.style.marginBottom = '16px';
    intentosTexto.textContent = `Intentos restantes: ${3 - intentosFallidos}`;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.justifyContent = 'flex-end';
    
    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Verificar';
    verifyButton.style.backgroundColor = 'var(--color-amber-700)';
    verifyButton.style.color = 'white';
    verifyButton.style.border = 'none';
    verifyButton.style.borderRadius = '4px';
    verifyButton.style.padding = '8px 16px';
    verifyButton.style.cursor = 'pointer';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.backgroundColor = 'var(--color-stone-300)';
    cancelButton.style.color = 'var(--color-stone-900)';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.cursor = 'pointer';
    
    // Juntar todo el diálogo
    formGroup.appendChild(label);
    formGroup.appendChild(passwordInput);
    formGroup.appendChild(intentosTexto);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(verifyButton);
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(formGroup);
    modalContent.appendChild(buttonContainer);
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Dar foco al campo de contraseña
    passwordInput.focus();
    
    // Event handlers
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    verifyButton.addEventListener('click', () => {
        const password = passwordInput.value;
        
        if (password === ADMIN_PASSWORD) {
            // Contraseña correcta
            document.body.removeChild(modalOverlay);
            // Reiniciar intentos fallidos
            intentosFallidos = 0;
            tiempoBloqueado = null;
            guardarDatos();
            
            // Ejecutar la acción solicitada
            if (accion === 'editar') {
                editarRecoleccion(id);
            } else if (accion === 'eliminar') {
                eliminarRecoleccion(id);
            }
        } else {
            // Contraseña incorrecta
            intentosFallidos++;
            guardarDatos();
            
            if (intentosFallidos >= 3) {
                // Bloquear el sistema por 30 minutos
                tiempoBloqueado = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                guardarDatos();
                document.body.removeChild(modalOverlay);
                mostrarMensaje('error', 'Demasiados intentos fallidos. Sistema bloqueado por 10 minutos.');
            } else {
                // Actualizar texto de intentos y mostrar mensaje
                intentosTexto.textContent = `Intentos restantes: ${3 - intentosFallidos}`;
                intentosTexto.style.color = 'var(--color-red-500)'; 
                passwordInput.value = '';
                passwordInput.focus();
                
                // Añadir animación de error
                passwordInput.style.border = '1px solid var(--color-red-500)';
                setTimeout(() => {
                    passwordInput.style.border = '1px solid var(--color-stone-300)';
                }, 1000);
            }
        }
    });
    
    // También permitir verificar al presionar Enter
    passwordInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            verifyButton.click();
        }
    });
}

// Verificar si el sistema está bloqueado
function estaBloqueado() {
    if (!tiempoBloqueado) return false;
    
    const tiempoBloqueo = new Date(tiempoBloqueado);
    const ahora = new Date();
    
    if (ahora >= tiempoBloqueo) {
        // El tiempo de bloqueo ha pasado, reiniciar
        tiempoBloqueado = null;
        intentosFallidos = 0;
        guardarDatos();
        return false;
    }
    
    return true;
}

// Calcular tiempo restante de bloqueo en minutos
function calcularTiempoRestante() {
    if (!tiempoBloqueado) return 0;
    
    const tiempoBloqueo = new Date(tiempoBloqueado);
    const ahora = new Date();
    const diferencia = tiempoBloqueo - ahora;
    
    // Convertir a minutos y redondear hacia arriba
    return Math.ceil(diferencia / (60 * 1000));
}

// Eventos del formulario - MODIFICADO PARA EVITAR RECARGA
recoleccionForm.addEventListener('submit', function(e) {
    // Prevenir el comportamiento por defecto del formulario (importante)
    e.preventDefault();
    
    // Procesar el formulario
    procesarFormulario();
});

// Función para editar
function editarRecoleccion(id) {
    const registro = recoleccionCafe.find(item => item.id === id);
    if (!registro) return;
    
    document.getElementById('nombreRecolector').value = registro.nombreRecolector;
    document.getElementById('cantidad').value = registro.cantidad;
    document.getElementById('unidad').value = registro.unidad;
    document.getElementById('valorPorUnidad').value = registro.valorPorUnidad;
    document.getElementById('cosecha').value = registro.cosecha || '';
    
    recoleccionForm.dataset.editId = id;
    const guardarBtn = document.getElementById('guardarBtn');
    if (guardarBtn) {
        guardarBtn.innerHTML = '<i class="fas fa-check"></i> Actualizar Recogida';
    }
    
    // Scroll to form
    recoleccionForm.scrollIntoView({ behavior: 'smooth' });
}

// Función para eliminar
function eliminarRecoleccion(id) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        recoleccionCafe = recoleccionCafe.filter(item => item.id !== id);
        guardarDatos();
        cargarTabla();
        mostrarMensaje('success', 'Registro eliminado con éxito');
    }
}

// Búsqueda
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    resetearPaginacion(); // Resetear a la primera página al buscar
    
    if (!searchTerm) {
        cargarTabla();
        return;
    }
    
    const filteredData = recoleccionCafe.filter(item => 
        item.nombreRecolector.toLowerCase().includes(searchTerm) ||
        item.unidad.toLowerCase().includes(searchTerm) ||
        (item.cosecha && item.cosecha.toLowerCase().includes(searchTerm)) || 
        new Date(item.fecha).toLocaleDateString().includes(searchTerm)
    );
    
    cargarTabla(filteredData);
});

// Exportar a Excel
exportBtn.addEventListener('click', function() {
    if (recoleccionCafe.length === 0) {
        mostrarMensaje('error', 'No hay datos para exportar');
        return;
    }
    
    // Preparar datos para Excel con formato de moneda colombiana
    const excelData = recoleccionCafe.map(item => ({
        'ID': item.id,
        'Nombre del Recolector': item.nombreRecolector,
        'Cantidad': item.cantidad.toLocaleString('es-CO'),
        'Unidad': item.unidad,
        'Fecha': new Date(item.fecha).toLocaleDateString('es-CO'),
        'Cosecha': item.cosecha || 'N/A',
        'Ganancia': formatoPesosCol.format(item.ganancia)
    }));
    
    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recogida de Café');
    
    // Configurar formato de columnas para Excel
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1'; // Solo la primera fila (encabezados)
        if (!worksheet[address]) continue;
        worksheet[address].s = { font: { bold: true } };
    }
    
    // Guardar archivo
    const fileName = `Recogida_Cafe_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    mostrarMensaje('success', 'Datos exportados a Excel correctamente');
});

// Función para mostrar el diálogo de selección de fecha
function mostrarDialogoSeleccionFecha() {
    // Si no hay datos, mostrar mensaje de error
    if (recoleccionCafe.length === 0) {
        mostrarMensaje('error', 'No hay datos para calcular');
        return;
    }
    
    // Obtener fechas únicas de los registros
    const fechasUnicas = [...new Set(recoleccionCafe.map(item => 
        new Date(item.fecha).toLocaleDateString()
    ))];
    
    // Crear diálogo modal
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.minWidth = '300px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Calcular Total por Fecha';
    modalTitle.style.marginBottom = '16px';
    modalTitle.style.color = 'var(--color-amber-900)';
    
    const formGroup = document.createElement('div');
    formGroup.style.marginBottom = '16px';
    
    const label = document.createElement('label');
    label.textContent = 'Seleccione una fecha:';
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    
    const select = document.createElement('select');
    select.style.width = '100%';
    select.style.padding = '10px';
    select.style.borderRadius = '4px';
    select.style.border = '1px solid var(--color-stone-300)';
    
    // Añadir opciones de fechas
    fechasUnicas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        select.appendChild(option);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.justifyContent = 'flex-end';
    
    const calculateButton = document.createElement('button');
    calculateButton.textContent = 'Calcular';
    calculateButton.style.backgroundColor = 'var(--color-amber-700)';
    calculateButton.style.color = 'white';
    calculateButton.style.border = 'none';
    calculateButton.style.borderRadius = '4px';
    calculateButton.style.padding = '8px 16px';
    calculateButton.style.cursor = 'pointer';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.style.backgroundColor = 'var(--color-stone-300)';
    cancelButton.style.color = 'var(--color-stone-900)';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.cursor = 'pointer';
    
    // Juntar todo el diálogo
    formGroup.appendChild(label);
    formGroup.appendChild(select);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(calculateButton);
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(formGroup);
    modalContent.appendChild(buttonContainer);
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Event handlers
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
    
    calculateButton.addEventListener('click', () => {
        const fechaSeleccionada = select.value;
        const totalKilos = calcularTotalKilosPorFecha(fechaSeleccionada);
        document.body.removeChild(modalOverlay);
        mostrarResultadoTotal(fechaSeleccionada, totalKilos);
    });
}

// Función para calcular el total de kilos por fecha
function calcularTotalKilosPorFecha(fechaLocalizada) {
    let totalKilos = 0;
    
    // Filtrar registros por la fecha seleccionada
    const registrosFiltrados = recoleccionCafe.filter(item => 
        new Date(item.fecha).toLocaleDateString() === fechaLocalizada
    );
    
    // Sumar las cantidades, convirtiendo todo a kilogramos
    registrosFiltrados.forEach(item => {
        let cantidadEnKilos = parseFloat(item.cantidad);
        
        // Convertir a kilogramos según la unidad
        switch(item.unidad.toLowerCase()) {
            case 'gramos':
                cantidadEnKilos /= 1000;
                break;
            case 'arrobas':
                cantidadEnKilos *= 12.5; // 1 arroba = 12.5 kg
                break;
            // Para kilogramos no hace falta conversión
        }
        
        totalKilos += cantidadEnKilos;
    });
    
    return totalKilos;
}

// Función para mostrar el resultado del cálculo
function mostrarResultadoTotal(fecha, totalKilos) {
    // Crear diálogo modal para mostrar resultado
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = '1000';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '24px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.minWidth = '300px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Resultado del Cálculo';
    modalTitle.style.marginBottom = '16px';
    modalTitle.style.color = 'var(--color-amber-900)';
    
    const resultText = document.createElement('p');
    resultText.innerHTML = `<strong>Fecha:</strong> ${fecha}<br><strong>Total Kilos:</strong> ${totalKilos.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} kg`;
    resultText.style.marginBottom = '16px';
    resultText.style.fontSize = '18px';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.style.backgroundColor = 'var(--color-amber-700)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'block';
    closeButton.style.marginLeft = 'auto';
    
    // Juntar todo el diálogo
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(resultText);
    modalContent.appendChild(closeButton);
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Event handler
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });
}

// Evento para el botón de calcular total por fecha
if (totalKilosBtn) {
    totalKilosBtn.addEventListener('click', mostrarDialogoSeleccionFecha);
}

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('recoleccionTableBody')) {
        cargarTabla();
    }
});

// Funciones para generar PDF de recibo de recolección
// Requiere jsPDF y html2canvas

// Función principal para generar PDF de un registro específico
function generarPDFRecibo(idRegistro) {
    // Verificar si las bibliotecas están disponibles correctamente
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        // Verificar la disponibilidad del objeto global de jsPDF
        if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            mostrarMensaje('error', 'No se pudieron cargar las bibliotecas necesarias para generar el PDF');
            return;
        }
    }
    
    // Buscar el registro en la base de datos local
    const registro = recoleccionCafe.find(item => item.id === idRegistro);
    if (!registro) {
        mostrarMensaje('error', 'No se encontró el registro solicitado');
        return;
    }
    
    // Crear el contenido HTML del recibo
    const reciboHTML = crearContenidoRecibo(registro);
    
    // Insertar el contenido HTML en el DOM temporalmente
    const contenedorTemporal = document.createElement('div');
    contenedorTemporal.id = 'pdf-container';
    contenedorTemporal.innerHTML = reciboHTML;
    contenedorTemporal.style.width = '595px'; // Ancho de A4 en píxeles a 72dpi
    contenedorTemporal.style.padding = '20px';
    contenedorTemporal.style.backgroundColor = 'white';
    contenedorTemporal.style.boxSizing = 'border-box';
    contenedorTemporal.style.position = 'absolute';
    contenedorTemporal.style.left = '-9999px';
    
    document.body.appendChild(contenedorTemporal);
    
    // Generar PDF usando html2canvas y jsPDF
    html2canvas(contenedorTemporal, {
        scale: 2, // Mayor escala para mejor calidad
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Usar la versión correcta de jsPDF
        let pdf;
        if (typeof jspdf !== 'undefined' && typeof jspdf.jsPDF === 'function') {
            // Versión UMD de jsPDF
            pdf = new jspdf.jsPDF();
        } else if (typeof window.jsPDF === 'function') {
            // Versión global de jsPDF
            pdf = new window.jsPDF();
        } else {
            mostrarMensaje('error', 'Error al acceder a la biblioteca jsPDF');
            document.body.removeChild(contenedorTemporal);
            return;
        }
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        
        pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`Recibo_Recoleccion_${registro.id}_${registro.nombreRecolector.replace(/\s+/g, '_')}.pdf`)
        // Eliminar el contenedor temporal
        document.body.removeChild(contenedorTemporal);
        
        mostrarMensaje('success', 'Recibo PDF generado correctamente');
    }).catch(error => {
        console.error('Error al generar PDF:', error);
        document.body.removeChild(contenedorTemporal);
        mostrarMensaje('error', 'Error al generar el PDF: ' + error.message);
    });
}

// Función para crear el contenido HTML del recibo
function crearContenidoRecibo(registro) {
    // Formatear fecha
    const fecha = new Date(registro.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Formatear valores monetarios
    const valorPorUnidadFormateado = formatoPesosCol.format(registro.valorPorUnidad);
    const totalGananciaFormateado = formatoPesosCol.format(registro.ganancia);
    const cantidadFormateada = registro.cantidad.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Crear HTML con estilos inline para el PDF
    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="display: flex; align-items: center;">
                    <div style="font-size: 28px; font-weight: bold; color: #795548;">
                        <span style="margin-right: 10px;">&#9749;</span>CaféGest
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: bold;">RECIBO DE RECOLECCIÓN</div>
                    <div>ID: ${registro.id}</div>
                    <div>Fecha: ${fechaFormateada}</div>
                </div>
            </div>
            
            <div style="border-bottom: 2px solid #795548; margin-bottom: 20px;"></div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #795548; margin-bottom: 15px;">Datos del Recolector</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; width: 40%;"><strong>Nombre:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${registro.nombreRecolector}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #795548; margin-bottom: 15px;">Detalles de Recolección</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; width: 40%;"><strong>Cantidad:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${cantidadFormateada} ${registro.unidad}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${registro.cosecha || 'No especificada'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Valor por Unidad:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${valorPorUnidadFormateado}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Ganancia Total:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${totalGananciaFormateado}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #795548; margin-bottom: 15px;">Términos y Condiciones</h2>
                <div style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-size: 12px;">
                    Al firmar este documento usted acusa recibo del pago correspondiente por las actividades de recolección realizadas, manifestando su conformidad con el monto recibido.
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                <div style="text-align: center; width: 40%;">
                    <div style="border-top: 1px solid #000; padding-top: 5px;">Firma del Recolector</div>
                </div>
                <div style="text-align: center; width: 40%;">
                    <div style="border-top: 1px solid #000; padding-top: 5px;">Firma del Administrador</div>
                </div>
            </div>
            
            <div style="margin-top: 50px; font-size: 12px; text-align: center; color: #666;">
                Este documento es un comprobante oficial de pago por recolección de café.
                <br>CaféGest © ${new Date().getFullYear()}
            </div>
        </div>
    `;
}