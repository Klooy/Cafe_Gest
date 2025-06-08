// Almacenamiento Local
const DB_NAME = 'cafegest_db';

// Estructura de datos
let facturasVenta = JSON.parse(localStorage.getItem(`${DB_NAME}_facturas`)) || [];
let idCounter = parseInt(localStorage.getItem(`${DB_NAME}_facturas_counter`)) || 1;

// Configuración para el sistema de contraseña
const ADMIN_PASSWORD = "cafe2025"; // Contraseña predeterminada (recomendamos cambiarla)
let intentosFallidos = parseInt(localStorage.getItem(`${DB_NAME}_facturas_intentos_fallidos`)) || 0;
let tiempoBloqueado = localStorage.getItem(`${DB_NAME}_facturas_tiempo_bloqueado`) || null;

// Elementos DOM
const facturaForm = document.getElementById('facturaForm');
const facturasTableBody = document.getElementById('facturasTableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const messageBox = document.getElementById('messageBox');
const pdfModal = document.getElementById('pdfModal');
const closeModal = document.getElementById('closeModal');
const cerrarModalBtn = document.getElementById('cerrarModalBtn');
const descargarPdfBtn = document.getElementById('descargarPdfBtn');
const facturaPreview = document.getElementById('facturaPreview');

// Función para formatear moneda en pesos colombianos
function formatearMonedaCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

// Establecer fecha actual en el campo de fecha - CORREGIDO PARA PROBLEMAS DE ZONA HORARIA
function setFechaActual() {
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0];
    document.getElementById('fechaVenta').value = fechaFormateada;
}

// Establecer fecha actual al cargar
setFechaActual();

// Funciones para gestionar datos
function guardarDatos() {
    localStorage.setItem(`${DB_NAME}_facturas`, JSON.stringify(facturasVenta));
    localStorage.setItem(`${DB_NAME}_facturas_counter`, idCounter.toString());
    // Guardar también los intentos fallidos
    localStorage.setItem(`${DB_NAME}_facturas_intentos_fallidos`, intentosFallidos.toString());
    if (tiempoBloqueado) {
        localStorage.setItem(`${DB_NAME}_facturas_tiempo_bloqueado`, tiempoBloqueado);
    } else {
        localStorage.removeItem(`${DB_NAME}_facturas_tiempo_bloqueado`);
    }
}

// Variables para paginación
let paginaActual = 1;
const registrosPorPagina = 10;
let datosActuales = []; // Para almacenar los datos filtrados

