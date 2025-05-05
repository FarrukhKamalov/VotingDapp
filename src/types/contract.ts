export interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

export interface ContractState {
  owner: string;
  candidates: Candidate[];
  hasVoted: boolean;
  winner: string;
  isOwner: boolean;
}