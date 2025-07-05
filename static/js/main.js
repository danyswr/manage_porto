// Global variables
let currentEditRow = null;
let currentEditSheet = null;
let currentSheetData = {};

// Sheet configurations
const sheetConfigs = {
    Profile: {
        icon: 'fas fa-user',
        title: 'Profile Management',
        subtitle: 'Personal information and contact details',
        fields: ['nama_lengkap', 'profesi', 'Deskripsi', 'Foto_Profil_URL', 'Email', 'Nomor_Telepon', 'Lokasi', 'Link_LinkedIn', 'Link_GitHub'],
        labels: ['Full Name', 'Profession', 'Description', 'Photo URL', 'Email', 'Phone', 'Location', 'LinkedIn', 'GitHub'],
        allowCreate: false, // Profile only allows edit of existing data
        hasImage: true,
        imageField: 'Foto_Profil_URL'
    },
    Experience: {
        icon: 'fas fa-briefcase',
        title: 'Experience Management',
        subtitle: 'Work history and professional experience',
        fields: ['ID_pengalaman', 'Posisi', 'Tanggal_Mulai', 'Tanggal_Selesai', 'Deskripsi'],
        labels: ['Experience ID', 'Position', 'Start Date', 'End Date', 'Description'],
        allowCreate: true,
        hasImage: false
    },
    Certifications: {
        icon: 'fas fa-certificate',
        title: 'Certifications Management',
        subtitle: 'Professional certificates and achievements',
        fields: ['ID_Sertifikasi', 'Nama_Sertifikasi', 'Tanggal_Diterbitkan', 'Gambar_Sertifikasi_URL', 'Deskripsi'],
        labels: ['Certification ID', 'Certification Name', 'Issue Date', 'Certificate Image', 'Description'],
        allowCreate: true,
        hasImage: true,
        imageField: 'Gambar_Sertifikasi_URL'
    },
    Project: {
        icon: 'fas fa-project-diagram',
        title: 'Project Management',
        subtitle: 'Portfolio projects and achievements',
        fields: ['ID_project', 'Nama_Proyek', 'Deskripsi', 'Skill', 'Link', 'Gambar_Proyek_URL'],
        labels: ['Project ID', 'Project Name', 'Description', 'Skills', 'Link', 'Project Image'],
        allowCreate: true,
        hasImage: true,
        imageField: 'Gambar_Proyek_URL'
    }
};

// Utility functions
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div class="alert alert-${type} alert-modern alert-dismissible fade show animate__animated animate__slideInRight" role="alert" id="${alertId}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.remove('animate__slideInRight');
            alert.classList.add('animate__slideOutRight');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('d-none');
    } else {
        overlay.classList.add('d-none');
    }
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Dashboard initialization
async function initializeDashboard() {
    showLoading(true);
    
    try {
        // Load data counts for all sheets
        await Promise.all([
            loadDataCount('Profile'),
            loadDataCount('Experience'),
            loadDataCount('Certifications'),
            loadDataCount('Project')
        ]);
        
        // Add click handlers to cards
        document.querySelectorAll('.data-card').forEach(card => {
            const sheet = card.dataset.sheet;
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    viewData(sheet);
                }
            });
        });
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showAlert('Failed to initialize dashboard', 'danger');
    } finally {
        showLoading(false);
    }
}

