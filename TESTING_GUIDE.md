# SafeClub Testing Guide

## 🚀 Quick Start

### Services Running:
1. **Hardhat Blockchain Node**: Running on `http://127.0.0.1:8545`
2. **Frontend Interface**: Running on `http://localhost:8080`
3. **Smart Contract**: Deployed at `0x5FbDB2315678afecb367f032d93F642f64180aa3`

---

## 📍 Access the Interface

**Frontend URL**: http://localhost:8080

---

## 🔧 Setup Instructions

### Prerequisites:
- ✅ MetaMask browser extension installed
- ✅ Hardhat node running (already started)
- ✅ Frontend dev server running (already started)

### Step 1: Configure MetaMask

1. **Open MetaMask** in your browser
2. **Add Hardhat Network** (if not already added):
   - Click the network dropdown (usually shows "Ethereum Mainnet")
   - Click "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name**: Hardhat Local
     - **RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `31337`
     - **Currency Symbol**: `ETH`
   - Click "Save"

3. **Import Test Account** (to get ETH):
   - In MetaMask, click the account icon → "Import Account"
   - Use this private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH on the Hardhat network

### Step 2: Connect to the Interface

1. **Open the frontend**: http://localhost:8080
2. **Click "Connecter MetaMask"** button
3. **Approve the connection** in MetaMask popup
4. **Switch to Hardhat Local network** if prompted

---

## 🧪 Testing Scenarios

### Test 1: View Dashboard
- ✅ Check that you see:
  - Your wallet balance
  - Contract balance (should be 0 initially)
  - Total members count (should be 1 - the owner)
  - Quorum value (should be 2)

### Test 2: Add Members (Owner Only)
1. **As Owner** (the account that deployed):
   - Go to "Admin Panel" section
   - Enter a member address (use another MetaMask account)
   - Click "Ajouter Membre"
   - ✅ Verify member is added
   - ✅ Check member count increases

2. **As Non-Owner**:
   - Switch to a different MetaMask account
   - Try to add a member
   - ✅ Should fail or show error (owner-only function)

### Test 3: Fund the Contract
1. **Deposit Funds**:
   - In "Execution Panel" section
   - Enter amount (e.g., 5 ETH)
   - Click "Déposer des fonds"
   - Approve transaction in MetaMask
   - ✅ Verify contract balance increases

### Test 4: Create a Proposal
1. **As a Member**:
   - Switch to a member account (or use owner who is also a member)
   - In "Proposals" section, click "Créer une proposition"
   - Fill in:
     - **Recipient**: Another address (or your own)
     - **Amount**: e.g., 2 ETH (must be less than contract balance)
     - **Description**: "Test proposal"
     - **Duration**: 60 seconds
   - Click "Créer"
   - Approve transaction
   - ✅ Verify proposal appears in the list

### Test 5: Vote on Proposal
1. **As Different Members**:
   - Switch to member account 1
   - Find the proposal in the list
   - Click "Voter Oui" or "Voter Non"
   - Approve transaction
   - ✅ Verify vote count updates
   - ✅ Verify "Vous avez voté" badge appears

2. **Try Double Voting**:
   - Try to vote again on the same proposal
   - ✅ Should fail (already voted)

### Test 6: Execute Proposal
1. **Wait for Deadline** (or use time manipulation if available):
   - After voting period ends (60 seconds)
   - Ensure quorum is met (at least 2 yes votes)
   - Ensure majority (more yes than no votes)
   - Click "Exécuter" on the proposal
   - Approve transaction
   - ✅ Verify proposal status changes to "Exécutée"
   - ✅ Verify recipient receives the funds
   - ✅ Verify contract balance decreases

### Test 7: View Proposal Details
- ✅ Check proposal shows:
  - Recipient address
  - Amount
  - Description
  - Deadline countdown
  - Vote counts (Yes/No)
  - Execution status
  - Who has voted

### Test 8: Remove Member (Owner Only)
1. **As Owner**:
   - Go to Admin Panel
   - Find a member in the list
   - Click "Retirer"
   - ✅ Verify member is removed
   - ✅ Verify member count decreases
   - ✅ Verify removed member cannot vote

---

## 🔍 Hardhat Test Accounts

The Hardhat node provides these test accounts with 10,000 ETH each:

| Account | Address | Private Key |
|---------|---------|-------------|
| Account 0 (Owner) | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| Account 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d2` |
| Account 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| Account 3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |
| Account 4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9ba9ac5ab2d8637b` |

**Import these into MetaMask** to test with multiple accounts!

---

## 🐛 Troubleshooting

### "MetaMask not detected"
- Install MetaMask extension: https://metamask.io
- Refresh the page

### "Cannot connect to Hardhat network"
- Check Hardhat node is running: `npx hardhat node` in SafeClub-Final directory
- Verify RPC URL: `http://127.0.0.1:8545`
- Check MetaMask network settings

### "Contract address not found"
- Contract is deployed at: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Verify in `test-gui-main/test-gui-main/src/constants/contract.ts`

### "Transaction failed"
- Check you have enough ETH
- Verify you're on the correct network (Hardhat Local, Chain ID 31337)
- Check contract has enough balance (for proposals)

### "Not a member" error
- Only members can create proposals and vote
- Owner must add you as a member first

### Frontend not loading
- Check dev server is running: `npm run dev` in `test-gui-main/test-gui-main`
- Check terminal for errors
- Try clearing browser cache

---

## 📊 Expected Test Results

### After Initial Setup:
- ✅ Contract deployed successfully
- ✅ Owner is automatically a member
- ✅ Quorum set to 2
- ✅ Contract balance: 0 ETH

### After Adding Members:
- ✅ Member count increases
- ✅ New members can create proposals
- ✅ New members can vote

### After Creating Proposal:
- ✅ Proposal appears in list
- ✅ Proposal shows correct details
- ✅ Members can vote on it

### After Voting:
- ✅ Vote counts update in real-time
- ✅ "Has voted" status shows correctly
- ✅ Cannot vote twice

### After Execution:
- ✅ Proposal marked as executed
- ✅ Funds transferred to recipient
- ✅ Contract balance decreases

---

## 🎯 Quick Test Checklist

- [ ] Connect MetaMask to Hardhat network
- [ ] Import test account with ETH
- [ ] Connect wallet to frontend
- [ ] View dashboard (balance, members, quorum)
- [ ] Add a member (as owner)
- [ ] Fund the contract
- [ ] Create a proposal
- [ ] Vote on proposal (multiple accounts)
- [ ] Execute proposal (after deadline)
- [ ] Remove a member (as owner)

---

## 📝 Notes

- **Quorum**: Currently set to 2 (needs at least 2 yes votes to execute)
- **Majority**: Must have more yes votes than no votes
- **Deadline**: Proposals have a voting deadline (60 seconds in test)
- **Owner**: The deployer account is automatically a member
- **Network**: All testing is on local Hardhat network (Chain ID 31337)

---

## 🔗 Useful Commands

### Start Hardhat Node:
```bash
cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
npx hardhat node
```

### Deploy Contract:
```bash
cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
npm run deploy
```

### Start Frontend:
```bash
cd "E:\symfony-project\test-gui-main\test-gui-main"
npm run dev
```

### Run Tests:
```bash
cd "E:\symfony-project\blockchaine-final-version-main\blockchaine-final-version-main\SafeClub-Final"
npm test
```

---

**Happy Testing! 🚀**
