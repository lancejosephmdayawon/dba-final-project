# 🦷 Lumident – Dental Clinic Booking System

Lumident is a web-based dental clinic booking and management system designed to streamline appointment scheduling for patients and simplify clinic-side administration.

It supports role-based access (Admin & Patient), appointment approval workflows, and status tracking from booking to completion.

---

## ✨ Features

### 👤 Patient
- Book/Cancel dental appointments
- Select services, date, and available time slots
- View appointment status (Pending, Approved, Completed)
- Add notes or concerns for the dentist

### 🛠️ Admin
- View all appointment requests
- Approve or reject pending appointments
- Mark approved appointments as completed
- Manage patient records
- Monitor daily and upcoming schedules

---

## 🧑‍💻 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **Authentication:** Session / role-based logic
- **Deployment:** Hostinger (or similar VPS/shared hosting)

---

## 🔄 Sample Appointment Workflow

1. Patient books an appointment → **status: pending**
2. Admin reviews the request
3. Admin approves → **status: approved**
4. After the visit, admin marks it as → **status: completed**

---

## 🚀 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/lumident.git

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables (`.env`)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lumident_db
```

---

## 📌 Future Improvements

- Email notifications for appointment status changes
- Dentist/staff role separation
- Calendar view for admins
- SMS reminders
- Audit logs

---

## 📄 License

This project is for educational purposes and internal clinic use.

---

## 👨‍💻 Author

**DBA Group 8**  
Dental Clinic Booking System – Lumident

---

> "Good dental care starts with good scheduling." 🦷✨

