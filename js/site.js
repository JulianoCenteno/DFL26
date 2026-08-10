/* DFL 26 - static site behaviours (no framework) */
(function () {
  "use strict";

  /* ---------- Smooth scroll anchors ---------- */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-scroll-to]");
    if (!el) return;
    var target = document.getElementById(el.getAttribute("data-scroll-to"));
    if (target) {
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ---------- Checkout buttons ---------- */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-checkout]");
    if (!el) return;
    var url = el.getAttribute("data-checkout");
    if (url) { ev.preventDefault(); window.location.href = url; }
  });

  /* ---------- Carousels ---------- */
  var CAROUSEL_DELAY = 3500;
  function setupCarousel(root) {
    var viewport = root.querySelector(".overflow-hidden");
    if (!viewport) return;
    var track = viewport.querySelector(":scope > div");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;

    track.style.transition = "transform 500ms ease";
    track.style.willChange = "transform";
    slides.forEach(function (s) { s.style.transform = "none"; });

    var index = 0;
    function perView() {
      var w = slides[0].getBoundingClientRect().width;
      if (!w) return 1;
      return Math.max(1, Math.round(viewport.getBoundingClientRect().width / w));
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }
    function apply() {
      var w = slides[0].getBoundingClientRect().width;
      track.style.transform = "translate3d(" + (-index * w) + "px, 0px, 0px)";
    }
    function go(step) {
      var m = maxIndex();
      index += step;
      if (index > m) index = 0;
      if (index < 0) index = m;
      apply();
    }

    // Arrow buttons rendered by the original UI (previous / next)
    var buttons = Array.prototype.slice.call(root.querySelectorAll("button"));
    buttons.forEach(function (btn) {
      var label = (btn.getAttribute("aria-label") || btn.textContent || "").toLowerCase();
      var isPrev = label.indexOf("previous") > -1 || label.indexOf("anterior") > -1;
      var isNext = label.indexOf("next") > -1 || label.indexOf("próx") > -1 || label.indexOf("prox") > -1;
      if (!isPrev && !isNext) return;
      btn.disabled = false;
      btn.removeAttribute("disabled");
      btn.style.pointerEvents = "auto";
      btn.style.opacity = "1";
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        stop();
        go(isPrev ? -1 : 1);
        start();
      });
    });

    var timer = null;
    function start() { stop(); timer = setInterval(function () { go(1); }, CAROUSEL_DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    window.addEventListener("resize", function () { if (index > maxIndex()) index = 0; apply(); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    apply();
    start();
  }
  document.querySelectorAll('[aria-roledescription="carousel"]').forEach(setupCarousel);

  /* ---------- Discount modal (basic plan) ---------- */
  var GREEN_URL = "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=1T4XSDW";
  var RED_URL = "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=YKXQW3Z";

  var overlay = document.createElement("div");
  overlay.id = "dfl-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;" +
    "background:rgba(0,0,0,.8);padding:16px;backdrop-filter:blur(4px)";
  overlay.innerHTML =
    '<div style="position:relative;width:100%;max-width:420px;background:#0a0a0a;border:1px solid #262626;' +
    'border-radius:16px;padding:28px 24px;color:#fff;text-align:center;font-family:Inter,sans-serif;box-shadow:0 25px 50px rgba(0,0,0,.6)">' +
    '<button type="button" data-close aria-label="Fechar" style="position:absolute;top:10px;right:14px;background:none;border:0;' +
    'color:#a3a3a3;font-size:24px;line-height:1;cursor:pointer">&times;</button>' +
    '<h3 style="font-size:24px;font-weight:900;font-style:italic;text-transform:uppercase;color:#22c55e;margin:0 0 18px">Oferta exclusiva!</h3>' +
    '<p style="font-size:19px;font-weight:700;font-style:italic;text-transform:uppercase;margin:0 0 8px">Você ganhou um desconto!</p>' +
    '<p style="color:#a3a3a3;font-style:italic;margin:0 0 22px">Leve o <strong style="color:#fff">PLANO COMPLETO</strong> agora pelo preço especial de:</p>' +
    '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:20px;margin-bottom:22px">' +
    '<div style="font-size:44px;font-weight:900;font-style:italic;letter-spacing:-1px">R$ 16,90</div>' +
    '<div style="font-size:12px;color:#22c55e;font-weight:700;text-transform:uppercase;font-style:italic;margin-top:4px">Ou 2x de R$ 8,45</div>' +
    '<div style="font-size:10px;color:#737373;text-transform:uppercase;font-weight:700;margin-top:6px">Pagamento único</div></div>' +
    '<a href="' + GREEN_URL + '" style="display:flex;align-items:center;justify-content:center;height:56px;border-radius:10px;' +
    'background:#22c55e;color:#fff;font-weight:900;font-style:italic;text-transform:uppercase;text-decoration:none;font-size:16px">Aceitar desconto (R$ 16,90)</a>' +
    '<a href="' + RED_URL + '" style="display:flex;align-items:center;justify-content:center;height:48px;margin-top:12px;border-radius:10px;' +
    'color:#ef4444;font-weight:700;font-style:italic;text-transform:uppercase;text-decoration:none;font-size:13px">Não, quero pagar o valor normal</a>' +
    "</div>";
  document.body.appendChild(overlay);

  function openModal() { overlay.style.display = "flex"; document.body.style.overflow = "hidden"; }
  function closeModal() { overlay.style.display = "none"; document.body.style.overflow = ""; }
  overlay.addEventListener("click", function (ev) {
    if (ev.target === overlay || ev.target.hasAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeModal(); });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest('[data-offer="basic"]');
    if (!el) return;
    ev.preventDefault();
    openModal();
  });
})();
