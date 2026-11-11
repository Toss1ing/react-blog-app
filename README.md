# Blog React App

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- json-server

### 1. Install dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Start JSON Server

The application uses JSON Server as a mock backend.

Open a terminal and run:

```bash
cd data
json-server db.json
```

The REST API will be available at:

`http://localhost:3000`

### 4. Start the application

Open another terminal in the project directory and run:

```bash
npm run dev
```

Vite will start the development server.

Open the URL displayed in your terminal, usually:

`http://localhost:5173`

**Note:** Both JSON Server and the Vite development server must be running for the application to work correctly.
