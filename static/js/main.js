// DataHub Revolution - Enhanced Interactive JavaScript
// Revolutionary Glassmorphism Design with Advanced Animations

// Global Configuration & State Management
let currentEditRow = null
let currentEditSheet = null
const currentSheetData = {}
let isLoading = false

// Bootstrap library reference
const bootstrap = window.bootstrap

// Revolutionary Sheet Configurations
const sheetConfigs = {
  Profile: {
    icon: "fas fa-user-astronaut",
    title: "Personal Profile Management",
    subtitle: "Manage your personal information and professional summary",
    fields: [
      "nama_lengkap",
      "profesi",
      "Deskripsi",
      "Foto_Profil_URL",
      "Email",
      "Nomor_Telepon",
      "Lokasi",
      "Link_LinkedIn",
      "Link_GitHub",
    ],
    labels: [
      "Full Name",
      "Profession",
      "Professional Description",
      "Profile Photo URL",
      "Email Address",
      "Phone Number",
      "Location",
      "LinkedIn Profile",
      "GitHub Profile",
    ],
    allowCreate: false,
    hasImage: true,
    imageField: "Foto_Profil_URL",
    color: "profile",
    gradient: "var(--gradient-primary)",
  },
  Experience: {
    icon: "fas fa-rocket",
    title: "Work Experience Management",
    subtitle: "Track your professional journey and career milestones",
    fields: ["ID_pengalaman", "Posisi", "Tanggal_Mulai", "Tanggal_Selesai", "Deskripsi"],
    labels: ["Experience ID", "Position/Role", "Start Date", "End Date", "Job Description"],
    allowCreate: true,
    hasImage: false,
    color: "experience",
    gradient: "var(--gradient-secondary)",
  },
  Certifications: {
    icon: "fas fa-medal",
    title: "Certifications & Achievements",
    subtitle: "Showcase your professional certificates and accomplishments",
    fields: ["ID_Sertifikasi", "Nama_Sertifikasi", "Tanggal_Diterbitkan", "Gambar_Sertifikasi_URL", "Deskripsi"],
    labels: ["Certification ID", "Certification Name", "Issue Date", "Certificate Image", "Description"],
    allowCreate: true,
    hasImage: true,
    imageField: "Gambar_Sertifikasi_URL",
    color: "certification",
    gradient: "var(--gradient-accent)",
  },
  Project: {
    icon: "fas fa-satellite",
    title: "Portfolio Projects",
    subtitle: "Manage your project portfolio and showcase your work",
    fields: ["ID_project", "Nama_Proyek", "Deskripsi", "Skill", "Link", "Gambar_Proyek_URL"],
    labels: [
      "Project ID",
      "Project Name",
      "Project Description",
      "Technologies/Skills",
      "Project Link",
      "Project Image",
    ],
    allowCreate: true,
    hasImage: true,
    imageField: "Gambar_Proyek_URL",
    color: "project",
    gradient: "var(--gradient-success)",
  },
}

