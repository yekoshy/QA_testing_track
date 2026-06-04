import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCHEMA_SQL = readFileSync(join(__dirname, 'init_db.sql'), 'utf-8');

describe('Basic Store Database Schema & Constraints Tests', () => {
  let db;

  before(() => {
    console.log("Starting database tests...");
    // Create an in-memory database for testing
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON'); // SQLite requires this per-connection
    db.exec(SCHEMA_SQL);
  });

  after(() => {
    db.close();
    console.log("All tests completed!");
  });

  describe('products Table', () => {
    it('1. should insert and retrieve a Product successfully', () => {
      const insert = db.prepare('INSERT INTO products (title, description, price) VALUES (?, ?, ?)');
      const info = insert.run('Test T-Shirt', 'A comfortable test shirt.', 19.99);

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
      
      assert.strictEqual(product.title, 'Test T-Shirt');
      assert.strictEqual(product.description, 'A comfortable test shirt.');
      assert.strictEqual(product.price, 19.99);
    });
  });

  describe('users Table', () => {
    it('2. should insert and retrieve a user successfully', () => {
      const insert = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
      const info = insert.run('new_test_user', 'hashed_password_123');

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
      assert.strictEqual(user.username, 'new_test_user');
      assert.strictEqual(user.password_hash, 'hashed_password_123');
    });

    it('3. should fail to insert user without password_hash (NOT NULL constraint)', () => {
      const insert = db.prepare('INSERT INTO users (username) VALUES (?)');
      
      assert.throws(() => {
        insert.run('user_no_password');
      }, /NOT NULL constraint failed: users.password_hash/);
    });

    it('4. should fail to insert a duplicate username (UNIQUE constraint)', () => {
      const insert = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
      insert.run('admin', 'first_hash_attempt');
      
      assert.throws(() => {
        insert.run('admin', 'new_hash_attempt');
      }, /UNIQUE constraint failed: users.username/);
    });
  });

  describe('orders Table', () => {
    it('5. should insert and retrieve an Order', () => {
      // Using user_id 1 (seeded 'testuser')
      const insert = db.prepare('INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)');
      let info = insert.run(1, 'OPEN', 100.50);

      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
      assert.strictEqual(order.status, 'OPEN');
      assert.strictEqual(order.user_id, 1);
      assert.strictEqual(order.total_amount, 100.50);
    });

    it('6. should fail to insert Order with invalid status (CHECK constraint)', () => {
      const insert = db.prepare('INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)');
      
      assert.throws(() => {
        // 'PENDING' is not in the allowed list ('OPEN', 'ACCEPTED')
        insert.run(1, 'PENDING', 50.00);
      }, /CHECK constraint failed/);
    });
  });

  describe('order_items Table (Relationships & Constraints)', () => {
    // Helper function to seed data required for order_items tests
    const seedValidOrderAndProduct = () => {
      let productInfo = db.prepare("INSERT INTO products (title, price) VALUES ('Widget', 10.0)").run();
      // Using user_id 1 which exists from seed data
      let orderInfo = db.prepare("INSERT INTO orders (user_id, status, total_amount) VALUES (1, 'OPEN', 10.0)").run();
      return { productInfo, orderInfo };
    };

    it('7. should insert order_item with valid foreign keys', () => {
      let { productInfo, orderInfo } = seedValidOrderAndProduct();

      const insertLine = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
      insertLine.run(orderInfo.lastInsertRowid, productInfo.lastInsertRowid, 5, 10.0);

      const line = db.prepare('SELECT * FROM order_items WHERE order_id = ?').get(orderInfo.lastInsertRowid);
      assert.strictEqual(line.quantity, 5);
      assert.strictEqual(line.product_id, productInfo.lastInsertRowid);
    });

    it('8. should fail to insert order_item with non-existent order_id (FK constraint)', () => {
      let productInfo = db.prepare("INSERT INTO products (title, price) VALUES ('Widget', 10.0)").run();

      const insertLine = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
      
      assert.throws(() => {
        // Order ID -1 does not exist in orders table
        insertLine.run(-1, productInfo.lastInsertRowid, 5, 10.0);
      }, /FOREIGN KEY constraint failed/);
    });

    it('9. should fail to insert order_item with non-existent product_id (FK constraint)', () => {
      let orderInfo = db.prepare("INSERT INTO orders (user_id, status, total_amount) VALUES (1, 'OPEN', 0)").run();

      const insertLine = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
      
      assert.throws(() => {
        // Product ID -1 does not exist in products table
        insertLine.run(orderInfo.lastInsertRowid, -1, 5, 10.0);
      }, /FOREIGN KEY constraint failed/);
    });

    it('10. ON DELETE CASCADE: should delete order_items when the parent order is deleted', () => {
      let { productInfo, orderInfo } = seedValidOrderAndProduct();
      
      // Insert line item
      db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)').run(orderInfo.lastInsertRowid, productInfo.lastInsertRowid, 5, 10.0);

      let lineCount_before = db.prepare('SELECT COUNT(*) as count FROM order_items WHERE order_id = ?').get(orderInfo.lastInsertRowid).count;
      assert.strictEqual(lineCount_before, 1, 'order_item should be inserted successfully');

      // Delete the parent order
      db.prepare('DELETE FROM orders WHERE id = ?').run(orderInfo.lastInsertRowid);

      // Verify the child order_item was automatically deleted
      let lineCount_after = db.prepare('SELECT COUNT(*) as count FROM order_items WHERE order_id = ?').get(orderInfo.lastInsertRowid).count;
      assert.strictEqual(lineCount_after, 0, 'order_items should be deleted due to ON DELETE CASCADE');
    });

    it('11. ON DELETE RESTRICT: should fail to delete a product if it is part of an order', () => {
      let { productInfo, orderInfo } = seedValidOrderAndProduct();
      
      // Insert line item linking to the product
      db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)').run(orderInfo.lastInsertRowid, productInfo.lastInsertRowid, 1, 10.0);

      assert.throws(() => {
        // Attempting to delete the product should throw a RESTRICT FK error
        db.prepare('DELETE FROM products WHERE id = ?').run(productInfo.lastInsertRowid);
      }, /FOREIGN KEY constraint failed/);
    });
  });
});