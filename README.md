# Food Delivery App 🍔

Welcome to the **Food Delivery App**! This project is a full-stack web application that allows users to browse a menu, add items to their cart, and place orders. The app includes a frontend built with HTML, CSS, and JavaScript, and a backend powered by Node.js and MySQL.

---

## Features ✨

- **Menu Display**: Browse a variety of food items with images, names, prices, and descriptions.
- **Shopping Cart**: Add/remove items, update quantities, and view the total price.
- **Discounts**: Automatic 10% discount on orders with 3 or more items.
- **Checkout**: Enter shipping information and place orders.
- **Order Confirmation**: View order details and a thank-you message after checkout.
- **Database Integration**: Orders and order items are saved in a MySQL database.

---

## Technologies Used 🛠️

- **Frontend**:
  - HTML5
  - CSS3 (with Bootstrap for styling)
  - JavaScript (for interactivity)
- **Backend**:
  - Node.js
  - Express.js (for routing)
  - MySQL (for database)
- **Tools**:
  - Git (for version control)
  - GitHub (for hosting the repository)
  - MySQL Workbench (for database management)

---


## Installation and Setup 🚀

### Prerequisites
- Node.js and npm installed ([Download Node.js](https://nodejs.org/))
- MySQL installed ([Download MySQL](https://dev.mysql.com/downloads/installer/))
- Git installed ([Download Git](https://git-scm.com/))

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/food-delivery-app.git
cd food-delivery-app
```

### Step 2: Set Up the Database
1. Open MySQL and create a database:
   ```sql
   CREATE DATABASE food_delivery;
   ```

2. Run the following SQL queries to create the necessary tables:
   ```sql
   USE food_delivery;

   CREATE TABLE orders (
       id INT AUTO_INCREMENT PRIMARY KEY,
       customer_name VARCHAR(255) NOT NULL,
       customer_email VARCHAR(255) NOT NULL,
       customer_address VARCHAR(255) NOT NULL,
       customer_phone VARCHAR(20) NOT NULL,
       customer_city VARCHAR(100) NOT NULL,
       customer_zip VARCHAR(10) NOT NULL,
       total_price DECIMAL(10, 2) NOT NULL,
       order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE order_items (
       id INT AUTO_INCREMENT PRIMARY KEY,
       order_id INT,
       item_name VARCHAR(255) NOT NULL,
       item_price DECIMAL(10, 2) NOT NULL,
       item_quantity INT NOT NULL,
       FOREIGN KEY (order_id) REFERENCES orders(id)
   );
   ```

### Step 3: Set Up Environment Variables
1. Create a `.env` file in the root directory:
   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=food_delivery
   ```

2. Replace `your_password` with your MySQL password.

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start the Backend Server
```bash
node server.js
```

### Step 6: Open the Frontend
1. Open the `index.html` file in your browser.
2. Start browsing the menu, adding items to your cart, and placing orders!

---

## Folder Structure 📂

```
food-delivery-app/
├── public/                  # Frontend files
│   ├── index.html           # Main HTML file
│   ├── main.js              # JavaScript for interactivity
│   └── images/              # Images for the app
├── server.js                # Backend server code
├── .env                     # Environment variables (not uploaded to GitHub)
├── .gitignore               # Files to ignore in Git
├── README.md                # Project documentation
├── package.json             # Node.js dependencies and scripts
└── package-lock.json        # Auto-generated lock file for dependencies
```

---

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
