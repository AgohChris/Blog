INSERT INTO roles (name, description) VALUES
('USER', 'Utilisateur standard'),
('ADMIN', 'Administrateur')
ON CONFLICT (name) DO NOTHING;
