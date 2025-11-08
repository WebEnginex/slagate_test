-- Activation de Row Level Security sur la table sets_bonus
ALTER TABLE sets_bonus ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (tous les utilisateurs peuvent lire)
CREATE POLICY "Sets bonus - Public read" ON sets_bonus
    FOR SELECT USING (true);

-- Politique : INSERT pour les utilisateurs authentifiés seulement
CREATE POLICY "Sets bonus - Authenticated insert" ON sets_bonus
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique : UPDATE pour les utilisateurs authentifiés seulement
CREATE POLICY "Sets bonus - Authenticated update" ON sets_bonus
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique : DELETE pour les utilisateurs authentifiés seulement
CREATE POLICY "Sets bonus - Authenticated delete" ON sets_bonus
    FOR DELETE USING (auth.role() = 'authenticated');

-- Commentaires pour la documentation
COMMENT ON TABLE sets_bonus IS 'Bonus de set disponibles dans le jeu Solo Leveling: Arise';
COMMENT ON COLUMN sets_bonus.id IS 'Identifiant unique du set bonus';
COMMENT ON COLUMN sets_bonus.nom IS 'Nom du set bonus';
COMMENT ON COLUMN sets_bonus.description IS 'Description des effets et bonus du set';
COMMENT ON COLUMN sets_bonus.last_modified IS 'Date et heure de la dernière modification (mise à jour automatique par trigger)';
