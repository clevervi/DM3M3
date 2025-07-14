// === SPA EVENTS TEMPLATE ===
// Instructions: Implement routing and view logic by importing necessary functions from views.js and auth.js.
// You can add, modify, or remove routes as required by your application.

// Import necessary modules for routing and authentication
import { auth } from './auth.js';
import {
  showLogin,             // Function to display the login view
  showRegister,          // Function to display the registration view
  showDashboard,         // Function to display the main dashboard view (now for Organizers/Attendees)
  showEvents,            // Function to display the list of events
  showCreateEvent,       // Function to display the event creation form
  showEditEvent,         // Function to display the event editing form
  showEventDetails,      // New function to display event details
  showVenues,            // New function to display list of venues
  showCreateVenue,       // New function to create a venue
  showEditVenue,         // New function to edit a venue
  renderNotFound         // Function to display the not found page
} from './views.js';

// Define the routes for your Single Page Application (SPA)
// Each key is a URL hash and its value is the corresponding view function
const routes = {
  '#/login': showLogin,
  '#/register': showRegister,
  '#/dashboard': showDashboard,
  '#/dashboard/events': showEvents,
  '#/dashboard/events/create': showCreateEvent,
  '#/dashboard/venues': showVenues, // New route for managing venues
  '#/dashboard/venues/create': showCreateVenue // New route for creating a venue
  // Dynamic routes like '#/dashboard/events/edit/:id' and '#/dashboard/events/:id'
  // are handled directly within the router function, not in this map.
};

/**
 * Main routing function.
 * Determines which view to display based on the URL hash.
 * Also implements route protection.
 */
export function router() {
  // Get the current URL hash, default to '#/login' if no hash is present
  const path = location.hash || '#/login';
  const user = auth.getUser(); // Get the current authenticated user

  // Route protection: Redirect to login if the user is not authenticated and tries to access a dashboard route
  if (path.startsWith('#/dashboard') && !auth.isAuthenticated()) {
    location.hash = '#/login'; // Redirect to login page
    return; // Stop further execution
  }

  // Route protection: Prevent logged-in users from accessing login or register pages
  if ((path === '#/login' || path === '#/register') && auth.isAuthenticated()) {
    location.hash = '#/dashboard'; // Redirect to dashboard if already logged in
    return; // Stop further execution
  }

  // Handle dynamic routes: Route for editing an event
  if (path.startsWith('#/dashboard/events/edit/')) {
    showEditEvent(); // Show the edit event form
    return; // Stop further execution
  }

  // Handle dynamic routes: Route for viewing event details
  if (path.match(/^#\/dashboard\/events\/\d+$/)) { // Regular expression for /events/ID
    showEventDetails(); // Show event details
    return; // Stop further execution
  }

  // Handle dynamic routes: Route for editing a venue
  if (path.startsWith('#/dashboard/venues/edit/')) {
    showEditVenue(); // Show the edit venue form
    return; // Stop further execution
  }

  // Check if the current path exists in the defined routes
  const handler = routes[path];
  if (handler) {
    handler(); // Execute the corresponding view function
  } else {
    renderNotFound(); // If no route matches, display the not found page
  }
}