// Revolutionary Utility Functions
function showAlert(message, type = "success", duration = 6000) {
  const alertContainer = document.getElementById("alertContainer")
  const alertId = "alert-" + Date.now()

  const icons = {
    success: "check-circle",
    danger: "exclamation-triangle",
    warning: "exclamation-circle",
    info: "info-circle",
  }

  const alertHTML = `
    <div class="alert alert-${type}" id="${alertId}">
      <div class="alert-icon">
        <i class="fas fa-${icons[type]}"></i>
      </div>
      <div class="alert-content">
        <div class="alert-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div class="alert-message">${message}</div>
      </div>
      <button class="alert-close" onclick="closeAlert('${alertId}')" aria-label="Close alert">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  alertContainer.insertAdjacentHTML("beforeend", alertHTML)

  // Auto-remove with enhanced animation
  setTimeout(() => {
    closeAlert(alertId)
  }, duration)
}

function closeAlert(alertId) {
  const alert = document.getElementById(alertId)
  if (alert) {
    alert.style.transform = "translateX(100%) scale(0.8)"
    alert.style.opacity = "0"
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove()
      }
    }, 300)
  }
}

function showLoading(show = true, message = "Processing your request...") {
  const overlay = document.getElementById("loadingOverlay")
  const loadingText = overlay.querySelector(".loading-text")

  if (show && !isLoading) {
    isLoading = true
    loadingText.textContent = message
    overlay.classList.remove("d-none")
    document.body.style.overflow = "hidden"

    // Animate progress bar
    const progressBar = overlay.querySelector(".loading-progress .progress-bar")
    if (progressBar) {
      progressBar.style.animation = "loadingProgress 2s ease-in-out infinite"
    }
  } else if (!show && isLoading) {
    isLoading = false
    overlay.classList.add("d-none")
    document.body.style.overflow = "auto"
  }
}

async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"))
      return
    }

    // Enhanced file validation
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("File size must be less than 10MB"))
      return
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image"))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

// Revolutionary Dashboard Initialization
async function initializeDashboard() {
  showLoading(true, "Initializing revolutionary dashboard...")

  try {
    // Load data counts for all sheets with enhanced progress tracking
    const sheets = ["Profile", "Experience", "Certifications", "Project"]
    const promises = sheets.map((sheet, index) => {
      return new Promise(async (resolve) => {
        await new Promise((r) => setTimeout(r, index * 200)) // Staggered loading
        await loadDataCount(sheet)
        resolve()
      })
    })

    await Promise.all(promises)

    // Enhanced card interactions
    enhanceCardInteractions()

    // Initialize revolutionary features
    initializeRevolutionaryFeatures()

    showAlert("Revolutionary dashboard initialized successfully!", "success", 4000)
  } catch (error) {
    console.error("Error initializing dashboard:", error)
    showAlert("Failed to initialize dashboard. Please refresh the page.", "danger")
  } finally {
    showLoading(false)
  }
}

function enhanceCardInteractions() {
  document.querySelectorAll(".data-card").forEach((card) => {
    const sheet = card.dataset.sheet
    const config = sheetConfigs[sheet]

    // Enhanced click handler with ripple effect
    card.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        createRippleEffect(e, card)
        setTimeout(() => viewData(sheet), 150)
      }
    })

    // Enhanced keyboard navigation
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (!e.target.closest("button")) {
          createRippleEffect(e, card)
          setTimeout(() => viewData(sheet), 150)
        }
      }
    })

    // Enhanced focus management
    card.addEventListener("focus", () => {
      card.style.boxShadow = "var(--shadow-glow)"
    })

    card.addEventListener("blur", () => {
      card.style.boxShadow = "var(--shadow-float)"
    })
  })
}

function createRippleEffect(event, element) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `

  element.style.position = "relative"
  element.style.overflow = "hidden"
  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

function initializeRevolutionaryFeatures() {
  // Add CSS for ripple animation
  if (!document.getElementById("ripple-styles")) {
    const style = document.createElement("style")
    style.id = "ripple-styles"
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // Initialize intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  document.querySelectorAll(".data-card, .overview-stats").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    observer.observe(el)
  })
}

// Enhanced Data Count Loading with Revolutionary Animations
async function loadDataCount(sheetName, retryCount = 0) {
  const maxRetries = 3

  try {
    const response = await fetch(`/api/data/${sheetName}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      const count = Math.max(0, result.data.length - 1)
      const countElement = document.getElementById(`${sheetName.toLowerCase()}Count`)

      if (countElement) {
        animateCountUpdate(countElement, count)
      }

      currentSheetData[sheetName] = result.data
    } else {
      throw new Error(result.error || "Unknown error occurred")
    }
  } catch (error) {
    console.error(`Error loading ${sheetName} count:`, error)

    if (retryCount < maxRetries) {
      console.log(`Retrying ${sheetName} (attempt ${retryCount + 1}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)))
      return loadDataCount(sheetName, retryCount + 1)
    }

    const countElement = document.getElementById(`${sheetName.toLowerCase()}Count`)
    if (countElement) {
      countElement.textContent = "?"
      countElement.style.color = "var(--danger)"
    }

    showAlert(`Failed to load ${sheetName} data after ${maxRetries} attempts`, "warning")
  }
}

function animateCountUpdate(element, targetCount) {
  const currentCount = Number.parseInt(element.textContent) || 0
  const increment = targetCount > currentCount ? 1 : -1
  const duration = Math.min(Math.abs(targetCount - currentCount) * 80, 1500)
  const stepTime = duration / Math.abs(targetCount - currentCount) || 1

  let current = currentCount

  const timer = setInterval(() => {
    current += increment
    element.textContent = current

    if (current === targetCount) {
      clearInterval(timer)
      // Enhanced completion animation
      element.style.transform = "scale(1.2)"
      element.style.color = "var(--primary)"
      setTimeout(() => {
        element.style.transform = "scale(1)"
        element.style.color = ""
      }, 300)
    }
  }, stepTime)
}

