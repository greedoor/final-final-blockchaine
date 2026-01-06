import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const amount = ethers.parseEther("10"); // Send 10 ETH to contract
    
    console.log("==========================================");
    console.log("FINANCEMENT DU CONTRAT");
    console.log("==========================================");
    console.log(`Contrat: ${CONTRACT_ADDRESS}`);
    console.log(`Montant: ${ethers.formatEther(amount)} ETH`);
    console.log(`De: ${owner.address}`);
    console.log("");
    
    // Check contract balance before
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    const balanceBefore = await contract.getBalance();
    console.log(`Solde actuel du contrat: ${ethers.formatEther(balanceBefore)} ETH`);
    console.log("");
    
    // Check owner balance
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    console.log(`Solde de l'expéditeur: ${ethers.formatEther(ownerBalance)} ETH`);
    
    if (ownerBalance < amount) {
        console.error("❌ Solde insuffisant pour financer le contrat!");
        process.exitCode = 1;
        return;
    }
    
    // Send ETH to contract
    console.log("Envoi des fonds au contrat...");
    const tx = await owner.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: amount,
    });
    
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Attente de la confirmation...");
    await tx.wait();
    
    // Check new balance
    const balanceAfter = await contract.getBalance();
    console.log("");
    console.log("✅ Transaction réussie!");
    console.log(`Nouveau solde du contrat: ${ethers.formatEther(balanceAfter)} ETH`);
    console.log("==========================================");
    console.log("");
    console.log("Vous pouvez maintenant créer des propositions!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
