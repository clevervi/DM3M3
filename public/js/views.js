// === SPA EVENTS TEMPLATE ===
// Instructions: Implement view rendering functions here.
// Use the DOM to display forms, lists, and messages according to the active route.
// Use the api.js module to fetch and send data.
// Use the auth.js module for authentication and user roles.

import { api } from './api.js';
import { auth } from './auth.js';
import { router } from './router.js';

// Get the main application container element
const appContainer = document.getElementById('app');

/**
 * Helper function to handle navigation through internal links.
 * Prevents full page reload.
 * @param {string} hash - The URL hash to navigate to (e.g., '#/dashboard').
 */
function navigateTo(hash) {
  location.hash = hash; // Set the URL hash
  router(); // Manually call the router to handle the new hash
}

/**
 * Displays a temporary message in a specific element.
 * @param {HTMLElement} messageElement - The element where the message will be displayed.
 * @param {string} message - The text content of the message.
 * @param {string} type - The type of message ('success' or 'alert').
 */
function showMessage(messageElement, message, type) {
  messageElement.textContent = message; // Set message text
  messageElement.className = `message ${type}`; // Apply CSS classes for styling
  messageElement.style.display = 'block'; // Make the message element visible
}

/**
 * Hides a temporary message in a specific element.
 * @param {HTMLElement} messageElement - The message element to hide.
 */
function hideMessage(messageElement) {
  messageElement.style.display = 'none'; // Hide the message element
}


/**
 * Validates an input field, trimming leading/trailing whitespace.
 * Displays an error message if the field is empty after trimming.
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement - The input element to validate.
 * @param {HTMLElement} messageElement - The element to display the error message.
 * @param {string} fieldName - The name of the field for the error message.
 * @returns {boolean} True if the field is valid (not empty after trimming), false otherwise.
 */
function validateInput(inputElement, messageElement, fieldName) {
  inputElement.value = inputElement.value.trim(); // Trim whitespace
  if (inputElement.value === '') {
    showMessage(messageElement, `The "${fieldName}" field cannot be empty or contain only spaces.`, 'alert');
    return false; // Validation failed
  }
  return true; // Validation passed
}

/**
 * Displays the 404 Not Found page.
 */
export function renderNotFound() {
  appContainer.innerHTML = `
    <div class="container card">
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button id="dashboard-btn-notfound">Go to Dashboard</button>
    </div>
  `;
  // Add event listener to the button to navigate to the dashboard
  document.getElementById('dashboard-btn-notfound').onclick = () => navigateTo('#/dashboard');
}

/**
 * Displays the login view.
 * Allows the user to log in with their credentials.
 */
export async function showLogin() {
  appContainer.innerHTML = `
    <div class="login-container">
      <div class="card">
        <h2>Login</h2>
        <form id="login-form">
          <div class="input-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="input-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Enter</button>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a></p>
        <div id="login-message" class="message" style="display:none;"></div>
      </div>
    </div>
  `;

  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');

  // Add event listener for form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    hideMessage(loginMessage); // Hide any previous messages
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.login(email, password); // Attempt to log in
      showMessage(loginMessage, 'Login successful. Redirecting...', 'success');
      navigateTo('#/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      showMessage(loginMessage, error.message, 'alert'); // Display error message
    }
  });
}

/**
 * Displays the registration view.
 * Allows new users to create an account.
 */
export async function showRegister() {
  appContainer.innerHTML = `
    <div class="register-container">
      <div class="card">
        <h2>Register</h2>
        <form id="register-form">
          <div class="input-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="input-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="input-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#/login">Login here</a></p>
        <div id="register-message" class="message" style="display:none;"></div>
      </div>
    </div>
  `;

  const registerForm = document.getElementById('register-form');
  const registerMessage = document.getElementById('register-message');

  // Add event listener for form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    hideMessage(registerMessage); // Hide any previous messages
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.register(name, email, password); // Attempt to register
      showMessage(registerMessage, 'Registration successful. Redirecting to login...', 'success');
      navigateTo('#/login'); // Redirect to login on success
    } catch (error) {
      showMessage(registerMessage, error.message, 'alert'); // Display error message
    }
  });
}

