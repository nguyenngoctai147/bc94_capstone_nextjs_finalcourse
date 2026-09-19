export const legacyScriptBundles = {
  hotuxContact: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
    "/assets/legacy/js/main.js",
  ],
  hotuxAbout: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
    "/assets/legacy/js/main.js",
  ],
  hotuxReservation: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
    "/assets/legacy/js/main.js",
  ],
  hotuxRoomDetail: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
    "/assets/legacy/js/main.js",
  ],
  hotuxRoomList: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
    "/assets/legacy/js/main.js",
  ],
  hotuxHome: [
    "/assets/legacy/js/jquery-3.3.1.min.js",
    "/assets/legacy/js/bootstrap.min.js",
    "/assets/legacy/js/plugin.js",
  ],
} as const;

type LegacyScriptSource = (typeof legacyScriptBundles)[keyof typeof legacyScriptBundles][number];
const loadingScripts = new Map<LegacyScriptSource, Promise<void>>();
const legacyScriptStateAttribute = "data-hotux-load-state";

function waitForLegacyScript(
  script: HTMLScriptElement,
  source: LegacyScriptSource,
) {
  const state = script.getAttribute(legacyScriptStateAttribute);
  if (state === "loaded") return Promise.resolve();
  if (state === "failed") return Promise.reject(new Error(`Không thể tải ${source}`));

  // Scripts injected by an earlier Fast Refresh did not have our state marker.
  // Once the document is complete, such a script has already finished loading.
  if (document.readyState === "complete") {
    script.setAttribute(legacyScriptStateAttribute, "loaded");
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const handleLoad = () => {
      script.setAttribute(legacyScriptStateAttribute, "loaded");
      resolve();
    };
    const handleError = () => {
      script.setAttribute(legacyScriptStateAttribute, "failed");
      reject(new Error(`Không thể tải ${source}`));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
  });
}

type HotuxJQueryCollection = {
  length: number;
  hasClass(className: string): boolean;
  slick(options: Record<string, unknown> | string): void;
  niceSelect(): void;
  dateRangePicker(options: Record<string, unknown>): void;
  data(key: string): unknown;
};

type HotuxJQuery = (target: string | Element) => HotuxJQueryCollection;

type HotuxSwiperInstance = {
  destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
};

type HotuxSwiperConstructor = new (
  target: Element,
  options: Record<string, unknown>,
) => HotuxSwiperInstance;

function loadLegacyScript(source: LegacyScriptSource) {
  const pending = loadingScripts.get(source);
  if (pending) return pending;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${source}"]`,
    );
    if (existing) {
      void waitForLegacyScript(existing, source).then(resolve, reject);
      return;
    }

    const script = document.createElement("script");
    script.src = source;
    script.async = false;
    script.setAttribute(legacyScriptStateAttribute, "loading");
    script.onload = () => {
      script.setAttribute(legacyScriptStateAttribute, "loaded");
      resolve();
    };
    script.onerror = () => {
      script.setAttribute(legacyScriptStateAttribute, "failed");
      reject(new Error(`Không thể tải ${source}`));
    };
    document.body.appendChild(script);
  });

  loadingScripts.set(source, promise);
  return promise;
}

export function loadLegacyScripts(
  bundle: readonly LegacyScriptSource[],
) {
  return bundle.reduce(
    (chain, source) => chain.then(() => loadLegacyScript(source)),
    Promise.resolve(),
  );
}

const homeSwiperOptions = {
  direction: "vertical",
  speed: 2500,
  autoplay: true,
  zoom: true,
  grabCursor: true,
  loop: true,
  slidesPerView: "auto",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
};

const homeDatePickerOptions = {
  autoClose: true,
  singleDate: true,
  showShortcuts: false,
  singleMonth: true,
  showTopbar: false,
  extraClass: "reserved-form",
  customArrowPrevSymbol: '<span class="fa fa-angle-left"></span>',
  customArrowNextSymbol: '<span class="fa fa-angle-right"></span>',
};

/**
 * Initialize the homepage-only widgets against the current React DOM.
 * Legacy scripts are loaded once, but these instances must be recreated for
 * every client-side visit to the home route.
 */