// Revolutionary View Data Function
async function viewData(sheetName) {
  const config = sheetConfigs[sheetName]
  const modal = document.getElementById("dataViewModal")
  const container = document.getElementById("dataTableContainer")

  // Update modal header with revolutionary styling
  const modalIcon = document.getElementById("modalIcon")
  modalIcon.innerHTML = `<i class="${config.icon}"></i>`
  modalIcon.className = `modal-icon ${config.color}-icon`
  modalIcon.style.background = config.gradient

  document.getElementById("modalTitle").textContent = config.title
  document.getElementById("modalSubtitle").textContent = config.subtitle

  // Revolutionary loading state
  container.innerHTML = `
    <div class="text-center p-5">
      <div class="loading-spinner-container">
        <div class="loading-spinner"></div>
        <div class="loading-orbit"></div>
        <div class="loading-orbit orbit-2"></div>
      </div>
      <div class="loading-text">Loading ${sheetName} data...</div>
      <div class="loading-subtext">Please wait while we fetch your records securely</div>
    </div>
  `

  // Show modal with enhanced animation
  const modalInstance = new bootstrap.Modal(modal, {
    backdrop: "static",
    keyboard: true,
  })
  modalInstance.show()

  try {
    const response = await fetch(`/api/data/${sheetName}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.success) {
      renderDataTable(sheetName, result.data, container)
    } else {
      throw new Error(result.error || "Failed to load data")
    }
  } catch (error) {
    console.error("Error loading data:", error)
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="${config.icon}"></i>
        </div>
        <h3 class="empty-state-title">Error Loading Data</h3>
        <p class="empty-state-description">${error.message}</p>
        <button class="btn btn-primary" onclick="viewData('${sheetName}')">
          <i class="fas fa-refresh me-2"></i>Try Again
        </button>
      </div>
    `
  }
}

// Revolutionary Table Rendering
function renderDataTable(sheetName, data, container) {
  const config = sheetConfigs[sheetName]

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="${config.icon}"></i>
        </div>
        <h3 class="empty-state-title">No Data Available</h3>
        <p class="empty-state-description">No ${sheetName.toLowerCase()} records found in your database.</p>
        ${
          config.allowCreate
            ? `
          <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
            <i class="fas fa-plus me-2"></i>Add First Record
          </button>
        `
            : ""
        }
      </div>
    `
    return
  }

  const headers = data[0]
  const rows = data.slice(1)

  if (rows.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="${config.icon}"></i>
        </div>
        <h3 class="empty-state-title">No Records Found</h3>
        <p class="empty-state-description">Your ${sheetName.toLowerCase()} database is empty.</p>
        ${
          config.allowCreate
            ? `
          <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
            <i class="fas fa-plus me-2"></i>Add First Record
          </button>
        `
            : ""
        }
      </div>
    `
    return
  }

  let tableHTML = `
    <div class="table-container">
      <table class="table" role="table" aria-label="${sheetName} data table">
        <thead>
          <tr role="row">
            ${headers
              .map(
                (header, index) => `
              <th scope="col" role="columnheader" tabindex="0" onclick="sortTable(this, ${index})" style="cursor: pointer;">
                ${header}
                <i class="fas fa-sort ms-1 opacity-50"></i>
              </th>
            `,
              )
              .join("")}
            <th scope="col" width="120" role="columnheader">Actions</th>
          </tr>
        </thead>
        <tbody>
  `

  rows.forEach((row, index) => {
    const rowIndex = index + 2
    tableHTML += `
      <tr role="row" tabindex="0">
        ${row
          .map((cell, cellIndex) => {
            const header = headers[cellIndex]

            // Enhanced image handling
            if (
              header &&
              (header.includes("URL") || header.includes("Foto") || header.includes("Gambar")) &&
              cell &&
              cell.startsWith("http")
            ) {
              return `
              <td role="gridcell">
                <img src="${cell}" 
                     alt="Image for ${row[0] || "record"}" 
                     class="image-thumbnail"
                     loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span style="display:none;" class="text-muted">
                  <i class="fas fa-image me-1"></i>Image unavailable
                </span>
              </td>
            `
            }

            // Enhanced link handling
            if (header && header.includes("Link") && cell && cell.startsWith("http")) {
              return `
              <td role="gridcell">
                <a href="${cell}" target="_blank" rel="noopener noreferrer" class="text-decoration-none">
                  <i class="fas fa-external-link-alt me-1"></i>
                  ${cell.length > 30 ? cell.substring(0, 30) + "..." : cell}
                </a>
              </td>
            `
            }

            // Enhanced date handling
            if (header && header.includes("Tanggal") && cell) {
              const date = new Date(cell)
              if (!isNaN(date.getTime())) {
                return `
                <td role="gridcell">
                  <time datetime="${cell}">
                    ${date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </td>
              `
              }
            }

            // Enhanced text handling
            const displayText =
              cell && cell.length > 50
                ? `<span title="${cell}">${cell.substring(0, 50)}...</span>`
                : cell || '<span class="text-muted">—</span>'

            return `<td role="gridcell">${displayText}</td>`
          })
          .join("")}
        <td role="gridcell">
          <div class="action-buttons" role="group" aria-label="Row actions">
            <button class="action-btn action-btn-edit" 
                    onclick="editRecord('${sheetName}', ${rowIndex}, ${JSON.stringify(row).replace(/"/g, "&quot;")})" 
                    title="Edit this record"
                    aria-label="Edit record">
              <i class="fas fa-edit"></i>
            </button>
            ${
              sheetName !== "Profile"
                ? `
              <button class="action-btn action-btn-delete" 
                      onclick="deleteRecord('${sheetName}', ${rowIndex})" 
                      title="Delete this record"
                      aria-label="Delete record">
                <i class="fas fa-trash"></i>
              </button>
            `
                : ""
            }
          </div>
        </td>
      </tr>
    `
  })

  tableHTML += `
        </tbody>
      </table>
      ${
        config.allowCreate
          ? `
        <div class="p-3 border-top bg-light d-flex justify-content-between align-items-center">
          <span class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            ${rows.length} record${rows.length !== 1 ? "s" : ""} found
          </span>
          <button class="btn btn-primary" onclick="showAddModal('${sheetName}')">
            <i class="fas fa-plus me-2"></i>Add New ${sheetName}
          </button>
        </div>
      `
          : ""
      }
    </div>
  `

  container.innerHTML = tableHTML
}

function sortTable(header, columnIndex) {
  const table = header.closest("table")
  const tbody = table.querySelector("tbody")
  const rows = Array.from(tbody.querySelectorAll("tr"))
  const currentSort = header.getAttribute("aria-sort") || "none"
  const isAscending = currentSort !== "ascending"

  // Reset all headers
  table.querySelectorAll("thead th[aria-sort]").forEach((th) => {
    th.setAttribute("aria-sort", "none")
    th.querySelector("i").className = "fas fa-sort ms-1 opacity-50"
  })

  // Sort rows
  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim()
    const bText = b.cells[columnIndex].textContent.trim()

    // Try to parse as numbers
    const aNum = Number.parseFloat(aText)
    const bNum = Number.parseFloat(bText)

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return isAscending ? aNum - bNum : bNum - aNum
    }

    // Try to parse as dates
    const aDate = new Date(aText)
    const bDate = new Date(bText)

    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return isAscending ? aDate - bDate : bDate - aDate
    }

    // Default to string comparison
    return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText)
  })

  // Update DOM
  rows.forEach((row) => tbody.appendChild(row))

  // Update header
  header.setAttribute("aria-sort", isAscending ? "ascending" : "descending")
  header.querySelector("i").className = `fas fa-sort-${isAscending ? "up" : "down"} ms-1`
}

