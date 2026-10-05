import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { loadDashboardScripts } from "../app/lib/legacy/dashboard-scripts";
import { initializeHotuxAbout, initializeHotuxHome, initializeHotuxRoomDetail, initializeHotuxTeamSlider, legacyScriptBundles, loadLegacyScripts } from "../app/lib/legacy/scripts";
import { loadVendorScript } from "../app/lib/legacy/vendor-scripts";

const jquerySource = legacyScriptBundles.hotuxHome[0];
const pluginSource = legacyScriptBundles.hotuxHome[2];

function makeHarness() {
  const scripts: FakeScript[] = [];
  const executions: string[] = [];
  const classList = () => {
    const values = new Set<string>();
    return {
      contains: (name: string) => values.has(name),
      add: (name: string) => values.add(name),
      remove: (name: string) => values.delete(name),
    };
  };
  const gallery = { classList: classList() };
  const team = { classList: classList() };
  const detail = { classList: classList() };
  const nav = { classList: classList() };
  const review = { classList: classList() };
  const widgets = new Map([
    [".gallery-slider", gallery], [".team-slider", team],
    [".slider-for", detail], [".slider-nav", nav], [".review-slider", review],
  ]);
  const createJQuery = (version: string) => Object.assign(
    (target: typeof gallery) => ({
      slick: (options: object | string) => {
        if (options === "unslick") target.classList.remove("slick-initialized");
        else target.classList.add("slick-initialized");
      },
    }),
    { fn: { jquery: version } as Record<string, unknown> },
  );
  type JQuery = ReturnType<typeof createJQuery>;
  const fakeWindow: {
    jQuery?: JQuery; $?: JQuery; hotuxJQuery?: JQuery; hotuxDashboardJQuery?: JQuery;
    Swiper: new () => { destroy(): void };
  } = { Swiper: class { destroy() {} } };
  let failSource: string | undefined;
  let holdSource: string | undefined;
  class FakeScript {
    src = "";
    async = false;
    attributes = new Map<string, string>();
    listeners = new Map<string, Set<() => void>>();
    setAttribute(name: string, value: string) { this.attributes.set(name, value); }
    getAttribute(name: string) { return this.attributes.get(name) ?? null; }
    addEventListener(name: string, handler: () => void) {
      const listeners = this.listeners.get(name) ?? new Set();
      listeners.add(handler);
      this.listeners.set(name, listeners);
    }
    removeEventListener(name: string, handler: () => void) { this.listeners.get(name)?.delete(handler); }
    dispatch(name: string) { for (const handler of this.listeners.get(name) ?? []) handler(); }
    remove() { scripts.splice(scripts.indexOf(this), 1); }
  }
  const runScript = (script: FakeScript) => {
    executions.push(script.src);
    if (script.src === failSource) {
      failSource = undefined;
      script.dispatch("error");
      return;
    }
    if (script.src === jquerySource) fakeWindow.jQuery = fakeWindow.$ = createJQuery("3.3.1");
    if (script.src.endsWith("/bootstrap.min.js")) fakeWindow.jQuery!.fn.modal = () => undefined;
    if (script.src === pluginSource) {
      for (const name of ["slick", "niceSelect", "dateRangePicker"]) fakeWindow.jQuery!.fn[name] = () => undefined;
    }
    if (script.src.endsWith("/core/core.js")) fakeWindow.jQuery = fakeWindow.$ = createJQuery("3.6.0");
    if (script.src.endsWith("/dashboard-light.js")) assert.equal(fakeWindow.hotuxDashboardJQuery?.fn.jquery, "3.6.0");
    script.dispatch("load");
  };
  const fakeDocument = {
    readyState: "complete",
    querySelector(selector: string) {
      const source = selector.match(/^script\[src="(.+)"\]$/)?.[1];
      return scripts.find((script) => script.src === source) ?? null;
    },
    createElement: () => new FakeScript(),
    body: {
      appendChild(script: FakeScript) {
        scripts.push(script);
        if (script.src !== holdSource) queueMicrotask(() => runScript(script));
      },
    },
  };
  const root = {
    querySelector: (selector: string) => widgets.get(selector) ?? null,
    querySelectorAll: (selector: string) => widgets.has(selector) ? [widgets.get(selector)] : [],
  } as unknown as ParentNode;
  return {
    window: fakeWindow, document: fakeDocument, scripts, executions, createJQuery, runScript, widgets, root,
    hold(source: string) { holdSource = source; },
    failNext(source: string) { failSource = source; },
    initializeSliders() {
      const destroyHome = initializeHotuxHome(root);
      const destroyTeam = initializeHotuxTeamSlider(root);
      assert.equal(gallery.classList.contains("slick-initialized"), true);
      assert.equal(team.classList.contains("slick-initialized"), true);
      destroyHome();
      destroyTeam();
      assert.equal(gallery.classList.contains("slick-initialized"), false);
      assert.equal(team.classList.contains("slick-initialized"), false);
    },
  };
}

