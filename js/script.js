function mobileMenu(activeToWidth = 768) {
  const toggler = document.querySelector(".toggler");
  const menu = document.querySelector(".header__menu");
  const body = document.body;

  toggler.onclick = function () {
    toggler.classList.toggle("toggler_active");
    //A11y attribute toggle
    if (toggler.getAttribute("aria-expanded") == "false") {
      toggler.setAttribute("aria-expanded", "true");
    } else {
      toggler.setAttribute("aria-expanded", "false");
    }

    body.classList.toggle("body-lock");
    menu.classList.toggle("header__menu_active");
  };

  //Закриити меню, коли воно не має відображатися
  window.onresize = function () {
    if (window.innerWidth >= activeToWidth) {
      toggler.classList.remove("toggler_active");
      toggler.setAttribute("aria-expanded", "false");
      body.classList.remove("body-lock");
      menu.classList.remove("header__menu_active");
    }
  };
}

function mover() {
  const objectsToMove = Array.from(document.querySelectorAll("[data-move-to]"));
  const closestElement = objectsToMove.map((object) => {
    const prevSibling = object.previousElementSibling;
    if (prevSibling) return [prevSibling, true];
    return [object.parentElement, false];
  });

  function move() {
    const windowWidth = window.innerWidth;

    objectsToMove.forEach((object, index) => {
      const breakPoint = object.dataset.moveOn;
      if (!breakPoint) return;
      const target = document.querySelector(object.dataset.moveTo);
      if (windowWidth < breakPoint)
        target?.insertAdjacentElement("afterbegin", object);
      else {
        closestElement[index][1] &&
          closestElement[index][0].insertAdjacentElement("afterend", object);
        closestElement[index][1] ||
          closestElement[index][0].insertAdjacentElement("afterbegin", object);
      }
    });
  }

  move();

  window.addEventListener("resize", () => {
    move();
  });
}

/**
 * function to enable color theme change via elemets with [data-set]. data-set="toggle" for toggling between light and dark theme. Leave blank to set the system default.
 * @param {string} defaultTheme - Default theme set to "light" or "dark". Leave blank for the system default.
 */
const colorScheme = (defaultTheme) => {
  function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.classList.replace(currentTheme, nextTheme);
    localStorage.setItem("theme", nextTheme);
  }
  function setPreferedTheme() {
    let preferedTheme;
    if (defaultTheme) preferedTheme = defaultTheme;
    else {
      preferedTheme = window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(preferedTheme);
    localStorage.removeItem("theme");
  }
  function systemThemeChanges() {
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", (e) => {
        localStorage.getItem("theme") || setPreferedTheme();
      });
  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) document.documentElement.classList.add(savedTheme);
  else setPreferedTheme();

  defaultTheme || systemThemeChanges();

  const themeSwitchers = document.querySelectorAll("[data-theme]");

  themeSwitchers.forEach((themeSwitch) => {
    themeSwitch.addEventListener("click", (e) => {
      e.preventDefault();
      const toggle = themeSwitch.dataset.theme;
      if (toggle) toggleTheme();
      else {
        setPreferedTheme();
      }
    });
  });
};

function addEyebrow() {
  const header = document.querySelector("header.header");

  window.addEventListener("scroll", (e) => {
    if (scrollY >= 5) header.classList.add("header_scrolled");
    else header.classList.remove("header_scrolled");
  });
}

function initAccordions() {
  const accordions = document.querySelectorAll(
    '[data-accordion], [data-accordion="one"]'
  );

  const closePanel = (panel) => {
    const trigger = panel.querySelector("button[aria-expanded]");
    const content = panel.querySelector(
      "#" + trigger.getAttribute("aria-controls")
    );
    const isExpanded = trigger.getAttribute("aria-expanded") == "true";
    if (isExpanded) {
      trigger.setAttribute("aria-expanded", !isExpanded);
      content.setAttribute("aria-hidden", isExpanded);
    }
  };

  const openPanel = (panel) => {
    const trigger = panel.querySelector("button[aria-expanded]");
    const content = panel.querySelector(
      "#" + trigger.getAttribute("aria-controls")
    );
    const isExpanded = trigger.getAttribute("aria-expanded") == "true";
    if (!isExpanded) {
      trigger.setAttribute("aria-expanded", !isExpanded);
      content.setAttribute("aria-hidden", isExpanded);
    }
  };

  const activatePanel = (panel, index, panels, one) => {
    const trigger = panel.querySelector("button[aria-expanded]");

    trigger.addEventListener("click", (e) => {
      const isExpanded = trigger.getAttribute("aria-expanded") == "true";

      if (one) panels.forEach(closePanel);
      else closePanel(panel);
      isExpanded || openPanel(panel);
    });
  };

  accordions.forEach((accordion) => {
    const one = accordion.dataset.accordion == "one";
    const panels = accordion.querySelectorAll('[data-accordion="panel"]');
    panels.forEach((panel, index, panels) => {
      activatePanel(panel, index, panels, one);
    });
  });
}

