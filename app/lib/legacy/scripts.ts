import { enqueueVendorScripts, loadVendorScript } from "./vendor-scripts";

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

type HotuxJQueryCollection = {
  length: number;
  hasClass(className: string): boolean;
  slick(options: Record<string, unknown> | string): void;
  niceSelect(): void;
  dateRangePicker(options: Record<string, unknown>): void;
  on(eventName: string, handler: (event: { date1?: Date }) => void): void;
  off(eventName: string): void;
  data(key: string): unknown;
};

type HotuxJQuery = {
  (target: string | Element): HotuxJQueryCollection;
  fn?: { slick?: unknown; dateRangePicker?: unknown; niceSelect?: unknown; modal?: unknown };
};

type HotuxWindow = Window & {
  jQuery?: HotuxJQuery;
  $?: HotuxJQuery;
  hotuxJQuery?: HotuxJQuery;
};

function hasHotuxPlugins(jQuery: HotuxJQuery | undefined) {
  return typeof jQuery?.fn?.slick === "function"
    && typeof jQuery.fn.dateRangePicker === "function"
    && typeof jQuery.fn.niceSelect === "function";
}

function getHotuxJQuery() {
  const hotuxWindow = window as HotuxWindow;
  if (hasHotuxPlugins(hotuxWindow.hotuxJQuery)) {
    return hotuxWindow.hotuxJQuery;
  }
  if (hasHotuxPlugins(hotuxWindow.jQuery)) {
    hotuxWindow.hotuxJQuery = hotuxWindow.jQuery;
    return hotuxWindow.jQuery;
  }
  return undefined;
}

type HotuxSwiperInstance = {
  destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
};

type HotuxSwiperConstructor = new (
  target: Element,
  options: Record<string, unknown>,
) => HotuxSwiperInstance;

export function loadLegacyScripts(
  bundle: readonly LegacyScriptSource[],
) {
  return enqueueVendorScripts(async () => {
    const hotuxWindow = window as HotuxWindow;
    let jQuery = hotuxWindow.hotuxJQuery ?? getHotuxJQuery();
    for (const source of bundle) {
      if (source === "/assets/legacy/js/jquery-3.3.1.min.js") {
        if (!jQuery?.fn) {
          // Older sessions can retain loaded tags but lose the plugin-owning
          // jQuery after the dashboard bundle replaces the globals.
          const existing = document.querySelector(`script[src="${source}"]`);
          const stale = !!existing && existing.getAttribute("data-hotux-load-state") !== "loading";
          await loadVendorScript(source, stale);
          jQuery = hotuxWindow.jQuery;
          if (!jQuery?.fn) throw new Error("Không thể khởi tạo jQuery của Hotux");
          hotuxWindow.hotuxJQuery = jQuery;
        }
        hotuxWindow.jQuery = hotuxWindow.$ = jQuery;
        continue;
      }

      await loadVendorScript(source);
      const needsReload = source === "/assets/legacy/js/plugin.js"
        ? !hasHotuxPlugins(jQuery)
        : source === "/assets/legacy/js/bootstrap.min.js" && typeof jQuery?.fn?.modal !== "function";
      if (needsReload) await loadVendorScript(source, true);
      if (source === "/assets/legacy/js/plugin.js" && !hasHotuxPlugins(jQuery)) {
        throw new Error("Không thể khởi tạo bộ plugin Hotux sau khi tải lại");
      }
    }
  });
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
  format: "YYYY-MM-DD",
  startDate: new Date(),
  hoveringTooltip: false,
  customArrowPrevSymbol: '<span class="fa fa-angle-left"></span>',
  customArrowNextSymbol: '<span class="fa fa-angle-right"></span>',
};

const teamSliderOptions = {
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  autoplay: true,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 1000, settings: { slidesToShow: 2 } },
    { breakpoint: 760, settings: { slidesToShow: 1 } },
  ],
};

/** Initialize the static Hotux destination carousel after React renders its slides. */
export function initializeHotuxTeamSlider(root: ParentNode = document) {
  const $ = getHotuxJQuery();
  const teamSlider = root.querySelector<HTMLElement>(".team-slider");
  if (!$ || !teamSlider || teamSlider.classList.contains("slick-initialized")) {
    return () => undefined;
  }

  $(teamSlider).slick(teamSliderOptions);
  return () => {
    if (teamSlider.classList.contains("slick-initialized")) {
      $(teamSlider).slick("unslick");
    }
  };
}

