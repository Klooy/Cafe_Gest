// Constantes de almacenamiento local
const DB_NAME = 'cafegest_db';

// Variables globales con estructura de datos mejorada
let insumos = cargarInsumos();
let usos = cargarUsos();
let reabastecimientos = cargarReabastecimientos(); // Nueva variable para reabastecimientos
let insumoIdCounter = parseInt(localStorage.getItem(`${DB_NAME}_insumos_counter`)) || 1;
let usoIdCounter = parseInt(localStorage.getItem(`${DB_NAME}_usos_counter`)) || 1;
let reabastecimientoIdCounter = parseInt(localStorage.getItem(`${DB_NAME}_reabastecimientos_counter`)) || 1; // Contador para reabastecimientos
let insumoEditIndex = -1;
let usoEditIndex = -1;

// Cargar datos desde localStorage al iniciar
function cargarInsumos() {
    const storedInsumos = localStorage.getItem(`${DB_NAME}_insumos`);
    return storedInsumos ? JSON.parse(storedInsumos) : [];
}

function cargarUsos() {
    const storedUsos = localStorage.getItem(`${DB_NAME}_usos`);
    return storedUsos ? JSON.parse(storedUsos) : [];
}

// Nueva función para cargar reabastecimientos
function cargarReabastecimientos() {
    const storedReabastecimientos = localStorage.getItem(`${DB_NAME}_reabastecimientos`);
    return storedReabastecimientos ? JSON.parse(storedReabastecimientos) : [];
}

// Guardar datos en localStorage
function guardarInsumos() {
    localStorage.setItem(`${DB_NAME}_insumos`, JSON.stringify(insumos));
    localStorage.setItem(`${DB_NAME}_insumos_counter`, insumoIdCounter.toString());
}

function guardarUsos() {
    localStorage.setItem(`${DB_NAME}_usos`, JSON.stringify(usos));
    localStorage.setItem(`${DB_NAME}_usos_counter`, usoIdCounter.toString());
}

// Nueva función para guardar reabastecimientos
function guardarReabastecimientos() {
    localStorage.setItem(`${DB_NAME}_reabastecimientos`, JSON.stringify(reabastecimientos));
    localStorage.setItem(`${DB_NAME}_reabastecimientos_counter`, reabastecimientoIdCounter.toString());
}

