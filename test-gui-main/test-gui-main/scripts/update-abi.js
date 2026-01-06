const fs = require('fs');
const path = require('path');

// Chemin vers votre contrat compilé
const artifactPath = path.join(
  __dirname,
  '../../../SafeClub-Final/artifacts/contracts/SafeClub.sol/SafeClub.json'
);

const configPath = path.join(__dirname, '../src/constants/contract.ts');

try {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const abi = artifact.abi;

  let config = fs.readFileSync(configPath, 'utf8');
  
  const abiString = JSON.stringify(abi, null, 2);
  config = config.replace(
    /export const SAFECLUB_ABI = \[[\s\S]*?\] as const;/,
    `export const SAFECLUB_ABI = ${abiString} as const;`
  );

  fs.writeFileSync(configPath, config);
  console.log('✅ ABI mis à jour avec succès!');
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
