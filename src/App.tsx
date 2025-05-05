import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { RefreshCw, UserPlus } from 'lucide-react';
import { useEthers } from './hooks/useEthers';
import WalletConnect from './components/WalletConnect';
import CandidateList from './components/CandidateList';
import AddCandidateModal from './components/AddCandidateModal';
import ErrorDisplay from './components/ErrorDisplay';
import WinnerDisplay from './components/WinnerDisplay';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const {
    account,
    isConnected,
    isLoading,
    error,
    contractState,
    connectWallet,
    addCandidate,
    voteForCandidate,
    refreshData
  } = useEthers();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCandidate = async (name: string) => {
    const success = await addCandidate(name);
    if (success) {
      toast.success(`Added candidate: ${name}`);
    }
    return success;
  };

  const handleVote = async (candidateId: number) => {
    const candidateName = contractState.candidates.find(c => c.id === candidateId)?.name || 'this candidate';
    const promise = voteForCandidate(candidateId);
    
    toast.promise(promise, {
      loading: 'Processing your vote...',
      success: `You voted for ${candidateName}!`,
      error: 'Failed to cast vote'
    });
    
    await promise;
  };

  const handleDismissError = () => {
    // This would normally clear the error state
    // but since our useEthers hook doesn't expose a way to clear errors,
    // we'll rely on the next action to clear it
  };

  const handleRefresh = () => {
    refreshData();
    toast.success('Data refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 text-indigo-600 mr-3"
            >
              <path d="m12 15 6-6-6-6-6 6 6 6Z" />
              <path d="m12 15 6 6-6-6-6 6 6-6Z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">Blockchain Voting dApp</h1>
          </div>
          <WalletConnect
            isConnected={isConnected}
            account={account}
            connectWallet={connectWallet}
            isLoading={isLoading}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 max-w-5xl">
        {!isConnected ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Blockchain Voting</h2>
            <p className="text-gray-600 mb-6">Connect your MetaMask wallet to participate in the voting process.</p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {error && <ErrorDisplay message={error} onDismiss={handleDismissError} />}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {contractState.isOwner ? 'Admin Dashboard' : 'Vote for a Candidate'}
              </h2>
              
              <div className="flex gap-3">
                {contractState.isOwner && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <UserPlus size={18} />
                    <span>New Candidate</span>
                  </button>
                )}
                
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            <WinnerDisplay winner={contractState.winner} />
            
            <div className="mt-6">
              <CandidateList
                candidates={contractState.candidates}
                hasVoted={contractState.hasVoted}
                isOwner={contractState.isOwner}
                winner={contractState.winner}
                onVote={handleVote}
                isLoading={isLoading}
              />
            </div>
            
            <AddCandidateModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddCandidate={handleAddCandidate}
              isLoading={isLoading}
            />
          </>
        )}
      </main>
      
      <footer className="container mx-auto px-4 py-6 sm:px-6 text-center text-gray-500 text-sm">
        <p>Built with React, Ethers.js, and Tailwind CSS. Connect with MetaMask to participate.</p>
      </footer>
    </div>
  );
}

export default App;