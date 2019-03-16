import { NotifierOptions } from 'angular-notifier';
import { Assignment } from '../models/assignment.model';
import { Rating } from '../models/rating.model';

export class Settings {

// list of assignments
public static assignments: Assignment[] = [
{assignment: 'iets wat rolt', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'een tuinkabouter', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'iets wat geluid maakt', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'iets roods', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'iets blauws', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'iets paars', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een dier', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'een eend', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'een gans', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'iets wat stinkt', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'zwerfvuil', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'papier', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'iets om mee te schrijven', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een spinnenweb', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'brandnetels', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'mos', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'nummer 14', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'nummer 123', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'nummer 2a', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'fruit', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'appel', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'besjes', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een wandelpad paal', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'een voorrangsbord', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'een bord doodlopende weg', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'iets groots', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'iets glads', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'iets ruws', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een hoed', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'met zonder jas', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'met bril (niet van jezelf)', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'iemand die een hond uitlaat', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'een kinderwagen', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'een step', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'een dure auto', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'een auto met een buitenlands kenteken', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'een speelgoedauto', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'een toren', isOutside: true, level: 2, maxPoints: Rating.medium},
{assignment: 'een schoolgebouw', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'een vlag', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'de krant van gisteren', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'iets eetbaars', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'een instrument', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een wandelstok', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'een vogelhuisje', isOutside: true, level: 1, maxPoints: Rating.easy},
{assignment: 'iets glimmends', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'iets van hout', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'een uithangbord', isOutside: true, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'een rugtas', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'een eetkraampje', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'een gele auto', isOutside: true, level: 3, maxPoints: Rating.hard},
{assignment: 'iets te drinken', isOutside: false, level: 1, maxPoints: Rating.easy},
{assignment: 'een bal', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'een sport', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'iets breeds', isOutside: false, level: 3, maxPoints: Rating.hard},
{assignment: 'iets hoogs', isOutside: false, level: 2, maxPoints: Rating.medium},
{assignment: 'een etalagepop', isOutside: false, level: 1, theme: 'mall', maxPoints: Rating.easy},
{assignment: 'een lift', isOutside: false, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'een roltrap', isOutside: false, level: 3, theme: 'mall', maxPoints: Rating.hard},
{assignment: 'nooduitgang bordje', isOutside: false, level: 2, theme: 'mall', maxPoints: Rating.medium},
{assignment: 'bewakingscamera', isOutside: false, level: 3, theme: 'mall', maxPoints: Rating.hard},
{assignment: 'een kerstman', isOutside: false, level: 1, theme: 'christmas', maxPoints: Rating.easy},
{assignment: 'kerstlichtjes', isOutside: false, level: 3, theme: 'christmas', maxPoints: Rating.hard},
{assignment: 'een kerstbal', isOutside: false, level: 2, theme: 'christmas', maxPoints: Rating.medium},

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
'HappySelfieMakers'
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
{color: '#F44336', colorLabel: 'Rood'},
{color: '#E91E63', colorLabel: 'Roze'},
{color: '#9C27B0', colorLabel: 'Paars'},
{color: '#FFC107', colorLabel: 'Amber'},
{color: '#FF9800', colorLabel: 'Oranje'},
{color: '#3F51B5', colorLabel: 'Indigo'},
{color: '#2196F3', colorLabel: 'Blauw'},
{color: '#00BCD4', colorLabel: 'Cyaan'},
{color: '#4CAF50', colorLabel: 'Groen'},
{color: '#8BC34A', colorLabel: 'Lichtgroen'},
{color: '#CDDC39', colorLabel: 'Limoen'},
{color: '#FFEB3B', colorLabel: 'Geel'}
];

public static userLevels = {
participant : {
level: 'deelnemer',
gameVariable: 'participants',
gameQueryCondition: 'array-contains',
userVariable: 'participating'
},
player: {
level: 'speler',
gameVariable: 'players',
gameQueryCondition: 'array-contains',
userVariable: 'playing'
},
judge: {
level: 'jurylid',
gameVariable: 'judges',
gameQueryCondition: 'array-contains',
userVariable: 'judging'
},
administrator: {
level: 'beheerder',
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
'standaard/selfie-bitch.png'
];

}


