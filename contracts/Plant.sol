// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PlanToEarn {
    //This instance used to recognize owner address for owner-only activity also used for front-end display 
    address public owner;

    //The boolean variable that controls when the donation is open/close, also used for front-end display 
    bool public ended = false;

    //Variable for later loop setup
    uint private i;

    //Winner team declaration when receive back data of planting from projects after a year
    uint public winner;
    
    //Struct of information for each projects group that receive donation for planting
    struct Team {
        string name;        //project's name   
        uint slot_left;     //Donation slot left for the project in this campaign
    }

    //Array that contains 3 selected 
    Team[] teams;         

    //Mapping to check if the address already attended to the donation (true if attended, false if not yet)
    mapping(address => bool) players;

    //Mapping to map attended player's address to their selected project ID.
    mapping(address => uint) players_team_pair;

    //Constructor
    constructor(uint _slot) public{
        //Set value of owner
        owner = msg.sender;
        //Array of project's name (this part will be replaced if appropriate project is found)
        string[3] memory names = ["Asia", "Europe", "Africa"];

        //Initial state of winner = 99 
        winner = 99;

        //Projects (teams) information of name and slot of donation set up
        for (i = 0; i < 3; i++){
            Team memory teamm;
            teamm.name = names[i];
            teamm.slot_left = _slot;
            teams.push(teamm);
        }
    }

    //Function for attending, taking input of selected id
    function Attend(uint team_id) external payable {
        //The function only available in the opening phase (not ended)
        require(ended == false, "The game is over");

        //The team id must be valid (0,1 or 2 since there's only 3 teams)
        require(team_id < 3, "The team does not exist");

        //The donation slot of the project is still not run out
        require(teams[team_id].slot_left > 0, "Please select another team");

        //Minimum amount for donation is 10wei
        require(msg.value >= 10, "The fund is not sufficient");

        //Each account can only attend once
        require(players[msg.sender] == false, "You can attended once");

        //Update the donation slot for project (-1)
        teams[team_id].slot_left = teams[team_id].slot_left - 1;

        //Update mapping for saving data of user that attended
        players[msg.sender] = true;
        players_team_pair[msg.sender] = team_id;
    }

    //Demonstration function for selecting winner
    function SelectWinner() external {
        //Require owner to execute
        require(msg.sender == owner);

        //require the open phase is over
        require(ended == true);

        //Random the winner amongsth 3 projects (for demo purpose only, if the project becomes real the winner will be selected differently using analyzed data)
        winner = randMod();
    }

    //This function is triggered by owner to end the opening phase
    function EndGame() external {
        //Only owner can execute this function (the real version can make it auto trigger in any selected specific date)
        require(msg.sender == owner);

        //Require the campaign is still in the opening phase
        require(ended == false);

        //End the opening phase
        ended = true;

        //Code for funding transaction, but not activate in this demo because there's no existing planting projects wallet so I commented it out
        //for (i = 0; i < teams.length; i ++){
        //payable(address of asian planting firm).transfer(ticket price * number of member attended in the team * 0.6);}
    }

    //Functions for user in winning team withdraw their airdrop, available after the airdroping phase
    function WithdrawFund() external payable {
        //Only available when the winner is selected and user in correct winning team 
        require(players_team_pair[msg.sender] == winner, "You are not in winner team");

        //Fund transaction for winner (in this demo I put it 15 wei for easy transaction, the correct amount must be totalFund*0.4/(donating member for the project))
        payable(msg.sender).transfer(15);
    }

    //Random function for winner randomize
    uint randNonce = 0;
    function randMod() internal returns(uint)
    {
        randNonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,randNonce))) % 3;
    }

    //Function view the name of project from its ID
    function TeamsName(uint team_id) external view returns (string memory) {
        return teams[team_id].name;
    }

    //View team for attended player
    function viewTeam() external view returns (uint){
        if (players[msg.sender] == true) {
            return players_team_pair[msg.sender];
        }
        else {
            return 404;
        }
    }

    //View available slot left for projects with given id
    function ViewSlotLeft(uint team_id) external view returns (uint) {
        return teams[team_id].slot_left;
    }
}