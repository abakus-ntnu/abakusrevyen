export const previewStates = {
  purchase: {
    label: 'Uten tilgang',
    title: 'Tilgang til sendingen',
    description: 'Se forestillingen direkte og få tilgang til opptaket etterpå. Informasjon om billetter kommer før neste sending.',
    status: 'Billetter kommer',
  },
  waiting: {
    label: 'Før sending',
    title: 'Ingen sending akkurat nå',
    description: 'Tidspunktet for neste direktesending annonseres her.',
    status: 'Ikke på lufta',
  },
  live: {
    label: 'Under sending',
    title: 'Forestillingen er i gang',
    description: 'Direktesendingen vises her når avspilleren er koblet til.',
    status: 'Direkte',
  },
  interval: {
    label: 'Pause',
    title: 'Pause i forestillingen',
    description: 'Sendingen fortsetter her etter pausen.',
    status: 'Pause i forestillingen',
  },
  ended: {
    label: 'Etter sending',
    title: 'Takk for i kveld!',
    description: 'Opptaket blir tilgjengelig her når det er klart.',
    status: 'Sendingen er avsluttet',
  },
  replay: {
    label: 'Opptak',
    title: 'Se opptaket',
    description: 'Når opptaket er klart, kan du se forestillingen igjen her med kjøpt tilgang.',
    status: 'Opptak',
  },
  error: {
    label: 'Avbrutt sending',
    title: 'Vi får ikke kontakt med sendingen.',
    description: 'Behold siden åpen mens forbindelsen gjenopprettes. Sjekk nettforbindelsen din hvis problemet varer.',
    status: 'Forbindelsen er brutt',
  },
} as const

export type PreviewState = keyof typeof previewStates

export const viewingQuestions = [
  {
    question: 'Hvordan får jeg tilgang?',
    answer: 'Når billettsalget åpner, finner du informasjon om pris, innlogging og kjøp her. Det er ikke mulig å kjøpe tilgang i denne forhåndsvisningen.',
  },
  {
    question: 'Kan jeg se forestillingen etterpå?',
    answer: 'Opptaket blir tilgjengelig for betalende seere når det er klart. Vi oppgir hva billetten inkluderer og hvor lenge tilgangen varer før du kjøper. Offentlige YouTube-videoer publiseres senere i revyarkivet.',
  },
  {
    question: 'Hva gjør jeg hvis bildet stopper?',
    answer: 'Sjekk nettforbindelsen og prøv å laste siden på nytt. Hvis vi har problemer med sendingen, kommer en beskjed i spilleren. Bruk hodetelefoner hvis lyden kommer tilbake som ekko.',
  },
]
