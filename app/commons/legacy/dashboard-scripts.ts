import { enqueueVendorScripts, loadVendorScript } from "./vendor-scripts";

type DashboardJQuery = { fn?: { jquery?: string } };
type DashboardWindow = Window & {
  jQuery?: DashboardJQuery;
  $?: DashboardJQuery;
  hotuxDashboardJQuery?: DashboardJQuery;
};

const coreSource = "/assets/dashboard/vendors/core/core.js";
const sources = [
  "/assets/dashboard/vendors/apexcharts/apexcharts.min.js",
  "/assets/dashboard/js/dashboard-light.js",
] as const;

export function loadDashboardScripts() {
  return enqueueVendorScripts(async () => {
    const dashboardWindow = window as DashboardWindow;
    const previousJQuery = dashboardWindow.jQuery;
    const previousDollar = dashboardWindow.$;
    let jQuery = dashboardWindow.hotuxDashboardJQuery;
    try {
      if (!jQuery) {
        const existing = document.querySelector(`script[src="${coreSource}"]`);
        const stale =
          !!existing &&
          existing.getAttribute("data-hotux-load-state") !== "loading";
        await loadVendorScript(coreSource, stale);
        jQuery = dashboardWindow.jQuery;
        if (!jQuery?.fn)
          throw new Error("Không thể khởi tạo jQuery của Dashboard");
        dashboardWindow.hotuxDashboardJQuery = jQuery;
      }
      dashboardWindow.jQuery = previousJQuery ?? jQuery;
      dashboardWindow.$ = previousDollar ?? jQuery;
      for (const source of sources) await loadVendorScript(source);
    } finally {
      dashboardWindow.jQuery = previousJQuery ?? jQuery;
      dashboardWindow.$ = previousDollar ?? jQuery;
    }
  });
}
