# Stunning Floral Events

A responsive floral decoration booking and management **browser-local prototype** built using HTML5, CSS3, vanilla JavaScript (ES modules), Google Fonts, Lucide icons and Chart.js. No PHP, MySQL, Supabase, Firebase, React, or backend is required.

## Run

1. Extract the ZIP.
2. Open `stunning-floral-events` in Visual Studio Code.
3. Install the VS Code **Live Server** extension and choose **Open with Live Server** on `index.html`; or use `python -m http.server 5500` inside the project folder.
4. Open `http://localhost:5500/` for the customer website and `http://localhost:5500/admin/login.html` for admin.

Do not open via `file://`, as some browsers block JavaScript modules on file URLs.

## Demo Admin Login

- Username: `Admin@stunningfloral`
- Password: `floralevents#88`

Set the owner's WhatsApp number in **Admin → Settings** before testing messaging.

## Key features

- Dozens of Sri Lankan events across wedding, family, cultural, corporate and special occasions.
- Three editable floral packages; editable add-ons; multi-step booking wizard; flowers and colour selections; local image preview storage (350KB limit); estimated live quotation.
- Unique booking references and local persistence; customer register, login, profile, bookings and reviews; WhatsApp prefilled booking links.
- Admin dashboard, booking status and final quotation edits, WhatsApp customer confirmations, CRUD for events/packages/add-ons/gallery/services, review approval, customer list, contact enquiries, report charts and CSV export.
- JSON backup and restore and reset controls.

## Important limitations

**This is a prototype, not a production system.** Browser LocalStorage and sessionStorage are not safe for real passwords, payment information, or personally identifying customer data. Admin restrictions can be bypassed by browser users. All users of the same browser origin may inspect stored data. Data is stored in the *same browser and same origin* only. No automatic multi-device synchronisation or server notifications exist. Opening WhatsApp creates a draft: users must manually send it.

Use only demo personal information and throwaway passwords. Clearing browser storage erases local records unless you exported a backup. External fonts, image URLs, Lucide and Chart.js rely on internet access. Sample images are hotlinked from Unsplash and can be replaced. An actual business deployment needs a secure backend and authentication.

## Brand logo

A typographic floral mark is included in the header. To replace it with the client's official uploaded logo, place `logo.png` in `assets/images/` and update the `header()` markup in `assets/js/app.js` plus `admin-brand` in `assets/js/admin.js` to use an `<img>`.

## Pages

Customer pages are at project root. Admin pages are under `/admin`. Shared local persistence lives in `assets/js/storage.js`. Styling is in `assets/css/style.css` and `assets/css/admin.css`.
