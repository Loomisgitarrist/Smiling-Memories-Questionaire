document.addEventListener('DOMContentLoaded', () => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    const form = document.getElementById('avatarForm');
    const responseMessageDiv = document.getElementById('responseMessage');
    const API_BASE_URL = 'https://chatgpt-main-server-lg.replit.app';

    // Handle API key placeholder click
    const noApiKeyLabel = document.getElementById('noApiKeyLabel');
    const apiKeyInput = document.getElementById('oaiApiKey');
    
    if (noApiKeyLabel && apiKeyInput) {
        noApiKeyLabel.addEventListener('click', () => {
            apiKeyInput.value = 'sk-xxxxxxx';
            apiKeyInput.focus();
        });
    }

    // Handle purchase options multi-select functionality
    const purchaseOptions = document.querySelectorAll('.purchase-option');
    const selectedSummary = document.getElementById('selectedSummary');
    
    if (purchaseOptions.length > 0) {
        purchaseOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            const optionHeader = option.querySelector('.option-header');
            
            // Toggle selection on header click
            optionHeader.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    checkbox.checked = !checkbox.checked;
                    e.preventDefault();
                }
                updateOptionVisuals();
                updateSelectedSummary();
            });

            // Update visuals when checkbox state changes
            checkbox.addEventListener('change', () => {
                updateOptionVisuals();
                updateSelectedSummary();
            });
        });

        function updateOptionVisuals() {
            purchaseOptions.forEach(option => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                if (checkbox.checked) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
        }

        function updateSelectedSummary() {
            const selectedOptions = Array.from(purchaseOptions).filter(option => 
                option.querySelector('input[type="checkbox"]').checked
            );

            if (selectedOptions.length === 0) {
                selectedSummary.innerHTML = '<p class="no-selection">No applications selected yet. Check the options above to see your personalized summary.</p>';
                return;
            }

            const summaryHTML = selectedOptions.map(option => {
                const title = option.querySelector('.option-title span').textContent;
                const icon = option.querySelector('.option-title i').className;
                const summary = option.querySelector('.option-summary p').textContent;
                
                return `
                    <div class="selected-app">
                        <h5><i class="${icon}"></i>${title}</h5>
                        <p>${summary}</p>
                    </div>
                `;
            }).join('');

            selectedSummary.innerHTML = summaryHTML;
        }
    }

    // Lightweight lightbox for card galleries (click to open/close)
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    document.body.addEventListener('click', (e) => {
        const thumb = e.target.closest('.card-thumb');
        if (thumb && thumb.querySelector('img')) {
            // Open image in centered lightbox
            const img = thumb.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Screenshot';
            
            // Store current scroll position and prevent body scroll
            document.body.dataset.prevOverflow = document.body.style.overflow || '';
            document.body.style.overflow = 'hidden';
            
            // Show lightbox with centering
            lightbox.classList.add('open');
            return; // stop further handling
        }

        // Close lightbox when clicking on background or image
        if (e.target === lightbox || e.target === lightboxImg || lightbox.contains(e.target)) {
            lightbox.classList.remove('open');
            lightboxImg.src = '';
            document.body.style.overflow = document.body.dataset.prevOverflow || '';
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            lightbox.classList.remove('open');
            lightboxImg.src = '';
            document.body.style.overflow = document.body.dataset.prevOverflow || '';
        }
    });

    // Prevent image dragging in lightbox
    lightboxImg.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Provide graceful placeholders for missing screenshots
    const placeholderSVG = encodeURI(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">\
         <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\
         <stop offset="0%" stop-color="#f5f7fa"/><stop offset="100%" stop-color="#e9ecef"/>\
         </linearGradient></defs>\
         <rect width="1600" height="900" fill="url(#g)"/>\
         <rect x="40" y="40" width="1520" height="820" rx="24" ry="24" fill="none" stroke="#cccccc" stroke-width="8"/>\
         <g fill="#777" font-family="Arial,Helvetica,sans-serif" text-anchor="middle">\
           <text x="800" y="450" font-size="64">16:9 Screenshot</text>\
           <text x="800" y="520" font-size="28">Place image in images/screens/ …</text>\
         </g>\
        </svg>'
    );
    document.querySelectorAll('.card-thumb img').forEach(img => {
        const setPlaceholder = () => {
            img.onerror = null;
            img.src = `data:image/svg+xml;utf8,${placeholderSVG}`;
        };
        img.onerror = setPlaceholder;
        // If the image has already failed loading before handler attached
        if (img.complete && img.naturalWidth === 0) {
            setPlaceholder();
        }
    });

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            responseMessageDiv.style.display = 'none'; // Hide previous messages
            responseMessageDiv.classList.remove('success', 'error');
            responseMessageDiv.textContent = '';

            const formData = new FormData(form);
            const data = {};

            // Copy non-PurchaseOption fields
            formData.forEach((value, key) => {
                if (key !== 'PurchaseOption') {
                    data[key] = value;
                }
            });

            // Robustly gather selected purchase options (avoids FormData quirks)
            const checkedOptions = Array.from(document.querySelectorAll('input[name="PurchaseOption"]:checked'))
                .map(input => input.value);
            data['PurchaseOption'] = checkedOptions.join(', ');

            // Log the data being sent (for debugging)
            console.log('Sending data:', data);

            try {
                const response = await fetch(`${API_BASE_URL}/api/create-questionnaire`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && (result.success === undefined || result.success === true)) {
                    responseMessageDiv.textContent = 'Questionnaire submitted successfully! Thank you.';
                    responseMessageDiv.classList.add('success');
                    form.reset(); // Clear the form
                    if (typeof updateOptionVisuals === 'function') updateOptionVisuals();
                    if (typeof updateSelectedSummary === 'function') updateSelectedSummary();
                } else {
                    let errorMessage = 'An unknown error occurred.';
                    if (result.error) {
                        errorMessage = result.error;
                    } else if (result.details) {
                        errorMessage = result.details;
                    }
                    responseMessageDiv.textContent = `Submission failed: ${errorMessage}`;
                    responseMessageDiv.classList.add('error');
                }
            } catch (error) {
                console.error('Network or server error:', error);
                responseMessageDiv.textContent = 'Network error: Could not connect to the server. Please try again.';
                responseMessageDiv.classList.add('error');
            } finally {
                responseMessageDiv.style.display = 'block'; // Show the message
            }
        });
    }
});