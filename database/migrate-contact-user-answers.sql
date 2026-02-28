-- Link contact entries to users and track answer state.
-- Also add users.email for account matching from contact form submissions.

ALTER TABLE users
  ADD COLUMN email VARCHAR(255) DEFAULT NULL UNIQUE AFTER username;

ALTER TABLE contact_entries
  ADD COLUMN user_id INT UNSIGNED DEFAULT NULL AFTER id,
  ADD COLUMN answer_text TEXT DEFAULT NULL AFTER question,
  ADD COLUMN answered_at DATETIME DEFAULT NULL AFTER answer_text,
  ADD KEY idx_contact_entries_user (user_id);

ALTER TABLE contact_entries
  ADD CONSTRAINT fk_contact_entries_user
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL;
