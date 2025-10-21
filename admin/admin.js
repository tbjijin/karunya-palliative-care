// Admin Panel JavaScript
const ADMIN_PASSWORD = "karunya2024"; // Change this password
let isLoggedIn = false;
let currentEditId = null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
});

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        showLoginError('Invalid password. Please try again.');
    }
});

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    isLoggedIn = true;
    
    // Initialize admin panel
    updateStatistics();
    loadDonorsTable();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Search functionality
function switchSearchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.search-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide search forms
    document.getElementById('searchById').style.display = tab === 'id' ? 'block' : 'none';
    document.getElementById('searchByName').style.display = tab === 'name' ? 'block' : 'none';
    
    // Clear previous results
    document.getElementById('searchResults').innerHTML = '';
}

function searchDonorById() {
    const donorId = document.getElementById('donorIdInput').value.trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!donorId) {
        resultsDiv.innerHTML = '<div class="error">Please enter a donor ID</div>';
        return;
    }

    const donors = donorManager.donors;
    let foundDonor = null;
    
    // Search in individual donors
    foundDonor = donors.individual.find(donor => donor.id === donorId);
    if (!foundDonor) {
        // Search in corporate donors
        foundDonor = donors.corporate.find(donor => donor.id === donorId);
    }

    if (foundDonor) {
        resultsDiv.innerHTML = createDonorCard(foundDonor);
    } else {
        resultsDiv.innerHTML = '<div class="error">Donor not found</div>';
    }
}

function searchDonorByName() {
    const donorName = document.getElementById('donorNameInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!donorName) {
        resultsDiv.innerHTML = '<div class="error">Please enter a donor name</div>';
        return;
    }

    const donors = donorManager.donors;
    const foundDonors = [];
    
    // Search in individual donors
    donors.individual.forEach(donor => {
        if (donor.name.toLowerCase().includes(donorName)) {
            foundDonors.push(donor);
        }
    });
    
    // Search in corporate donors
    donors.corporate.forEach(donor => {
        if (donor.name.toLowerCase().includes(donorName)) {
            foundDonors.push(donor);
        }
    });

    if (foundDonors.length > 0) {
        let html = '<div class="search-results-header">Found ' + foundDonors.length + ' donor(s)</div>';
        foundDonors.forEach(donor => {
            html += createDonorCard(donor);
        });
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = '<div class="error">No donors found with that name</div>';
    }
}

function createDonorCard(donor) {
    return `
        <div class="donor-card">
            <div class="donor-card-header">
                <h3>${donor.name}</h3>
                <span class="donor-id">ID: ${donor.id}</span>
            </div>
            <div class="donor-card-body">
                <div class="donor-detail">
                    <strong>Amount:</strong> ₹${donor.amount.toLocaleString()}
                </div>
                <div class="donor-detail">
                    <strong>Type:</strong> ${donor.type === 'monthly' ? 'Monthly' : 'One-time'}
                </div>
                <div class="donor-detail">
                    <strong>Category:</strong> ${donor.id.startsWith('KC') ? 'Corporate' : 'Individual'}
                </div>
                <div class="donor-detail">
                    <strong>Date:</strong> ${donor.date}
                </div>
                <div class="donor-detail">
                    <strong>Message:</strong> "${donor.message}"
                </div>
            </div>
            <div class="donor-card-actions">
                <button onclick="editDonor('${donor.id}')" class="btn-edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteDonor('${donor.id}')" class="btn-delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

// Donor form functionality
document.getElementById('donorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const donorData = {
        name: formData.get('name'),
        amount: parseInt(formData.get('amount')),
        message: formData.get('message') || '',
        type: formData.get('type'),
        anonymous: document.getElementById('donorAnonymous').checked,
        isCorporate: formData.get('category') === 'corporate'
    };

    if (currentEditId) {
        // Update existing donor
        updateDonor(currentEditId, donorData);
    } else {
        // Add new donor
        donorManager.addDonor(donorData);
        showNotification('Donor added successfully!', 'success');
    }
    
    updateStatistics();
    loadDonorsTable();
    clearForm();
});

function editDonor(donorId) {
    const donors = donorManager.donors;
    let donor = donors.individual.find(d => d.id === donorId);
    if (!donor) {
        donor = donors.corporate.find(d => d.id === donorId);
    }
    
    if (donor) {
        currentEditId = donorId;
        document.getElementById('editDonorId').value = donorId;
        document.getElementById('donorName').value = donor.name;
        document.getElementById('donorAmount').value = donor.amount;
        document.getElementById('donorMessage').value = donor.message;
        document.getElementById('donorType').value = donor.type;
        document.getElementById('donorCategory').value = donor.id.startsWith('KC') ? 'corporate' : 'individual';
        document.getElementById('donorAnonymous').checked = donor.name === 'Anonymous';
        document.getElementById('submitText').textContent = 'Update Donor';
        
        // Scroll to form
        document.getElementById('donorForm').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateDonor(donorId, donorData) {
    const donors = donorManager.donors;
    let donorIndex = -1;
    let donorArray = null;
    
    // Find donor in individual array
    donorIndex = donors.individual.findIndex(d => d.id === donorId);
    if (donorIndex !== -1) {
        donorArray = donors.individual;
    } else {
        // Find donor in corporate array
        donorIndex = donors.corporate.findIndex(d => d.id === donorId);
        if (donorIndex !== -1) {
            donorArray = donors.corporate;
        }
    }
    
    if (donorIndex !== -1 && donorArray) {
        // Update donor data
        donorArray[donorIndex].name = donorData.anonymous ? 'Anonymous' : donorData.name;
        donorArray[donorIndex].amount = donorData.amount;
        donorArray[donorIndex].message = donorData.message;
        donorArray[donorIndex].type = donorData.type;
        donorArray[donorIndex].date = new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        donorManager.saveDonors();
        showNotification('Donor updated successfully!', 'success');
    }
}

function deleteDonor(donorId) {
    if (confirm('Are you sure you want to delete this donor? This action cannot be undone.')) {
        const donors = donorManager.donors;
        let donorIndex = -1;
        let donorArray = null;
        
        // Find donor in individual array
        donorIndex = donors.individual.findIndex(d => d.id === donorId);
        if (donorIndex !== -1) {
            donorArray = donors.individual;
        } else {
            // Find donor in corporate array
            donorIndex = donors.corporate.findIndex(d => d.id === donorId);
            if (donorIndex !== -1) {
                donorArray = donors.corporate;
            }
        }
        
        if (donorIndex !== -1 && donorArray) {
            donorArray.splice(donorIndex, 1);
            
            // Update stats
            if (donorArray === donors.individual) {
                donors.stats.individualCount--;
                donors.stats.totalIndividual--;
            } else {
                donors.stats.corporateCount--;
                donors.stats.totalCorporate--;
            }
            
            donorManager.saveDonors();
            updateStatistics();
            loadDonorsTable();
            showNotification('Donor deleted successfully!', 'success');
        }
    }
}

function clearForm() {
    document.getElementById('donorForm').reset();
    currentEditId = null;
    document.getElementById('editDonorId').value = '';
    document.getElementById('submitText').textContent = 'Add Donor';
}

// Export to Excel
function exportToExcel() {
    const donors = donorManager.donors;
    const allDonors = [
        ...donors.individual.map(d => ({...d, category: 'Individual'})),
        ...donors.corporate.map(d => ({...d, category: 'Corporate'}))
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(allDonors.map(donor => ({
        'Donor ID': donor.id,
        'Name': donor.name,
        'Amount (₹)': donor.amount,
        'Type': donor.type === 'monthly' ? 'Monthly' : 'One-time',
        'Category': donor.category,
        'Message': donor.message,
        'Date': donor.date
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Donors');
    
    const fileName = `karunya-donors-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showNotification('Excel file exported successfully!', 'success');
}

