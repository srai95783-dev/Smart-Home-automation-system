# Online Home Automation Control Platform

A modern, full-stack, enterprise-grade Web Platform designed for college project presentation and viva evaluation. Built with **Java Spring Boot 3**, **Spring Security with JWT**, **MySQL / H2 Database**, and a responsive **React (Vite)** frontend.

---

## 🌟 Key Features

### 1. Role-Based Access Control (RBAC)
- **Administrator Role (`ROLE_ADMIN`):**
  - **User Management:** View all users, register new accounts, edit profiles, toggle active status, and assign roles.
  - **Device Compatibility Management:** Certify hardware models, approve/reject device submissions, and specify communication protocols (Wi-Fi, Zigbee, Bluetooth, Matter).
  - **System Monitoring & Metrics:** Live JVM memory consumption (heap allocated/used), server uptime, device connection counts, and health status.
  - **System Alerts & Audit Feed:** Filterable system event logs by severity (INFO, WARNING, CRITICAL).
  - **Global System Settings:** Manage temperature danger thresholds, energy rates, and device limits.

- **Homeowner Role (`ROLE_HOMEOWNER`):**
  - **Device Control Center:** View devices organized by room (Living Room, Bedroom, Kitchen, Porch, Garage); toggle power ON/OFF with animated feedback; adjust brightness or thermostat temperatures with sliders; add or delete smart home devices.
  - **Automation Rules Engine:** Create trigger-based conditional rules (*e.g., "If Temperature > 26°C -> Turn ON Living Room AC"* or *"If Time == 22:00 -> Lock Front Door"*). Enable/disable rules on demand.
  - **Environmental Telemetry:** Real-time gauges for Room Temperature (°C) and Ambient Humidity (%) paired with interactive Chart.js trend graphs.
  - **Security Center:** Monitor smart deadbolt states, arm/disarm locks, and review security intrusion history.
  - **Energy Analytics:** 7-day power usage bar charts (kWh), estimated electricity bill calculation (@$0.14/kWh), and energy optimization tips.
  - **Profile Management:** Update personal information, phone number, and change account passwords.

### 2. Built-in IoT Simulation Engine
- Runs background tasks using Spring's `@Scheduled` timer.
- Dynamically simulates room temperature (22°C–28.5°C) and humidity (40%–65%) fluctuations every 25 seconds.
- Automatically evaluates homeowner automation rules against live telemetry.
- Increments power consumption for running appliances every 60 seconds.
- **Requires zero physical IoT hardware**, making it 100% reliable for college demos and presentations.

### 3. Interactive Swagger / OpenAPI Documentation
- Fully interactive API documentation running at:  
  **`http://localhost:8080/swagger-ui/index.html`**
- Includes JWT Bearer Token authorization (`Authorize` button) to test all 24 REST endpoints directly from your browser.

---

## 🔑 Demo Login Credentials

