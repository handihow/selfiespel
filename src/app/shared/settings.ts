export class Settings {	

		//list of assignments
		public static assignments = [
		    {assignment: "iets wat rolt", isOutside: false, level:1},
		    {assignment: "een tuinkabouter", isOutside: true, level:2},
		    {assignment: "iets wat geluid maakt", isOutside: false, level:1},
		    {assignment: "iets roods", isOutside: false, level:1},
		    {assignment: "iets blauws", isOutside: false, level:2},
		    {assignment: "iets paars", isOutside: false, level:3},
		    {assignment: "een dier", isOutside: true, level:1},
		    {assignment: "een eend", isOutside: false, level:2},
		    {assignment: "een gans", isOutside: false, level:3},
		    {assignment: "iets wat stinkt", isOutside: false, level:1},
		    {assignment: "zwerfvuil", isOutside: true, level:1},
		    {assignment: "papier", isOutside: false, level:2},
		    {assignment: "iets om mee te schrijven", isOutside: false, level:3},
		    {assignment: "een spinnenweb", isOutside: true, level:3},
		    {assignment: "brandnetels", isOutside: true, level:2},
		    {assignment: "mos", isOutside: true, level:1},
		    {assignment: "nummer 14", isOutside: false, level:1},
		    {assignment: "nummer 123", isOutside: false, level:2},
		    {assignment: "nummer 2a", isOutside: false, level:3},
		    {assignment: "fruit", isOutside: false, level:1},
		    {assignment: "appel", isOutside: false, level:2},
		    {assignment: "besjes", isOutside: false, level:3},
		    {assignment: "een wandelpad paal", isOutside: true, level:1},
 			{assignment: "een voorrangsbord", isOutside: true, level:2},
  			{assignment: "een bord doodlopende weg", isOutside: true, level:3},			
		    {assignment: "iets groots", isOutside: false, level:1},
		    {assignment: "iets glads", isOutside: false, level:2},
		    {assignment: "iets ruws", isOutside: false, level:3},
		    {assignment: "een hoed", isOutside: false, level:2},
		    {assignment: "met zonder jas", isOutside: false, level:1},
		    {assignment: "met bril (niet van jezelf)", isOutside: false, level:3},
		    {assignment: "iemand die een hond uitlaat", isOutside: true, level:1},
		    {assignment: "een kinderwagen", isOutside: true, level:2},
		    {assignment: "een step", isOutside: true, level:3},
		    {assignment: "een dure auto", isOutside: true, level:1},
			{assignment: "een auto met een buitenlands kenteken", isOutside: true, level:2},
		    {assignment: "een speelgoedauto", isOutside: true, level:3},
		    {assignment: "een toren", isOutside: true, level:2},
		    {assignment: "een schoolgebouw", isOutside: true, level:1},
		    {assignment: "een vlag", isOutside: true, level: 3},
		    {assignment: "de krant van gisteren", isOutside: false, level:2},
		    {assignment: "iets eetbaars", isOutside: false, level:1},
		    {assignment: "een instrument", isOutside: false, level:3},
		    {assignment: "een wandelstok", isOutside: false, level:3},
		    {assignment: "een vogelhuisje", isOutside: true, level:1},
		    {assignment: "iets glimmends", isOutside: false, level:3},
		    {assignment: "iets van hout", isOutside: false, level:2},
		    {assignment: "een uithangbord", isOutside: true, level:2, theme:"mall"},
		    {assignment: "een rugtas", isOutside: false, level:2},
		    {assignment: "een eetkraampje", isOutside: true, level:3},
		    {assignment: "een gele auto", isOutside: true, level:3},
		    {assignment: "iets te drinken", isOutside: false, level:1},
		    {assignment: "een bal", isOutside: false, level:2},
		    {assignment: "een sport", isOutside: false, level:3},
		    {assignment: "iets breeds", isOutside: false, level:3},
		    {assignment: "iets hoogs", isOutside: false, level:2},
		    {assignment: "een etalagepop", isOutside: false, level:1, theme: "mall"},
		    {assignment: "een lift", isOutside: false, level:2,theme: "mall"},
		    {assignment: "een roltrap", isOutside: false, level:3, theme: "mall"},
		    {assignment: "nooduitgang bordje", isOutside: false, level:2, theme: "mall"},
		    {assignment: "bewakingscamera", isOutside: false, level:3, theme: "mall"},
			{assignment: "een kerstman", isOutside: false, level:1, theme: "christmas"},
			{assignment: "kerstlichtjes", isOutside: false, level:3, theme: "christmas"},
			{assignment: "een kerstbal", isOutside: false, level:2, theme: "christmas"},

		  ];

		  //list of gameNames
		public static gameNames = [
			"Turn around and take a selfie",
			"Do you wanna selfie?",
			"Hey, that's my selfie",
			"Selfies are my life",
			"Live life the selfie way",
			"Take it easy, take a selfie",
			"Selfie is the Game you play",
			"Play the game selfie me",
			"Selfie you selfie me",
			"Can I take a selfie with you?",
			"Selfies everywhere",
			"Come with me on a selfie tour",
			"Live the selfie way",
			"Watch my selfie",
			"It's not easy being a selfie",
			"Always look on the selfie side of life"
		  ];

		public static groupNames = [
			"TeamSelfie",
			"Selfie4Life",
			"I<3Selfie",
			"Selfie4Ever",
			"SuperSelfie",
			"De Selfies",
			"SuperDuperSelfies",
			"SunnySelfie",
			"SelfieIt",
			"SeeMySelfie",
			"TheBestSelfieMakers",
			"HappySelfieMakers"
		  ];
	
}

export enum Status  {
    created,    //game has been created
    waiting,    //waiting for players to join
    hasPlayers, //players have joined the game, ready for assignments to be set
    assigned,   //assignments are created and game is ready to be started
    playing,    //game is ongoing
    pauzed,     //game is pauzed
    finished    //game is finished
}
