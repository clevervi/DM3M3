// === SPA EVENTS TEMPLATE ===
// Instructions: This is the entry point of the SPA.
// Here you should initialize the router and any global logic.

// Import the router module
import { router } from './router.js';

// Initialize the router when the DOM has been fully loaded.
// This ensures that all HTML elements are available before the router tries to interact with them.
window.addEventListener('DOMContentLoaded', router);

// Listen for changes in the URL hash.
// Each time the hash changes (e.g., from #/login to #/dashboard), the router runs again
// to display the view corresponding to the new URL.
window.addEventListener('hashchange', router);

// You can add global logic here if needed, for example,
// the initialization of third-party services, or global event handling.