/* =========================================================
   OSO POLAR DORMILÓN (Lottie) — esquina superior izquierda
   - Duerme respirando tranquilo (animación lenta)
   - Si el mouse se acerca, se inquieta (animación más rápida)
   - Al tocarlo "se despierta": nevada por toda la pantalla + consejo
   - Al cambiar de apartado murmura algo desde sus sueños
   ========================================================= */
(function () {
  const wrap = document.getElementById("oso");
  const btn = document.getElementById("oso-btn");
  const box = document.getElementById("oso-anim");
  const msg = document.getElementById("oso-msg");

  if (!wrap || !window.lottie || !window.BEAR_DATA) {
    console.warn("[Oso] No se pudo iniciar:",
      !wrap ? "falta <div id=\"oso\"> en index.html" :
      !window.lottie ? "no cargó la librería lottie (revisa internet o el <script> de cdnjs)" :
      "no cargó bear-data.js (archivo incompleto o mal enlazado)");
    if (wrap) wrap.hidden = true;
    return;
  }

  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const VEL_DORMIDO = 0.8, VEL_INQUIETO = 1.8;

  const anim = lottie.loadAnimation({
    container: box,
    renderer: "svg",
    loop: true,
    autoplay: !reducido,
    animationData: window.BEAR_DATA
  });
  anim.setSpeed(VEL_DORMIDO);
  if (reducido) anim.goToAndStop(20, true);

  const CONSEJOS = [
    "Dormir bien y manejar el estrés también son parte del autocuidado. 😴",
    "Ante cualquier cambio en tu cuerpo, no esperes: consulta a un servicio de salud.",
    "Pregunta en tu EPS/IPS qué controles te corresponden según tu edad.",
    "Compartir lo que aprendes con tu familia ayuda a que todos se cuiden.",
    "Moverte un poco cada día es una gran forma de cuidarte.",
    "Hablar de salud sin miedo ni vergüenza salva vidas."
  ];
  const SUENOS = [
    "Zzz… sigue leyendo, yo vigilo. 📖",
    "Mmm… ¡buen apartado! 💤",
    "Zzz… soñé con mamografías a tiempo. 💗",
    "Zzz… ¿ya jugaste el quiz? 🎮"
  ];
  let ultimo = -1, hablaTimer;

  function decir(texto, ms = 5500) {
    msg.textContent = texto;
    msg.hidden = false;
    clearTimeout(hablaTimer);
    if (ms) hablaTimer = setTimeout(() => { msg.hidden = true; }, ms);
  }

  // --- Nevada ----------------------------------------------------------
  let capa = null;
  function nevar() {
    if (reducido) return;
    if (!capa) {
      capa = document.createElement("div");
      capa.id = "nieve";
      capa.setAttribute("aria-hidden", "true");
      document.body.appendChild(capa);
    }
    for (let i = 0; i < 28; i++) {
      const f = document.createElement("span");
      f.className = "copo";
      f.textContent = i % 4 === 0 ? "✨" : "❄";
      f.style.left = Math.random() * 100 + "vw";
      f.style.fontSize = 14 + Math.random() * 22 + "px";
      f.style.animationDuration = 3 + Math.random() * 3 + "s";
      f.style.animationDelay = Math.random() * 1.2 + "s";
      capa.appendChild(f);
      setTimeout(() => f.remove(), 7500);
    }
  }

  // --- Se inquieta si el mouse se acerca --------------------------------
  let inquieto = false;
  document.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    const cerca = d < 170;
    if (cerca !== inquieto) {
      inquieto = cerca;
      anim.setSpeed(cerca ? VEL_INQUIETO : VEL_DORMIDO);
      btn.classList.toggle("inquieto", cerca);
    }
  });

  // --- Clic: despierta -------------------------------------------------
  btn.addEventListener("click", () => {
    btn.classList.remove("despierta");
    void btn.offsetWidth;
    btn.classList.add("despierta");
    nevar();
    let i;
    do { i = Math.floor(Math.random() * CONSEJOS.length); } while (i === ultimo);
    ultimo = i;
    decir("¡Mmm! Me despertaste… " + CONSEJOS[i], 7000);
  });

  // --- Murmura al cambiar de apartado (el título de la página cambia) ----
  const t = document.querySelector("title");
  let primera = true, n = 0;
  if (t) new MutationObserver(() => {
    if (primera) { primera = false; return; }
    decir(SUENOS[n++ % SUENOS.length], 3500);
  }).observe(t, { childList: true });

  // Saludo inicial
  setTimeout(() => decir("Zzz… toca mi nariz y mira qué pasa. ❄", 5000), 2000);

  window.osoDecir = decir;
})();