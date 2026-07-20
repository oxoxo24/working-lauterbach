# Working Lauterbach — JSON version

## Files
- `index.html` contains only the page structure.
- `content.json` contains all editable text, links and image filenames.
- `app.js` reads the JSON and creates the page sections.
- `styles.css` contains the complete visual design.
- `assets/` contains 4:5 placeholder images.

## Replacing images
Overwrite a placeholder in `assets/` with your selected image using exactly the same filename.

All placeholder files use a 4:5 Instagram portrait ratio (1200 × 1500 px).
The CSS uses fixed aspect-ratio frames with `object-fit: contain`, so images are never stretched or cropped.
For the cleanest result, export the final images in 4:5 before replacing them.

## Editing text
Only edit `content.json`. Keep commas and quotation marks valid JSON.

## Local preview
Because the page loads JSON with `fetch()`, it should be viewed through a local server or Vercel, not by double-clicking `index.html`.

Example:
`python3 -m http.server 8000`