// Revolutionary Modal Functions
function showEditModal(sheetName) {
  if (sheetName === "Profile") {
    loadProfileForEdit()
  }
}

async function loadProfileForEdit() {
  try {
    showLoading(true, "Loading profile data...")

    const response = await fetch("/api/data/Profile")
    const result = await response.json()

    if (result.success && result.data && result.data.length > 1) {
      const headers = result.data[0]
      const profileData = result.data[1]

      const form = document.getElementById("profileForm")
      const inputs = form.querySelectorAll("input, textarea")

      inputs.forEach((input, index) => {
        if (input.type !== "file" && profileData[index] !== undefined) {
          input.value = profileData[index] || ""
        }
      })

      currentEditRow = 2
      currentEditSheet = "Profile"

      const modal = new bootstrap.Modal(document.getElementById("profileEditModal"))
      modal.show()
    } else {
      showAlert("No profile data found to edit", "warning")
    }
  } catch (error) {
    console.error("Error loading profile:", error)
    showAlert("Failed to load profile data", "danger")
  } finally {
    showLoading(false)
  }
}

function showAddModal(sheetName) {
  if (sheetName === "Profile") return

  const config = sheetConfigs[sheetName]
  const modal = document.getElementById("dynamicFormModal")

  // Update modal header with revolutionary styling
  const modalIcon = document.getElementById("dynamicModalIcon")
  modalIcon.innerHTML = `<i class="${config.icon}"></i>`
  modalIcon.className = `modal-icon ${config.color}-icon`
  modalIcon.style.background = config.gradient

  document.getElementById("dynamicModalTitle").textContent = `Add ${sheetName}`
  document.getElementById("dynamicModalSubtitle").textContent =
    `Create new ${sheetName.toLowerCase()} record with our revolutionary interface`

  // Generate revolutionary horizontal form
  generateDynamicForm(sheetName)

  currentEditRow = null
  currentEditSheet = sheetName

  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()
}