async function withHarness(run: (harness: ReturnType<typeof makeHarness>) => Promise<void>) {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const harness = makeHarness();
  Object.assign(globalThis, { window: harness.window, document: harness.document });
  try { await run(harness); }
  finally { Object.assign(globalThis, { window: previousWindow, document: previousDocument }); }
}

test("sliders survive a replacement jQuery and recover when an older session lost its saved instance", async () => {
  await withHarness(async (harness) => {
    await loadLegacyScripts(legacyScriptBundles.hotuxHome);
    harness.window.jQuery = harness.createJQuery("3.6.0");
    harness.initializeSliders();
    // Reported stale state: loaded tags, no saved plugin-owning jQuery,
    // and a global belonging to the dashboard.
    delete harness.window.hotuxJQuery;
    await Promise.all([
      loadLegacyScripts(legacyScriptBundles.hotuxHome),
      loadLegacyScripts(legacyScriptBundles.hotuxHome),
    ]);
    harness.initializeSliders();
    assert.equal(harness.executions.filter((source) => source === jquerySource).length, 2);
    assert.equal(harness.executions.filter((source) => source === pluginSource).length, 2);
  });
});

test("concurrent admin and public bundles use separate jQuery instances and repeat visits do not reload assets", async () => {
  await withHarness(async (harness) => {
    await Promise.all([
      loadLegacyScripts(legacyScriptBundles.hotuxHome),
      loadDashboardScripts(),
      loadLegacyScripts(legacyScriptBundles.hotuxAbout),
    ]);
    harness.initializeSliders();
    assert.equal(harness.window.jQuery, harness.window.hotuxJQuery);
    assert.notEqual(harness.window.hotuxJQuery, harness.window.hotuxDashboardJQuery);
    const loads = harness.executions.length;
    await loadDashboardScripts();
    await loadLegacyScripts(legacyScriptBundles.hotuxHome);
    assert.equal(harness.executions.length, loads);
    assert.equal(harness.window.jQuery, harness.window.hotuxJQuery);
  });
});

test("detail and About route cleanup destroys original slider nodes even after globals and the route DOM change", async () => {
  await withHarness(async (harness) => {
    await loadLegacyScripts(legacyScriptBundles.hotuxHome);
    const detail = harness.widgets.get(".slider-for")!;
    const nav = harness.widgets.get(".slider-nav")!;
    const destroyDetail = initializeHotuxRoomDetail(harness.root);
    assert.equal(detail.classList.contains("slick-initialized"), true);
    assert.equal(nav.classList.contains("slick-initialized"), true);
    harness.widgets.delete(".slider-for");
    harness.widgets.delete(".slider-nav");
    harness.window.jQuery = harness.createJQuery("3.6.0");
    destroyDetail();
    assert.equal(detail.classList.contains("slick-initialized"), false);
    assert.equal(nav.classList.contains("slick-initialized"), false);
    for (let visit = 0; visit < 2; visit++) {
      const destroyAbout = initializeHotuxAbout(harness.root);
      assert.equal(harness.widgets.get(".review-slider")!.classList.contains("slick-initialized"), true);
      destroyAbout();
      assert.equal(harness.widgets.get(".review-slider")!.classList.contains("slick-initialized"), false);
    }
  });
});

