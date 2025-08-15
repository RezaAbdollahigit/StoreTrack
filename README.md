# StoreTrack
IE project
StoreTrack is a full-stack web application designed to manage products, categories, and orders for an inventory system. 
It features a Node.js backend with a PostgreSQL database and a React frontend for the user interface.

## Authors
* Hamidreza Khodabandehlou
* Reza Abdollahi

## github link
https://github.com/RezaAbdollahigit/StoreTrack

## Screenshots
./screenshots/1.png
./screenshots/2.png
./screenshots/3.png
./screenshots/4.png
./screenshots/5.png


## Features
* **Dynamic Dashboard:** View products organized by category in a horizontally scrolling interface.
* **Full CRUD Functionality:** Add, edit, and delete products and categories through modal forms.
* **Live Shopping Cart:** Add items to a cart and place orders.
* **Stock Management:** Stock is automatically checked and reduced when an order is placed.
* **Order History:** View a complete list of past orders with an auto-updating status.
* **Stock History:** Track all inventory movements, including initial stock, sales, and manual adjustments.
* **Low Stock Alerts:** Receive toast notifications for products with low inventory.

## Tech Stack
* **Backend:** Node.js, Express, Sequelize, PostgreSQL
* **Frontend:** React, Vite, TypeScript, Tailwind CSS
* **File Uploads:** Multer


## How to Run the Project

#### 1. Installation
First, install the necessary dependencies for both the backend and frontend.

* In the root `StoreTrack` directory, run:
    ```shell
    npm install
    ```
* Then, navigate to the frontend directory and run install again:
    ```shell
    cd storetrack-ui
    npm install
    ```

#### 2. Database Setup
This project requires a local PostgreSQL server.

* **Create the database:** Make sure you have a database created (e.g., `storetrack_db`).
* **Configure:** Check the `config/config.json` file to ensure the development database credentials are correct.
* **Run Migrations:** To create all the necessary tables, run this command from the root `StoreTrack` directory:
    ```shell
    npx sequelize-cli db:migrate
    ```

#### 3. Running the Application
You will need two separate terminals to run the application.

* **Terminal 1 (Backend):** In the root `StoreTrack` directory, run:
    ```shell
    npm start
    ```
    The backend will be running at `http://localhost:3000`.

* **Terminal 2 (Frontend):** In the `storetrack-ui` directory, run:
    ```shell
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`. Open this URL in your browser.
