/**
 * Script de test et démonstration pour le système d'administration des builds
 * 
 * Ce script peut être exécuté pour tester les fonctionnalités principales
 * sans avoir besoin de l'interface utilisateur complète.
 */

import { buildsChasseurs } from '../config/builds/buildsChasseurs';
import { BuildsFileManager } from './buildsFileManager';
import type { ChasseurBuild } from './types';

/**
 * Teste la validation du système
 */
export async function testValidation() {
  console.log('🧪 Test de validation des builds...');
  
  // Test avec les données actuelles
  const result = BuildsFileManager.validateBuilds(buildsChasseurs);
  
  console.log(`✅ Validation terminée:`);
  console.log(`   - Valide: ${result.isValid}`);
  console.log(`   - Erreurs: ${result.errors.length}`);
  console.log(`   - Avertissements: ${result.warnings.length}`);
  
  if (result.errors.length > 0) {
    console.log('\n❌ Erreurs détectées:');
    result.errors.slice(0, 5).forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️ Avertissements:');
    result.warnings.slice(0, 5).forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }
  
  return result;
}

/**
 * Teste la génération de contenu TypeScript
 */
export function testContentGeneration() {
  console.log('🧪 Test de génération de contenu...');
  
  // Prendre un échantillon des builds
  const sampleBuilds = buildsChasseurs.slice(0, 2);
  
  try {
    const content = BuildsFileManager.generateBuildsContent(sampleBuilds);
    console.log('✅ Génération réussie');
    console.log(`📝 Taille du contenu: ${content.length} caractères`);
    console.log('🔍 Aperçu des premières lignes:');
    console.log(content.split('\n').slice(0, 10).join('\n'));
    
    return content;
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    return null;
  }
}

/**
 * Teste la lecture et parsing du fichier
 */
export async function testFileParsing() {
  console.log('🧪 Test de lecture et parsing...');
  
  try {
    // Note: Cette fonction nécessite Node.js, elle peut échouer dans le navigateur
    const content = await BuildsFileManager.readBuildsFile();
    console.log('✅ Lecture du fichier réussie');
    
    const parsed = BuildsFileManager.parseBuildsContent(content);
    console.log(`✅ Parsing réussi: ${parsed.length} chasseurs trouvés`);
    
    return parsed;
  } catch (error) {
    console.log('ℹ️ Lecture de fichier non disponible (environnement navigateur)');
    console.log('   Cette fonctionnalité nécessite un backend Node.js');
    return buildsChasseurs; // Utiliser les données importées
  }
}

/**
 * Teste la création d'un nouveau build
 */
export function testBuildCreation() {
  console.log('🧪 Test de création de build...');
  
  const newBuild: ChasseurBuild = {
    chasseurId: 999,
    element: "feu",
    builds: [{
      id: 1,
      nom: "Test Build",
      stats: {
        "Force": "695 Points",
        "Attaque supplémentaire": "Le plus possible",
        "Taux de coup critique": "50%"
      },
      artefacts: {
        casque: {
          id: 1,
          statPrincipale: "Attaque supplémentaire",
          statsSecondaires: ["Taux de coup critique", "Force"]
        }
      },
      noyaux: {
        1: [{
          id: 1,
          statPrincipale: "Attaque supplémentaire"
        }]
      },
      sets_bonus: [
        { id: 1 },
        { id: 2 }
      ]
    }]
  };
  
  // Valider le nouveau build
  const validation = BuildsFileManager.validateBuilds([newBuild]);
  
  console.log('✅ Nouveau build créé et testé');
  console.log(`   - ID Chasseur: ${newBuild.chasseurId}`);
  console.log(`   - Élément: ${newBuild.element}`);
  console.log(`   - Nombre de builds: ${newBuild.builds.length}`);
  console.log(`   - Validation: ${validation.isValid ? '✅' : '❌'}`);
  
  return { build: newBuild, validation };
}

/**
 * Fonction principale de test
 */
export async function runAllTests() {
  console.log('🚀 Démarrage des tests du système d\'administration des builds\n');
  
  const results = {
    validation: await testValidation(),
    contentGeneration: testContentGeneration(),
    fileParsing: await testFileParsing(),
    buildCreation: testBuildCreation()
  };
  
  console.log('\n📊 Résumé des tests:');
  console.log(`   - Validation: ${results.validation.isValid ? '✅' : '❌'}`);
  console.log(`   - Génération: ${results.contentGeneration ? '✅' : '❌'}`);
  console.log(`   - Parsing: ${results.fileParsing ? '✅' : '❌'}`);
  console.log(`   - Création: ${results.buildCreation.validation.isValid ? '✅' : '❌'}`);
  
  console.log('\n🎉 Tests terminés!');
  return results;
}

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).buildsAdminTests = {
    testValidation,
    testContentGeneration,
    testFileParsing,
    testBuildCreation,
    runAllTests
  };
  
  console.log('📘 Tests disponibles dans window.buildsAdminTests');
  console.log('   Exemple: window.buildsAdminTests.runAllTests()');
}