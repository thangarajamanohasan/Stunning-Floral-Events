import {
  get,
  set,
  add,
  update,
  uid,
  esc,
  money,
  wa,
  session,
  signIn,
  signOut,
  init,
  toast,
  query,
  photos,
  categoryNames,
  backup,
  bookingMessage,
} from "./storage.js";
init();
const page = document.body.dataset.page,
  root = document.querySelector("#app"),
  S = () => get("settings", {}),
  events = () => get("events"),
  packs = () => get("packages").filter((x) => x.active),
  addons = () => get("addons").filter((x) => x.active),
  user = () => (session()?.role === "customer" ? session() : null);
const img = (src, alt = "Floral arrangement") =>
  `<img loading="lazy" src="${esc(src)}" alt="${esc(alt)}">`;
const a = (text, to, cls = "btn btn-green") =>
  `<a class="${cls}" href="${to}">${text}</a>`;
function header() {
  return `<div class="announcement">Crafting beautiful memories, one bloom at a time <span>✦</span> Sri Lanka</div><header class="site-header"><a class="brand" href="index.html"><span class="brand-mark">✿</span><span>STUNNING <b>FLORAL</b><small>EVENTS & DECOR</small></span></a><button class="hamburger" id="menu-toggle" aria-label="Toggle menu"><i data-lucide="menu"></i></button><nav id="menu"><a href="index.html">Home</a><a href="services.html">Services</a><a href="events.html">Events</a><a href="packages.html">Packages</a><a href="gallery.html">Gallery</a><a href="about.html">About</a><a href="contact.html">Contact</a><a href="${user() ? "profile" : "login"}.html">${user() ? "My Account" : "Sign In"}</a><a href="admin/login.html" class="admin-login-link"><i data-lucide="shield-check" aria-hidden="true"></i> Admin Login</a>${a("Plan Your Event →", "customize.html", "btn btn-gold small")}</nav></header>`;
}
function footer() {
  return `<footer><div class="footer-grid"><div><div class="brand footer-brand"><span class="brand-mark">✿</span><span>STUNNING <b>FLORAL</b><small>EVENTS & DECOR</small></span></div><p>Artfully designed florals for life's most beautiful celebrations. From intimate gatherings to grand occasions.</p></div><div><h4>Explore</h4><a href="services.html">Our Services</a><a href="events.html">Occasions</a><a href="packages.html">Packages</a><a href="gallery.html">Gallery</a></div><div><h4>Information</h4><a href="about.html">Our Story</a><a href="faq.html">FAQs</a><a href="privacy.html">Privacy Policy</a><a href="reviews.html">Reviews</a></div><div><h4>Let's Create Magic</h4><p>${esc(S().address || "Sri Lanka")}</p><p>${esc(S().email || "Contact us for a quotation")}</p><p>${esc(S().phone || "")}</p>${a("Start Planning →", "customize.html", "btn btn-outline")}</div></div><div class="footer-bottom">© ${new Date().getFullYear()} Stunning Floral Events. Made with love and flowers. <a href="admin/login.html">Admin</a></div></footer><a class="float-whatsapp" id="chat" href="#" aria-label="Contact on WhatsApp"><i data-lucide="message-circle"></i></a><button id="scrollTop" class="scrolltop" aria-label="Scroll to top">↑</button>`;
}
function title(k, t, sub = "") {
  return `<section class="page-banner"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${sub}</p></section>`;
}
function sectionTitle(label, heading, desc = "") {
  return `<div class="section-title"><span class="eyebrow">${label}</span><h2>${heading}</h2>${desc ? `<p>${desc}</p>` : ""}<span class="little-flower">✿</span></div>`;
}
function eventCard(e) {
  return `<a class="event-card" href="packages.html?event=${encodeURIComponent(e.name)}"><div class="media">${img(e.image, e.name)}<span class="round-arrow">↗</span></div><div class="event-info"><small>${esc(categoryNames[e.category])}</small><h3>${esc(e.name)}</h3><span>Discover the experience →</span></div></a>`;
}
function packageCard(p, event = "") {
  return `<article class="package-card">${p.featured ? '<span class="ribbon">MOST LOVED</span>' : ""}<div class="package-img">${img(p.image, p.name)}</div><div class="package-content"><span class="eyebrow">THE ${esc(p.name).toUpperCase()} EXPERIENCE</span><h3>${esc(p.name)}</h3><p>${esc(p.description || "")}</p><div class="price">${money(p.price)} <small>starting from</small></div><ul>${(
    p.features || []
  )
    .slice(0, 6)
    .map((f) => `<li><i data-lucide="check"></i> ${esc(f)}</li>`)
    .join(
      "",
    )}</ul><div class="package-actions">${a("Details", "package-details.html?id=" + encodeURIComponent(p.id), "btn btn-outline")}${a("Customize →", "customize.html?package=" + encodeURIComponent(p.id) + (event ? "&event=" + encodeURIComponent(event) : ""), "btn btn-green")}</div></div></article>`;
}
function home() {
  return `<section class="hero"><div class="hero-visual">${img("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1700&q=85", "Elegant floral wedding setting")}</div><div class="hero-shade"></div><div class="hero-content"><span class="hero-kicker">✦ THE ART OF CELEBRATING BEAUTIFULLY ✦</span><h1>Where every moment <em>blooms.</em></h1><p>Extraordinary floral styling for life's most meaningful celebrations. Beautifully imagined, lovingly created.</p><div class="hero-actions">${a("Explore Our Collections", "packages.html", "btn btn-gold")}${a("Begin Your Story ↗", "customize.html", "btn btn-white-outline")}</div></div><div class="hero-scroll">SCROLL TO EXPLORE ↓</div></section><div class="feature-strip"><span>✿ Bespoke Floral Designs</span><span>✧ Unforgettable Celebrations</span><span>✿ Crafted With Love</span><span>✧ Across Sri Lanka</span></div><section class="section container">${sectionTitle("MADE FOR YOUR MOMENTS", "Every occasion deserves flowers", "From your most intimate celebrations to grand once-in-a-lifetime events.")}<div class="cards-grid events-grid">${[
    "romance",
    "family",
    "culture",
  ]
    .map((c) => {
      let e = events().find((x) => x.category === c && x.active);
      return e ? eventCard(e) : "";
    })
    .join(
      "",
    )}</div><div class="center-space">${a("Discover All Occasions →", "events.html", "btn btn-outline")}</div></section><section class="section blush"><div class="container">${sectionTitle("CHOOSE YOUR EXPERIENCE", "A floral story for every budget", "Three thoughtfully curated collections, each designed to be uniquely yours.")}<div class="cards-grid">${packs()
    .map((p) => packageCard(p))
    .join(
      "",
    )}</div></div></section><section class="statement"><span>✿</span><h2>Life is made of moments.<br><em>We make them beautiful.</em></h2><p>Tell us your vision. We’ll bring it to life with flowers, artistry, and a little magic.</p>${a("Design My Celebration →", "customize.html", "btn btn-gold")}</section><section class="section container">${sectionTitle("INSPIRATION", "Moments in bloom")}<div class="gallery-preview">${get(
    "gallery",
  )
    .filter((g) => g.active)
    .slice(0, 3)
    .map((g) => `<a href="gallery.html">${img(g.image, g.name)}</a>`)
    .join(
      "",
    )}</div><div class="center-space">${a("View Our Gallery →", "gallery.html", "btn btn-outline")}</div></section><section class="section blush"><div class="container">${sectionTitle("KIND WORDS", "Love notes from our clients")}<div class="cards-grid">${get(
    "reviews",
  )
    .filter((r) => r.status === "Approved")
    .slice(0, 3)
    .map(
      (r) =>
        `<div class="quote-card"><span class="stars">${"★".repeat(r.rating)}</span><p>“${esc(r.text)}”</p><strong>— ${esc(r.name)}</strong></div>`,
    )
    .join("")}</div></div></section>`;
}
function eventsPage() {
  return (
    title(
      "CURATED OCCASIONS",
      "Celebrate every chapter",
      "Explore our collection of floral experiences inspired by Sri Lankan traditions and life’s milestones.",
    ) +
    `<div class="container section"><div class="filterbar"><input id="eventSearch" placeholder="Search an occasion..." aria-label="Search events"><select id="eventCategory"><option value="">All occasions</option>${Object.entries(
      categoryNames,
    )
      .map(([k, v]) => `<option value="${k}">${v}</option>`)
      .join(
        "",
      )}</select></div><div id="eventGrid" class="cards-grid events-grid"></div></div>`
  );
}
function packagesPage() {
  let ev = query("event") || "";
  return (
    title(
      "OUR COLLECTIONS",
      "Beautifully curated packages",
      "Choose the perfect beginning, then make every detail your own.",
    ) +
    `<section class="container section"><div class="center-space"><label>Occasion <select id="pEvent"><option value="">Any occasion</option>${events()
      .filter((e) => e.active)
      .map(
        (e) =>
          `<option ${ev === e.name ? "selected" : ""}>${esc(e.name)}</option>`,
      )
      .join("")}</select></label></div><div class="cards-grid">${packs()
      .map((p) => packageCard(p, ev))
      .join(
        "",
      )}</div><p class="fineprint">Prices are estimates. Final pricing is confirmed after we review your event requirements.</p></section>`
  );
}
function details() {
  let p = packs().find((x) => x.id === query("id")) || packs()[0];
  if (!p) return title("PACKAGES", "No packages yet");
  return (
    title(
      "THE COLLECTION",
      esc(p.name),
      "An unforgettable floral experience designed around you.",
    ) +
    `<div class="container section detail-layout"><div class="detail-photo">${img(p.image, p.name)}</div><div><span class="eyebrow">STARTING AT</span><h2>${money(p.price)}</h2><p>${esc(p.description)}</p><h3>What's included</h3><ul class="check-list">${p.features.map((f) => `<li>✓ ${esc(f)}</li>`).join("")}</ul><p>Every arrangement can be personalised to your event, venue and favourite flowers.</p>${a("Personalise This Package →", "customize.html?package=" + p.id, "btn btn-green")}${a("View Other Collections", "packages.html", "btn btn-outline")}</div></div>`
  );
}
const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];
const flowers = [
    "Roses",
    "Jasmine",
    "Orchids",
    "Lilies",
    "Sunflowers",
    "Mixed Flowers",
    "Artificial Flowers",
    "Seasonal Flowers",
  ],
  colors = [
    "White",
    "Pink",
    "Red",
    "Gold",
    "Purple",
    "Green",
    "Peach",
    "Custom",
  ];