/**
 * Displays the main dashboard, with options based on the user's role.
 */
export function showDashboard() {
  const user = auth.getUser(); // Get the current authenticated user
  if (!user) {
    navigateTo('#/login'); // Redirect if no authenticated user
    return;
  }

  // Construct dashboard content based on user role
  let dashboardContent = `
    <div class="dashboard-container">
      <div class="card">
        <h2>Welcome, ${user.name} (${user.role})</h2>
        <nav class="dashboard-nav">
          <ul>
            <li><button id="nav-events-btn">View Events</button></li>
  `;

  // Add organizer-specific options
  if (user.role === 'organizer') {
    dashboardContent += `
            <li><button id="nav-create-event-btn">Create New Event</button></li>
            <li><button id="nav-venues-btn">Manage Venues</button></li>
            <li><button id="nav-create-venue-btn">Create New Venue</button></li>
    `;
  }

  dashboardContent += `
            <li><button id="logout-btn" class="logout-button">Logout</button></li>
          </ul>
        </nav>
      </div>
    </div>
  `;

  appContainer.innerHTML = dashboardContent; // Render the dashboard content

  // Add event listeners for navigation buttons
  document.getElementById('nav-events-btn').onclick = () => navigateTo('#/dashboard/events');
  if (user.role === 'organizer') {
    document.getElementById('nav-create-event-btn').onclick = () => navigateTo('#/dashboard/events/create');
    document.getElementById('nav-venues-btn').onclick = () => navigateTo('#/dashboard/venues');
    document.getElementById('nav-create-venue-btn').onclick = () => navigateTo('#/dashboard/venues/create');
  }
  document.getElementById('logout-btn').onclick = () => {
    auth.logout(); // Log out the user
    navigateTo('#/login'); // Redirect to login page
  };
}

/**
 * Displays the list of events.
 * Allows organizers to create, edit, and delete events,
 * and attendees to view details and register.
 */
export async function showEvents() {
  const user = auth.getUser(); // Get the current authenticated user
  if (!user) {
    navigateTo('#/login'); // Redirect if no authenticated user
    return;
  }

  let eventsContent = `
    <div class="container card">
      <h2>Available Events</h2>
      <div id="events-list"></div>
      <button id="back-to-dashboard-btn" class="back-button">Back to Dashboard</button>
      <div id="events-message" class="message" style="display:none;"></div>
    </div>
  `;
  appContainer.innerHTML = eventsContent; // Render the events view

  const eventsList = document.getElementById('events-list');
  const eventsMessage = document.getElementById('events-message');

  try {
    const events = await api.get('/events'); // Fetch all events
    const venues = await api.get('/venues'); // Fetch venues to display their names

    if (events.length === 0) {
      eventsList.innerHTML = '<p>No events available. Create one!</p>';
      // Set click handler for back button even if no events
      return document.getElementById('back-to-dashboard-btn').onclick = () => navigateTo('#/dashboard');;
    };

    // Generate HTML for the list of events
    eventsList.innerHTML = `
      <ul class="item-list">
        ${events.map(event => {
      // Find the venue associated with the event
      const venue = venues.find(v => v.id === event.venueId);
      const venueName = venue ? venue.name : 'Unknown'; // Display venue name or 'Unknown'

      return `
            <li>
              <h3>${event.title}</h3>
              <p><strong>Description:</strong> ${event.description}</p>
              <p><strong>Date:</strong> ${event.date} <strong>Time:</strong> ${event.time}</p>
              <p><strong>Venue:</strong> ${venueName}</p>
              <p><strong>Capacity:</strong> ${event.capacity}</p>
              <p><strong>Attendees:</strong> ${event.attendees ? event.attendees.length : 0}</p>
              <div class="item-actions">
                <button class="view-details-btn" data-id="${event.id}">View Details</button>
                ${user.role === 'organizer' ? `
                  <button class="edit-event-btn" data-id="${event.id}">Edit</button>
                  <button class="delete-event-btn" data-id="${event.id}">Delete</button>
                ` : ''}
              </div>
            </li>
          `;
    }).join('')}
      </ul>
    `;

    // Add event listener for the back to dashboard button
    document.getElementById('back-to-dashboard-btn').onclick = () => navigateTo('#/dashboard');

    // Add event listeners for 'View Details' buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
      button.onclick = (e) => navigateTo(`#/dashboard/events/${e.target.dataset.id}`);
    });

    // Add organizer-specific event listeners
    if (user.role === 'organizer') {
      document.querySelectorAll('.edit-event-btn').forEach(button => {
        button.onclick = (e) => navigateTo(`#/dashboard/events/edit/${e.target.dataset.id}`);
      });

      document.querySelectorAll('.delete-event-btn').forEach(button => {
        button.onclick = async (e) => {
          if (confirm('Are you sure you want to delete this event?')) {
            hideMessage(eventsMessage); // Hide previous messages
            try {
              await api.del('/events/' + e.target.dataset.id); // Delete the event via API
              showMessage(eventsMessage, 'Event deleted successfully!', 'success');
              showEvents(); // Reload the event list
            } catch (err) {
              console.error('Error deleting event:', err);
              showMessage(eventsMessage, 'There was an error deleting the event.', 'alert');
            }
          }
        };
      });
    }

  } catch (error) {
    console.error('Error loading events:', error);
    eventsList.innerHTML = '<p>Error loading events.</p>';
    showMessage(eventsMessage, 'Could not load events. Please try again later.', 'alert');
  }
}

