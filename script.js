// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Donation Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Amount button functionality
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donationAmountInput = document.getElementById('donation-amount');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set the donation amount
            const amount = this.getAttribute('data-amount');
            if (donationAmountInput) {
                donationAmountInput.value = amount;
            }
        });
    });
    
    // Custom amount input
    if (customAmountInput && donationAmountInput) {
        customAmountInput.addEventListener('input', function() {
            // Remove active class from amount buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            // Update donation amount
            donationAmountInput.value = this.value;
        });
    }
    
    // Monthly donation options
    const monthlyOptions = document.querySelectorAll('input[name="monthly"]');
    monthlyOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked && donationAmountInput) {
                donationAmountInput.value = this.value;
            }
        });
    });
    
    // Donation type change
    const donationTypeSelect = document.getElementById('donation-type');
    if (donationTypeSelect) {
        donationTypeSelect.addEventListener('change', function() {
            const monthlySection = document.querySelector('.monthly-options');
            const quickDonationSection = document.querySelector('.amount-buttons');
            
            if (this.value === 'monthly') {
                if (monthlySection) monthlySection.style.display = 'block';
                if (quickDonationSection) quickDonationSection.style.display = 'none';
            } else if (this.value === 'one-time') {
                if (monthlySection) monthlySection.style.display = 'none';
                if (quickDonationSection) quickDonationSection.style.display = 'grid';
            } else {
                if (monthlySection) monthlySection.style.display = 'block';
                if (quickDonationSection) quickDonationSection.style.display = 'grid';
            }
        });
    }
    
    // Form submission
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const donationData = {
                name: formData.get('donor-name'),
                email: formData.get('donor-email'),
                phone: formData.get('donor-phone'),
                city: formData.get('donor-city'),
                type: formData.get('donation-type'),
                amount: formData.get('donation-amount'),
                message: formData.get('donation-message'),
                anonymous: formData.get('anonymous') === 'on',
                newsletter: formData.get('newsletter') === 'on'
            };
            
            // Validate required fields
            if (!donationData.name || !donationData.email || !donationData.phone || !donationData.type || !donationData.amount) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (parseFloat(donationData.amount) < 5) {
                alert('Minimum donation amount is ₹5.');
                return;
            }
            
            // Add donor to the list
            donorManager.addDonor(donationData);
            
            // Show confirmation message
            showDonationConfirmation(donationData);
        });
    }
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
            showCopySuccess();
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            showCopyError();
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showCopyError();
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    // Create a temporary success message
    const successMsg = document.createElement('div');
    successMsg.textContent = 'Copied to clipboard!';
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        document.body.removeChild(successMsg);
    }, 3000);
}

function showCopyError() {
    const errorMsg = document.createElement('div');
    errorMsg.textContent = 'Could not copy. Please try manually.';
    errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    `;
    
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        document.body.removeChild(errorMsg);
    }, 3000);
}

// Show donation confirmation
function showDonationConfirmation(data) {
    const confirmationModal = document.createElement('div');
    confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    confirmationModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #27ae60, #229954);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                color: white;
                font-size: 1.5rem;
            ">
                <i class="fas fa-check"></i>
            </div>
            <h3 style="color: #333; margin-bottom: 1rem;">Donation Details Confirmed</h3>
            <div style="text-align: left; margin-bottom: 2rem; background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Amount:</strong> ₹${data.amount}</p>
                <p><strong>Type:</strong> ${data.type === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}</p>
                ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
            </div>
            <div style="background: #e8f4fd; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: left;">
                <h4 style="color: #2c5aa0; margin-bottom: 0.5rem;">Next Steps:</h4>
                <ol style="color: #2c5aa0; padding-left: 1.5rem; margin: 0;">
                    <li>Make your payment using UPI or Bank Transfer</li>
                    <li>Email the payment receipt to karunya.palliative@gmail.com</li>
                    <li>We'll send you a confirmation receipt</li>
                </ol>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.closest('.modal').remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">Close</button>
                <button onclick="window.location.href='#payment-methods'" style="
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">Go to Payment</button>
            </div>
        </div>
    `;
    
    confirmationModal.className = 'modal';
    document.body.appendChild(confirmationModal);
    
    // Close modal when clicking outside
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.remove();
        }
    });
}

