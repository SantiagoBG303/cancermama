/* =========================================================
   GATO INTERACTIVO (Lottie)
   - Sigue el mouse inclinándose hacia el cursor
   - Al pasar el mouse se emociona (animación más rápida)
   - Al tocarlo salta, suelta corazones y da un consejo
   - Si no hay actividad por 20 s se queda dormido
   ========================================================= */
(function () {
  const wrap = document.getElementById("gato");
  const btn = document.getElementById("gato-btn");
  const box = document.getElementById("gato-anim");
  const msg = document.getElementById("gato-msg");

  // Si la librería no cargó (sin internet), se oculta el gato sin romper la página
  if (!wrap || !window.lottie || !window.CAT_DATA) {
    console.warn("[Gato] No se pudo iniciar:",
      !wrap ? "falta <div id=\"gato\"> en index.html" :
      !window.lottie ? "no cargó la librería lottie (revisa internet o el <script> de cdnjs)" :
      "no cargó gato-data.js (archivo incompleto o mal enlazado)");
    if (wrap) wrap.hidden = true;
    return;
  }

  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const anim = lottie.loadAnimation({
    container: box,
    renderer: "svg",
    loop: true,
    autoplay: !reducido,
    animationData: window.CAT_DATA
  });
  if (reducido) anim.goToAndStop(30, true);

  const CONSEJOS = [
    "Si notas un cambio en tu mama, consulta pronto a un servicio de salud.",
    "Moverte con regularidad ayuda a reducir el riesgo. ¡Vamos a caminar!",
    "Conocer cómo se ven y se sienten tus mamas te ayuda a notar cambios.",
    "El cáncer de mama también puede darse en hombres, aunque es poco frecuente.",
    "Un bulto no siempre es cáncer, pero siempre merece una valoración.",
    "Pregunta en tu EPS/IPS qué tamización te corresponde según tu edad.",
    "Hablar del tema en familia ayuda a perder el miedo.",
    "Limitar el alcohol y mantener un peso saludable también cuidan tu salud.",
    "¿Ya jugaste? Prueba los juegos y demuestra lo que sabes."
  ];
  let ultimo = -1;
  let hablaTimer, dormido = false, idleTimer;

  function decir(texto, ms = 6000) {
    msg.textContent = texto;
    msg.hidden = false;
    clearTimeout(hablaTimer);
    if (ms) hablaTimer = setTimeout(() => { msg.hidden = true; }, ms);
  }

  function consejo() {
    let i;
    do { i = Math.floor(Math.random() * CONSEJOS.length); } while (i === ultimo);
    ultimo = i;
    decir(CONSEJOS[i]);
  }

  function corazones() {
    for (let k = 0; k < 6; k++) {
      const h = document.createElement("span");
      h.className = "gato-corazon";
      h.textContent = ["❤", "💗", "✨"][k % 3];
      h.style.left = 20 + Math.random() * 60 + "%";
      h.style.animationDelay = k * 70 + "ms";
      wrap.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }
  }

  // --- Seguir el mouse -------------------------------------------------
  function seguir(e) {
    if (reducido) return;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    const cx = Math.max(-1, Math.min(1, dx * 2.2));
    const cy = Math.max(-1, Math.min(1, dy * 2.2));
    box.style.transform = `translate(${cx * 10}px, ${cy * 8}px) rotate(${cx * 9}deg) scale(${1 + Math.abs(cx) * 0.03})`;
  }

  // --- Dormir / despertar ---------------------------------------------
  function despertar() {
    clearTimeout(idleTimer);
    if (dormido) {
      dormido = false;
      anim.setSpeed(1);
      decir("¡Hola otra vez! 😺", 2500);
    }
    idleTimer = setTimeout(dormir, 20000);
  }
  function dormir() {
    dormido = true;
    anim.setSpeed(0.35);
    box.style.transform = "none";
    decir("Zzz… 😴", 0);
  }

  document.addEventListener("mousemove", (e) => { seguir(e); despertar(); });
  document.addEventListener("keydown", despertar);
  document.addEventListener("touchstart", despertar, { passive: true });
  window.addEventListener("scroll", despertar, { passive: true });

  // --- Hover y clic -----------------------------------------------------
  btn.addEventListener("mouseenter", () => { if (!dormido) anim.setSpeed(1.8); });
  btn.addEventListener("mouseleave", () => { if (!dormido) anim.setSpeed(1); });

  btn.addEventListener("click", () => {
    btn.classList.remove("salto");
    void btn.offsetWidth; // reinicia la animación CSS
    btn.classList.add("salto");
    corazones();
    consejo();
    despertar();
  });

  // Saludo inicial
  setTimeout(() => decir("¡Hola! Soy Mimi 🐱 Tócame para ver un consejo.", 5000), 1200);
  idleTimer = setTimeout(dormir, 20000);

  // Los demás scripts pueden hacer hablar al gato: window.gatoDecir("texto")
  window.gatoDecir = decir;
})();