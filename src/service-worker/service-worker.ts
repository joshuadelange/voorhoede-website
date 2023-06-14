import {
  registerBookmarkApi,
  registerServiceWorkerController,
} from "censorship-resilience-helpers";

const serviceWorkerController = registerServiceWorkerController();
registerBookmarkApi({ serviceWorkerController });

console.log("bleh");
