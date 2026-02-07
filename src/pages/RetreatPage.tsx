import { useState } from 'react';

export default function RetreatPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Wat kan ik verwachten van het Serra & Soul Retreat?',
      answer: 'Tijdens het lente retreat dompel je je onder in een week vol ontspanning, verbinding en hernieuwde energie. Elke dag brengt yoga/Pilates, ceremonies, stilte, verbinding, natuur en sisterhood. Het is een reis naar binnen, zodat je weer thuiskomt bij jezelf en met hernieuwde kracht en inspiratie naar huis keert.'
    },
    {
      question: 'Kan ik dit retreat via mijn persoonlijke ontwikkelingsbudget van werk betalen?',
      answer: 'Soms kan dat! Sommige vrouwen gebruiken hun persoonlijke- of scholingsbudget om een retreat te financieren. Het verschilt per organisatie, dus check even bij je werkgever of HR. Zo kun jij op je eigen manier zorgen dat deze bijzondere week helemaal voor jou toegankelijk wordt.'
    },
    {
      question: 'Moet ik ervaring hebben met yoga of ceremonies?',
      answer: 'Nee hoor! Alles wat we doen is zo vormgegeven dat je het kunt beleven op jouw manier, op jouw tempo. Of je nu vaker yoga hebt gedaan en je wilt verdiepen of voor het eerst een ceremonie ervaart, je bent welkom precies zoals je bent.'
    },
    {
      question: 'Hoe werkt de aanmelding en betaling?',
      answer: 'Je kunt je inschrijven via onderstaande boekingsknop. Na aanmelding vragen we een aanbetaling van 10% om je plek te reserveren. We plannen daarna een kennismakingscall, zodat we samen kunnen afstemmen of dit retreat goed bij je past. Daarna kun je kiezen voor betaling in één keer of in termijnen. Voelt het niet als jouw moment? Geen probleem, dan krijg je jouw aanbetaling gewoon weer teruggestort.'
    }
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg"
          alt="Serra Soul Retreat"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/40 via-charcoal-900/50 to-charcoal-900/60" />

        <div className="relative z-10 text-center px-5 max-w-5xl">
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide leading-tight mb-4 drop-shadow-lg">
            Serra & Soul
          </h1>
          <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide leading-tight drop-shadow-lg">
            LENTE RetrEAT 2026
          </h1>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-7">
              <p className="text-charcoal-700 font-sans text-lg md:text-xl leading-relaxed mb-10">
                Een lente retreat in Portugal om te vertragen en weer thuis te komen bij jezelf. Omringd door natuur, rust en vrouwelijke energie ontstaat ruimte om los te laten en te groeien.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 text-charcoal-800 font-mono uppercase tracking-wide text-sm hover:text-sage-700 transition-all group"
              >
                DISCOVERY CALL
                <div className="w-10 h-10 bg-sage-100 rounded-[3px] flex items-center justify-center group-hover:bg-sage-200 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              </a>
            </div>
            <div className="md:col-span-5 space-y-8">
              <div className="bg-white rounded-[3px] p-6 shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 mb-4">DEELNAME</div>
                <div className="space-y-2">
                  <div className="text-charcoal-800 font-sans text-base">11 deelnemers</div>
                  <div className="text-charcoal-800 font-sans text-base">€1700 incl. verblijf</div>
                </div>
              </div>
              <div className="bg-white rounded-[3px] p-6 shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 mb-4">DETAILS</div>
                <div className="space-y-2">
                  <div className="text-charcoal-800 font-sans text-base">29 mei - 2 juni 2026</div>
                  <div className="text-charcoal-800 font-sans text-base">Burgau, Portugal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="bg-white py-20 md:py-28 px-5 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-7 space-y-14">
              <div>
                <h2 className="font-mono text-2xl md:text-3xl uppercase tracking-wide text-charcoal-900 mb-6">
                  het retreat
                </h2>
                <p className="text-charcoal-600 font-sans text-base leading-relaxed">
                  Een betoverende reis voor vrouwen die willen ontwaken, bloeien en thuiskomen bij zichzelf. Een 6-daagse retreat in Portugal voor vrouwen die voelen dat het tijd is om in hun kracht te stappen. Niet als ontsnapping, maar als het begin van een nieuw hoofdstuk.
                </p>
              </div>

              <div>
                <h2 className="font-mono text-2xl md:text-3xl uppercase tracking-wide text-charcoal-900 mb-6">
                  programma
                </h2>
                <div className="space-y-6">
                  <p className="text-charcoal-600 font-sans text-base leading-relaxed">
                    Ontwaken, bloeien en thuiskomen. De lente nodigt je uit om nieuwe energie te ervaren. Terwijl de natuur tot leven komt, mag jij ook ruimte maken om te groeien en te bloeien. Dit retreat is een kans om te ontspannen, los te laten wat niet meer dient en te ontdekken wie je echt bent.
                  </p>
                  <p className="text-charcoal-600 font-sans text-base leading-relaxed">
                    Bij Serra & Soul creëren we een veilige, liefdevolle ruimte waar je je innerlijke kracht hervindt en voelt wie je werkelijk bent. Samen met andere vrouwen stap je in een cirkel van sisterhood, verbinding en diepe magie. Hier mag je helemaal zijn, zonder verwachtingen, zonder oordeel. Alleen jij, precies zoals je mag zijn.
                  </p>
                  <div className="bg-sand-50 rounded-[3px] p-6 mt-8">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 mb-4">ACTIVITEITEN</div>
                    <div className="space-y-2.5">
                      <div className="text-charcoal-800 font-sans text-base">✧ Dagelijkse yoga of Pilates</div>
                      <div className="text-charcoal-800 font-sans text-base">✧ Rituelen en Cacao ceremonies</div>
                      <div className="text-charcoal-800 font-sans text-base">✧ Nieuwe energie en creativiteit</div>
                      <div className="text-charcoal-800 font-sans text-base">✧ Ruimte voor natuur en transformatie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="aspect-[4/5] rounded-[3px] overflow-hidden shadow-md">
                <img
                  src="https://images.pexels.com/photos/3822718/pexels-photo-3822718.jpeg"
                  alt="Yoga practice"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-[4/5] rounded-[3px] overflow-hidden shadow-md">
                <img
                  src="https://images.pexels.com/photos/3822630/pexels-photo-3822630.jpeg"
                  alt="Nature"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-gradient-to-br from-sage-50 to-sand-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[3px] shadow-md p-8 md:p-12">
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-9">
                <p className="text-charcoal-700 font-sans text-lg md:text-xl leading-relaxed italic">
                  "Wát een ontzettend groot cadeau om hier onderdeel van te zijn geweest en alle mooie mensen die deelnamen én tot de organisatie behoorden te hebben ontmoet. Woorden doen echt tekort aan het beschrijven van de ervaring, maar ik kan dit met heel mijn hart aanbevelen."
                </p>
              </div>
              <div className="md:col-span-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-sage-600">REVIEW</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Villa Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5 space-y-8">
              <div>
                <h2 className="font-mono text-2xl md:text-3xl uppercase tracking-wide text-charcoal-900 mb-6">
                  de villa
                </h2>
                <p className="text-charcoal-600 font-sans text-base leading-relaxed mb-6">
                  Tijdens het retreat verblijven we bij Honest Place, een luxueuze villa, verstopt in het groen van de Algarve, met panoramisch uitzicht op de oceaan. Deze plek ademt schoonheid, comfort en verbinding met de natuur.
                </p>
                <p className="text-charcoal-600 font-sans text-base leading-relaxed italic mb-8">
                  Een plek waar je niets hoeft en alles mag voelen. Hier land je. Hier adem je. Hier kom je thuis.
                </p>
                <div className="bg-sand-50 rounded-[3px] p-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 mb-4">WAT JE HIER MAG VERWACHTEN</div>
                  <div className="space-y-2.5">
                    <div className="text-charcoal-800 font-sans text-base">✧ Rust en ruimte midden in de natuur</div>
                    <div className="text-charcoal-800 font-sans text-base">✧ Zoutwater zwembad met natuurlijke reiniging</div>
                    <div className="text-charcoal-800 font-sans text-base">✧ Yoga, Pilates & ceremonies in de buitenlucht</div>
                    <div className="text-charcoal-800 font-sans text-base">✧ Grote tuin met fijne plekjes om te ontspannen</div>
                    <div className="text-charcoal-800 font-sans text-base">✧ 2 persoons kamers met luxe en-suite badkamer</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="aspect-[16/10] rounded-[3px] overflow-hidden shadow-md">
                <img
                  src="https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg"
                  alt="Villa exterior"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-[3px] overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
                    alt="Villa interior"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-[3px] overflow-hidden shadow-md">
                  <img
                    src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"
                    alt="Villa pool"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-gradient-to-br from-sage-50 to-sand-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[3px] shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/5] md:aspect-auto">
                <img
                  src="https://images.pexels.com/photos/3822695/pexels-photo-3822695.jpeg"
                  alt="Retreat experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="font-mono text-2xl uppercase tracking-wide text-charcoal-900 mb-3">
                    SERRA & SOUL RETREAT
                  </h3>
                  <div className="text-4xl font-mono text-sage-700 mb-2">€1799</div>
                  <div className="text-sm text-charcoal-500 font-sans">Betaling in termijnen mogelijk</div>
                </div>

                <div className="mb-8 bg-sand-50 rounded-[3px] p-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-400 mb-4">
                    inbegrepen in jouw ervaring
                  </div>
                  <div className="space-y-2.5">
                    <div className="text-charcoal-800 font-sans text-sm">✧ 5 nachten bij Honest Place in Portugal</div>
                    <div className="text-charcoal-800 font-sans text-sm">✧ Drie heerlijke maaltijden per dag, snacks & drankjes</div>
                    <div className="text-charcoal-800 font-sans text-sm">✧ Ceremoniële cacao</div>
                    <div className="text-charcoal-800 font-sans text-sm">✧ Yoga, pilates, rituelen, workshops & begeleiding</div>
                    <div className="text-charcoal-800 font-sans text-sm">✧ Persoonlijk werkboek / journal</div>
                    <div className="text-charcoal-800 font-sans text-sm">✧ Gebruik van alle yoga materialen</div>
                  </div>
                </div>

                <div className="text-xs text-charcoal-500 font-sans mb-6">
                  Vlucht en transfer zijn niet inbegrepen
                </div>

                <a
                  href="#contact"
                  className="w-full text-center bg-charcoal-800 text-white px-8 py-4 rounded-[3px] text-sm font-mono uppercase tracking-wide hover:bg-charcoal-900 transition-colors shadow-md"
                >
                  discovery call inplannen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-mono text-3xl md:text-4xl uppercase tracking-wide text-charcoal-900 mb-2">
              VEELGESTELDE VRAGEN
            </h2>
            <p className="text-charcoal-500 font-sans text-base">
              Heb je vragen over het retreat? Hieronder vind je antwoorden op de meest gestelde vragen.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="aspect-square rounded-[3px] overflow-hidden shadow-md sticky top-8">
                <img
                  src="https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg"
                  alt="FAQ"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-1">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-sand-50 rounded-[3px] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-sage-50 transition-colors group"
                  >
                    <h3 className="font-mono text-sm md:text-base uppercase tracking-wide text-charcoal-900 pr-4 group-hover:text-sage-700 transition-colors">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className={`transition-transform ${openFaq === idx ? 'rotate-45' : ''}`}
                      >
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 bg-white">
                      <p className="text-charcoal-600 font-sans text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-gradient-to-br from-sage-100 to-sand-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-[3px] shadow-lg p-10 md:p-14">
            <p className="text-charcoal-700 font-sans text-lg md:text-xl leading-relaxed mb-10">
              Durf stil te staan, te ademen en je volledig te openen voor wat er in jou gaat ontwaken. Plan een Discovery Call en ontdek hoe het retreat je uitnodigt om los te laten en door vrouwelijke magie je ware kracht te voelen.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 text-charcoal-800 font-mono uppercase tracking-wide text-base hover:text-sage-700 transition-all group"
            >
              DISCOVERY CALL
              <div className="w-12 h-12 bg-sage-100 rounded-[3px] flex items-center justify-center group-hover:bg-sage-200 transition-colors">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 9h16M9 1l8 8-8 8" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-900 text-white py-16 md:py-24 px-5 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="font-mono text-sm uppercase tracking-wide text-white mb-6">OVERZICHT</div>
              <div className="space-y-3">
                <a href="/" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Home</a>
                <a href="/retreat" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Retreats</a>
                <a href="/#events" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Events</a>
                <a href="/journal" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Blogs</a>
              </div>
            </div>

            <div>
              <div className="font-mono text-sm uppercase tracking-wide text-white mb-6">OVER</div>
              <div className="space-y-3">
                <a href="/over-serra-soul" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Over Ons</a>
                <a href="/info" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Veelgestelde vragen</a>
                <a href="/contact" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Contact</a>
                <a href="/terms-conditions" className="block text-white/70 font-sans text-sm hover:text-white transition-colors">Voorwaarden</a>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="font-mono text-sm uppercase tracking-wide text-white mb-4">Community</div>
              <p className="text-white/70 font-sans text-sm mb-6 leading-relaxed">
                Ontvang de laatste updates van Serra & Soul
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-[3px] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-sage-400 focus:bg-white/15 transition-all"
                />
                <button className="bg-sage-600 text-white px-6 py-3 rounded-[3px] text-sm font-mono uppercase tracking-wide hover:bg-sage-700 transition-colors shadow-md">
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
            <div className="font-mono text-sm uppercase tracking-wide">Serra & Soul</div>
            <div className="flex items-center gap-6 text-sm text-white/60 font-sans">
              <a href="/privacyverklaring" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-conditions" className="hover:text-white transition-colors">Voorwaarden</a>
              <span>©2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
