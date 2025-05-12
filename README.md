# DynamikeApp

**DynamikeApp** is an internal all-in-one business management platform built to support the daily operations of Dynamike Café and its affiliated businesses. It streamlines sales, staff management, inventory, accounting, and integrates with major e-commerce platforms like Lazada and Shopee.

---

## 🚀 Key Features

### 🔧 Business Operations
- **Point of Sale (POS)**: Fast and intuitive POS for café and retail environments.
- **Cash Drawer Support**: Automatically kick open drawer on completed sales.
- **Accounting System**: Integrated tracking for income, expenses, and profit/loss.
- **Cash Flow Monitoring**: Track and analyze nearest real-time business cash movement.

### 🍳 Kitchen Dashboard
- **Real-Time Order Display**: Orders instantly appear on a dedicated kitchen screen.
- **Order Status Management**: Mark orders as in progress, completed, or delayed.
- **Multi-Terminal Support**: Sync orders between cashier and kitchen systems.

### 📦 Inventory & Product Management
- **Stock-Tick Inventory System**: Nearest Real-time stock tracking and adjustments.
- **Product Photo Management**:
  - Upload to Google Drive.
  - View from Google Drive inside the app.

### 👥 Staff Management
- **Clock In/Out System**: Log staff attendance and working hours.
- **Payslip Generation**: Auto-generate monthly payslips from attendance and salary data.

### 📈 Reporting & Documents
- **Charts & Graphs**: Visualized business insights and performance.
- **Document Generation**:
  - **Invoices**
  - **Cash Sales Receipts**
  - **Payslips**

### 🌐 API Integrations
- **Lazada API**: Sync orders and products with Lazada.
- **Shopee API**: Sync with Shopee platform.
- **MyInvois API**: e-Invoicing compliant with Malaysia’s LHDN standards.

### ☁️ Cloud & Communication
- **Google Drive Integration**: 
  - Upload product or document photos.
  - Load images directly from Google Drive.
- **Email Notifications**: Automated alerts for orders, reports, or low inventory.

---

## 💻 Platform Support

### Electron Desktop App
- **Windows & macOS**
- **Auto-Updater**: Keeps app updated seamlessly using `electron-updater`.
- **Drawer Kick Support**: Compatible with serial/USB cash drawers.
- **Kitchen Display Support**: Secondary screen or browser mode for real-time kitchen updates.

### Android Mobile App
- **Cross-Platform Support (Cordova)**
- **Publishable to Google Play Store**
- Optimized for on-the-go sales, clocking, and order tracking.

---

## 🛠️ Tech Stack

- **Frontend**: Angular
- **Backend**: Java (Spring Boot)
- **Desktop**: Electron + Node.js
- **Mobile**: Cordova 
- **Database**: MySQL (cloud sync)
- **Cloud APIs**: Google Drive, Gmail API

---

## 🏢 Usage Scope

DynamikeApp is intended for **internal use** only, tailored specifically for:
- Café & F&B operations
- E-commerce sync
- Staff and outlet management
- Inventory & purchasing tracking

---

## 🔧 Developer Notes

- Drawer kicking via ESC/POS commands (serial or USB).
- Kitchen display runs on a dedicated Angular route or second monitor.
- Auto-updates via `electron-updater` with GitHub or custom update server.
- Cordova plugins: `cordova-plugin-file`, `cordova-plugin-camera`, `cordova-plugin-serial`, `cordova-plugin-google-drive-api`.

---

## 📞 Contact

For internal deployment instructions or team access, contact the **Dynamike IT Team**.

