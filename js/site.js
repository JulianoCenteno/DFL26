(function () {
  "use strict";
  var CHECKOUT = {
    completo: "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=QPEETQ5",
    upsellGreen: "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=1T4XSDW",
    upsellRed: "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=YKXQW3Z",
    exit: "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=E5TGV4A",
    exitRed: "https://checkout.wiven.com.br/checkout/cmsnet06103qk01ol87o0hvkn?offer=GAI0CU2"
  };
  function go(url) { window.location.href = url; }

  /* ---------- Carrosséis ---------- */
  function initCarousels() {
    var nodes = document.querySelectorAll('[aria-roledescription="carousel"]');
    Array.prototype.forEach.call(nodes, function (root) {
      var viewport = root.querySelector(".overflow-hidden");
      if (!viewport) return;
      var track = viewport.firstElementChild;
      if (!track) return;
      var slides = Array.prototype.filter.call(track.children, function (c) { return c.nodeType === 1; });
      if (slides.length < 2) return;
      var index = 0;
      track.style.transition = "transform .5s ease";
      track.style.willChange = "transform";

      function apply() {
        if (index < 0) index = slides.length - 1;
        if (index > slides.length - 1) index = 0;
        var base = slides[0].offsetLeft;
        var x = slides[index].offsetLeft - base;
        var max = track.scrollWidth - viewport.clientWidth;
        if (max > 0 && x > max) x = max;
        track.style.transform = "translate3d(" + -x + "px,0,0)";
      }
      var buttons = root.querySelectorAll("button");
      Array.prototype.forEach.call(buttons, function (b) {
        var label = (b.textContent || "").trim().toLowerCase();
        if (label.indexOf("previous") === 0) b.addEventListener("click", function () { index--; apply(); reset(); });
        if (label.indexOf("next") === 0) b.addEventListener("click", function () { index++; apply(); reset(); });
        b.disabled = false;
        b.classList.remove("disabled:opacity-50");
        b.style.opacity = "1";
        b.style.pointerEvents = "auto";
      });
      var timer = null;
      function start() { timer = setInterval(function () { index++; apply(); }, 4000); }
      function reset() { if (timer) clearInterval(timer); start(); }
      window.addEventListener("resize", apply);
      apply();
      start();
    });
  }

  /* ---------- Âncoras ---------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-scroll]") : null;
      if (!btn) return;
      var el = document.getElementById(btn.getAttribute("data-scroll"));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
    });
  }

  /* ---------- Modais ---------- */
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    m.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function bindModalButtons() {
    var up = document.getElementById("modal-upsell");
    var ex = document.getElementById("modal-exit");
    function bind(root, rules) {
      if (!root) return;
      Array.prototype.forEach.call(root.querySelectorAll("button"), function (b) {
        var t = (b.textContent || "").trim().toUpperCase();
        if (b.hasAttribute("data-close") || t === "✕" || t === "CLOSE") {
          b.addEventListener("click", function () { closeModal(root); });
          return;
        }
        for (var i = 0; i < rules.length; i++) {
          if (t.indexOf(rules[i][0]) !== -1) {
            var url = rules[i][1];
            b.addEventListener("click", function () { url ? go(url) : closeModal(root); });
            return;
          }
        }
        b.addEventListener("click", function () { closeModal(root); });
      });
      root.addEventListener("click", function (e) { if (e.target === root) closeModal(root); });
    }
    bind(up, [["ACEITAR DESCONTO", CHECKOUT.upsellGreen], ["VALOR NORMAL", CHECKOUT.upsellRed]]);
    bind(ex, [["QUERO POR", CHECKOUT.exit], ["PERDER", CHECKOUT.exitRed]]);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        Array.prototype.forEach.call(document.querySelectorAll(".site-modal.is-open"), closeModal);
      }
    });
  }

  /* ---------- Checkout / plano básico ---------- */
  function initOffers() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-checkout]"), function (b) {
      var url = b.getAttribute("data-checkout") || CHECKOUT.completo;
      b.addEventListener("click", function () { go(url); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-offer="basic"]'), function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openModal("modal-upsell"); });
    });
  }

  /* ---------- Exit intent ---------- */
  function initExitIntent() {
    var fired = false;
    try { if (sessionStorage.getItem("dfl_exit_intent") === "1") fired = true; } catch (err) {}
    function fire() {
      if (fired) return;
      fired = true;
      try { sessionStorage.setItem("dfl_exit_intent", "1"); } catch (err) {}
      openModal("modal-exit");
    }
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    });
    try { history.pushState({ dflExit: true }, ""); } catch (err) {}
    window.addEventListener("popstate", function () {
      if (fired) return;
      try { history.pushState({ dflExit: true }, ""); } catch (err) {}
      fire();
    });
  }

  function boot() {
    initCarousels();
    initAnchors();
    bindModalButtons();
    initOffers();
    initExitIntent();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
