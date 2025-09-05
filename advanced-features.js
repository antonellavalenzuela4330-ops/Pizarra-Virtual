// Funcionalidades avanzadas para la Pizarra Virtual
class AdvancedFeatures {
    constructor(pizarra) {
        this.pizarra = pizarra;
        this.setupAdvancedFeatures();
    }
    
    setupAdvancedFeatures() {
        this.setupLayerSystem();
        this.setupElementManipulation();
        this.setupShapeTools();
        this.setupPerformanceOptimizations();
    }
    
    setupLayerSystem() {
        // Crear panel de capas
        this.createLayerPanel();
    }
    
    createLayerPanel() {
        const layerPanel = document.createElement('div');
        layerPanel.className = 'layer-panel';
        layerPanel.innerHTML = `
            <h3>Capas</h3>
            <div class="layers-list" id="layersList"></div>
            <button class="add-layer-btn" id="addLayerBtn">+ Nueva Capa</button>
        `;
        
        // Agregar estilos para el panel de capas
        const style = document.createElement('style');
        style.textContent = `
            .layer-panel {
                position: fixed;
                right: 20px;
                top: 120px;
                width: 200px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            
            .layer-item {
                display: flex;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .layer-item:hover {
                background-color: #f7fafc;
            }
            
            .layer-item.active {
                background-color: #e6fffa;
                border: 1px solid #38b2ac;
            }
            
            .layer-visibility {
                margin-right: 8px;
                cursor: pointer;
            }
            
            .layer-name {
                flex: 1;
                font-size: 14px;
            }
            
            .layer-opacity {
                width: 60px;
                margin: 0 8px;
            }
            
            .add-layer-btn {
                width: 100%;
                padding: 8px;
                background-color: #4299e1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            }
            
            .add-layer-btn:hover {
                background-color: #3182ce;
            }
        `;
        document.head.appendChild(style);
        
        // Agregar el panel al DOM
        document.body.appendChild(layerPanel);
        
        // Event listeners
        document.getElementById('addLayerBtn').addEventListener('click', this.addLayer.bind(this));
        
        this.updateLayerPanel();
    }
    
    addLayer() {
        const newLayer = {
            id: Date.now(),
            name: `Capa ${this.pizarra.layers.length + 1}`,
            visible: true,
            opacity: 1,
            elements: []
        };
        
        this.pizarra.layers.push(newLayer);
        this.updateLayerPanel();
    }
    
    updateLayerPanel() {
        const layersList = document.getElementById('layersList');
        layersList.innerHTML = this.pizarra.layers.map(layer => `
            <div class="layer-item ${layer.id === this.pizarra.currentLayer ? 'active' : ''}" 
                 data-layer-id="${layer.id}">
                <span class="layer-visibility" onclick="event.stopPropagation(); advancedFeatures.toggleLayerVisibility(${layer.id})">
                    ${layer.visible ? '👁️' : '🙈'}
                </span>
                <span class="layer-name" onclick="advancedFeatures.selectLayer(${layer.id})">${layer.name}</span>
                <input type="range" class="layer-opacity" min="0" max="1" step="0.1" 
                       value="${layer.opacity}" 
                       onchange="advancedFeatures.setLayerOpacity(${layer.id}, this.value)">
            </div>
        `).join('');
    }
    
    selectLayer(layerId) {
        this.pizarra.currentLayer = layerId;
        this.updateLayerPanel();
    }
    
    toggleLayerVisibility(layerId) {
        const layer = this.pizarra.layers.find(l => l.id === layerId);
        if (layer) {
            layer.visible = !layer.visible;
            this.updateLayerPanel();
            this.pizarra.redrawCanvas();
        }
    }
    
    setLayerOpacity(layerId, opacity) {
        const layer = this.pizarra.layers.find(l => l.id === layerId);
        if (layer) {
            layer.opacity = parseFloat(opacity);
            this.pizarra.redrawCanvas();
        }
    }
    
    setupElementManipulation() {
        // Agregar funcionalidad para seleccionar, mover, redimensionar y rotar elementos
        this.setupElementSelection();
        this.setupElementTransformation();
    }
    
    setupElementSelection() {
        // Implementar selección de elementos con clic
        this.pizarra.canvas.addEventListener('click', (e) => {
            if (this.pizarra.currentTool === 'select') {
                this.selectElement(e);
            }
        });
    }
    
