declare module "bootstrap/dist/js/bootstrap.bundle.min.js" {
  export class Carousel {
    static getOrCreateInstance(element: Element): Carousel;
    dispose(): void;
  }

  export class Tooltip {
    static getOrCreateInstance(element: Element): Tooltip;
    dispose(): void;
  }
}
