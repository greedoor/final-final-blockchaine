import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner] = await ethers.getSigners();
    
    // Address to send ETH to
    const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const amount = ethers.parseEther("10"); // Send 10 ETH
    
    console.log("==========================================");
    console.log("ENVOI D'ETH");
    console.log("==========================================");
    console.log(`De: ${owner.address}`);
    console.log(`Vers: ${recipientAddress}`);
    console.log(`Montant: ${ethers.formatEther(amount)} ETH`);
    console.log("");
    
    // Check owner balance first
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`Solde de l'expéditeur: ${ethers.formatEther(ownerBalance)} ETH`);
    
    if (ownerBalance < amount) {
        console.error("❌ Solde insuffisant!");
        process.exitCode = 1;
        return;
    }
    
    // Send ETH
    console.log("Envoi en cours...");
    const tx = await owner.sendTransaction({
        to: recipientAddress,
        value: amount,
    });
    
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    
    // Check new balance
    const newBalance = await ethers.provider.getBalance(recipientAddress);
    console.log("");
    console.log("✅ Transaction réussie!");
    console.log(`Nouveau solde du destinataire: ${ethers.formatEther(newBalance)} ETH`);
    console.log("==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
