import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, SAFECLUB_ABI, HARDHAT_CHAIN_ID, type Proposal } from '@/constants/contract';
import { useToast } from '@/hooks/use-toast';

interface Web3State {
    account: string | null;
    balance: string | null;
    isMember: boolean;
    isOwner: boolean;
    provider: ethers.BrowserProvider | null;
    signer: ethers.Signer | null;
    contract: ethers.Contract | null;
    chainId: number | null;
    isConnecting: boolean;
    error: string | null;
}

interface ContractData {
    contractBalance: string;
    totalMembers: number;
    majorityNeeded: number;
    proposals: Proposal[];
    membersList: string[];
}

interface Web3ContextType extends Web3State, ContractData {
    connectWallet: () => Promise<boolean>;
    createProposal: (title: string, description: string, amount: string, recipient: string) => Promise<boolean>;
    vote: (proposalId: number, support: boolean) => Promise<boolean>;
    executeProposal: (proposalId: number) => Promise<boolean>;
    depositFunds: (amount: string) => Promise<boolean>;
    addMember: (memberAddress: string) => Promise<boolean>;
    removeMember: (memberAddress: string) => Promise<boolean>;
    setQuorum: (newQuorum: number) => Promise<boolean>;
    refresh: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toast } = useToast();
    const loadingRef = useRef(false);

    const [state, setState] = useState<Web3State>({
        account: null,
        balance: null,
        isMember: false,
        isOwner: false,
        provider: null,
        signer: null,
        contract: null,
        chainId: null,
        isConnecting: false,
        error: null,
    });

    const [contractData, setContractData] = useState<ContractData>({
        contractBalance: '0',
        totalMembers: 0,
        majorityNeeded: 0,
        proposals: [],
        membersList: [],
    });

    const loadContractData = useCallback(async () => {
        if (!state.contract || !state.account || loadingRef.current) return;

        loadingRef.current = true;
        try {
            const [contractBalance, totalMembers, quorum, proposalCount, isMember, ownerAddr] = await Promise.all([
                state.contract.getBalance(),
                state.contract.getMemberCount(),
                state.contract.quorum(),
                state.contract.nextProposalId(),
                state.contract.isMember(state.account!),
                state.contract.owner()
            ]);

            const isOwner = ownerAddr.toLowerCase() === state.account?.toLowerCase();
            setState(prev => ({ ...prev, isMember, isOwner }));

            const proposals: Proposal[] = [];
            const count = Number(proposalCount);

            // Loop for proposals
            const proposalPromises = [];
            for (let i = 0; i < count; i++) {
                proposalPromises.push((async () => {
                    try {
                        const [prop, hasVoted] = await Promise.all([
                            state.contract!.getProposal(i),
                            state.contract!.hasVoted(i, state.account!)
                        ]);

                        return {
                            id: i,
                            title: prop.description.split('\n')[0] || `Proposal #${i}`,
                            description: prop.description || '',
                            amount: ethers.formatEther(prop.amount),
                            recipient: prop.recipient,
                            creator: '0x0000000000000000000000000000000000000000',
                            deadline: Number(prop.deadline) * 1000,
                            votesFor: Number(prop.yesVotes),
                            votesAgainst: Number(prop.noVotes),
                            executed: prop.executed,
                            exists: true,
                            hasVoted: hasVoted,
                        };
                    } catch (err) {
                        console.warn(`Erreur chargement proposition ${i}:`, err);
                        return null;
                    }
                })());
            }

            const proposalsResults = await Promise.all(proposalPromises);
            const validProposals = proposalsResults.filter(p => p !== null) as Proposal[];

            // Fetch members list
            const membersList: string[] = [];
            const memberCountNum = Number(totalMembers);
            console.log("Fetching members list, total:", memberCountNum);

            // On SafeClub, we cannot iterate by index if there is no 'getMemberAtIndex' function usually.
            // But here we rely on members(uint256) which is a public mapping usually for checking 'isMember' or struct.
            // Wait, looking at contract logic... usually members is `mapping(address => bool)`.
            // If the contract has an array `memberList` or similar, we should use that.
            // Since we don't have the contract code visible here, let's assume there is a `getMembers()` function or we iterate.

            // Correction based on common issue: members(i) might not exist if it's a mapping.
            // Let's rely on event logs or if there is a specific function in your contract.
            // Assuming there is a `membersList` array in Solidity based on typical patterns if `members(i)` was attempted.
            // If `members` is a public array `address[] public members;`, then `members(i)` works.

            for (let i = 0; i < memberCountNum; i++) {
                try {
                    // Access public array 'members' at index i
                    const memberAddr = await state.contract.members(i);
                    membersList.push(memberAddr);
                } catch (err) {
                    console.warn(`Erreur chargement membre ${i}:`, err);
                }
            }

            setContractData({
                contractBalance: ethers.formatEther(contractBalance),
                totalMembers: memberCountNum,
                majorityNeeded: Number(quorum),
                proposals: validProposals.reverse(),
                membersList: membersList,
            });

            if (Number(quorum) === 0) {
                console.error("ERREUR: Le quorum est à 0. L'adresse du contrat est probablement incorrecte ou le contrat n'est pas déployé.");
                setState(prev => ({ ...prev, error: "Contract Not Found at address" }));
            }

        } catch (error: any) {
            console.error('Erreur chargement données:', error);
            setState(prev => ({ ...prev, error: "Erreur de connexion: " + error.message }));
        } finally {
            loadingRef.current = false;
        }
    }, [state.contract, state.account, toast]);

    const connectWallet = useCallback(async () => {
        if (!(window as any).ethereum) {
            toast({
                title: "MetaMask non détecté",
                description: "Veuillez installer MetaMask pour continuer",
                variant: "destructive",
            });
            return false;
        }

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            const accounts = await (window as any).ethereum.request({
                method: 'eth_requestAccounts',
            }) as string[];

            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            if (Number(network.chainId) !== HARDHAT_CHAIN_ID) {
                try {
                    await (window as any).ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}` }],
                    });
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        await (window as any).ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: `0x${HARDHAT_CHAIN_ID.toString(16)}`,
                                chainName: 'Hardhat Local Network',
                                rpcUrls: ['http://127.0.0.1:8545'],
                                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                            }],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }

            const balance = await provider.getBalance(accounts[0]);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, SAFECLUB_ABI, signer);

            const [isMember, owner] = await Promise.all([
                contract.isMember(accounts[0]),
                contract.owner(),
            ]);

            setState({
                account: accounts[0],
                balance: ethers.formatEther(balance),
                isMember,
                isOwner: owner.toLowerCase() === accounts[0].toLowerCase(),
                provider,
                signer,
                contract,
                chainId: Number(network.chainId),
                isConnecting: false,
                error: null,
            });

            toast({
                title: "Connexion réussie",
                description: `Connecté avec ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
            });

            return true;
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            setState(prev => ({ ...prev, isConnecting: false, error: error.message }));
            toast({
                title: "Erreur de connexion",
                description: error.message || "Une erreur est survenue",
                variant: "destructive",
            });
            return false;
        }
    }, [toast]);

    useEffect(() => {
        const checkConnection = async () => {
            if ((window as any).ethereum) {
                const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    console.log("Compte détecté au chargement:", accounts[0]);
                    connectWallet();
                }

                // Listen for account changes
                (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                    if (accounts.length > 0) {
                        toast({
                            title: "Changement de compte",
                            description: `Nouveau compte: ${accounts[0].substring(0, 6)}...`
                        });
                        connectWallet();
                    } else {
                        // User disconnected
                        setState(prev => ({ ...prev, account: null, isMember: false, isOwner: false }));
                        setContractData(prev => ({ ...prev, membersList: [], proposals: [] }));
                    }
                });

                // Listen for chain changes
                (window as any).ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
            }
        };
        checkConnection();

        return () => {
            if ((window as any).ethereum) {
                (window as any).ethereum.removeAllListeners('accountsChanged');
                (window as any).ethereum.removeAllListeners('chainChanged');
            }
        };
    }, [connectWallet, toast]);

    useEffect(() => {
        if (state.account && !loadingRef.current) {
            console.log("Chargement des données pour:", state.account);
            const timer = setTimeout(() => loadContractData(), 500);
            return () => clearTimeout(timer);
        }
    }, [state.account, loadContractData]);

    const createProposal = useCallback(async (title: string, description: string, amount: string, recipient: string) => {
        if (!state.contract) return false;
        try {
            const amountWei = ethers.parseEther(amount);
            const tx = await state.contract.createProposal(recipient, amountWei, description, 30); // 30 seconds duration
            toast({ title: "Transaction envoyée", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Proposition créée", description: "La proposition a été créée avec succès" });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, toast, loadContractData]);

    const vote = useCallback(async (proposalId: number, support: boolean) => {
        if (!state.contract) return false;
        try {
            const tx = await state.contract.vote(proposalId, support);
            toast({ title: "Vote envoyé", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Vote enregistré", description: `Vous avez voté ${support ? 'POUR' : 'CONTRE'}` });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, toast, loadContractData]);

    const executeProposal = useCallback(async (proposalId: number) => {
        if (!state.contract) return false;
        try {
            const tx = await state.contract.executeProposal(proposalId);
            toast({ title: "Exécution en cours", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Proposition exécutée", description: "Les fonds ont été transférés" });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, toast, loadContractData]);

    const depositFunds = useCallback(async (amount: string) => {
        if (!state.signer) return false;
        try {
            const tx = await state.signer.sendTransaction({ to: CONTRACT_ADDRESS, value: ethers.parseEther(amount) });
            toast({ title: "Dépôt en cours", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Dépôt réussi", description: `${amount} ETH déposés avec succès` });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.signer, loadContractData, toast]);

    const addMember = useCallback(async (memberAddress: string) => {
        if (!state.contract || !state.isOwner) return false;
        try {
            const tx = await state.contract.addMember(memberAddress);
            toast({ title: "Ajout en cours", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Membre ajouté", description: "Le nouveau membre a été ajouté avec succès" });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, state.isOwner, loadContractData, toast]);

    const removeMember = useCallback(async (memberAddress: string) => {
        if (!state.contract || !state.isOwner) return false;
        try {
            const tx = await state.contract.removeMember(memberAddress);
            toast({ title: "Retrait en cours", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Membre retiré", description: "Le membre a été retiré avec succès" });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, state.isOwner, loadContractData, toast]);

    const setQuorum = useCallback(async (newQuorum: number) => {
        if (!state.contract || !state.isOwner) return false;
        try {
            const tx = await state.contract.setQuorum(newQuorum);
            toast({ title: "Mise à jour du quorum", description: "En attente de confirmation..." });
            await tx.wait();
            toast({ title: "Succès", description: "Le quorum a été mis à jour" });
            await loadContractData();
            return true;
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
            return false;
        }
    }, [state.contract, state.isOwner, loadContractData, toast]);

    const refresh = useCallback(() => loadContractData(), [loadContractData]);

    const value = {
        ...state,
        ...contractData,
        connectWallet,
        createProposal,
        vote,
        executeProposal,
        depositFunds,
        addMember,
        removeMember,
        setQuorum,
        refresh,
    };

    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3Context must be used within a Web3Provider');
    }
    return context;
};
