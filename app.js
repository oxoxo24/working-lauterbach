const $ = (selector, context = document) => context.querySelector(selector);

const make = (tag, className, html = "") => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.innerHTML = html;
  return node;
};

async function loadContent() {
  const response = await fetch("content.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load content.json (${response.status})`);
  return response.json();
}

function renderNavigation(data) {
  const nav = $("#site-nav");
  data.site.navigation.forEach(item => {
    const a = make("a", "", item.label);
    a.href = item.href;
    nav.append(a);
  });

  const button = $(".menu-toggle");
  button.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    button.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  });
}

function renderHero(data) {
  $("#hero-eyebrow").textContent = `${data.site.owner} · ${data.site.location}`;
  $("#hero-title").innerHTML = data.site.title.replace(" ", "<br>");
  $("#hero-lead").textContent = data.site.intro;
  $("#hero-description").textContent = data.site.description;
  $("#hero-image").src = data.hero.image;
  $("#hero-image").alt = data.hero.alt;
  $("#hero-caption").textContent = data.hero.caption;

  data.hero.links.forEach(item => {
    const a = make("a", "", `<span>${item.number}</span>${item.label}<i>↘</i>`);
    a.href = item.href;
    $("#hero-links").append(a);
  });
}

function renderSeries(series, target) {
  if (!series || !series.images?.length) return;

  const wrap = make("div", `image-series image-series--${series.layout || "strip"} reveal`);

  if (series.layout === "feature-thumbs") {
    const feature = make("figure", "series-feature");
    const mainImage = series.images[0];
    feature.innerHTML = `<img src="${mainImage.src}" alt="${mainImage.alt || ""}">`;
    wrap.append(feature);

    const thumbs = make("div", "series-thumbs");
    series.images.forEach((image, index) => {
      const button = make("button", `series-thumb ${index === 0 ? "is-active" : ""}`);
      button.type = "button";
      button.setAttribute("aria-label", `Show image ${index + 1}`);
      button.innerHTML = `<img src="${image.src}" alt="">`;
      button.addEventListener("click", () => {
        const img = $("img", feature);
        img.src = image.src;
        img.alt = image.alt || "";
        thumbs.querySelectorAll(".series-thumb").forEach(node => node.classList.remove("is-active"));
        button.classList.add("is-active");
      });
      thumbs.append(button);
    });
    wrap.append(thumbs);
  } else {
    const grid = make("div", "series-grid");
    series.images.forEach(image => {
      const figure = make("figure", "series-image");
      figure.innerHTML = `<img src="${image.src}" alt="${image.alt || ""}">`;
      grid.append(figure);
    });
    wrap.append(grid);
  }

  if (series.caption) wrap.append(make("p", "series-caption", series.caption));
  target.append(wrap);
}

function renderExpect(data) {
  $("#expect-eyebrow").textContent = data.expect.eyebrow;
  $("#expect-title").textContent = data.expect.title;
  $("#expect-intro").textContent = data.expect.intro;

  data.expect.items.forEach((item, index) => {
    $("#expect-items").append(make("article", "principle reveal", `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    `));
  });

  renderSeries(data.expect.series, $("#expect-series"));
}

function renderProcess(data) {
  $("#process-eyebrow").textContent = data.process.eyebrow;
  $("#process-title").textContent = data.process.title;
  data.process.paragraphs.forEach(text => $("#process-copy").append(make("p", "", text)));
  $("#process-quote").textContent = data.process.quote;
  renderSeries(data.process.series, $("#process-series"));
}

function renderWorkIntro(data) {
  $("#work-eyebrow").textContent = data.work.eyebrow;
  $("#work-title").textContent = data.work.title;
  $("#work-intro").textContent = data.work.intro;
}

function renderFormats(data) {
  data.workingFormats.forEach(format => {
    const card = make("a", "format-card reveal");
    card.href = `#${format.id}`;
    card.innerHTML = `
      <span class="card-number">${format.number}</span>
      <h3>${format.shortTitle}</h3>
      <p>${format.lead}</p>
      <i>View ↘</i>`;
    $("#format-cards").append(card);

    const section = make("section", `section work-section ${format.tone === "dark" ? "is-dark" : ""}`);
    section.id = format.id;
    section.innerHTML = `
      <div class="shell">
        <div class="work-heading">
          <div class="reveal">
            <p class="eyebrow">${format.number} / ${format.navTitle}</p>
            <h2 class="display">${format.shortTitle}</h2>
          </div>
          <div class="work-intro reveal">
            <p class="work-lead">${format.lead}</p>
            <p>${format.description}</p>
          </div>
        </div>
        <div class="format-series"></div>
        <div class="detail-grid">
          ${format.details.map(item => `
            <article class="reveal">
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>`).join("")}
        </div>
        ${format.tags ? `<div class="tag-panel reveal"><span>Possible work</span><div>${format.tags.map(tag => `<b>${tag}</b>`).join("")}</div></div>` : ""}
        ${format.quote ? `<blockquote class="large-quote reveal">${format.quote}</blockquote>` : ""}
      </div>`;

    $("#format-sections").append(section);
    renderSeries(format.series, $(".format-series", section));
  });
}

function renderAbout(data) {
  $("#about-eyebrow").textContent = data.about.eyebrow;
  $("#about-title").textContent = data.about.title;
  data.about.paragraphs.forEach(text => $("#about-copy").append(make("p", "", text)));
  renderSeries(data.about.series, $("#about-series"));
}

function renderFaq(data) {
  $("#faq-eyebrow").textContent = data.faq.eyebrow;
  $("#faq-title").textContent = data.faq.title;
  data.faq.items.forEach((item, index) => {
    const details = make("details", "faq-item reveal");
    details.innerHTML = `
      <summary><span>${String(index + 1).padStart(2, "0")}</span><strong>${item.question}</strong><i></i></summary>
      <p>${item.answer}</p>`;
    $("#faq-list").append(details);
  });
}

function renderStudio(data) {
  $("#studio-eyebrow").textContent = data.studio.eyebrow;
  $("#studio-title").textContent = data.studio.title;
  $("#studio-description").textContent = data.studio.description;
  $("#studio-image").src = data.studio.image;
  $("#studio-image").alt = data.studio.alt;
  $("#contact-text").textContent = data.studio.contactText;
  $("#closing").textContent = data.studio.closing;
  data.studio.facts.forEach(fact => $("#studio-facts").append(make("span", "", fact)));

  const email = $("#email-link");
  email.href = `mailto:${data.site.email}`;
  email.textContent = data.site.email;

  const instagram = $("#instagram-link");
  instagram.href = data.site.instagram;
  instagram.textContent = data.site.instagramLabel;
}

function observeReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
  document.querySelectorAll(".reveal").forEach(node => observer.observe(node));
}

function watchHeader() {
  const update = () => document.body.classList.toggle("has-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

loadContent()
  .then(data => {
    renderNavigation(data);
    renderHero(data);
    renderExpect(data);
    renderProcess(data);
    renderWorkIntro(data);
    renderFormats(data);
    renderAbout(data);
    renderFaq(data);
    renderStudio(data);
    observeReveals();
    watchHeader();
    document.body.classList.add("is-ready");
  })
  .catch(error => {
    console.error(error);
    document.body.classList.add("is-ready");
    document.body.insertAdjacentHTML("beforeend", `<p class="load-error">The page content could not be loaded. Please check content.json.</p>`);
  });
