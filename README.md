# DesktopSupportQMS

## Description
This project is a web-based application designed for managing queues for the Dekstop Support department in LexisNexis. The system consists of a login page, a customer interface for submitting requests, an admin interface for managing and serving customers, and a display interface to display the customers who are currently in the queue. This project aims to streamline customer interactions and provide a seamless user experience in a kiosk environment.

## Features
- **Customer Interface:** Submit requests, choose ticket options, and receive appropriate messages.
- **Admin Interface:** Manage the queue, mark tickets as being served, and remove tickets.
- **Availability Management:** Toggle the availability of the support department.
- **Display Interface:** Display the customers who are currently in the queue.

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
