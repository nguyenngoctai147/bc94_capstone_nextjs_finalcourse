type VendorScriptRuntime = {
  loading: Map<string, Promise<void>>;
  queue: Promise<void>;
};

type VendorWindow = Window & { hotuxVendorScripts?: VendorScriptRuntime };
const stateAttribute = "data-hotux-load-state";

function getRuntime() {
  const vendorWindow = window as VendorWindow;
  return vendorWindow.hotuxVendorScripts ??= {
    loading: new Map(),
    queue: Promise.resolve(),
  };
}

/** Keep dependency chains ordered even across route changes and Fast Refresh. */
export function enqueueVendorScripts(task: () => Promise<void>) {
  const runtime = getRuntime();
  const result = runtime.queue.then(task);
  runtime.queue = result.catch(() => undefined);
  return result;
}

export function loadVendorScript(source: string, reload = false) {
  const runtime = getRuntime();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${source}"]`);
  const state = existing?.getAttribute(stateAttribute);

  if (reload || state === "failed") {
    existing?.remove();
    runtime.loading.delete(source);
  } else {
    const pending = runtime.loading.get(source);
    if (pending) return pending;
    if (state === "loaded") return Promise.resolve();
  }

  const promise = new Promise<void>((resolve, reject) => {
    // An untracked tag is not proof that a dynamically inserted script ran.
    const reuse = !reload && state === "loading";
    const script = reuse && existing ? existing : document.createElement("script");
    if (!reuse && !reload) existing?.remove();
    const handleLoad = () => {
      script.setAttribute(stateAttribute, "loaded");
      removeListeners();
      resolve();
    };
    const handleError = () => {
      script.setAttribute(stateAttribute, "failed");
      removeListeners();
      reject(new Error(`Không thể tải ${source}`));
    };
    const removeListeners = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!reuse) {
      script.src = source;
      script.async = false;
      script.setAttribute(stateAttribute, "loading");
      document.body.appendChild(script);
    }
  });

  runtime.loading.set(source, promise);
  void promise.catch(() => {
    if (runtime.loading.get(source) === promise) runtime.loading.delete(source);
  });
  return promise;
}
