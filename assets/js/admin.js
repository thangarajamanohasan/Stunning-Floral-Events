import {
  get,
  set,
  add,
  update,
  remove,
  esc,
  money,
  wa,
  session,
  signIn,
  init,
  toast,
  backup,
  restore,
  confirmationMessage,
  categoryNames,
  photos,
  uid,
} from "./storage.js";
init();
const page = document.body.dataset.page,
  root = document.querySelector("#app");
const auth = () => session()?.role === "admin";
const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");
const btn = (s, action, id = "", cls = "btn-mini") =>
  `<button class="${cls}" data-action="${action}" data-id="${esc(id)}">${s}</button>`;
const statusOptions = [
  "Pending",
  "Under Review",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];
const items = [
  ["dashboard", "layout-dashboard", "Overview"],
  ["bookings", "calendar-check", "Bookings"],
  ["customers", "users", "Customers"],
  ["events", "flower-2", "Events"],
  ["packages", "gift", "Packages"],
  ["addons", "sparkles", "Add-ons"],
  ["gallery", "images", "Gallery"],
  ["reviews", "star", "Reviews"],
  ["services", "layers", "Services"],
  ["reports", "chart-column", "Reports"],
  ["notifications", "bell", "Notifications"],
  ["settings", "settings", "Settings"],
];
function login() {
  root.innerHTML = `<main class="admin-login"><form id="adminLogin"><a href="../index.html" class="back-link">← Back to website</a><span class="admin-mark">✿</span><span class="eyebrow">STUNNING FLORAL EVENTS</span><h1>Welcome back</h1><p>Sign in to your floral studio dashboard</p><label>Username<input name="username" autocomplete="username" required></label><label>Password<div class="password-wrap"><input name="password" type="password" required id="adminPass"><button type="button" id="togglePass">Show</button></div></label><button class="btn btn-green full">Sign in to dashboard →</button><small>Local demonstration only. This login is not secure for production.</small></form></main>`;
  document.querySelector("#togglePass").onclick = () => {
    let p = document.querySelector("#adminPass");
    p.type = p.type === "password" ? "text" : "password";
  };
  document.querySelector("#adminLogin").onsubmit = (e) => {
    e.preventDefault();
    let d = new FormData(e.target),
      a = get("admin");
    if (d.get("username") !== a.username || d.get("password") !== a.password)
      return toast("Incorrect credentials");
    signIn({ role: "admin", username: a.username });
    location.href = "dashboard.html";
  };
}

function main() {
  root.innerHTML = `<div class="admin-app"><aside class="admin-sidebar" id="adminSidebar"><a href="../index.html" class="admin-brand"><span>✿</span><strong>STUNNING FLORAL<small>STUDIO MANAGEMENT</small></strong></a><div class="side-caption">WORKSPACE</div><nav>${items.map(([id, icon, name]) => `<a class="${id === page ? "selected" : ""}" href="${id}.html"><i data-lucide="${icon}"></i>${name}${id === "bookings" && get("bookings").filter((b) => b.status === "Pending").length ? `<small>${get("bookings").filter((b) => b.status === "Pending").length}</small>` : ""}</a>`).join("")}</nav><div class="sidebar-bottom"><a href="../index.html"><i data-lucide="external-link"></i> View website</a><button id="adminLogout"><i data-lucide="log-out"></i> Log out</button></div></aside><div class="admin-content"><header class="admin-top"><button class="icon-btn" id="adminMenu" aria-label="Toggle sidebar"><i data-lucide="menu"></i></button><div><span class="eyebrow">FLORAL STUDIO / ${esc(page.toUpperCase())}</span><h2>${page === "dashboard" ? "Good day, Admin" : page.charAt(0).toUpperCase() + page.slice(1)}</h2></div><div class="top-actions"><span>${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span><a class="icon-btn" href="notifications.html" aria-label="Notifications"><i data-lucide="bell"></i></a><button class="icon-btn" id="themeToggle" title="Theme"><i data-lucide="moon"></i></button><span class="admin-avatar">A</span></div></header><main id="adminBody"></main></div></div><dialog id="editModal" class="edit-modal"><form id="editForm"><button type="button" class="modal-close" id="modalClose">✕</button><h2 id="modalTitle">Edit</h2><div id="modalFields"></div><div class="modal-actions"><button type="button" class="btn btn-outline" id="cancelModal">Cancel</button><button class="btn btn-green">Save Changes</button></div></form></dialog>`;
  document.querySelector("#adminMenu").onclick = () =>
    document.querySelector("#adminSidebar").classList.toggle("open");
  document.querySelector("#adminLogout").onclick = () => {
    sessionStorage.removeItem("sfe_session");
    location.href = "login.html";
  };
  document.querySelector("#themeToggle").onclick = () => {
    document.body.classList.toggle("admin-dark");
    localStorage.setItem(
      "sfe_theme",
      document.body.classList.contains("admin-dark") ? "dark" : "light",
    );
  };
  if (localStorage.getItem("sfe_theme") === "dark")
    document.body.classList.add("admin-dark");
  document.querySelector("#modalClose").onclick = document.querySelector(
    "#cancelModal",
  ).onclick = () => document.querySelector("#editModal").close();
  render();
}
const inner = (html) => {
  document.querySelector("#adminBody").innerHTML = html;
  window.lucide?.createIcons();
};
const heading = (title, sub = "", actions = "") =>
  `<div class="admin-heading"><div><h1>${title}</h1><p>${sub}</p></div><div class="admin-heading-actions">${actions}</div></div>`;
