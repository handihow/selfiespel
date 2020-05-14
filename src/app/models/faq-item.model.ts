interface FaqItemLink {
	link: string;
	buttonText: string;
	linkColor: string;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  links?: FaqItemLink[];
}