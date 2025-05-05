import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract';
import { Candidate, ContractState } from '../types/contract';

export const useEthers = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [contractState, setContractState] = useState<ContractState>({
    owner: '',
    candidates: [],
    hasVoted: false,
    winner: '',
    isOwner: false
  });

  // Initialize provider from window.ethereum
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const ethersProvider = new BrowserProvider(window.ethereum);
          setProvider(ethersProvider);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              fetchContractData(accounts[0]);
            } else {
              setIsConnected(false);
              setAccount('');
            }
          });
        } catch (err) {
          console.error("Failed to initialize provider:", err);
          setError("Failed to initialize Web3 provider");
        }
      } else {
        setError("Please install MetaMask!");
      }
    };

    initProvider();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!provider) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);
        
        const contractInstance = new Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signerInstance
        );
        setContract(contractInstance);
        setIsConnected(true);
        
        fetchContractData(address);
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  // Fetch contract data
  const fetchContractData = useCallback(async (address: string) => {
    if (!contract) return;
    
    setIsLoading(true);
    
    try {
      // Get contract owner
      const owner = await contract.owner();
      
      // Get candidates
      const candidates = await contract.getCandidates();
      
      // Check if user has voted
      const hasVoted = await contract.users(address);
      
      // Get current winner
      let winner = '';
      try {
        winner = await contract.getWinner();
      } catch (err) {
        // If there's an error, it might be because there are no candidates yet
        console.log("No winner yet or no candidates");
      }
      
      setContractState({
        owner,
        candidates,
        hasVoted,
        winner,
        isOwner: owner.toLowerCase() === address.toLowerCase()
      });
    } catch (err: any) {
      console.error("Error fetching contract data:", err);
      setError(err.message || "Failed to fetch contract data");
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Add new candidate (owner only)
  const addCandidate = useCallback(async (name: string) => {
    if (!contract || !signer) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tx = await contract.newCandidate(name);
      await tx.wait();
      await fetchContractData(account);
      return true;
    } catch (err: any) {
      console.error("Error adding candidate:", err);
      setError(err.message || "Failed to add candidate");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract, signer, account, fetchContractData]);

  // Vote for a candidate
  const voteForCandidate = useCallback(async (candidateId: number) => {
    if (!contract || !signer) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      await fetchContractData(account);
      return true;
    } catch (err: any) {
      console.error("Error voting:", err);
      setError(err.message || "Failed to vote");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract, signer, account, fetchContractData]);

  // Refresh data
  const refreshData = useCallback(() => {
    if (account) {
      fetchContractData(account);
    }
  }, [account, fetchContractData]);

  return {
    provider,
    signer,
    contract,
    account,
    isConnected,
    isLoading,
    error,
    contractState,
    connectWallet,
    addCandidate,
    voteForCandidate,
    refreshData
  };
};