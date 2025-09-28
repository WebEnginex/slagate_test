-- Column element already exists in jinwoo_armes table
-- Just migrate data from arme_element URLs to element names
UPDATE jinwoo_armes 
SET element = CASE 
    WHEN arme_element LIKE '%Feu_element%' THEN 'Feu'
    WHEN arme_element LIKE '%Eau_element%' THEN 'Eau' 
    WHEN arme_element LIKE '%Vent_element%' THEN 'Vent'
    WHEN arme_element LIKE '%Lumiere_element%' THEN 'Lumière'
    WHEN arme_element LIKE '%Tenebre_element%' THEN 'Ténèbres'
    WHEN arme_element LIKE '%Terre_element%' THEN 'Terre'
    ELSE NULL
END
WHERE arme_element IS NOT NULL;

-- Verify the migration (optional - you can run this to check)
-- SELECT nom, arme_element, element FROM jinwoo_armes WHERE element IS NOT NULL LIMIT 10;