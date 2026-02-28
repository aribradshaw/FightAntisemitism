-- Add archiving support for contact submissions.
ALTER TABLE contact_entries
  ADD COLUMN archived_at DATETIME DEFAULT NULL AFTER answered_at,
  ADD KEY idx_contact_entries_archived (archived_at);
