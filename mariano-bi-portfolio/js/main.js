// Main JavaScript for Mariano García Portfolio
class PortfolioApp {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'es';
        this.colorPalette = [];
        this.currentTemplate = 'dashboard';
        this.backgroundCanvas = null;
        this.ctx = null;
        this.colors = {
            primary: '#005A9F',
            secondary: '#E8F4FD',
            accent: '#F2C811'
        };
        
        this.init();
    }
    
    init() {
        this.initNavigation();
        this.initLanguageToggle();
        this.initScrollEffects();
        this.initColorAnalyzer();
        this.initBackgroundDesigner();
        this.setLanguage(this.currentLanguage);
    }
    
    // Navigation and Mobile Menu
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Language Toggle Functionality
    initLanguageToggle() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update text content
        document.querySelectorAll('[data-es][data-en]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.innerHTML.includes('<li>')) {
                    element.innerHTML = text;
                } else if (text.includes('<img') || text.includes('<svg')) {
                    // Si el texto contiene HTML, usar innerHTML
                    element.innerHTML = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update document language
        document.documentElement.lang = lang;
    }
    
    // Scroll Effects
    initScrollEffects() {
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe cards and sections
        document.querySelectorAll('.card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Color Analyzer Tool
    initColorAnalyzer() {
        const fileUpload = document.getElementById('color-file-upload');
        const fileInput = document.getElementById('color-file-input');
        const results = document.getElementById('color-results');
        const loading = document.getElementById('color-loading');
        const paletteColors = document.getElementById('palette-colors');
        const downloadTxt = document.getElementById('download-txt');
        const downloadTheme = document.getElementById('download-powerbi-theme');
        
        // Drag and drop functionality
        if (fileUpload) {
            fileUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUpload.classList.add('dragover');
            });
            
            fileUpload.addEventListener('dragleave', () => {
                fileUpload.classList.remove('dragover');
            });
            
            fileUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUpload.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.analyzeImage(files[0]);
                }
            });
            
            fileUpload.addEventListener('click', () => {
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.analyzeImage(e.target.files[0]);
                }
            });
        }
        
        // Download buttons
        if (downloadTxt) {
            downloadTxt.addEventListener('click', () => {
                this.downloadColorResults('txt');
            });
        }
        
        if (downloadTheme) {
            downloadTheme.addEventListener('click', () => {
                this.downloadColorResults('json');
            });
        }
    }
    
    analyzeImage(file) {
        if (!file.type.startsWith('image/')) {
            alert(this.currentLanguage === 'es' ? 
                'Por favor, selecciona un archivo de imagen.' : 
                'Please select an image file.');
            return;
        }
        
        const results = document.getElementById('color-results');
        const loading = document.getElementById('color-loading');
        const paletteColors = document.getElementById('palette-colors');
        
        results.style.display = 'block';
        loading.style.display = 'flex';
        paletteColors.innerHTML = '';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                const maxSize = 200;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Extract colors
                const imageData = ctx.getImageData(0, 0, width, height);
                this.colorPalette = this.extractColors(imageData.data);
                
                // Display results
                this.displayColorPalette();
                loading.style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    extractColors(data) {
        const colorCounts = new Map();

        // Sample pixels for color counting
        for (let i = 0; i < data.length; i += 8) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            if (a < 128) continue;
            // Agrupa colores para reducir ruido
            const key = `${Math.floor(r/5)*5},${Math.floor(g/5)*5},${Math.floor(b/5)*5}`;
            colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        }

        // Ordena por frecuencia
        let sortedColors = Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([color, count]) => {
                const [r, g, b] = color.split(',').map(Number);
                return {
                    r, g, b,
                    hex: this.rgbToHex(r, g, b),
                    count,
                    frequency: ((count / Array.from(colorCounts.values()).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                };
            });

        // Filtra para que no sean de la misma gama (distancia euclidiana mínima)
        const distinctColors = [];
        const minDistance = 60; // Puedes ajustar este valor para más/menos variedad

        for (let i = 0; i < sortedColors.length && distinctColors.length < 10; i++) {
            const color = sortedColors[i];
            // Si no hay ningún color similar en la lista, lo añadimos
            if (
                distinctColors.every(c => {
                    const dr = c.r - color.r;
                    const dg = c.g - color.g;
                    const db = c.b - color.b;
                    const dist = Math.sqrt(dr*dr + dg*dg + db*db);
                    return dist > minDistance;
                })
            ) {
                distinctColors.push(color);
            }
        }

        // Si hay menos de 10, rellena con los siguientes más frecuentes
        while (distinctColors.length < 10 && sortedColors[distinctColors.length]) {
            distinctColors.push(sortedColors[distinctColors.length]);
        }

        return distinctColors;
    }
    
    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
    
    displayColorPalette() {
        const paletteColors = document.getElementById('palette-colors');
        paletteColors.innerHTML = '';
        
        // Add header with count
        const header = document.createElement('div');
        header.className = 'colors-header';
        header.innerHTML = `
            <h6>${this.currentLanguage === 'es' ? 
                `${this.colorPalette.length} colores únicos encontrados` : 
                `${this.colorPalette.length} unique colors found`}</h6>
            <p class="colors-note">${this.currentLanguage === 'es' ? 
                'Haz clic en cualquier color para copiarlo' : 
                'Click on any color to copy it'}</p>
        `;
        paletteColors.appendChild(header);
        
        // Create colors grid
        const colorsGrid = document.createElement('div');
        colorsGrid.className = 'colors-grid';
        
        this.colorPalette.forEach((color, index) => {
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch enhanced';
            colorSwatch.innerHTML = `
                <div class="color-circle" style="background-color: ${color.hex}"></div>
                <div class="color-info">
                    <div class="color-code">${color.hex.toUpperCase()}</div>
                    <div class="color-frequency">${color.frequency}%</div>
                </div>
            `;
            
            colorSwatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color.hex.toUpperCase()).then(() => {
                    // Enhanced toast notification
                    const toast = document.createElement('div');
                    toast.textContent = `${color.hex.toUpperCase()} ${this.currentLanguage === 'es' ? 'copiado!' : 'copied!'}`;
                    toast.style.cssText = `
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        background: var(--primary-color);
                        color: white;
                        padding: 12px 20px;
                        border-radius: 6px;
                        z-index: 9999;
                        font-weight: 600;
                        box-shadow: var(--shadow-hover);
                        animation: slideInRight 0.3s ease;
                    `;
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.remove();
                    }, 2000);
                });
            });
            
            colorsGrid.appendChild(colorSwatch);
        });
        
        paletteColors.appendChild(colorsGrid);
    }
    
    downloadColorResults(format) {
        if (this.colorPalette.length === 0) return;

        let content, filename, mimeType;

        if (format === 'txt') {
            content = this.generateColorTxt();
            filename = 'color-analysis.txt';
            mimeType = 'text/plain';
            this.downloadFile(content, filename, mimeType);
        } else if (format === 'json') {
            // Siempre usa el template Theme PBI.json y reemplaza los colores
            fetch('images/Theme PBI.json')
                .then(response => response.json())
                .then(theme => {
                    // Sobrescribe los colores principales del template con los extraídos
                    theme.dataColors = this.colorPalette.slice(0, 6).map(color => color.hex.toUpperCase());
                    // Puedes añadir más lógica aquí si quieres reemplazar otros campos
                    content = JSON.stringify(theme, null, 2);
                    filename = 'powerbi-theme.json';
                    mimeType = 'application/json';
                    this.downloadFile(content, filename, mimeType);
                })
                .catch(() => {
                    // Si falla la carga, exporta el theme generado por código como fallback
                    content = this.generatePowerBITheme();
                    filename = 'powerbi-theme.json';
                    mimeType = 'application/json';
                    this.downloadFile(content, filename, mimeType);
                });
        }
    }
    
    generateColorTxt() {
        const title = this.currentLanguage === 'es' ? 
            'ANÁLISIS DE COLORES - RESULTADOS' : 
            'COLOR ANALYSIS - RESULTS';
        
        const paletteTitle = this.currentLanguage === 'es' ? 
            'Paleta de Colores Extraída:' : 
            'Extracted Color Palette:';
        
        let content = `${title}\n`;
        content += '='.repeat(title.length) + '\n\n';
        content += `${paletteTitle}\n\n`;
        
        this.colorPalette.forEach((color, index) => {
            content += `${index + 1}. ${color.hex.toUpperCase()} (RGB: ${color.r}, ${color.g}, ${color.b})\n`;
        });
        
        content += `\n${this.currentLanguage === 'es' ? 'Generado por' : 'Generated by'}: Mariano García Mortigliengo - BI Developer\n`;
        content += `${this.currentLanguage === 'es' ? 'Fecha' : 'Date'}: ${new Date().toLocaleDateString()}\n`;
        
        return content;
    }
    
    generatePowerBITheme() {
        const theme = {
            name: "Custom Extracted Theme",
            dataColors: this.colorPalette.slice(0, 6).map(color => color.hex.toUpperCase()),
            background: "#FFFFFF",
            foreground: "#333333",
            tableAccent: this.colorPalette[0]?.hex.toUpperCase() || "#005A9F",
            good: "#10B981",
            neutral: "#F3F4F6",
            bad: "#EF4444",
            maximum: this.colorPalette[0]?.hex.toUpperCase() || "#005A9F",
            center: "#F3F4F6",
            minimum: this.colorPalette[1]?.hex.toUpperCase() || "#E8F4FD",
            null: "#D1D5DB"
        };
        
        return JSON.stringify(theme, null, 2);
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Background Designer Tool
    initBackgroundDesigner() {
        this.backgroundCanvas = document.getElementById('background-canvas');
        if (!this.backgroundCanvas) return;

        this.ctx = this.backgroundCanvas.getContext('2d');

        // Template selection
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            card.addEventListener('click', (e) => {
                templateCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentTemplate = card.dataset.template;
                this.drawBackground();
            });
        });

        // Color controls (hexadecimal y selector visual, en columna)
        const colorInputs = ['primary-color', 'secondary-color', 'accent-color'];
        colorInputs.forEach(id => {
            let inputText = document.getElementById(id);
            let inputColor = document.getElementById(id + '-picker');

            // Si no existen, los creamos
            if (!inputText || !inputColor) {
                const panel = document.querySelector('.color-controls');
                if (panel) {
                    // Label principal (Color Primario, etc.)
                    const mainLabel = document.createElement('label');
                    mainLabel.setAttribute('for', id);
                    mainLabel.textContent = id === 'primary-color'
                        ? (this.currentLanguage === 'es' ? '' : '')
                        : id === 'secondary-color'
                            ? (this.currentLanguage === 'es' ? '' : '')
                            : (this.currentLanguage === 'es' ? '' : '');
                    mainLabel.style.display = 'block';
                    mainLabel.style.fontWeight = 'bold';
                    mainLabel.style.marginBottom = '2px';

                    // Sub-label para HEX
                    const subLabel = document.createElement('span');
                    subLabel.textContent = id.replace('-color', '').replace(/^./, c => c.toUpperCase()) + ' (#HEX)';
                    subLabel.style.display = 'block';
                    subLabel.style.fontSize = '0.95em';
                    subLabel.style.color = '#666';
                    subLabel.style.marginBottom = '4px';

                    // Input de texto para hex
                    inputText = document.createElement('input');
                    inputText.type = 'text';
                    inputText.id = id;
                    inputText.value = this.colors[id.replace('-color', '')];
                    inputText.maxLength = 7;
                    inputText.pattern = "^#([A-Fa-f0-9]{6})$";
                    inputText.style.width = "90px";
                    inputText.style.marginRight = "8px";
                    inputText.placeholder = "#005A9F";
                    inputText.style.display = 'inline-block';

                    // Input de color visual
                    inputColor = document.createElement('input');
                    inputColor.type = 'color';
                    inputColor.id = id + '-picker';
                    inputColor.value = this.colors[id.replace('-color', '')];
                    inputColor.style.width = "38px";
                    inputColor.style.height = "38px";
                    inputColor.style.verticalAlign = "middle";
                    inputColor.style.marginLeft = "8px";
                    inputColor.style.display = 'inline-block';

                    // Wrapper
                    const wrapper = document.createElement('div');
                    wrapper.className = 'color-control';
                    wrapper.style.marginBottom = '16px';

                    wrapper.appendChild(mainLabel);
                    wrapper.appendChild(subLabel);

                    // Contenedor para inputs en fila
                    const inputRow = document.createElement('div');
                    inputRow.style.display = 'flex';
                    inputRow.style.alignItems = 'center';
                    inputRow.appendChild(inputText);
                    inputRow.appendChild(inputColor);

                    wrapper.appendChild(inputRow);
                    panel.appendChild(wrapper);
                }
            }

            // Sincronización: hex -> color
            if (inputText && inputColor) {
                inputText.addEventListener('input', (e) => {
                    let val = e.target.value.trim();
                    if (/^#[A-Fa-f0-9]{6}$/.test(val)) {
                        inputText.style.borderColor = '';
                        inputColor.value = val;
                        const colorName = id.replace('-color', '');
                        this.colors[colorName] = val;
                        this.drawBackground();
                    } else {
                        inputText.style.borderColor = 'red';
                    }
                });
                // Sincronización: color -> hex
                inputColor.addEventListener('input', (e) => {
                    inputText.value = e.target.value;
                    inputText.style.borderColor = '';
                    const colorName = id.replace('-color', '');
                    this.colors[colorName] = e.target.value;
                    this.drawBackground();
                });
            }
        });

        // Download buttons
        const downloadPNG = document.getElementById('download-png');
        const downloadJPG = document.getElementById('download-jpg');

        if (downloadPNG) {
            downloadPNG.addEventListener('click', () => {
                this.downloadCanvasImage('png');
            });
        }

        if (downloadJPG) {
            downloadJPG.addEventListener('click', () => {
                this.downloadCanvasImage('jpg');
            });
        }

        // Initial draw
        this.drawBackground();
    }

    // Cambios aquí: acepta un parámetro opcional para solo fondo
    drawBackground(onlyBackground = false) {
        if (!this.ctx) return;
        
        const canvas = this.backgroundCanvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        switch (this.currentTemplate) {
            case 'dashboard':
                this.drawDashboardTemplate(onlyBackground);
                break;
            case 'analytics':
                this.drawAnalyticsTemplate(onlyBackground);
                break;
            case 'executive':
                this.drawExecutiveTemplate(onlyBackground);
                break;
        }
    }

    // Cambios aquí: acepta un parámetro opcional para solo fondo
    drawDashboardTemplate(onlyBackground = false) {
        const canvas = this.backgroundCanvas;
        const ctx = this.ctx;
        const w = canvas.width;
        const h = canvas.height;
        
        // Background
        ctx.fillStyle = '#F5F7FA';
        ctx.fillRect(0, 0, w, h);
        
        // Left Sidebar (Purple/Primary)
        ctx.fillStyle = this.colors.primary;
        ctx.fillRect(0, 0, 240, h);
        
        // Sidebar Shadow
        const sidebarGradient = ctx.createLinearGradient(240, 0, 280, 0);
        sidebarGradient.addColorStop(0, 'rgba(0,0,0,0.1)');
        sidebarGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sidebarGradient;
        ctx.fillRect(240, 0, 40, h);
        
        // Top Header Bar
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(240, 0, w - 240, 80);
        ctx.fillStyle = '#E8F4FD';
        ctx.fillRect(240, 78, w - 240, 2);

        if (onlyBackground) return;
        
        // Widget Areas
        const widgets = [
            { x: 280, y: 100, w: 320, h: 180 }, // KPI Card 1
            { x: 620, y: 100, w: 320, h: 180 }, // KPI Card 2
            { x: 960, y: 100, w: 280, h: 180 }, // KPI Card 3
            { x: 280, y: 300, w: 480, h: 200 }, // Chart 1
            { x: 780, y: 300, w: 460, h: 200 }, // Chart 2
            { x: 280, y: 520, w: 960, h: 180 }  // Bottom Chart
        ];
        widgets.forEach((widget, i) => {
            // Widget background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(widget.x, widget.y, widget.w, widget.h);
            
            // Widget shadow
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.fillRect(widget.x + 2, widget.y + 2, widget.w, widget.h);
            
            // Widget accent (top border)
            ctx.fillStyle = i < 3 ? this.colors.accent : this.colors.primary;
            ctx.fillRect(widget.x, widget.y, widget.w, 4);
            
            // Simulated content
            if (i < 3) {
                // KPI Cards - Large number
                ctx.fillStyle = this.colors.primary;
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    ['$2.4M', '847', '94.2%'][i], 
                    widget.x + widget.w/2, 
                    widget.y + widget.h/2 + 12
                );
                
                // KPI Label
                ctx.fillStyle = '#666';
                ctx.font = '14px Arial';
                ctx.fillText(
                    ['Total Revenue', 'Active Users', 'Performance'][i], 
                    widget.x + widget.w/2, 
                    widget.y + 30
                );
            } else {
                // Chart placeholders
                ctx.fillStyle = this.colors.secondary;
                ctx.fillRect(widget.x + 20, widget.y + 40, widget.w - 40, widget.h - 80);
                
                // Simulated chart bars
                for (let j = 0; j < 6; j++) {
                    ctx.fillStyle = j % 2 === 0 ? this.colors.primary : this.colors.accent;
                    const barHeight = Math.random() * 80 + 20;
                    ctx.fillRect(
                        widget.x + 40 + j * ((widget.w - 80) / 6), 
                        widget.y + widget.h - 60 - barHeight, 
                        (widget.w - 80) / 8, 
                        barHeight
                    );
                }
            }
        });
        
        // Sidebar elements
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Dashboard', 30, 40);
        
        // Menu items
        const menuItems = ['Overview', 'Analytics', 'Reports', 'Settings'];
        menuItems.forEach((item, i) => {
            ctx.fillStyle = i === 0 ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)';
            ctx.font = '14px Arial';
            ctx.fillText(item, 30, 100 + i * 40);
        });
    }

    drawAnalyticsTemplate(onlyBackground = false) {
        const canvas = this.backgroundCanvas;
        const ctx = this.ctx;
        const w = canvas.width;
        const h = canvas.height;
        const bgGradient = ctx.createLinearGradient(0, 0, w, h);
        bgGradient.addColorStop(0, '#F8FAFC');
        bgGradient.addColorStop(1, '#E2E8F0');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = this.colors.primary;
        ctx.fillRect(0, 0, w, 60);
        const navGradient = ctx.createLinearGradient(0, 0, w, 60);
        navGradient.addColorStop(0, this.colors.primary);
        navGradient.addColorStop(1, this.colors.accent);
        ctx.fillStyle = navGradient;
        ctx.fillRect(0, 0, w, 60);

        if (onlyBackground) return;

        // Main content areas
        const sections = [
            { x: 40, y: 100, w: 580, h: 260, type: 'chart' },
            { x: 660, y: 100, w: 580, h: 260, type: 'metrics' },
            { x: 40, y: 400, w: 380, h: 280, type: 'list' },
            { x: 460, y: 400, w: 380, h: 280, type: 'gauge' },
            { x: 880, y: 400, w: 360, h: 280, type: 'trend' }
        ];
        sections.forEach((section, i) => {
            // Section background with glass effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(section.x, section.y, section.w, section.h);
            
            // Border and shadow
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(section.x, section.y, section.w, section.h);
            
            // Content based on type
            if (section.type === 'chart') {
                // Line chart simulation
                ctx.strokeStyle = this.colors.primary;
                ctx.lineWidth = 3;
                ctx.beginPath();
                const points = 10;
                for (let j = 0; j <= points; j++) {
                    const x = section.x + 40 + (j * (section.w - 80) / points);
                    const y = section.y + 60 + Math.sin(j * 0.5) * 60 + Math.random() * 40;
                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Data points
                ctx.fillStyle = this.colors.accent;
                for (let j = 0; j <= points; j++) {
                    const x = section.x + 40 + (j * (section.w - 80) / points);
                    const y = section.y + 60 + Math.sin(j * 0.5) * 60 + Math.random() * 40;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            } else if (section.type === 'metrics') {
                // KPI Grid
                const metrics = [
                    { label: 'Conversions', value: '1,247', change: '+12%' },
                    { label: 'Revenue', value: '$54.2K', change: '+8.7%' },
                    { label: 'Users', value: '8,439', change: '+23%' },
                    { label: 'Sessions', value: '15,932', change: '+5.2%' }
                ];
                
                metrics.forEach((metric, j) => {
                    const mx = section.x + 30 + (j % 2) * 270;
                    const my = section.y + 50 + Math.floor(j / 2) * 100;
                    
                    ctx.fillStyle = this.colors.primary;
                    ctx.font = 'bold 28px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(metric.value, mx, my);
                    
                    ctx.fillStyle = '#666';
                    ctx.font = '14px Arial';
                    ctx.fillText(metric.label, mx, my + 25);
                    
                    ctx.fillStyle = '#10B981';
                    ctx.font = '12px Arial';
                    ctx.fillText(metric.change, mx, my + 45);
                });
            }
        });
        
        // Header text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Analytics Dashboard', 40, 40);
    }

    drawExecutiveTemplate(onlyBackground = false) {
        const canvas = this.backgroundCanvas;
        const ctx = this.ctx;
        const w = canvas.width;
        const h = canvas.height;
        const bgGradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
        bgGradient.addColorStop(0, '#FFFFFF');
        bgGradient.addColorStop(1, '#F0F4F8');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = this.colors.primary;
        ctx.fillRect(0, 0, w, 120);
        ctx.fillStyle = this.colors.accent;
        ctx.fillRect(0, 115, w, 5);

        if (onlyBackground) return;

        // Executive summary cards
        const cards = [
            { x: 60, y: 160, w: 360, h: 200, title: 'Revenue Overview', type: 'revenue' },
            { x: 460, y: 160, w: 360, h: 200, title: 'Market Position', type: 'position' },
            { x: 860, y: 160, w: 360, h: 200, title: 'Growth Metrics', type: 'growth' },
        ];
        cards.forEach((card, i) => {
            // Premium card styling
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(card.x, card.y, card.w, card.h);
            
            // Subtle shadow
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            ctx.fillRect(card.x + 4, card.y + 4, card.w, card.h);
            
            // Card header
            ctx.fillStyle = this.colors.primary;
            ctx.fillRect(card.x, card.y, card.w, 50);
            
            // Title
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(card.title, card.x + 20, card.y + 32);
            
            // Content area
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(card.x + 20, card.y + 70, card.w - 40, card.h - 110);
            
            if (card.type === 'revenue') {
                // Revenue chart
                ctx.fillStyle = this.colors.primary;
                ctx.font = 'bold 32px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('$12.4M', card.x + card.w/2, card.y + 130);
                
                ctx.fillStyle = '#10B981';
                ctx.font = '14px Arial';
                ctx.fillText('+18.5% vs last quarter', card.x + card.w/2, card.y + 155);
            } else if (card.type === 'position') {
                // Market position indicator
                ctx.fillStyle = this.colors.accent;
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('#2', card.x + card.w/2, card.y + 120);
                
                ctx.fillStyle = '#666';
                ctx.font = '14px Arial';
                ctx.fillText('Market Leader', card.x + card.w/2, card.y + 145);
            } else {
                // Growth metrics
                ctx.fillStyle = this.colors.primary;
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('94.2%', card.x + card.w/2, card.y + 110);
                
                ctx.fillStyle = '#666';
                ctx.font = '14px Arial';
                ctx.fillText('Customer Satisfaction', card.x + card.w/2, card.y + 130);
                
                ctx.fillStyle = '#10B981';
                ctx.font = '12px Arial';
                ctx.fillText('+2.1% improvement', card.x + card.w/2, card.y + 150);
            }
        });
        
        // Bottom section - Executive summary
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(60, 400, 1160, 260);
        
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(64, 404, 1160, 260);
        
        // Section header
        ctx.fillStyle = this.colors.primary;
        ctx.fillRect(60, 400, 1160, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Executive Summary - Key Performance Indicators', 80, 425);
        
        // KPI grid
        const kpis = [
            'Quarterly Revenue Growth', 'Market Share Expansion', 
            'Customer Acquisition Cost', 'Net Profit Margin',
            'Employee Satisfaction', 'Operational Efficiency'
        ];
        
        kpis.forEach((kpi, i) => {
            const kx = 100 + (i % 3) * 360;
            const ky = 480 + Math.floor(i / 3) * 80;
            
            // KPI indicator
            ctx.fillStyle = i % 2 === 0 ? this.colors.primary : this.colors.accent;
            ctx.fillRect(kx - 10, ky - 20, 4, 40);
            
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(kpi, kx + 10, ky - 10);
            
            // Value
            ctx.fillStyle = this.colors.primary;
            ctx.font = 'bold 18px Arial';
            ctx.fillText(['18.5%', '12.3%', '-8.2%', '24.7%', '91%', '89%'][i], kx + 10, ky + 15);
        });
        
        // Header branding
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Executive Dashboard', 60, 50);
        
        ctx.font = '14px Arial';
        ctx.fillText('Strategic Overview & Key Metrics', 60, 80);
    }

    // Cambios aquí: exporta solo el fondo
    downloadCanvasImage(format) {
        const canvas = this.backgroundCanvas;
        const ctx = this.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Redibuja solo el fondo
        this.drawBackground(true);

        const link = document.createElement('a');
        if (format === 'jpg') {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            link.download = `powerbi-background.${format}`;
            link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
        } else {
            link.download = `powerbi-background.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
        }
        link.click();

        // Restaura el canvas original
        ctx.putImageData(imageData, 0, 0);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);