export function initializeHotuxHome(root: ParentNode = document) {
  const $ = (window as typeof window & { jQuery?: HotuxJQuery }).jQuery;
  const Swiper = (window as typeof window & { Swiper?: HotuxSwiperConstructor }).Swiper;
  if (!$ || !Swiper) return () => undefined;

  const swiperElement = root.querySelector<HTMLElement>(".swiper-container");
  const swiper = swiperElement ? new Swiper(swiperElement, homeSwiperOptions) : undefined;

  const galleryElement = root.querySelector<HTMLElement>(".gallery-slider");
  if (galleryElement && !galleryElement.classList.contains("slick-initialized")) {
    $(galleryElement).slick({
      infinite: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      autoplay: true,
      responsive: [
        { breakpoint: 1000, settings: { slidesToShow: 4 } },
        { breakpoint: 500, settings: { slidesToShow: 2 } },
      ],
    });
  }

  for (const id of ["date-range2", "date-range3"] as const) {
    const input = root.querySelector<HTMLElement>(`#${id}`);
    if (input && !$(input).data("dateRangePicker")) {
      $(input).dateRangePicker(homeDatePickerOptions);
    }
  }

  root.querySelectorAll<HTMLSelectElement>("select.wide").forEach((select) => {
    if (!select.nextElementSibling?.classList.contains("nice-select")) $(select).niceSelect();
  });

  return () => {
    swiper?.destroy(true, true);
    if (galleryElement?.classList.contains("slick-initialized")) {
      $(galleryElement).slick("unslick");
    }
    for (const id of ["date-range2", "date-range3"] as const) {
      const input = root.querySelector<HTMLElement>(`#${id}`);
      if (input) getDateRangePicker($(input))?.destroy();
    }
  };
}

type HotuxDateRangePicker = {
  destroy(): void;
};

function getDateRangePicker(element: HotuxJQueryCollection) {
  return element.data("dateRangePicker") as HotuxDateRangePicker | undefined;
}

/**
 * The date-range-picker plugin retains a window resize listener. Its instance
 * must be created and destroyed with the React route instead of executing the
 * legacy script just once for the whole document.
 */
export function initializeHotuxReservation() {
  const $ = (window as typeof window & { jQuery?: HotuxJQuery }).jQuery;
  if (!$) return;

  const calendar = $("#date-range12");
  if (!calendar.length) return;

  getDateRangePicker(calendar)?.destroy();
  calendar.dateRangePicker({
    inline: true,
    separator: " to: ",
    container: "#date-range12-container",
    alwaysOpen: true,
    stickyMonths: true,
    showTopbar: false,
    format: "MMM D, YYYY",
    customTopBar: "",
    startDate: new Date(),
    hoveringTooltip: false,
    showShortcuts: false,
    customArrowPrevSymbol: '<span class="fa fa-angle-left"></span>',
    customArrowNextSymbol: '<span class="fa fa-angle-right"></span>',
  });
}

export function destroyHotuxReservation() {
  const $ = (window as typeof window & { jQuery?: HotuxJQuery }).jQuery;
  if (!$) return;

  const calendar = $("#date-range12");
  if (calendar.length) getDateRangePicker(calendar)?.destroy();
}

/**
 * `main.js` executes only the first time it is inserted into the document.
 * These are its detail-page initializers, repeated for client-side navigation.
 */
export function initializeHotuxRoomDetail() {
  const $ = (window as typeof window & { jQuery?: HotuxJQuery }).jQuery;
  if (!$) return;

  const initializeSlick = (selector: string, options: Record<string, unknown>) => {
    const element = $(selector);
    if (element.length && !element.hasClass("slick-initialized")) element.slick(options);
  };

  initializeSlick(".slider-for", {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    autoplay: true,
    asNavFor: ".slider-nav",
  });
  initializeSlick(".slider-nav", {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: false,
    centerMode: true,
    autoplay: true,
    focusOnSelect: true,
  });
  initializeSlick(".team-slider", {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true,
    responsive: [
      { breakpoint: 1000, settings: { slidesToShow: 2 } },
      { breakpoint: 760, settings: { slidesToShow: 1 } },
    ],
  });

  document.querySelectorAll<HTMLSelectElement>(".check-in select.wide").forEach((select) => {
    if (!select.nextElementSibling?.classList.contains("nice-select")) $(select).niceSelect();
  });
}
