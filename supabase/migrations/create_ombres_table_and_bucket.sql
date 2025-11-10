-- =====================================================
-- CRÉATION DE LA TABLE OMBRES ET DU BUCKET STORAGE
-- =====================================================
-- Ce script crée la table 'ombres' et le bucket de storage 'ombres'
-- pour gérer les ombres de l'armée de Sung Jinwoo
-- =====================================================

-- 1. Créer la table ombres (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS ombres (
  id BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer un index sur le nom pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_ombres_nom ON ombres(nom);

-- 3. Créer un trigger pour mettre à jour automatiquement last_modified
CREATE OR REPLACE FUNCTION update_ombres_last_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ombres_last_modified ON ombres;

CREATE TRIGGER trigger_update_ombres_last_modified
BEFORE UPDATE ON ombres
FOR EACH ROW
EXECUTE FUNCTION update_ombres_last_modified();

-- 4. Créer le bucket de storage 'ombres' (si il n'existe pas)
-- Note: Cette commande peut échouer si le bucket existe déjà, c'est normal
INSERT INTO storage.buckets (id, name, public)
VALUES ('ombres', 'ombres', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Activer RLS sur la table ombres
ALTER TABLE ombres ENABLE ROW LEVEL SECURITY;

-- 6. Ajouter des commentaires pour la documentation
COMMENT ON TABLE ombres IS 'Table contenant les ombres de l''armée de Sung Jinwoo';
COMMENT ON COLUMN ombres.id IS 'Identifiant unique de l''ombre';
COMMENT ON COLUMN ombres.nom IS 'Nom de l''ombre (unique)';
COMMENT ON COLUMN ombres.image IS 'URL de l''image de l''ombre dans le bucket storage';
COMMENT ON COLUMN ombres.description IS 'Description de l''ombre (optionnel)';
COMMENT ON COLUMN ombres.created_at IS 'Date de création de l''enregistrement';
COMMENT ON COLUMN ombres.last_modified IS 'Date de dernière modification (mise à jour automatique)';

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================
-- Décommentez les lignes ci-dessous pour insérer des ombres de test
-- =====================================================

-- INSERT INTO ombres (nom, description) VALUES
-- ('Igris', 'Chevalier de sang, l''une des ombres les plus puissantes de Sung Jinwoo'),
-- ('Beru', 'Roi des fourmis, ancien général de l''armée des fourmis'),
-- ('Iron', 'Chevalier de haut rang, fidèle serviteur'),
-- ('Tank', 'Ombre tank avec une défense exceptionnelle'),
-- ('Tusk', 'Chef de la tribu des orcs de glace'),
-- ('Greed', 'Ombre spécialisée dans les attaques rapides')
-- ON CONFLICT (nom) DO NOTHING;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Pour vérifier que tout est bien créé, exécutez :
-- SELECT * FROM ombres;
-- SELECT * FROM storage.buckets WHERE id = 'ombres';
-- =====================================================

