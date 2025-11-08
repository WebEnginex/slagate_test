-- Table pour stocker les liens YouTube
CREATE TABLE IF NOT EXISTS youtube_links (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(200),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_youtube_links_active ON youtube_links(is_active);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_youtube_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER youtube_links_updated_at
  BEFORE UPDATE ON youtube_links
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_links_updated_at();

-- Commentaires pour la documentation
COMMENT ON TABLE youtube_links IS 'Stockage des liens YouTube pour affichage sur la page d''accueil';
COMMENT ON COLUMN youtube_links.url IS 'URL complète de la vidéo YouTube ou ID de la vidéo';
COMMENT ON COLUMN youtube_links.title IS 'Titre optionnel pour identifier le lien';
COMMENT ON COLUMN youtube_links.description IS 'Description optionnelle';
COMMENT ON COLUMN youtube_links.is_active IS 'Indique si le lien doit être affiché sur le site';
