# Pizarra Virtual

Una aplicación web completa de pizarra virtual con herramientas avanzadas de dibujo, edición de texto, manipulación de imágenes y gestión de proyectos.

## Características Principales

### 🎨 Herramientas de Dibujo
- **Lápiz**: Múltiples tipos (normal, marcador, pincel)
- **Grosor ajustable**: De 1px a 20px
- **Colores personalizables**: Selector de color completo
- **Formas geométricas**: Rectángulos, círculos, triángulos, líneas

### 📝 Sistema de Texto
- **Múltiples fuentes**: Arial, Times New Roman, Courier New, Georgia
- **Tamaños variables**: De 8px a 72px
- **Estilos**: Normal, negrita, cursiva
- **Colores personalizables**

### 🖼️ Gestión de Imágenes
- **Subida de imágenes**: Soporte para formatos comunes
- **Redimensionamiento**: Cambio de tamaño dinámico
- **Opacidad ajustable**: Control de transparencia
- **Manipulación**: Mover, rotar, deformar

### 📚 Sistema de Capas
- **Múltiples capas**: Crear y gestionar capas independientes
- **Visibilidad**: Mostrar/ocultar capas individuales
- **Opacidad por capa**: Control de transparencia por capa
- **Organización**: Reorganizar capas fácilmente

### 💾 Gestión de Proyectos
- **Guardar proyectos**: Almacenamiento local
- **Cargar proyectos**: Recuperar trabajos anteriores
- **Lista de proyectos**: Vista organizada de todos los proyectos
- **Exportación**: Guardar como imagen PNG

### 📄 Visor de Documentos
- **Soporte PDF/Word**: Cargar documentos para referencia
- **Visualización**: Mostrar páginas del documento
- **Integración**: Usar herramientas sobre documentos

### 🎓 Tutorial Interactivo
- **Guía de uso**: Tutorial paso a paso
- **Carrusel de imágenes**: Ejemplos visuales
- **Ayuda contextual**: Información sobre cada herramienta

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- No requiere servidor web (funciona localmente)

### Instalación
1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Comienza a crear!

### Uso Básico

#### Dibujar
1. Selecciona la herramienta de lápiz (✏️)
2. Ajusta el grosor y color en la barra de opciones
3. Haz clic y arrastra en el canvas para dibujar

#### Agregar Texto
1. Selecciona la herramienta de texto (T)
2. Configura la fuente, tamaño y color
3. Haz clic en el canvas donde quieres agregar texto
4. Escribe el texto deseado

#### Insertar Imágenes
1. Selecciona la herramienta de imagen (🖼️)
2. Haz clic en "Seleccionar" para subir una imagen
3. La imagen aparecerá en el canvas
4. Usa los handles para redimensionar y mover

#### Gestionar Capas
1. Usa el panel de capas (lado derecho)
2. Haz clic en "+ Nueva Capa" para crear una
3. Usa el ícono de ojo para mostrar/ocultar capas
4. Ajusta la opacidad con el deslizador

#### Guardar Proyecto
1. Haz clic en el botón de guardar (💾)
2. Ingresa un nombre para tu proyecto
3. Haz clic en "Guardar"
4. El proyecto se guardará localmente

## Atajos de Teclado

- `Ctrl + S`: Guardar proyecto
- `Ctrl + Z`: Deshacer (próximamente)
- `Escape`: Cerrar modales abiertos

## Características Técnicas

### Optimización de Rendimiento
- **Canvas HTML5**: Renderizado acelerado por hardware
- **Doble buffering**: Reducción de parpadeos
- **Gestión de memoria**: Limpieza automática de recursos
- **Alta resolución**: Soporte para pantallas de alta densidad

### Almacenamiento
- **LocalStorage**: Proyectos guardados localmente
- **Formato JSON**: Estructura de datos optimizada
- **Compresión**: Reducción del tamaño de archivos

### Compatibilidad
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Cross-browser**: Compatible con todos los navegadores modernos
- **Touch support**: Soporte para dispositivos táctiles

## Estructura del Proyecto

```
pizarra-virtual/
├── index.html              # Estructura principal
├── styles.css              # Estilos y diseño
├── script.js               # Funcionalidad principal
├── advanced-features.js    # Características avanzadas
└── README.md              # Documentación
```

## Funcionalidades Futuras

- [ ] Herramienta de selección avanzada
- [ ] Filtros y efectos de imagen
- [ ] Colaboración en tiempo real
- [ ] Exportación a PDF
- [ ] Plantillas predefinidas
- [ ] Historial de cambios (deshacer/rehacer)
- [ ] Zoom y pan del canvas
- [ ] Herramientas de medición

## Soporte

Para reportar problemas o sugerir mejoras, por favor contacta al desarrollador.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Disfruta creando con la Pizarra Virtual!** 🎨✨