const stat = (label, value, icon) =>
  `<article class="stat"><div class="stat-icon"><i data-lucide="${icon}"></i></div><small>${label}</small><strong>${value}</strong></article>`;
function dashboard() {
  let b = get("bookings"),
    u = get("users"),
    total = b
      .filter((x) => x.status === "Completed")
      .reduce((s, x) => s + Number(x.finalAmount ?? x.estimate), 0);
  let pending = b.filter((x) => x.status === "Pending").length;
  inner(
    heading(
      "Your floral studio",
      "An overview of your beautiful celebrations",
      `<a class="btn btn-green" href="bookings.html">Manage bookings ↗</a>`,
    ) +
      `<div class="stats-grid">${stat("Total Bookings", b.length, "calendar-check")}${stat("Pending Requests", pending, "clock-3")}${stat("Confirmed", b.filter((x) => x.status === "Confirmed").length, "check-circle")}${stat("Completed Events", b.filter((x) => x.status === "Completed").length, "flower-2")}${stat("Cancelled", b.filter((x) => x.status === "Cancelled").length, "x-circle")}${stat("Customers", u.length, "users")}${stat("Completed Revenue", money(total), "wallet")}${stat("Upcoming Events", b.filter((x) => x.date >= new Date().toISOString().slice(0, 10) && !["Cancelled", "Completed"].includes(x.status)).length, "calendar-days")}</div><div class="admin-panels"><section class="panel"><h3>Booking activity</h3><canvas id="bookingsChart"></canvas></section><section class="panel"><h3>Booking status</h3><canvas id="statusChart"></canvas></section></div><section class="panel"><div class="panel-head"><h3>Recent bookings</h3><a href="bookings.html">View all →</a></div>${bookingTable(b.slice(-6).reverse())}</section>`,
  );
  chart(
    "bookingsChart",
    "bar",
    Array.from({ length: 6 }, (_, i) => {
      let d = new Date();
      d.setMonth(d.getMonth() - 5 + i);
      return d.toLocaleString("en-US", { month: "short" });
    }),
    Array.from({ length: 6 }, (_, i) => {
      let d = new Date();
      d.setMonth(d.getMonth() - 5 + i);
      return b.filter((x) => {
        let z = new Date(x.createdAt);
        return (
          z.getMonth() === d.getMonth() && z.getFullYear() === d.getFullYear()
        );
      }).length;
    }),
  );
  chart(
    "statusChart",
    "doughnut",
    statusOptions,
    statusOptions.map((s) => b.filter((x) => x.status === s).length),
  );
}
function chart(id, type, labels, values) {
  if (!window.Chart) return;
  new Chart(document.getElementById(id), {
    type,
    data: {
      labels,
      datasets: [
        {
          label: "Bookings",
          data: values,
          backgroundColor: [
            "#335941",
            "#d5a95c",
            "#e5b5b3",
            "#9fbb92",
            "#c5d6be",
            "#dedad2",
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type === "doughnut" } },
    },
  });
}
const pill = (v) =>
  `<span class="status status-${String(v).toLowerCase().replace(/\s/g, "-")}">${esc(v)}</span>`;
function bookingTable(rows) {
  return `<div class="table-scroll"><table><thead><tr><th>Reference / Customer</th><th>Event</th><th>Date</th><th>Estimated</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows.map((b) => `<tr><td><strong>${esc(b.reference)}</strong><small>${esc(b.customerName)}</small></td><td>${esc(b.event)}<small>${esc(b.packageName)}</small></td><td>${esc(b.date)}</td><td>${money(b.estimate)}</td><td>${pill(b.status)}</td><td>${btn("View", "viewBooking", b.id)}${btn("Edit", "editBooking", b.id)}${btn("Delete", "deleteBooking", b.id, "btn-mini delete-booking")}</td></tr>`).join("") || '<tr><td colspan="6">No bookings yet.</td></tr>'}</tbody></table></div>`;
}
function bookings() {
  let b = get("bookings");
  inner(
    heading(
      "Booking management",
      "Manage enquiries, quotes, event schedules and confirmations",
      `<button class="btn btn-outline" data-action="exportBookings">Export CSV</button>`,
    ) +
      `<div class="panel"><div class="table-filters"><input id="searchRows" placeholder="Search reference, customer or event"><select id="statusFilter"><option value="">All statuses</option>${statusOptions.map((x) => `<option>${x}</option>`).join("")}</select><input id="dateFilter" type="date" title="Filter event date"></div><div id="bookingTable">${bookingTable(b.slice().reverse())}</div></div>`,
  );
  const filter = () => {
    let q = document.querySelector("#searchRows").value.toLowerCase(),
      s = document.querySelector("#statusFilter").value,
      d = document.querySelector("#dateFilter").value;
    document.querySelector("#bookingTable").innerHTML = bookingTable(
      get("bookings")
        .filter(
          (x) =>
            (x.reference + x.customerName + x.event)
              .toLowerCase()
              .includes(q) &&
            (!s || x.status === s) &&
            (!d || x.date === d),
        )
        .reverse(),
    );
  };
  ["searchRows", "statusFilter", "dateFilter"].forEach((id) =>
    document.getElementById(id).addEventListener("input", filter),
  );
}
function customers() {
  let b = get("bookings");
  inner(
    heading("Customers", "Customer accounts registered in this browser") +
      `<section class="panel">${table(
        ["Name", "Email", "Phone", "Bookings", "Action"],
        get("users").map((u) => [
          esc(u.name),
          esc(u.email),
          esc(u.phone),
          b.filter((x) => x.email === u.email).length,
          btn("Delete", "deleteUser", u.id),
        ]),
      )}</section>`,
  );
}
const specs = {
  events: [
    ["name", "Event name", "text"],
    [
      "category",
      "Category",
      "select",
      "romance|family|culture|corporate|special",
    ],
    ["description", "Description", "textarea"],
    ["image", "Image URL", "text"],
    ["active", "Active", "check"],
  ],
  packages: [
    ["name", "Package name", "text"],
    ["description", "Description", "textarea"],
    ["price", "Price (LKR)", "number"],
    ["image", "Image URL", "text"],
    ["features", "Features (one per line)", "textarea"],
    ["featured", "Featured", "check"],
    ["active", "Active", "check"],
  ],
  addons: [
    ["name", "Add-on name", "text"],
    ["price", "Price (LKR)", "number"],
    ["active", "Active", "check"],
  ],
  gallery: [
    ["name", "Image caption", "text"],
    [
      "category",
      "Category",
      "select",
      "romance|family|culture|corporate|special",
    ],
    ["image", "Image URL", "text"],
    ["active", "Active", "check"],
  ],
  services: [
    ["name", "Service name", "text"],
    ["description", "Description", "textarea"],
    ["image", "Image URL", "text"],
    ["active", "Active", "check"],
  ],
};
function crud(k) {
  let x = get(k);
  inner(
    heading(
      k.charAt(0).toUpperCase() + k.slice(1),
      `Create, edit and manage your ${k} locally`,
      btn("+ Add " + k.slice(0, -1), "newItem", k, "btn btn-green"),
    ) +
      `<section class="panel"><div class="table-scroll"><table><thead><tr><th>Name</th><th>${k === "events" ? "Category" : k === "gallery" ? "Category" : "Price / Details"}</th><th>Visible</th><th>Actions</th></tr></thead><tbody>${x.map((v) => `<tr><td><div class="table-item">${v.image ? `<img src="${esc(v.image)}" alt="">` : '<span class="mini-flower">✿</span>'}<strong>${esc(v.name)}</strong></div></td><td>${k === "events" || k === "gallery" ? esc(categoryNames[v.category] || v.category) : v.price !== undefined ? money(v.price) : esc(v.description || "")}</td><td>${v.active === false ? pill("Inactive") : pill("Active")}</td><td>${btn("Edit", "editItem", k + "|" + v.id)}${btn("Delete", "deleteItem", k + "|" + v.id)}</td></tr>`).join("") || '<tr><td colspan="4">No records yet.</td></tr>'}</tbody></table></div></section>`,
  );
}
const table = (heads, rows) =>
  `<div class="table-scroll"><table><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${heads.length}">No records found</td></tr>`}</tbody></table></div>`;
function reviewPage() {
  inner(
    heading(
      "Customer reviews",
      "Moderate testimonials before they appear on your website",
    ) +
      `<section class="panel">${table(
        ["Customer", "Rating", "Review", "Status", "Actions"],
        get("reviews")
          .slice()
          .reverse()
          .map((r) => [
            esc(r.name),
            "★".repeat(r.rating),
            esc(r.text),
            pill(r.status),
            btn("Approve", "approveReview", r.id) +
              btn("Reject", "rejectReview", r.id) +
              btn("Delete", "deleteReview", r.id),
          ]),
      )}</section>`,
  );
}
function reports() {
  let b = get("bookings");
  let p = get("packages");
  inner(
    heading(
      "Reports & analytics",
      "Calculated from your browser’s live local records",
      btn("Export bookings CSV", "exportBookings", "", "btn btn-green"),
    ) +
      `<div class="stats-grid">${stat("Booking requests", b.length, "calendar-days")}${stat("Estimated value", money(b.reduce((s, x) => s + Number(x.estimate), 0)), "wallet")}${stat("Completed revenue", money(b.filter((x) => x.status === "Completed").reduce((s, x) => s + Number(x.finalAmount ?? x.estimate), 0)), "chart-no-axes-combined")}${stat("Cancelled", b.filter((x) => x.status === "Cancelled").length, "x-circle")}</div><div class="admin-panels"><section class="panel"><h3>Package popularity</h3><canvas id="packageChart"></canvas></section><section class="panel"><h3>Event category distribution</h3><canvas id="eventChart"></canvas></section></div>`,
  );
  chart(
    "packageChart",
    "bar",
    p.map((x) => x.name),
    p.map((x) => b.filter((z) => z.packageId === x.id).length),
  );
  let names = [...new Set(b.map((x) => x.event))];
  chart(
    "eventChart",
    "doughnut",
    names.length ? names : ["No events"],
    names.length
      ? names.map((n) => b.filter((z) => z.event === n).length)
      : [0],
  );
}
function notifications() {
  inner(
    heading(
      "Notifications",
      "Local booking requests and messages",
      btn("Mark all read", "readAll", "", "btn btn-outline"),
    ) +
      `<section class="panel">${
        get("notifications")
          .slice()
          .reverse()
          .map(
            (n) =>
              `<div class="notice"><span>✿</span><div><strong>${esc(n.message)}</strong><small>${fmt(n.createdAt)} ${n.read ? "· Read" : "· Unread"}</small></div></div>`,
          )
          .join("") || "<p>No notifications yet.</p>"
      }</section><section class="panel"><h3>Contact enquiries</h3>${table(
        ["From", "Email", "Message", "Date"],
        get("messages").map((x) => [
          esc(x.name),
          esc(x.email),
          esc(x.message),
          fmt(x.date),
        ]),
      )}</section>`,
  );
}
function settings() {
  let s = get("settings");
  const fields = [
    ["name", "Business name"],
    ["phone", "Business phone"],
    ["whatsapp", "WhatsApp number"],
    ["email", "Email"],
    ["address", "Business address"],
    ["hours", "Business hours"],
    ["instagram", "Instagram URL"],
    ["facebook", "Facebook URL"],
    ["description", "Website description"],
    ["extraCharge", "Default additional charges (LKR)"],
    ["discount", "Default discount (LKR)"],
  ];
  inner(
    heading(
      "Business settings",
      "Manage your details, quotations and local browser data",
    ) +
      `<div class="settings-grid"><section class="panel"><h3>Business information</h3><form id="settingsForm" class="settings-form">${fields.map(([k, label]) => `<label>${label}<input name="${k}" ${k === "extraCharge" || k === "discount" ? 'type="number" min="0"' : 'type="text"'} value="${esc(s[k] ?? "")}"></label>`).join("")}<button class="btn btn-green">Save settings</button></form></section><section class="panel"><h3>Data & backup</h3><p>Your data is held on this browser only. Use export/import to transfer your local demonstration records manually.</p><button class="btn btn-outline full" data-action="backup">Download JSON backup</button><label class="file-import">Restore JSON backup<input id="restoreFile" type="file" accept="application/json"></label><hr><button class="btn btn-outline full" data-action="reset">Reset demo data</button><button class="btn btn-danger full" data-action="clear">Clear all application data</button><p class="warning">Do not store real customer or financial information in this demo. Anyone using this browser can inspect the stored data.</p></section></div>`,
  );
  document.querySelector("#settingsForm").onsubmit = (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.target));
    v.extraCharge = Number(v.extraCharge) || 0;
    v.discount = Number(v.discount) || 0;
    set("settings", { ...s, ...v });
    toast("Settings saved");
  };
  document.querySelector("#restoreFile").onchange = async (e) => {
    try {
      await restore(e.target.files[0]);
    } catch (e) {
      toast(e.message);
    }
  };
}
function render() {
  switch (page) {
    case "dashboard":
      dashboard();
      break;
    case "bookings":
      bookings();
      break;
    case "customers":
      customers();
      break;
    case "events":
    case "packages":
    case "addons":
    case "gallery":
    case "services":
      crud(page);
      break;
    case "reviews":
      reviewPage();
      break;
    case "reports":
      reports();
      break;
    case "notifications":
      notifications();
      break;
    case "settings":
      settings();
      break;
  }
  window.lucide?.createIcons();
}
function modal(title, fields, onSave) {
  document.querySelector("#modalTitle").textContent = title;
  document.querySelector("#modalFields").innerHTML = fields;
  document.querySelector("#editModal").showModal();
  document.querySelector("#editForm").onsubmit = (e) => {
    e.preventDefault();
    onSave(e.target);
  };
}
function formField(k, label, type, options, v) {
  let value = v?.[k] ?? "";
  if (k === "features") value = Array.isArray(value) ? value.join("\n") : value;
  if (type === "check")
    return `<label class="check-field"><input type="checkbox" name="${k}" ${value ? "checked" : ""}> ${label}</label>`;
  if (type === "textarea")
    return `<label>${label}<textarea name="${k}" rows="4">${esc(value)}</textarea></label>`;
  if (type === "select")
    return `<label>${label}<select name="${k}">${options
      .split("|")
      .map(
        (o) =>
          `<option value="${o}" ${value === o ? "selected" : ""}>${esc(categoryNames[o] || o)}</option>`,
      )
      .join("")}</select></label>`;
  return `<label>${label}<input name="${k}" type="${type}" ${type === "number" ? 'min="0" step="1"' : ""} value="${esc(value)}" ${["name"].includes(k) ? "required" : ""}></label>`;
}
function editItem(k, id) {
  let v = get(k).find((x) => x.id === id) || {},
    fields = specs[k];
  modal(
    (id ? "Edit " : "Add ") + k.slice(0, -1),
    fields
      .map(([key, label, type, opt]) => formField(key, label, type, opt, v))
      .join(""),
    (f) => {
      let d = new FormData(f),
        obj = { ...v };
      for (let [key, , type] of fields)
        obj[key] =
          type === "check"
            ? d.has(key)
            : type === "number"
              ? Number(d.get(key))
              : key === "features"
                ? String(d.get(key))
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean)
                : d.get(key);
      if (id) update(k, id, obj);
      else add(k, obj);
      document.querySelector("#editModal").close();
      render();
      toast("Saved successfully");
    },
  );
}
function showBooking(id, editable) {
  let b = get("bookings").find((x) => x.id === id);
  if (!b) return;
  let details = `<div class="booking-detail"><p><strong>Reference:</strong> ${esc(b.reference)}</p><p><strong>Customer:</strong> ${esc(b.customerName)} · ${esc(b.email)} · ${esc(b.phone)}</p><p><strong>WhatsApp:</strong> ${esc(b.whatsapp)}</p><p><strong>Event:</strong> ${esc(b.event)} · ${esc(b.title)}</p><p><strong>Date / Time:</strong> ${esc(b.date)} · ${esc(b.startTime)}–${esc(b.endTime)}</p><p><strong>Venue:</strong> ${esc(b.venue)}, ${esc(b.address)}, ${esc(b.district)}</p><p><strong>Guests:</strong> ${b.guests}</p><p><strong>Package:</strong> ${esc(b.packageName)}</p><p><strong>Flowers:</strong> ${esc((b.flowers || []).join(", "))}</p><p><strong>Colour:</strong> ${esc(b.color)}</p><p><strong>Add-ons:</strong> ${esc((b.addons || []).map((x) => x.name).join(", ") || "None")}</p><p><strong>Requests:</strong> ${esc(b.notes)}</p><p><strong>Estimated total:</strong> ${money(b.estimate)}</p>${b.reference ? `<p>${btn("WhatsApp customer", "whatsapp", id)} ${btn("Print record", "printBooking", id)}</p>` : ""}</div>`;
  modal(
    "Booking " + b.reference,
    details +
      (editable
        ? `<label>Status<select name="status">${statusOptions.map((s) => `<option ${b.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Final quotation (LKR)<input type="number" min="0" name="finalAmount" value="${esc(b.finalAmount ?? b.estimate)}"></label><label>Private notes<textarea name="adminNotes">${esc(b.adminNotes || "")}</textarea></label>`
        : ""),
    (f) => {
      if (editable) {
        let d = new FormData(f);
        update("bookings", id, {
          status: d.get("status"),
          finalAmount: Number(d.get("finalAmount")),
          adminNotes: d.get("adminNotes"),
        });
      }
      document.querySelector("#editModal").close();
      render();
      toast("Booking updated");
    },
  );
}
function csv() {
  const fields = [
    "reference",
    "customerName",
    "email",
    "phone",
    "whatsapp",
    "event",
    "date",
    "venue",
    "packageName",
    "estimate",
    "finalAmount",
    "status",
    "createdAt",
  ];
  let lines = [
    fields.join(","),
    ...get("bookings").map((b) =>
      fields
        .map((k) => '"' + String(b[k] ?? "").replace(/"/g, '""') + '"')
        .join(","),
    ),
  ];
  let url = URL.createObjectURL(
      new Blob([lines.join("\r\n")], { type: "text/csv" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = "floral-bookings.csv";
  a.click();
  URL.revokeObjectURL(url);
}
document.addEventListener("click", (e) => {
  let target = e.target.closest("[data-action]");
  if (!target) return;
  let { action, id } = target.dataset;
  switch (action) {
    case "newItem":
      editItem(id);
      break;
    case "editItem": {
      let [k, v] = id.split("|");
      editItem(k, v);
      break;
    }
    case "deleteItem": {
      let [k, v] = id.split("|");
      if (confirm("Permanently delete this local record?")) {
        remove(k, v);
        render();
      }
      break;
    }
    case "deleteBooking": {
      const booking = get("bookings").find((b) => b.id === id);
      if (!booking) {
        toast("Booking not found");
        break;
      }
      if (
        !confirm(
          `Delete booking ${booking.reference || booking.id} for ${booking.customerName || "this customer"}? This cannot be undone.`,
        )
      )
        break;
      const saved = remove("bookings", id);
      if (saved) {
        toast("Booking deleted successfully");
        render();
      } else {
        toast("Unable to delete booking");
      }
      break;
    }
    case "deleteUser":
      if (confirm("Delete this local customer account?")) {
        remove("users", id);
        render();
      }
      break;
    case "viewBooking":
      showBooking(id, false);
      break;
    case "editBooking":
      showBooking(id, true);
      break;
    case "approveReview":
      update("reviews", id, { status: "Approved" });
      render();
      break;
    case "rejectReview":
      update("reviews", id, { status: "Rejected" });
      render();
      break;
    case "deleteReview":
      if (confirm("Delete review?")) {
        remove("reviews", id);
        render();
      }
      break;
    case "whatsapp": {
      let b = get("bookings").find((x) => x.id === id);
      if (b) wa(b.whatsapp, confirmationMessage(b));
      break;
    }
    case "printBooking":
      window.print();
      break;
    case "exportBookings":
      csv();
      break;
    case "readAll":
      set(
        "notifications",
        get("notifications").map((x) => ({ ...x, read: true })),
      );
      render();
      break;
    case "backup":
      backup();
      break;
    case "reset":
      if (confirm("Reset all local demo data? This erases existing records.")) {
        for (let k of Object.keys(localStorage).filter((k) =>
          k.startsWith("sfe_"),
        ))
          localStorage.removeItem(k);
        init();
        location.reload();
      }
      break;
    case "clear":
      if (confirm("Delete ALL locally stored Stunning Floral Events data?")) {
        for (let k of Object.keys(localStorage).filter((k) =>
          k.startsWith("sfe_"),
        ))
          localStorage.removeItem(k);
        sessionStorage.removeItem("sfe_session");
        location.href = "../index.html";
      }
      break;
  }
});

// Initialize only after all const helpers and handlers have been defined.
if (page === "login" || !auth()) {
  if (page !== "login") location.replace("login.html");
  else login();
} else main();
