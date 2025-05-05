import React from 'react';
import { AlertCircle } from 'lucide-react';
import CandidateCard from './CandidateCard';
import { Candidate } from '../types/contract';

interface CandidateListProps {
  candidates: Candidate[];
  hasVoted: boolean;
  isOwner: boolean;
  winner: string;
  onVote: (id: number) => Promise<void>;
  isLoading: boolean;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  hasVoted,
  isOwner,
  winner,
  onVote,
  isLoading
}) => {
  if (candidates.length === 0) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle size={24} className="text-indigo-500 mb-2" />
          <h3 className="text-lg font-medium text-gray-800">No candidates yet</h3>
          {isOwner ? (
            <p className="text-gray-600 mt-1">Add a new candidate using the button above.</p>
          ) : (
            <p className="text-gray-600 mt-1">Please wait for the owner to add candidates.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id.toString()}
          candidate={candidate}
          hasVoted={hasVoted}
          isOwner={isOwner}
          isWinner={candidate.name === winner}
          onVote={onVote}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default CandidateList;