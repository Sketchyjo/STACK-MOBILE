# **API Specification**

The API will be a REST API defined by the OpenAPI 3.0 standard.

## **REST API Specification**

### **Authentication**
- `POST /auth/login` - User login with wallet
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### **User Management**
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/preferences` - Get user preferences
- `PUT /users/preferences` - Update user preferences

### **Baskets & Investments**
- `GET /baskets` - List all available baskets
- `GET /baskets/:id` - Get basket details
- `POST /baskets/:id/invest` - Invest in a basket ("Power Up")
- `GET /baskets/curated` - Get community-curated baskets
- `POST /baskets` - Create a new basket (curator only)
- `PUT /baskets/:id` - Update basket (curator only)

### **Portfolio Management**
- `GET /portfolio` - Get user's portfolio
- `GET /portfolio/holdings` - Get detailed holdings
- `GET /portfolio/performance` - Get portfolio performance metrics

### **Gamification**
- `GET /quests` - Get available quests
- `GET /quests/user` - Get user's quest progress
- `POST /quests/:id/claim` - Claim quest reward
- `GET /battlepass` - Get current battle pass
- `GET /battlepass/progress` - Get user's battle pass progress
- `POST /battlepass/claim/:tier` - Claim battle pass tier reward

### **AI Expert Tips**
- `GET /tips` - Get personalized tips
- `POST /tips/:id/interaction` - Record tip interaction (shown/read/helpful)
- `GET /tips/categories` - Get tip categories

### **"For You" Feed**
- `GET /feed` - Get personalized feed items
- `POST /feed/:id/interaction` - Record feed interaction (shown/clicked/invested)

### **Automation**
- `GET /automation/schedules` - Get user's investment schedules
- `POST /automation/schedules` - Create investment schedule (payday/recurring)
- `PUT /automation/schedules/:id` - Update investment schedule
- `DELETE /automation/schedules/:id` - Delete investment schedule
- `GET /automation/roundup` - Get round-up settings
- `PUT /automation/roundup` - Update round-up settings
- `GET /automation/history` - Get auto-investment history

### **Virtual Cards**
- `GET /cards` - Get user's virtual cards
- `POST /cards` - Issue new virtual card
- `PUT /cards/:id/status` - Update card status (freeze/unfreeze)
- `GET /cards/:id/transactions` - Get card transaction history

### **Transactions**
- `GET /transactions` - Get transaction history
- `GET /transactions/:id` - Get transaction details

### **Micro-loans**
- `GET /loans` - Get user's loans
- `POST /loans/request` - Request a micro-loan
- `POST /loans/:id/repay` - Make loan repayment
- `GET /loans/eligibility` - Check loan eligibility

### **Notifications**
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read

### **Community & Curators**
- `GET /curators` - Get list of curators
- `GET /curators/:id/profile` - Get curator profile
- `POST /curators/apply` - Apply to become a curator
- `GET /curators/:id/baskets` - Get baskets by curator

```yaml
openapi: 3.0.0
info:
  title: "STACK API"
  version: "1.0.0"
  description: "API for the STACK Gen Z Web3 Investment Platform"
servers:
  - url: "/api/v1"
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
paths:
  /auth/login:
    post:
      summary: "User Login"
      description: "Authenticates a user via a signed wallet message and returns a session JWT."
  /baskets:
    get:
      summary: "List Baskets"
      description: "Retrieves a list of all available investment Baskets."
  /portfolio/invest:
    post:
      summary: "Make an Investment (Power Up)"
      description: "Invests a specified amount into a Basket for the authenticated user."
```

-----
