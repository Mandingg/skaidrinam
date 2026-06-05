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
VALUES (
  'Admin',
  'Admin',
  'admin@skaidrinam.lt',
  '$2b$12$examplehash',
  'ADMIN',
  'PREMIUM'
);

-- RECEIPTS
INSERT INTO receipts (
  user_id,
  store_id,
  file_path,
  ocr_text,
  receipt_date,
  total_amount
)
VALUES (
  1,
  1,
  '/uploads/receipt_001.jpg',
  'MAXIMA KVITAS',
  '2026-05-14',
  45.50
);

-- EXPENSES
INSERT INTO expenses (
  user_id,
  receipt_id,
  category_id,
  description,
  amount,
  expense_date
)
VALUES (
  1,
  1,
  1,
  'Maisto prekės',
  45.50,
  '2026-05-14'
);

-- DOCUMENTS
INSERT INTO documents (
  user_id,
  title,
  file_path,
  file_type,
  valid_until
)
VALUES (
  1,
  'Televizoriaus garantija',
  '/documents/tv_warranty.pdf',
  'PDF',
  '2028-05-14'
);

-- LOGS
INSERT INTO logs (
  user_id,
  action_type,
  record_id,
  record_name
)
VALUES (
  1,
  'USER_REGISTERED',
  NULL,
  NULL
);
