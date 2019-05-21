export interface Status  {
created: boolean;    	  // game has been created
invited: boolean;         // finished inviting players to join
judgesAssigned: boolean;  // judges are set for the game
teamsCreated: boolean;    // teams with players have been created
assigned: boolean;        // assignments are made
closedAdmin: boolean;	  // admin section is closed for editing
playing: boolean;    	  // game is ongoing
pauzed: boolean;     	  // game is pauzed
finished: boolean;    	  // game is finished
}
