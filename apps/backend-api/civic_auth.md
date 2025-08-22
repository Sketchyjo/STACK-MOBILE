# Civic Auth Integration Guide

## Node.js Express Backend Setup

This guide provides step-by-step instructions for integrating Civic Auth with an Express backend. A working example is available in our [GitHub examples repository](https://github.com/civicteam/civic-auth-examples).

## Prerequisites

- Node.js and npm installed
- Express.js application
- Client ID from [auth.civic.com](https://auth.civic.com)

## Setup Instructions

### 1. Install Dependencies

Install the required packages:

```bash
npm install @civic/auth cookie-parser cors
```

### 2. Configure Your Application

#### Minimal Configuration

Create a basic configuration object:

```javascript
const config = {
  clientId: "YOUR_CLIENT_ID", // Client ID from auth.civic.com
  redirectUrl: 'https://your-backend.com/auth/callback' // change to your domain when deploying
};
```

> **Note:** All URLs must be absolute URLs.

### 3. Set up CORS (for frontend integration)

If your frontend runs on a different domain/port, configure CORS to enable cross-origin cookie sharing:

```javascript
import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend (local development)
      "http://localhost:3020", // backend (local development)
      "https://abc123.ngrok.io", // ngrok tunnel (for cross-origin testing)
      "https://your-frontend.com", // production frontend
    ],
    credentials: true, // Allow cookies to be sent cross-origin
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);
```

#### Important: HTTPS Requirements for Cross-Origin Cookies

Cross-origin cookies (different ports/domains) require HTTPS to work properly. For local development with separate frontend/backend ports, use ngrok or similar service to create HTTPS tunnels:

```bash
# Terminal 1: Start your backend
npm start

# Terminal 2: Create HTTPS tunnel to your backend
ngrok http 3020
# Use the https://abc123.ngrok.io URL as your backend URL

# Terminal 3: Create HTTPS tunnel to your frontend
ngrok http 5173
# Use the https://xyz456.ngrok.io URL as your frontend URL
```

The cookie storage automatically detects HTTPS and sets `secure: true` + `sameSite: "none"` for cross-origin compatibility. Without HTTPS, cross-origin cookies will not be saved by the browser.

### 4. Set up Cookie Storage

Civic Auth uses cookies for storing the login state by default:

```javascript
import express, { Request, Response } from "express";
import { CookieStorage, CivicAuth } from "@civic/auth/server";
import cookieParser from "cookie-parser";

app.use(cookieParser());

// Tell Civic how to get cookies from your node server
class ExpressCookieStorage extends CookieStorage {
  constructor(
    private req: Request,
    private res: Response,
  ) {
    // Detect if we're running on HTTPS (production) or HTTP (localhost)
    const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";

    super({
      secure: isHttps, // Use secure cookies for HTTPS
      sameSite: isHttps ? "none" : "lax", // none for HTTPS cross-origin, lax for localhost
      httpOnly: false, // Allow frontend JavaScript to access cookies
      path: "/", // Ensure cookies are available for all paths
    });
  }

  async get(key: string): Promise<string | null> {
    return Promise.resolve(this.req.cookies[key] ?? null);
  }

  async set(key: string, value: string): Promise<void> {
    this.res.cookie(key, value, this.settings);
    this.req.cookies[key] = value; // Store for immediate access within same request
  }

  async delete(key: string): Promise<void> {
    this.res.clearCookie(key);
  }
}

app.use((req, res, next) => {
  // Add an instance of the cookie storage and civicAuth api to each request
  req.storage = new ExpressCookieStorage(req, res);
  req.civicAuth = new CivicAuth(req.storage, config);
  next();
});
```

### 5. Create Authentication Endpoints

#### Login Endpoint

This endpoint handles login requests, builds the Civic login URL and redirects the user to it:

```javascript
app.get("/auth/login-url", async (req: Request, res: Response) => {
  const frontendState = req.query.state as string | undefined;

  const url = await req.civicAuth!.buildLoginUrl({
    state: frontendState,
  });

  res.redirect(url.toString());
});
```

#### Callback Endpoint

This endpoint handles successful logins and creates the session:

```javascript
app.get("/auth/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };

  try {
    const result = await req.civicAuth.handleCallback({
      code,
      state,
      req,
    });

    if (result.redirectTo) {
      return res.redirect(result.redirectTo);
    }

    if (result.content) {
      return res.send(result.content);
    }

    res.status(500).json({ error: "Internal server error" });
  } catch (error) {
    res.redirect("/?error=auth_failed");
  }
});
```

#### Logout Endpoint

This endpoint handles logout requests, builds the Civic logout URL and redirects the user to it:

```javascript
import { buildLogoutRedirectUrl } from "@civic/auth/server";

app.get("/auth/logout", async (req: Request, res: Response) => {
  try {
    const urlString = await req.civicAuth.buildLogoutRedirectUrl();
    await req.civicAuth.clearTokens();

    // Convert to URL object to modify parameters
    const url = new URL(urlString);
    // Remove the state parameter to avoid it showing up in the frontend URL
    url.searchParams.delete("state");

    res.redirect(url.toString());
  } catch (error) {
    console.error("Logout error:", error);
    // If logout URL generation fails, clear tokens and redirect to home
    await req.civicAuth.clearTokens();
    res.redirect("/");
  }
});
```

### 6. Add Authentication Middleware

Middleware protects routes that require login:

```javascript
import { isLoggedIn } from "@civic/auth/server";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!(await req.civicAuth.isLoggedIn())) return res.status(401).send("Unauthorized");
  next();
};

// Apply authentication middleware to any routes that need it
app.use("/admin", authMiddleware);
```

### 7. User Information Endpoint

Create an endpoint to get the logged-in user information:

```javascript
app.get("/auth/user", async (req: Request, res: Response) => {
  const user = await req.civicAuth!.getUser();
  res.json(user);
});
```

> **Note:** This endpoint is important for frontend integration as it allows your frontend application to retrieve the current user's information.

## Frontend Integration

### Vanilla JavaScript

Use the `@civic/auth/vanillajs` client with your backend:

```javascript
import { CivicAuth } from "@civic/auth/vanillajs";

// Configure client to use your backend for login URLs
const authClient = await CivicAuth.create({
  loginUrl: "https://your-backend.com/auth/login-url", // Your backend endpoint
});

// Now authentication works through your backend
const { user } = await authClient.startAuthentication();
```

### React

Use the `@civic/auth/react` components with your backend:

```javascript
import { CivicAuthProvider } from "@civic/auth/react";

const App = () => {
  return (
    <CivicAuthProvider
      loginUrl="https://your-backend.com/auth/login-url"
    >
      <Login />
    </CivicAuthProvider>
  );
}
```

### Required Backend Endpoint

Both frontend integrations require this endpoint to expose login URLs:

```javascript
app.get("/auth/login-url", async (req: Request, res: Response) => {
  const frontendState = req.query.state as string | undefined;

  const url = await req.civicAuth!.buildLoginUrl({
    state: frontendState,
  });

  res.redirect(url.toString());
});
```

## Advanced Configuration

For more advanced use cases, you can include additional optional parameters in your configuration:

```javascript
const config = {
  clientId: "YOUR_CLIENT_ID", // Client ID from auth.civic.com
  redirectUrl: 'https://your-backend.com/auth/callback', // OAuth callback URL
  postLogoutRedirectUrl: 'https://your-frontend.com/', // Where to redirect after logout (Optional)
  loginSuccessUrl: 'https://your-frontend.com/', // Optional: redirect Single Page Applications back to frontend after auth (optional)
  oauthServer: 'https://auth.civic.com/oauth' // Optional: OAuth server URL (for development/testing)
};
```

### Configuration Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `clientId` | Yes | Client ID from auth.civic.com |
| `redirectUrl` | Yes | OAuth callback URL where Civic redirects after authentication |
| `postLogoutRedirectUrl` | No | Where to redirect users after logout |
| `loginSuccessUrl` | No | Redirect Single Page Applications back to frontend after successful authentication |
| `oauthServer` | No | OAuth server URL (useful for development/testing environments) |

## Authentication Methods

### PKCE and Client Secrets

Civic Auth supports multiple OAuth 2.0 authentication methods to provide maximum security for different application architectures.

**Need client secret authentication?** Civic Auth supports:
- PKCE-only
- Client secrets
- Hybrid PKCE + client secret approaches

See our [Authentication Flows guide](https://docs.civic.com/auth-flows) for detailed comparison.

The examples above use PKCE authentication, which is handled entirely by the Civic Auth SDK and suitable for most applications.
