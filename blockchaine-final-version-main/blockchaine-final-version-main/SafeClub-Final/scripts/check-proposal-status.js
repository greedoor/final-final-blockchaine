import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("📊 ÉTAT ACTUEL DES PROPOSITIONS");
    console.log("==========================================");
    
    const proposalCount = await contract.nextProposalId();
    console.log(`\nNombre total de propositions : ${proposalCount}`);
    
    if (proposalCount === 0n) {
        console.log("Aucune proposition trouvée.");
        return;
    }
    
    const quorum = await contract.quorum();
    console.log(`Quorum requis : ${quorum}\n`);
    
    for (let i = 0; i < proposalCount; i++) {
        try {
            const proposal = await contract.getProposal(i);
            const currentTime = await ethers.provider.getBlock("latest").then(b => b.timestamp);
            const deadline = Number(proposal.deadline);
            const isActive = deadline > currentTime && !proposal.executed;
            const isExpired = deadline <= currentTime && !proposal.executed;
            
            console.log(`Proposition #${i}:`);
            console.log(`  Montant : ${ethers.formatEther(proposal.amount)} ETH`);
            console.log(`  Bénéficiaire : ${proposal.recipient}`);
            console.log(`  Votes OUI : ${proposal.yesVotes}`);
            console.log(`  Votes NON : ${proposal.noVotes}`);
            console.log(`  Statut : ${proposal.executed ? '✅ Exécutée' : isActive ? '🟢 Active' : isExpired ? '🔴 Expirée' : '❓ Inconnu'}`);
            console.log(`  Quorum atteint : ${proposal.yesVotes >= quorum ? '✅ OUI' : '❌ NON'}`);
            console.log(`  Majorité : ${proposal.yesVotes > proposal.noVotes ? '✅ OUI' : proposal.yesVotes < proposal.noVotes ? '❌ NON' : '⚖️ ÉGALITÉ'}`);
            console.log(`  Deadline : ${new Date(deadline * 1000).toLocaleString()}`);
            console.log("");
        } catch (error) {
            console.log(`Proposition #${i}: Erreur lors du chargement`);
        }
    }
    
    console.log("==========================================");
    console.log("📊 ÉTAT DES MEMBRES");
    console.log("==========================================");
    
    const memberCount = await contract.getMemberCount();
    console.log(`\nNombre total de membres : ${memberCount}\n`);
    
    for (let i = 0; i < memberCount; i++) {
        try {
            const memberAddr = await contract.members(i);
            const isMember = await contract.isMember(memberAddr);
            console.log(`Membre ${i}: ${memberAddr} ${isMember ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`Membre ${i}: Erreur`);
        }
    }
    
    console.log("\n==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
