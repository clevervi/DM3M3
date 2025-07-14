# SPA Events Template

A Single Page Application (SPA) template for managing events and venues with user authentication and role-based access control.

## Features

- **User Authentication**: Secure login and registration with password hashing
- **Role-Based Access Control**:
  - Organizer: Create/edit/delete events and venues
  - Attendee: View and register for events
- **Event Management**: Full CRUD operations for events
- **Venue Management**: Create and manage venues
- **Client-Side Routing**: Smooth navigation without page reloads
- **Responsive Design**: Works on various screen sizes

## Project Structure

```bash
.
├── assets
│   ├── image.png
│   └── README.md
├── db.json
├── package.json
├── package-lock.json
├── public
│   ├── index.html
│   ├── js
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── router.js
│   │   └── views.js
│   └── styles.css
└── README.md
```

## Key Files

| File | Description |
|------|-------------|
| `db.json` | Mock database for JSON Server |
| `public/js/api.js` | Handles API communication |
| `public/js/auth.js` | Manages user authentication |
| `public/js/router.js` | Client-side routing implementation |
| `public/js/views.js` | UI rendering functions |
| `public/styles.css` | Application styling |

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone [<your-repository-url>](https://github.com/clevervi/DM3M3)
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the JSON Server (in a separate terminal):
   ```bash
   npm run start:api
   # o
   npx json-server --watch db.json --port 3000
   ```

4. Open the application:
   - Open `public/index.html` in your browser
   - Or use a local server like Live Server (VS Code extension)

## Usage

### Default Users
**Organizer**:
- Email: organizer@example.com
- Password: admin

**Attendee**:
- Email: attendee@example.com
- Password: attendee

### Functionality
- **Organizers** can:
  - Create/edit/delete events
  - Manage venues
- **Attendees** can:
  - Browse events
  - Register/unregister for events

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- JSON Server (for mock API)