// Scroll animations
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Add scroll event listener for animations
window.addEventListener('scroll', handleScrollAnimations);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    handleScrollAnimations();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
}

// Add real-time validation to form fields
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('donor-email');
    const phoneInput = document.getElementById('donor-phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Please enter a valid email address');
            } else {
                this.style.borderColor = '#27ae60';
                hideFieldError(this);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                this.style.borderColor = '#e74c3c';
                showFieldError(this, 'Please enter a valid 10-digit phone number');
            } else {
                this.style.borderColor = '#27ae60';
                hideFieldError(this);
            }
        });
    }
});

function showFieldError(field, message) {
    hideFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Loading states for buttons
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-heart"></i> Proceed to Payment';
    }
}

// Print donation receipt (for future implementation)
function printReceipt(donationData) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Donation Receipt - Karunya Palliative Care</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .receipt-details { margin: 20px 0; }
                    .receipt-details p { margin: 10px 0; }
                    .footer { margin-top: 30px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Karunya Palliative Care</h1>
                    <p>Puthenpeedika, Anthikad</p>
                    <h2>Donation Receipt</h2>
                </div>
                <div class="receipt-details">
                    <p><strong>Donor Name:</strong> ${donationData.name}</p>
                    <p><strong>Email:</strong> ${donationData.email}</p>
                    <p><strong>Phone:</strong> ${donationData.phone}</p>
                    <p><strong>Amount:</strong> ₹${donationData.amount}</p>
                    <p><strong>Type:</strong> ${donationData.type === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="footer">
                    <p>Thank you for your generous donation!</p>
                    <p>This receipt is for your records.</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Donor Management System
class DonorManager {
    constructor() {
        this.donors = this.loadDonors();
        this.initializeDonorLists();
    }

    // Load donors from localStorage or initialize with sample data
    loadDonors() {
        const storedDonors = localStorage.getItem('karunyaDonors');
        if (storedDonors) {
            return JSON.parse(storedDonors);
        }
        
        // Sample data for initial load
        return {
            major: [
                { name: "Kerala Medical Association", amount: 50000, message: "Proud to support palliative care initiatives", date: "March 2024", type: "one-time" },
                { name: "Dr. Rajesh Kumar", amount: 25000, message: "Supporting compassionate care in our community", date: "February 2024", type: "one-time" },
                { name: "Thrissur Rotary Club", amount: 30000, message: "Service above self - supporting our community", date: "February 2024", type: "one-time" },
                { name: "Anita Menon", amount: 15000, message: "In memory of my beloved father", date: "January 2024", type: "one-time" },
                { name: "Dr. Sunitha Nair", amount: 12000, message: "Supporting healthcare excellence", date: "January 2024", type: "one-time" },
                { name: "Kerala Nurses Association", amount: 18000, message: "Standing with our community", date: "December 2023", type: "one-time" }
            ],
            recurrent: [
                { name: "Priya Suresh", amount: 5000, message: "Monthly supporter - every life matters", date: "Since January 2024", type: "monthly" },
                { name: "Vijay Nair", amount: 3000, message: "Supporting dignity in care", date: "Since December 2023", type: "monthly" },
                { name: "Sunitha Krishnan", amount: 2500, message: "Making a difference, one donation at a time", date: "Since November 2023", type: "monthly" },
                { name: "Ramesh Pillai", amount: 1000, message: "Small contribution, big impact", date: "Since October 2023", type: "monthly" },
                { name: "Lakshmi Devi", amount: 500, message: "Every rupee counts", date: "Since September 2023", type: "monthly" },
                { name: "Suresh Kumar", amount: 800, message: "Supporting our community", date: "Since August 2023", type: "monthly" },
                { name: "Anonymous", amount: 1200, message: "Supporting the cause quietly", date: "Since July 2023", type: "monthly" }
            ],
            recent: [
                { name: "Dr. Priya Nair", amount: 5000, message: "Supporting compassionate care", date: "2 hours ago", type: "one-time" },
                { name: "Anonymous", amount: 1000, message: "Every little helps", date: "5 hours ago", type: "one-time" },
                { name: "Rajesh Kumar", amount: 2500, message: "Making a difference", date: "1 day ago", type: "one-time" },
                { name: "Sunitha Menon", amount: 500, message: "Supporting the cause", date: "2 days ago", type: "one-time" },
                { name: "Vijay Pillai", amount: 750, message: "Community support", date: "3 days ago", type: "one-time" },
                { name: "Anonymous", amount: 300, message: "Every contribution matters", date: "4 days ago", type: "one-time" }
            ]
        };
    }

    // Save donors to localStorage
    saveDonors() {
        localStorage.setItem('karunyaDonors', JSON.stringify(this.donors));
    }

    // Add new donor
    addDonor(donorData) {
        const donor = {
            name: donorData.anonymous ? "Anonymous" : donorData.name,
            amount: parseInt(donorData.amount),
            message: donorData.message || "Thank you for your support",
            date: this.getCurrentDate(),
            type: donorData.type || "one-time"
        };

        // Categorize donor based on amount and type
        if (donor.amount >= 10000) {
            this.donors.major.unshift(donor);
        } else if (donor.type === "monthly") {
            this.donors.recurrent.unshift(donor);
        } else {
            this.donors.recent.unshift(donor);
        }

        // Keep only recent 20 entries in recent donors
        if (this.donors.recent.length > 20) {
            this.donors.recent = this.donors.recent.slice(0, 20);
        }

        this.saveDonors();
        this.updateDonorLists();
        this.showDonorAddedNotification(donor);
    }

    // Get current date/time for new donations
    getCurrentDate() {
        const now = new Date();
        const hoursAgo = Math.floor((Date.now() - now.getTime()) / (1000 * 60 * 60));
        
        if (hoursAgo < 1) return "Just now";
        if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        
        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 7) return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    // Update donor lists in the UI
    updateDonorLists() {
        this.updateDonorCategory('major');
        this.updateDonorCategory('recurrent');
        this.updateDonorCategory('recent');
        this.updateDonorStats();
    }

    // Update specific donor category
    updateDonorCategory(category) {
        const container = document.getElementById(`${category}-donors`);
        if (!container) return;

        const donorsList = container.querySelector('.donors-list-expanded');
        if (!donorsList) return;

        donorsList.innerHTML = '';
        
        this.donors[category].forEach(donor => {
            const donorElement = this.createDonorElement(donor);
            donorsList.appendChild(donorElement);
        });
    }

    // Create donor element for display
    createDonorElement(donor) {
        const donorDiv = document.createElement('div');
        donorDiv.className = 'donor-item-expanded';
        
        const amountText = donor.type === 'monthly' ? `₹${donor.amount.toLocaleString()}/month` : `₹${donor.amount.toLocaleString()}`;
        
        donorDiv.innerHTML = `
            <div class="donor-info">
                <span class="donor-name">${donor.name}</span>
                <span class="donor-amount">${amountText}</span>
            </div>
            <span class="donor-message">"${donor.message}"</span>
            <span class="donor-date">${donor.date}</span>
        `;
        
        return donorDiv;
    }

    // Update donor statistics
    updateDonorStats() {
        const totalDonors = this.donors.major.length + this.donors.recurrent.length + this.donors.recent.length;
        const totalAmount = this.calculateTotalAmount();
        
        // Update stats if elements exist
        const statElements = document.querySelectorAll('.donor-stat .stat-number');
        if (statElements.length >= 3) {
            statElements[0].textContent = `${totalDonors}+`;
            statElements[1].textContent = "25+";
            statElements[2].textContent = `₹${(totalAmount / 100000).toFixed(1)}L+`;
        }
    }

    // Calculate total amount raised
    calculateTotalAmount() {
        let total = 0;
        
        // Add major donors
        this.donors.major.forEach(donor => total += donor.amount);
        
        // Add recurrent donors (estimate 6 months of monthly donations)
        this.donors.recurrent.forEach(donor => total += donor.amount * 6);
        
        // Add recent donors
        this.donors.recent.forEach(donor => total += donor.amount);
        
        return total;
    }

    // Show notification when donor is added
    showDonorAddedNotification(donor) {
        const notification = document.createElement('div');
        notification.className = 'donor-added-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-heart"></i>
                <div>
                    <h4>Thank you, ${donor.name}!</h4>
                    <p>Your donation of ₹${donor.amount.toLocaleString()} has been added to our supporters list.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }

    // Initialize donor lists on page load
    initializeDonorLists() {
        // Update lists when page loads
        setTimeout(() => {
            this.updateDonorLists();
        }, 100);
    }
}

// Initialize donor manager
const donorManager = new DonorManager();

// Carousel functionality
let currentSlideIndex = 0;
const totalSlides = 5;
let carouselInterval;

// Initialize carousel
function initCarousel() {
    updateCarousel();
    startAutoPlay();
}

// Change slide function
function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateCarousel();
    resetAutoPlay();
}

// Go to specific slide
function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber - 1;
    updateCarousel();
    resetAutoPlay();
}

