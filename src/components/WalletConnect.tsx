import React from 'react';
import { Wallet, LogOut } from 'lucide-react';

interface WalletConnectProps {
  isConnected: boolean;
  account: string;
  connectWallet: () => Promise<void>;
  isLoading: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  account,
  connectWallet,
  isLoading
}) => {
  // Format address to show first 6 chars and last 4 chars
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex items-center">
      {isConnected ? (
        <div className="flex items-center gap-2 bg-indigo-100 rounded-full py-2 px-4 text-indigo-700 font-medium shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <Wallet size={18} className="mr-2" />
            <span>{formatAddress(account)}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Wallet size={18} />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  );
};

export default WalletConnect;