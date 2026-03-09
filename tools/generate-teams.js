const fs = require('fs');
const path = require('path');

const teamsDir = path.join(__dirname, '../content/teams');
const outputPath = path.join(__dirname, '../content/teamsList.json');

try {
    if (!fs.existsSync(teamsDir)) {
        console.log("Teams directory not found. Skipping.");
        process.exit(0);
    }
    const files = fs.readdirSync(teamsDir);
    const slugs = files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));

    fs.writeFileSync(outputPath, JSON.stringify(slugs, null, 2));
    console.log(`Generated teamsList.json with ${slugs.length} teams.`);
} catch (err) {
    console.error('Error generating teams list:', err);
    process.exit(1);
}
