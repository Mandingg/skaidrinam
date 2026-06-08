CREATE DATABASE IF NOT EXISTS skaidrinam_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE skaidrinam_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(55) NOT NULL,
  surname VARCHAR(55) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  subscription_type ENUM('FREE', 'PREMIUM') NOT NULL DEFAULT 'FREE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email_UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE categories (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL,
  name VARCHAR(55) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_user_name (user_id, name),
  CONSTRAINT fk_categories_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE stores (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY name_UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE receipts (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  file_path VARCHAR(500),
  ocr_text TEXT,
  receipt_date DATE,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_receipts_users_idx (user_id),
  INDEX fk_receipts_stores_idx (store_id),
  CONSTRAINT fk_receipts_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_receipts_stores
    FOREIGN KEY (store_id) REFERENCES stores(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE expenses (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  receipt_id INT NULL,
  category_id INT NULL,
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_expenses_users_idx (user_id),
  INDEX fk_expenses_receipts_idx (receipt_id),
  INDEX fk_expenses_categories_idx (category_id),
  CONSTRAINT fk_expenses_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_expenses_receipts
    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_expenses_categories
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE incomes (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  source VARCHAR(255) NOT NULL, 
  description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  income_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_incomes_users_idx (user_id),
  CONSTRAINT fk_incomes_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE logs (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL,
  action_type VARCHAR(100) NOT NULL,
  record_id INT NULL,
  record_name VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX fk_logs_users_idx (user_id),
  CONSTRAINT fk_logs_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE documents (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(20) NULL,
  valid_until DATE NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  INDEX fk_documents_users_idx (user_id),
  CONSTRAINT fk_documents_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;