// Función para mostrar un mensaje
function mostrarMensaje(tipo, mensaje) {
    const messageBox = document.getElementById('messageBox');
    messageBox.className = `message ${tipo}`;
    messageBox.textContent = mensaje;
    messageBox.style.display = 'block';
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// Función para formatear valores monetarios en formato colombiano
function formatMonedaCOP(valor) {
    // Asegurarse de que el valor sea un número
    const numero = parseFloat(valor);
    if (isNaN(numero)) return '$0';
    
    // Formatear con el formato colombiano: separador de miles con punto y decimales con coma
    return '$' + numero.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Variables globales para paginación
let currentPageUsos = 1;
let currentPageReabastecimientos = 1;
const itemsPerPage = 10;

// Función para crear controles de paginación
function createPaginationControls(containerId, currentPage, totalItems, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <div class="pagination-container">
            <div class="pagination-info">
                Página ${currentPage} de ${totalPages} - ${totalItems} registros
            </div>
            <div class="pagination-controls">
    `;
    
    // Botón anterior
    if (currentPage > 1) {
        paginationHTML += `
            <button class="btn-pagination" onclick="${onPageChange}(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
        `;
    }
    
    // Números de página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="btn-pagination" onclick="${onPageChange}(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `
            <button class="btn-pagination ${activeClass}" onclick="${onPageChange}(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="btn-pagination" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
    }
    
    // Botón siguiente
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="btn-pagination" onclick="${onPageChange}(${currentPage + 1})">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    paginationHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = paginationHTML;
}

// Función para cambiar página de usos
function changePageUsos(page) {
    currentPageUsos = page;
    renderUsosTable();
}

// Función para cambiar página de reabastecimientos
function changePageReabastecimientos(page) {
    currentPageReabastecimientos = page;
    renderReabastecimientosTable();
}

// Funciones para manejar la tabla de insumos
function renderInsumosTable() {
    const tableBody = document.getElementById('insumosTableBody');
    const emptyState = document.getElementById('emptyStateInsumos');
    
    tableBody.innerHTML = '';
    
    if (insumos.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    insumos.forEach(insumo => {
        // Encontrar la última fecha de reabastecimiento
        const ultimoReabastecimiento = reabastecimientos
            .filter(r => r.insumoId === insumo.id)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        
        const ultimaReposicion = ultimoReabastecimiento ? formatDate(ultimoReabastecimiento.fecha) : 'No reabastecido';
        
        const row = document.createElement('tr');
        
        // Crear las celdas de cada columna
        row.innerHTML = `
            <td>${insumo.id}</td>
            <td>${insumo.nombre}</td>
            <td>${insumo.cantidad} kg</td>
            <td>${formatMonedaCOP(insumo.valor)}</td>
            <td>${formatDate(insumo.fecha)}</td>
            <td>${ultimaReposicion}</td>
            <td>
                <span class="badge ${insumo.disponibilidad === 'Disponible' ? 'badge-success' : 'badge-danger'}">
                    ${insumo.disponibilidad}
                </span>
            </td>
            <td class="table-actions">
                <button class="btn-icon btn-edit" onclick="editarInsumo(${insumo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarInsumo(${insumo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Función para renderizar tabla de usos filtrada (sin paginación)
function renderUsosTableFiltered(filteredData) {
    const tableBody = document.getElementById('usosTableBody');
    const emptyState = document.getElementById('emptyStateUsos');
    const paginationContainer = document.getElementById('usosTablePagination');
    
    tableBody.innerHTML = '';
    paginationContainer.innerHTML = ''; // Ocultar paginación durante búsqueda
    
    // Ordenar por fecha más reciente
    const sortedData = [...filteredData].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (sortedData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    sortedData.forEach(uso => {
        const insumo = insumos.find(item => item.id === uso.insumoId);
        if (!insumo) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${uso.id}</td>
            <td>${insumo.nombre}</td>
            <td>${uso.cantidad} kg</td>
            <td>${uso.usuario}</td>
            <td>${formatDate(uso.fecha)}</td>
            <td>${uso.detalles || '-'}</td>
            <td class="table-actions">
                <button class="btn-icon btn-edit" onclick="editarUso(${uso.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarUso(${uso.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Renderizar la tabla de reabastecimientos
function renderReabastecimientosTable(filteredData = null) {
    const tableBody = document.getElementById('reabastecimientosTableBody');
    const emptyState = document.getElementById('emptyStateReabastecimientos');
    
    tableBody.innerHTML = '';
    
    // Usar datos filtrados si se proporcionan, sino usar todos los reabastecimientos
    const dataToRender = filteredData || reabastecimientos;
    
    // Ordenar por fecha más reciente
    const sortedData = [...dataToRender].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (sortedData.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('reabastecimientosTablePagination').innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Calcular índices para la paginación
    const startIndex = (currentPageReabastecimientos - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    // Renderizar filas de la página actual
    paginatedData.forEach(reabastecimiento => {
        const insumo = insumos.find(item => item.id === reabastecimiento.insumoId);
        if (!insumo) return; // Omitir si el insumo ya no existe
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${reabastecimiento.id}</td>
            <td>${insumo.nombre}</td>
            <td>${reabastecimiento.cantidad} kg</td>
            <td>${formatMonedaCOP(reabastecimiento.valor)}</td>
            <td>${formatDate(reabastecimiento.fecha)}</td>
            <td>${reabastecimiento.responsable}</td>
            <td>${reabastecimiento.observaciones || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Crear controles de paginación solo si no estamos filtrando
    if (!filteredData) {
        createPaginationControls('reabastecimientosTablePagination', currentPageReabastecimientos, sortedData.length, 'changePageReabastecimientos');
    }
}

function searchInUsosTable(searchText) {
    const searchTerm = searchText.toLowerCase();
    
    if (!searchTerm) {
        currentPageUsos = 1; // Reset página
        renderUsosTable();
        return;
    }
    
    // Filtrar datos según el término de búsqueda
    const filteredData = usos.filter(uso => {
        const insumo = insumos.find(i => i.id === uso.insumoId);
        return (insumo && insumo.nombre.toLowerCase().includes(searchTerm)) ||
               uso.usuario.toLowerCase().includes(searchTerm) ||
               formatDate(uso.fecha).includes(searchTerm) ||
               (uso.detalles && uso.detalles.toLowerCase().includes(searchTerm));
    });
    
    // Renderizar con datos filtrados (sin paginación durante búsqueda)
    renderUsosTableFiltered(filteredData);
}


// Funciones para el modal de insumos
function openInsumoModal(edit = false) {
    const modal = document.getElementById('modalInsumo');
    const modalTitle = document.getElementById('modalInsumoTitle');
    const form = document.getElementById('insumoForm');
    
    // Restablecer el formulario solo si no estamos editando
    if (!edit) {
        form.reset();
        // Establecer la fecha de hoy como predeterminada si es un nuevo registro
        document.getElementById('fechaInsumo').valueAsDate = new Date();
        // Establecer la cantidad en 0 por defecto
        document.getElementById('cantidadInsumo').value = "0";
    }
    
    // Cambiar el título según la acción
    modalTitle.textContent = edit ? 'Editar Insumo' : 'Registrar Nuevo Insumo';
    
    // Mostrar el modal
    modal.style.display = 'block';
}


function closeInsumoModal() {
    const modal = document.getElementById('modalInsumo');
    modal.style.display = 'none';
    insumoEditIndex = -1;
}

function saveInsumo() {
    const nombre = document.getElementById('nombreInsumo').value;
    const cantidadInput = document.getElementById('cantidadInsumo').value;
    const cantidad = cantidadInput === '' ? 0 : parseFloat(cantidadInput);
    
    // Obtener el valor y eliminar formato de moneda si existe
    let valorInput = document.getElementById('valorInsumo').value;
    valorInput = valorInput.replace(/[$.]/g, '').replace(',', '.');
    const valor = parseFloat(valorInput);
    
    const fecha = document.getElementById('fechaInsumo').value;
    const disponibilidad = document.getElementById('disponibilidadInsumo').value;
    
    // Validar datos
    if (!nombre || isNaN(valor) || !fecha) {
        mostrarMensaje('error', 'Por favor complete todos los campos correctamente');
        return;
    }
    
    if (insumoEditIndex === -1) {
        // Agregar nuevo insumo con ID único
        const insumo = {
            id: insumoIdCounter++, 
            nombre,
            cantidad,
            valor,
            fecha,
            disponibilidad
        };
        
        insumos.push(insumo);
        mostrarMensaje('success', 'Insumo registrado correctamente');
    } else {
        // Buscar el insumo por su índice
        const insumo = insumos.find(item => item.id === insumoEditIndex);
        
        if (insumo) {
            // Actualizar insumo existente
            insumo.nombre = nombre;
            insumo.cantidad = cantidad;
            insumo.valor = valor;
            insumo.fecha = fecha;
            insumo.disponibilidad = disponibilidad;
            mostrarMensaje('success', 'Insumo actualizado correctamente');
        }
    }
    
    // Guardar y actualizar la vista
    guardarInsumos();
    renderInsumosTable();
    updateInsumoSelect();
    updateReabastecerSelect(); // Actualizar el select de reabastecimiento
    closeInsumoModal();
}

function editarInsumo(id) {
    const insumo = insumos.find(item => item.id === id);
    
    if (!insumo) return;
    
    // Establecer el índice de edición
    insumoEditIndex = insumo.id;
    
    // Llenar el formulario con los datos del insumo
    document.getElementById('nombreInsumo').value = insumo.nombre;
    document.getElementById('cantidadInsumo').value = insumo.cantidad;
    document.getElementById('valorInsumo').value = insumo.valor;
    document.getElementById('fechaInsumo').value = insumo.fecha;
    document.getElementById('disponibilidadInsumo').value = insumo.disponibilidad;
    
    // Abrir el modal con el parámetro edit en true
    openInsumoModal(true);
}

function eliminarInsumo(id) {
    if (confirm('¿Está seguro de eliminar este insumo?')) {
        // Verificar si el insumo está siendo utilizado
        const insumoUsado = usos.some(uso => uso.insumoId === id);
        
        if (insumoUsado) {
            mostrarMensaje('error', 'No se puede eliminar un insumo que está siendo utilizado');
            return;
        }
        
        // Eliminar el insumo usando su ID
        insumos = insumos.filter(item => item.id !== id);
        guardarInsumos();
        renderInsumosTable();
        updateInsumoSelect();
        updateReabastecerSelect(); // Actualizar el select de reabastecimiento
        mostrarMensaje('success', 'Insumo eliminado correctamente');
    }
}

// Funciones para manejar el reabastecimiento de insumos
function openReabastecerModal() {
    const modal = document.getElementById('modalReabastecer');
    document.getElementById('reabastecerForm').reset();
    
    // Actualizar la lista de insumos para reabastecer
    updateReabastecerSelect();
    
    // Establecer la fecha de hoy como predeterminada
    document.getElementById('fechaReabastecer').valueAsDate = new Date();
    
    // Establecer valor en cero por defecto
    document.getElementById('valorReabastecer').value = "0";
    
    // Mostrar el modal
    modal.style.display = 'block';
}

function closeReabastecerModal() {
    const modal = document.getElementById('modalReabastecer');
    modal.style.display = 'none';
}

function saveReabastecimiento() {
    const insumoId = parseInt(document.getElementById('insumoReabastecer').value);
    const cantidad = parseFloat(document.getElementById('cantidadReabastecer').value);
    
    let valorInput = document.getElementById('valorReabastecer').value;
    valorInput = valorInput.replace(/[$.]/g, '').replace(',', '.');
    const valor = parseFloat(valorInput);
    
    const fecha = document.getElementById('fechaReabastecer').value;
    const responsable = document.getElementById('responsableReabastecer').value;
    const observaciones = document.getElementById('observacionesReabastecer').value;
    
    // Validar datos
    if (isNaN(insumoId) || isNaN(cantidad) || isNaN(valor) || !fecha || !responsable) {
        mostrarMensaje('error', 'Por favor complete todos los campos correctamente');
        return;
    }
    
    if (cantidad <= 0) {
        mostrarMensaje('error', 'La cantidad debe ser mayor que cero');
        return;
    }
    
    const insumo = insumos.find(item => item.id === insumoId);
    if (!insumo) {
        mostrarMensaje('error', 'El insumo seleccionado no existe');
        return;
    }
    
    const reabastecimiento = {
        id: reabastecimientoIdCounter++,
        insumoId,
        cantidad,
        valor,
        fecha,
        responsable,
        observaciones
    };
    
    reabastecimientos.push(reabastecimiento);
    insumo.cantidad += cantidad;
    
    if (insumo.cantidad > 0 && insumo.disponibilidad === 'No Disponible') {
        insumo.disponibilidad = 'Disponible';
    }
    
    // IR A LA PÁGINA DEL REGISTRO MÁS RECIENTE (página 1)
    goToPageWithLatestRecord('reabastecimiento');
    
    resetPagesAfterDataChange();
    guardarInsumos();
    guardarReabastecimientos();
    renderInsumosTable();
    renderReabastecimientosTable();
    closeReabastecerModal();
    mostrarMensaje('success', 'Reabastecimiento registrado correctamente');
}

function updateReabastecerSelect() {
    const select = document.getElementById('insumoReabastecer');
    select.innerHTML = '';
    
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione un insumo';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Llenar opciones con todos los insumos (disponibles o no)
    insumos.forEach(insumo => {
        const option = document.createElement('option');
        option.value = insumo.id;
        option.textContent = `${insumo.nombre} (Actual: ${insumo.cantidad} kg)`;
        select.appendChild(option);
    });
}

// Funciones para la tabla de usos
function renderUsosTable(filteredData = null) {
    const tableBody = document.getElementById('usosTableBody');
    const emptyState = document.getElementById('emptyStateUsos');
    
    tableBody.innerHTML = '';
    
    // Usar datos filtrados si se proporcionan, sino usar todos los usos
    const dataToRender = filteredData || usos;
    
    // Ordenar por fecha más reciente
    const sortedData = [...dataToRender].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (sortedData.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('usosTablePagination').innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Calcular índices para la paginación
    const startIndex = (currentPageUsos - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);
    
    // Renderizar filas de la página actual
    paginatedData.forEach(uso => {
        const insumo = insumos.find(item => item.id === uso.insumoId);
        if (!insumo) return; // Omitir si el insumo ya no existe
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${uso.id}</td>
            <td>${insumo.nombre}</td>
            <td>${uso.cantidad} kg</td>
            <td>${uso.usuario}</td>
            <td>${formatDate(uso.fecha)}</td>
            <td>${uso.detalles || '-'}</td>
            <td class="table-actions">
                <button class="btn-icon btn-edit" onclick="editarUso(${uso.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarUso(${uso.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Crear controles de paginación solo si no estamos filtrando
    if (!filteredData) {
        createPaginationControls('usosTablePagination', currentPageUsos, sortedData.length, 'changePageUsos');
    }
}

// Nueva función para editar un uso
function editarUso(id) {
    const uso = usos.find(item => item.id === id);
    
    if (!uso) return;
    
    // Establecer el índice de edición
    usoEditIndex = uso.id;
    
    // Primero abrimos el modal para que se inicialice correctamente
    openUsoModal(true);
    
    // Luego llenamos los campos del formulario
    const insumoSelect = document.getElementById('insumoSeleccionado');
    
    // Asegurarnos de que el insumo correcto esté seleccionado
    for (let i = 0; i < insumoSelect.options.length; i++) {
        if (parseInt(insumoSelect.options[i].value) === uso.insumoId) {
            insumoSelect.selectedIndex = i;
            break;
        }
    }
    
    document.getElementById('cantidadUsada').value = uso.cantidad;
    document.getElementById('usuarioInsumo').value = uso.usuario;
    document.getElementById('fechaUso').value = uso.fecha;
    document.getElementById('detallesUso').value = uso.detalles || '';
}

// Función para abrir el modal de uso (modificada)
function openUsoModal(edit = false) {
    const modal = document.getElementById('modalUso');
    const modalTitle = document.getElementById('modalUsoTitle');
    
    if (!edit) {
        // Si es un nuevo registro, limpiar el formulario
        document.getElementById('usoForm').reset();
        modalTitle.textContent = 'Registrar Uso de Insumo';
        
        // Establecer la fecha de hoy como predeterminada
        document.getElementById('fechaUso').valueAsDate = new Date();
    }
    
    // Actualizar la lista de insumos disponibles
    updateInsumoSelect();
    
    // Si estamos editando, necesitamos asegurarnos de que el insumo actual esté disponible en el select
    if (edit) {
        const insumoSelect = document.getElementById('insumoSeleccionado');
        const uso = usos.find(item => item.id === usoEditIndex);
        
        if (uso) {
            // Verificar si el insumo ya está en el select
            let insumoEncontrado = false;
            for (let i = 0; i < insumoSelect.options.length; i++) {
                if (parseInt(insumoSelect.options[i].value) === uso.insumoId) {
                    insumoEncontrado = true;
                    break;
                }
            }
            
            // Si no está en el select (porque podría estar en 0 o no disponible), agregarlo
            if (!insumoEncontrado) {
                const insumo = insumos.find(item => item.id === uso.insumoId);
                if (insumo) {
                    const option = document.createElement('option');
                    option.value = insumo.id;
                    option.textContent = `${insumo.nombre} (Disp: ${insumo.cantidad} kg)`;
                    insumoSelect.appendChild(option);
                }
            }
        }
    }
    
    // Mostrar el modal
    modal.style.display = 'block';
}

// Funciones para actualizar el selector de insumos
function updateInsumoSelect() {
    const select = document.getElementById('insumoSeleccionado');
    select.innerHTML = '';
    
    // Opción por defecto
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione un insumo';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    
    // Llenar opciones con insumos disponibles
    insumos.forEach(insumo => {
        if (insumo.disponibilidad === 'Disponible' && insumo.cantidad > 0) {
            const option = document.createElement('option');
            option.value = insumo.id;
            option.textContent = `${insumo.nombre} (Disp: ${insumo.cantidad} kg)`;
            select.appendChild(option);
        }
    });
}

// Funciones para el modal de uso de insumos
function openUsoModal() {
    const modal = document.getElementById('modalUso');
    document.getElementById('usoForm').reset();
    
    // Actualizar la lista de insumos disponibles
    updateInsumoSelect();
    
    // Establecer la fecha de hoy como predeterminada
    document.getElementById('fechaUso').valueAsDate = new Date();
    
    // Mostrar el modal
    modal.style.display = 'block';
}

function closeUsoModal() {
    const modal = document.getElementById('modalUso');
    modal.style.display = 'none';
    usoEditIndex = -1;
}

function saveUso() {
    const insumoId = parseInt(document.getElementById('insumoSeleccionado').value);
    const cantidad = parseFloat(document.getElementById('cantidadUsada').value);
    const usuario = document.getElementById('usuarioInsumo').value;
    const fecha = document.getElementById('fechaUso').value;
    const detalles = document.getElementById('detallesUso').value;
    
    // Validar datos
    if (isNaN(insumoId) || isNaN(cantidad) || !usuario || !fecha) {
        mostrarMensaje('error', 'Por favor complete todos los campos correctamente');
        return;
    }
    
    if (usoEditIndex === -1) {
        // Crear nuevo uso
        
        // Verificar si hay suficiente cantidad del insumo
        const insumo = insumos.find(item => item.id === insumoId);
        if (!insumo || cantidad > insumo.cantidad) {
            mostrarMensaje('error', 'No hay suficiente cantidad disponible de este insumo');
            return;
        }
        
        // Crear objeto de uso con ID único
        const uso = {
            id: usoIdCounter++,
            insumoId,
            cantidad,
            usuario,
            fecha,
            detalles
        };
        
        // Agregar uso y actualizar cantidad del insumo
        usos.push(uso);
        insumo.cantidad -= cantidad;
        
        // Si la cantidad llega a 0, cambiar disponibilidad
        if (insumo.cantidad <= 0) {
            insumo.disponibilidad = 'No Disponible';
        }
        
        // IR A LA PÁGINA DEL REGISTRO MÁS RECIENTE (página 1)
        goToPageWithLatestRecord('uso');
        
        mostrarMensaje('success', 'Uso de insumo registrado correctamente');
    } else {
        // Código existente para editar...
        const usoActual = usos.find(item => item.id === usoEditIndex);
        
        if (!usoActual) {
            mostrarMensaje('error', 'No se encontró el registro de uso a editar');
            return;
        }
        
        const insumoActual = insumos.find(item => item.id === usoActual.insumoId);
        const insumoNuevo = insumos.find(item => item.id === insumoId);
        
        if (!insumoActual || !insumoNuevo) {
            mostrarMensaje('error', 'No se encontró el insumo asociado');
            return;
        }
        
        insumoActual.cantidad += usoActual.cantidad;
        
        if (cantidad > insumoNuevo.cantidad) {
            mostrarMensaje('error', 'No hay suficiente cantidad disponible del insumo seleccionado');
            insumoActual.cantidad -= usoActual.cantidad;
            return;
        }
        
        usoActual.insumoId = insumoId;
        usoActual.cantidad = cantidad;
        usoActual.usuario = usuario;
        usoActual.fecha = fecha;
        usoActual.detalles = detalles;
        
        insumoNuevo.cantidad -= cantidad;
        
        if (insumoActual.cantidad > 0 && insumoActual.disponibilidad === 'No Disponible') {
            insumoActual.disponibilidad = 'Disponible';
        }
        
        if (insumoNuevo.cantidad <= 0) {
            insumoNuevo.disponibilidad = 'No Disponible';
        }
        
        mostrarMensaje('success', 'Uso de insumo actualizado correctamente');
    }
    
    // Guardar y actualizar la vista
    resetPagesAfterDataChange();
    guardarInsumos();
    guardarUsos();
    renderInsumosTable();
    renderUsosTable();
    updateInsumoSelect();
    closeUsoModal();
}

// Función para cerrar el modal de uso (modificada)
function closeUsoModal() {
    const modal = document.getElementById('modalUso');
    modal.style.display = 'none';
    usoEditIndex = -1;
}

function viewUso(id) {
    const uso = usos.find(item => item.id === id);
    if (!uso) return;
    
    const insumo = insumos.find(item => item.id === uso.insumoId);
    
    if (!insumo) {
        mostrarMensaje('error', 'El insumo asociado a este uso ya no existe');
        return;
    }
    
    const detalles = `
        Insumo: ${insumo.nombre}
        Cantidad usada: ${uso.cantidad} kg
        Usuario: ${uso.usuario}
        Fecha: ${formatDate(uso.fecha)}
        Detalles: ${uso.detalles || 'Sin detalles'}
    `;
    
    alert(detalles);
}

function eliminarUso(id) {
    if (confirm('¿Está seguro de eliminar este registro de uso?')) {
        const uso = usos.find(item => item.id === id);
        if (!uso) return;
        
        const insumoId = uso.insumoId;
        const insumo = insumos.find(item => item.id === insumoId);
        
        if (insumo) {
            insumo.cantidad += uso.cantidad;
            
            // Si el insumo estaba marcado como no disponible pero ahora tiene cantidad, cambiarlo a disponible
            if (insumo.cantidad > 0 && insumo.disponibilidad === 'No Disponible') {
                insumo.disponibilidad = 'Disponible';
            }
            
            guardarInsumos();
            renderInsumosTable();
        }
        
        // Eliminar el uso por su ID
        usos = usos.filter(item => item.id !== id);
        resetPagesAfterDataChange(); // Reset páginas
        guardarUsos();
        renderUsosTable();
        mostrarMensaje('success', 'Registro de uso eliminado correctamente');
    }
}

// Funciones de utilidad para formatear fechas
function formatDate(dateString) {
    // Para fechas provenientes de inputs type="date", usamos split para evitar problemas de zona horaria
    const parts = dateString.split('-');
    if (parts.length === 3) {
        // Si es formato YYYY-MM-DD (del input date)
        return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('es-CO');
    }
    // Para otros formatos de fecha
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
}

// Funciones para buscar en las tablas
function setupSearch() {
    document.getElementById('searchInputInsumos').addEventListener('input', function() {
        searchInTable('insumosTableBody', this.value, insumos);
    });
    
    document.getElementById('searchInputUsos').addEventListener('input', function() {
        searchInUsosTable(this.value);
    });
    
    document.getElementById('searchInputReabastecimientos').addEventListener('input', function() {
        searchInReabastecimientosTable(this.value);
    });
}

// Función para resetear páginas cuando se añaden/editan/eliminan registros
function resetPagesAfterDataChange() {
    // En lugar de resetear a 1, verificar si la página actual sigue siendo válida
    const totalUsosPages = Math.ceil(usos.length / itemsPerPage);
    const totalReabastecimientosPages = Math.ceil(reabastecimientos.length / itemsPerPage);
    
    // Solo resetear si la página actual es mayor que el total de páginas
    if (currentPageUsos > totalUsosPages && totalUsosPages > 0) {
        currentPageUsos = totalUsosPages;
    } else if (totalUsosPages === 0) {
        currentPageUsos = 1;
    }
    
    if (currentPageReabastecimientos > totalReabastecimientosPages && totalReabastecimientosPages > 0) {
        currentPageReabastecimientos = totalReabastecimientosPages;
    } else if (totalReabastecimientosPages === 0) {
        currentPageReabastecimientos = 1;
    }
}

// 2. Nueva función para ir automáticamente a la página donde está el registro más reciente
function goToPageWithLatestRecord(recordType = 'uso') {
    if (recordType === 'uso' && usos.length > 0) {
        // Los registros ya están ordenados por fecha más reciente, 
        // el más reciente estará en la página 1
        currentPageUsos = 1;
    } else if (recordType === 'reabastecimiento' && reabastecimientos.length > 0) {
        currentPageReabastecimientos = 1;
    }
}

function searchInTable(tableId, searchText, dataArray) {
    const searchTerm = searchText.toLowerCase();
    
    if (!searchTerm) {
        if (tableId === 'insumosTableBody') {
            renderInsumosTable();
        } else if (tableId === 'usosTableBody') {
            renderUsosTable();
        }
        return;
    }
    
    // Filtrar datos según el término de búsqueda
    const filteredData = tableId === 'insumosTableBody' 
        ? insumos.filter(item => 
            item.nombre.toLowerCase().includes(searchTerm) ||
            item.disponibilidad.toLowerCase().includes(searchTerm) ||
            formatDate(item.fecha).includes(searchTerm)
        )
        : usos.filter(uso => {
            const insumo = insumos.find(i => i.id === uso.insumoId);
            return (insumo && insumo.nombre.toLowerCase().includes(searchTerm)) ||
                   uso.usuario.toLowerCase().includes(searchTerm) ||
                   formatDate(uso.fecha).includes(searchTerm) ||
                   (uso.detalles && uso.detalles.toLowerCase().includes(searchTerm));
        });
    
    // Renderizar tabla con datos filtrados
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    
    if (tableId === 'insumosTableBody') {
        // [Código existente sin cambios]
        if (filteredData.length === 0) {
            document.getElementById('emptyStateInsumos').style.display = 'block';
            return;
        }
        
        document.getElementById('emptyStateInsumos').style.display = 'none';
        
        filteredData.forEach(insumo => {
            // Encontrar la última fecha de reabastecimiento
            const ultimoReabastecimiento = reabastecimientos
                .filter(r => r.insumoId === insumo.id)
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
            
            const ultimaReposicion = ultimoReabastecimiento ? formatDate(ultimoReabastecimiento.fecha) : 'No reabastecido';
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${insumo.id}</td>
                <td>${insumo.nombre}</td>
                <td>${insumo.cantidad} kg</td>
                <td>$${parseFloat(insumo.valor).toLocaleString('es-CO')}</td>
                <td>${formatDate(insumo.fecha)}</td>
                <td>${ultimaReposicion}</td>
                <td>
                    <span class="badge ${insumo.disponibilidad === 'Disponible' ? 'badge-success' : 'badge-danger'}">
                        ${insumo.disponibilidad}
                    </span>
                </td>
                <td class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editarInsumo(${insumo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="eliminarInsumo(${insumo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } else if (tableId === 'usosTableBody') {
        if (filteredData.length === 0) {
            document.getElementById('emptyStateUsos').style.display = 'block';
            return;
        }
        
        document.getElementById('emptyStateUsos').style.display = 'none';
        
        filteredData.forEach(uso => {
            const insumo = insumos.find(item => item.id === uso.insumoId);
            if (!insumo) return;
            
            const row = document.createElement('tr');
            
            // Cambiado de btn-view a btn-edit y de viewUso a editarUso
            row.innerHTML = `
                <td>${uso.id}</td>
                <td>${insumo.nombre}</td>
                <td>${uso.cantidad} kg</td>
                <td>${uso.usuario}</td>
                <td>${formatDate(uso.fecha)}</td>
                <td>${uso.detalles || '-'}</td>
                <td class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editarUso(${uso.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="eliminarUso(${uso.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
}

// Función para renderizar tabla de reabastecimientos filtrada (sin paginación)
function renderReabastecimientosTableFiltered(filteredData) {
    const tableBody = document.getElementById('reabastecimientosTableBody');
    const emptyState = document.getElementById('emptyStateReabastecimientos');
    const paginationContainer = document.getElementById('reabastecimientosTablePagination');
    
    tableBody.innerHTML = '';
    paginationContainer.innerHTML = ''; // Ocultar paginación durante búsqueda
    
    // Ordenar por fecha más reciente
    const sortedData = [...filteredData].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (sortedData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    sortedData.forEach(reabastecimiento => {
        const insumo = insumos.find(item => item.id === reabastecimiento.insumoId);
        if (!insumo) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${reabastecimiento.id}</td>
            <td>${insumo.nombre}</td>
            <td>${reabastecimiento.cantidad} kg</td>
            <td>${formatMonedaCOP(reabastecimiento.valor)}</td>
            <td>${formatDate(reabastecimiento.fecha)}</td>
            <td>${reabastecimiento.responsable}</td>
            <td>${reabastecimiento.observaciones || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Función para buscar en la tabla de reabastecimientos
function searchInReabastecimientosTable(searchText) {
    const searchTerm = searchText.toLowerCase();
    
    if (!searchTerm) {
        currentPageReabastecimientos = 1; // Reset página
        renderReabastecimientosTable();
        return;
    }
    
    // Filtrar datos según el término de búsqueda
    const filteredData = reabastecimientos.filter(reabastecer => {
        const insumo = insumos.find(i => i.id === reabastecer.insumoId);
        return (insumo && insumo.nombre.toLowerCase().includes(searchTerm)) ||
               reabastecer.responsable.toLowerCase().includes(searchTerm) ||
               formatDate(reabastecer.fecha).includes(searchTerm) ||
               (reabastecer.observaciones && reabastecer.observaciones.toLowerCase().includes(searchTerm));
    });
    
    // Renderizar con datos filtrados (sin paginación durante búsqueda)
    renderReabastecimientosTableFiltered(filteredData);
    
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    filteredData.forEach(reabastecimiento => {
        const insumo = insumos.find(item => item.id === reabastecimiento.insumoId);
        if (!insumo) return;
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${reabastecimiento.id}</td>
            <td>${insumo.nombre}</td>
            <td>${reabastecimiento.cantidad} kg</td>
            <td>$${reabastecimiento.valor ? parseFloat(reabastecimiento.valor).toLocaleString('es-CO') : '0'}</td>
            <td>${formatMonedaCOP(reabastecimiento.valor)}</td>
            <td>${formatDate(reabastecimiento.fecha)}</td>
            <td>${reabastecimiento.responsable}</td>
            <td>${reabastecimiento.observaciones || '-'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Funciones para exportar a Excel
// Modificar la función exportToExcel para formatear valores antes de exportar
function exportToExcel(tableId, fileName) {
    // Verificar si hay datos para exportar
    const dataArray = tableId === 'insumosTable' 
        ? insumos 
        : tableId === 'usosTable' 
        ? usos 
        : reabastecimientos;
    
    if (dataArray.length === 0) {
        mostrarMensaje('error', 'No hay datos para exportar');
        return;
    }
    
    // Preparar los datos para exportar con formato colombiano
    let dataToExport = [];
    
    if (tableId === 'insumosTable') {
        dataToExport = insumos.map(insumo => ({
            ID: insumo.id,
            Nombre: insumo.nombre,
            Cantidad: insumo.cantidad + ' kg',
            Valor: formatMonedaCOP(insumo.valor),
            Fecha: formatDate(insumo.fecha),
            Disponibilidad: insumo.disponibilidad
        }));
    } else if (tableId === 'usosTable') {
        dataToExport = usos.map(uso => {
            const insumo = insumos.find(item => item.id === uso.insumoId);
            return {
                ID: uso.id,
                Insumo: insumo ? insumo.nombre : 'Desconocido',
                Cantidad: uso.cantidad + ' kg',
                Usuario: uso.usuario,
                Fecha: formatDate(uso.fecha),
                Detalles: uso.detalles || '-'
            };
        });
    } else {
        dataToExport = reabastecimientos.map(reabastecimiento => {
            const insumo = insumos.find(item => item.id === reabastecimiento.insumoId);
            return {
                ID: reabastecimiento.id,
                Insumo: insumo ? insumo.nombre : 'Desconocido',
                Cantidad: reabastecimiento.cantidad + ' kg',
                Valor: formatMonedaCOP(reabastecimiento.valor),
                Fecha: formatDate(reabastecimiento.fecha),
                Responsable: reabastecimiento.responsable,
                Observaciones: reabastecimiento.observaciones || '-'
            };
        });
    }
    
    // Crear un libro de trabajo desde los datos formateados
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Guardar el archivo Excel
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    
    mostrarMensaje('success', `Datos exportados correctamente a ${fileName}.xlsx`);
}

// 5. OPCIONAL: Agregar botón para ir a registros más recientes
function addGoToLatestButton() {
    // Agregar botón en la sección de usos
    const usosHeader = document.querySelector('#usos .section-header');
    if (usosHeader && !document.getElementById('btnLatestUsos')) {
        const btnLatest = document.createElement('button');
        btnLatest.id = 'btnLatestUsos';
        btnLatest.className = 'btn-secondary';
        btnLatest.innerHTML = '<i class="fas fa-clock"></i> Ver Más Recientes';
        btnLatest.onclick = () => {
            goToPageWithLatestRecord('uso');
            renderUsosTable();
        };
        usosHeader.appendChild(btnLatest);
    }
    
    // Agregar botón en la sección de reabastecimientos
    const reabastecimientosHeader = document.querySelector('#reabastecimientos .section-header');
    if (reabastecimientosHeader && !document.getElementById('btnLatestReabastecimientos')) {
        const btnLatest = document.createElement('button');
        btnLatest.id = 'btnLatestReabastecimientos';
        btnLatest.className = 'btn-secondary';
        btnLatest.innerHTML = '<i class="fas fa-clock"></i> Ver Más Recientes';
        btnLatest.onclick = () => {
            goToPageWithLatestRecord('reabastecimiento');
            renderReabastecimientosTable();
        };
        reabastecimientosHeader.appendChild(btnLatest);
    }
}

// Manejadores de eventos
function setupEventListeners() {
    // Eventos para el modal de insumos
    document.getElementById('btnNuevoInsumo').addEventListener('click', () => openInsumoModal(false));
    document.getElementById('closeModalInsumo').addEventListener('click', closeInsumoModal);
    document.getElementById('guardarInsumoBtn').addEventListener('click', saveInsumo);
    document.getElementById('cancelarInsumoBtn').addEventListener('click', closeInsumoModal);
    
    // Eventos para el modal de reabastecimiento
    document.getElementById('btnReabastecerInsumo').addEventListener('click', openReabastecerModal);
    document.getElementById('closeModalReabastecer').addEventListener('click', closeReabastecerModal);
    document.getElementById('guardarReabastecerBtn').addEventListener('click', saveReabastecimiento);
    document.getElementById('cancelarReabastecerBtn').addEventListener('click', closeReabastecerModal);
    
    // Eventos para el modal de uso
    document.getElementById('btnRegistrarUso').addEventListener('click', openUsoModal);
    document.getElementById('closeModalUso').addEventListener('click', closeUsoModal);
    document.getElementById('guardarUsoBtn').addEventListener('click', saveUso);
    document.getElementById('cancelarUsoBtn').addEventListener('click', closeUsoModal);
    
    // Eventos para exportar a Excel
    document.getElementById('exportInsumosBtn').addEventListener('click', () => exportToExcel('insumosTable', 'insumos_cafe'));
    document.getElementById('exportUsosBtn').addEventListener('click', () => exportToExcel('usosTable', 'usos_insumos_cafe'));
    document.getElementById('exportReabastecimientosBtn').addEventListener('click', () => exportToExcel('reabastecimientosTable', 'reabastecimientos_cafe'));

    document.getElementById('btnLimpiarDatos').addEventListener('click', limpiarBaseDeDatos);
}

function setupFormatListeners() {
    // Formato de moneda en tiempo real para los campos de valor
    document.getElementById('valorInsumo').addEventListener('blur', function() {
        const valor = parseFloat(this.value.replace(/[$.]/g, '').replace(',', '.'));
        if (!isNaN(valor)) {
            this.value = formatMonedaCOP(valor);
        }
    });
    
    document.getElementById('valorReabastecer').addEventListener('blur', function() {
        const valor = parseFloat(this.value.replace(/[$.]/g, '').replace(',', '.'));
        if (!isNaN(valor)) {
            this.value = formatMonedaCOP(valor);
        }
    });
}

// Y llamarla desde initApp:
function initApp() {
    // Código existente...
    renderInsumosTable();
    renderUsosTable();
    renderReabastecimientosTable();
    
    setupSearch();
    setupEventListeners();
    setupFormatListeners();
    
    updateInsumoSelect();
    updateReabastecerSelect();
    
    // AGREGAR: Botones para ir a registros más recientes (opcional)
    addGoToLatestButton();
}

// Función para limpiar datos de localStorage
function limpiarBaseDeDatos() {
  if (confirm('¿Estás seguro que deseas eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
    // Eliminar todos los datos relacionados con cafegest_db
    localStorage.removeItem(`${DB_NAME}_insumos`);
    localStorage.removeItem(`${DB_NAME}_usos`);
    localStorage.removeItem(`${DB_NAME}_reabastecimientos`);
    localStorage.removeItem(`${DB_NAME}_insumos_counter`);
    localStorage.removeItem(`${DB_NAME}_usos_counter`);
    localStorage.removeItem(`${DB_NAME}_reabastecimientos_counter`);
    
    // Reiniciar variables de datos
    insumos = [];
    usos = [];
    reabastecimientos = [];
    insumoIdCounter = 1;
    usoIdCounter = 1;
    reabastecimientoIdCounter = 1;
    
    // Actualizar la interfaz
    renderInsumosTable();
    renderUsosTable();
    renderReabastecimientosTable();
    updateInsumoSelect();
    updateReabastecerSelect();
    
    mostrarMensaje('success', 'Todos los datos han sido eliminados correctamente');
  }
}

// Inicialización de la aplicación
function initApp() {
    // Renderizar tablas
    renderInsumosTable();
    renderUsosTable();
    renderReabastecimientosTable();
    
    // Configurar búsquedas
    setupSearch();
    
    // Configurar eventos
    setupEventListeners();
    
    // Actualizar selectores de insumos
    updateInsumoSelect();
    updateReabastecerSelect();
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);