/**
 * Initialize the homepage-only widgets against the current React DOM.
 * Legacy scripts are loaded once, but these instances must be recreated for
 * every client-side visit to the home route.
 */
export function initializeHotuxHome(root: ParentNode = document) {
  const $ = getHotuxJQuery();
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

  const checkIn = root.querySelector<HTMLInputElement>("#date-range2");
  const checkOut = root.querySelector<HTMLInputElement>("#date-range3");
  const initializeDatePicker = (input: HTMLInputElement, startDate: Date) => {
    const element = $(input);
    getDateRangePicker(element)?.destroy();
    element.dateRangePicker({ ...homeDatePickerOptions, startDate });
  };

  if (checkIn && checkOut) {
    initializeDatePicker(checkIn, new Date());
    initializeDatePicker(checkOut, new Date());
    $(checkIn).on("datepicker-change.home-search", (event) => {
      if (!event.date1) return;
      const nextDay = new Date(event.date1);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOut.value = "";
      initializeDatePicker(checkOut, nextDay);
    });
  }

  return () => {
    swiper?.destroy(true, true);
    if (galleryElement?.classList.contains("slick-initialized")) {
      $(galleryElement).slick("unslick");
    }
    if (checkIn) {
      $(checkIn).off("datepicker-change.home-search");
      getDateRangePicker($(checkIn))?.destroy();
    }
    if (checkOut) getDateRangePicker($(checkOut))?.destroy();
  };
}

type HotuxDateRangePicker = {
  destroy(): void;
};

function getDateRangePicker(element: HotuxJQueryCollection) {
  return element.data("dateRangePicker") as HotuxDateRangePicker | undefined;
}

function destroySliders(jQuery: HotuxJQuery, sliders: HTMLElement[]) {
  for (const slider of sliders) {
    if (slider.classList.contains("slick-initialized")) jQuery(slider).slick("unslick");
  }
}

/** Static About widgets must also be recreated on a client-side return visit. */
export function initializeHotuxAbout(root: ParentNode = document) {
  const $ = getHotuxJQuery();
  if (!$) return () => undefined;
  const sliders: HTMLElement[] = [];
  const definitions = [
    [".team-slider", { ...teamSliderOptions, arrows: false, dots: false }],
    [".review-slider", {
      infinite: true, slidesToShow: 2, slidesToScroll: 1,
      arrows: false, dots: true, autoplay: true,
      responsive: [{ breakpoint: 1000, settings: { slidesToShow: 1 } }],
    }],
  ] as const;
  for (const [selector, options] of definitions) {
    root.querySelectorAll<HTMLElement>(selector).forEach((slider) => {
      if (!slider.classList.contains("slick-initialized")) $(slider).slick(options);
      sliders.push(slider);
    });
  }
  return () => destroySliders($, sliders);
}

/**
 * The date-range-picker plugin retains a window resize listener. Its instance
 * must be created and destroyed with the React route instead of executing the
 * legacy script just once for the whole document.
 */
export function initializeHotuxReservation() {
  const $ = getHotuxJQuery();
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
  const $ = getHotuxJQuery();
  if (!$) return;

  const calendar = $("#date-range12");
  if (calendar.length) getDateRangePicker(calendar)?.destroy();
}

/**
 * `main.js` executes only the first time it is inserted into the document.
 * These are its detail-page initializers, repeated for client-side navigation.
 */
export function initializeHotuxRoomDetail(root: ParentNode = document) {
  const $ = getHotuxJQuery();
  if (!$) return () => undefined;
  const sliders: HTMLElement[] = [];

  const initializeSlick = (selector: string, options: Record<string, unknown>) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((slider) => {
      if (!slider.classList.contains("slick-initialized")) $(slider).slick(options);
      sliders.push(slider);
    });
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
    arrows: true,
    dots: true,
    autoplay: true,
    responsive: [
      { breakpoint: 1000, settings: { slidesToShow: 2 } },
      { breakpoint: 760, settings: { slidesToShow: 1 } },
    ],
  });

  root.querySelectorAll<HTMLSelectElement>(".check-in select.wide").forEach((select) => {
    if (!select.nextElementSibling?.classList.contains("nice-select")) $(select).niceSelect();
  });
  return () => destroySliders($, sliders);
}
