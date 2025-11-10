-- =====================================================
-- POLITIQUES RLS POUR LA TABLE OMBRES
-- =====================================================
-- Ce script configure les politiques de sécurité Row Level Security (RLS)
-- pour la table 'ombres' et le bucket de storage 'ombres'
-- =====================================================

-- 1. Activer RLS sur la table ombres (si pas déjà activé)
ALTER TABLE ombres ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Lecture publique des ombres" ON ombres;
DROP POLICY IF EXISTS "Insertion admin des ombres" ON ombres;
DROP POLICY IF EXISTS "Modification admin des ombres" ON ombres;
DROP POLICY IF EXISTS "Suppression admin des ombres" ON ombres;

-- 3. Politique SELECT (lecture publique)
-- Tout le monde peut lire les ombres (pour affichage public)
CREATE POLICY "Lecture publique des ombres"
ON ombres
FOR SELECT
TO public
USING (true);

-- 4. Politique INSERT (création réservée aux admins)
-- Seuls les utilisateurs authentifiés peuvent créer des ombres
CREATE POLICY "Insertion admin des ombres"
ON ombres
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Politique UPDATE (modification réservée aux admins)
-- Seuls les utilisateurs authentifiés peuvent modifier des ombres
CREATE POLICY "Modification admin des ombres"
ON ombres
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Politique DELETE (suppression réservée aux admins)
-- Seuls les utilisateurs authentifiés peuvent supprimer des ombres
CREATE POLICY "Suppression admin des ombres"
ON ombres
FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- POLITIQUES RLS POUR LE BUCKET STORAGE 'ombres'
-- =====================================================

-- 1. Supprimer les anciennes politiques du bucket si elles existent
DROP POLICY IF EXISTS "Lecture publique des images ombres" ON storage.objects;
DROP POLICY IF EXISTS "Upload admin des images ombres" ON storage.objects;
DROP POLICY IF EXISTS "Modification admin des images ombres" ON storage.objects;
DROP POLICY IF EXISTS "Suppression admin des images ombres" ON storage.objects;

-- 2. Politique SELECT (lecture publique des images)
-- Tout le monde peut voir les images des ombres
CREATE POLICY "Lecture publique des images ombres"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ombres');

-- 3. Politique INSERT (upload réservé aux admins)
-- Seuls les utilisateurs authentifiés peuvent uploader des images
CREATE POLICY "Upload admin des images ombres"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ombres');

-- 4. Politique UPDATE (modification réservée aux admins)
-- Seuls les utilisateurs authentifiés peuvent modifier des images
CREATE POLICY "Modification admin des images ombres"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'ombres')
WITH CHECK (bucket_id = 'ombres');

-- 5. Politique DELETE (suppression réservée aux admins)
-- Seuls les utilisateurs authentifiés peuvent supprimer des images
CREATE POLICY "Suppression admin des images ombres"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'ombres');

-- =====================================================
-- VÉRIFICATION DES POLITIQUES
-- =====================================================
-- Pour vérifier que les politiques sont bien créées, exécutez :
-- SELECT * FROM pg_policies WHERE tablename = 'ombres';
-- SELECT * FROM storage.policies WHERE bucket_id = 'ombres';
-- =====================================================