// Load data count for dashboard cards
async function loadDataCount(sheetName) {
    try {
        const response = await fetch(`/api/data/${sheetName}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            const count = Math.max(0, result.data.length - 1); // Subtract header row
            document.getElementById(`${sheetName.toLowerCase()}Count`).textContent = count;
            currentSheetData[sheetName] = result.data;
        } else {
            document.getElementById(`${sheetName.toLowerCase()}Count`).textContent = '0';
        }
    } catch (error) {
        console.error(`Error loading ${sheetName} count:`, error);
        document.getElementById(`${sheetName.toLowerCase()}Count`).textContent = '?';
    }
}

// View data in modal
async function viewData(sheetName) {
    const config = sheetConfigs[sheetName];
    const modal = document.getElementById('dataViewModal');
    const container = document.getElementById('dataTableContainer');
    
    // Update modal header
    document.getElementById('modalIcon').innerHTML = `<i class="${config.icon}"></i>`;
    document.getElementById('modalIcon').className = `modal-icon ${sheetName.toLowerCase()}-icon me-3`;
    document.getElementById('modalTitle').textContent = config.title;
    document.getElementById('modalSubtitle').textContent = config.subtitle;
    
    // Show loading
    container.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-3">Loading ${sheetName.toLowerCase()} data...</div>
        </div>
    `;
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    try {
        const response = await fetch(`/api/data/${sheetName}`);
        const result = await response.json();
        
        if (result.success) {
            renderDataTable(sheetName, result.data, container);
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="${config.icon}"></i>
                    <h5>Error Loading Data</h5>
                    <p>${result.error}</p>
                    <button class="btn btn-primary" onclick="viewData('${sheetName}')">
                        <i class="fas fa-refresh me-1"></i>Try Again
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Connection Error</h5>
                <p>Failed to load data. Please check your connection and try again.</p>
                <button class="btn btn-primary" onclick="viewData('${sheetName}')">
                    <i class="fas fa-refresh me-1"></i>Retry
                </button>
            </div>
        `;
    }
}

// Render data table
function renderDataTable(sheetName, data, container) {
    const config = sheetConfigs[sheetName];
    
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${config.icon}"></i>
                <h5>No Data Found</h5>
                <p>No ${sheetName.toLowerCase()} records available.</p>
                ${config.allowCreate ? `
                    <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
                        <i class="fas fa-plus me-1"></i>Add First Record
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }

    const headers = data[0];
    const rows = data.slice(1);
    
    if (rows.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${config.icon}"></i>
                <h5>No Records</h5>
                <p>No ${sheetName.toLowerCase()} records found.</p>
                ${config.allowCreate ? `
                    <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
                        <i class="fas fa-plus me-1"></i>Add First Record
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <div class="table-responsive">
            <table class="table table-modern">
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                        <th width="120">Actions</th>
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
                        return `<td><img src="${cell}" alt="Image" class="image-thumbnail"></td>`;
                    }
                    return `<td>${cell || ''}</td>`;
                }).join('')}
                <td>
                    <div class="d-flex gap-1">
                        <button class="action-btn action-btn-edit" onclick="editRecord('${sheetName}', ${rowIndex}, ${JSON.stringify(row).replace(/"/g, '&quot;')})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${sheetName !== 'Profile' ? `
                            <button class="action-btn action-btn-delete" onclick="deleteRecord('${sheetName}', ${rowIndex})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
        ${config.allowCreate ? `
            <div class="p-3 border-top">
                <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
                    <i class="fas fa-plus me-1"></i>Add New ${sheetName}
                </button>
            </div>
        ` : ''}
    `;
    
    container.innerHTML = tableHTML;
}

// Show edit modal for Profile
function showEditModal(sheetName) {
    if (sheetName === 'Profile') {
        // Load current profile data
        loadProfileForEdit();
    }
}

// Load profile data for editing
async function loadProfileForEdit() {
    try {
        const response = await fetch('/api/data/Profile');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 1) {
            const headers = result.data[0];
            const profileData = result.data[1]; // Assuming first data row is the profile
            
            // Fill form with current data
            const form = document.getElementById('profileForm');
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach((input, index) => {
                if (input.type !== 'file' && profileData[index] !== undefined) {
                    input.value = profileData[index] || '';
                }
            });
            
            currentEditRow = 2; // Row 2 in spreadsheet (header is row 1)
            currentEditSheet = 'Profile';
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('profileEditModal'));
            modal.show();
        } else {
            showAlert('No profile data found to edit', 'warning');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('Failed to load profile data', 'danger');
    }
}

// Show add modal for other sheets
function showAddModal(sheetName) {
    if (sheetName === 'Profile') return; // Profile doesn't allow new records
    
    const config = sheetConfigs[sheetName];
    const modal = document.getElementById('dynamicFormModal');
    
    // Update modal header
    document.getElementById('dynamicModalIcon').innerHTML = `<i class="${config.icon}"></i>`;
    document.getElementById('dynamicModalIcon').className = `modal-icon ${sheetName.toLowerCase()}-icon me-3`;
    document.getElementById('dynamicModalTitle').textContent = `Add ${sheetName}`;
    document.getElementById('dynamicModalSubtitle').textContent = `Create new ${sheetName.toLowerCase()} record`;
    
    // Generate form
    generateDynamicForm(sheetName);
    
    // Reset edit state
    currentEditRow = null;
    currentEditSheet = sheetName;
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Generate dynamic form
function generateDynamicForm(sheetName) {
    const config = sheetConfigs[sheetName];
    const container = document.getElementById('dynamicFormContainer');
    
    let formHTML = `<form id="dynamicForm" enctype="multipart/form-data"><div class="row g-3">`;
    
    config.fields.forEach((field, index) => {
        const label = config.labels[index];
        const isRequired = index < 2; // First two fields are usually required
        const isImage = config.hasImage && field === config.imageField;
        
        if (isImage) {
            formHTML += `
                <div class="col-12">
                    <div class="form-group-modern">
                        <label for="${field}" class="form-label-modern">${label}</label>
                        <div class="file-upload-modern">
                            <input type="file" class="form-control-modern" id="${field}" accept="image/*">
                            <div class="file-upload-text">
                                <i class="fas fa-cloud-upload-alt me-2"></i>
                                Choose image or drag and drop
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (field.includes('Deskripsi')) {
            formHTML += `
                <div class="col-12">
                    <div class="form-group-modern">
                        <label for="${field}" class="form-label-modern">${label}${isRequired ? ' *' : ''}</label>
                        <textarea class="form-control-modern" id="${field}" name="${field}" rows="3" ${isRequired ? 'required' : ''}></textarea>
                    </div>
                </div>
            `;
        } else if (field.includes('Tanggal')) {
            formHTML += `
                <div class="col-md-6">
                    <div class="form-group-modern">
                        <label for="${field}" class="form-label-modern">${label}${isRequired ? ' *' : ''}</label>
                        <input type="date" class="form-control-modern" id="${field}" name="${field}" ${isRequired ? 'required' : ''}>
                    </div>
                </div>
            `;
        } else {
            const inputType = field.includes('Email') ? 'email' : field.includes('Link') ? 'url' : 'text';
            const colClass = field.includes('ID') || field.includes('Nama') || field.includes('Posisi') ? 'col-md-6' : 'col-12';
            
            formHTML += `
                <div class="${colClass}">
                    <div class="form-group-modern">
                        <label for="${field}" class="form-label-modern">${label}${isRequired ? ' *' : ''}</label>
                        <input type="${inputType}" class="form-control-modern" id="${field}" name="${field}" ${isRequired ? 'required' : ''}>
                    </div>
                </div>
            `;
        }
    });
    
    formHTML += `</div></form>`;
    container.innerHTML = formHTML;
    
    // Update save button onclick
    document.getElementById('saveDynamicRecord').onclick = () => saveDynamicRecord(sheetName);
}

// Save profile
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
        showLoading(true);
        try {
            const base64Image = await convertFileToBase64(imageFile);
            data.image_data = base64Image;
        } catch (error) {
            showLoading(false);
            showAlert('Error processing image file', 'danger');
            return;
        }
    }
    
    await saveRecord('Profile', data);
}

// Save dynamic record
async function saveDynamicRecord(sheetName) {
    const form = document.getElementById('dynamicForm');
    const formData = new FormData(form);
    const data = {};
    const config = sheetConfigs[sheetName];
    
    // Get form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Handle image upload if applicable
    if (config.hasImage && config.imageField) {
        const imageFile = document.getElementById(config.imageField).files[0];
        if (imageFile) {
            showLoading(true);
            try {
                const base64Image = await convertFileToBase64(imageFile);
                data.image_data = base64Image;
            } catch (error) {
                showLoading(false);
                showAlert('Error processing image file', 'danger');
                return;
            }
        }
    }
    
    await saveRecord(sheetName, data);
}

// Save record
async function saveRecord(sheetName, data) {
    showLoading(true);
    
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
            
            // Close modal
            const modalId = sheetName === 'Profile' ? 'profileEditModal' : 'dynamicFormModal';
            const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
            if (modal) modal.hide();
            
            // Reset edit state
            currentEditRow = null;
            currentEditSheet = null;
            
            // Refresh data
            await loadDataCount(sheetName);
            
            // If data view modal is open, refresh it
            const dataModal = bootstrap.Modal.getInstance(document.getElementById('dataViewModal'));
            if (dataModal && dataModal._isShown) {
                await viewData(sheetName);
            }
        } else {
            showAlert(`Error: ${result.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error saving record:', error);
        showAlert('Failed to save record. Please try again.', 'danger');
    } finally {
        showLoading(false);
    }
}

// Edit record
function editRecord(sheetName, rowIndex, rowData) {
    currentEditRow = rowIndex;
    currentEditSheet = sheetName;
    
    if (sheetName === 'Profile') {
        // Fill profile form
        const form = document.getElementById('profileForm');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach((input, index) => {
            if (input.type !== 'file' && rowData[index] !== undefined) {
                input.value = rowData[index] || '';
            }
        });
        
        // Show profile modal
        const modal = new bootstrap.Modal(document.getElementById('profileEditModal'));
        modal.show();
    } else {
        // Generate and fill dynamic form
        showAddModal(sheetName);
        
        // Wait for form to be generated, then fill it
        setTimeout(() => {
            const config = sheetConfigs[sheetName];
            config.fields.forEach((field, index) => {
                const input = document.getElementById(field);
                if (input && input.type !== 'file' && rowData[index] !== undefined) {
                    input.value = rowData[index] || '';
                }
            });
            
            // Update modal title
            document.getElementById('dynamicModalTitle').textContent = `Edit ${sheetName}`;
            document.getElementById('dynamicModalSubtitle').textContent = `Update ${sheetName.toLowerCase()} record`;
        }, 100);
    }
}

// Delete record
async function deleteRecord(sheetName, rowIndex) {
    if (!confirm(`Are you sure you want to delete this ${sheetName.toLowerCase()} record? This action cannot be undone.`)) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`/api/delete/${sheetName}/${rowIndex}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Record deleted successfully!', 'success');
            
            // Refresh data
            await loadDataCount(sheetName);
            
            // If data view modal is open, refresh it
            const dataModal = bootstrap.Modal.getInstance(document.getElementById('dataViewModal'));
            if (dataModal && dataModal._isShown) {
                await viewData(sheetName);
            }
        } else {
            showAlert(`Error deleting record: ${result.error}`, 'danger');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        showAlert('Failed to delete record. Please try again.', 'danger');
    } finally {
        showLoading(false);
    }
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Reset forms when modals are hidden
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
            }
            
            // Reset edit state
            if (this.id !== 'dataViewModal') {
                currentEditRow = null;
                currentEditSheet = null;
            }
        });
    });
    
    // File upload preview
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file' && e.target.accept === 'image/*') {
            const file = e.target.files[0];
            if (file) {
                const uploadText = e.target.parentElement.querySelector('.file-upload-text');
                uploadText.innerHTML = `
                    <i class="fas fa-check-circle me-2 text-success"></i>
                    ${file.name} selected
                `;
            }
        }
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);