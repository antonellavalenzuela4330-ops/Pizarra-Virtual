// Pizarra Virtual - Funcionalidad básica
class PizarraVirtual {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Estado de la aplicación
        this.currentTool = 'pencil';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Configuración del lápiz
        this.pencilConfig = {
            size: 3,
            color: '#000000',
            type: 'normal'
        };
        
        this.initializeCanvas();
        this.setupEventListeners();
    }
    
    initializeCanvas() {
        // Configurar canvas para alta resolución
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Configurar contexto
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Dibujar "PIZARRA" en el centro
        this.drawPizarraText();
    }
    
    drawPizarraText() {
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PIZARRA', this.canvas.width / 2 / (window.devicePixelRatio || 1), this.canvas.height / 2 / (window.devicePixelRatio || 1));
    }
    
    setupEventListeners() {
        // Eventos del canvas
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
        
        // Eventos de herramientas
        document.getElementById('pencilTool').addEventListener('click', () => this.setTool('pencil'));
        document.getElementById('textTool').addEventListener('click', () => this.setTool('text'));
        document.getElementById('imageTool').addEventListener('click', () => this.setTool('image'));
        document.getElementById('documentTool').addEventListener('click', () => this.openDocumentModal());
        
        // Eventos de menú
        document.getElementById('menuBtn').addEventListener('click', this.toggleSidebar.bind(this));
        document.getElementById('saveBtn').addEventListener('click', this.openSaveModal.bind(this));
        document.getElementById('helpBtn').addEventListener('click', this.openTutorialModal.bind(this));
        
        // Eventos de modales
        document.getElementById('closeTutorial').addEventListener('click', this.closeTutorialModal.bind(this));
        document.getElementById('closeDocument').addEventListener('click', this.closeDocumentModal.bind(this));
        document.getElementById('closeSave').addEventListener('click', this.closeSaveModal.bind(this));
        document.getElementById('saveProjectBtn').addEventListener('click', this.saveProject.bind(this));
        document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
        
        // Evento de archivo
        document.getElementById('fileInput').addEventListener('change', this.handleFileUpload.bind(this));
        
        // Eventos de teclado
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Redimensionamiento de ventana
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // Actualizar botones activos
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tool + 'Tool').classList.add('active');
        
        // Actualizar título de opciones
        const optionsTitle = document.querySelector('.options-title');
        switch(tool) {
            case 'pencil':
                optionsTitle.textContent = 'Opciones Lapiz';
                break;
            case 'text':
                optionsTitle.textContent = 'Opciones de texto';
                break;
            case 'image':
                optionsTitle.textContent = 'opciones imagen';
                break;
        }
        
        // Cambiar cursor
        this.updateCursor(tool);
    }
    
    updateCursor(tool) {
        switch(tool) {
            case 'pencil':
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'text':
                this.canvas.style.cursor = 'text';
                break;
            case 'image':
                this.canvas.style.cursor = 'default';
                break;
            default:
                this.canvas.style.cursor = 'default';
        }
    }
    
    handleMouseDown(e) {
        if (this.currentTool === 'pencil') {
            this.isDrawing = true;
            const rect = this.canvas.getBoundingClientRect();
            this.lastX = e.clientX - rect.left;
            this.lastY = e.clientY - rect.top;
            
            // Configurar estilo del lápiz
            this.ctx.lineWidth = this.pencilConfig.size;
            this.ctx.strokeStyle = this.pencilConfig.color;
            this.ctx.globalAlpha = 1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
        }
    }
    
    handleMouseMove(e) {
        if (this.isDrawing && this.currentTool === 'pencil') {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
            
            this.lastX = currentX;
            this.lastY = currentY;
        }
    }
    
    handleMouseUp(e) {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        sidebar.classList.toggle('open');
        mainContent.classList.toggle('sidebar-open');
    }
    
    openTutorialModal() {
        document.getElementById('tutorialModal').classList.add('active');
    }
    
    closeTutorialModal() {
        document.getElementById('tutorialModal').classList.remove('active');
    }
    
    openDocumentModal() {
        document.getElementById('documentModal').classList.add('active');
    }
    
    closeDocumentModal() {
        document.getElementById('documentModal').classList.remove('active');
    }
    
    openSaveModal() {
        document.getElementById('saveModal').classList.add('active');
    }
    
    closeSaveModal() {
        document.getElementById('saveModal').classList.remove('active');
    }
    
    saveProject() {
        const projectName = document.getElementById('projectNameInput').value || 'Proyecto sin nombre';
        
        // Crear objeto del proyecto
        const project = {
            name: projectName,
            date: new Date().toISOString(),
            canvas: this.canvas.toDataURL()
        };
        
        // Guardar en localStorage
        const projects = JSON.parse(localStorage.getItem('pizarraProjects') || '[]');
        projects.push(project);
        localStorage.setItem('pizarraProjects', JSON.stringify(projects));
        
        // Actualizar nombre del proyecto en el header
        document.getElementById('projectName').textContent = projectName;
        
        // Cerrar modal
        this.closeSaveModal();
        
        // Mostrar mensaje de éxito
        alert('Proyecto guardado exitosamente');
    }
    
    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Simular visualización de documento
                const documentPages = document.getElementById('documentPages');
                documentPages.innerHTML = `
                    <div class="document-page">
                        <h4>Página 1 - ${file.name}</h4>
                        <p>Contenido del documento cargado...</p>
                        <p>Aquí se mostraría el contenido del archivo PDF o Word.</p>
                    </div>
                `;
            };
            reader.readAsText(file);
        }
    }
    
    handleKeyDown(e) {
        // Atajos de teclado
        if (e.ctrlKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    this.openSaveModal();
                    break;
            }
        }
        
        // Tecla Escape para cerrar modales
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    }
    
    handleResize() {
        this.initializeCanvas();
    }
    
    // Método para limpiar el canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPizarraText();
    }
    
    // Método para exportar como imagen
    exportAsImage() {
        const link = document.createElement('a');
        link.download = 'pizarra-virtual.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Inicializar la aplicación cuando se carga la página
let pizarra;
document.addEventListener('DOMContentLoaded', () => {
    pizarra = new PizarraVirtual();
});

// Funciones globales para uso en HTML
function clearCanvas() {
    if (pizarra) {
        pizarra.clearCanvas();
    }
}

function exportCanvas() {
    if (pizarra) {
        pizarra.exportAsImage();
    }
}