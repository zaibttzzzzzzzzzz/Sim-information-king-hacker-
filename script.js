// Replace the existing displayResults function with this updated version
function displayResults(data, network) {
    resultContent.innerHTML = '';
    
    // Check if data is nested in a 'data' property
    if (data.data && typeof data.data === 'object') {
        data = data.data;
    }
    
    // Add network information
    if (network !== 'Unknown') {
        resultContent.innerHTML += `
            <div class="result-item">
                <div class="result-label">Network</div>
                <div class="result-value">${network.charAt(0).toUpperCase() + network.slice(1)}</div>
            </div>
        `;
    }
    
    // Handle array response
    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            resultContent.innerHTML += `
                <div class="result-item" style="grid-column: 1 / -1;">
                    <div class="result-label">Result ${index + 1}</div>
                    <div class="result-value">${JSON.stringify(item, null, 2)}</div>
                </div>
            `;
        });
    } 
    // Handle object response
    else if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
            // Skip empty values
            if (!value || value === 'N/A') continue;
            
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let displayValue = value;
            
            // Handle nested objects
            if (typeof value === 'object') {
                displayValue = JSON.stringify(value, null, 2);
            }
            
            resultContent.innerHTML += `
                <div class="result-item">
                    <div class="result-label">${label}</div>
                    <div class="result-value">${displayValue}</div>
                </div>
            `;
        }
    } 
    // Handle other response types
    else {
        resultContent.innerHTML = `
            <div class="result-item" style="grid-column: 1 / -1;">
                <div class="result-label">Information</div>
                <div class="result-value">${data}</div>
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
}
