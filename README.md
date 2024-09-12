# DesktopSupportQMS

## Description
This project is a web-based application designed for managing queues for the Dekstop Support department in LexisNexis. The system consists of a login page, a customer interface for submitting requests, an admin interface for managing and serving customers, and a display interface to display the customers who are currently in the queue. This project aims to streamline customer interactions and provide a seamless user experience in a kiosk environment.

## Features
- **Login Page:** Authenticate users and direct them to the appropriate interface based on their role. Admins access the queue management system, while customers proceed to submit their requests.<br/>
  ![Screenshot 2024-08-22 114440](https://github.com/user-attachments/assets/e0f4485f-d1e8-44d4-bbe4-71a9d4c2dd2b)
- **Customer Interface:** Submit requests, choose ticket options, and receive appropriate messages.<br/>
  ![Screenshot 2024-08-22 114556](https://github.com/user-attachments/assets/489cb9c0-8d24-469c-a043-ab9015a39ca3)
- **Admin Interface:** Manage the queue, mark tickets as being served, remove tickets, and Toggle their availability.<br/>
  ![Screenshot 2024-08-22 114418](https://github.com/user-attachments/assets/d0317e7a-74d4-4999-a31c-c899f3ea2127)
- **Display Interface:** Display the customers who are currently in the queue.<br/>
  ![Screenshot 2024-08-22 114518](https://github.com/user-attachments/assets/d54817f8-ce49-4846-91f5-d45fa467f3f9)

## Technologies Used
- Node.js
- Express.js
- Sequelize (ORM for SQLite)
- Socket.io (Real-time communication)
- Bootstrap (Styling)
- EJS (Templating)

## Installation
**Prerequisites**
  - Node.js and npm installed.
  - SQLite (comes with Sequelize).

**Steps**
  1. Clone the Repository:<br/>
     `git clone https://github.com/your-username/desktop-support-qms.git`
  2. Install Dependencies:<br/>
     `npm install`
  3. Set Up Environment Variables:<br/>
     Create a .env file in the root directory and add the following environment variables:<br/>
     ```
     CUSTOMER_USERNAME = your_customer_username 
     CUSTOMER_PASSWORD = your_customer_password 
     ADMIN_USERNAME = your_admin_username 
     ADMIN_PASSWORD = your_admin_password
     ```
   4. Run the Application:<br/>
      `npm start`<br/>
      The application will start on http://localhost:4000.
