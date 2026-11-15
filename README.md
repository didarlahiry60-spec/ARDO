# ARDO | Premium Menswear

> **বাংলাদেশি ফ্যাশন, নিজস্ব পরিচয়**  
> *Made for Bangladesh. Defined by Our Identity.*

ARDO is a high-end luxury menswear eCommerce platform tailored specifically for the Bangladeshi market. It features a modern storefront showcasing premium Panjabis and executive formal shirts, alongside a full-featured admin management suite with real-time order processing, inventory controls, courier dispatch integration, and Telegram order alerts.

---

## ✨ Features

### 🛍️ Customer Storefront
- **Luxury Bengali Heritage Aesthetic:** Warm ivory palette (`#FDFBF7`), bespoke typography, and subtle gold ornamentation.
- **Bilingual Interface:** Instant Bengali (বাংলা) and English language toggle across the entire application.
- **Precision Color & Size Selection:** Real-time multi-color variant preview and Bangladeshi body sizing chart.
- **Smooth Shopping Experience:** Interactive cart drawer, instant direct checkout, and local payment methods (Cash on Delivery, bKash, Nagad).
- **Concierge & Support:** One-click WhatsApp concierge chat and direct phone assistance.

### ⚙️ Admin Management Dashboard (`/admin`)
- **Order Processing:** Real-time incoming order tracking, customer details, printable invoices/cash memos, and status lifecycle management (Pending, Confirmed, Shipped, Delivered).
- **Inventory & Stock Management:** In-stock / out-of-stock toggling, product price updates, and media uploads.
- **Courier Integration:** Steadfast Courier API dispatch readiness and consignment tracking.
- **Instant Alerts:** Telegram bot webhook integration for instant phone notifications on every placed order.
- **Store Settings:** Configurable delivery charges (Dhaka inside / outside), free shipping thresholds, merchant payment numbers, and security credentials.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/didarlahiry60-spec/ARDO.git
   cd ARDO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Storefront:** `http://localhost:5173/`
   - **Admin Panel:** `http://localhost:5173/admin` *(Default PIN: `didar1122`)*

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React
- **Backend Middleware:** Vite dev server HTTP middleware with REST API endpoints
- **Data Persistence:** JSON-based persistent file storage (`data/orders.json`, `data/products.json`, `data/settings.json`)

---

## 📄 License

All rights reserved © 2026 ARDO Premium Menswear.
