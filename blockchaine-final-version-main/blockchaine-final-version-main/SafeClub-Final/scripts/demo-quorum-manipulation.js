import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner, member1, member2] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("🚨 DÉMONSTRATION : MANIPULATION DU QUORUM");
    console.log("==========================================");
    
    // Récupérer dernière proposition
    const proposalCount = await contract.nextProposalId();
    if (proposalCount === 0n) {
        console.log("❌ Aucune proposition trouvée. Créez d'abord une proposition.");
        return;
    }
    
    const lastProposalId = proposalCount - 1n;
    
    console.log("\n📊 ÉTAT INITIAL :");
    const quorumBefore = await contract.quorum();
    console.log(`Quorum actuel : ${quorumBefore}`);
    
    const proposal = await contract.getProposal(lastProposalId);
    console.log(`\nProposition #${lastProposalId} :`);
    console.log(`  Montant : ${ethers.formatEther(proposal.amount)} ETH`);
    console.log(`  Votes OUI : ${proposal.yesVotes}`);
    console.log(`  Votes NON : ${proposal.noVotes}`);
    console.log(`  Quorum requis : ${quorumBefore}`);
    console.log(`  Quorum atteint : ${proposal.yesVotes >= quorumBefore ? '✅ OUI' : '❌ NON'}`);
    console.log(`  Majorité : ${proposal.yesVotes > proposal.noVotes ? '✅ OUI' : '❌ NON'}`);
    
    if (proposal.yesVotes >= quorumBefore && proposal.yesVotes > proposal.noVotes) {
        console.log("\n✅ La proposition est approuvée et peut être exécutée !");
    } else {
        console.log("\n⚠️  La proposition n'est pas encore approuvée.");
        console.log("💡 Créez une proposition et votez d'abord dans l'interface.");
        return;
    }
    
    console.log("\n==========================================");
    console.log("🚨 ATTAQUE : Changement du quorum");
    console.log("==========================================");
    console.log("Owner malveillant change le quorum de 2 à 10...\n");
    
    const tx = await contract.setQuorum(10);
    await tx.wait();
    
    const quorumAfter = await contract.quorum();
    console.log(`✅ Nouveau quorum : ${quorumAfter}`);
    
    console.log("\n📊 ÉTAT APRÈS ATTAQUE :");
    const proposalAfter = await contract.getProposal(lastProposalId);
    console.log(`  Votes OUI : ${proposalAfter.yesVotes}`);
    console.log(`  Votes NON : ${proposalAfter.noVotes}`);
    console.log(`  Quorum requis : ${quorumAfter}`);
    console.log(`  Quorum atteint : ${proposalAfter.yesVotes >= quorumAfter ? '✅ OUI' : '❌ NON'}`);
    
    console.log("\n==========================================");
    console.log("⚠️  IMPACT DE L'ATTAQUE :");
    console.log("==========================================");
    console.log("❌ La proposition ne peut plus être exécutée !");
    console.log("❌ Les fonds restent bloqués dans le contrat");
    console.log("❌ La volonté démocratique est ignorée");
    console.log("\n💡 SOLUTION : Timelock pour changement de quorum");
    console.log("   (Délai de 7 jours avant application)");
    console.log("==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
