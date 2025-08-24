const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioGrid = document.querySelector(".portfolio-grid");

// Example Cards (you can replace/add real videos here in HTML dynamically if needed)
const videoData = [
  { category: "short-form", title: "Short Video", src: "https://www.youtube.com/embed/fLK7a4vLFNg" },
  { category: "long-form", title: "Long Video", src: "https://www.youtube.com/embed/fLK7a4vLFNg" },
  { category: "gaming", title: "Gaming Edit", src: "https://www.youtube.com/embed/4IIpLAIQBW8" },
  { category: "football", title: "Football Edit", src: "https://www.youtube.com/embed/LlFX_L8Xnu0" },
  { category: "ecommerce", title: "E-Commerce Ad", src: "https://www.youtube.com/embed/UnBzJsUunrA" },
  { category: "documentary", title: "Documentary Style", src: "https://www.youtube.com/embed/aqz-KE-bpKQ" },
  { category: "color-grading", title: "Color Grading", src: "https://www.youtube.com/embed/nsWOIRMK4H8" },
  { category: "anime", title: "Anime Edit", src: "https://www.youtube.com/embed/L2c39drDVuk" },
  { category: "ads", title: "Ad Campaign", src: "https://www.youtube.com/embed/9bZkp7q19f0" }
];


// Render portfolio cards
function renderPortfolio(filter) {
  portfolioGrid.innerHTML = "";
  videoData.forEach(video => {
    if (filter === "all" || video.category === filter) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-category", video.category);

      card.innerHTML = `
        <iframe width="100%" height="200" 
          src="${video.src}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
        <h3>${video.title}</h3>
      `;

      portfolioGrid.appendChild(card);
    }
  });
}


// // Initial render (all)
renderPortfolio("all");

// Filter buttons click event
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    renderPortfolio(filter);
  });
});


// LIGHTBOX FUNCTIONALITY
const lightbox = document.getElementById("lightbox");
const lightboxVideo = document.getElementById("lightbox-video");
const closeBtn = document.querySelector(".close-btn");

// Open Lightbox
function openLightbox(src) {
  lightbox.style.display = "flex";
  lightboxVideo.src = src;
  lightboxVideo.play();
}

// Close Lightbox
function closeLightbox() {
  lightbox.style.display = "none";
  lightboxVideo.pause();
  lightboxVideo.src = "";
}

closeBtn.addEventListener("click", closeLightbox);

// Close lightbox when clicking outside video
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});
