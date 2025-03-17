document.addEventListener('DOMContentLoaded', () => {
    // Selecciona los elementos necesarios
    const track = document.querySelector('.carousel-track') as HTMLElement;
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.indicator-dot');
    
    // No continuar si no hay carrusel en la página
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideWidth = (slides[0] as HTMLElement).offsetWidth;
    
    // Actualiza los indicadores
    const updateIndicators = () => {
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    // Mueve el carrusel a una diapositiva específica
    const moveToSlide = (index: number) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicators();
    };
    
    // Configura el primer indicador como activo
    updateIndicators();
    
    // Maneja clics en los botones
    prevButton?.addEventListener('click', () => moveToSlide(currentIndex - 1));
    nextButton?.addEventListener('click', () => moveToSlide(currentIndex + 1));
    
    // Maneja clics en los indicadores
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => moveToSlide(index));
    });
    
    // Auto-rotación del carrusel
    let interval = setInterval(() => moveToSlide(currentIndex + 1), 5000);
    
    // Pausa la auto-rotación cuando el usuario interactúa
    const pauseCarousel = () => {
        clearInterval(interval);
        interval = setTimeout(() => {
            interval = setInterval(() => moveToSlide(currentIndex + 1), 5000);
        }, 10000); // Reinicia después de 10 segundos de inactividad
    };
    
    prevButton?.addEventListener('click', pauseCarousel);
    nextButton?.addEventListener('click', pauseCarousel);
    indicators.forEach(dot => dot.addEventListener('click', pauseCarousel));
    
    // Funcionalidad de touch para dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
        // Si el deslizamiento es significativo (más de 50px)
        if (touchStartX - touchEndX > 50) {
            moveToSlide(currentIndex + 1); // Deslizar a la izquierda
            pauseCarousel();
        } else if (touchEndX - touchStartX > 50) {
            moveToSlide(currentIndex - 1); // Deslizar a la derecha
            pauseCarousel();
        }
    };
});