function parallaxOnScroll() {
  const items = document.querySelectorAll("[data-prllx-scroll]");

  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  function animateIt(element, coefficient) {
    const centerOfTheParent =
      offset(element.parentElement).top + element.offsetHeight / 2;
    const centerOfTheScreen = pageYOffset + window.innerHeight / 2;
    const difference = centerOfTheScreen - centerOfTheParent;
    const scrollTopPercent = (difference / window.innerHeight) * 100;

    element.style.cssText = `transform: translateY(${
      scrollTopPercent / coefficient
    }%);`;
  }

  items.forEach((item) => {
    let visible = false;
    let coefficient = parseFloat(item.dataset.prllxScroll);
    if (!coefficient) coefficient = 1;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible = true;
        else visible = false;
      });
    });
    observer.observe(item);

    document.addEventListener("scroll", (e) => {
      if (!visible) return;
      animateIt(item, coefficient);
    });
  });
}

// function parallaxOnMouse() {
//   function offset(el) {
//     const rect = el.getBoundingClientRect(),
//       scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
//       scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//     return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
//   }

//   const parallaxElements = document.querySelectorAll("[data-prllx-mouse]");
//   if (!parallaxElements) return;

//   parallaxElements.forEach((parallaxEl) => {
//     // Coefficients
//     let coefficient = parseFloat(parallaxEl.dataset.prllxMouse);
//     if (!coefficient) coefficient = 10;
//     // Animation speed
//     const speed = 0.15;

//     let positionX = 0;
//     let positionY = 0;

//     let coordXPercent = 0;
//     let coordYPercent = 0;

//     window.addEventListener("mousemove", (e) => {
//       // Get element's width & height
//       const parallaxWidth = parallaxEl.offsetWidth;
//       const parallaxHeight = parallaxEl.offsetHeight;

//       // Middle is the start
//       const coordX = e.pageX - parallaxWidth / 2 - offset(parallaxEl).left;
//       const coordY = e.pageY - parallaxHeight / 2 - offset(parallaxEl).top;

//       // Convert to percents
//       coordXPercent = (coordX / parallaxWidth) * 100;
//       coordYPercent = (coordY / parallaxHeight) * 100;
//     });

//     function setMouseParallaxStyle() {
//       const distX = coordXPercent - positionX;
//       const distY = coordYPercent - positionY;

//       positionX += distX * speed;
//       positionY += distY * speed;

//       // Pass styles
//       function passStyles(element, coefficient) {
//         element.style.cssText = `transform: translate(${
//           positionX / coefficient
//         }%, ${positionY / coefficient}%);`;
//       }

//       passStyles(parallaxEl, coefficient);

//       requestAnimationFrame(setMouseParallaxStyle);
//     }

//     setMouseParallaxStyle();
//   });
// }

// function parallaxOnMouse() {
//   const elements = document.querySelectorAll("[data-prllx-mouse]");

//   elements.forEach((el) => {
//     let x = 0;
//     let y = 0;
//     // Coefficient
//     let coefficient = parseFloat(el.dataset.prllxMouse);
//     if (!coefficient) coefficient = 10;

//     document.addEventListener("mousemove", (e) => {
//       x = e.clientX / coefficient;
//       y = e.clientY / coefficient;
//     });

//     function move() {
//       el.style.transform = `translate(${x}px, ${y}px)`;

//       requestAnimationFrame(move);
//     }
//     move();
//   });
// }

function parallaxOnMouse() {
  const elements = document.querySelectorAll("[data-prllx-mouse]");
  let x = 0;
  let y = 0;

  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function animate() {
    elements.forEach((el) => {
      const coefficient = el.dataset.prllxMouse;
      el.style.transform = `translate(${x / coefficient}px, ${
        y / coefficient
      }px)`;
    });
    requestAnimationFrame(animate);
  }

  animate();
}

mobileMenu(992);
mover();
colorScheme();
addEyebrow();
initAccordions();
parallaxOnScroll();
parallaxOnMouse();
