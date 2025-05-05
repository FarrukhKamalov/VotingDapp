// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    uint256 public nextCandidateId = 0;
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    Candidate[] public candidates;
    mapping(address => bool) public users;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Kefteme");
        _;
    }

    function newCandidate(string memory _name) public onlyOwner {
        candidates.push(
            Candidate({id: nextCandidateId, name: _name, voteCount: 0})
        );
        nextCandidateId++;
    }

    function vote(uint256 candidateId) public {
        require(candidateId < candidates.length, "Noto'g'ri nomzod ID");
        require(users[msg.sender] == false, "Ovoz berib bolgansiz");
        require(msg.sender != owner, "Ownerlarga mumkinmas");
        Candidate storage candidate = candidates[candidateId];
        candidate.voteCount += 1;
        users[msg.sender] = true;
    }

    function getCandidate(uint256 candidateId)
        public
        view
        returns (Candidate memory)
    {
        require(candidateId < candidates.length, "Noto'g'ri nomzod ID");
        return candidates[candidateId];
    }

    function getWinner() public view returns (string memory) {
        require(candidates.length > 0, "Nomzodlar yoq");
        uint256 maxVotes;
        uint256 winnerIndex;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return candidates[winnerIndex].name;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
