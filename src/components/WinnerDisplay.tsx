import React from 'react';
import { Award, Clock } from 'lucide-react';

interface WinnerDisplayProps {
  winner: string;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner }) => {
  if (!winner) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
        <Clock className="h-6 w-6 text-gray-500 mr-3" />
        <span className="text-gray-600 font-medium">No winner yet. Voting is still in progress.</span>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
      <Award className="h-6 w-6 text-yellow-600 mr-3" />
      <span className="font-medium text-gray-800">
        Current Leader: <span className="text-yellow-700 font-bold">{winner}</span>
      </span>
    </div>
  );
};

export default WinnerDisplay;