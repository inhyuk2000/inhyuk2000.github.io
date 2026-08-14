/**
 * Scroll reveal for Portfolio (row groups), Tech Stack (categories),
 * Experience/Education (cards + timeline draw + icon pop),
 * and homepage sections (Learning Garden, Contact, CTA).
 */
(function () {
  var OBSERVER_OPTS = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.15,
  };

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function columnCount(grid) {
    var lg = parseInt(grid.getAttribute("data-cols-lg") || "3", 10) || 3;
    if (window.matchMedia("(min-width: 1024px)").matches) return lg;
    if (window.matchMedia("(min-width: 768px)").matches) return Math.min(2, lg);
    return 1;
  }

  function revealRow(cards, rowIndex, cols) {
    var start = rowIndex * cols;
    var end = start + cols;
    for (var i = start; i < end && i < cards.length; i++) {
      cards[i].classList.add("is-inview");
    }
  }

  function initPortfolioGrid(grid) {
    if (grid.dataset.revealReady === "1") return;
    grid.dataset.revealReady = "1";

    var cards = Array.prototype.slice.call(
      grid.querySelectorAll(".portfolio-reveal-card")
    );
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      cards.forEach(function (card) {
        card.classList.add("is-inview");
      });
      return;
    }

    var cols = columnCount(grid);
    var revealed = {};

    var observer = new IntersectionObserver(function (entries) {
      cols = columnCount(grid);
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = parseInt(entry.target.getAttribute("data-reveal-index") || "0", 10);
        var row = Math.floor(idx / cols);
        if (revealed[row]) return;
        revealed[row] = true;
        revealRow(cards, row, cols);
      });
    }, OBSERVER_OPTS);

    cards.forEach(function (card) {
      observer.observe(card);
    });

    requestAnimationFrame(function () {
      cols = columnCount(grid);
      var vh = window.innerHeight || document.documentElement.clientHeight;
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) {
          var idx = parseInt(card.getAttribute("data-reveal-index") || "0", 10);
          var row = Math.floor(idx / cols);
          if (!revealed[row]) {
            revealed[row] = true;
            revealRow(cards, row, cols);
          }
        }
      });
    });
  }

  function initTechReveal(list) {
    if (list.dataset.revealReady === "1") return;
    list.dataset.revealReady = "1";

    var items = Array.prototype.slice.call(
      list.querySelectorAll(".tech-reveal-category")
    );
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach(function (item) {
        item.classList.add("is-inview");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTS);

    items.forEach(function (item) {
      observer.observe(item);
    });

    requestAnimationFrame(function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) {
          item.classList.add("is-inview");
          observer.unobserve(item);
        }
      });
    });
  }

  function initResumeReveal(root) {
    if (root.dataset.revealReady === "1") return;
    root.dataset.revealReady = "1";

    var slots = Array.prototype.slice.call(
      root.querySelectorAll(".resume-reveal-slot")
    );
    if (!slots.length) return;

    var lines = {
      exp: root.querySelector('[data-resume-line="exp"]'),
      edu: root.querySelector('[data-resume-line="edu"]'),
    };
    var maxRevealed = { exp: -1, edu: -1 };
    var totals = { exp: 0, edu: 0 };

    slots.forEach(function (slot) {
      var rail = slot.getAttribute("data-resume-rail") || "exp";
      var total = parseInt(slot.getAttribute("data-reveal-total") || "1", 10) || 1;
      if (total > totals[rail]) totals[rail] = total;
    });

    function setLineProgress(rail, index) {
      if (index <= maxRevealed[rail]) return;
      maxRevealed[rail] = index;
      var line = lines[rail];
      if (!line) return;
      var total = totals[rail] || 1;
      var progress = (index + 1) / total;
      line.style.setProperty("--reveal-progress", String(progress));
    }

    function revealSlot(slot) {
      if (slot.classList.contains("is-inview")) return;
      slot.classList.add("is-inview");
      var rail = slot.getAttribute("data-resume-rail") || "exp";
      var idx = parseInt(slot.getAttribute("data-reveal-index") || "0", 10);
      setLineProgress(rail, idx);
    }

    if (prefersReducedMotion()) {
      slots.forEach(function (slot) {
        revealSlot(slot);
      });
      Object.keys(lines).forEach(function (rail) {
        if (lines[rail]) lines[rail].style.setProperty("--reveal-progress", "1");
      });
      return;
    }

    var pending = [];
    var flushTimer = null;

    function flushStaggered() {
      flushTimer = null;
      pending.sort(function (a, b) {
        var ai = parseInt(a.getAttribute("data-reveal-index") || "0", 10);
        var bi = parseInt(b.getAttribute("data-reveal-index") || "0", 10);
        if (ai !== bi) return ai - bi;
        var ar = a.getAttribute("data-resume-rail") || "";
        var br = b.getAttribute("data-resume-rail") || "";
        return ar < br ? -1 : ar > br ? 1 : 0;
      });
      pending.forEach(function (slot, i) {
        window.setTimeout(function () {
          revealSlot(slot);
        }, i * 110);
      });
      pending = [];
    }

    function queueReveal(slot) {
      if (slot.classList.contains("is-inview")) return;
      if (pending.indexOf(slot) !== -1) return;
      pending.push(slot);
      if (flushTimer) return;
      flushTimer = window.setTimeout(flushStaggered, 40);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        queueReveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTS);

    slots.forEach(function (slot) {
      observer.observe(slot);
    });

    requestAnimationFrame(function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      slots.forEach(function (slot) {
        var rect = slot.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) {
          queueReveal(slot);
          observer.unobserve(slot);
        }
      });
    });
  }

  function initScrollReveal(root) {
    if (root.dataset.revealReady === "1") return;
    root.dataset.revealReady = "1";

    var items = Array.prototype.slice.call(
      root.querySelectorAll(".scroll-reveal-item")
    );
    if (!items.length) return;
    observeRevealItems(items);
  }

  function observeRevealItems(items) {
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach(function (item) {
        item.classList.add("is-inview");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTS);

    items.forEach(function (item) {
      observer.observe(item);
    });

    requestAnimationFrame(function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > 0) {
          item.classList.add("is-inview");
          observer.unobserve(item);
        }
      });
    });
  }

  function initContactReveal() {
    var section = document.querySelector("#contact");
    if (!section || section.dataset.revealReady === "1") return;
    section.dataset.revealReady = "1";

    var items = [];
    var header = section.querySelector(".text-center");
    if (header) {
      header.classList.add("scroll-reveal-item");
      items.push(header);
    }

    var grid = section.querySelector(".grid");
    if (grid) {
      Array.prototype.forEach.call(grid.children, function (child) {
        if (child.nodeType !== 1) return;
        child.classList.add("scroll-reveal-item");
        items.push(child);
      });
    }

    observeRevealItems(items);
  }

  function initCtaReveal() {
    document.querySelectorAll(".cta-card-block-container").forEach(function (el) {
      if (el.dataset.revealReady === "1") return;
      el.dataset.revealReady = "1";
      el.classList.add("scroll-reveal-item");
      observeRevealItems([el]);
    });
  }

  function boot() {
    document.querySelectorAll("[data-portfolio-reveal]").forEach(initPortfolioGrid);
    document.querySelectorAll("[data-tech-reveal]").forEach(initTechReveal);
    document.querySelectorAll("[data-resume-reveal]").forEach(initResumeReveal);
    document.querySelectorAll("[data-scroll-reveal]").forEach(initScrollReveal);
    initContactReveal();
    initCtaReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
