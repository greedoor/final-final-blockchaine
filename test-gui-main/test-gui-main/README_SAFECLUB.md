# SafeClub - Decentralized Governance GUI

A complete React + TypeScript frontend for the SafeClub decentralized autonomous organization (DAO) running on Ethereum/Hardhat blockchain.

## 🎯 Overview

SafeClub is a decentralized treasury management system that allows:
- **Members** to create and vote on funding proposals
- **Owners** to manage members and execute approved proposals
- **Transparent** fund management with real-time balance tracking

## ✨ Features

### Governance
- 📝 Create proposals with custom titles, descriptions, amounts, and recipient addresses
- 🗳️ Democratic voting (FOR/AGAINST)
- ⏱️ Deadline tracking for proposals
- ✅ Automatic execution when approved
- 👥 Member and owner role management

### Wallet Integration
- 🦊 MetaMask connection
- 💰 Real-time balance display
- 🔗 Automatic network switching (Hardhat Local Network)
- 🏷️ Member/Owner status badges

### User Interface
- 📱 Fully responsive design
- 🌐 French language support
- 📊 Real-time contract data
- 🎨 Modern UI with Shadcn components
- ⚡ Hot module reloading (HMR)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Web3 Library**: ethers.js v6.16.0
- **UI Components**: Shadcn/ui with Radix UI
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router v6
- **State Management**: React Hooks + Context

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- MetaMask browser extension
- Hardhat blockchain node running locally

### Setup

```bash
# Clone repository
git clone <your-repo-url>
cd test-gui-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:8080**

## 🚀 Quick Start

### 1. Start Hardhat Blockchain

```bash
# In your Hardhat project
npx hardhat node
```

This starts a local blockchain on `http://127.0.0.1:8545`

### 2. Deploy SafeClub Contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address.

### 3. Update Contract Address

Edit `src/constants/contract.ts`:

```typescript
export const CONTRACT_ADDRESS = "0x..." // Your deployed address
```

### 4. Connect MetaMask

1. Open http://localhost:8080
2. Click "Connecter MetaMask"
3. Approve connection
4. Switch to Hardhat Local Network (auto-prompted)
5. Dashboard loads automatically

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx           # Wallet info & navigation
│   │   ├── ProposalList.tsx     # Voting interface
│   │   ├── StatCard.tsx         # Metrics display
│   │   ├── AdminPanel.tsx       # Member management
│   │   └── ExecutionPanel.tsx   # Fund deposits
│   └── ui/                      # Shadcn components
├── hooks/
│   ├── useWeb3.ts              # Web3 logic & contract interactions
│   └── use-toast.ts            # Toast notifications
├── constants/
│   └── contract.ts             # ABI & contract constants
├── pages/
│   ├── Index.tsx               # Main dashboard
│   └── NotFound.tsx            # 404 page
├── App.tsx                     # Router setup
└── main.tsx                    # React entry point
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run update-abi   # Auto-sync contract ABI
```

## 📝 Component Reference

### Header
Displays wallet address, balance, and member/owner status.

```tsx
<Header /> // Uses useWeb3 hook internally
```

### ProposalList
Shows all proposals with voting interface.

```tsx
<ProposalList proposals={proposals} />
```

### StatCard
Reusable metric display component.

```tsx
<StatCard 
  title="Solde du Contrat"
  value="42.5 ETH"
  subtitle="Fonds totaux"
/>
```

### AdminPanel
Owner-only member management interface.

```tsx
<AdminPanel 
  isConnected={account !== null}
  onAddMember={addMember}
/>
```

### ExecutionPanel
Fund deposit functionality.

```tsx
<ExecutionPanel onDepositFunds={depositFunds} />
```

## 🎮 useWeb3 Hook

Central hook for all Web3 interactions:

```typescript
const {
  account,              // User's wallet address
  balance,              // ETH balance
  isMember,            // Is user a member?
  isOwner,             // Is user the owner?
  contractBalance,     // Contract's ETH balance
  totalMembers,        // Total member count
  majorityNeeded,      // Votes needed for approval
  proposals,           // All proposals
  connectWallet,       // Connect MetaMask
  createProposal,      // Create new proposal
  vote,               // Vote on proposal
  executeProposal,    // Execute approved proposal
  depositFunds,       // Deposit ETH
  addMember,          // Add member (owner)
  removeMember,       // Remove member (owner)
  refresh,            // Reload contract data
} = useWeb3();
```

## 🧪 Testing

### Connect with Test Account
MetaMask provides test accounts with unlimited ETH when you start `npx hardhat node`

### Create a Proposal
1. Connect wallet as owner/member
2. Scroll to proposals section
3. Enter proposal details
4. Submit transaction

### Vote on Proposal
1. View existing proposals
2. Click FOR or AGAINST button
3. Confirm in MetaMask
4. Vote counted automatically

### Execute Proposal
1. Wait for voting deadline
2. If majority achieved, EXECUTE button appears
3. Click to transfer funds
4. Proposal marked as executed

## 🐛 Troubleshooting

### "MetaMask not detected"
→ Install MetaMask: https://metamask.io

### "Cannot connect to custom network"
→ Ensure Hardhat is running: `npx hardhat node`

### "Contract address not found"
→ Update CONTRACT_ADDRESS in `src/constants/contract.ts`

### TypeScript errors
```bash
npx tsc --noEmit
npm install
```

### Clear everything and restart
```bash
rm -rf node_modules dist
npm install
npm run build
npm run dev
```

## 📚 Contract Interface

Expected SafeClub contract functions:

```solidity
interface ISafeClub {
    // View Functions
    function owner() external view returns (address);
    function members(address) external view returns (bool);
    function proposals(uint) external view returns (Proposal);
    function proposalCount() external view returns (uint);
    function quorum() external view returns (uint);
    function memberCount() external view returns (uint);
    function getContractBalance() external view returns (uint);
    function hasVoted(uint proposalId, address voter) external view returns (bool);

    // State Functions
    function createProposal(string memory title, string memory description, uint amount, address recipient) external;
    function vote(uint proposalId, bool support) external;
    function executeProposal(uint proposalId) external;
    function addMember(address member) external;
    function removeMember(address member) external;
    function depositFunds() external payable;

    // Events
    event ProposalCreated(uint indexed proposalId, address indexed creator, string title);
    event Voted(uint indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint indexed proposalId);
}
```

## 📄 License

MIT

## 👤 Author

Built for SafeClub DAO

---

**Need help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.