/**
 * Displays the form to create a new event.
 */
export async function showCreateEvent() {
  const user = auth.getUser();
  // Redirect if user is not authenticated or not an organizer
  if (!user || user.role !== 'organizer') {
    navigateTo('#/dashboard');
    return;
  }

  let venues = [];
  try {
    venues = await api.get('/venues'); // Fetch available venues for the dropdown
  } catch (error) {
    console.error('Error loading venues:', error);
    // You can handle the error by displaying a message to the user or preventing event creation
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Create New Event</h2>
      <form id="create-event-form">
        <div class="input-group">
          <label for="title">Title:</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div class="input-group">
          <label for="description">Description:</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <div class="input-group">
          <label for="date">Date:</label>
          <input type="date" id="date" name="date" required>
        </div>
        <div class="input-group">
          <label for="time">Time:</label>
          <input type="time" id="time" name="time" required>
        </div>
        <div class="input-group">
          <label for="venueId">Venue:</label>
          <select id="venueId" name="venueId" required>
            <option value="">Select a venue</option>
            ${venues.map(venue => `<option value="${venue.id}">${venue.name}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label for="capacity">Capacity:</label>
          <input type="number" id="capacity" name="capacity" min="1" required>
        </div>
        <button type="submit">Create Event</button>
      </form>
      <button id="cancel-create-event-btn" class="back-button">Cancel</button>
      <div id="create-event-message" class="message" style="display:none;"></div>
    </div>
  `;

  const createEventForm = document.getElementById('create-event-form');
  const createEventMessage = document.getElementById('create-event-message');

  // Add event listener for form submission
  createEventForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    hideMessage(createEventMessage); // Hide previous messages

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    // Validate inputs
    if (!validateInput(titleInput, createEventMessage, 'Title') ||
      !validateInput(descriptionInput, createEventMessage, 'Description')) {
      return; // Stop submission if validation fails
    }

    // Create new event object from form data
    const newEvent = {
      title: titleInput.value,
      description: descriptionInput.value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      venueId: parseInt(document.getElementById('venueId').value),
      capacity: parseInt(document.getElementById('capacity').value),
      attendees: [] // Initialize attendees as an empty array
    };

    try {
      await api.post('/events', newEvent); // Send new event data to API
      showMessage(createEventMessage, 'Event created successfully!', 'success');
      navigateTo('#/dashboard/events'); // Redirect to events list
    } catch (error) {
      console.error('Error creating event:', error);
      showMessage(createEventMessage, 'There was an error creating the event.', 'alert');
    }
  });

  // Add event listener for cancel button
  document.getElementById('cancel-create-event-btn').onclick = () => navigateTo('#/dashboard');
}

/**
 * Displays the form to edit an existing event.
 */
export async function showEditEvent() {
  const user = auth.getUser();
  // Redirect if user is not authenticated or not an organizer
  if (!user || user.role !== 'organizer') {
    navigateTo('#/dashboard');
    return;
  }

  // Get event ID from the URL hash
  const eventId = location.hash.split('/').pop();
  let event = null;
  let venues = [];

  try {
    event = await api.get(`/events/${eventId}`); // Fetch event data
    venues = await api.get('/venues'); // Fetch venues for the dropdown
  } catch (error) {
    console.error('Error loading event data or venues:', error);
    appContainer.innerHTML = `<p>Error loading event or venues. ${error.message}</p>`;
    return;
  }

  // If event not found, display a message
  if (!event) {
    appContainer.innerHTML = '<p>Event not found.</p>';
    return;
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Edit Event</h2>
      <form id="edit-event-form">
        <input type="hidden" id="event-id" value="${event.id}">
        <div class="input-group">
          <label for="edit-title">Title:</label>
          <input type="text" id="edit-title" name="title" value="${event.title}" required>
        </div>
        <div class="input-group">
          <label for="edit-description">Description:</label>
          <textarea id="edit-description" name="description" required>${event.description}</textarea>
        </div>
        <div class="input-group">
          <label for="edit-date">Date:</label>
          <input type="date" id="edit-date" name="date" value="${event.date}" required>
        </div>
        <div class="input-group">
          <label for="edit-time">Time:</label>
          <input type="time" id="edit-time" name="time" value="${event.time}" required>
        </div>
        <div class="input-group">
          <label for="edit-venueId">Venue:</label>
          <select id="edit-venueId" name="venueId" required>
            <option value="">Select a venue</option>
            ${venues.map(venue => `<option value="${venue.id}" ${venue.id === event.venueId ? 'selected' : ''}>${venue.name}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label for="edit-capacity">Capacity:</label>
          <input type="number" id="edit-capacity" name="capacity" value="${event.capacity}" min="1" required>
        </div>
        <button type="submit">Update Event</button>
      </form>
      <button id="cancel-edit-btn" class="back-button">Cancel</button>
      <div id="edit-event-message" class="message" style="display:none;"></div>
    </div>
  `;

  const editEventForm = document.getElementById('edit-event-form');
  const editEventMessage = document.getElementById('edit-event-message');

  // Add event listener for form submission
  editEventForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    hideMessage(editEventMessage); // Hide previous messages

    const titleInput = document.getElementById('edit-title');
    const descriptionInput = document.getElementById('edit-description');

    // Validate inputs
    if (!validateInput(titleInput, editEventMessage, 'Title') ||
      !validateInput(descriptionInput, editEventMessage, 'Description')) {
      return; // Stop submission if validation fails
    }

    // Create updated event object from form data
    const updatedEvent = {
      id: event.id, // Keep the original ID
      title: titleInput.value,
      description: descriptionInput.value,
      date: document.getElementById('edit-date').value,
      time: document.getElementById('edit-time').value,
      venueId: parseInt(document.getElementById('edit-venueId').value),
      capacity: parseInt(document.getElementById('edit-capacity').value),
      attendees: event.attendees // Preserve existing attendees
    };

    try {
      await api.put(`/events/${event.id}`, updatedEvent); // Send updated event data to API
      showMessage(editEventMessage, 'Event updated successfully!', 'success');
      navigateTo('#/dashboard/events'); // Redirect to events list
    } catch (error) {
      console.error('Error updating event:', error);
      showMessage(editEventMessage, 'There was an error updating the event.', 'alert');
    }
  });

  // Add event listener for cancel button
  document.getElementById('cancel-edit-btn').onclick = () => navigateTo('#/dashboard/events');
}

/**
 * Displays the details of a specific event.
 */
export async function showEventDetails() {
  const user = auth.getUser();
  if (!user) {
    navigateTo('#/login');
    return;
  }

  // Get event ID from the URL hash
  const eventId = location.hash.split('/').pop();
  let event = null;
  let venue = null;

  try {
    event = await api.get(`/events/${eventId}`); // Fetch event details
    if (event && event.venueId) {
      venue = await api.get(`/venues/${event.venueId}`); // Fetch venue details if available
    }
  } catch (error) {
    console.error('Error loading event details:', error);
    appContainer.innerHTML = `<p>Error loading event details. ${error.message}</p>`;
    return;
  }

  // If event not found, display a message
  if (!event) {
    appContainer.innerHTML = '<p>Event not found.</p>';
    return;
  }

  const venueName = venue ? venue.name : 'Unknown';
  const venueLocation = venue ? venue.location : 'N/A';
  const attendeesCount = event.attendees ? event.attendees.length : 0;
  const isUserRegistered = event.attendees && event.attendees.includes(user.id);
  const isOrganizer = user.role === 'organizer';

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Event Details: ${event.title}</h2>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Date:</strong> ${event.date} <strong>Time:</strong> ${event.time}</p>
      <p><strong>Venue:</strong> ${venueName} (${venueLocation})</p>
      <p><strong>Capacity:</strong> ${event.capacity}</p>
      <p><strong>Attendees:</strong> <span id="attendees-count">${attendeesCount}</span></p>

      <div class="event-actions">
        ${!isOrganizer ? `
          <button id="register-event-btn" class="${isUserRegistered ? 'button-disabled' : ''}" ${isUserRegistered ? 'disabled' : ''}>
            ${isUserRegistered ? 'Registered' : 'Register'}
          </button>
          <button id="unregister-event-btn" class="${!isUserRegistered ? 'button-disabled' : ''}" ${!isUserRegistered ? 'disabled' : ''}>
            Unregister
          </button>
        ` : ''}
        ${isOrganizer ? `
          <button id="edit-event-details-btn">Edit Event</button>
          <button id="delete-event-details-btn" class="delete-button">Delete Event</button>
        ` : ''}
      </div>
      <button id="back-to-events-btn" class="back-button">Back to Events</button>
      <div id="event-details-message" class="message" style="display:none;"></div>
    </div>
  `;

  const eventDetailsMessage = document.getElementById('event-details-message');
  const attendeesCountSpan = document.getElementById('attendees-count');

  // Add event listener for back button
  document.getElementById('back-to-events-btn').onclick = () => navigateTo('#/dashboard/events');

  if (!isOrganizer) {
    const registerBtn = document.getElementById('register-event-btn');
    const unregisterBtn = document.getElementById('unregister-event-btn');

    // Handle event registration
    registerBtn.onclick = async () => {
      if (attendeesCount >= event.capacity) {
        showMessage(eventDetailsMessage, 'Event is full!', 'alert');
        return;
      }
      hideMessage(eventDetailsMessage);
      try {
        // Add user ID to attendees array
        const updatedAttendees = [...(event.attendees || []), user.id];
        await api.put(`/events/${event.id}`, { ...event, attendees: updatedAttendees });
        showMessage(eventDetailsMessage, 'Successfully registered for the event!', 'success');
        event.attendees = updatedAttendees; // Update local event object
        attendeesCountSpan.textContent = updatedAttendees.length; // Update displayed count
        registerBtn.disabled = true;
        registerBtn.classList.add('button-disabled');
        unregisterBtn.disabled = false;
        unregisterBtn.classList.remove('button-disabled');
      } catch (error) {
        console.error('Error registering for event:', error);
        showMessage(eventDetailsMessage, 'Error registering for the event.', 'alert');
      }
    };

    // Handle event unregistration
    unregisterBtn.onclick = async () => {
      hideMessage(eventDetailsMessage);
      try {
        // Remove user ID from attendees array
        const updatedAttendees = (event.attendees || []).filter(id => id !== user.id);
        await api.put(`/events/${event.id}`, { ...event, attendees: updatedAttendees });
        showMessage(eventDetailsMessage, 'Successfully unregistered from the event!', 'success');
        event.attendees = updatedAttendees; // Update local event object
        attendeesCountSpan.textContent = updatedAttendees.length; // Update displayed count
        unregisterBtn.disabled = true;
        unregisterBtn.classList.add('button-disabled');
        registerBtn.disabled = false;
        registerBtn.classList.remove('button-disabled');
      } catch (error) {
        console.error('Error unregistering from event:', error);
        showMessage(eventDetailsMessage, 'Error unregistering from the event.', 'alert');
      }
    };
  } else { // Organizer specific actions
    document.getElementById('edit-event-details-btn').onclick = () => navigateTo(`#/dashboard/events/edit/${eventId}`);
    document.getElementById('delete-event-details-btn').onclick = async () => {
      if (confirm('Are you sure you want to delete this event?')) {
        hideMessage(eventDetailsMessage);
        try {
          await api.del(`/events/${eventId}`);
          showMessage(eventDetailsMessage, 'Event deleted successfully!', 'success');
          navigateTo('#/dashboard/events'); // Redirect to events list after deletion
        } catch (error) {
          console.error('Error deleting event:', error);
          showMessage(eventDetailsMessage, 'Error deleting the event.', 'alert');
        }
      }
    };
  }
}

/**
 * Displays the list of venues.
 * Allows organizers to create, edit, and delete venues.
 */
export async function showVenues() {
  const user = auth.getUser();
  if (!user || user.role !== 'organizer') {
    navigateTo('#/dashboard');
    return;
  }

  let venuesContent = `
    <div class="container card">
      <h2>Available Venues</h2>
      <div id="venues-list"></div>
      <button id="back-to-dashboard-btn" class="back-button">Back to Dashboard</button>
      <div id="venues-message" class="message" style="display:none;"></div>
    </div>
  `;
  appContainer.innerHTML = venuesContent;

  const venuesList = document.getElementById('venues-list');
  const venuesMessage = document.getElementById('venues-message');

  try {
    const venues = await api.get('/venues'); // Fetch all venues

    if (venues.length === 0) {
      venuesList.innerHTML = '<p>No venues available. Create one!</p>';
      return document.getElementById('back-to-dashboard-btn').onclick = () => navigateTo('#/dashboard');;
    }

    venuesList.innerHTML = `
      <ul class="item-list">
        ${venues.map(venue => `
            <li>
              <h3>${venue.name}</h3>
              <p><strong>Location:</strong> ${venue.location}</p>
              <p><strong>Capacity:</strong> ${venue.capacity}</p>
              <div class="item-actions">
                <button class="edit-venue-btn" data-id="${venue.id}">Edit</button>
                <button class="delete-venue-btn" data-id="${venue.id}">Delete</button>
              </div>
            </li>
          `).join('')}
      </ul>
    `;

    document.getElementById('back-to-dashboard-btn').onclick = () => navigateTo('#/dashboard');

    document.querySelectorAll('.edit-venue-btn').forEach(button => {
      button.onclick = (e) => navigateTo(`#/dashboard/venues/edit/${e.target.dataset.id}`);
    });

    document.querySelectorAll('.delete-venue-btn').forEach(button => {
      button.onclick = async (e) => {
        if (confirm('Are you sure you want to delete this venue?')) {
          hideMessage(venuesMessage);
          try {
            await api.del('/venues/' + e.target.dataset.id);
            showMessage(venuesMessage, 'Venue deleted successfully!', 'success');
            showVenues(); // Reload the venues list
          } catch (err) {
            console.error('Error deleting venue:', err);
            showMessage(venuesMessage, 'There was an error deleting the venue.', 'alert');
          }
        }
      };
    });

  } catch (error) {
    console.error('Error loading venues:', error);
    venuesList.innerHTML = '<p>Error loading venues.</p>';
    showMessage(venuesMessage, 'Could not load venues. Please try again later.', 'alert');
  }
}

/**
 * Displays the form to create a new venue.
 */
export async function showCreateVenue() {
  const user = auth.getUser();
  if (!user || user.role !== 'organizer') {
    navigateTo('#/dashboard');
    return;
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Create New Venue</h2>
      <form id="create-venue-form">
        <div class="input-group">
          <label for="name">Venue Name:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="input-group">
          <label for="location">Location:</label>
          <input type="text" id="location" name="location" required>
        </div>
        <div class="input-group">
          <label for="capacity">Capacity:</label>
          <input type="number" id="capacity" name="capacity" min="1" required>
        </div>
        <button type="submit">Create Venue</button>
      </form>
      <button id="cancel-venue-btn" class="back-button">Cancel</button>
      <div id="create-venue-message" class="message" style="display:none;"></div>
    </div>
  `;

  const createVenueForm = document.getElementById('create-venue-form');
  const createVenueMessage = document.getElementById('create-venue-message');

  createVenueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(createVenueMessage);

    const nameInput = document.getElementById('name');
    const locationInput = document.getElementById('location');

    if (!validateInput(nameInput, createVenueMessage, 'Venue Name') ||
      !validateInput(locationInput, createVenueMessage, 'Location')) {
      return;
    }

    const newVenue = {
      name: nameInput.value,
      location: locationInput.value,
      capacity: parseInt(document.getElementById('capacity').value)
    };

    try {
      await api.post('/venues', newVenue);
      showMessage(createVenueMessage, 'Venue created successfully!', 'success');
      navigateTo('#/dashboard/venues');
    } catch (error) {
      console.error('Error creating venue:', error);
      showMessage(createVenueMessage, 'There was an error creating the venue.', 'alert');
    }
  });

  document.getElementById('cancel-venue-btn').onclick = () => navigateTo('#/dashboard/venues');
}

/**
 * Displays the form to edit an existing venue.
 */
export async function showEditVenue() {
  const user = auth.getUser();
  if (!user || user.role !== 'organizer') {
    navigateTo('#/dashboard');
    return;
  }

  const venueId = location.hash.split('/').pop();
  let venue = null;

  try {
    venue = await api.get(`/venues/${venueId}`);
  } catch (error) {
    console.error('Error loading venue data:', error);
    appContainer.innerHTML = `<p>Error loading venue. ${error.message}</p>`;
    return;
  }

  if (!venue) {
    appContainer.innerHTML = '<p>Venue not found.</p>';
    return;
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Edit Venue</h2>
      <form id="edit-venue-form">
        <input type="hidden" id="venue-id" value="${venue.id}">
        <div class="input-group">
          <label for="edit-name">Venue Name:</label>
          <input type="text" id="edit-name" name="name" value="${venue.name}" required>
        </div>
        <div class="input-group">
          <label for="edit-location">Location:</label>
          <input type="text" id="edit-location" name="location" value="${venue.location}" required>
        </div>
        <div class="input-group">
          <label for="edit-capacity">Capacity:</label>
          <input type="number" id="edit-capacity" name="capacity" value="${venue.capacity}" min="1" required>
        </div>
        <button type="submit">Update Venue</button>
      </form>
      <button id="cancel-edit-venue-btn" class="back-button">Cancel</button>
      <div id="edit-venue-message" class="message" style="display:none;"></div>
    </div>
  `;

  const editVenueForm = document.getElementById('edit-venue-form');
  const editVenueMessage = document.getElementById('edit-venue-message');
  const cancelEditVenueBtn = document.getElementById('cancel-edit-venue-btn');

  editVenueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage(editVenueMessage);

    const nameInput = document.getElementById('edit-name');
    const locationInput = document.getElementById('edit-location');

    if (!validateInput(nameInput, editVenueMessage, 'Venue Name') ||
      !validateInput(locationInput, editVenueMessage, 'Location')) {
      return;
    }

    const updatedVenue = {
      id: venue.id,
      name: nameInput.value,
      location: locationInput.value,
      capacity: parseInt(document.getElementById('edit-capacity').value)
    };

    try {
      await api.put(`/venues/${venue.id}`, updatedVenue);
      showMessage(editVenueMessage, 'Venue updated successfully!', 'success');
      navigateTo('#/dashboard/venues');
    } catch (error) {
      console.error('Error updating venue:', error);
      showMessage(editVenueMessage, 'There was an error updating the venue.', 'alert');
    }
  });

  cancelEditVenueBtn.addEventListener('click', () => {
    navigateTo('#/dashboard/venues');
  });
}