function wizard() {
  return (
    title(
      "LET’S PLAN SOMETHING BEAUTIFUL",
      "Your dream, beautifully styled",
      "Tell us about your special day and create your perfect floral experience.",
    ) +
    `<section class="container section"><div class="wizard-shell"><div class="wizard-main"><div class="step-indicator" id="stepIndicator"></div><form id="bookingWizard"><section data-step="0"><span class="eyebrow">STEP 01 · YOUR CELEBRATION</span><h2>Tell us about your event</h2><div class="form-grid"><label>Occasion *<select required name="event"><option value="">Choose an occasion</option>${events()
      .filter((x) => x.active)
      .map(
        (e) =>
          `<option ${query("event") === e.name ? "selected" : ""}>${esc(e.name)}</option>`,
      )
      .join(
        "",
      )}</select></label><label>Event title *<input required name="title" placeholder="e.g. Our Wedding Day"></label><label>Event date *<input required type="date" name="date" min="${new Date().toISOString().slice(0, 10)}"></label><label>Start time *<input required name="startTime" type="time"></label><label>End time *<input required name="endTime" type="time"></label><label>Venue name *<input required name="venue" placeholder="Venue or hotel"></label><label class="span-2">Venue address *<input required name="address" placeholder="Street / town"></label><label>District *<select required name="district"><option value="">Select district</option>${districts.map((d) => `<option>${d}</option>`).join("")}</select></label><label>Guests *<input required min="1" max="100000" type="number" name="guests" value="100"></label></div></section><section data-step="1" hidden><span class="eyebrow">STEP 02 · THE COLLECTION</span><h2>Choose a package</h2><div class="choice-grid">${packs()
      .map(
        (p) =>
          `<label class="choice"><input type="radio" name="packageId" value="${p.id}" ${query("package") === p.id ? "checked" : ""} required><strong>${esc(p.name)}</strong><span>${money(p.price)}</span><small>${esc(p.description || "")}</small></label>`,
      )
      .join(
        "",
      )}</div></section><section data-step="2" hidden><span class="eyebrow">STEP 03 · THE DETAILS</span><h2>Make it your own</h2><p>Select your favourite flowers and your dream colour palette.</p><h3>Flower varieties</h3><div class="option-grid">${flowers.map((f) => `<label class="chip"><input type="checkbox" name="flower" value="${f}">${f}</label>`).join("")}</div><h3>Colour palette</h3><div class="option-grid">${colors.map((c, i) => `<label class="chip"><input type="radio" name="color" value="${c}" ${i === 0 ? "checked" : ""}>${c}</label>`).join("")}</div><label>Custom colour / theme<input name="customColor" placeholder="Optional: specify your colour preference"></label></section><section data-step="3" hidden><span class="eyebrow">STEP 04 · THE FINISHING TOUCHES</span><h2>Add a little extra magic</h2><div class="addons-grid">${addons()
      .map(
        (x) =>
          `<label class="addon"><input type="checkbox" name="addon" value="${x.id}"><span><strong>${esc(x.name)}</strong><small>${money(x.price)}</small></span></label>`,
      )
      .join(
        "",
      )}</div></section><section data-step="4" hidden><span class="eyebrow">STEP 05 · YOUR PREFERENCES</span><h2>Share your vision</h2><div class="form-grid"><label>Budget range <select name="budget"><option>Flexible</option><option>Under Rs. 25,000</option><option>Rs. 25,000 – 50,000</option><option>Rs. 50,000 – 100,000</option><option>Above Rs. 100,000</option></select></label><label>Decoration style<input name="style" placeholder="Romantic, minimal, traditional..."></label><label class="span-2">Special requests<textarea name="notes" rows="4" placeholder="Describe the mood, flowers or styling you love"></textarea></label><label class="span-2">Reference image (small file, up to 350KB)<input type="file" name="reference" accept="image/*"></label></div></section><section data-step="5" hidden><span class="eyebrow">STEP 06 · ALMOST THERE</span><h2>Confirm your details</h2><div id="wizardReview"></div><div class="form-grid"><label>Full name *<input name="customerName" required value="${esc(user()?.name || "")}"></label><label>Email *<input name="email" type="email" required value="${esc(user()?.email || "")}"></label><label>Phone number *<input name="phone" required type="tel" value="${esc(user()?.phone || "")}"></label><label>WhatsApp number *<input name="whatsapp" required type="tel" value="${esc(user()?.whatsapp || "")}"></label></div><p class="fineprint">Your booking is saved on this browser only. After saving, WhatsApp will open with a prefilled message; you must tap Send yourself.</p></section><div class="wizard-controls"><button type="button" id="prevStep" class="btn btn-outline" hidden>← Back</button><button type="button" id="nextStep" class="btn btn-green">Continue →</button><button type="submit" id="submitBooking" class="btn btn-gold" hidden>Confirm My Booking →</button></div></form></div><aside class="wizard-side"><span class="eyebrow">YOUR FLORAL ESTIMATE</span><h3>Celebration summary</h3><div id="estimateSide"></div><p class="fineprint">Estimated price only. Your final quote will be confirmed by our team.</p><div class="side-decor">✿</div></aside></div></section>`
  );
}
function auth(kind) {
  const reg = kind === "register";
  return (
    title(
      "WELCOME TO STUNNING FLORAL",
      reg ? "Create an account" : "Welcome back",
      reg
        ? "Save your details and keep your celebrations together."
        : "Sign in to view your floral bookings.",
    ) +
    `<section class="container section"><form id="authForm" class="auth-box"><h2>${reg ? "Join our floral family" : "Sign in"}</h2>${reg ? `<label>Full name<input required name="name"></label>` : ""}<label>Email<input type="email" required name="email"></label>${reg ? `<label>Phone<input required type="tel" name="phone"></label><label>WhatsApp<input required type="tel" name="whatsapp"></label><label>Address<input name="address"></label>` : ""}<label>Password<input type="password" minlength="6" required name="password"></label>${reg ? `<label>Confirm password<input type="password" required name="confirm"></label>` : ""}<button class="btn btn-green full">${reg ? "Create My Account" : "Sign In"}</button><p>${reg ? 'Already have an account? <a href="login.html">Sign in</a>' : 'New here? <a href="register.html">Register</a>'}</p><small>Demo only: this browser stores local account data. Do not use a real password.</small></form></section>`
  );
}
function myBookings() {
  if (!user())
    return (
      title("MY BOOKINGS", "Please sign in") +
      `<div class="center-space">${a("Sign in", "login.html")}</div>`
    );
  let b = get("bookings").filter(
    (x) => x.userId === user().id || x.email === user().email,
  );
  return (
    title(
      "MY ACCOUNT",
      "My celebrations",
      "Track the details of your floral journey.",
    ) +
    `<section class="container section">${b.length ? b.map((x) => `<article class="booking-list"><div><span class="eyebrow">${esc(x.reference)}</span><h3>${esc(x.event)}</h3><p>${esc(x.date)} · ${esc(x.packageName)} · ${esc(x.venue)}</p></div><div><span class="pill">${esc(x.status)}</span><strong>${money(x.finalAmount ?? x.estimate)}</strong><a href="confirmation.html?id=${encodeURIComponent(x.id)}">View booking →</a></div></article>`).join("") : `<div class="empty">No celebrations planned yet. ${a("Plan your first event", "customize.html")}</div>`}</section>`
  );
}
function profile() {
  if (!user()) return auth("login");
  return (
    title("YOUR SPACE", "My profile", "Keep your contact details up to date.") +
    `<section class="container section"><div class="auth-box"><form id="profileForm"><label>Full name<input required name="name" value="${esc(user().name)}"></label><label>Email<input disabled value="${esc(user().email)}"></label><label>Phone<input name="phone" value="${esc(user().phone)}"></label><label>WhatsApp<input name="whatsapp" value="${esc(user().whatsapp)}"></label><label>Address<input name="address" value="${esc(user().address)}"></label><label>New password (optional)<input type="password" name="password" minlength="6"></label><button class="btn btn-green">Save Changes</button></form><hr>${a("My Bookings", "my-bookings.html", "btn btn-outline")} <button class="btn btn-outline" id="logout">Log out</button></div></section>`
  );
}
function confirmation() {
  let b = get("bookings").find((x) => x.id === query("id"));
  return b
    ? title(
        "THANK YOU",
        "Your booking is saved",
        "Your beautiful celebration starts here.",
      ) +
        `<section class="container section"><div class="confirmation-box"><span class="success-icon">✓</span><span class="eyebrow">BOOKING REFERENCE</span><h2>${esc(b.reference)}</h2><p>Your booking is <strong>${esc(b.status)}</strong>. Our team will review your request.</p><dl><dt>Occasion</dt><dd>${esc(b.event)}</dd><dt>Package</dt><dd>${esc(b.packageName)}</dd><dt>Date</dt><dd>${esc(b.date)}</dd><dt>Venue</dt><dd>${esc(b.venue)}</dd><dt>Estimated amount</dt><dd>${money(b.estimate)}</dd></dl><button class="btn btn-green" id="sendBookingWa">Open WhatsApp Message ↗</button><button class="btn btn-outline" onclick="window.print()">Print</button><p class="fineprint">The message is prefilled only. Please send it manually inside WhatsApp.</p></div></section>`
    : title("BOOKING", "Booking not found");
}
function gallery() {
  return (
    title(
      "OUR PORTFOLIO",
      "A gallery of moments",
      "A glimpse of the beautiful stories we love to create.",
    ) +
    `<section class="container section"><div class="filterbar"><select id="galleryFilter"><option value="">All collections</option>${Object.entries(
      categoryNames,
    )
      .map(([k, v]) => `<option value="${k}">${v}</option>`)
      .join(
        "",
      )}</select></div><div id="galleryGrid" class="masonry"></div></section><dialog id="lightbox" class="lightbox"><button id="closeLightbox" class="lightbox-close">✕</button><img id="lightboxImg" alt="Gallery preview"></dialog>`
  );
}
function reviews() {
  return (
    title(
      "LOVE NOTES",
      "Words from the heart",
      "Your kind words inspire every flower we arrange.",
    ) +
    `<section class="container section"><div class="cards-grid">${
      get("reviews")
        .filter((x) => x.status === "Approved")
        .map(
          (x) =>
            `<div class="quote-card"><span class="stars">${"★".repeat(x.rating)}</span><p>“${esc(x.text)}”</p><strong>${esc(x.name)}</strong></div>`,
        )
        .join("") || "<p>Be the first to share your story.</p>"
    }</div><form id="reviewForm" class="auth-box spaced"><h2>Share your experience</h2><label>Your name<input required name="name" value="${esc(user()?.name || "")}"></label><label>Rating<select name="rating">${[5, 4, 3, 2, 1].map((i) => `<option value="${i}">${"★".repeat(i)}</option>`).join("")}</select></label><label>Review<textarea name="text" minlength="10" required rows="4"></textarea></label><button class="btn btn-green">Submit for Review</button></form></section>`
  );
}
function contact() {
  return (
    title(
      "SAY HELLO",
      "Let’s make something beautiful",
      "For all things flowers, celebrations and unforgettable days.",
    ) +
    `<section class="container section split"><div><span class="eyebrow">GET IN TOUCH</span><h2>We would love to hear your story.</h2><p>Tell us about your dream celebration and let's make it happen.</p><div class="contact-detail"><strong>LOCATION</strong><p>${esc(S().address || "Sri Lanka")}</p><strong>EMAIL</strong><p>${esc(S().email || "Please contact via WhatsApp")}</p><strong>HOURS</strong><p>${esc(S().hours || "By appointment")}</p></div>${a("Design your event", "customize.html", "btn btn-green")}</div><form id="contactForm" class="form-card"><h3>Send an enquiry</h3><label>Name *<input required name="name"></label><label>Email *<input type="email" required name="email"></label><label>Phone<input name="phone" type="tel"></label><label>Message *<textarea required name="message" rows="5"></textarea></label><button class="btn btn-green full">Save Enquiry</button><button class="btn btn-outline full" id="sendEnquiry" type="button">Send via WhatsApp ↗</button></form></section>`
  );
}
function about() {
  return (
    title(
      "OUR STORY",
      "The beauty of being together",
      "Inspired by flowers, made for memories.",
    ) +
    `<section class="container section split about-split"><div>${img("https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1100&q=80", "Beautiful wedding flowers")}</div><div><span class="eyebrow">WITH HEART & ARTISTRY</span><h2>It begins with a little dream...</h2><p>At Stunning Floral Events, we believe flowers have a way of making every moment feel extraordinary. Our floral décor concepts are carefully designed to reflect each occasion, personality and tradition.</p><p>From weddings and birthdays to cultural ceremonies and business celebrations, we bring imagination and graceful detail to every design.</p>${a("Let’s create together", "customize.html", "btn btn-green")}</div></section>`
  );
}
function services() {
  return (
    title(
      "THE ART OF FLOWERS",
      "Our signature services",
      "Floral touches, thoughtfully designed for every occasion.",
    ) +
    `<section class="container section"><div class="cards-grid events-grid">${Object.entries(
      categoryNames,
    )
      .map(
        ([k, v]) =>
          `<article class="event-card"><div class="media">${img(photos[k], v)}</div><div class="event-info"><h3>${v}</h3><p>Artful styling with beautiful floral details, thoughtfully tailored to your celebration.</p>${a("Explore Occasions →", "events.html?category=" + k, "btn btn-outline")}</div></article>`,
      )
      .join("")}</div></section>`
  );
}
function faq() {
  return (
    title("GOOD TO KNOW", "Frequently asked questions") +
    `<section class="container section faq">${[
      [
        "How far in advance should I book?",
        "Early booking is recommended, especially for weekends and wedding dates.",
      ],
      [
        "Can I customise a package?",
        "Absolutely! Choose your flowers, colours, enhancements and venue requirements in our customisation form.",
      ],
      [
        "Are prices final?",
        "No. Online prices are estimates until your booking has been reviewed and a final quote is agreed.",
      ],
      [
        "How does WhatsApp booking work?",
        "Your booking is saved to this browser and WhatsApp opens a prefilled message. You must send the message yourself.",
      ],
      [
        "Is my account synchronised across devices?",
        "No. This demo uses browser LocalStorage and does not sync data across browsers or devices.",
      ],
      [
        "Can I request a specific design?",
        "Yes. Describe your inspiration in the event customisation form.",
      ],
    ]
      .map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`)
      .join("")}</section>`
  );
}
function privacy() {
  return (
    title("OUR PROMISE", "Privacy policy") +
    `<section class="container section prose"><h2>Local browser prototype</h2><p>This demonstration stores accounts, bookings, messages, reviews and settings in this browser's LocalStorage. Data is not sent to any server by this application and does not automatically synchronise between devices.</p><p>Credentials stored on the client are not secure. Please do not enter real customer information, payment credentials, or passwords used elsewhere. Anyone with access to this browser may inspect or change local records.</p><h2>WhatsApp</h2><p>When you choose to contact us by WhatsApp, a prefilled message opens on WhatsApp. You decide whether to send it. WhatsApp has its own privacy policy.</p><h2>Images and backups</h2><p>Reference images may be stored as small Data URLs in your local browser. Backups may contain personal information and should be kept private. Clear your browser storage to remove demonstration data.</p></section>`
  );
}
const renderMap = {
  index: home,
  services: services,
  events: eventsPage,
  packages: packagesPage,
  "package-details": details,
  customize: wizard,
  booking: wizard,
  confirmation: confirmation,
  gallery: gallery,
  about: about,
  contact: contact,
  login: () => auth("login"),
  register: () => auth("register"),
  profile: profile,
  "my-bookings": myBookings,
  reviews: reviews,
  faq: faq,
  privacy: privacy,
};
root.innerHTML =
  header() + `<main>${(renderMap[page] || home)()}</main>` + footer();
