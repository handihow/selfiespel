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
        }
  ];

  constructor() { }

  ngOnInit() {
  }

}
