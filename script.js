// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
        // Toggle menu when hamburger is clicked
        mobileMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent immediate closing
            this.classList.toggle('active');

            if (!mobileMenu.classList.contains('active')) {
                // Opening menu
                mobileMenu.style.display = 'block';
                // Trigger reflow to ensure transition works
                mobileMenu.offsetHeight;
                mobileMenu.classList.add('active');
            } else {
                // Closing menu - handle with transition
                mobileMenu.classList.remove('active');
                // Wait for transition to finish before hiding
                setTimeout(function () {
                    if (!mobileMenu.classList.contains('active')) {
                        mobileMenu.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                // Wait for transition to finish before hiding
                setTimeout(function () {
                    mobileMenu.style.display = 'none';
                }, 300);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                e.target !== mobileMenuToggle &&
                !mobileMenuToggle.contains(e.target)) {

                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                // Wait for transition to finish before hiding
                setTimeout(function () {
                    mobileMenu.style.display = 'none';
                }, 300);
            }
        });
    }

    // Price button functionality
    document.querySelectorAll('.price-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const slider = this.closest('.pricing-card-int').querySelector('.featureSlider');
            slider.classList.toggle('show-second');
        });
    });

    // Modal functionality
    const modal = document.getElementById("contact-modal");
    const modalOpeners = document.querySelectorAll(".modal-open");
    const closeButton = document.querySelector(".close-button");
    const modalOverlay = document.createElement("div");
    const contactForm = document.getElementById("contact-form");

    // Handle form submission without redirecting
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Set the current time
        const now = new Date();
        document.getElementById("time-field").value = now.toLocaleString();

        // Change button text to indicate sending
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;

        // Get form data
        const formData = new FormData(this);

        // Send form data to Formspree using fetch
        fetch("https://formspree.io/f/mdkozyzb", {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    submitButton.textContent = "Message Sent!";
                    this.reset(); // Clear all fields

                    // Close modal after 3 seconds
                    setTimeout(() => {
                        modal.classList.remove("show-modal");
                        modalOverlay.classList.remove("show-overlay");
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    // Handle errors
                    response.json().then(data => {
                        if (data && data.errors) {
                            // Error message from Formspree
                            submitButton.textContent = data.errors.map(error => error.message).join(", ");
                        } else {
                            // Generic error
                            submitButton.textContent = "Error! Please try again.";
                        }
                        // Reset button after 3 seconds
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 3000);
                    });
                }
            })
            .catch(error => {
                // Network error
                submitButton.textContent = "Network Error!";
                console.error("Error:", error);
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);
            });
    });

    modalOverlay.classList.add("modal-overlay");
    document.body.appendChild(modalOverlay);

    modalOpeners.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            modal.classList.add("show-modal");
            modalOverlay.classList.add("show-overlay");
        });
    });

    closeButton.addEventListener("click", function () {
        modal.classList.remove("show-modal");
        modalOverlay.classList.remove("show-overlay");
    });

    modalOverlay.addEventListener("click", function () {
        modal.classList.remove("show-modal");
        modalOverlay.classList.remove("show-overlay");
    });

    // Make navbar sticky on scroll and highlight active section
    window.addEventListener('scroll', function () {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('sticky', window.scrollY > 0);

        // Highlight active section in navbar
        highlightActiveSection();
    });

    // Highlight the active section in navbar
    function highlightActiveSection() {
        // Get all sections that have an ID defined
        const sections = document.querySelectorAll("section[id], div[id='services'], div[id='pricing'], div[id='clients']");

        // Get current scroll position
        let scrollY = window.pageYOffset;

        // Check if at top of page (hero section)
        if (scrollY < 100) {
            // Remove active class from all nav items when at the top
            document.querySelectorAll("nav a").forEach(a => {
                a.classList.remove("active");
            });
            return;
        }

        // Loop through sections to find the visible one
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Adjust offset for navbar height
            const sectionId = current.getAttribute("id");

            // Check if the current scroll position is within this section
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all nav items
                document.querySelectorAll("nav a").forEach(a => {
                    a.classList.remove("active");
                });

                // Add active class to current section nav item if it exists
                const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (navLink) {
                    navLink.classList.add("active");
                }
            }
        });
    }

    // Initial call to highlight the active section
    highlightActiveSection();

    // Also highlight active section when clicking on nav links
    document.querySelectorAll("nav a").forEach(anchor => {
        anchor.addEventListener("click", function () {
            document.querySelectorAll("nav a").forEach(a => {
                a.classList.remove("active");
            });
            this.classList.add("active");
        });
    });

    // Add smooth scrolling for logo link to top of page
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
