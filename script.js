document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const numberInput = document.getElementById('numberInput');
    const searchBtn = document.getElementById('searchBtn');
    const validationMessage = document.getElementById('validationMessage');
    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('resultContainer');
    const resultContent = document.getElementById('resultContent');
    const networkLogo = document.getElementById('networkLogo');
    const clearBtn = document.getElementById('clearBtn');
    const shareBtn = document.getElementById('shareBtn');
    const searchSound = document.getElementById('searchSound');
    const resultSound = document.getElementById('resultSound');
    
    // Network prefixes
    const networkPrefixes = {
        'jazz': ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309'],
        'zong': ['310', '311', '312', '313', '314', '315', '316'],
        'warid': ['320', '321', '322', '323'],
        'ufone': ['331', '332', '333', '334', '335', '336', '337', '338', '339'],
        'telenor': ['340', '341', '342', '343', '344', '345', '346']
    };
    
    // Network logos (using Unicode characters as placeholders)
    const networkLogos = {
        'jazz': 'J',
        'zong': 'Z',
        'warid': 'W',
        'ufone': 'U',
        'telenor': 'T'
    };
    
    // Network colors
    const networkColors = {
        'jazz': '#ff5722',
        'zong': '#4caf50',
        'warid': '#9c27b0',
        'ufone': '#ffc107',
        'telenor': '#2196f3'
    };
    
    // Event Listeners
    searchBtn.addEventListener('click', searchNumber);
    clearBtn.addEventListener('click', clearResults);
    shareBtn.addEventListener('click', shareResults);
    numberInput.addEventListener('input', validateNumber);
    numberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchNumber();
        }
    });
    
    // Validate Pakistani number
    function validateNumber() {
        const number = numberInput.value.trim();
        validationMessage.textContent = '';
        
        if (number === '') {
            return false;
        }
        
        // Check if input contains only digits
        if (!/^\d+$/.test(number)) {
            validationMessage.textContent = 'Please enter only numbers';
            return false;
        }
        
        // Check length (11 digits for Pakistani numbers)
        if (number.length !== 11) {
            validationMessage.textContent = 'Pakistani numbers must be 11 digits';
            return false;
        }
        
        // Check if starts with valid prefix (03)
        if (!number.startsWith('03')) {
            validationMessage.textContent = 'Pakistani numbers start with 03';
            return false;
        }
        
        return true;
    }
    
    // Search number information
    function searchNumber() {
        // Play search sound
        searchSound.currentTime = 0;
        searchSound.play();
        
        if (!validateNumber()) {
            return;
        }
        
        const number = numberInput.value.trim();
        
        // Show loader
        loader.style.display = 'flex';
        resultContainer.style.display = 'none';
        
        // Detect network
        const prefix = number.substring(0, 4);
        let network = 'Unknown';
        
        for (const [net, prefixes] of Object.entries(networkPrefixes)) {
            if (prefixes.some(p => number.startsWith(p))) {
                network = net;
                break;
            }
        }
        
        // Set network logo placeholder
        networkLogo.textContent = networkLogos[network] || '?';
        networkLogo.style.backgroundColor = networkColors[network] || '#9e9e9e';
        networkLogo.style.display = 'flex';
        networkLogo.style.alignItems = 'center';
        networkLogo.style.justifyContent = 'center';
        networkLogo.style.color = 'white';
        networkLogo.style.fontWeight = 'bold';
        networkLogo.style.borderRadius = '50%';
        networkLogo.style.opacity = '0.8';
        
        // API URL
        const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://fam-official.serv00.net/sim/api.php?num=${number}`)}`;
        
        // Fetch data from API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Parse the JSON content from the API
                const apiResponse = JSON.parse(data.contents);
                
                // Hide loader
                loader.style.display = 'none';
                
                // Play result sound
                resultSound.currentTime = 0;
                resultSound.play();
                
                // Display results
                displayResults(apiResponse, network);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loader.style.display = 'none';
                
                // Display error message
                resultContent.innerHTML = `
                    <div class="result-item" style="grid-column: 1 / -1;">
                        <div class="result-label">Error</div>
                        <div class="result-value">Failed to fetch data. Please try again later.</div>
                    </div>
                `;
                resultContainer.style.display = 'block';
                resultContainer.classList.add('fade-in');
            });
    }
    
    // Display results
    function displayResults(data, network) {
        resultContent.innerHTML = '';
        
        // Add network information
        if (network !== 'Unknown') {
            resultContent.innerHTML += `
                <div class="result-item">
                    <div class="result-label">Network</div>
                    <div class="result-value">${network.charAt(0).toUpperCase() + network.slice(1)}</div>
                </div>
            `;
        }
        
        // Add all data from API response
        for (const [key, value] of Object.entries(data)) {
            // Skip empty values
            if (!value || value === 'N/A') continue;
            
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            resultContent.innerHTML += `
                <div class="result-item">
                    <div class="result-label">${label}</div>
                    <div class="result-value">${value}</div>
                </div>
            `;
        }
        
        // If no data was found
        if (resultContent.children.length === (network !== 'Unknown' ? 1 : 0)) {
            resultContent.innerHTML = `
                <div class="result-item" style="grid-column: 1 / -1;">
                    <div class="result-label">Information</div>
                    <div class="result-value">No information found for this number</div>
                </div>
            `;
        }
        
        // Show result container
        resultContainer.style.display = 'block';
        resultContainer.classList.add('fade-in');
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Clear results
    function clearResults() {
        resultContainer.style.display = 'none';
        numberInput.value = '';
        validationMessage.textContent = '';
        networkLogo.style.display = 'none';
        resultContent.innerHTML = '';
    }
    
    // Share results via WhatsApp
    function shareResults() {
        const number = numberInput.value.trim();
        if (!number) return;
        
        let shareText = `Number Information for ${number}:\n\n`;
        
        // Get all result items
        const resultItems = resultContent.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            const label = item.querySelector('.result-label').textContent;
            const value = item.querySelector('.result-value').textContent;
            shareText += `${label}: ${value}\n`;
        });
        
        // Create WhatsApp share link
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        
        // Open in new tab
        window.open(whatsappUrl, '_blank');
    }
    
    // Initialize
    clearResults();
});
