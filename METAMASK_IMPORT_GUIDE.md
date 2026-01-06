# MetaMask Import Guide - Troubleshooting

## 🔑 Private Key for Account: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

### Try these formats:

**Format 1 (with 0x):**
```
0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d2
```

**Format 2 (without 0x):**
```
59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d2
```

---

## 📋 Step-by-Step Import Instructions

### Method 1: Import Account
1. Open MetaMask extension
2. Click on the **account circle/icon** (top right)
3. Click **"Import Account"** (or "Add Account" → "Import Account")
4. Select **"Private Key"** as the import type
5. Paste the private key (try both formats above)
6. Click **"Import"**

### Method 2: Add Account → Import
1. Click the account dropdown (top center)
2. Click **"Add Account"** or **"Create Account"**
3. Look for **"Import Account"** option
4. Select **"Private Key"**
5. Paste the key
6. Click **"Import"**

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid private key"
**Solution:**
- Make sure there are **no spaces** before or after the key
- Try copying again (sometimes extra characters get copied)
- Try the format without `0x` prefix

### Issue 2: "Account already exists"
**Solution:**
- This account might already be imported
- Check your account list in MetaMask
- The address should be: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

### Issue 3: Can't find "Import Account" option
**Solution:**
- Click the **account icon** (circle with account number) in top right
- Look for **"Import Account"** in the dropdown menu
- Or go to Settings → Advanced → Show private key (if account already exists)

### Issue 4: MetaMask asks for password
**Solution:**
- Enter your MetaMask password (the one you set when creating MetaMask)
- This is NOT the private key - it's your MetaMask wallet password

---

## 🔍 Verify the Account

After importing, verify:
1. The address should be: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
2. Balance should show **10,000 ETH** (on Hardhat network)
3. Make sure you're on **Hardhat Local** network (Chain ID: 31337)

---

## 🔄 Alternative: Use Seed Phrase (if available)

If private key import doesn't work, you can also:
1. Create a new account in MetaMask
2. Get its private key
3. Use that address to add as a member instead

---

## 📝 All Hardhat Test Account Private Keys

If you need other accounts, here are all the private keys:

### Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```
59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d2
```

### Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```
5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### Account 3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
```
7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
```

---

## 🆘 Still Not Working?

If it still doesn't work:
1. **Check MetaMask version** - Update to latest version
2. **Try a different browser** - Sometimes browser extensions conflict
3. **Clear MetaMask cache** - Settings → Advanced → Reset Account
4. **Use a different account** - Try Account 2 or 3 from the list above

---

## ✅ Quick Test

To verify the private key is correct, you can check it matches the address using an online tool or by checking the Hardhat node output when it starts.

The private key should always result in the address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