// Update carousel display
function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (track) {
        const translateX = -currentSlideIndex * 20; // 20% per slide
        track.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update slide active states
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlideIndex);
    });
    
    // Update indicator active states
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

// Start auto-play
function startAutoPlay() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Reset auto-play
function resetAutoPlay() {
    clearInterval(carouselInterval);
    startAutoPlay();
}

// Pause auto-play on hover
function pauseCarousel() {
    clearInterval(carouselInterval);
}

// Resume auto-play when mouse leaves
function resumeCarousel() {
    startAutoPlay();
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    
    // Add hover events to pause/resume carousel
    const carousel = document.querySelector('.care-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseCarousel);
        carousel.addEventListener('mouseleave', resumeCarousel);
    }
});

// Donors Modal Functionality
function openDonorsModal() {
    const modal = document.getElementById('donorsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeDonorsModal() {
    const modal = document.getElementById('donorsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function showDonorTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.donor-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-donors');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target;
    clickedButton.classList.add('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('donorsModal');
    if (modal && e.target === modal) {
        closeDonorsModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDonorsModal();
    }
});

// Test Donation Function (for demonstration)
function testDonation() {
    const testDonorData = {
        name: "Test Donor " + Math.floor(Math.random() * 1000),
        amount: Math.floor(Math.random() * 5000) + 100,
        message: "Test donation for demonstration",
        type: Math.random() > 0.5 ? "monthly" : "one-time",
        anonymous: Math.random() > 0.7
    };
    
    // Add donor to the list
    donorManager.addDonor(testDonorData);
    
    // Show success message
    alert(`Test donation added! ${testDonorData.anonymous ? 'Anonymous' : testDonorData.name} donated ₹${testDonorData.amount.toLocaleString()}`);
}

// Admin Functions for Donor Management
function exportDonors() {
    const donors = donorManager.donors;
    const csvContent = generateDonorCSV(donors);
    downloadCSV(csvContent, 'karunya-donors.csv');
}

function generateDonorCSV(donors) {
    let csv = 'Category,Name,Amount,Message,Date,Type\n';
    
    // Add major donors
    donors.major.forEach(donor => {
        csv += `Major,${donor.name},${donor.amount},"${donor.message}",${donor.date},${donor.type}\n`;
    });
    
    // Add recurrent donors
    donors.recurrent.forEach(donor => {
        csv += `Recurrent,${donor.name},${donor.amount},"${donor.message}",${donor.date},${donor.type}\n`;
    });
    
    // Add recent donors
    donors.recent.forEach(donor => {
        csv += `Recent,${donor.name},${donor.amount},"${donor.message}",${donor.date},${donor.type}\n`;
    });
    
    return csv;
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function clearAllDonors() {
    if (confirm('Are you sure you want to clear all donors? This action cannot be undone.')) {
        localStorage.removeItem('karunyaDonors');
        location.reload();
    }
}

function addSampleDonors() {
    const sampleDonors = [
        { name: "Dr. Sarah Johnson", amount: 15000, message: "Supporting healthcare excellence", type: "one-time", anonymous: false },
        { name: "Anonymous", amount: 500, message: "Every little helps", type: "monthly", anonymous: true },
        { name: "Community Group", amount: 8000, message: "Standing together for our community", type: "one-time", anonymous: false },
        { name: "Priya Sharma", amount: 2000, message: "Making a difference", type: "monthly", anonymous: false }
    ];
    
    sampleDonors.forEach(donor => {
        donorManager.addDonor(donor);
    });
    
    alert('Sample donors added successfully!');
}

// Analytics tracking (placeholder for future implementation)
function trackDonationEvent(eventName, eventData) {
    // This would integrate with Google Analytics or other tracking services
    console.log('Analytics Event:', eventName, eventData);
    
    // Example: gtag('event', 'donation_started', { value: eventData.amount });
}

// Service Worker registration for PWA features (future implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Blog & News Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog category filtering
    initBlogCategories();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Initialize load more functionality
    initLoadMore();
});

