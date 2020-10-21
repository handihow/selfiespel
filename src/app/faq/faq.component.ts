import { Component, OnInit } from '@angular/core';
import {FaqItem} from '../models/faq-item.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  
  faqList: FaqItem[] = [
        {
          question: 'What is SelfieTheGame?',
          answer: 'SelfieTheGame is a game that you can play with a group of people. For example, it can be played on family occasions, company outings and with the class. We recommend playing the game with a minimum of 4 people (2 teams of 2 people). The administrator of the game creates selfie assignments. During the game, the teams go out and take selfies with the assignments. The administrator can give points to each selfie. SelfieTheGame has this website, but also apps for iOS and Android on the app stores.',
          links: [{link: 'https://youtu.be/5uWZU-JJpOM', buttonText: 'Introduction video', linkColor: 'primary'}]
        },
        {
          question: 'How can I create a game on SelfieTheGame?',
          answer: 'Click in the menu on How To. There is more detailed information there. You can also watch the video where we explain how you can create a game.',
          links: [{link: 'https://youtu.be/A3zpaDKTNX4', buttonText: 'Video how to create new game', linkColor: 'primary'}]
        },
        {
          question: 'Who can play SelfieTheGame?',
          answer: 'Everyone can play the selfie game in a group. For example, it can be played on family occasions, company outings and with the class. We recommend playing the game with a minimum of 4 people (2 teams of 2 people).',
          links: [{link: 'https://youtu.be/5uWZU-JJpOM', buttonText: 'Introduction video', linkColor: 'primary'}]
        },
        {
          question: 'Can I play SelfieTheGame alone?',
          answer: 'No, because SelfieTheGame is a group game. We recommend playing the game with a minimum of 4 people (2 teams of 2 people).',
          links: [{link: 'https://youtu.be/5uWZU-JJpOM', buttonText: 'Introduction video', linkColor: 'primary'}]
        },
        {
          question: 'Can I play SelfieTheGame with my students?',
          answer: 'SelfieTheGame can be played with students. The teacher can create educational assignments, for example to view historical sites in a city (for history class). You can let students use the automatically created team accounts so they do not need to create separate accounts.',
          links: [{link: 'https://youtu.be/5uWZU-JJpOM', buttonText: 'Introduction video', linkColor: 'primary'}, {link: 'https://youtu.be/A3zpaDKTNX4', buttonText: 'Video how to create new game', linkColor: 'accent'}]
        },
        {
          question: 'Is it safe to play SelfieTheGame?',
          answer: 'SelfieTheGame is a secure environment. We welcome you to read our privacy policy and terms of use. We have a built in reporting feature. Selfies can be marked inappropriate by users of the app. If a selfie is repeatedly reported, the game admin is notified. If a selfie is reported 3 times, it will be automatically deleted.',
        },
        {
          question: 'Are there any costs associated with SelfieTheGame?',
          answer: 'No, SelfieTheGame is completely free, the software is open source and there is no commercial aspect. If you like the game, and you want to contribute towards further development, you can become a Patreon.',
          links: [{link: 'https://www.patreon.com/bePatron?u=32959269', buttonText: 'Become a Patreon', linkColor: 'primary'}]
        },
        {
          question: 'How can I help develop SelfieTheGame?',
          answer: 'You can help by playing the game, reporting bugs and / or providing feedback to HandiHow with constructive comments. If you want to make a financial contribution, you can become a Patreon (check out the support page).',
          links: [{link: 'https://www.patreon.com/bePatron?u=32959269', buttonText: 'Become a Patreon', linkColor: 'primary'}]  
        },
        {
          question: 'How can I give feedback?',
          answer: 'You can provide feedback about SelfieTheGame by sending your bugs, questions, and comments to office@handihow.com. You can also report bugs / issues by clicking the buttons below.',
          links: [
            {link: 'https://github.com/handihow/selfiespel/issues', buttonText: 'BUG ON WEBSITE', linkColor: 'primary'},
            {link: 'https://github.com/handihow/selfiethegame/issues', buttonText: 'BUG ON APP', linkColor: 'accent'}
           ] 
        },
        {
          question: 'How can I report bugs?',
          answer: 'You can provide feedback about SelfieTheGame by sending your bugs, questions, and comments to office@handihow.com. You can also report bugs / issues by clicking the buttons below.',
          links: [
            {link: 'https://github.com/handihow/selfiespel/issues', buttonText: 'BUG ON WEBSITE', linkColor: 'primary'},
            {link: 'https://github.com/handihow/selfiethegame/issues', buttonText: 'BUG ON APP', linkColor: 'accent'}
           ] 
        }
  ];

  constructor() { }

  ngOnInit() {
  }

}
