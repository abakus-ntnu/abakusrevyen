import { PageContainer } from '@/components/layout/page-container'

export function PrivacyPage() {
  return (
    <PageContainer title="Personvern" intro="Denne teksten beskriver det som faktisk finnes i v2 akkurat nå, og må oppdateres før nye tjenester tas i bruk.">
      <div className="max-w-3xl space-y-8 leading-7 text-muted-foreground">
        <section><h2 className="mb-2 text-xl font-semibold text-foreground">Nåværende løsning</h2><p>Appskallet har ingen innlogging, analyse, betaling eller chat koblet til. Det lagrer ikke personopplysninger i Supabase. Vanlige serverlogger kan fortsatt bli behandlet av hostingleverandøren når siden publiseres.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold text-foreground">Før lansering</h2><p>Vi planlegger innlogging, betaling, livestream og chat. Før de aktiveres skal vi dokumentere behandlingsgrunnlag, lagringstid, databehandlere, sletting og hvordan brukere kan kontakte oss om personopplysninger.</p></section>
        <section><h2 className="mb-2 text-xl font-semibold text-foreground">Kontakt</h2><p>Spørsmål kan sendes til <a className="text-primary hover:underline" href="mailto:revystyret@abakus.no">revystyret@abakus.no</a>.</p></section>
      </div>
    </PageContainer>
  )
}