// Blog category filtering
function initBlogCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog cards
            blogCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Newsletter form submission
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message
                showNewsletterSuccess();
                
                // Reset form
                this.reset();
                
                // Here you would typically send the email to your backend
                console.log('Newsletter subscription:', email);
            }
        });
    }
}

// Show newsletter success message
function showNewsletterSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'newsletter-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h4>Thank you for subscribing!</h4>
            <p>You'll receive our latest updates and news.</p>
        </div>
    `;
    
    // Add styles
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        max-width: 400px;
        width: 90%;
    `;
    
    document.body.appendChild(successMessage);
    
    // Show animation
    setTimeout(() => successMessage.style.opacity = '1', 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => document.body.removeChild(successMessage), 300);
    }, 3000);
}

// Load more articles functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more articles
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // Add more articles (in a real implementation, this would fetch from a server)
                addMoreArticles();
                
                this.textContent = 'Load More Articles';
                this.disabled = false;
            }, 1500);
        });
    }
}

// Add more articles (placeholder function)
function addMoreArticles() {
    const postsGrid = document.querySelector('.posts-grid');
    
    if (postsGrid) {
        const newArticles = [
            {
                category: 'community',
                title: 'Volunteer Spotlight: Meet Our Dedicated Care Team',
                excerpt: 'Learn about the amazing volunteers who make our palliative care services possible...',
                date: 'September 18, 2024',
                image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            },
            {
                category: 'healthcare',
                title: 'Understanding Pain Management in Palliative Care',
                excerpt: 'A comprehensive guide to pain management techniques used in palliative care...',
                date: 'September 15, 2024',
                image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
            }
        ];
        
        newArticles.forEach(article => {
            const articleCard = createArticleCard(article);
            postsGrid.appendChild(articleCard);
            
            // Add fade-in animation
            setTimeout(() => {
                articleCard.style.opacity = '1';
                articleCard.style.transform = 'translateY(0)';
            }, 100);
        });
    }
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('data-category', article.category);
    card.style.cssText = 'opacity: 0; transform: translateY(20px); transition: all 0.5s ease;';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="card-content">
            <div class="article-meta">
                <span class="article-date">${article.date}</span>
                <span class="article-category">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <a href="#" class="read-more-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
    
    return card;
}

