import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner, account1, account2] = await ethers.getSigners();
    
    console.log("==========================================");
    console.log("VÉRIFICATION DES SOLDES");
    console.log("==========================================");
    
    // Check owner balance
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`Owner (${owner.address}):`);
    console.log(`  Solde: ${ethers.formatEther(ownerBalance)} ETH`);
    console.log("");
    
    // Check account 1 balance
    const account1Balance = await ethers.provider.getBalance(account1.address);
    console.log(`Account 1 (${account1.address}):`);
    console.log(`  Solde: ${ethers.formatEther(account1Balance)} ETH`);
    console.log("");
    
    // Check account 2 balance
    const account2Balance = await ethers.provider.getBalance(account2.address);
    console.log(`Account 2 (${account2.address}):`);
    console.log(`  Solde: ${ethers.formatEther(account2Balance)} ETH`);
    console.log("");
    
    // Check specific account if provided
    const targetAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const targetBalance = await ethers.provider.getBalance(targetAddress);
    console.log(`Account cible (${targetAddress}):`);
    console.log(`  Solde: ${ethers.formatEther(targetBalance)} ETH`);
    console.log("");
    
    console.log("==========================================");
    
    // If target account has low balance, offer to send ETH
    if (targetBalance < ethers.parseEther("1")) {
        console.log("⚠️  Le compte cible a un solde faible!");
        console.log("Voulez-vous envoyer de l'ETH? Utilisez send-eth.js");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
