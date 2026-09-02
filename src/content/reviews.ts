export interface ReviewItem {
  id: string;
  name: string;
  initial: string;
  timeAgo: string;
  text: string;
}

// Sourced from the business's own Google Business Profile reviews (4.8★, 19 Bewertungen).
export const googleRating = 4.8;
export const googleReviewCount = 19;
export const googleReviewsUrl = 'https://www.google.com/maps/search/?api=1&query=Sazcar+GmbH+Unterdorfstrasse+14+8165+Sch%C3%B6fflisdorf';

export const reviews: ReviewItem[] = [
  {
    id: 'anton-schnell',
    name: 'Anton Schnell',
    initial: 'A',
    timeAgo: 'vor 3 Monaten',
    text: 'Freundlich und kompetent. Konnte sofort in die Werkstatt einfahren und meine Beleuchtung wurde innert Minuten repariert, Leuchtmittel ersetzt. Schnell und zu einem fairen Preis.',
  },
  {
    id: 'giovanni-ross',
    name: 'Giovanni Ross',
    initial: 'G',
    timeAgo: 'vor 3 Jahren',
    text: 'Schnell, professionell, sympathisch, unkompliziert.',
  },
  {
    id: 'hakan-keskin-1',
    name: 'Hakan Keskin',
    initial: 'H',
    timeAgo: 'vor 4 Jahren',
    text: 'Schnell, flexibel, sehr treue Garage.',
  },
  {
    id: 'kurt-aschmann',
    name: 'Kurt Aschmann',
    initial: 'K',
    timeAgo: 'vor 6 Jahren',
    text: 'Guter Service, rasche und gründliche Auftragserledigung.',
  },
  {
    id: 'kaffeesatzstube',
    name: 'Kaffeesatzstube Maharaa Astrologie',
    initial: 'K',
    timeAgo: 'vor 6 Jahren',
    text: 'Sehr hilfsbereit und kompetent.',
  },
  {
    id: 'hakan-keskin-2',
    name: 'Hakan Keskin',
    initial: 'H',
    timeAgo: 'vor 5 Jahren',
    text: 'Top Garage, super freundliches Auftreten, schnelle Service.',
  },
];