// Smooth scrolling for blog links
function smoothScrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add CSS animations for blog elements
const blogStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .newsletter-success {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .success-content i {
        font-size: 3rem;
        color: #4a90e2;
        margin-bottom: 1rem;
    }
    
    .success-content h4 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .success-content p {
        color: #666;
        margin: 0;
    }
`;

// Add blog styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = blogStyles;
document.head.appendChild(styleSheet);

// Scroll to Payment Methods Function
function scrollToPayment() {
    const paymentSection = document.getElementById('payment-methods');
    if (paymentSection) {
        paymentSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Toggle Article Expand/Collapse Function
function toggleArticle(button) {
    event.preventDefault();
    
    const articleCard = button.closest('.featured-text, .card-content');
    const fullContent = articleCard.querySelector('.article-full-content');
    const excerpt = articleCard.querySelector('.article-excerpt');
    
    if (fullContent.style.display === 'none' || fullContent.style.display === '') {
        // Expand article
        fullContent.style.display = 'block';
        button.innerHTML = 'Read Less <i class="fas fa-arrow-up"></i>';
        button.classList.add('expanded');
        
        // Smooth scroll to the expanded content
        setTimeout(() => {
            fullContent.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    } else {
        // Collapse article
        fullContent.style.display = 'none';
        button.innerHTML = 'Read Full Article <i class="fas fa-arrow-right"></i>';
        button.classList.remove('expanded');
        
        // Smooth scroll back to the excerpt
        setTimeout(() => {
            excerpt.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }
}