For convenience during evaluation, the platform includes quick one-click demo login buttons on the login screen, or you can use:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@homeauto.com` | `admin123` | Full system control, user CRUD, device approval, system metrics |
| **Homeowner** | `john@homeauto.com` | `john123` | Device controls, automation rules, environmental sensors, energy logs |
| **Homeowner 2** | `sarah@homeauto.com` | `sarah123` | Secondary homeowner account |

---

## 📁 Project Architecture & Folder Structure

```text
online-home-automation/
├── backend/
│   ├── pom.xml                               # Maven dependencies (Spring Boot 3, Security, JPA, JWT, Swagger)
│   └── src/
│       ├── main/
│       │   ├── java/com/homeauto/platform/
│       │   │   ├── config/                   # OpenApiConfig, WebConfig, DataInitializer
│       │   │   ├── controllers/              # REST Controllers (Auth, Admin, Homeowner, User)
│       │   │   ├── dtos/                     # Data Transfer Objects with Jakarta Validation
│       │   │   ├── exceptions/               # GlobalExceptionHandler & custom exceptions
│       │   │   ├── models/                   # JPA Entities (User, Device, Catalog, Rule, Telemetry, Energy, Alert)
│       │   │   ├── repositories/             # Spring Data JPA Repositories
│       │   │   ├── security/                 # JwtUtils, AuthTokenFilter, SecurityConfig, UserDetails
│       │   │   ├── services/                 # AuthService, AdminService, HomeownerService
│       │   │   ├── simulation/               # SimulationService (@Scheduled IoT simulation engine)
│       │   │   └── HomeAutomationApplication.java
│       │   └── resources/
│       │       ├── application.properties    # MySQL Configuration (Default)
│       │       └── application-h2.properties # In-Memory H2 Fallback Profile
└── frontend/
    ├── package.json                          # React, Vite, Axios, Chart.js, Lucide Icons
    ├── vite.config.js                        # Vite configuration
    └── src/
        ├── api/                              # Central Axios client with JWT interceptor
        ├── components/                       # DeviceCard, Navbar, Sidebar, Modal
        ├── context/                          # AuthContext (state & session management)
        ├── pages/
        │   ├── auth/                         # Login & Register
        │   ├── admin/                        # Admin Dashboard, User Mgmt, Catalog, Alerts, Settings
        │   └── homeowner/                    # Home Dashboard, Devices, Automations, Sensors, Security, Energy, Profile
        ├── routes/                           # ProtectedRoute & AppRoutes
        ├── styles/                           # Responsive dark-theme CSS design system
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Java 17+ or 21+** (Java 27 supported)
- **Node.js (v18+) & npm**
- **MySQL Server** (or use the built-in zero-setup H2 mode)

---

### Step 1: Starting the Backend

#### Option A: Running with MySQL (Default)
1. Ensure your MySQL service is running on `localhost:3306`.
2. In `backend/src/main/resources/application.properties`, update your username/password if different from `root`/`root`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Open a terminal in the `backend/` folder and run:
   ```powershell
   mvn spring-boot:run
   ```

#### Option B: Running with Zero-Setup H2 Database (Instant Fallback)
If you don't have MySQL running or want an instant, zero-configuration start for viva evaluation:
```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```
The database will automatically initialize in memory and seed all demo data.

---

### Step 2: Starting the React Frontend

1. Open a terminal in the `frontend/` folder.
2. Install dependencies (if running for the first time):
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:  
   **`http://localhost:5173/`**

---

## 🎓 Viva Questions & Answers Guide

| Question | Answer Summary |
|---|---|
| **What architecture does this application follow?** | A 3-Tier Layered Architecture: React SPA presentation tier, Spring Boot REST application tier, and MySQL relational persistence tier. Communication occurs via stateless JSON REST APIs over HTTP. |
| **How does authentication and authorization work?** | We use stateless JWT (JSON Web Tokens). When a user logs in, Spring Security authenticates credentials with `BCryptPasswordEncoder` and returns a signed 256-bit JWT token. The React frontend stores this in `localStorage` and an Axios interceptor attaches it as `Authorization: Bearer <token>` to every subsequent request. |
| **How are Admin and Homeowner roles separated?** | Spring Security enforces role-based endpoint security (`requestMatchers("/api/admin/**").hasRole("ADMIN")` and `requestMatchers("/api/homeowner/**").hasRole("HOMEOWNER")`). In React, the `ProtectedRoute` guard inspects the user's role and prevents cross-portal access. |
| **How are IoT sensors simulated?** | A Spring `@Scheduled` service runs periodically in the background. It generates realistic variations in temperature and humidity, evaluates conditional automation rules (*e.g., turning on the AC if temperature exceeds 26°C*), and tracks power consumption logs for devices that are turned ON. |
| **How do you handle API documentation?** | We integrated `springdoc-openapi-starter-webmvc-ui` (Swagger 3). It generates live interactive documentation with Bearer token authentication at `http://localhost:8080/swagger-ui/index.html`. |
