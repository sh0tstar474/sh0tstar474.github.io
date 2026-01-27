/* ===================================
   THREE.JS WIREFRAME ANIMATIONS
   Separated for better code organization
   =================================== */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        accentColor: 0xdbafff,
        animationSpeed: {
            slow: 0.003,
            medium: 0.005,
            fast: 0.008
        },
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        opacity: 0.8
    };

    // Error handling helper
    function logError(context, error) {
        if (console && console.error) {
            console.error(`[Wireframe: ${context}]`, error);
        }
    }

    /**
     * Create a wireframe animation
     * @param {string} canvasId - ID of the canvas element
     * @param {string} geometryType - Type of geometry to create
     */
    function createWireframe(canvasId, geometryType) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            logError('createWireframe', `Canvas with id "${canvasId}" not found`);
            return;
        }

        // Ensure Three.js is loaded
        if (typeof THREE === 'undefined') {
            logError('createWireframe', 'THREE.js is not loaded');
            return;
        }

        try {
            // Scene setup
            const scene = new THREE.Scene();
            
            // Camera setup
            const camera = new THREE.PerspectiveCamera(
                75, 
                canvas.clientWidth / canvas.clientHeight, 
                0.1, 
                1000
            );
            
            // Renderer setup
            const renderer = new THREE.WebGLRenderer({ 
                canvas, 
                alpha: true, 
                antialias: true 
            });
            
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(CONFIG.pixelRatio);
            renderer.setClearColor(0x000000, 0);

            // Create geometry based on type
            let geometry;
            switch(geometryType) {
                case 'pyramid':
                    geometry = new THREE.TetrahedronGeometry(2.5);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(2);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(2, 0.6, 16, 100);
                    break;
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(2);
                    break;
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(2);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(2, 32, 32);
                    break;
                default:
                    geometry = new THREE.TetrahedronGeometry(2.5);
                    logError('createWireframe', `Unknown geometry type "${geometryType}", using pyramid`);
            }

            // Material setup
            const material = new THREE.MeshBasicMaterial({ 
                color: CONFIG.accentColor, 
                wireframe: true,
                transparent: true,
                opacity: CONFIG.opacity
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Position camera
            camera.position.z = 5;

            // Animation variables
            let animationFrameId = null;
            let isVisible = true;

            // Animation loop
            function animate() {
                if (!isVisible) return;

                animationFrameId = requestAnimationFrame(animate);
                
                // Rotate mesh
                mesh.rotation.x += CONFIG.animationSpeed.slow;
                mesh.rotation.y += CONFIG.animationSpeed.medium;
                
                // Render scene
                renderer.render(scene, camera);
            }

            // Start animation
            animate();

            // Handle resize with debouncing
            let resizeTimeout;
            function handleResize() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (!canvas) return;
                    
                    const width = canvas.clientWidth;
                    const height = canvas.clientHeight;
                    
                    renderer.setSize(width, height);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }, 250);
            }

            window.addEventListener('resize', handleResize);

            // Intersection Observer for performance
            // Pause animation when not visible
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isVisible = entry.isIntersecting;
                        if (isVisible) {
                            animate();
                        } else {
                            if (animationFrameId) {
                                cancelAnimationFrame(animationFrameId);
                                animationFrameId = null;
                            }
                        }
                    });
                }, { threshold: 0.1 });

                observer.observe(canvas);
            }

            // Cleanup function
            return function cleanup() {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                window.removeEventListener('resize', handleResize);
                geometry.dispose();
                material.dispose();
                renderer.dispose();
            };

        } catch (error) {
            logError('createWireframe', error);
            return null;
        }
    }

    /**
     * Initialize all wireframes on the page
     */
    function initWireframes() {
        // Wait for Three.js to be loaded
        if (typeof THREE === 'undefined') {
            console.warn('THREE.js not loaded yet, waiting...');
            setTimeout(initWireframes, 100);
            return;
        }

        try {
            // Create wireframes with different geometries
            const wireframes = [
                { id: 'hero-wireframe', type: 'torus' },
                { id: 'pyramid', type: 'pyramid' }
            ];

            wireframes.forEach(({ id, type }) => {
                const cleanup = createWireframe(id, type);
                if (cleanup) {
                    // Store cleanup function for potential use
                    window[`cleanup_${id}`] = cleanup;
                }
            });

            console.log('✅ Wireframe animations initialized');
        } catch (error) {
            logError('initWireframes', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWireframes);
    } else {
        initWireframes();
    }

    // Expose for external use if needed
    window.WireframeAnimations = {
        create: createWireframe,
        init: initWireframes
    };

})();
