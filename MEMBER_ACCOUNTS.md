# SafeClub Test Accounts for Members

## 📋 Available Test Accounts

These are the default Hardhat test accounts. You can import them into MetaMask and use their addresses to add as members.

---

## 🎯 Account Details

### Account 1 (Recommended for Member 1)
- **Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d2`
- **Balance**: 10,000 ETH

### Account 2 (Recommended for Member 2)
- **Address**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key**: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Balance**: 10,000 ETH

### Account 3 (Recommended for Member 3)
- **Address**: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- **Private Key**: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
- **Balance**: 10,000 ETH

### Account 4 (Recommended for Member 4)
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key**: `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9ba9ac5ab2d8637b`
- **Balance**: 10,000 ETH

### Account 5 (Recommended for Member 5)
- **Address**: `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc`
- **Private Key**: `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`
- **Balance**: 10,000 ETH

### Account 6 (Recommended for Member 6)
- **Address**: `0x976EA74026E726554dB657fA54763abd0C3a0aa9`
- **Private Key**: `0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e`
- **Balance**: 10,000 ETH

### Account 7 (Recommended for Member 7)
- **Address**: `0x14dC79964daFC08D36F98E36e10b4ee90BBd88E7`
- **Private Key**: `0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f6f9d248c7c10986db`
- **Balance**: 10,000 ETH

### Account 8 (Recommended for Member 8)
- **Address**: `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8F`
- **Private Key**: `0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97`
- **Balance**: 10,000 ETH

### Account 9 (Recommended for Member 9)
- **Address**: `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`
- **Private Key**: `0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6ad409b`
- **Balance**: 10,000 ETH

### Account 10 (Recommended for Member 10)
- **Address**: `0xBcd4042DE499D14e55001Ccbb24A551F3b954096`
- **Private Key**: `0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897`
- **Balance**: 10,000 ETH

---

## 🚀 How to Use These Accounts

### Step 1: Import Accounts into MetaMask

1. **Open MetaMask**
2. **Click the account icon** (top right)
3. **Select "Import Account"**
4. **Paste the Private Key** for the account you want
5. **Click "Import"**
6. **Repeat** for each account you want to use

### Step 2: Add Accounts as Members

1. **Connect as Owner** (the account that deployed the contract)
   - Owner address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

2. **Go to Admin Panel** in the frontend (http://localhost:8080)

3. **Add Member**:
   - Copy one of the addresses above (e.g., `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)
   - Paste it in the "Add Member" field
   - Click "Ajouter Membre"
   - Approve the transaction

4. **Repeat** for each member you want to add

### Step 3: Test with Multiple Accounts

1. **Switch between accounts** in MetaMask
2. **Each member can**:
   - Create proposals
   - Vote on proposals
   - View proposal details

---

## 📝 Quick Copy List (Addresses Only)

Copy these addresses to add as members:

```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964daFC08D36F98E36e10b4ee90BBd88E7
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8F
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001Ccbb24A551F3b954096
```

---

## 🎯 Recommended Testing Setup

### Minimum Setup (for basic testing):
- **Owner**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Member 1**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Member 2**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

This gives you 3 members total (including owner), which meets the quorum of 2.

### Extended Setup (for advanced testing):
- Add all 10 accounts above
- Test with larger voting groups
- Test member removal
- Test with different voting patterns

---

## ⚠️ Important Notes

- **These accounts are for LOCAL TESTING ONLY**
- **Never use these private keys on mainnet or any public network**
- **All accounts start with 10,000 ETH on Hardhat network**
- **Owner is automatically a member** (no need to add)
- **Quorum is set to 2**, so you need at least 2 yes votes to execute proposals

---

## 🔍 Verify Account Balance

To check if an account has ETH:
1. Switch to that account in MetaMask
2. Check the balance in MetaMask
3. Or check in the frontend dashboard

---

**Ready to test! Import these accounts and start adding members! 🚀**