function cargarTabla(datos = facturasVenta) {
    // Ordenar por ID descendente para mostrar los más recientes primero
    datosActuales = [...datos].sort((a, b) => b.id - a.id);
    
    // Calcular datos para la página actual
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const datosPagina = datosActuales.slice(inicio, fin);
    
    // Limpiar tabla
    facturasTableBody.innerHTML = '';
    
    if (datosActuales.length === 0) {
        emptyState.style.display = 'block';
        actualizarPaginador();
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Cargar datos de la página actual
    datosPagina.forEach(item => {
        const fechaMostrar = formatearFechaParaMostrar(item.fechaVenta);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombreVendedor}</td>
            <td>${item.nombreCliente}</td>
            <td>${item.cantidad}</td>
            <td>${item.unidad}</td>
            <td>${fechaMostrar}</td>
            <td>${formatearMonedaCOP(item.precioVenta)}</td>
            <td class="table-actions">
                <button class="btn-icon btn-pdf-small" onclick="generarPDF(${item.id})">
                    <i class="fas fa-file-pdf"></i>
                </button>
                <button class="btn-icon btn-edit" onclick="verificarPassword('editar', ${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="verificarPassword('eliminar', ${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        facturasTableBody.appendChild(row);
    });
    
    // Actualizar paginador
    actualizarPaginador();
}

// Función para actualizar el paginador
function actualizarPaginador() {
    const totalPaginas = Math.ceil(datosActuales.length / registrosPorPagina);
    const paginadorContainer = document.getElementById('paginadorContainer');
    
    if (!paginadorContainer) {
        // Crear el contenedor del paginador si no existe
        crearPaginadorHTML();
        return actualizarPaginador();
    }
    
    // Limpiar paginador actual
    paginadorContainer.innerHTML = '';
    
    if (totalPaginas <= 1) {
        // No mostrar paginador si solo hay una página o menos
        return;
    }
    
    // Información de registros
    const inicio = (paginaActual - 1) * registrosPorPagina + 1;
    const fin = Math.min(paginaActual * registrosPorPagina, datosActuales.length);
    
    const infoRegistros = document.createElement('div');
    infoRegistros.className = 'pagination-info';
    infoRegistros.innerHTML = `
        Mostrando ${inicio} a ${fin} de ${datosActuales.length} registros
    `;
    
    // Controles de paginación
    const controlesPaginacion = document.createElement('div');
    controlesPaginacion.className = 'pagination-controls';
    
    // Botón anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.className = `pagination-btn ${paginaActual === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i> Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => cambiarPagina(paginaActual - 1);
    
    // Números de página
    const numerosContainer = document.createElement('div');
    numerosContainer.className = 'pagination-numbers';
    
    // Lógica para mostrar números de página
    let inicioRango = Math.max(1, paginaActual - 2);
    let finRango = Math.min(totalPaginas, paginaActual + 2);
    
    // Ajustar rango si estamos cerca del inicio o final
    if (finRango - inicioRango < 4) {
        if (inicioRango === 1) {
            finRango = Math.min(totalPaginas, inicioRango + 4);
        } else if (finRango === totalPaginas) {
            inicioRango = Math.max(1, finRango - 4);
        }
    }
    
    // Primera página si no está en el rango
    if (inicioRango > 1) {
        const btn1 = crearBotonPagina(1);
        numerosContainer.appendChild(btn1);
        
        if (inicioRango > 2) {
            const puntos = document.createElement('span');
            puntos.className = 'pagination-dots';
            puntos.textContent = '...';
            numerosContainer.appendChild(puntos);
        }
    }
    
    // Páginas en el rango
    for (let i = inicioRango; i <= finRango; i++) {
        const btnPagina = crearBotonPagina(i);
        numerosContainer.appendChild(btnPagina);
    }
    
    // Última página si no está en el rango
    if (finRango < totalPaginas) {
        if (finRango < totalPaginas - 1) {
            const puntos = document.createElement('span');
            puntos.className = 'pagination-dots';
            puntos.textContent = '...';
            numerosContainer.appendChild(puntos);
        }
        
        const btnUltima = crearBotonPagina(totalPaginas);
        numerosContainer.appendChild(btnUltima);
    }
    
    // Botón siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.className = `pagination-btn ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    btnSiguiente.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => cambiarPagina(paginaActual + 1);
    
    // Ensamblar controles
    controlesPaginacion.appendChild(btnAnterior);
    controlesPaginacion.appendChild(numerosContainer);
    controlesPaginacion.appendChild(btnSiguiente);
    
    // Agregar al contenedor
    paginadorContainer.appendChild(infoRegistros);
    paginadorContainer.appendChild(controlesPaginacion);
}

// Función para crear botón de página
function crearBotonPagina(numeroPagina) {
    const btn = document.createElement('button');
    btn.className = `pagination-number ${numeroPagina === paginaActual ? 'active' : ''}`;
    btn.textContent = numeroPagina;
    btn.onclick = () => cambiarPagina(numeroPagina);
    return btn;
}

// Función para cambiar página
function cambiarPagina(nuevaPagina) {
    const totalPaginas = Math.ceil(datosActuales.length / registrosPorPagina);
    
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
        return;
    }
    
    paginaActual = nuevaPagina;
    cargarTabla(datosActuales.length === facturasVenta.length ? facturasVenta : datosActuales);
}

// Función para crear el HTML del paginador
function crearPaginadorHTML() {
    // Buscar dónde insertar el paginador (después de la tabla)
    const tabla = document.querySelector('.table-container');
    
    if (tabla && !document.getElementById('paginadorContainer')) {
        const paginadorContainer = document.createElement('div');
        paginadorContainer.id = 'paginadorContainer';
        paginadorContainer.className = 'pagination-container';
        
        // Insertar después de la tabla
        tabla.parentNode.insertBefore(paginadorContainer, tabla.nextSibling);
    }
}

// Función auxiliar para formatear fechas correctamente
function formatearFechaParaMostrar(fechaStr) {
    // Asegurar que la fecha se interprete en la zona horaria local
    const fecha = new Date(fechaStr + 'T12:00:00'); // Agregar mediodía para evitar problemas de zona horaria
    return fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function mostrarMensaje(tipo, mensaje) {
    messageBox.className = `message ${tipo}`;
    messageBox.innerText = mensaje;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

// Función para procesar el formulario
function procesarFormulario() {
    const nombreVendedor = document.getElementById('nombreVendedor').value;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const unidad = document.getElementById('unidad').value;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const fechaVenta = document.getElementById('fechaVenta').value;
    
    const editId = facturaForm.dataset.editId;
    
    if (editId) {
        // Editar existente
        const index = facturasVenta.findIndex(item => item.id === parseInt(editId));
        if (index !== -1) {
            facturasVenta[index] = {
                ...facturasVenta[index],
                nombreVendedor,
                nombreCliente,
                cantidad,
                unidad,
                precioVenta,
                fechaVenta
            };
            
            mostrarMensaje('success', 'Factura actualizada con éxito');
        }
        
        // Limpiar modo edición
        facturaForm.removeAttribute('data-edit-id');
        const guardarBtn = document.getElementById('guardarBtn');
        if (guardarBtn) {
            guardarBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Factura';
        }
    } else {
        // Crear nuevo
        const nuevaFactura = {
            id: idCounter++,
            nombreVendedor,
            nombreCliente,
            cantidad,
            unidad,
            precioVenta,
            fechaVenta
        };
        
        facturasVenta.push(nuevaFactura);
        mostrarMensaje('success', 'Factura guardada con éxito');
    }
    
    guardarDatos();
    irAPrimeraPagina(); // Ir a la primera página para ver el nuevo/editado registro
    facturaForm.reset();
    setFechaActual();
}

// Eventos del formulario
facturaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    procesarFormulario();
});

// Botón guardar
document.getElementById('guardarBtn').addEventListener('click', function() {
    procesarFormulario();
});

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
                editarFactura(id);
            } else if (accion === 'eliminar') {
                eliminarFactura(id);
            }
        } else {
            // Contraseña incorrecta
            intentosFallidos++;
            guardarDatos();
            
            if (intentosFallidos >= 3) {
                // Bloquear el sistema por 10 minutos
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

// Función para editar (modificada para usar el sistema de contraseña)
function editarFactura(id) {
    const factura = facturasVenta.find(item => item.id === id);
    if (!factura) return;
    
    document.getElementById('nombreVendedor').value = factura.nombreVendedor;
    document.getElementById('nombreCliente').value = factura.nombreCliente;
    document.getElementById('cantidad').value = factura.cantidad;
    document.getElementById('unidad').value = factura.unidad;
    document.getElementById('precioVenta').value = factura.precioVenta;
    document.getElementById('fechaVenta').value = factura.fechaVenta;
    
    facturaForm.dataset.editId = id;
    const guardarBtn = document.getElementById('guardarBtn');
    if (guardarBtn) {
        guardarBtn.innerHTML = '<i class="fas fa-check"></i> Actualizar Factura';
    }
    
    // Scroll to form
    facturaForm.scrollIntoView({ behavior: 'smooth' });
}

// Función para eliminar (modificada para usar el sistema de contraseña)
function eliminarFactura(id) {
    if (confirm('¿Está seguro de eliminar esta factura?')) {
        facturasVenta = facturasVenta.filter(item => item.id !== id);
        guardarDatos();
        
        // Ajustar página actual si es necesario
        const totalPaginas = Math.ceil(facturasVenta.length / registrosPorPagina);
        if (paginaActual > totalPaginas && totalPaginas > 0) {
            paginaActual = totalPaginas;
        } else if (facturasVenta.length === 0) {
            paginaActual = 1;
        }
        
        cargarTabla();
        mostrarMensaje('success', 'Factura eliminada con éxito');
    }
}

// Búsqueda
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    // Resetear a la primera página al buscar
    paginaActual = 1;
    
    if (!searchTerm) {
        cargarTabla();
        return;
    }
    
    const filteredData = facturasVenta.filter(item => 
        item.nombreVendedor.toLowerCase().includes(searchTerm) ||
        item.nombreCliente.toLowerCase().includes(searchTerm) ||
        item.unidad.toLowerCase().includes(searchTerm) ||
        formatearFechaParaMostrar(item.fechaVenta).includes(searchTerm)
    );
    
    cargarTabla(filteredData);
});

