document.addEventListener('DOMContentLoaded', () => {
    const networkTypeSpan = document.getElementById('network-type');
    const effectiveTypeSpan = document.getElementById('effective-type');
    const adaptiveImage = document.getElementById('adaptive-image');
    const loadingStatus = document.getElementById('loading-status');
    const cellularPrompt = document.getElementById('cellular-prompt');
    const loadHighResBtn = document.getElementById('load-high-res-btn');
    const cancelHighResBtn = document.getElementById('cancel-high-res-btn');
    const HIGH_RES_IMAGE = 'https://via.placeholder.com/1920x1080/4CAF50/FFFFFF?text=High-Res+Image';
    const LOW_RES_IMAGE = 'https://via.placeholder.com/640x360/FF9800/FFFFFF?text=Low-Res+Image';
    const DEFAULT_IMAGE = 'https://via.placeholder.com/800x450/2196F3/FFFFFF?text=Default+Image'; // For unsupported API

    let currentConnectionType = null;
    let currentEffectiveType = null;
    let highResForced = false; 

    function updateNetworkStatus() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            currentConnectionType = connection.type || 'unknown';
            currentEffectiveType = connection.effectiveType || 'unknown';

            networkTypeSpan.textContent = currentConnectionType;
            effectiveTypeSpan.textContent = currentEffectiveType;

            loadingStatus.textContent = `Current connection: ${currentEffectiveType}`;

            loadAdaptiveContent();

            
            if (currentConnectionType !== 'cellular' || highResForced) {
                cellularPrompt.style.display = 'none';
            }

        } else {
            networkTypeSpan.textContent = 'API Not Supported';
            effectiveTypeSpan.textContent = 'API Not Supported';
            loadingStatus.textContent = 'Network Information API not supported by this browser. Loading default content.';
            adaptiveImage.src = DEFAULT_IMAGE;
            adaptiveImage.alt = 'Default image loaded due to unsupported Network Information API';
            cellularPrompt.style.display = 'none';
        }
    }

    function loadAdaptiveContent() {
        if (!('connection' in navigator)) {
            
            return;
        }

        const connection = navigator.connection;

        
        if (highResForced) {
            adaptiveImage.src = HIGH_RES_IMAGE;
            adaptiveImage.alt = 'High-resolution image (user chose to load)';
            loadingStatus.textContent = 'Loading high-resolution content (user preference).';
            return;
        }

        switch (connection.effectiveType) {
            case '4g':
            case '3g':
                
                if (connection.type === 'cellular') {
                    cellularPrompt.style.display = 'block';
                    adaptiveImage.src = LOW_RES_IMAGE; 
                    adaptiveImage.alt = 'Low-resolution image (cellular connection, prompting for high-res)';
                    loadingStatus.textContent = 'Cellular connection detected. Prompting for high-resolution content.';
                } else {
                    cellularPrompt.style.display = 'none'; 
                    adaptiveImage.src = HIGH_RES_IMAGE;
                    adaptiveImage.alt = 'High-resolution image (fast connection)';
                    loadingStatus.textContent = 'Loading high-resolution content.';
                }
                break;
            case '2g':
            case 'slow-2g':
                cellularPrompt.style.display = 'none';  
                adaptiveImage.src = LOW_RES_IMAGE;
                adaptiveImage.alt = 'Low-resolution image (slow connection)';
                loadingStatus.textContent = 'Loading low-resolution content (slow connection detected).';
                break;
            default:
                
                if (connection.type === 'cellular') {
                    cellularPrompt.style.display = 'block';
                    adaptiveImage.src = LOW_RES_IMAGE;
                    adaptiveImage.alt = 'Low-resolution image (cellular connection, prompting for high-res)';
                    loadingStatus.textContent = 'Cellular connection detected. Prompting for high-resolution content.';
                } else {
                    cellularPrompt.style.display = 'none';
                    adaptiveImage.src = HIGH_RES_IMAGE;
                    adaptiveImage.alt = 'High-resolution image (default for non-slow, non-cellular)';
                    loadingStatus.textContent = 'Loading high-resolution content (default).';
                }
                break;
        }
    }

    
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', updateNetworkStatus);

        loadHighResBtn.addEventListener('click', () => {
            highResForced = true;
            cellularPrompt.style.display = 'none';
            adaptiveImage.src = HIGH_RES_IMAGE;
            adaptiveImage.alt = 'High-resolution image (user opted in)';
            loadingStatus.textContent = 'Loading high-resolution content (user override).';
        });

        cancelHighResBtn.addEventListener('click', () => {
            highResForced = false; 
            cellularPrompt.style.display = 'none';
            adaptiveImage.src = LOW_RES_IMAGE; 
            adaptiveImage.alt = 'Low-resolution image (user opted out of high-res)';
            loadingStatus.textContent = 'Keeping low-resolution content (user preference).';
        });
    }
    updateNetworkStatus();
});
                      
