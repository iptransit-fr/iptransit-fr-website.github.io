# IPTransit-FR Website — Version 2

A redesigned and more robust Version 2 of the IPTransit-FR online bookstore.

## Why V2

Version 2 removes the JSON `fetch()` dependency from the storefront and embeds the demo catalog directly in JavaScript. This makes the site more reliable on GitHub Pages and avoids the most common issue where the page renders as plain HTML because resources were uploaded into the wrong folder.

## Included

- Responsive professional homepage
- Books catalog
- Search
- Category filters
- Sorting
- Individual book page
- Browser-based cart
- Browser-based wishlist
- About
- Contact
- FAQ
- Privacy draft
- Terms draft
- Custom 404
- Mobile navigation
- Self-contained HTML pages with inline CSS and JavaScript fallback
- GitHub Pages-compatible relative links

## Correct upload structure

**Important:** upload the CONTENTS of this folder to the root of the repository.

```text
repository-root/
├── assets/
│   ├── css/
│   │   └── site.css
│   ├── img/
│   │   └── brand-logo.png
│   └── js/
│       └── site.js
├── pages/
│   ├── about.html
│   ├── book.html
│   ├── cart.html
│   ├── contact.html
│   ├── faq.html
│   ├── privacy.html
│   ├── shop.html
│   └── terms.html
├── 404.html
├── index.html
├── README.md
└── .nojekyll
```

Do **not** upload the outer `IPTransit-FR-v2` folder itself as a nested folder if GitHub Pages is configured to publish from the repository root.

## GitHub Pages

1. Upload all files and folders shown above.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.
6. Wait for GitHub Pages to finish deployment.

## Important V2 limitation

This is a front-end demo. Live payments, database, authentication, inventory, order fulfillment, and transactional email are not connected.

## Version

`2.0.0`

© 2026 IPTransit-FR.


## Reliability improvement

Every HTML page in V2 contains its CSS and JavaScript inline. The `assets/css` and `assets/js` copies are also included for easier future development. This prevents the unstyled/plain-HTML problem if GitHub Pages asset paths are misconfigured.
