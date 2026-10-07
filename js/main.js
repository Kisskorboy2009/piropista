(function () {
  "use strict";

  /* Fejléc: vonal görgetéskor, mobilmenü */
  var header = document.getElementById("fejlec");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  /* Világos / sötét mód */
  var root = document.documentElement;
  var themeBtn = document.querySelector(".theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function isDark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : darkQuery.matches;
  }
  function syncTheme() {
    var dark = isDark();
    themeBtn.setAttribute("aria-label", dark ? "Világos mód bekapcsolása" : "Sötét mód bekapcsolása");
    themeMeta.setAttribute("content", dark ? "#16110d" : "#f4eee4");
  }
  themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("tema", next); } catch (e) {}
    syncTheme();
  });
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncTheme);
  syncTheme();

  /* Galéria szűrő */
  var items = Array.prototype.slice.call(document.querySelectorAll("#galeria .item"));
  var filters = document.querySelectorAll(".filter");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      items.forEach(function (it) {
        it.hidden = !(f === "*" || it.getAttribute("data-cat") === f);
      });
    });
  });

  /* Nagyító */
  var dlg = document.getElementById("nagyito");
  var lbImg = dlg.querySelector("img");
  var lbCap = dlg.querySelector("figcaption");
  var current = 0;

  function visibleItems() {
    return items.filter(function (it) { return !it.hidden; });
  }

  function show(index) {
    var list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var it = list[current];
    var link = it.querySelector("a");
    var thumb = it.querySelector("img");
    lbImg.src = link.getAttribute("href");
    lbImg.alt = thumb.alt;
    lbImg.width = link.getAttribute("data-w");
    lbImg.height = link.getAttribute("data-h");
    lbCap.innerHTML = it.querySelector("figcaption").innerHTML;
  }

  var canDialog = typeof dlg.showModal === "function";

  items.forEach(function (it) {
    it.querySelector("a").addEventListener("click", function (e) {
      if (!canDialog) return; // régi böngészőben sima linkként nyílik meg a kép
      e.preventDefault();
      show(visibleItems().indexOf(it));
      dlg.showModal();
      document.body.style.overflow = "hidden";
    });
  });

  dlg.addEventListener("close", function () {
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  });
  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  dlg.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target.classList.contains("lb-figure")) dlg.close();
  });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // húzás mobilon
  var startX = null;
  dlg.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  /* Üzenet összeállítása Messengerhez */
  var form = document.getElementById("urlap");
  var status = form.querySelector(".form-status");
  var ready = document.getElementById("kesz-uzenet");
  var MESSENGER = "https://m.me/ecko6";

  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  function buildMessage() {
    var lines = ["Szia Pista!", ""];
    lines.push("A piropista.hu oldalról írok.");
    lines.push("Név: " + val("nev"));
    lines.push("Mire gondoltam: " + val("tipus"));
    if (val("meret")) lines.push("Méret: " + val("meret"));
    if (val("hatarido")) lines.push("Mikorra kellene: " + val("hatarido"));
    lines.push("");
    lines.push(val("leiras"));
    return lines.join("\n");
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var tmp = document.createElement("textarea");
      tmp.value = text;
      tmp.setAttribute("readonly", "");
      tmp.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
      document.body.appendChild(tmp);
      tmp.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(tmp);
      ok ? resolve() : reject();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";

    var missing = ["nev", "leiras"].filter(function (n) {
      var el = form.elements[n];
      var empty = !val(n);
      el.classList.toggle("is-invalid", empty);
      return empty;
    });
    if (missing.length) {
      status.textContent = "Kérlek, add meg a neved, és írd le pár szóban, mit szeretnél.";
      status.classList.add("err");
      form.elements[missing[0]].focus();
      return;
    }

    var text = buildMessage();
    ready.value = text;

    // Előbb másolunk (amíg az oldalon van a fókusz), utána nyitjuk a Messengert,
    // még a kattintáson belül, különben a böngésző letilthatja az új lapot.
    var copying = copyText(text);
    var win = window.open(MESSENGER, "_blank");
    if (win) win.opener = null;

    var linkHtml = ' Ha nem nyílt meg a Messenger, <a href="' + MESSENGER + '" target="_blank" rel="noopener">kattints ide</a>.';

    copying.then(function () {
      status.innerHTML = "Kimásoltam az üzenetet. A Messengerben illeszd be (Ctrl+V, telefonon hosszan nyomva: Beillesztés), és küldd el. Ha van fotód vagy mintád, csatold hozzá." + (win ? "" : linkHtml);
      status.classList.add("ok");
    }, function () {
      status.innerHTML = "A másolás nem sikerült. Lent, a „Nem működik a másolás?” résznél megtalálod a kész szöveget." + (win ? "" : linkHtml);
      status.classList.add("err");
      form.querySelector(".form-fallback").open = true;
    });
  });

  ["nev", "leiras"].forEach(function (n) {
    form.elements[n].addEventListener("input", function () {
      this.classList.remove("is-invalid");
    });
  });

  /* Finom beúszás görgetéskor */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".service, .section-head, .steps li, .about-text, .about-media, .contact-text, .order-form");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) {
      t.classList.add("reveal");
      io.observe(t);
    });
  }

  var ev = document.getElementById("ev");
  if (ev) ev.textContent = new Date().getFullYear();
})();