document
  .querySelector("#menu-toggle")
  ?.addEventListener("click", () =>
    document.querySelector("#menu").classList.toggle("open"),
  );
document
  .querySelector("#scrollTop")
  ?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
document.querySelector("#chat")?.addEventListener("click", (e) => {
  e.preventDefault();
  wa(
    S().whatsapp,
    "Hello Stunning Floral Events! I would like to enquire about floral decorations.",
  );
});
function eventFilter() {
  let s = (document.querySelector("#eventSearch")?.value || "").toLowerCase(),
    c =
      document.querySelector("#eventCategory")?.value ||
      query("category") ||
      "";
  document.querySelector("#eventGrid").innerHTML =
    events()
      .filter(
        (e) =>
          e.active &&
          (!c || e.category === c) &&
          e.name.toLowerCase().includes(s),
      )
      .map(eventCard)
      .join("") || '<div class="empty">No matching occasions.</div>';
  icons();
}
document.querySelector("#eventSearch")?.addEventListener("input", eventFilter);
document
  .querySelector("#eventCategory")
  ?.addEventListener("change", eventFilter);
if (page === "events") eventFilter();
document
  .querySelector("#pEvent")
  ?.addEventListener(
    "change",
    (e) =>
      (location.href =
        "packages.html" +
        (e.target.value ? "?event=" + encodeURIComponent(e.target.value) : "")),
  );
