-- ==============================================================================
-- DML: SEED DATA
-- ==============================================================================

-- 7. Insert Test Users
-- Passwords should be hashed in your backend application (e.g., using bcrypt)
INSERT INTO users (username, password_hash) VALUES 
('testuser', '$2b$12$e/SomeDummyBcryptHashStringForTestUser...'),
('admin', '$2b$12$e/SomeDummyBcryptHashStringForAdmin...');

-- 8. Insert Test Products
-- Seeding exactly 10 products to match the `?page=1&limit=10` default view
INSERT INTO products (title, description, price, image_url) VALUES 
('Basic T-Shirt', 'A comfortable everyday cotton t-shirt.', 15.99, '/images/tshirt.png'),
('Denim Jeans', 'Classic blue denim jeans with a straight fit.', 45.00, '/images/jeans.png'),
('Casual Sneakers', 'Everyday casual sneakers with durable soles.', 59.99, '/images/sneakers.png'),
('Fleece Hoodie', 'Warm and cozy fleece pullover hoodie.', 35.50, '/images/hoodie.png'),
('Baseball Cap', 'Adjustable standard fit baseball cap.', 12.00, '/images/cap.png'),
('Sunglasses', 'Stylish sunglasses with full UV protection.', 22.00, '/images/sunglasses.png'),
('Everyday Backpack', 'Durable backpack with laptop compartment.', 40.00, '/images/backpack.png'),
('Crew Socks (3-Pack)', 'Breathable cotton crew socks.', 9.99, '/images/socks.png'),
('Analog Wristwatch', 'Water-resistant classic analog watch.', 75.00, '/images/watch.png'),
('Windbreaker Jacket', 'Lightweight, water-resistant windbreaker.', 55.00, '/images/jacket.png');

-- 9. Insert Initial Test Order (Simulating an active Cart Checkout in progress)
-- Creating an 'OPEN' order for 'testuser' (User ID 1)
INSERT INTO orders (user_id, status, total_amount) VALUES 
(1, 'OPEN', 60.99);

-- 10. Insert Order Items for the Test Order
-- 1x T-Shirt ($15.99) + 1x Jeans ($45.00) = $60.99
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(1, 1, 1, 15.99),
(1, 2, 1, 45.00);

-- Creating a second order that has already been 'ACCEPTED'
INSERT INTO orders (user_id, status, total_amount) VALUES 
(1, 'ACCEPTED', 35.50);

INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(2, 4, 1, 35.50);