// Statistics functions
function updateStatistics() {
    const stats = donorManager.donors.stats;
    const totalAmount = calculateTotalAmount();
    
    document.getElementById('individualCount').textContent = stats.individualCount;
    document.getElementById('corporateCount').textContent = stats.corporateCount;
    document.getElementById('totalCount').textContent = stats.individualCount + stats.corporateCount;
    document.getElementById('totalAmount').textContent = `₹${totalAmount.toLocaleString()}`;
}

function calculateTotalAmount() {
    const donors = donorManager.donors;
    let total = 0;
    
    donors.individual.forEach(donor => total += donor.amount);
    donors.corporate.forEach(donor => total += donor.amount);
    
    return total;
}

// Load donors table
function loadDonorsTable() {
    const donors = donorManager.donors;
    const allDonors = [
        ...donors.individual.map(d => ({...d, category: 'Individual'})),
        ...donors.corporate.map(d => ({...d, category: 'Corporate'}))
    ];
    
    // Sort by date (most recent first)
    allDonors.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tbody = document.getElementById('donorsTableBody');
    tbody.innerHTML = '';
    
    allDonors.slice(0, 20).forEach(donor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donor.id}</td>
            <td>${donor.name}</td>
            <td>₹${donor.amount.toLocaleString()}</td>
            <td>${donor.type === 'monthly' ? 'Monthly' : 'One-time'}</td>
            <td>${donor.category}</td>
            <td>${donor.date}</td>
            <td>
                <button onclick="editDonor('${donor.id}')" class="btn-edit-small">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteDonor('${donor.id}')" class="btn-delete-small">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Management functions
function addSampleDonors() {
    const sampleDonors = [
        { name: "Dr. Priya Nair", amount: 5000, message: "Supporting compassionate care", type: "one-time", isCorporate: false },
        { name: "Kerala Medical Association", amount: 50000, message: "Proud to support palliative care", type: "one-time", isCorporate: true },
        { name: "Anonymous", amount: 1000, message: "Every little helps", type: "one-time", isCorporate: false },
        { name: "Thrissur Rotary Club", amount: 30000, message: "Service above self", type: "one-time", isCorporate: true }
    ];
    
    sampleDonors.forEach(donor => {
        donorManager.addDonor(donor);
    });
    
    updateStatistics();
    loadDonorsTable();
    showNotification('Sample donors added successfully!', 'success');
}

function refreshData() {
    updateStatistics();
    loadDonorsTable();
    showNotification('Data refreshed successfully!', 'success');
}

function clearAllDonors() {
    if (confirm('Are you sure you want to clear all donors? This action cannot be undone.')) {
        donorManager.donors = {
            individual: [],
            corporate: [],
            stats: {
                individualCount: 0,
                corporateCount: 0,
                totalIndividual: 0,
                totalCorporate: 0
            }
        };
        donorManager.saveDonors();
        updateStatistics();
        loadDonorsTable();
        showNotification('All donors have been cleared.', 'warning');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
