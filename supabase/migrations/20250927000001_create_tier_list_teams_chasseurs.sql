-- Migration pour créer la table tier_list_teams_chasseurs
-- Fichier: 20250927000001_create_tier_list_teams_chasseurs.sql

-- Table pour stocker les positions des chasseurs dans les teams par élément
CREATE TABLE tier_list_teams_chasseurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chasseur_id INTEGER NOT NULL,
  element TEXT NOT NULL CHECK (element IN ('feu', 'vent', 'lumiere', 'eau', 'tenebres')),
  role TEXT NOT NULL CHECK (role IN ('breaker', 'support', 'dps')),
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité : un seul chasseur par position/rôle/élément
  UNIQUE(element, role, position),
  
  -- Contrainte : un chasseur ne peut pas être dans plusieurs positions du même élément/rôle
  UNIQUE(chasseur_id, element, role),
  
  -- Référence vers la table chasseurs existante
  FOREIGN KEY (chasseur_id) REFERENCES chasseurs(id) ON DELETE CASCADE
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_tier_list_teams_chasseurs_element ON tier_list_teams_chasseurs(element);
CREATE INDEX idx_tier_list_teams_chasseurs_role ON tier_list_teams_chasseurs(element, role);
CREATE INDEX idx_tier_list_teams_chasseurs_chasseur ON tier_list_teams_chasseurs(chasseur_id);

-- Fonction pour mettre à jour updated_at automatiquement (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_tier_list_teams_chasseurs_updated_at
    BEFORE UPDATE ON tier_list_teams_chasseurs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) pour l'administration
ALTER TABLE tier_list_teams_chasseurs ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (pour l'affichage des teams sur le site)
CREATE POLICY "Tier list teams chasseurs - Public read" ON tier_list_teams_chasseurs
    FOR SELECT USING (true);

-- Politique : Écriture pour les administrateurs seulement
-- Nous allons définir cette politique plus tard quand le système d'authentification admin sera en place
CREATE POLICY "Tier list teams chasseurs - Admin write" ON tier_list_teams_chasseurs
    FOR ALL USING (true); -- TEMPORAIRE : à restreindre aux admins uniquement

-- Commentaires pour la documentation
COMMENT ON TABLE tier_list_teams_chasseurs IS 'Tier list des teams chasseurs : positions des chasseurs par élément et rôle';
COMMENT ON COLUMN tier_list_teams_chasseurs.chasseur_id IS 'ID du chasseur (référence vers table chasseurs)';
COMMENT ON COLUMN tier_list_teams_chasseurs.element IS 'Élément de la team (feu, vent, lumière, eau, ténèbres)';
COMMENT ON COLUMN tier_list_teams_chasseurs.role IS 'Rôle dans la team (breaker, support, dps)';
COMMENT ON COLUMN tier_list_teams_chasseurs.position IS 'Position dans le rôle (1=optimal, 2=alt.1, 3=alt.2, etc.)';