test("a complete document does not make an in-flight script ready", async () => {
  await withHarness(async (harness) => {
    harness.hold(jquerySource);
    let ready = false;
    const loading = loadLegacyScripts(legacyScriptBundles.hotuxHome).then(() => { ready = true; });
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(ready, false);
    assert.equal(harness.scripts.length, 1);
    assert.equal(harness.scripts[0].getAttribute("data-hotux-load-state"), "loading");
    harness.runScript(harness.scripts[0]);
    await loading;
    harness.initializeSliders();
  });
});

test("failed asset loads can be retried instead of poisoning the cache and queue", async () => {
  await withHarness(async (harness) => {
    harness.failNext(pluginSource);
    await assert.rejects(loadLegacyScripts(legacyScriptBundles.hotuxHome), /Không thể tải/);
    await loadLegacyScripts(legacyScriptBundles.hotuxHome);
    harness.initializeSliders();
    assert.equal(harness.scripts.filter((script) => script.src === pluginSource).length, 1);
  });
});

test("unmarked script tags are not treated as proof of execution", async () => {
  await withHarness(async (harness) => {
    const stale = harness.document.createElement();
    stale.src = jquerySource;
    harness.scripts.push(stale);
    await loadVendorScript(jquerySource);
    assert.equal(harness.window.jQuery?.fn.jquery, "3.3.1");
    assert.equal(harness.scripts.length, 1);
    assert.notEqual(harness.scripts[0], stale);
  });
});

test("real legacy easing callbacks remain usable when the global jQuery is replaced", () => {
  const plugin = readFileSync(new URL("../public/assets/legacy/js/plugin.js", import.meta.url), "utf8");
  const start = plugin.indexOf("(function (jQuery) {");
  const end = plugin.indexOf("})(jQuery);", start) + "})(jQuery);".length;
  assert.ok(start >= 0 && end > start);
  const jQuery = {
    easing: { swing: () => 0 } as Record<string, unknown>,
    extend: Object.assign,
  };
  const context = { jQuery };
  runInNewContext(plugin.slice(start, end), context);
  context.jQuery = { easing: { swing: () => 0 }, extend: Object.assign };
  const swing = jQuery.easing.swing as (...args: number[]) => number;
  const bounce = jQuery.easing.easeInOutBounce as (...args: number[]) => number;
  assert.equal(swing(0, 50, 0, 100, 100), 75);
  assert.equal(Number.isFinite(bounce(0, 50, 0, 100, 100)), true);
});

test("real main script skips React-owned and already initialized sliders while initializing static sliders", () => {
  const source = readFileSync(new URL("../public/assets/legacy/js/main.js", import.meta.url), "utf8");
  const widgets = new Map([
    [".team-slider", { initialized: true, managed: false }],
    [".gallery-slider", { initialized: false, managed: true }],
    [".review-slider", { initialized: false, managed: false }],
  ]);
  const jQuery = (target: unknown) => {
    let widget = typeof target === "string" ? widgets.get(target) : undefined;
    const chain: object = new Proxy({}, {
      get(_object, property) {
        if (property === "length") return widget ? 1 : 0;
        if (property === "width") return () => 1280;
        if (property === "not") return () => {
          if (widget?.initialized || widget?.managed) widget = undefined;
          return chain;
        };
        if (property === "slick") return () => {
          if (widget) {
            assert.equal(widget.initialized, false, "Slick must not run twice");
            assert.equal(widget.managed, false, "React owns this slider's lifecycle");
            widget.initialized = true;
          }
          return chain;
        };
        return () => chain;
      },
    });
    return chain;
  };
  runInNewContext(source, { window: { hotuxJQuery: jQuery }, document: {} });
  assert.equal(widgets.get(".review-slider")?.initialized, true);
  assert.equal(widgets.get(".gallery-slider")?.initialized, false);
});
