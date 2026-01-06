import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("🚨 DÉMONSTRATION : ATTAQUE DoS");
    console.log("==========================================");
    console.log("\n📊 État initial :");
    const initialCount = await contract.getMemberCount();
    console.log(`Nombre de membres : ${initialCount}`);
    
    console.log("\n🚨 DÉBUT DE L'ATTAQUE");
    console.log("Ajout de 50 membres malveillants...");
    console.log("(Cela simule un owner compromis)\n");
    
    const startTime = Date.now();
    
    // Ajouter 50 membres
    for (let i = 0; i < 50; i++) {
        const wallet = ethers.Wallet.createRandom();
        const tx = await contract.addMember(wallet.address);
        await tx.wait();
        if ((i + 1) % 10 === 0) {
            console.log(`✅ ${i + 1} membres ajoutés...`);
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n⏱️  Temps écoulé : ${duration} secondes`);
    
    // Vérifier l'impact
    console.log("\n📊 État après attaque :");
    const finalCount = await contract.getMemberCount();
    console.log(`Nombre total de membres : ${finalCount}`);
    
    // Tester removeMember
    console.log("\n🔍 Test de performance :");
    const firstMember = await contract.members(0);
    console.log(`Test de removeMember avec ${finalCount} membres...`);
    
    try {
        const gasEstimate = await contract.removeMember.estimateGas(firstMember);
        const gasPrice = ethers.parseUnits("20", "gwei");
        const cost = gasEstimate * gasPrice;
        
        console.log(`⛽ Gas estimé : ${gasEstimate.toString()}`);
        console.log(`💰 Coût estimé : ${ethers.formatEther(cost)} ETH`);
        console.log(`💵 Coût en USD (à $2000/ETH) : $${(Number(ethers.formatEther(cost)) * 2000).toFixed(2)}`);
    } catch (error) {
        console.log("❌ Erreur lors de l'estimation (gas trop élevé)");
    }
    
    console.log("\n==========================================");
    console.log("⚠️  IMPACT DE L'ATTAQUE :");
    console.log("==========================================");
    console.log("1. ⏱️  Temps de traitement augmenté");
    console.log("2. ⛽ Coût en gas très élevé");
    console.log("3. 🐌 Interface peut timeout");
    console.log("4. 💰 Coûts prohibitifs pour removeMember");
    console.log("\n💡 SOLUTION : Limiter le nombre max de membres");
    console.log("==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
