# 📚 IPTransit-FR — Website V1

**Books. Knowledge. Stories Without Borders.**

This repository contains Version 1 of the official **IPTransit-FR** online bookstore website.

## Included in V1

- Professional responsive homepage
- Full bookstore/catalog page
- Search and category filters
- Sorting by price, title, and rating
- 12 original demonstration book listings
- Dynamic individual book detail page
- Functional shopping cart using browser `localStorage`
- Functional wishlist using browser `localStorage`
- Responsive mobile navigation
- About page
- Contact page with demo form behavior
- FAQ page
- Draft Privacy Policy
- Draft Terms of Service
- Custom 404 page
- SEO-ready `robots.txt` and `sitemap.xml`
- Web app manifest
- Company brand image
- Fully static architecture suitable for GitHub Pages

## Important

Version 1 is a **front-end demonstration storefront**.

The following production services are **not yet connected**:

- Real payment processing
- Customer authentication
- Database
- Inventory synchronization
- Live order fulfillment
- Transactional email delivery
- Live contact form backend

## Project Structure

```text
IPTransit-FR-v1/
├── assets/
│   └── images/
│       └── iptransit-fr-logo.png
├── css/
│   └── style.css
├── data/
│   └── books.json
├── js/
│   └── app.js
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
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── .gitignore
└── README.md
```

## Local Preview

Because the catalog is loaded from `data/books.json`, preview the project through a local web server rather than opening the HTML file directly.

### Python

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## GitHub Pages

Upload the complete contents of this folder to your GitHub repository.

Then:

1. Open the repository **Settings**
2. Select **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select the `main` branch and `/ (root)`
5. Save

## Brand Information

- **Company:** IPTransit-FR
- **Industry:** Books & E-Commerce
- **Public Location Used in V1:** New York, NY, United States
- **General Contact:** contact@iptransit-fr.com
- **Customer Support:** support@iptransit-fr.com
- **Slogan:** Books. Knowledge. Stories Without Borders.

## Version

`1.0.0`

© 2026 IPTransit-FR. All rights reserved.
