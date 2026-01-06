# Solution pour l'erreur "Error du Solde"

## ✅ Vérification effectuée

Le compte `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` a **10,000 ETH**, donc le solde est correct.

---

## 🔍 Causes possibles de l'erreur

### 1. **Mauvais réseau dans MetaMask**
**Solution:**
- Vérifiez que vous êtes sur **Hardhat Local** (Chain ID: 31337)
- Pas sur Mainnet ou un autre réseau
- Le solde peut être différent selon le réseau

### 2. **Tentative de créer une proposition avec un montant trop élevé**
**Solution:**
- Le montant de la proposition doit être **inférieur au solde du contrat**
- Le contrat doit d'abord être financé (déposer des fonds)
- Vérifiez le solde du contrat dans le dashboard

### 3. **Le contrat n'a pas de fonds**
**Solution:**
- Allez dans "Execution Panel" dans l'interface
- Déposez des fonds dans le contrat d'abord
- Ensuite vous pourrez créer des propositions

### 4. **Problème de connexion au réseau**
**Solution:**
- Vérifiez que Hardhat node est toujours en cours d'exécution
- Redémarrez Hardhat node si nécessaire:
  ```bash
  cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
  npx hardhat node
  ```

---

## 🛠️ Solutions étape par étape

### Solution 1: Vérifier le réseau MetaMask

1. **Ouvrez MetaMask**
2. **Cliquez sur le réseau** (en haut)
3. **Sélectionnez "Hardhat Local"** (Chain ID: 31337)
4. **Si pas présent, ajoutez-le:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

### Solution 2: Financer le contrat

1. **Connectez-vous avec le compte Owner** (celui qui a déployé)
   - Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

2. **Dans l'interface** (http://localhost:8080):
   - Allez dans "Execution Panel"
   - Entrez un montant (ex: 5 ETH)
   - Cliquez sur "Déposer des fonds"
   - Approuvez la transaction

3. **Vérifiez** que le solde du contrat augmente

### Solution 3: Vérifier les soldes

Exécutez ce script pour vérifier tous les soldes:

```bash
cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
npx hardhat run scripts/check-balance.js --network localhost
```

### Solution 4: Envoyer de l'ETH à un compte

Si un compte n'a pas assez d'ETH, utilisez ce script:

```bash
cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
npx hardhat run scripts/send-eth.js --network localhost
```

---

## 📋 Checklist de dépannage

- [ ] Êtes-vous sur le réseau Hardhat Local (Chain ID: 31337)?
- [ ] Le compte a-t-il assez d'ETH? (Vérifié: ✅ 10,000 ETH)
- [ ] Le contrat a-t-il des fonds? (Vérifiez dans le dashboard)
- [ ] Hardhat node est-il en cours d'exécution?
- [ ] Avez-vous approuvé la transaction dans MetaMask?

---

## 🎯 Ordre recommandé pour tester

1. **Connectez MetaMask** au réseau Hardhat Local
2. **Importez le compte Owner** (pour ajouter des membres)
3. **Financer le contrat** (déposer des fonds)
4. **Ajouter des membres** (utiliser les adresses fournies)
5. **Créer une proposition** (montant < solde du contrat)
6. **Voter** sur la proposition
7. **Exécuter** la proposition (après deadline)

---

## 💡 Message d'erreur spécifique

Si vous voyez un message d'erreur spécifique, il peut indiquer:

- **"Solde insuffisant"** → Le contrat n'a pas assez de fonds
- **"Insufficient funds"** → Votre compte n'a pas assez d'ETH pour le gas
- **"Network error"** → Hardhat node n'est pas en cours d'exécution
- **"User rejected"** → Vous avez annulé la transaction dans MetaMask

---

## 🔄 Redémarrer tout

Si rien ne fonctionne, redémarrez:

1. **Arrêtez Hardhat node** (Ctrl+C dans le terminal)
2. **Redémarrez Hardhat node:**
   ```bash
   cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
   npx hardhat node
   ```

3. **Redéployez le contrat:**
   ```bash
   npm run deploy
   ```

4. **Mettez à jour l'adresse du contrat** dans `test-gui-main/test-gui-main/src/constants/contract.ts`

5. **Redémarrez le frontend:**
   ```bash
   cd "E:\symfony-project\test-gui-main\test-gui-main"
   npm run dev
   ```

---

**Dites-moi quel message d'erreur exact vous voyez et je pourrai vous aider plus précisément!**
