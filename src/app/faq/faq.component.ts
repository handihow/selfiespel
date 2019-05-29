import { Component, OnInit } from '@angular/core';
import {FaqItem} from '@angular-material-extensions/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  
  list: FaqItem[] = [
        {
          question: 'Bètaversie?',
          answer: 'SelfieTheGame bevindt zich in een testfase. De bètaversie van SelfieTheGame wordt momenteel uitgetest in verschillende settings zoals teamuitjes, familieaangelegenheden en op scholen.'
        },
        {
          question: 'Wie kan SelfieTheGame spelen?',
          answer: 'Iedereen kan het selfiespel spelen in groepsverband. Het kan bijvoorbeeld gespeeld worden tijdens familieaangelegenheden, bedrijfsuitjes en met de klas. We raden aan om het spel met minimaal 4 personen te spelen (2 teams van 2 mensen).'
        },
        {
          question: 'Kan ik SelfieTheGame alleen spelen?',
          answer: 'Nee, want SelfieTheGame is een groepsspel. We raden aan om het spel met minimaal 4 personen te spelen (2 teams van 2 mensen).'
        },
        {
          question: 'Zijn er kosten verbonden aan SelfieTheGame?',
          answer: 'Op dit moment is SelfieTheGame in een beta-versie beschikbaar en worden er verschillende tests gedaan. Er zijn op dit moment geen kosten aan verbonden. Later zullen er gratis en betaalde varianten worden toegevoegd aan het platform.'
        },
        {
          question: 'Hoe kan ik meehelpen aan de ontwikkeling van SelfieTheGame?',
          answer: 'SelfieTheGame bevindt zich momenteel in een testfase. Je kunt meehelpen door het spel te spelen, bugs te rapporteren en/of feedback te geven aan HandiHow met constructieve opmerkingen.'
        },
        {
          question: 'Hoe kan ik feedback geven?',
          answer: 'Je kunt feedback geven over SelfieTheGame door je bugs, vragen en opmerkingen te sturen naar office@handihow.com'
        }
  ];


  constructor() { }

  ngOnInit() {
  }

}
