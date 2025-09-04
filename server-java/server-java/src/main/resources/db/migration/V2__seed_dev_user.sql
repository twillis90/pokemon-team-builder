-- Seed a dev user. Change id/display/email as you like.
INSERT INTO users (id, display_name, email)
VALUES ('tj-dev', 'TJ', 'tj@example.com')
ON CONFLICT (id) DO NOTHING;
