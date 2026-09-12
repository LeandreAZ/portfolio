# Portfolio de Léandre Ribeiro Gonçalves

Portfolio personnel développé en HTML, CSS et JavaScript natifs. Il présente mes projets, ma stack technique, mon parcours et mes coordonnées.

## Fonctionnalités

- interface responsive jusqu'à 240 px ;
- thèmes clair et sombre avec préférence persistante ;
- contenu disponible en français et en anglais ;
- galeries de projets accessibles au clavier ;
- visionneuse d'images avec navigation ;
- animations respectant `prefers-reduced-motion`.

## Organisation

```text
.
├── index.html
├── mentions-legales.html
├── index.js
├── translations.js
├── styles/
│   ├── base.css
│   ├── responsive.css
│   ├── refinements.css
│   └── final-adjustments.css
├── img/
├── cv.pdf
```

Les fichiers chargés par le navigateur sont conservés sans framework ni outil de build complexe.

## Lancer le projet localement

Les modules JavaScript nécessitent un serveur HTTP local :

```bash
python -m http.server 8000
```

Ouvrir ensuite [http://localhost:8000](http://localhost:8000).

## Licence

Ce projet est distribué sous licence MIT. Consultez le fichier [LICENSE](./LICENSE).
