# Administration des Builds - Guide d'Utilisation

## Vue d'ensemble

Le système d'administration des builds permet de modifier le fichier `buildsChasseurs.ts` directement depuis une interface web intuitive. Plus besoin de modifier manuellement le fichier TypeScript !

## Accès à l'interface

L'interface d'administration est accessible à l'URL : **`/admin/builds`**

Exemple : `http://localhost:5173/admin/builds`

## Fonctionnalités principales

### 1. **Sélection de chasseurs**
- Recherche par nom de chasseur
- Filtrage par élément (Feu, Eau, Vent, Lumière, Ténèbres, Jin-Woo)
- Vue séparée entre chasseurs configurés et chasseurs disponibles
- Ajout/suppression rapide de configurations de chasseurs

### 2. **Éditeur de builds complet**
- **Gestion multi-builds** : Chaque chasseur peut avoir plusieurs builds
- **Duplication de builds** : Copie rapide d'une configuration existante
- **Organisation par onglets** : Artefacts, Noyaux, Stats, Sets Bonus

### 3. **Éditeur d'artefacts**
- Configuration par slots (Casque, Armure, Gants, Bottes, Collier, Bracelet, Bague, Boucles)
- Sélection d'artefacts depuis la base de données
- Configuration des stats principales et secondaires
- Aperçu visual de tous les emplacements

### 4. **Éditeur de noyaux**
- 3 slots de noyaux disponibles
- Support multi-noyaux par slot
- Configuration des stats principales
- Validation automatique

### 5. **Éditeur de statistiques**
- Templates prédéfinis (DPS Standard, Tank/Support, Critique DPS)
- Ajout/suppression libre de statistiques
- Suggestions automatiques de valeurs
- Validation des formats

### 6. **Éditeur de sets bonus**
- Sélection depuis la base de données Supabase
- Prévention des doublons
- Aperçu des sets actifs
- Statistiques en temps réel

### 7. **Validation et sauvegarde**
- Validation automatique en temps réel
- Détection d'erreurs et d'avertissements
- Sauvegarde sécurisée avec backup automatique
- Mise à jour des dates de modification

## Architecture technique

### Fichiers principaux

```
src/admin/
├── BuildsAdminPage.tsx          # Page principale d'administration
├── types.ts                     # Types TypeScript pour l'éditeur
├── buildsFileManager.ts         # Gestion du fichier buildsChasseurs.ts
├── referenceDataManager.ts      # Chargement des données Supabase
└── components/
    ├── ChasseurSelector.tsx     # Sélecteur de chasseurs
    ├── BuildEditor.tsx          # Éditeur principal de builds
    ├── ArtefactEditor.tsx       # Éditeur spécialisé artefacts
    ├── NoyauEditor.tsx          # Éditeur spécialisé noyaux
    ├── StatsEditor.tsx          # Éditeur spécialisé statistiques
    └── SetsBonusEditor.tsx      # Éditeur spécialisé sets bonus
```

### Classes utilitaires

- **`BuildsFileManager`** : Gère la lecture/écriture du fichier `buildsChasseurs.ts`
- **`ReferenceDataManager`** : Charge les données de référence depuis Supabase

## Utilisation étape par étape

### 1. Accéder à l'interface
Naviguez vers `/admin/builds` dans votre navigateur.

### 2. Sélectionner un chasseur
- Utilisez la recherche ou les filtres dans la colonne de gauche
- Cliquez sur un chasseur existant pour l'éditer
- Ou ajoutez un nouveau chasseur avec le sélecteur en bas

### 3. Configurer le build
- **Artefacts** : Sélectionnez les artefacts pour chaque slot et configurez leurs stats
- **Noyaux** : Ajoutez des noyaux dans les 3 slots disponibles
- **Stats** : Utilisez les templates ou configurez manuellement
- **Sets Bonus** : Sélectionnez les sets depuis la base de données

### 4. Valider et sauvegarder
- Cliquez sur "Valider" pour vérifier la configuration
- Corrigez les erreurs si nécessaire
- Cliquez sur "Sauvegarder" pour appliquer les modifications

## Validation automatique

Le système effectue plusieurs vérifications :

### Erreurs bloquantes
- IDs manquants ou invalides
- Éléments incorrects
- Builds vides
- Format de données incorrect

### Avertissements non-bloquants
- Artefacts manquants dans certains slots
- Noyaux non configurés
- Stats recommandées manquantes

## Sécurité et sauvegardes

- **Backup automatique** : Chaque sauvegarde crée une copie du fichier original
- **Validation stricte** : Impossible de sauvegarder des données invalides
- **Rollback** : Les backups permettent de revenir en arrière si nécessaire

## Limitations actuelles

⚠️ **Important** : Dans la version actuelle, la sauvegarde physique du fichier nécessite un backend Node.js. Pour le moment, le système :
- Valide et prépare les données
- Simule la sauvegarde
- Met à jour l'interface

Pour une implémentation complète en production, il faudrait :
1. Un serveur Node.js pour gérer l'écriture de fichiers
2. Ou une migration vers une base de données complète

## Dépannage

### Erreurs communes
1. **"Données de référence introuvables"** : Vérifiez la connexion Supabase
2. **"Validation échouée"** : Consultez la section validation pour corriger les erreurs
3. **"Chasseur non trouvé"** : Assurez-vous que le chasseur existe dans la base de données

### Performance
- Le chargement initial peut prendre quelques secondes (données Supabase)
- La validation se fait en temps réel
- Les modifications sont sauvegardées localement pendant l'édition

## Évolutions futures

- Sauvegarde backend complète
- Import/Export de configurations
- Historique des modifications
- Prévisualisation des builds
- Génération automatique de builds optimisés
- Interface mobile améliorée

## Support

Pour toute question ou problème, consultez :
1. La console développeur du navigateur pour les erreurs
2. Les messages de validation dans l'interface
3. Les logs de l'application