// One-time script to convert flora uses from strings to arrays
import { karnatakaFlora } from '../server/services/plantnet';

function convertUsesToArray(usesString: string): string[] {
  // Split by sentence boundaries (. ! ?)
  const sentences = usesString
    .split(/[.!?]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences;
}

// Convert all plants
const converted = Object.entries(karnatakaFlora).reduce((acc, [key, plant]) => {
  const usesArray = typeof plant.uses === 'string' 
    ? convertUsesToArray(plant.uses)
    : plant.uses;
    
  acc[key] = {
    ...plant,
    uses: usesArray
  };
  
  return acc;
}, {} as Record<string, any>);

// Print the converted object for copying into plantnet.ts
console.log('const karnatakaFlora: Record<string, FloraAnalysisResult> = {');

for (const [key, plant] of Object.entries(converted)) {
  console.log(`  ${key}: {`);
  console.log(`    speciesName: "${plant.speciesName}",`);
  console.log(`    scientificName: "${plant.scientificName}",`);
  console.log(`    conservationStatus: "${plant.conservationStatus}",`);
  console.log(`    endangeredAlert: ${plant.endangeredAlert ? `"${plant.endangeredAlert}"` : 'null'},`);
  console.log(`    isEndangered: ${plant.isEndangered},`);
  console.log(`    habitat: "${plant.habitat}",`);
  console.log(`    uses: ${JSON.stringify(plant.uses, null, 6).replace(/\n/g, '\n    ')},`);
  console.log(`    threats: ${JSON.stringify(plant.threats, null, 6).replace(/\n/g, '\n    ')},`);
  console.log(`    confidence: ${plant.confidence},`);
  console.log(`  },`);
}

console.log('};');

// Also print statistics
console.error('\n===== Conversion Statistics =====');
console.error(`Total plants: ${Object.keys(converted).length}`);
console.error(`Plants with uses arrays: ${Object.values(converted).filter(p => Array.isArray(p.uses)).length}`);
console.error('\nFirst 3 examples:');
Object.entries(converted).slice(0, 3).forEach(([key, plant]) => {
  console.error(`\n${plant.speciesName}:`);
  console.error(`  Uses: ${JSON.stringify(plant.uses)}`);
});
