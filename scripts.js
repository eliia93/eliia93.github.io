document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const hamburger = document.getElementById("hamburger-menu");
    const sidebar = document.getElementById("sidebar");
    const closeSidebar = document.getElementById("close-sidebar");
    const submenuParents = document.querySelectorAll(".has-submenu"); // Target <li>, not <a>

    // 🌑 Create Overlay Dynamically
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    // 📌 Highlight Active Menu Link on Scroll
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 50) {
                current = section.getAttribute("id");
            }
        });

        document.querySelectorAll(".nav-links li a").forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // Open Sidebar
    hamburger.addEventListener("click", function () {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    // Close Sidebar When Clicking on Overlay
    overlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Close Sidebar When Clicking the "X" Button
    closeSidebar.addEventListener("click", function () {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Submenu Toggle (Fix for mobile click and desktop hover)
    submenuParents.forEach(parent => {
        parent.addEventListener("click", function (e) {
            e.preventDefault();
            this.classList.toggle("active");
            // Close other submenus to prevent multiple open at once
            submenuParents.forEach(otherParent => {
                if (otherParent !== this) {
                    otherParent.classList.remove("active");
                }
            });
        });
    });

    // Section Snapping (Stop at section tops when scrolling)
    let isScrolling = false;
    let scrollTimeout;

    // Function to get the closest section based on scroll position with a threshold
    function getClosestSection() {
        let minDistance = Infinity;
        let closestSection = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top); // Distance from viewport top

            // Only consider snapping if the distance is significant (e.g., within 200px)
            if (distance < 200 && distance < minDistance) {
                minDistance = distance;
                closestSection = section;
            }
        });

        return closestSection;
    }

    // Smoothly scroll to the top of the closest section, but only if needed
    function scrollToSection(section) {
        if (section && !isScrolling) { // Prevent recursive calls
            isScrolling = true;
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth"
            });
            setTimeout(() => {
                isScrolling = false; // Allow scrolling again after animation
            }, 500); // Match or exceed the smooth scroll duration (500ms default)
        }
    }

    // Handle scroll with throttling to prevent bouncing
    function handleScroll() {
        if (!isScrolling) {
            clearTimeout(scrollTimeout); // Clear any previous timeout

            scrollTimeout = setTimeout(() => {
                const closestSection = getClosestSection();
                if (closestSection) {
                    scrollToSection(closestSection);
                }
            }, 100); // Increased delay for stability (100ms)
        }
    }

    // Add scroll event listener for section snapping
    window.addEventListener("scroll", handleScroll);

    // Optional: Trigger on page load to align to the first section
    if (sections.length > 0) {
        scrollToSection(sections[0]);
    }

    // Announcements Animation
    const announcements = document.querySelectorAll(".announcement");

    function revealOnScroll() {
        announcements.forEach((announcement, index) => {
            const rect = announcement.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight * 0.85) { // Triggers when 85% in view
                setTimeout(() => {
                    announcement.classList.add("show");
                }, index * 200); // Delay each item by 200ms
            }
        });
    }

    // Run on scroll for announcements
    window.addEventListener("scroll", revealOnScroll);

    // Run once to check if some elements are already in view
    revealOnScroll();

    // Hero Carousel
    const carouselItems = document.querySelectorAll(".carousel-item");
    let heroCurrentIndex = 0;

    function updateHeroCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.remove("active", "prev", "next");

            if (index === heroCurrentIndex) {
                item.classList.add("active");
            } else if (index === (heroCurrentIndex - 1 + carouselItems.length) % carouselItems.length) {
                item.classList.add("prev");
            } else if (index === (heroCurrentIndex + 1) % carouselItems.length) {
                item.classList.add("next");
            }
        });
    }

    function nextHeroSlide() {
        heroCurrentIndex = (heroCurrentIndex + 1) % carouselItems.length;
        updateHeroCarousel();
    }

    function prevHeroSlide() {
        heroCurrentIndex = (heroCurrentIndex - 1 + carouselItems.length) % carouselItems.length;
        updateHeroCarousel();
    }

    // Function to navigate to detail page (update with real URLs later)
    function goToDetail(detailId) {
        // Example: Navigate to a specific URL based on detailId
        if (detailId === 'detail1') window.location.href = '/detail-page-1';
        else if (detailId === 'detail2') window.location.href = '/detail-page-2';
        else if (detailId === 'detail3') window.location.href = '/detail-page-3';
        // Add more conditions or use a mapping object for scalability
    }

    // Attach events to buttons
    document.querySelector(".next-btn").addEventListener("click", nextHeroSlide);
    document.querySelector(".prev-btn").addEventListener("click", prevHeroSlide);

    // Auto-slide every 3 seconds
    setInterval(nextHeroSlide, 3000);

    // Initial update
    updateHeroCarousel();

    // Berita Carousel (Dynamic Agenda Posters)
    const beritaCarousel = document.getElementById("beritaCarousel");
    const dotsContainer = document.getElementById("beritaDots");
    let beritaCurrentIndex = 0;
    let itemsPerSlide = getItemsPerSlide(); // Use function to determine items per slide

    // Function to determine items per slide based on screen width
    function getItemsPerSlide() {
        if (window.innerWidth <= 768) return 1; // Mobile: 1 card
        if (window.innerWidth <= 1024) return 2; // Tablet: 2 cards
        return 4; // Desktop: 4 cards
    }

    // Simulated agenda data (replace with real API call)
    let agendaData = [
        {
            id: 1,
            image: "img/peng1.jpg",
            title: "Kegiatan Sosial di Paroki",
            description: "Tes page...",
            buttonText: "Baca Pengumuman"
        },
        {
            id: 2,
            image: "img/peng1.jpg",
            title: "Pelatihan di Paroki",
            description: "Tes page...",
            buttonText: "Baca Pengumuman"
        }
        // Add more agenda items as needed
    ];

    // Function to generate Berita cards (real or placeholder)
    function generateBeritaCards(data = []) {
        beritaCarousel.innerHTML = ""; // Clear existing cards
        const totalCards = itemsPerSlide; // Minimum cards to show based on screen size

        if (data.length === 0) {
            // If no agenda data, generate placeholder cards
            for (let i = 0; i < totalCards; i++) {
                const card = document.createElement("div");
                card.className = "berita-card placeholder";
                card.innerHTML = `
                    <div class="berita-content">
                        <h3>Tidak Ada Agenda</h3>
                    </div>
                `;
                beritaCarousel.appendChild(card);
            }
        } else {
            // If agenda data exists, generate real cards
            data.forEach(item => {
                const card = document.createElement("div");
                card.className = "berita-card";
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="berita-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <button class="berita-button">${item.buttonText}</button>
                    </div>
                `;
                beritaCarousel.appendChild(card);
            });

            // Fill remaining slots with placeholders if less than totalCards
            while (beritaCarousel.children.length < totalCards) {
                const placeholder = document.createElement("div");
                placeholder.className = "berita-card placeholder";
                placeholder.innerHTML = `
                    <div class="berita-content">
                        <h3>Tidak Ada Agenda</h3>
                    </div>
                `;
                beritaCarousel.appendChild(placeholder);
            }
        }

        // Reinitialize carousel after updating cards
        initializeBeritaCarousel();
    }

    // Initialize Berita carousel
    function initializeBeritaCarousel() {
        const beritaCards = document.querySelectorAll(".berita-card");
        let totalSlides = Math.ceil(beritaCards.length / itemsPerSlide);

        // Clear dots
        dotsContainer.innerHTML = "";
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("div");
            dot.className = "carousel-dot";
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => moveBeritaCarousel(i));
            dotsContainer.appendChild(dot);
        }

        beritaCurrentIndex = 0;
        moveBeritaCarousel(0);
    }

    // Function to move Berita carousel
    function moveBeritaCarousel(index) {
        beritaCurrentIndex = index;
        const offset = -index * (100 / itemsPerSlide) + "%"; // Move by card width
        beritaCarousel.style.transform = `translateX(${offset})`;

        // Update active dot
        document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    // Functions for Berita arrow navigation (fixed to handle dynamic card counts)
    function nextBeritaSlide() {
        const beritaCards = document.querySelectorAll(".berita-card");
        const totalSlides = Math.ceil(beritaCards.length / itemsPerSlide);
        beritaCurrentIndex = (beritaCurrentIndex + 1) % totalSlides;
        moveBeritaCarousel(beritaCurrentIndex);
    }

    function prevBeritaSlide() {
        const beritaCards = document.querySelectorAll(".berita-card");
        const totalSlides = Math.ceil(beritaCards.length / itemsPerSlide);
        beritaCurrentIndex = (beritaCurrentIndex - 1 + totalSlides) % totalSlides;
        moveBeritaCarousel(beritaCurrentIndex);
    }

    // Attach events to Berita arrow buttons
    document.querySelector(".next-berita-btn").addEventListener("click", nextBeritaSlide);
    document.querySelector(".prev-berita-btn").addEventListener("click", prevBeritaSlide);

    // Auto-slide every 4 seconds
    setInterval(nextBeritaSlide, 4000);

    // Adjust items per slide on window resize
    window.addEventListener("resize", () => {
        itemsPerSlide = getItemsPerSlide(); // Update items per slide based on screen width
        generateBeritaCards(agendaData); // Regenerate cards on resize
    });

    // Initial generation of cards (simulate with dummy data)
    generateBeritaCards(agendaData);

    // Function to update agenda data dynamically (e.g., from API)
    function updateAgendaData(newData) {
        agendaData = newData; // Update the data array
        generateBeritaCards(agendaData); // Regenerate cards with new data
    }
});
