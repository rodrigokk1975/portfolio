(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  // 1. Alternância de tema Claro / Escuro com persistência
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light" ? "#f8fafc" : "#0b1120");
    }
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    }
  }

  if (themeToggle) {
    applyTheme(root.getAttribute("data-theme") || "dark");
    themeToggle.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  // 2. Destaque sutil no cursor (apenas desktop e sem prefers-reduced-motion)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!reduceMotion && hasFinePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
      },
      { passive: true }
    );
  }

  // 3. Marca o item ativo na navegação lateral conforme a rolagem
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isMatch = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isMatch);
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // 4. Botão "Copiar e-mail" com feedback visual e fallback
  const copyBtn = document.getElementById("copy-email-btn");
  const copyFeedback = document.getElementById("copy-feedback");

  if (copyBtn && copyFeedback) {
    let feedbackTimer;

    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email") || "";
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = `E-mail copiado: ${email}`;
      } catch {
        // Fallback para ambientes sem API de clipboard
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        copyFeedback.textContent = `E-mail copiado: ${email}`;
      }

      clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(() => {
        copyFeedback.textContent = "";
      }, 3000);
    });
  }
})();