    selectElement(e) {
        const rect = this.pizarra.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Buscar elemento en la posición del clic
        for (let i = this.pizarra.elements.length - 1; i >= 0; i--) {
            const element = this.pizarra.elements[i];
            if (this.isPointInElement(x, y, element)) {
                this.pizarra.selectedElement = element;
                this.showElementHandles(element);
                break;
            }
        }
    }
    
    isPointInElement(x, y, element) {
        switch(element.type) {
            case 'text':
                return x >= element.x && x <= element.x + element.width && 
                       y >= element.y - element.size && y <= element.y;
            case 'image':
                return x >= element.x && x <= element.x + element.width && 
                       y >= element.y && y <= element.y + element.height;
            default:
                return false;
        }
    }
    
    showElementHandles(element) {
        // Crear handles para redimensionar y rotar
        this.createElementHandles(element);
    }
    
    createElementHandles(element) {
        // Implementar handles visuales para manipulación
        const handles = document.createElement('div');
        handles.className = 'element-handles';
        handles.style.position = 'absolute';
        handles.style.left = element.x + 'px';
        handles.style.top = element.y + 'px';
        handles.style.width = element.width + 'px';
        handles.style.height = element.height + 'px';
        handles.style.border = '2px solid #4299e1';
        handles.style.pointerEvents = 'none';
        
        // Agregar handles de redimensionamiento
        const resizeHandles = ['nw', 'ne', 'sw', 'se'];
        resizeHandles.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            handle.style.position = 'absolute';
            handle.style.width = '8px';
            handle.style.height = '8px';
            handle.style.background = '#4299e1';
            handle.style.border = '1px solid white';
            handle.style.borderRadius = '50%';
            handle.style.cursor = this.getResizeCursor(position);
            
            // Posicionar handle
            switch(position) {
                case 'nw': handle.style.left = '-4px'; handle.style.top = '-4px'; break;
                case 'ne': handle.style.right = '-4px'; handle.style.top = '-4px'; break;
                case 'sw': handle.style.left = '-4px'; handle.style.bottom = '-4px'; break;
                case 'se': handle.style.right = '-4px'; handle.style.bottom = '-4px'; break;
            }
            
            handles.appendChild(handle);
        });
        
        // Agregar handle de rotación
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        rotateHandle.style.position = 'absolute';
        rotateHandle.style.left = '50%';
        rotateHandle.style.top = '-20px';
        rotateHandle.style.transform = 'translateX(-50%)';
        rotateHandle.style.width = '12px';
        rotateHandle.style.height = '12px';
        rotateHandle.style.background = '#4299e1';
        rotateHandle.style.border = '1px solid white';
        rotateHandle.style.borderRadius = '50%';
        rotateHandle.style.cursor = 'grab';
        
        handles.appendChild(rotateHandle);
        
        // Agregar al overlay del canvas
        this.pizarra.canvasOverlay.appendChild(handles);
    }
    
    getResizeCursor(position) {
        const cursors = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize'
        };
        return cursors[position] || 'default';
    }
    
    setupElementTransformation() {
        // Implementar transformaciones de elementos
        this.setupDragAndDrop();
        this.setupResizeHandles();
        this.setupRotationHandles();
    }
    
    setupDragAndDrop() {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        this.pizarra.canvas.addEventListener('mousedown', (e) => {
            if (this.pizarra.selectedElement) {
                isDragging = true;
                const rect = this.pizarra.canvas.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left - this.pizarra.selectedElement.x;
                dragOffset.y = e.clientY - rect.top - this.pizarra.selectedElement.y;
            }
        });
        
        this.pizarra.canvas.addEventListener('mousemove', (e) => {
            if (isDragging && this.pizarra.selectedElement) {
                const rect = this.pizarra.canvas.getBoundingClientRect();
                this.pizarra.selectedElement.x = e.clientX - rect.left - dragOffset.x;
                this.pizarra.selectedElement.y = e.clientY - rect.top - dragOffset.y;
                this.pizarra.redrawCanvas();
            }
        });
        
        this.pizarra.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    setupResizeHandles() {
        // Implementar redimensionamiento de elementos
        // (Código simplificado para el ejemplo)
    }
    
    setupRotationHandles() {
        // Implementar rotación de elementos
        // (Código simplificado para el ejemplo)
    }
    
    setupShapeTools() {
        // Agregar herramientas de formas geométricas
        this.addShapeToolbar();
    }
    
    addShapeToolbar() {
        const shapeToolbar = document.createElement('div');
        shapeToolbar.className = 'shape-toolbar';
        shapeToolbar.innerHTML = `
            <button class="shape-btn" data-shape="rectangle">⬜</button>
            <button class="shape-btn" data-shape="circle">⭕</button>
            <button class="shape-btn" data-shape="triangle">🔺</button>
            <button class="shape-btn" data-shape="line">📏</button>
        `;
        
        // Agregar estilos
        const style = document.createElement('style');
        style.textContent += `
            .shape-toolbar {
                position: fixed;
                bottom: 80px;
                left: 20px;
                display: flex;
                gap: 10px;
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            
            .shape-btn {
                width: 40px;
                height: 40px;
                border: 1px solid #e2e8f0;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                transition: background-color 0.2s;
            }
            
            .shape-btn:hover {
                background-color: #f7fafc;
            }
            
            .shape-btn.active {
                background-color: #4299e1;
                color: white;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(shapeToolbar);
        
        // Event listeners para formas
        shapeToolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('shape-btn')) {
                const shape = e.target.dataset.shape;
                this.setShapeTool(shape);
            }
        });
    }
    
    setShapeTool(shape) {
        this.pizarra.currentTool = 'shape';
        this.pizarra.currentShape = shape;
        
        // Actualizar botones activos
        document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-shape="${shape}"]`).classList.add('active');
    }
    
    setupPerformanceOptimizations() {
        // Implementar optimizaciones de rendimiento
        this.setupCanvasOptimization();
        this.setupMemoryManagement();
    }
    
    setupCanvasOptimization() {
        // Optimizar el canvas para mejor rendimiento
        this.pizarra.ctx.imageSmoothingEnabled = true;
        this.pizarra.ctx.imageSmoothingQuality = 'high';
        
        // Implementar doble buffering
        this.createOffscreenCanvas();
    }
    
    createOffscreenCanvas() {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.offscreenCanvas.width = this.pizarra.canvas.width;
        this.offscreenCanvas.height = this.pizarra.canvas.height;
    }
    
    setupMemoryManagement() {
        // Limpiar memoria periódicamente
        setInterval(() => {
            this.cleanupMemory();
        }, 30000); // Cada 30 segundos
    }
    
    cleanupMemory() {
        // Limpiar elementos no utilizados
        if (this.pizarra.elements.length > 1000) {
            this.pizarra.elements = this.pizarra.elements.slice(-500);
        }
    }
    
    // Método para redibujar el canvas
    redrawCanvas() {
        this.pizarra.ctx.clearRect(0, 0, this.pizarra.canvas.width, this.pizarra.canvas.height);
        
        // Redibujar elementos por capas
        this.pizarra.layers.forEach(layer => {
            if (layer.visible) {
                this.pizarra.ctx.globalAlpha = layer.opacity;
                layer.elements.forEach(element => {
                    this.drawElement(element);
                });
            }
        });
        
        this.pizarra.ctx.globalAlpha = 1;
    }
    
    drawElement(element) {
        switch(element.type) {
            case 'text':
                this.pizarra.ctx.font = `${element.style} ${element.size}px ${element.font}`;
                this.pizarra.ctx.fillStyle = element.color;
                this.pizarra.ctx.fillText(element.text, element.x, element.y);
                break;
            case 'image':
                const img = new Image();
                img.onload = () => {
                    this.pizarra.ctx.drawImage(img, element.x, element.y, element.width, element.height);
                };
                img.src = element.src;
                break;
        }
    }
}

// Extender la clase PizarraVirtual con métodos adicionales
PizarraVirtual.prototype.redrawCanvas = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Redibujar elementos
    this.elements.forEach(element => {
        this.drawElement(element);
    });
};

PizarraVirtual.prototype.drawElement = function(element) {
    switch(element.type) {
        case 'text':
            this.ctx.font = `${element.style} ${element.size}px ${element.font}`;
            this.ctx.fillStyle = element.color;
            this.ctx.fillText(element.text, element.x, element.y);
            break;
        case 'image':
            const img = new Image();
            img.onload = () => {
                this.ctx.globalAlpha = element.opacity;
                this.ctx.drawImage(img, element.x, element.y, element.width, element.height);
                this.ctx.globalAlpha = 1;
            };
            img.src = element.src;
            break;
    }
};

// Inicializar funcionalidades avanzadas
let advancedFeatures;
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que se inicialice la pizarra principal
    setTimeout(() => {
        if (pizarra) {
            advancedFeatures = new AdvancedFeatures(pizarra);
        }
    }, 100);
});
