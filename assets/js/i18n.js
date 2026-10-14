/* =========================================================
   UNDERSTAND STUDIO — idiomas (ES / EN)
   El HTML está en español. Si el idioma es inglés, este archivo
   traduce el DOM antes de que arranquen las animaciones.
   El idioma se elige en el <head> (preferencia guardada o idioma del navegador).
   ========================================================= */
(function () {
  "use strict";
  var html = document.documentElement;
  var lang = html.lang === "en" ? "en" : "es";
  window.__LANG = lang;

  /* Textos sueltos (nodos de texto, comparados sin espacios extra) */
  var T = {
    "Saltar al contenido": "Skip to content",
    "escuchando tu marca": "listening to your brand",
    "diseñando el espacio · esc 1:50": "designing the space · scale 1:50",
    "producción en taller": "workshop production",
    "montaje listo": "build complete",
    "Estudio": "Studio",
    "Servicios": "Services",
    "Proyectos": "Projects",
    "Proceso": "Process",
    "Contacto": "Contact",
    "Menú": "Menu",
    "Diseño que": "Design that",
    "conecta": "connects",
    "Diseñamos experiencias únicas que reflejan tu identidad. Stands, eventos, locales y oficinas a medida,": "We design unique experiences that reflect your identity. Custom stands, events, retail stores and offices,",
    "llave en mano": "turnkey",
    "Hablemos de tu proyecto": "Let's talk about your project",
    "Ver proyectos": "See projects",
    "Proyecto": "Project",
    "En nuestro portfolio": "In our portfolio",
    "Ferias y eventos": "Fairs & events",
    "Hotelga · BATEV · Expo Golosinas y más": "Hotelga · BATEV · Expo Golosinas and more",
    "Trayectoria": "Since",
    "Desde INYM en Ganadera 2019": "From INYM at Ganadera 2019",
    "Llave en mano": "Turnkey",
    "Diseño · Desarrollo · Producción · Montaje": "Design · Development · Production · Build",
    "Marcas y ferias": "Brands & fairs",
    "Con una sólida trayectoria en arquitectura comercial, diseñamos espacios que traducen la identidad de cada marca y generan": "With a solid track record in commercial architecture, we design spaces that translate each brand's identity and create",
    "conexión real.": "real connection.",
    "Cada proyecto nace de escuchar tus necesidades para crear espacios que conectan y potencian la identidad de tu marca en eventos y ferias.": "Every project starts by listening to your needs, to create spaces that connect and strengthen your brand's identity at events and trade fairs.",
    "L–V": "M–F",
    "9 a 18 h": "9 am – 6 pm",
    "Del plano al espacio": "From plan to space",
    "Diseñamos espacios pensados a medida, acompañando cada proyecto de principio a fin. Nos ocupamos de todo el proceso para que vos puedas enfocarte en lo que realmente importa.": "We design custom spaces and stay with every project from start to finish. We take care of the whole process so you can focus on what really matters.",
    "— /stand-a-medida": "— /custom-stands",
    "Creamos stands y experiencias a medida que reflejan tu marca. Desde el concepto hasta el montaje, acompañamos cada paso para que tu stand sea una extensión auténtica de tu marca.": "We create custom stands and experiences that reflect your brand. From concept to build, we're with you every step so your stand is an authentic extension of your brand.",
    "Ferias": "Trade fairs",
    "Exposiciones": "Exhibitions",
    "Quiero mi stand": "I want my stand",
    "01 · stand": "01 · stand",
    "— /eventos-unicos": "— /unique-events",
    "Eventos pensados para conectar tu marca con sus futuros clientes. Pensamos la estrategia, diseñamos la experiencia y ejecutamos cada detalle para que tu evento llegue a quienes querés llegar.": "Events designed to connect your brand with its future customers. We plan the strategy, design the experience and execute every detail so your event reaches the people you want to reach.",
    "Estrategia": "Strategy",
    "Experiencia": "Experience",
    "Ejecución": "Execution",
    "Planear un evento": "Plan an event",
    "02 · evento": "02 · event",
    "— /locales-y-oficinas": "— /retail-and-offices",
    "Espacios pensados para reflejar la identidad de tu marca y acompañar su crecimiento. Diseñamos y desarrollamos locales comerciales y oficinas a medida, cuidando la experiencia, la funcionalidad y cada detalle.": "Spaces designed to reflect your brand's identity and support its growth. We design and build custom retail stores and offices, taking care of the experience, the functionality and every detail.",
    "Locales comerciales": "Retail stores",
    "Oficinas": "Offices",
    "Arquitectura comercial": "Commercial architecture",
    "Diseñar mi espacio": "Design my space",
    "03 · local": "03 · retail",
    "Experiencias a medida en ferias, presentaciones y eventos. Cada stand, una extensión auténtica de la marca.": "Custom experiences at trade fairs, launches and events. Every stand, an authentic extension of the brand.",
    "Desplazá para recorrer": "Scroll to explore",
    "Deslizá para ver más": "Swipe to see more",
    "Evento presentación · 2024": "Product launch · 2024",
    "Tu marca, acá": "Your brand, here",
    "Ofrecemos un servicio integral llave en mano: diseño, desarrollo, producción y montaje. Desplazá y mirá cómo se arma un stand.": "We offer a full turnkey service: design, development, production and build. Scroll and watch a stand come together.",
    "stand_tu-marca.dwg": "stand_your-brand.dwg",
    "esc 1:50": "scale 1:50",
    "Fase": "Phase",
    "Diseño": "Design",
    "Creemos que un buen diseño empieza por escuchar. Comprendemos tu marca y la traducimos en un espacio.": "We believe good design starts with listening. We understand your brand and translate it into a space.",
    "Desarrollo": "Development",
    "Desarrollamos el proyecto a medida, cuidando la experiencia, la funcionalidad y cada detalle.": "We develop the project to measure, taking care of the experience, the functionality and every detail.",
    "Producción": "Production",
    "Producimos cada pieza con un enfoque integral, cuidando cada etapa del proyecto.": "We produce every piece with an integrated approach, taking care of every stage of the project.",
    "Montaje": "Build",
    "Llegamos a la feria y lo dejamos listo, con la tranquilidad de que cada detalle está cuidado.": "We arrive at the fair and leave it ready, with the peace of mind that every detail is taken care of.",
    "Nuestro enfoque": "Our approach",
    "Un buen diseño empieza por": "Good design starts with",
    "escuchar.": "listening.",
    "Nuestro enfoque se basa en comprender a cada cliente para crear soluciones reales y a medida.": "Our approach is built on understanding each client to create real, tailor-made solutions.",
    "Trabajamos con un enfoque integral que combina estrategia, diseño y ejecución, cuidando cada etapa del proyecto.": "We work with an integrated approach that combines strategy, design and execution, taking care of every stage of the project.",
    "Integral": "Integrated",
    "Estrategia, diseño": "Strategy, design",
    "y ejecución": "and execution",
    "Un solo equipo de principio a fin.": "One team from start to finish.",
    "Pensamos cómo conectar tu marca con sus futuros clientes.": "We plan how to connect your brand with its future customers.",
    "Espacios que traducen la identidad de cada marca.": "Spaces that translate each brand's identity.",
    "Ejecutamos cada detalle, de la producción al montaje.": "We execute every detail, from production to build.",
    "Hagamos tu proyecto": "Let's make your project",
    "único.": "unique.",
    "Estamos listos para escuchar tu proyecto y crear juntos una experiencia única.": "We're ready to hear about your project and create a unique experience together.",
    "Contactanos hoy mismo": "Contact us today",
    "Hablemos de tu proyecto y cómo hacerlo": "Let's talk about your project and how to make it",
    "Contanos tu idea: la feria, el evento o el espacio que tenés en mente. También podés escribirnos por WhatsApp.": "Tell us your idea: the fair, the event or the space you have in mind. You can also message us on WhatsApp.",
    "Teléfono": "Phone",
    "Dónde estamos": "Where we are",
    "Horario": "Hours",
    "Lunes a viernes, 9 a 18 h": "Monday to Friday, 9 am – 6 pm",
    "nuevo_proyecto.brief": "new_project.brief",
    "* obligatorio": "* required",
    "Nombre completo": "Full name",
    "Correo electrónico *": "Email *",
    "Tipo de proyecto": "Project type",
    "Seleccioná una opción": "Choose an option",
    "Stand a medida": "Custom stand",
    "Eventos únicos": "Unique events",
    "Locales y oficinas": "Retail & offices",
    "Otro": "Other",
    "Mensaje *": "Message *",
    "Enviar consulta": "Send inquiry",
    "Secciones": "Sections",
    "Redes": "Social",
    "Understand Studio. Todos los derechos reservados.": "Understand Studio. All rights reserved.",
    "Gavilán 1924 — Buenos Aires, Argentina": "Gavilán 1924 — Buenos Aires, Argentina",
    "Understand Studio es un estudio de diseño y producción de stands para ferias y exposiciones, eventos, locales comerciales y oficinas a medida, con servicio integral llave en mano en Buenos Aires, Argentina.": "Understand Studio is a design and production studio for custom exhibition stands, events, retail stores and offices, offering a full turnkey service in Buenos Aires, Argentina."
  };

  /* Títulos donde cambia el orden de las palabras: se reemplaza el HTML completo */
  var H = [
    [".stack__platforms", "Some of the <b>brands</b> and <b>fairs</b> in our portfolio"],
    ["#servicios .h2", "Stands and experiences <em>made to measure</em>"],
    [".scard:nth-child(1) .scard__title", "Custom <em>stands</em>"],
    [".scard:nth-child(2) .scard__title", "Unique <em>events</em>"],
    [".scard:nth-child(3) .scard__title", "Retail <em>&amp; offices</em>"],
    ["#proyectos .h2", "Unique designs that reflect <em>your image</em>"],
    [".projects__outro-txt", "Is the next stand <em>yours?</em>"],
    ["#proceso .h2", "From blueprint <em>to build</em>"]
  ];

  /* Atributos */
  var A = {
    "Proyecto": "Project",
    "Marcas y ferias": "Brands & fairs",
    "Evento presentación · 2024": "Product launch · 2024",
    "Contacto": "Contact",
    "understand studio": "understand studio",
    "Navegación principal": "Main navigation",
    "Understand Studio — inicio": "Understand Studio — home",
    "Activar modo día": "Switch to light mode",
    "Modo día / noche": "Light / dark mode",
    "Abrir menú": "Open menu",
    "Proyecto anterior": "Previous project",
    "Proyecto siguiente": "Next project",
    "Cerrar": "Close",
    "Planos de un stand, muestras de materiales y cinta métrica sobre la mesa de diseño": "Stand blueprints, material samples and a measuring tape on the design table",
    "Stand a medida diseñado por Understand Studio": "Custom stand designed by Understand Studio",
    "Evento de presentación de Opella diseñado por Understand Studio": "Opella product launch event designed by Understand Studio",
    "Local comercial diseñado por Understand Studio": "Retail space designed by Understand Studio",
    "Stand de Opella, evento presentación 2024": "Opella stand, product launch 2024",
    "Stand de Editorial Dunken, 2019": "Editorial Dunken stand, 2019",
    "Predio vacío marcado con cinta en un pabellón de feria": "Empty plot marked with tape in an exhibition hall",
    "Predio vacío marcado con cinta naranja en un pabellón de feria": "Empty plot marked with tape in an exhibition hall",
    "Stand con exhibición de producto": "Stand with product display",
    "Un stand que se arma en cuatro etapas": "A stand that comes together in four stages",
    "Hablemos": "Let's talk",
    "Escribí tu nombre": "Your name",
    "Tu email": "Your email",
    "Contanos tu idea": "Tell us your idea",
    "Volver arriba": "Back to top",
    "Escribinos por WhatsApp": "Message us on WhatsApp",
  };

  var META = {
    title: "Understand Studio — Exhibition stand design & production in Buenos Aires",
    description: "Design and production studio for custom exhibition stands, events, retail stores and offices. Full turnkey service: design, development, production and build. Buenos Aires, Argentina.",
    ogTitle: "Understand Studio — Design that connects",
    ogDescription: "Design and production of custom stands for trade fairs, events, retail stores and offices. Turnkey, in Buenos Aires."
  };

  var norm = function (s) { return s.replace(/\s+/g, " ").trim(); };

  function translate() {
    // títulos con otro orden
    H.forEach(function (h) {
      var el = document.querySelector(h[0]);
      if (el) el.innerHTML = h[1];
    });
    // nodos de texto
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        return p === "SCRIPT" || p === "STYLE" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    var nodes = [], n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var raw = node.nodeValue, key = norm(raw);
      if (!key || !Object.prototype.hasOwnProperty.call(T, key)) return;
      var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      node.nodeValue = lead + T[key] + trail;
    });
    // atributos
    var stand = /^Stand de (.+) en (.+)$/;
    document.querySelectorAll("[alt],[placeholder],[aria-label],[title],[data-ev]").forEach(function (el) {
      ["alt", "placeholder", "aria-label", "title", "data-ev"].forEach(function (a) {
        var v = el.getAttribute(a);
        if (!v) return;
        if (A[v]) el.setAttribute(a, A[v]);
        else if (a === "alt" && stand.test(v)) el.setAttribute(a, v.replace(stand, "$1 stand at $2"));
      });
    });
    // texto circular de los sellos
    var tp = document.querySelectorAll("textPath");
    tp.forEach(function (t) {
      var v = norm(t.textContent);
      if (v.indexOf("DISEÑO") === 0) t.textContent = "DESIGN · DEVELOPMENT · PRODUCTION · BUILD · ";
      if (v.indexOf("LLAVE EN MANO") === 0) t.textContent = "TURNKEY · BUENOS AIRES · ARGENTINA · ";
    });
    // meta
    document.title = META.title;
    var set = function (sel, val) { var m = document.querySelector(sel); if (m) m.setAttribute("content", val); };
    set('meta[name="description"]', META.description);
    set('meta[property="og:title"]', META.ogTitle);
    set('meta[property="og:description"]', META.ogDescription);
    set('meta[name="twitter:title"]', META.ogTitle);
    set('meta[name="twitter:description"]', META.ogDescription);
    set('meta[property="og:locale"]', "en_US");
    set('meta[property="og:locale:alternate"]', "es_AR");
    set('meta[property="og:url"]', "https://understandstudio.com.ar/?lang=en");
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute("href", "https://understandstudio.com.ar/?lang=en");
  }

  if (lang === "en") translate();
  html.classList.remove("i18n-pending");

  /* Selector de idioma: guarda la elección y recarga en la misma posición */
  function setLang(next) {
    if (next === lang) return;
    try {
      localStorage.setItem("understand-lang", next);
      sessionStorage.setItem("understand-restore-y", String(window.scrollY || 0));
    } catch (e) { /* almacenamiento no disponible */ }
    // Si la URL trae ?lang=, se actualiza para que no pise la elección
    if (/[?&]lang=/.test(window.location.search)) {
      var url = new URL(window.location.href);
      if (next === "es") url.searchParams.delete("lang"); else url.searchParams.set("lang", next);
      window.location.replace(url.toString());
    } else {
      window.location.reload();
    }
  }
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    var on = b.getAttribute("data-lang") === lang;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", String(on));
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  /* Textos que usa main.js */
  window.__T = lang === "en"
    ? {
      phases: ["Design", "Development", "Production", "Build"],
      toLight: "Switch to light mode", toDark: "Switch to dark mode",
      openMenu: "Open menu", closeMenu: "Close menu",
      formErr: "Please check the highlighted fields.",
      formOk: "Opening your email app to send the inquiry…",
      newProject: "New project",
    }
    : {
      phases: ["Diseño", "Desarrollo", "Producción", "Montaje"],
      toLight: "Activar modo día", toDark: "Activar modo noche",
      openMenu: "Abrir menú", closeMenu: "Cerrar menú",
      formErr: "Revisá los campos marcados.",
      formOk: "Abriendo tu correo para enviar la consulta…",
      newProject: "Nuevo proyecto",
    };
})();
