const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a readline interface to prompt the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to copy a file and replace the token
function copyFileWithTokenReplacement(srcFile, destFile, token, replacement) {
    const content = fs.readFileSync(srcFile, 'utf8');
    const replacedContent = content.replace(new RegExp(token, 'g'), replacement);
    fs.writeFileSync(destFile, replacedContent, 'utf8');
}

// Function to copy the folder
function copyFolderWithTokenReplacement(srcDir, destDir, token, replacement) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir);
    for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);

        if (fs.lstatSync(srcPath).isDirectory()) {
            // Recursive copy for subdirectories
            copyFolderWithTokenReplacement(srcPath, destPath, token, replacement);
        } else {
            // Copy and replace token in files
            copyFileWithTokenReplacement(srcPath, destPath, token, replacement);
        }
    }
}

function camelToPascal(camelCaseStr) {
    if (!camelCaseStr) return ''; // Handle empty or invalid input
    return camelCaseStr[0].toUpperCase() + camelCaseStr.slice(1);
}

// Prompt the user for the folder name
rl.question('Enter the name of the new problem (use camelCase only!): ', (folderName) => {
    console.log('DIR NAME', __dirname)
    const srcFolder = path.join(__dirname, 'source'); // Change this to your source folder
    const destFolder = path.join(__dirname, folderName);
    const token = 'PROBLEM_SOLUTION_EXPORT_NAME'; // The token to replace
    const tokenReplacement = camelToPascal(folderName);

    try {
        // Copy the folder and replace the token
        copyFolderWithTokenReplacement(srcFolder, destFolder, token, tokenReplacement);
        console.log(`Folder '${folderName}' created successfully with content copied and token replaced.`);
    } catch (err) {
        console.error('An error occurred:', err.message);
    }

    rl.close();
});
