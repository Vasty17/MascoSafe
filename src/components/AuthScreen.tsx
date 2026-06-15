import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Compass, ShieldAlert, Sparkles, CheckSquare, Square } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: { name: string; email: string; avatar: string }) => void;
  onAlertMessage?: (msg: string) => void;
}

export default function AuthScreen({ onLoginSuccess, onAlertMessage }: AuthScreenProps) {
  // Screens toggle: 'login' | 'register'
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateLogin = () => {
    const err: Record<string, string> = {};
    if (!email.trim() || !email.includes('@')) {
      err.email = 'Escribe un correo electrónico válido';
    }
    if (!password.trim() || password.length < 6) {
      err.password = 'La contraseña debe tener mínimo 6 caracteres';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateRegister = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) {
      err.fullName = 'Escribe tu nombre completo para contactarte';
    }
    if (!email.trim() || !email.includes('@')) {
      err.email = 'Escribe un correo electrónico válido';
    }
    if (!phoneNumber.trim()) {
      err.phoneNumber = 'Escribe tu celular para recibir llamadas por tus reportes';
    }
    if (!password.trim() || password.length < 8) {
      err.password = 'La contraseña debe tener mínimo 8 caracteres';
    }
    if (!acceptTerms) {
      err.terms = 'Debes aceptar los términos y condiciones';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) {
      if (onAlertMessage) {
        onAlertMessage('⚠️ Completa tus datos de acceso correctamente.');
      }
      return;
    }

    // Success simulation
    if (onAlertMessage) {
      onAlertMessage(`👋 ¡Bienvenido de nuevo a Mascosafe! Cargando reportes de tu zona.`);
    }
    onLoginSuccess({
      name: email.split('@')[0],
      email: email.trim(),
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKykiGUmBdGBXUes7OPkUNwk2nXXIOOkYBKn0P7WH8yuZwiiCITP2J79TUnD1qHPZj-o0IYKB5lcga_Pg27TfjgBDXIEAxXTwjkytHKczPx7ELb2qALK94M496pLmFj85_xwgOxddk3ECOIOoQ-8YwY1jA2nFPoPtf29wkZzIYcsuqb4J_KQfDgjeQjgi3o_yc9pr25nkCMtfx3B1fiHqrlpJfmUY3G_tSY9MgNVpngTx3kjwH7ScrPSnEDN8MYzSeEKRqmggxdNM'
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) {
      if (onAlertMessage) {
        onAlertMessage('⚠️ Asegúrate de completar los campos y aceptar los términos.');
      }
      return;
    }

    // Success registration simulation
    if (onAlertMessage) {
      onAlertMessage(`🎉 ¡Tu cuenta ha sido creada con éxito! Bienvenido a la red.`);
    }
    onLoginSuccess({
      name: fullName.trim(),
      email: email.trim(),
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKykiGUmBdGBXUes7OPkUNwk2nXXIOOkYBKn0P7WH8yuZwiiCITP2J79TUnD1qHPZj-o0IYKB5lcga_Pg27TfjgBDXIEAxXTwjkytHKczPx7ELb2qALK94M496pLmFj85_xwgOxddk3ECOIOoQ-8YwY1jA2nFPoPtf29wkZzIYcsuqb4J_KQfDgjeQjgi3o_yc9pr25nkCMtfx3B1fiHqrlpJfmUY3G_tSY9MgNVpngTx3kjwH7ScrPSnEDN8MYzSeEKRqmggxdNM'
    });
  };

  const loadDemoUser = () => {
    setEmail('vecino.alerta@mascosafe.com');
    setPassword('mascosafe123');
    setFullName('Vecino Alerta');
    setPhoneNumber('5588776655');
    setAcceptTerms(true);
    if (onAlertMessage) {
      onAlertMessage('💡 Datos de demostración cargados. Presiona "Ingresar".');
    }
  };

  return (
    <div className="relative w-full h-full bg-background-custom flex flex-col justify-start items-center px-4 py-8 overflow-y-auto font-sans no-scrollbar">
      
      {/* Decorative ambient blobs in background */}
      <div className="absolute top-[-5%] left-[-10%] w-60 h-60 bg-primary-container rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-10%] w-60 h-60 bg-status-stray rounded-full mix-blend-multiply filter blur-[100px] opacity-25 animate-pulse" />

      {/* Main card box widget */}
      <main className="w-full relative z-10 flex flex-col gap-6">
        
        {/* Paw logo launcher */}
        <div className="text-center flex flex-col items-center gap-1">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary mb-2 border border-slate-100 transform hover:rotate-12 transition-transform">
            <span className="text-3xl">🐾</span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Mascosafe</h1>
          <p className="text-sm text-on-surface-variant font-medium max-w-[280px] mx-auto leading-relaxed">
            {screen === 'login' 
              ? 'Bienvenido de nuevo. Juntos cuidamos a nuestros peludos.' 
              : 'Únete a nuestra comunidad para proteger a tus mascotas.'
            }
          </p>
        </div>

        {/* Content Form Box */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#eeeef0] relative overflow-hidden flex flex-col gap-4">
          
          {screen === 'login' ? (
            /* ================= LOGIN SCREEN ================= */
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <Mail className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-[#1a1c1e] outline-none"
                  />
                </div>
                {errors.email && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center mb-0.5">
                  <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="password">
                    Contraseña
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      if (onAlertMessage) onAlertMessage('💡 Simulación: Un correo de recuperación ha sido enviado.');
                    }}
                    className="text-[11px] font-bold text-primary hover:underline hover:text-opacity-80"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <Lock className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña de acceso"
                    required
                    className="w-full bg-transparent py-3.5 pl-11 pr-11 text-sm text-[#1a1c1e] outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-slate-400 hover:text-[#1a1c1e] p-1 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.password}</span>}
              </div>

              {/* Submit Enter Button */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#59b3ef] hover:bg-opacity-95 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 active-press transition-all shadow-sm focus:outline-none"
              >
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ================= REGISTER SCREEN ================= */
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="fullname">
                  Nombre Completo
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <User className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-[#1a1c1e] outline-none"
                  />
                </div>
                {errors.fullName && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="reg-email">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <Mail className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-[#1a1c1e] outline-none"
                  />
                </div>
                {errors.email && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="reg-phone">
                  Número de Teléfono
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <Phone className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    required
                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-[#1a1c1e] outline-none"
                  />
                </div>
                {errors.phoneNumber && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.phoneNumber}</span>}
                <p className="text-[10px] text-slate-400 font-medium">Solo se usará para contacto en reportes.</p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-xs font-bold text-[#1a1c1e]" htmlFor="reg-password">
                  Contraseña
                </label>
                <div className="relative flex items-center bg-slate-50 border border-[#bfc7d1]/60 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <Lock className="w-4 h-4 text-[#6f7880] absolute left-3.5" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full bg-transparent py-3 pl-11 pr-11 text-sm text-[#1a1c1e] outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-slate-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.password}</span>}
              </div>

              {/* Consent Terms Checkbox */}
              <div className="flex items-start gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className="pt-0.5 text-primary hover:text-opacity-80 focus:outline-none"
                >
                  {acceptTerms ? (
                    <div className="w-5 h-5 bg-primary/20 text-primary border-2 border-primary rounded flex items-center justify-center font-bold text-xs">✓</div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-[#bfc7d1] rounded" />
                  )}
                </button>
                <span className="text-[11px] font-medium text-[#1a1c1e] leading-snug">
                  Acepto los <span className="text-primary hover:underline cursor-pointer">términos de servicio</span> y la <span className="text-primary hover:underline cursor-pointer">política de privacidad</span>.
                </span>
              </div>
              {errors.terms && <span className="text-[10px] text-[#ba1a1a] font-bold">{errors.terms}</span>}

              {/* Submit button */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#59b3ef] hover:bg-opacity-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active-press transition-all shadow-sm focus:outline-none"
              >
                <span>Crear Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Assist Banner to bypass manual writing */}
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">¿Primera vez interactuando?</span>
            <button
              type="button"
              onClick={loadDemoUser}
              className="text-xs bg-[#cae6ff]/50 text-indigo-900 border border-transparent font-extrabold py-2 px-3 rounded-xl hover:bg-[#cae6ff] transition-all hover:shadow-sm"
            >
              🔐 Autocompletar datos de prueba
            </button>
          </div>

        </div>

        {/* Change Screen navigation prompt */}
        <div className="text-center">
          <p className="text-xs font-semibold text-on-surface-variant flex items-center justify-center gap-1">
            {screen === 'login' ? (
              <>
                <span>¿No tienes cuenta?</span>
                <button 
                  onClick={() => { setScreen('register'); setErrors({}); }} 
                  className="text-primary font-bold hover:underline focus:outline-none ml-1 uppercase text-[11px] tracking-wide"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                <span>¿Ya tienes cuenta?</span>
                <button 
                  onClick={() => { setScreen('login'); setErrors({}); }} 
                  className="text-primary font-bold hover:underline focus:outline-none ml-1 uppercase text-[11px] tracking-wide"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>

      </main>

    </div>
  );
}
