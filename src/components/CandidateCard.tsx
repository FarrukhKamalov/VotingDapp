import React from 'react';
import { User, ThumbsUp, Award } from 'lucide-react';
import { Candidate } from '../types/contract';

interface CandidateCardProps {
  candidate: Candidate;
  hasVoted: boolean;
  isOwner: boolean;
  isWinner: boolean;
  onVote: (id: number) => Promise<void>;
  isLoading: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  hasVoted,
  isOwner,
  isWinner,
  onVote,
  isLoading
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg border-2 ${
      isWinner ? 'border-yellow-400' : 'border-transparent'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${isWinner ? 'bg-yellow-100' : 'bg-indigo-100'} mr-4`}>
            {isWinner ? (
              <Award size={24} className="text-yellow-600" />
            ) : (
              <User size={24} className="text-indigo-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
            <p className="text-sm text-gray-500">ID: {candidate.id.toString()}</p>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-700 py-1 px-3 rounded-full font-medium">
          {candidate.voteCount.toString()} vote{candidate.voteCount.toString() !== "1" && 's'}
        </div>
      </div>
      
      {!isOwner && !hasVoted && (
        <button
          onClick={() => onVote(candidate.id)}
          disabled={isLoading || hasVoted}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp size={16} />
          <span>{isLoading ? 'Processing...' : 'Vote'}</span>
        </button>
      )}
      
      {hasVoted && !isOwner && (
        <div className="w-full mt-2 text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-md">
          You've already voted
        </div>
      )}
      
      {isWinner && (
        <div className="mt-4 flex items-center justify-center gap-2 text-yellow-600 bg-yellow-50 py-2 px-4 rounded-md">
          <Award size={16} />
          <span className="font-medium">Current Winner</span>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;