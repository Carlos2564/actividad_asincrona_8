/* ==========================================================================
   KAFKA OS | MOTOR LÓGICO COMPLETO (SPA Y DUPLICADOS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Kafka Iniciado. Verificando módulos de la SPA...");

    /* --- 1. BASES DE DATOS LOCALES --- */
    const booksDatabase = {
        proceso: { title: "El Proceso", year: "1925", img: "placeholder-libro2.png", synopsis: "Una mañana, sin haber hecho nada malo, Josef K. es arrestado..." },
        metamorfosis: { title: "La Metamorfosis", year: "1915", img: "placeholder-libro3.png", synopsis: "«Al despertar Gregorio Samsa una mañana...»" },
        castillo: { title: "El Castillo", year: "1926", img: "placeholder-libro1.png", synopsis: "El agrimensor K. llega a un pueblo dominado por un castillo..." }
    };

    const lettersDatabase = [
        "Amor es que tú eres el cuchillo con el que hurgo en mí mismo; eso es amor.",
        "Estoy cansado, no puedo pensar en nada y solo quiero posar mi rostro en tu regazo, sentir tu mano sobre mi cabeza y quedarme así por toda la eternidad.",
        "A veces creo que no sé lo que es el amor, pero si el amor es tener miedo de perder a alguien, entonces te amo dolorosamente.",
        "Escrito está muy poco, pero tú lo eres todo. En ti he encontrado la paz que no hallaba en mí.",
        "Milena, tú eres para mí el mar y yo soy el pequeño barco de papel que navega en ti, a punto de hundirse, pero inmensamente feliz."
    ];

    const categoriesDatabase = {
        proceso: { title: "El Proceso (Análisis)", content: "<p>Considerada una de las obras cumbres del siglo XX...</p>" },
        castillo: { title: "El Castillo (Análisis)", content: "<p>A diferencia de El Proceso donde la amenaza busca al protagonista...</p>" },
        desaparecido: { title: "El Desaparecido (América)", content: "<p>Kafka nunca visitó Estados Unidos, pero escribió esta novela...</p>" },
        metamorfosis: { title: "La Metamorfosis (Análisis)", content: "<p>Más allá de lo fantástico, es un estudio profundo sobre la dinámica familiar tóxica...</p>" },
        relatos: { title: "Relatos Cortos", content: "<p>Kafka brilló en el formato corto. Sus relatos exploran la crueldad, el castigo y el absurdo...</p>" }
    };

    /* --- 2. SISTEMA DE MODALES CON GSAP --- */
    const openModalBeautifully = (modalId) => {
        const modal = document.getElementById(modalId);
        const modalInner = modal.querySelector('.modal-inner');
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(modalInner, { y: 80, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" });
    };

    const closeModalBeautifully = (modal) => {
        const modalInner = modal.querySelector('.modal-inner');
        gsap.to(modalInner, { y: 50, scale: 0.95, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(modal, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; 
            gsap.set([modal, modalInner], { clearProps: "all" });
        }});
    };

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => closeModalBeautifully(e.target.closest('.custom-modal')));
    });

    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModalBeautifully(modal); });
    });

    // Eventos Libros Abajo (Funciona para duplicados por usar clases)
    document.querySelectorAll('.trigger-modal').forEach(card => {
        card.addEventListener('click', () => {
            const data = booksDatabase[card.getAttribute('data-book')];
            if(data) {
                document.getElementById('dynamic-book-img').src = data.img;
                document.getElementById('dynamic-book-title').textContent = data.title;
                document.getElementById('dynamic-book-year').textContent = data.year;
                document.getElementById('dynamic-book-synopsis').textContent = data.synopsis;
                openModalBeautifully('modal-book-detail');
            }
        });
    });

    // Evento Botón Leer Cartas (Cambiado a querySelectorAll para captar duplicados)
    document.querySelectorAll('.btn-open-letters').forEach(btn => {
        btn.addEventListener('click', () => openModalBeautifully('modal-letters-view'));
    });

    // Eventos Lomos Libros (Funciona para duplicados)
    document.querySelectorAll('.spine-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const data = categoriesDatabase[btn.getAttribute('data-category')];
            if(data) {
                document.getElementById('dynamic-category-title').textContent = data.title;
                document.getElementById('dynamic-category-content').innerHTML = data.content;
                openModalBeautifully('modal-category-view');
            }
        });
    });

    /* --- 3. EFECTOS 3D Y PARALLAX --- */
    document.querySelectorAll('.window, .object-3d-hover, .book-card').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.5s ease-out';
            setTimeout(() => { el.style.transition = 'none'; }, 500);
        });
    });

    const bgInkwell = document.getElementById('inkwell-bg');
    if (bgInkwell) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(bgInkwell, { x: (window.innerWidth / 2 - e.clientX) / 60, y: (window.innerHeight / 2 - e.clientY) / 60, duration: 1, ease: "power1.out" });
        });
    }

    /* --- 4. MOTOR DEL CARRUSEL DE MILENA --- */
    const track = document.getElementById('letters-track');
    const dotsNav = document.getElementById('carousel-dots');
    
    if (track && dotsNav) {
        lettersDatabase.forEach((letter, index) => {
            const li = document.createElement('li');
            li.classList.add('carousel-slide');
            if (index === 0) li.classList.add('current-slide');
            li.innerHTML = `<div class="typewriter-container"><p>"${letter}"</p><p class="signature">- F. Kafka a Milena</p></div>`;
            track.appendChild(li);

            const dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            if (index === 0) dot.classList.add('current-slide');
            dotsNav.appendChild(dot);
        });

        const slides = Array.from(track.children);
        const dots = Array.from(dotsNav.children);
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');

        const moveToSlide = (currentSlide, targetSlide, targetIndex) => {
            track.style.transform = `translateX(-${targetIndex * 100}%)`;
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        nextBtn?.addEventListener('click', () => {
            let nextIndex = slides.findIndex(s => s === track.querySelector('.current-slide')) + 1;
            if (nextIndex >= slides.length) nextIndex = 0; 
            moveToSlide(track.querySelector('.current-slide'), slides[nextIndex], nextIndex);
            updateDots(dotsNav.querySelector('.current-slide'), dots[nextIndex]);
        });

        prevBtn?.addEventListener('click', () => {
            let prevIndex = slides.findIndex(s => s === track.querySelector('.current-slide')) - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1; 
            moveToSlide(track.querySelector('.current-slide'), slides[prevIndex], prevIndex);
            updateDots(dotsNav.querySelector('.current-slide'), dots[prevIndex]);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(d => d === targetDot);
            moveToSlide(track.querySelector('.current-slide'), slides[targetIndex], targetIndex);
            updateDots(dotsNav.querySelector('.current-slide'), targetDot);
        });
    }

    /* --- 5. MOTOR DE VISTAS (SPA ROUTER) --- */
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            document.querySelector('.nav-btn.active')?.classList.remove('active');
            btn.classList.add('active');

            const targetView = document.getElementById(btn.getAttribute('data-target'));
            const currentView = document.querySelector('.view-page.active-view');

            if (!targetView || targetView === currentView) return;

            document.body.style.pointerEvents = 'none';

            gsap.to(currentView, {
                opacity: 0, y: -30, duration: 0.4, ease: "power2.in",
                onComplete: () => {
                    currentView.classList.remove('active-view');
                    currentView.style.position = 'absolute'; 
                    currentView.style.visibility = 'hidden';
                    
                    targetView.classList.add('active-view');
                    targetView.style.position = 'relative';
                    targetView.style.visibility = 'visible';
                    
                    gsap.fromTo(targetView, 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", onComplete: () => document.body.style.pointerEvents = 'all' }
                    );
                }
            });
        });
    });
});