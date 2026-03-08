// particules animées pour les sections hero, footer et cv
function loadParticles(id) {
  particlesJS(id, {
    particles: {
      number: { value: 100 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 3 },
      line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2 }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" } } },
    retina_detect: true
  });
}

// j'initialise les particules pour les sections du hero, du cv et du footer avec la méthode loadParticles
["particles-hero", "particles-cv", "particles-footer"].forEach(loadParticles);

document.querySelectorAll(".project-slider").forEach(slider => {
  const images = Array.from(slider.querySelectorAll("img"));

  images.forEach((img, imgIndex) => {
    img.addEventListener("click", () => {
      let index = imgIndex;

      // je crée l'overlay noir transparent
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%;
        background: rgba(0,0,0,0.9); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        z-index: 2000; 
        cursor: pointer;
      `;

      // j'agrandie l'image
      const big = document.createElement("img");
      big.src = images[index].src;
      big.style.cssText = `
        max-width:90%; 
        max-height:90%; 
        border-radius:10px;
        `;
      overlay.appendChild(big);

      // je crée les boutons gauche et droite pour l'overlay
      const prevBtn = document.createElement("button");
      const nextBtn = document.createElement("button");
      [prevBtn, nextBtn].forEach(btn => {
        btn.classList.add("overlay-btn");
        btn.style.cssText = `
          position: absolute; 
          top: 50%; 
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6); 
          border:none; color: white; 
          font-size: 24px;
          width: 50px; 
          height: 50px; 
          border-radius: 50%; 
          cursor: pointer; 
          display: flex;
          align-items: center; 
          justify-content: center; 
          z-index: 2001;
        `;
      });

      prevBtn.innerHTML = "❮"; prevBtn.style.left = "30px";
      nextBtn.innerHTML = "❯"; nextBtn.style.right = "30px";
      overlay.appendChild(prevBtn);
      overlay.appendChild(nextBtn);

      // je met à jour l'image en fonction du bouton cliqué (précédente ou suivante)
      function updateImage() { 
        big.src = images[index].src; 
      }
      nextBtn.onclick = e => { 
        e.stopPropagation(); 
        index = (index + 1) % images.length; 
        updateImage(); 
      };

      prevBtn.onclick = e => { 
        e.stopPropagation(); 
        index = (index - 1 + images.length) % images.length; 
        updateImage(); 
      };

      overlay.onclick = () => overlay.remove();

      document.body.appendChild(overlay);
    });
  });
});

// mise à jour de l'image affichée mais pas en plein écran
document.querySelectorAll(".project-slider").forEach(slider => {
  const images = slider.querySelectorAll("img");
  let index = 0;

  function showImage(i) {
    images.forEach(img => img.classList.remove("active"));
    images[i].classList.add("active");
  }

  slider.querySelector(".next")?.addEventListener("click", () => {
    index = (index + 1) % images.length;
    showImage(index);
  });

  slider.querySelector(".prev")?.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  });

  showImage(index);
});

function animateElementsOnScroll(selector, delayStep = 100) {
  const elements = document.querySelectorAll(selector);
  const windowHeight = window.innerHeight;

  elements.forEach((el, index) => {
    const top = el.getBoundingClientRect().top;

    if (top < windowHeight - 100) {
      setTimeout(() => {
        el.classList.add("show");
      }, index * delayStep);
    } else {
      el.classList.remove("show");
    }

  });
}

function handleScrollAnimations() {
  animateElementsOnScroll(".skill", 50);
  animateElementsOnScroll(".timeline-item", 150);
  animateElementsOnScroll(".project", 120);
  animateElementsOnScroll(".hobby", 120);
}

window.addEventListener("scroll", handleScrollAnimations);
window.addEventListener("load", handleScrollAnimations);