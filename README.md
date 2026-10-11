# Portafolio de Juan Elías — versión actualizada

Web estática construida con **HTML, CSS y JavaScript**, sin instalar dependencias. Conserva el tema oscuro/claro, animaciones y partículas reactivas al mouse.

## 1. Abrir en Visual Studio Code

1. Extrae el ZIP completo.
2. Abre la carpeta `portfolio-juan-elias` en VS Code.
3. Abre `index.html` usando **Live Server** o directamente con el navegador.

**Importante:** no separes `index.html`, `styles.css` y `main.js`: están enlazados en la raíz de esta misma carpeta.

## 2. Tu fotografía

Coloca una foto tuya con el nombre exacto:

`src/img/yo.jpg`

Se mostrará automáticamente en la sección **Sobre mí**, sustituyendo al marcador de foto que aparece cuando no está el archivo. Recomendación: fotografía en vertical/cuadrada, con buena resolución. Si usas `.png` o `.webp`, cambia la extensión de la ruta en `index.html`.

## 3. Tres imágenes para CADA proyecto

Al pulsar **Ver más**, se abre una ventana con descripción, funcionalidades, tecnologías y **tres capturas**. Las rutas están preconfiguradas en el arreglo `projectDetails` de `main.js`:

| Proyecto | Primera captura | Segunda captura | Tercera captura |
| --- | --- | --- | --- |
| MiTurno | `src/img/miturno-1.jpg` | `src/img/miturno-2.jpg` | `src/img/miturno-3.jpg` |
| La Casa del Globo POS | `src/img/pos-1.jpg` | `src/img/pos-2.jpg` | `src/img/pos-3.jpg` |
| S / Split | `src/img/split-1.jpg` | `src/img/split-2.jpg` | `src/img/split-3.jpg` |

Copia tus **9 imágenes** en `src/img/` con esos nombres. No necesitas modificar código si respetas los nombres. Si falta alguna, se verá un marcador visual con la ruta de archivo correspondiente, **sin mostrar el icono de imagen rota**. Las fotografías cargadas pueden abrirse más grandes al pulsar sobre ellas.

Para modificar títulos, descripciones, funciones o etiquetas de las capturas, edita `projectDetails` en `main.js`.

## 4. Recursos compartidos

La sección **Recursos** se alimenta del arreglo `recursosCompartidos` en `main.js`. Contiene algunos **ejemplos de recursos públicos** que puedes sustituir por los materiales que realmente utilizaste. Cada recurso utiliza esta estructura:

```js
{
  title: 'Nombre del recurso',
  description: 'Una descripción breve del material',
  category: 'Cursos',
  label: 'JAVASCRIPT',
  url: 'https://ejemplo.com/mi-curso'
},
```

Para añadir recursos, copia otro objeto dentro del arreglo y cambia sus datos. Puedes añadir todos los recursos que desees. Los botones de filtro se crean automáticamente con las categorías que escribas.

Si quieres compartir archivos propios, guárdalos en `src/recursos/` y utiliza una URL relativa como `./src/recursos/mi-material.pdf`. Verifica que tienes permiso para redistribuirlos. Recomendación: para libros sujetos a derechos de autor, publica el **enlace oficial** en vez de subir el PDF sin permiso.

> La web es estática. Para publicar nuevos recursos, edita el arreglo, guarda y vuelve a desplegar el sitio. Los visitantes no pueden publicar recursos en tu nombre.

## 5. Contacto y código

- WhatsApp: `https://wa.me/522941055499` (corresponde a **294 105 54 99**, con lada mexicana `52`).
- Ya **no aparecen enlaces al código fuente en las tarjetas de los proyectos**. Se sustituyeron por **Ver más**. El resto del portafolio conserva el acceso a tu perfil público de GitHub como contacto profesional.
- **Importante:** quitar los enlaces no hace privados tus repositorios. Si deseas que el código no pueda consultarse en GitHub, cambia la visibilidad de dichos repositorios a **privada** en GitHub.

## Archivos

```text
portfolio-juan-elias/
├── index.html
├── styles.css
├── main.js
├── assets/
│   └── favicon.svg
└── src/
    ├── img/
    │   ├── yo.jpg                ← tu foto (debes añadirla)
    │   ├── miturno-1.jpg ... 3  ← capturas (debes añadirlas)
    │   ├── pos-1.jpg ... 3
    │   └── split-1.jpg ... 3
    └── recursos/               ← PDF u otros archivos que quieras compartir
```

## Personalización visual

Los colores de marca (`--accent`, `--violet`, `--bg`) se pueden modificar en `styles.css`. Los efectos de partículas, menú, modo claro/oscuro, modal de proyectos y recursos se encuentran en `main.js`.

© 2026 Juan Elías Corona Cuevas.
