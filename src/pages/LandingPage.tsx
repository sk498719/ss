import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Content, SubscriptionPlan, Instructor } from '../types';

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-lg scale-110"
        >
          <source src="https://pub-661756f17ee54ab9a3f1511a1362c7bc.r2.dev/1448735-uhd_4096_2160_24fps_1_1-transcode.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-5 md:px-8 lg:px-12 max-w-2xl pt-20">
        <h1 className="font-mono text-xl md:text-2xl text-white font-normal uppercase tracking-[0.15em] leading-tight mb-5">
          Serra & Soul
        </h1>
        <p className="text-white/70 text-sm md:text-base font-sans leading-relaxed max-w-md mb-8">
          Meditatie, yoga, pilates en masterclasses gemaakt om
          rust, kracht en balans in je dagelijkse leven te brengen.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/auth?mode=register" className="inline-flex items-center gap-2 bg-white text-charcoal-800 px-7 py-3 rounded-[3px] text-[12px] font-mono uppercase tracking-wide font-medium hover:bg-sand-100 transition-all active:scale-[0.98]">
            <Play size={14} fill="currentColor" />
            Start Gratis Proefperiode
          </Link>
          <a href="#practices" className="font-sans text-[14px] text-white/60 hover:text-white transition-colors flex items-center gap-2">
            Verkennen <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Practices({ content }: { content: Content[] }) {
  const categories = [
    { key: 'meditation', title: 'Meditatie', image: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { key: 'yoga', title: 'Yoga', image: 'https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { key: 'pilates', title: 'Pilates', image: 'https://images.pexels.com/photos/4056506/pexels-photo-4056506.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { key: 'online_sessie', title: 'Online Sessies', image: 'https://images.pexels.com/photos/3560166/pexels-photo-3560166.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  return (
    <section id="practices" className="py-20 md:py-28 px-5 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono text-xl md:text-2xl text-charcoal-900 uppercase tracking-wide mb-2">
          Praktijken
        </h2>
        <p className="text-charcoal-400 text-sm font-sans mb-8">Ontdek jouw pad naar balans.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = content.filter(c => c.category === cat.key).length;
            return (
              <Link
                key={cat.key}
                to={`/library?category=${cat.key}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden   transition-shadow"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-mono text-sm text-white uppercase tracking-wide mb-0.5">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-[11px] text-white/50">
                    {count} sessies
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Instructors({ instructors }: { instructors: Instructor[] }) {
  return (
    <section className="py-20 md:py-28 px-5 md:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-mono text-xl md:text-2xl text-charcoal-900 uppercase tracking-wide mb-2">
          Jouw Begeleiders
        </h2>
        <p className="text-charcoal-400 text-sm font-sans mb-8">Expert instructeurs voor elke praktijk.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="group text-center">
              <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden mb-4 ">
                <img
                  src={instructor.avatar_url}
                  alt={instructor.name}
                  className="w-full h-full object-cover transition-transform duration-500 "
                />
              </div>
              <h4 className="font-mono text-xs uppercase tracking-wide">{instructor.name}</h4>
              <p className="font-sans text-[11px] text-charcoal-400 mt-0.5">{instructor.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ plans }: { plans: SubscriptionPlan[] }) {
  const [yearly, setYearly] = useState(false);
  const premiumPlan = plans.find(p => p.price_monthly > 0 && p.price_monthly < 100) || plans[1] || plans[0];

  if (!premiumPlan) return null;

  const price = yearly ? premiumPlan.price_yearly : premiumPlan.price_monthly;
  const period = yearly ? '/jaar' : '/maand';

  return (
    <section id="pricing" className="relative py-20 md:py-32 px-5 md:px-8 lg:px-12 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-2xl scale-110"
        >
          <source src="https://pub-661756f17ee54ab9a3f1511a1362c7bc.r2.dev/1448735-uhd_4096_2160_24fps_1_1-transcode.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-charcoal-900/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-mono text-xl md:text-2xl text-white uppercase tracking-wide mb-2">
            Lidmaatschap
          </h2>
          <p className="text-white/60 text-sm font-sans">Onbeperkte toegang tot alle praktijken en masterclasses.</p>
        </div>

        <div className="flex items-center justify-center gap-1 mb-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-[3px] p-1 flex">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 text-[12px] font-mono uppercase tracking-wide rounded-[3px] transition-all duration-200 ${!yearly ? 'bg-white text-charcoal-800' : 'text-white/70'}`}
            >
              Maandelijks
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 text-[12px] font-mono uppercase tracking-wide rounded-[3px] transition-all duration-200 ${yearly ? 'bg-white text-charcoal-800' : 'text-white/70'}`}
            >
              Jaarlijks
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md text-charcoal-800 rounded-2xl p-8  relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sage-500 text-white text-[10px] px-3 py-0.5 rounded-full font-mono uppercase tracking-wide">
              Populair
            </span>
            <h3 className="font-mono text-lg uppercase tracking-wide mb-1 text-center">{premiumPlan.name}</h3>
            <p className="text-[13px] font-sans leading-relaxed mb-6 text-charcoal-500 text-center">
              {premiumPlan.description}
            </p>

            <div className="mb-6 text-center">
              <span className="font-mono text-4xl">${price}</span>
              <span className="text-sm font-sans ml-1 text-charcoal-500">{period}</span>
            </div>

            <Link
              to="/auth?mode=register"
              className="block text-center w-full py-3 text-[12px] font-mono uppercase tracking-wide font-medium rounded-[3px] transition-all duration-200 active:scale-[0.98] bg-charcoal-800 text-white hover:bg-charcoal-900 mb-6"
            >
              Begin Vandaag
            </Link>

            <ul className="space-y-3">
              {(premiumPlan.features as string[]).map((feature, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-[13px] font-sans text-charcoal-600">
                  <Check size={14} className="mt-0.5 flex-shrink-0 text-sage-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-24 md:py-32">
      <img
        src="https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Wellness"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="relative z-10 text-center px-5 md:px-8">
        <h2 className="font-mono text-2xl md:text-4xl text-white uppercase tracking-wide mb-6">
          Jouw reis begint vandaag.
        </h2>
        <p className="text-white/50 text-sm font-sans mb-8 max-w-md mx-auto">
          Sluit je aan bij duizenden die hun balans hebben gevonden met Serra & Soul.
        </p>
        <Link to="/auth?mode=register" className="inline-flex items-center gap-2 bg-white text-charcoal-800 px-8 py-3 rounded-[3px] text-[12px] font-mono uppercase tracking-wide font-medium hover:bg-sand-100 transition-all active:scale-[0.98]">
          Start Gratis
        </Link>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [contentRes, plansRes, instructorsRes] = await Promise.all([
        supabase.from('content').select('*'),
        supabase.from('subscription_plans').select('*').eq('is_active', true).order('price_monthly'),
        supabase.from('instructors').select('*'),
      ]);
      if (contentRes.data) setContent(contentRes.data);
      if (plansRes.data) setPlans(plansRes.data);
      if (instructorsRes.data) setInstructors(instructorsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Hero />
      <Practices content={content} />
      <Instructors instructors={instructors} />
      <Pricing plans={plans} />
      <CallToAction />
    </div>
  );
}
