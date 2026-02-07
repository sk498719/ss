import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setIsRegister(searchParams.get('mode') === 'register');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err);
      } else {
        setSuccess(true);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex">
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://images.pexels.com/photos/3822648/pexels-photo-3822648.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Yoga practice"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/30" />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 lg:px-24 bg-sand-50">
          <div className="w-full max-w-sm text-center">
            <h1 className="font-mono text-2xl text-charcoal-800 uppercase tracking-wide mb-4">Welkom bij de praktijk</h1>
            <p className="text-charcoal-500 text-sm font-sans leading-relaxed mb-8">
              Je account is aangemaakt. Log in om je welzijnsreis te beginnen.
            </p>
            <button
              onClick={() => { setSuccess(false); setIsRegister(false); }}
              className="btn-primary w-full"
            >
              Inloggen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={isRegister
            ? 'https://images.pexels.com/photos/3822167/pexels-photo-3822167.jpeg?auto=compress&cs=tinysrgb&w=1200'
            : 'https://images.pexels.com/photos/3822648/pexels-photo-3822648.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }
          alt="Wellness"
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-charcoal-900/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-mono text-lg text-white leading-relaxed uppercase tracking-wide">
            {isRegister
              ? '"The present moment is filled with joy and happiness."'
              : '"In the midst of movement and chaos, keep stillness inside of you."'
            }
          </p>
          <p className="text-white/60 text-sm font-sans mt-4">
            {isRegister ? '-- Thich Nhat Hanh' : '-- Deepak Chopra'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-sand-50">
        <div className="px-6 md:px-12 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-charcoal-500 text-sm font-sans hover:text-charcoal-800 transition-colors">
            <ArrowLeft size={14} />
            Terug
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h1 className="font-mono text-2xl text-charcoal-800 uppercase tracking-wide mb-2">
                {isRegister ? 'Begin je reis' : 'Welkom terug'}
              </h1>
              <p className="text-charcoal-400 text-sm font-sans">
                {isRegister
                  ? 'Maak je account aan om toegang te krijgen tot meditaties, flows en meer.'
                  : 'Log in om je praktijk voort te zetten.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[12px] text-charcoal-500 mb-1.5 font-sans">Volledige Naam</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isRegister}
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm text-charcoal-800 font-sans
                             focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all placeholder:text-charcoal-300 shadow-sm"
                    placeholder="Jouw naam"
                  />
                </div>
              )}

              <div>
                <label className="block text-[12px] text-charcoal-500 mb-1.5 font-sans">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm text-charcoal-800 font-sans
                           focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all placeholder:text-charcoal-300 shadow-sm"
                  placeholder="jij@voorbeeld.nl"
                />
              </div>

              <div>
                <label className="block text-[12px] text-charcoal-500 mb-1.5 font-sans">Wachtwoord</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm text-charcoal-800 font-sans
                             focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition-all pr-10 placeholder:text-charcoal-300 shadow-sm"
                    placeholder="Min. 6 tekens"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-terracotta-50 border border-terracotta-200 rounded-lg px-4 py-2.5">
                  <p className="text-terracotta-600 text-sm font-sans">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 disabled:opacity-50"
              >
                {loading ? 'Even geduld...' : isRegister ? 'Account Aanmaken' : 'Inloggen'}
              </button>
            </form>

            <p className="mt-8 text-center text-charcoal-400 text-sm font-sans">
              {isRegister ? 'Heb je al een account? ' : 'Nieuw bij Serra & Soul? '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-charcoal-800 font-medium hover:underline underline-offset-4"
              >
                {isRegister ? 'Inloggen' : 'Sluit je aan'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
