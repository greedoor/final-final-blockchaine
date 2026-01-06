import { network } from "hardhat";

async function main() {
    console.log("⏳ Avancement du temps de 1 heure...");

    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    console.log("✅ Temps avancé ! Les propositions devraient être expirées.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