function generateDynamicForm(sheetName) {
  const config = sheetConfigs[sheetName]
  const container = document.getElementById("dynamicFormContainer")

  let formHTML = `<form id="dynamicForm" enctype="multipart/form-data">`

  if (config.hasImage) {
    // Horizontal layout with image upload
    formHTML += `
      <div class="horizontal-form">
        <div class="form-left">
          <div class="form-group">
            <label for="${config.imageField}" class="form-label">
              <i class="fas fa-image me-2"></i>${config.labels[config.fields.indexOf(config.imageField)]}
            </label>
            <div class="file-upload-container">
              <div class="file-upload" id="dynamicImageUpload">
                <input type="file" id="${config.imageField}" accept="image/*">
                <div class="file-upload-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="file-upload-text">
                  <strong>Choose image or drag and drop</strong><br>
                  <small>PNG, JPG, GIF up to 10MB</small>
                </div>
                <div class="upload-progress">
                  <div class="progress-bar"></div>
                </div>
              </div>
              <div class="image-preview" id="dynamicImagePreview">
                <img class="preview-image" id="dynamicPreviewImg" alt="Preview">
                <div class="preview-info">
                  <div class="preview-filename" id="dynamicPreviewFilename"></div>
                  <div class="preview-size" id="dynamicPreviewSize"></div>
                  <button type="button" class="remove-image" onclick="removeImage('dynamic')">
                    <i class="fas fa-trash me-1"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-right">
          <div class="form-grid">
    `
  } else {
    formHTML += `<div class="form-grid">`
  }

  config.fields.forEach((field, index) => {
    const label = config.labels[index]
    const isRequired = index < 2
    const isImage = config.hasImage && field === config.imageField

    if (!isImage) {
      if (field.includes("Deskripsi")) {
        formHTML += `
          <div class="form-group form-grid-full">
            <label for="${field}" class="form-label">
              <i class="fas fa-align-left me-2"></i>${label}${isRequired ? " *" : ""}
            </label>
            <textarea class="form-control" id="${field}" name="${field}" rows="4" ${isRequired ? "required" : ""} placeholder="Enter ${label.toLowerCase()}..."></textarea>
            <div class="input-focus-line"></div>
          </div>
        `
      } else if (field.includes("Tanggal")) {
        formHTML += `
          <div class="form-group">
            <label for="${field}" class="form-label">
              <i class="fas fa-calendar me-2"></i>${label}${isRequired ? " *" : ""}
            </label>
            <input type="date" class="form-control" id="${field}" name="${field}" ${isRequired ? "required" : ""}>
            <div class="input-focus-line"></div>
          </div>
        `
      } else {
        const inputType = field.includes("Email") ? "email" : field.includes("Link") ? "url" : "text"
        const icon = field.includes("Email")
          ? "envelope"
          : field.includes("Link")
            ? "link"
            : field.includes("ID")
              ? "hashtag"
              : "text-width"

        formHTML += `
          <div class="form-group">
            <label for="${field}" class="form-label">
              <i class="fas fa-${icon} me-2"></i>${label}${isRequired ? " *" : ""}
            </label>
            <input type="${inputType}" class="form-control" id="${field}" name="${field}" ${isRequired ? "required" : ""} placeholder="Enter ${label.toLowerCase()}...">
            <div class="input-focus-line"></div>
          </div>
        `
      }
    }
  })

  if (config.hasImage) {
    formHTML += `
          </div>
        </div>
      </div>
    `
  } else {
    formHTML += `</div>`
  }

  formHTML += `</form>`
  container.innerHTML = formHTML

  // Initialize image preview for dynamic form
  if (config.hasImage) {
    const imageInput = document.getElementById(config.imageField)
    if (imageInput) {
      imageInput.addEventListener("change", (e) => {
        handleDynamicImagePreview(e)
      })
    }
  }

  document.getElementById("saveDynamicRecord").onclick = () => saveDynamicRecord(sheetName)
}

