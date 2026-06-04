-- ==============================================================================
-- MySQL Initialization Script for Basic Store API v2
-- Target Application: Basic Cart (https://testpages.eviltester.com/apps/basiccart/)
-- ==============================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS basicstore_db;
USE basicstore_db;

-- 2. Drop existing tables if they exist to allow clean re-initialization
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ==============================================================================
-- DDL: TABLE DEFINITIONS
-- ==============================================================================

-- 3. Create Users Table
-- Supports the Authentication/Login Flow
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Products Table
-- Supports the Product List Page (PLP) and Product View Page (PVP)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Orders Table
-- Supports the Checkout Flow and User Page (OPEN vs ACCEPTED states)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('OPEN', 'ACCEPTED') DEFAULT 'OPEN',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Create Order Items Table
-- Supports the Cart Items linking products and quantities to an order
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);