function galleryFilter() {
  let c = document.querySelector("#galleryFilter")?.value || "";
  document.querySelector("#galleryGrid").innerHTML =
    get("gallery")
      .filter((x) => x.active && (!c || x.category === c))
      .map(
        (x) =>
          `<button class="gallery-item" data-src="${esc(x.image)}">${img(x.image, x.name)}<span>${esc(x.name)}</span></button>`,
      )
      .join("") || "<p>No images in this collection.</p>";
}
document
  .querySelector("#galleryFilter")
  ?.addEventListener("change", galleryFilter);
if (page === "gallery") {
  galleryFilter();
  document.querySelector("#galleryGrid").onclick = (e) => {
    let x = e.target.closest("[data-src]");
    if (x) {
      document.querySelector("#lightboxImg").src = x.dataset.src;
      document.querySelector("#lightbox").showModal();
    }
  };
  document.querySelector("#closeLightbox").onclick = () =>
    document.querySelector("#lightbox").close();
}
function fields(form) {
  return Object.fromEntries(new FormData(form).entries());
}
document.querySelector("#authForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = fields(e.target);
  if (page === "register") {
    if (d.password !== d.confirm) return toast("Passwords do not match");
    if (
      get("users").some(
        (x) => x.email.toLowerCase() === d.email.trim().toLowerCase(),
      )
    )
      return toast("An account with this email already exists");
    let u = add("users", {
      name: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      phone: d.phone,
      whatsapp: d.whatsapp,
      address: d.address,
      password: d.password,
    });
    signIn({
      id: u.id,
      role: "customer",
      name: u.name,
      email: u.email,
      phone: u.phone,
      whatsapp: u.whatsapp,
      address: u.address,
    });
    location.href = "profile.html";
  } else {
    let u = get("users").find(
      (x) =>
        x.email === d.email.trim().toLowerCase() && x.password === d.password,
    );
    if (!u) return toast("Invalid email or password");
    signIn({
      id: u.id,
      role: "customer",
      name: u.name,
      email: u.email,
      phone: u.phone,
      whatsapp: u.whatsapp,
      address: u.address,
    });
    location.href = "my-bookings.html";
  }
});
document.querySelector("#logout")?.addEventListener("click", signOut);
document.querySelector("#profileForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = fields(e.target);
  const v = {
    name: d.name,
    phone: d.phone,
    whatsapp: d.whatsapp,
    address: d.address,
  };
  if (d.password) v.password = d.password;
  update("users", user().id, v);
  signIn({ ...user(), ...v });
  toast("Profile updated");
});
document.querySelector("#reviewForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = fields(e.target);
  add("reviews", {
    name: d.name,
    rating: Number(d.rating),
    text: d.text,
    status: "Pending",
    featured: false,
    date: new Date().toISOString().slice(0, 10),
  });
  toast("Review saved for approval");
  e.target.reset();
});
document.querySelector("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  add("messages", {
    ...fields(e.target),
    date: new Date().toISOString(),
    status: "New",
  });
  toast("Enquiry saved to this browser");
  e.target.reset();
});
document.querySelector("#sendEnquiry")?.addEventListener("click", () => {
  let d = fields(document.querySelector("#contactForm"));
  wa(
    S().whatsapp,
    `New enquiry from ${d.name || "Visitor"} (${d.email || ""})\n${d.message || "Hello!"}`,
  );
});
document.querySelector("#sendBookingWa")?.addEventListener("click", () => {
  let b = get("bookings").find((x) => x.id === query("id"));
  if (b) wa(S().whatsapp, bookingMessage(b));
});
if (page === "customize" || page === "booking") setupWizard();
function setupWizard() {
  const form = document.querySelector("#bookingWizard"),
    steps = [...form.querySelectorAll("[data-step]")],
    stepIndicator = document.querySelector("#stepIndicator");
  let step = 0,
    submitting = false;
  stepIndicator.innerHTML = steps
    .map(
      (_, i) =>
        `<span class="step-dot" data-no="${i}">${String(i + 1).padStart(2, "0")}</span>`,
    )
    .join("");
  let wdata = () => new FormData(form),
    selectedPack = () => packs().find((p) => p.id === wdata().get("packageId")),
    selectedAddons = () =>
      addons().filter((x) => wdata().getAll("addon").includes(x.id));
  function total() {
    return Math.max(
      0,
      (selectedPack()?.price || 0) +
        selectedAddons().reduce((a, x) => a + Number(x.price), 0) +
        Number(S().extraCharge || 0) -
        Number(S().discount || 0),
    );
  }
  function estimate() {
    let p = selectedPack(),
      addcost = selectedAddons().reduce((a, x) => a + Number(x.price), 0);
    document.querySelector("#estimateSide").innerHTML =
      `<div class="estimate-row"><span>Package</span><strong>${p ? esc(p.name) : "Not selected"}</strong></div><div class="estimate-row"><span>Base price</span><strong>${money(p?.price || 0)}</strong></div><div class="estimate-row"><span>Add-ons (${selectedAddons().length})</span><strong>${money(addcost)}</strong></div><div class="estimate-row"><span>Additional charges</span><strong>${money(S().extraCharge)}</strong></div><div class="estimate-row"><span>Discount</span><strong>−${money(S().discount)}</strong></div><div class="estimate-row total"><span>Estimated Total</span><strong>${money(total())}</strong></div>`;
  }
  function review() {
    let d = wdata(),
      p = selectedPack();
    document.querySelector("#wizardReview").innerHTML =
      `<div class="review-summary"><p><strong>Occasion:</strong> ${esc(d.get("event"))}</p><p><strong>Event:</strong> ${esc(d.get("title"))} · ${esc(d.get("date"))}</p><p><strong>Venue:</strong> ${esc(d.get("venue"))}, ${esc(d.get("district"))}</p><p><strong>Package:</strong> ${esc(p?.name || "")}</p><p><strong>Flowers:</strong> ${esc(d.getAll("flower").join(", ") || "Your choice")}</p><p><strong>Extras:</strong> ${esc(
        selectedAddons()
          .map((x) => x.name)
          .join(", ") || "None",
      )}</p><h3>Estimated Total: ${money(total())}</h3></div>`;
  }
  function show() {
    steps.forEach((x, i) => (x.hidden = i !== step));
    stepIndicator
      .querySelectorAll(".step-dot")
      .forEach((x, i) => x.classList.toggle("active", i <= step));
    document.querySelector("#prevStep").hidden = step === 0;
    document.querySelector("#nextStep").hidden = step === steps.length - 1;
    document.querySelector("#submitBooking").hidden = step !== steps.length - 1;
    if (step === 5) review();
    estimate();
    window.scrollTo({
      top: document.querySelector(".wizard-shell").offsetTop - 90,
      behavior: "smooth",
    });
  }
  form.addEventListener("change", estimate);
  form.addEventListener("input", estimate);
  document.querySelector("#prevStep").onclick = () => {
    step = Math.max(0, step - 1);
    show();
  };
  document.querySelector("#nextStep").onclick = () => {
    let invalid = [
      ...steps[step].querySelectorAll("input,select,textarea"),
    ].find((x) => !x.checkValidity() && !x.disabled);
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    if (step === 1 && !selectedPack()) return toast("Please select a package");
    step = Math.min(5, step + 1);
    show();
  };
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    let d = wdata(),
      p = selectedPack();
    if (!p) return toast("Please select a package");
    const refInput = form.querySelector("[name=reference]"),
      file = refInput?.files?.[0];
    if (file && file.size > 350000)
      return toast("Reference image must be smaller than 350KB");
    submitting = true;
    document.querySelector("#submitBooking").disabled = true;
    let reference = "";
    if (file) {
      reference = await new Promise((res) => {
        let r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => res("");
        r.readAsDataURL(file);
      });
    }
    const b = {
      reference:
        "SFE-" +
        new Date().getFullYear() +
        "-" +
        String(get("bookings").length + 1).padStart(4, "0") +
        "-" +
        Math.random().toString(36).slice(2, 5).toUpperCase(),
      userId: user()?.id || null,
      customerName: d.get("customerName").trim(),
      email: d.get("email").trim(),
      phone: d.get("phone").trim(),
      whatsapp: d.get("whatsapp").trim(),
      event: d.get("event"),
      title: d.get("title"),
      date: d.get("date"),
      startTime: d.get("startTime"),
      endTime: d.get("endTime"),
      venue: d.get("venue"),
      address: d.get("address"),
      district: d.get("district"),
      guests: Number(d.get("guests")),
      packageId: p.id,
      packageName: p.name,
      basePrice: p.price,
      flowers: d.getAll("flower"),
      color: d.get("customColor") || d.get("color"),
      addons: selectedAddons().map((x) => ({
        id: x.id,
        name: x.name,
        price: x.price,
      })),
      budget: d.get("budget"),
      style: d.get("style"),
      notes: d.get("notes"),
      reference,
      estimate: total(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      adminNotes: "",
    };
    const saved = add("bookings", b);
    add("notifications", {
      message: "New booking " + b.reference,
      createdAt: b.createdAt,
      read: false,
    });
    sessionStorage.setItem("sfe_lastBooking", b.id);
    location.href = "confirmation.html?id=" + encodeURIComponent(saved.id);
  };
  show();
}
function icons() {
  if (window.lucide) window.lucide.createIcons();
}
icons();
