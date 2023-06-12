import {
  registerBookmarkApi,
  registerServiceWorkerController,
} from "censorship-resilience-helpers";

try {
  const serviceWorkerController = registerServiceWorkerController();
  registerBookmarkApi({ serviceWorkerController });
} catch (error) {
  console.log("error", error);
}

console.log("bleh");