function handleDynamicImagePreview(event) {
  const file = event.target.files[0]
  const uploadArea = document.getElementById("dynamicImageUpload")
  const previewArea = document.getElementById("dynamicImagePreview")
  const previewImg = document.getElementById("dynamicPreviewImg")
  const previewFilename = document.getElementById("dynamicPreviewFilename")
  const previewSize = document.getElementById("dynamicPreviewSize")

  if (file) {
    // Validate file
    if (!file.type.startsWith("image/")) {
      showAlert("Please select a valid image file", "danger")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showAlert("File size must be less than 10MB", "danger")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImg.src = e.target.result
      previewFilename.textContent = file.name
      previewSize.textContent = formatFileSize(file.size)

      // Show preview and update upload area
      previewArea.classList.add("show")
      uploadArea.classList.add("has-file")
      uploadArea.querySelector(".file-upload-text").innerHTML =
        "<strong>Image selected successfully!</strong><br><small>Click to change image</small>"
      uploadArea.querySelector(".file-upload-icon").innerHTML = '<i class="fas fa-check-circle"></i>'
    }
    reader.readAsDataURL(file)
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function removeImage(type) {
  let input, uploadArea, previewArea

  if (type === "profile") {
    input = document.getElementById("profileImage")
    uploadArea = document.getElementById("profileImageUpload")
    previewArea = document.getElementById("profileImagePreview")
  } else {
    // Find the dynamic image input
    const config = sheetConfigs[currentEditSheet]
    input = document.getElementById(config.imageField)
    uploadArea = document.getElementById("dynamicImageUpload")
    previewArea = document.getElementById("dynamicImagePreview")
  }

  // Clear input
  input.value = ""

  // Hide preview
  previewArea.classList.remove("show")
  uploadArea.classList.remove("has-file")

  // Reset upload area
  uploadArea.querySelector(".file-upload-text").innerHTML =
    "<strong>Choose image or drag and drop</strong><br><small>PNG, JPG, GIF up to 10MB</small>"
  uploadArea.querySelector(".file-upload-icon").innerHTML = '<i class="fas fa-cloud-upload-alt"></i>'
}

// Revolutionary Save Functions
async function saveProfile() {
  const form = document.getElementById("profileForm")
  const formData = new FormData(form)
  const data = {}

  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  const imageFile = document.getElementById("profileImage").files[0]
  if (imageFile) {
    showLoading(true, "Processing image...")
    try {
      const base64Image = await convertFileToBase64(imageFile)
      data.image_data = base64Image
    } catch (error) {
      showLoading(false)
      showAlert("Error processing image file: " + error.message, "danger")
      return
    }
  }

  await saveRecord("Profile", data)
}

async function saveDynamicRecord(sheetName) {
  const form = document.getElementById("dynamicForm")
  const formData = new FormData(form)
  const data = {}
  const config = sheetConfigs[sheetName]

  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  if (config.hasImage && config.imageField) {
    const imageFile = document.getElementById(config.imageField).files[0]
    if (imageFile) {
      showLoading(true, "Processing image...")
      try {
        const base64Image = await convertFileToBase64(imageFile)
        data.image_data = base64Image
      } catch (error) {
        showLoading(false)
        showAlert("Error processing image file: " + error.message, "danger")
        return
      }
    }
  }

  await saveRecord(sheetName, data)
}

async function saveRecord(sheetName, data) {
  showLoading(true, currentEditRow ? "Updating record..." : "Creating record...")

  try {
    let url, method

    if (currentEditRow) {
      url = `/api/update/${sheetName}/${currentEditRow}`
      method = "PUT"
    } else {
      url = `/api/create/${sheetName}`
      method = "POST"
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      showAlert(currentEditRow ? "Record updated successfully!" : "Record created successfully!", "success")

      const modalId = sheetName === "Profile" ? "profileEditModal" : "dynamicFormModal"
      const modal = bootstrap.Modal.getInstance(document.getElementById(modalId))
      if (modal) modal.hide()

      currentEditRow = null
      currentEditSheet = null

      await loadDataCount(sheetName)

      const dataModal = bootstrap.Modal.getInstance(document.getElementById("dataViewModal"))
      if (dataModal && dataModal._isShown) {
        await viewData(sheetName)
      }
    } else {
      showAlert(`Error: ${result.error}`, "danger")
    }
  } catch (error) {
    console.error("Error saving record:", error)
    showAlert("Failed to save record. Please try again.", "danger")
  } finally {
    showLoading(false)
  }
}

function editRecord(sheetName, rowIndex, rowData) {
  currentEditRow = rowIndex
  currentEditSheet = sheetName

  if (sheetName === "Profile") {
    const form = document.getElementById("profileForm")
    const inputs = form.querySelectorAll("input, textarea")

    inputs.forEach((input, index) => {
      if (input.type !== "file" && rowData[index] !== undefined) {
        input.value = rowData[index] || ""
      }
    })

    const modal = new bootstrap.Modal(document.getElementById("profileEditModal"))
    modal.show()
  } else {
    showAddModal(sheetName)

    setTimeout(() => {
      const config = sheetConfigs[sheetName]
      config.fields.forEach((field, index) => {
        const input = document.getElementById(field)
        if (input && input.type !== "file" && rowData[index] !== undefined) {
          input.value = rowData[index] || ""
        }
      })

      document.getElementById("dynamicModalTitle").textContent = `Edit ${sheetName}`
      document.getElementById("dynamicModalSubtitle").textContent =
        `Update ${sheetName.toLowerCase()} record with our revolutionary interface`
    }, 100)
  }
}

async function deleteRecord(sheetName, rowIndex) {
  // Enhanced confirmation dialog
  const confirmed = await showConfirmDialog(
    `Delete ${sheetName} Record`,
    `Are you sure you want to delete this ${sheetName.toLowerCase()} record? This action cannot be undone.`,
    "Delete",
    "danger",
  )

  if (!confirmed) return

  showLoading(true, "Deleting record...")

  try {
    const response = await fetch(`/api/delete/${sheetName}/${rowIndex}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (result.success) {
      showAlert("Record deleted successfully!", "success")

      await loadDataCount(sheetName)

      const dataModal = bootstrap.Modal.getInstance(document.getElementById("dataViewModal"))
      if (dataModal && dataModal._isShown) {
        await viewData(sheetName)
      }
    } else {
      showAlert(`Error deleting record: ${result.error}`, "danger")
    }
  } catch (error) {
    console.error("Error deleting record:", error)
    showAlert("Failed to delete record. Please try again.", "danger")
  } finally {
    showLoading(false)
  }
}

// Revolutionary Confirmation Dialog
function showConfirmDialog(title, message, confirmText = "Confirm", type = "primary") {
  return new Promise((resolve) => {
    const modalHTML = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>${message}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-${type}" id="confirmBtn">${confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML("beforeend", modalHTML)

    const modal = new bootstrap.Modal(document.getElementById("confirmModal"))

    document.getElementById("confirmBtn").addEventListener("click", () => {
      modal.hide()
      resolve(true)
    })

    modal._element.addEventListener("hidden.bs.modal", () => {
      document.getElementById("confirmModal").remove()
      resolve(false)
    })

    modal.show()
  })
}

// Initialize Revolutionary Dashboard on DOM Load
document.addEventListener("DOMContentLoaded", initializeDashboard)

// Revolutionary Error Handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error)
  showAlert("An unexpected error occurred. Please refresh the page and try again.", "danger")
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  showAlert("A network error occurred. Please check your connection and try again.", "warning")
})
