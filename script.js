// Pizarra Virtual - Sistema completo de dibujo y edición
class PizarraVirtual {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasOverlay = document.getElementById('canvasOverlay');
        
        // Estado de la aplicación
        this.currentTool = 'pencil';
        this.isDrawing = false;
        this.currentLayer = 0;
        this.layers = []; // Array de capas
        this.elements = []; // Elementos en el canvas
        this.selectedElement = null;
        
        // Configuración de herramientas
        this.toolConfig = {
            pencil: {
                size: 3,
                color: '#000000',
                type: 'normal', // normal, marker, brush
                opacity: 1
            },
            text: {
                font: 'Arial',
                size: 16,
                color: '#000000',
                style: 'normal' // normal, bold, italic
            },
            image: {
                opacity: 1,
                rotation: 0
            }
        };
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.initializeLayers();
        this.loadProjects();
        
        // Activar lápiz por defecto
        this.setTool('pencil');
        
        // Configurar event listeners para las opciones del lápiz
        this.setupInitialPencilListeners();
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
    }
    
    initializeLayers() {
        // Crear capa inicial
        this.layers = [
            {
                id: 0,
                name: 'Capa 1',
                visible: true,
                opacity: 1,
                elements: []
            }
        ];
    }
    
    setupInitialPencilListeners() {
        // Configurar event listeners para las opciones del lápiz que ya están en el HTML
        const pencilSize = document.getElementById('pencilSize');
        const pencilColor = document.getElementById('pencilColor');
        const pencilType = document.getElementById('pencilType');
        
        if (pencilSize) {
            pencilSize.addEventListener('input', (e) => {
                this.toolConfig.pencil.size = e.target.value;
                document.getElementById('pencilSizeValue').textContent = e.target.value + 'px';
            });
        }
        
        if (pencilColor) {
            pencilColor.addEventListener('change', (e) => {
                this.toolConfig.pencil.color = e.target.value;
            });
        }
        
        if (pencilType) {
            pencilType.addEventListener('change', (e) => {
                this.toolConfig.pencil.type = e.target.value;
            });
        }
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
        
        // Mostrar opciones de herramienta
        this.showToolOptions(tool);
        
        // Cambiar cursor
        this.updateCursor(tool);
    }
    
    showToolOptions(tool) {
        const subHeader = document.getElementById('subHeader');
        const toolOptions = document.getElementById('toolOptions');
        
        subHeader.classList.remove('hidden');
        
        let optionsHTML = '';
        
        switch(tool) {
            case 'pencil':
                optionsHTML = `
                    <div class="option-group">
                        <label>Grosor:</label>
                        <input type="range" id="pencilSize" min="1" max="20" value="${this.toolConfig.pencil.size}">
                        <span id="pencilSizeValue">${this.toolConfig.pencil.size}px</span>
                    </div>
                    <div class="option-group">
                        <label>Color:</label>
                        <input type="color" id="pencilColor" value="${this.toolConfig.pencil.color}">
                    </div>
                    <div class="option-group">
                        <label>Tipo:</label>
                        <select id="pencilType">
                            <option value="normal">Normal</option>
                            <option value="marker">Marcador</option>
                            <option value="brush">Pincel</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>Capa:</label>
                        <select id="pencilLayer">
                            ${this.layers.map(layer => 
                                `<option value="${layer.id}">${layer.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                `;
                break;
                
            case 'text':
                optionsHTML = `
                    <div class="option-group">
                        <label>Fuente:</label>
                        <select id="textFont">
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label>Tamaño:</label>
                        <input type="range" id="textSize" min="8" max="72" value="${this.toolConfig.text.size}">
                        <span id="textSizeValue">${this.toolConfig.text.size}px</span>
                    </div>
                    <div class="option-group">
                        <label>Color:</label>
                        <input type="color" id="textColor" value="${this.toolConfig.text.color}">
                    </div>
                    <div class="option-group">
                        <label>Estilo:</label>
                        <select id="textStyle">
                            <option value="normal">Normal</option>
                            <option value="bold">Negrita</option>
                            <option value="italic">Cursiva</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'image':
                optionsHTML = `
                    <div class="option-group">
                        <label>Subir imagen:</label>
                        <input type="file" id="imageInput" accept="image/*" style="display: none;">
                        <button onclick="document.getElementById('imageInput').click()">Seleccionar</button>
                    </div>
                    <div class="option-group">
                        <label>Opacidad:</label>
                        <input type="range" id="imageOpacity" min="0" max="1" step="0.1" value="${this.toolConfig.image.opacity}">
                        <span id="imageOpacityValue">${Math.round(this.toolConfig.image.opacity * 100)}%</span>
                    </div>
                `;
                break;
        }
        
        toolOptions.innerHTML = optionsHTML;
        
        // Agregar event listeners a las nuevas opciones
        this.setupToolOptionListeners(tool);
    }
    
    setupToolOptionListeners(tool) {
        switch(tool) {
            case 'pencil':
                const pencilSize = document.getElementById('pencilSize');
                const pencilColor = document.getElementById('pencilColor');
                const pencilType = document.getElementById('pencilType');
                
                if (pencilSize) {
                    pencilSize.addEventListener('input', (e) => {
                        this.toolConfig.pencil.size = e.target.value;
                        document.getElementById('pencilSizeValue').textContent = e.target.value + 'px';
                    });
                }
                
                if (pencilColor) {
                    pencilColor.addEventListener('change', (e) => {
                        this.toolConfig.pencil.color = e.target.value;
                    });
                }
                
                if (pencilType) {
                    pencilType.addEventListener('change', (e) => {
                        this.toolConfig.pencil.type = e.target.value;
                    });
                }
                break;
                
            case 'text':
                const textSize = document.getElementById('textSize');
                const textColor = document.getElementById('textColor');
                const textFont = document.getElementById('textFont');
                const textStyle = document.getElementById('textStyle');
                
                if (textSize) {
                    textSize.addEventListener('input', (e) => {
                        this.toolConfig.text.size = e.target.value;
                        document.getElementById('textSizeValue').textContent = e.target.value + 'px';
                    });
                }
                
                if (textColor) {
                    textColor.addEventListener('change', (e) => {
                        this.toolConfig.text.color = e.target.value;
                    });
                }
                
                if (textFont) {
                    textFont.addEventListener('change', (e) => {
                        this.toolConfig.text.font = e.target.value;
                    });
                }
                
                if (textStyle) {
                    textStyle.addEventListener('change', (e) => {
                        this.toolConfig.text.style = e.target.value;
                    });
                }
                break;
                
            case 'image':
                const imageInput = document.getElementById('imageInput');
                const imageOpacity = document.getElementById('imageOpacity');
                
                if (imageInput) {
                    imageInput.addEventListener('change', this.handleImageUpload.bind(this));
                }
                
                if (imageOpacity) {
                    imageOpacity.addEventListener('input', (e) => {
                        this.toolConfig.image.opacity = e.target.value;
                        document.getElementById('imageOpacityValue').textContent = Math.round(e.target.value * 100) + '%';
                    });
                }
                break;
        }
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
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.isDrawing = true;
        
        switch(this.currentTool) {
            case 'pencil':
                this.startDrawing(x, y);
                break;
            case 'text':
                this.addText(x, y);
                break;
        }
    }
    
    handleMouseMove(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch(this.currentTool) {
            case 'pencil':
                this.draw(x, y);
                break;
        }
    }
    
    handleMouseUp(e) {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }
    
    startDrawing(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // Configurar estilo según el tipo de lápiz
        this.ctx.lineWidth = this.toolConfig.pencil.size;
        this.ctx.strokeStyle = this.toolConfig.pencil.color;
        this.ctx.globalAlpha = this.toolConfig.pencil.opacity;
        
        switch(this.toolConfig.pencil.type) {
            case 'marker':
                this.ctx.lineCap = 'square';
                this.ctx.lineJoin = 'miter';
                break;
            case 'brush':
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.shadowBlur = 2;
                this.ctx.shadowColor = this.toolConfig.pencil.color;
                break;
            default:
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.shadowBlur = 0;
        }
    }
    
    draw(x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
    
    addText(x, y) {
        const text = prompt('Ingresa el texto:');
        if (text) {
            this.ctx.font = `${this.toolConfig.text.style} ${this.toolConfig.text.size}px ${this.toolConfig.text.font}`;
            this.ctx.fillStyle = this.toolConfig.text.color;
            this.ctx.fillText(text, x, y);
            
            // Agregar elemento a la lista
            this.elements.push({
                type: 'text',
                x: x,
                y: y,
                text: text,
                font: this.toolConfig.text.font,
                size: this.toolConfig.text.size,
                color: this.toolConfig.text.color,
                style: this.toolConfig.text.style,
                layer: this.currentLayer
            });
        }
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Agregar imagen al canvas
                    this.ctx.globalAlpha = this.toolConfig.image.opacity;
                    this.ctx.drawImage(img, 100, 100, img.width * 0.5, img.height * 0.5);
                    
                    // Agregar elemento a la lista
                    this.elements.push({
                        type: 'image',
                        x: 100,
                        y: 100,
                        width: img.width * 0.5,
                        height: img.height * 0.5,
                        src: event.target.result,
                        opacity: this.toolConfig.image.opacity,
                        layer: this.currentLayer
                    });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
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
            canvas: this.canvas.toDataURL(),
            elements: this.elements,
            layers: this.layers
        };
        
        // Guardar en localStorage
        const projects = JSON.parse(localStorage.getItem('pizarraProjects') || '[]');
        projects.push(project);
        localStorage.setItem('pizarraProjects', JSON.stringify(projects));
        
        // Actualizar lista de proyectos
        this.loadProjects();
        
        // Cerrar modal
        this.closeSaveModal();
        
        // Mostrar mensaje de éxito
        alert('Proyecto guardado exitosamente');
    }
    
    loadProjects() {
        const projects = JSON.parse(localStorage.getItem('pizarraProjects') || '[]');
        const projectsList = document.getElementById('projectsList');
        
        projectsList.innerHTML = projects.map(project => `
            <div class="project-item" onclick="pizarra.loadProject('${project.name}')">
                ${project.name}
            </div>
        `).join('');
    }
    
    loadProject(projectName) {
        const projects = JSON.parse(localStorage.getItem('pizarraProjects') || '[]');
        const project = projects.find(p => p.name === projectName);
        
        if (project) {
            // Limpiar canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Cargar imagen del canvas
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = project.canvas;
            
            // Cargar elementos y capas
            this.elements = project.elements || [];
            this.layers = project.layers || this.layers;
            
            // Actualizar nombre del proyecto
            document.getElementById('projectName').textContent = project.name;
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
                case 'z':
                    e.preventDefault();
                    // Implementar deshacer
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
        this.elements = [];
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
