// Global variables
let currentEditRow = null;
let currentEditSheet = null;

// Utility functions
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Data loading functions
async function loadSheetData(sheetName) {
    const tableContainer = document.getElementById(`${sheetName.toLowerCase()}Table`);
    
    try {
        const response = await fetch(`/api/data/${sheetName}`);
        const result = await response.json();
        
        if (result.success) {
            renderTable(sheetName, result.data, tableContainer);
        } else {
            tableContainer.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading data: ${result.error}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        tableContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load data. Please check your connection and try again.
            </div>
        `;
    }
}

function renderTable(sheetName, data, container) {
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No data found. Add your first record using the "Add" button above.
            </div>
        `;
        return;
    }

    const headers = data[0];
    const rows = data.slice(1);
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                        <th width="150">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    rows.forEach((row, index) => {
        const rowIndex = index + 2; // +2 because we skip header and arrays are 0-indexed
        tableHTML += `
            <tr>
                ${row.map((cell, cellIndex) => {
                    // Check if this is an image URL column
                    if (headers[cellIndex] && (
                        headers[cellIndex].includes('URL') || 
                        headers[cellIndex].includes('Foto') || 
                        headers[cellIndex].includes('Gambar')
                    ) && cell && cell.startsWith('http')) {
                        return `<td><img src="${cell}" alt="Image" style="max-width: 50px; max-height: 50px; object-fit: cover;" class="rounded"></td>`;
                    }
                    return `<td>${cell || ''}</td>`;
                }).join('')}
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editRecord('${sheetName}', ${rowIndex}, ${JSON.stringify(row).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('${sheetName}', ${rowIndex})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

// CRUD operations
async function saveProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Handle image upload
    const imageFile = document.getElementById('profileImage').files[0];
    if (imageFile) {
        try {
            const base64Image = await convertFileToBase64(imageFile);
            data.image_data = base64Image;
        } catch (error) {
            showAlert('Error processing image file', 'danger');
            return;
        }
    }
    
    await saveRecord('Profile', data);
}

async function saveExperience() {
    const form = document.getElementById('experienceForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    await saveRecord('Experience', data);
}

async function saveCertification() {
    const form = document.getElementById('certificationsForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Handle image upload
    const imageFile = document.getElementById('certificationImage').files[0];
    if (imageFile) {
        try {
            const base64Image = await convertFileToBase64(imageFile);
            data.image_data = base64Image;
        } catch (error) {
            showAlert('Error processing image file', 'danger');
            return;
        }
    }
    
    await saveRecord('Certifications', data);
}

async function saveProject() {
    const form = document.getElementById('projectForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Handle image upload
    const imageFile = document.getElementById('projectImage').files[0];
    if (imageFile) {
        try {
            const base64Image = await convertFileToBase64(imageFile);
            data.image_data = base64Image;
        } catch (error) {
            showAlert('Error processing image file', 'danger');
            return;
        }
    }
    
    await saveRecord('Project', data);
}

async function saveRecord(sheetName, data) {
    try {
        let url, method;
        
        if (currentEditRow) {
            // Update existing record
            url = `/api/update/${sheetName}/${currentEditRow}`;
            method = 'PUT';
        } else {
            // Create new record
            url = `/api/create/${sheetName}`;
            method = 'POST';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(currentEditRow ? 'Record updated successfully!' : 'Record created successfully!', 'success');
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.querySelector(`#${sheetName.toLowerCase()}Modal`));
            if (modal) modal.hide();
            
            // Reset edit state
            currentEditRow = null;
            currentEditSheet = null;
            
            // Reload data
            await loadSheetData(sheetName);
        } else {
            showAlert(`Error: ${result.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error saving record:', error);
        showAlert('Failed to save record. Please try again.', 'danger');
    }
}

function editRecord(sheetName, rowIndex, rowData) {
    currentEditRow = rowIndex;
    currentEditSheet = sheetName;
    
    // Fill form with current data
    const modalId = `${sheetName.toLowerCase()}Modal`;
    const formId = `${sheetName.toLowerCase()}Form`;
    
    // Get form fields and populate them
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input, index) => {
        if (input.type !== 'file' && rowData[index] !== undefined) {
            input.value = rowData[index] || '';
        }
    });
    
    // Update modal title
    const modal = document.querySelector(`#${modalId}`);
    const title = modal.querySelector('.modal-title');
    title.textContent = `Edit ${sheetName}`;
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

async function deleteRecord(sheetName, rowIndex) {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/delete/${sheetName}/${rowIndex}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Record deleted successfully!', 'success');
            await loadSheetData(sheetName);
        } else {
            showAlert(`Error deleting record: ${result.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        showAlert('Failed to delete record. Please try again.', 'danger');
    }
}

// Modal event listeners to reset forms and edit state
document.addEventListener('DOMContentLoaded', function() {
    // Reset forms when modals are hidden
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
            
            // Reset edit state
            currentEditRow = null;
            currentEditSheet = null;
            
            // Reset modal title
            const title = this.querySelector('.modal-title');
            const sheetName = title.textContent.replace('Edit ', '');
            title.textContent = `${sheetName} Form`;
        });
    });
});
