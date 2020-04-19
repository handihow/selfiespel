import { NotifierOptions } from 'angular-notifier';
import { Assignment } from '../models/assignment.model';
import { Rating } from '../models/rating.model';

export class Settings {

// list of assignments
public static assignments: Assignment[] = [
{assignment: 'something that rolls', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'a garden gnome', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'something that makes noise', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'something red', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'something blue', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'something purple', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'an animal', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'a duck', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'a goose', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'something that smells', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'litter', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'paper', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'something to write with', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'a spider web', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'nettles', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'grass', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'number 14', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'number 123', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'number 2a', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'fruit', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'appel', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'berries', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'a walking path pole', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'a priority sign', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'a dead end sign', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'something big', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'something slippery', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'something raw', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'a hat', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'with without jacket', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'with glasses (not your own)', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'someone who walks a dog', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'a pram', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'a step', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'an expensive car', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'a car with a foreign registration', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'a toy car', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'a tower', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'a school building', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'a flag', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'yesterdays newpaper', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'something edible', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'an instrument', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'a walking stick', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'a birdhouse', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'something shiny', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'something of wood', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'a signboard', isOutside: true, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'a backpack', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'a food stall', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'a yellow car', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'something to drink', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'a ball', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'a sport', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'something broad', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'something high', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'a mannequin', isOutside: false, level: 1, theme: 'mall', maxPoints: Rating.easy},
{assignment: 'an elevator', isOutside: false, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'an escalator', isOutside: false, level: 3, theme: 'mall', maxPoints: Rating.hard},
{assignment: 'an emergency exit sign', isOutside: false, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'a security camera', isOutside: false, level: 3, theme: 'mall', maxPoints: Rating.hard},
{assignment: 'a santa claus', isOutside: false, level: 1, theme: 'christmas', maxPoints: Rating.easy},
{assignment: 'Christmas lights', isOutside: false, level: 3, theme: 'christmas', maxPoints: Rating.hard},
{assignment: 'a Christmas bauble', isOutside: false, level: 2, theme: 'christmas', maxPoints: Rating.medium},

];

// list of gameNames
public static gameNames = [
'Turn around and take a selfie',
'Do you wanna selfie?',
'Hey, that\'s my selfie',
'Selfies are my life',
'Live life the selfie way',
'Take it easy, take a selfie',
'Selfie is the Game you play',
'Play the game selfie me',
'Selfie you selfie me',
'Can I take a selfie with you?',
'Selfies everywhere',
'Come with me on a selfie tour',
'Live the selfie way',
'Watch my selfie',
'It\'s not easy being a selfie',
'Always look on the selfie side of life'
];

public static teamNames = [
'TeamSelfie',
'Selfie4Life',
'I<3Selfie',
'Selfie4Ever',
'SuperSelfie',
'De Selfies',
'SuperDuperSelfies',
'SunnySelfie',
'SelfieIt',
'SeeMySelfie',
'TheBestSelfieMakers',
'HappySelfieMakers',
'TrueSelfies',
'KardashianSelfies',
'BeMySelfie',
'HelloSelfies',
'TheOnlySelfies',
'WeLoveSelfies',
'TakeMySelfie',
];

public static notifierOptions: NotifierOptions = {
position: {
horizontal: {
position: 'left',
distance: 12
},
vertical: {
position: 'bottom',
distance: 12,
gap: 10
}
},
theme: 'material',
behaviour: {
autoHide: 5000,
onClick: false,
onMouseover: 'pauseAutoHide',
showDismissButton: true,
stacking: 4
},
animations: {
enabled: true,
show: {
preset: 'slide',
speed: 300,
easing: 'ease'
},
hide: {
preset: 'fade',
speed: 300,
easing: 'ease',
offset: 50
},
shift: {
speed: 300,
easing: 'ease'
},
overlap: 150
}
};

public static teamColors =
[
{color: "#F44336", colorLabel: "Red"},
{color: "#E91E63", colorLabel: "Pink"},
{color: "#9C27B0", colorLabel: "Purple"},
{color: "#673AB7", colorLabel: "Dark purple"},
{color: "#3F51B5", colorLabel: "Indigo"},
{color: "#2196F3", colorLabel: "Blue"},
{color: "#03A9F4", colorLabel: "Lightblue"},
{color: "#00BCD4", colorLabel: "Cyan"},
{color: "#009688", colorLabel: "Bluegreen"},
{color: "#4CAF50", colorLabel: "Green"},
{color: "#8BC34A", colorLabel: "Lightgreen"},
{color: "#CDDC39", colorLabel: "Lemon"},
{color: "#FFEB3B", colorLabel: "Yellow"},
{color: "#FFC107", colorLabel: "Amber"},
{color: "#FF9800", colorLabel: "Orange"},
{color: "#FF5722", colorLabel: "Orangered"},
{color: "#795548", colorLabel: "Brown"},
{color: "#9E9E9E", colorLabel: "Grey"},
{color: "#607D8B", colorLabel: "Bluegrey"}
];

public static userLevels = {
participant : {
level: 'participant',
gameVariable: 'participants',
gameQueryCondition: 'array-contains',
userVariable: 'participating'
},
player: {
level: 'player',
gameVariable: 'players',
gameQueryCondition: 'array-contains',
userVariable: 'playing'
},
judge: {
level: 'jurymember',
gameVariable: 'judges',
gameQueryCondition: 'array-contains',
userVariable: 'judging'
},
administrator: {
level: 'administrator',
gameVariable: 'administrator',
gameQueryCondition: '==',
userVariable: 'administrating'
}
};

public static standardGameImages = 
[
'standaard/selfie3.png',
'standaard/selfiestick.png',
'standaard/selfie-strand.png',
'standaard/selfie-recht.png',
'standaard/selfie-strand2.png',
'standaard/selfie-baard.png',
'standaard/selfie-bitch.png',
'standaard/Hoedje.png',
'standaard/selfie-achter.png',
'standaard/selfie-recht2.png'
];

public static assignmentCategories = [
	"Family",
	"Education",
	"Tourism",
	"Bachelors",
	"Team outing",
	"Children's party",
	"Other"	
];

public static imageTransforms = {
  	'90': 'rotateZ(90deg)',
    '180': 'rotateY(180deg) rotateZ(180deg)',
	'270': 'rotateY(180deg) rotateZ(-90deg)'
  }

}


