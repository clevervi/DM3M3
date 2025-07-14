// === SPA EVENTS TEMPLATE ===
// Instructions: Implement authentication logic here.
// You can use localStorage to store the logged-in user.
// Use the API (api.js) to query and register users.

import { api } from './api.js';

/**
 * Hashes a password using SHA-256.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password as a hexadecimal string.
 */
async function hashPassword(password) {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(password);
  // Generate the hash using SHA-256 algorithm
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Convert the ArrayBuffer to an array of bytes
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convert each byte to its hexadecimal representation
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashedPassword;
}

export const auth = {
  /**
   * Attempts to log in with the provided credentials.
   * @param {string} email - The user's email.
   * @param {string} pass - The user's password.
   * @throws {Error} If the credentials are invalid or there is an API error.
   */
  login: async (email, pass) => {
    try {
      // Fetch users by email from the API
      const users = await api.get(`/users?email=${email}`);
      // If no user is found with the given email, throw an error
      if (users.length === 0) {
        throw new Error('Invalid credentials');
      }
      const user = users[0]; // Get the first (and hopefully only) user

      // Hash the provided password input for comparison
      const hashedPasswordInput = await hashPassword(pass);

      // Compare the hashed input password with the stored hashed password
      if (user.password !== hashedPasswordInput) {
        throw new Error('Invalid credentials');
      }

      // Store the authenticated user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error for the UI to handle
    }
  },

  /**
   * Registers a new user in the application.
   * Assigns the 'attendee' role by default.
   * @param {string} name - The new user's name.
   * @param {string} email - The new user's email (must be unique).
   * @param {string} pass - The new user's password.
   * @returns {Promise<void>} A promise that resolves when the user is registered.
   * @throws {Error} If the email already exists or there's an API error.
   */
  register: async (name, email, pass) => {
    try {
      // Check if a user with the provided email already exists
      const existingUsers = await api.get(`/users?email=${email}`);
      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash the new user's password
      const hashedPassword = await hashPassword(pass);

      // Fetch all users to determine the next available ID
      const allUsers = await api.get('/users');
      // Calculate the next ID. If there are no users, start from 1, otherwise max ID + 1
      const nextId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;

      // Default role for new registrations is now 'attendee'
      const newUser = { id: nextId, name, email, password: hashedPassword, role: 'attendee' }; // Assign numeric ID here
      // Post the new user data to the API
      await api.post('/users', newUser);
      // Automatically log in the new user after successful registration
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw the error for the UI to handle
    }
  },

  /**
   * Logs out the current user.
   * Removes the user from localStorage and redirects to the login page.
   */
  logout: () => {
    localStorage.removeItem('user'); // Remove user data from local storage
    location.hash = '#/login'; // Redirect to the login page
  },

  /**
   * Checks if there is an authenticated user.
   * @returns {boolean} True if there is a user saved in localStorage, false otherwise.
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('user'); // Returns true if 'user' item exists and is not empty
  },

  /**
   * Returns the currently logged-in user object.
   * @returns {object|null} The user object if authenticated, otherwise null.
   */
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Parse and return the user object, or null if not found
  }
};