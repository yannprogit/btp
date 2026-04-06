ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(20);

UPDATE users
SET role = CASE
  WHEN email LIKE '%@admin.btp' THEN 'admin'
  ELSE 'user'
END
WHERE role IS NULL;

ALTER TABLE users
ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE users
ALTER COLUMN role SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'user'));
  END IF;
END $$;