// Función para ir a la primera página después de operaciones CRUD
function irAPrimeraPagina() {
    paginaActual = 1;
    cargarTabla();
}

// Exportar a Excel
exportBtn.addEventListener('click', function() {
    if (facturasVenta.length === 0) {
        mostrarMensaje('error', 'No hay datos para exportar');
        return;
    }
    
    // Preparar datos para Excel
    const excelData = facturasVenta.map(item => ({
        'ID': item.id,
        'Vendedor': item.nombreVendedor,
        'Cliente': item.nombreCliente,
        'Cantidad': item.cantidad,
        'Unidad': item.unidad,
        'Fecha': formatearFechaParaMostrar(item.fechaVenta),
        'Precio Venta': formatearMonedaCOP(item.precioVenta)
    }));
    
    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas de Venta');
    
    // Guardar archivo
    const fileName = `Facturas_Venta_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    mostrarMensaje('success', 'Datos exportados a Excel correctamente');
});

// Función para generar PDF de una factura
function generarPDF(id) {
    const factura = facturasVenta.find(item => item.id === id);
    if (!factura) return;
    
    // Formatear la fecha correctamente
    const fechaMostrar = formatearFechaParaMostrar(factura.fechaVenta);
    
    // Preparar vista previa del PDF
    facturaPreview.innerHTML = `
        <div class="factura-header">
            <div class="factura-logo">
                <i class="fas fa-coffee"></i>
                <div class="factura-logo-text">CaféGest</div>
            </div>
            <div class="factura-info">
                <h3>FACTURA DE VENTA</h3>
                <p>Nº: ${factura.id}</p>
                <p>Fecha: ${fechaMostrar}</p>
            </div>
        </div>
        
        <div class="factura-detalles">
            <div class="factura-detalles-grid">
                <div>
                    <div class="factura-item"><span>Vendedor:</span> ${factura.nombreVendedor}</div>
                    <div class="factura-item"><span>Cliente:</span> ${factura.nombreCliente}</div>
                </div>
                <div>
                    <div class="factura-item"><span>Cantidad:</span> ${factura.cantidad} ${factura.unidad}</div>
                </div>
            </div>
        </div>
        
        <table style="width: 100%; margin-top: 24px; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #fffbeb;">
                    <th style="padding: 8px; text-align: left; border-bottom: 1px solid #d6d3d1;">Descripción</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #d6d3d1;">Cantidad</th>
                    <th style="padding: 8px; text-align: right; border-bottom: 1px solid #d6d3d1;">Precio Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #d6d3d1;">Café</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #d6d3d1;">${factura.cantidad} ${factura.unidad}</td>
                    <td style="padding: 8px; text-align: right; border-bottom: 1px solid #d6d3d1;">${formatearMonedaCOP(factura.precioVenta)}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="factura-total">
            <p>TOTAL: ${formatearMonedaCOP(factura.precioVenta)}</p>
        </div>
        
        <div class="factura-footer">
            <p>Gracias por su compra</p>
            <p><small>CaféGest - Sistema de Gestión para Caficultores</small></p>
        </div>
    `;
    
    // Mostrar modal con la vista previa
    pdfModal.style.display = 'block';
    
    // Configurar el botón de descarga
    descargarPdfBtn.onclick = function() {
        // Crear instancia de jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Capturar la vista previa como imagen
        html2canvas(facturaPreview, {
            scale: 2, // Mejor calidad
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            // Añadir la primera página
            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Si hay más contenido, añadir páginas adicionales
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Guardar el PDF
            doc.save(`Factura_${factura.id}_${factura.nombreCliente.replace(/\s+/g, '_')}.pdf`);
            mostrarMensaje('success', 'PDF generado correctamente');
        });
    };
}

// Eventos para el modal de PDF
closeModal.addEventListener('click', function() {
    pdfModal.style.display = 'none';
});

cerrarModalBtn.addEventListener('click', function() {
    pdfModal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target === pdfModal) {
        pdfModal.style.display = 'none';
    }
});

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos desde localStorage primero
    facturasVenta = JSON.parse(localStorage.getItem(`${DB_NAME}_facturas`)) || [];
    idCounter = parseInt(localStorage.getItem(`${DB_NAME}_facturas_counter`)) || 1;
    
    // Cargar también los datos de intentos fallidos y tiempo bloqueado
    intentosFallidos = parseInt(localStorage.getItem(`${DB_NAME}_facturas_intentos_fallidos`)) || 0;
    tiempoBloqueado = localStorage.getItem(`${DB_NAME}_facturas_tiempo_bloqueado`) || null;
    
    // Establecer fecha actual en el campo de fecha (manera mejorada)
    setFechaActual();
    
    // Cargar la tabla con los datos
    cargarTabla();
    
    console.log("Datos cargados:", facturasVenta.length, "facturas");
});