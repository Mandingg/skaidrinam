USE skaidrinam_db;

-- USERS
INSERT INTO users (
  name,
  surname,
  email,
  password_hash,
  role,
  subscription_type
)
VALUES
(
  'Admin',
  'Admin',
  'admin@skaidrinam.lt',
  '$2y$12$8YVgVv0V7CasS5I8.wNJle9Dj53Dk2DymRB3uRYV.mcSn2zeFSJGa',
  'ADMIN',
  'PREMIUM'
),
(
  'Premium',
  'Vartotojas',
  'premium@skaidrinam.lt',
  '$2y$12$8YVgVv0V7CasS5I8.wNJle9Dj53Dk2DymRB3uRYV.mcSn2zeFSJGa',
  'USER',
  'PREMIUM'
),
(
  'Free',
  'Vartotojas',
  'free@skaidrinam.lt',
  '$2y$12$8YVgVv0V7CasS5I8.wNJle9Dj53Dk2DymRB3uRYV.mcSn2zeFSJGa',
  'USER',
  'FREE'
);

-- STORES
INSERT INTO stores (name)
VALUES
('Maxima'),
('Rimi'),
('Lidl'),
('Iki'),
('Norfa');

-- GLOBAL CATEGORIES
INSERT INTO categories (user_id, name)
VALUES
(NULL, 'Maistas'),
(NULL, 'Kuras'),
(NULL, 'Buitis'),
(NULL, 'Transportas'),
(NULL, 'Sveikata'),
(NULL, 'Pramogos'),
(NULL, 'Kita');

-- PERSONAL CATEGORIES
INSERT INTO categories (user_id, name)
VALUES
(2, 'Sportas'),
(2, 'Kava'),
(3, 'Vaikai'),
(3, 'Augintiniai');

-- RECEIPTS
INSERT INTO receipts (
  user_id,
  store_id,
  file_path,
  ocr_text,
  receipt_date,
  total_amount
)
VALUES
-- Premium vartotojo kvitai
(2, 1, '/uploads/premium_receipt_001.jpg', 'MAXIMA KVITAS\nPienas 1.59\nDuona 1.29\nSuma 2.88', '2026-05-10', 2.88),
(2, 2, '/uploads/premium_receipt_002.jpg', 'RIMI KVITAS\nKava 5.99\nSuma 5.99', '2026-05-12', 5.99),
(2, 3, '/uploads/premium_receipt_003.jpg', 'LIDL KVITAS\nDaržovės 4.50\nSuma 4.50', '2026-05-15', 4.50),

-- Free vartotojo kvitai
(3, 1, '/uploads/free_receipt_001.jpg', 'MAXIMA KVITAS\nMakaronai 1.49\nSuma 1.49', '2026-05-11', 1.49),
(3, 4, '/uploads/free_receipt_002.jpg', 'IKI KVITAS\nVanduo 0.89\nSuma 0.89', '2026-05-13', 0.89),

-- Admin kvitai
(1, 5, '/uploads/admin_receipt_001.jpg', 'NORFA KVITAS\nBiuro prekės 12.99\nSuma 12.99', '2026-05-14', 12.99);

-- EXPENSES
INSERT INTO expenses (
  user_id,
  receipt_id,
  category_id,
  description,
  amount,
  expense_date
)
VALUES

-- Premium vartotojas
(2, 1, 1, 'Pienas ir duona', 2.88, '2026-05-10'),
(2, 2, 9, 'Kava darbui', 5.99, '2026-05-12'),
(2, 3, 1, 'Daržovės', 4.50, '2026-05-15'),

-- Free vartotojas
(3, 4, 1, 'Makaronai', 1.49, '2026-05-11'),
(3, 5, 1, 'Vanduo', 0.89, '2026-05-13'),

-- Admin
(1, 6, 3, 'Biuro prekės', 12.99, '2026-05-14');

-- DOCUMENTS
INSERT INTO documents (
  user_id,
  title,
  file_path,
  file_type,
  valid_until
)
VALUES

(2, 'Dviračio garantija',
 '/documents/bike_warranty.pdf',
 'PDF',
 '2028-05-10'),

(2, 'Telefono garantija',
 '/documents/phone_warranty.pdf',
 'PDF',
 '2027-10-01'),

(3, 'Automobilio draudimas',
 '/documents/car_insurance.pdf',
 'PDF',
 '2026-12-31'),

(1, 'Įmonės sutartis',
 '/documents/company_contract.pdf',
 'PDF',
 '2030-01-01');