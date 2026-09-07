# Working Together — V2 draft

This package contains the revised structure for the Working Together site.

## Main changes

- Two working formats only: Commissioned Work and Creative Collaboration.
- Paid model bookings removed as a working format; retained only as an FAQ answer.
- New result-first section: What you can expect.
- New process section: How I work.
- Respect and trust integrated into the process instead of being presented as a separate promise.
- New short personal About section.
- Image series are now first-class JSON content with three layouts: `feature-thumbs`, `strip`, and `pair`.
- Navigation and nearly all visible copy now live in `content.json`.
- No fixed image counts, session blocks or package logic in commissioned work.

## Image handling

The draft deliberately reuses filenames already present in the existing repository so it can be dropped into the current project without requiring a new asset structure immediately.

The image choices are provisional. Replace or reorder the `series.images` arrays in `content.json` once the final photographic selection is made.

## Preview

Keep the existing `assets/` folder from the repository beside these files, then serve the directory through a local HTTP server because `content.json` is loaded with `fetch()`.

Example:

    python3 -m http.server 8000

