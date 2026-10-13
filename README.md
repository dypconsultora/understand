# Understand Studio — Landing

Landing de una sola página para [Understand Studio](https://understandstudio.com.ar/): diseño y producción de stands, eventos, locales y oficinas.

Sitio estático (HTML + CSS + JavaScript, sin paso de build) con animaciones en GSAP 3.15 cargado desde CDN.

## Estructura

```
index.html              landing
assets/css/styles.css   tokens de marca, componentes y secciones
assets/js/main.js       animaciones (GSAP)
assets/js/i18n.js       traducción al inglés y selector de idioma
assets/img/             logo, fotos de proyectos y favicon
```

## Probar en local

```bash
python3 -m http.server 5173
```

Y abrir `http://localhost:5173`.

## Idiomas

El HTML está en español. Si el navegador no está en español, `i18n.js` traduce la página al inglés. El visitante puede cambiar de idioma con el selector ES | EN.
