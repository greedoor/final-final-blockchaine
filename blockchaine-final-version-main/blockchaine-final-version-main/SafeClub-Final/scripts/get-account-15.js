import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const signers = await ethers.getSigners();
    
    // Account 15 (index 15, which is the 16th account)
    const account15 = signers[15];
    
    if (!account15) {
        console.error("Account 15 n'existe pas. Hardhat fournit généralement 20 comptes (0-19).");
        process.exitCode = 1;
        return;
    }
    
    console.log("==========================================");
    console.log("COMPTE 15 (Account 15)");
    console.log("==========================================");
    console.log(`Address: ${account15.address}`);
    console.log("");
    
    // Get balance
    const balance = await ethers.provider.getBalance(account15.address);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
    console.log("");
    
    // Note: We can't get the private key directly from Hardhat
    // But we can provide the standard Hardhat account 15 private key
    console.log("==========================================");
    console.log("PRIVATE KEY (Standard Hardhat Account 15):");
    console.log("==========================================");
    console.log("Note: Hardhat utilise des clés privées déterministes.");
    console.log("Pour le compte 15, utilisez la clé privée standard:");
    console.log("");
    console.log("0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61");
    console.log("");
    console.log("Ou sans le préfixe 0x:");
    console.log("8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61");
    console.log("==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
