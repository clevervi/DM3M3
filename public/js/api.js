// === SPA EVENTS TEMPLATE ===
// Instructions: Implement API communication functions here.
// You can use fetch for HTTP requests (GET, POST, PUT, DELETE).
// Change the base URL if your API is on a different port or path.

export const api = {
  base: 'http://localhost:3000', // Base URL for your REST API. Ensure JSON Server is running on this port.

  /**
   * Performs a GET request to the API.
   * @param {string} param - The API path or endpoint (e.g., '/users', '/events/1').
   * @returns {Promise<any>} The data obtained from the API.
   * @throws {Error} If the network response is not successful.
   */
  get: async param => {
    try {
      // Send a GET request to the specified endpoint
      const response = await fetch(`${api.base}${param}`);
      // Check if the network response was successful (status code 200-299)
      if (!response.ok) {
        // Throw an error if the response is not successful
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      // Parse the response as JSON and return it
      return await response.json();
    } catch (error) {
      // Catch and log any errors during the GET request
      console.error('Error in GET request:', error);
      // Re-throw the error so it can be handled by the calling code
      throw error;
    }
  },

  /**
   * Performs a POST request to the API to create a new resource.
   * @param {string} param - The API path or endpoint (e.g., '/users', '/events').
   * @param {object} data - The data to send in the request body.
   * @returns {Promise<any>} The data of the created resource.
   * @throws {Error} If the network response is not successful.
   */
  post: async (param, data) => {
    try {
      // Send a POST request with the provided data
      const response = await fetch(`${api.base}${param}`, {
        method: 'POST', // HTTP method POST
        headers: {
          'Content-Type': 'application/json' // Indicate that the request body is JSON
        },
        body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
      });
      // Check if the network response was successful
      if (!response.ok) {
        throw new Error(`Error creating data: ${response.statusText}`);
      }
      // Parse the response as JSON and return it
      return await response.json();
    } catch (error) {
      // Catch and log any errors during the POST request
      console.error('Error in POST request:', error);
      throw error;
    }
  },

  /**
   * Performs a PUT request to the API to update an existing resource.
   * @param {string} param - The API path or endpoint with the resource ID (e.g., '/events/1').
   * @param {object} data - The updated data to send in the request body.
   * @returns {Promise<any>} The data of the updated resource.
   * @throws {Error} If the network response is not successful.
   */
  put: async (param, data) => {
    try {
      // Send a PUT request with the provided data
      const response = await fetch(`${api.base}${param}`, {
        method: 'PUT', // HTTP method PUT
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      // Check if the network response was successful
      if (!response.ok) {
        throw new Error(`Error updating data: ${response.statusText}`);
      }
      // Parse the response as JSON and return it
      return await response.json();
    } catch (error) {
      // Catch and log any errors during the PUT request
      console.error('Error in PUT request:', error);
      throw error;
    }
  },

  /**
   * Performs a DELETE request to the API to remove a resource.
   * @param {string} param - The API path or endpoint with the resource ID (e.g., '/events/1').
   * @returns {Promise<any>} The API response (usually an empty object or success message).
   * @throws {Error} If the network response is not successful.
   */
  del: async param => {
    try {
      // Send a DELETE request to the specified endpoint
      const response = await fetch(`${api.base}${param}`, {
        method: 'DELETE' // HTTP method DELETE
      });
      // Check if the network response was successful
      if (!response.ok) {
        throw new Error(`Error deleting data: ${response.statusText}`);
      }
      // Parse the response as JSON and return it
      return await response.json();
    } catch (error) {
      // Catch and log any errors during the DELETE request
      console.error('Error in DELETE request:', error);
      throw error;
    }
  },
};