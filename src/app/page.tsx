'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Home, DollarSign, Camera, Briefcase, Plus, CheckCircle2, Clock, X, Edit2, Trash2, ChevronRight, Building2, Hammer, Bell, BarChart3, Landmark, Banknote, ArrowRightLeft, FileCheck, LogOut, Users, Shield } from 'lucide-react'

// Types
type Role = 'master' | 'ceo' | 'administrador' | 'finanzas' | 'logistica'
type Profile = { id: string; email: string; nombre: string; rol: Role; activo: boolean }
type Property = { id: string; lote: string; numero: string; modelo: string; ubicacion: string; estado: string; fecha_estimada_entrega: string; direccion: string; precio_venta: number; destino: string; notas: string }
type Credit = { id: string; tipo: string; banco: string; numero_credito: string; propiedad_id: string; monto_aprobado: number; numero_draws: number; fecha_cierre: string; fecha_vencimiento: string; contacto_banco: string; monto_desembolso: number; cuota_mensual: number; plazo_meses: number; fecha_desembolso: string; fecha_primer_pago: string; reemplaza_ground_up_id: string; tasa_interes: number; notas: string }
type Draw = { id: number; credit_id: string; numero: number; monto: number; porcentaje_avance: number; fase_descripcion: string; fecha_solicitado: string; fecha_inspeccion: string; fecha_recibido: string; estado_inspeccion: string; solicitado: boolean; recibido: boolean; notas: string }
type DscrPayment = { id: number; credit_id: string; fecha_vencimiento: string; monto: number; concepto: string; pagado: boolean; fecha_pago: string }
type Activity = { id: string; nombre: string; fase: string; orden: number; duracion_dias: number; presupuesto_estimado: number; forma_pago: string; momento_pago: string; descripcion: string }
type ProjectInstance = { id: string; propiedad_id: string; fecha_inicio: string }
type ProjectActivity = { id: number; project_instance_id: string; actividad_id: string; fecha_programada: string; fecha_ejecutada: string; estado: string; notas: string }
type Expense = { id: string; propiedad_id: string; actividad_id: string; descripcion: string; monto: number; fecha: string; forma_pago: string; momento_pago: string; beneficiario: string; notas: string }
type Photo = { id: string; propiedad_id: string; fase: string; url: string; fecha: string; descripcion: string }

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0)
const fmtDate = (d: string) => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const FASES = ['Preconstrucción', 'Fundación', 'Estructura', 'MEP', 'Acabados interiores', 'Acabados exteriores', 'Cierre']

const ROLE_LABELS: Record<Role, string> = { master: 'Master', ceo: 'CEO', administrador: 'Administrador', finanzas: 'Finanzas', logistica: 'Logística' }

function canWrite(rol: Role, module: string): boolean {
  const perms: Record<string, Role[]> = {
    properties: ['master', 'ceo', 'administrador'],
    credits: ['master', 'ceo', 'administrador', 'finanzas'],
    activities: ['master'],
    projects: ['master', 'administrador', 'logistica'],
    expenses: ['master', 'ceo', 'administrador', 'finanzas'],
    photos: ['master', 'administrador', 'logistica'],
    users: ['master'],
  }
  return (perms[module] || []).includes(rol)
}

// ============================================================
// PUBLIC LANDING PAGE
// ============================================================
function PublicLandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', newsletter: false })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    await new Promise(resolve => setTimeout(resolve, 900))
    setFormStatus('sent')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0b1e3d 0%, #1e4d8c 45%, #0d2847 100%)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(12px)', background: 'rgba(11,30,61,0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '999px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffffff' }} />
            <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '26px', color: '#ffffff', lineHeight: 1 }}>Lavb.us</span>
          </div>
          <button
            onClick={onLoginClick}
            style={{ padding: '8px 20px', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '999px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '96px 24px 64px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6ba3e8', marginBottom: '20px' }}>Construction Management · Florida</p>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, margin: '0 0 16px' }}>
          We Built House.<br />
          <span style={{ color: '#6ba3e8', fontWeight: 600 }}>You make Homes...</span>
        </h1>
      </section>

      {/* Logo variants */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* White bg */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px 44px', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1e4d8c' }} />
          <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '36px', color: '#1e4d8c', lineHeight: 1 }}>Lavb.us</span>
        </div>
        {/* Blue bg */}
        <div style={{ background: '#1e4d8c', borderRadius: '16px', padding: '28px 44px', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '2px solid rgba(255,255,255,0.2)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffffff' }} />
          <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '36px', color: '#ffffff', lineHeight: 1 }}>Lavb.us</span>
        </div>
        {/* Dark bg */}
        <div style={{ background: '#1f2937', borderRadius: '16px', padding: '28px 44px', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6ba3e8' }} />
          <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '36px', color: '#6ba3e8', lineHeight: 1 }}>Lavb.us</span>
        </div>
      </section>

      {/* Contact form */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px 96px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>Get in touch</h2>

        {formStatus === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px solid rgba(107,163,232,0.3)', borderRadius: '12px', background: 'rgba(107,163,232,0.06)' }}>
            <p style={{ color: '#6ba3e8', fontSize: '16px', marginBottom: '8px' }}>Thanks for reaching out!</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '6px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '6px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>Message</label>
              <textarea
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '6px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={e => setFormData({ ...formData, newsletter: e.target.checked })}
                style={{ accentColor: '#1e4d8c', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>Subscribe to our newsletter</span>
            </label>
            <button
              type="submit"
              disabled={formStatus === 'sending'}
              style={{ padding: '14px', background: '#1e4d8c', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s', opacity: formStatus === 'sending' ? 0.7 : 1 }}
            >
              {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '28px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
        © 2026 Lavb.us · LAVB Corp · Construction Management · Florida
      </footer>
    </div>
  )
}

// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Revisa tu email para confirmar tu cuenta.')
        setLoading(false); return
      }
    } catch (e: any) {
      setError(e.message || 'Error de autenticación')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px' }}>
          ← Back
        </button>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 px-8 py-4 border-2 border-[#1e4d8c] rounded-full mb-6">
            <div className="w-3 h-3 rounded-full bg-[#1e4d8c]" />
            <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '42px', color: '#1e4d8c', lineHeight: 1 }}>Lavb.us</span>
          </div>
          <p className="text-stone-500 text-sm">Construction Management · Florida</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-8">
          <h2 className="text-xl font-light mb-6 text-center" style={{ fontFamily: 'Inter' }}>
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          {error && <div className={`text-xs p-3 mb-4 border ${error.includes('confirmar') ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-rose-950/30 border-rose-800 text-rose-400'}`}>{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-stone-950 border border-stone-800 px-3 py-2 text-sm text-stone-200 outline-none focus:border-[#1e4d8c]" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1.5">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} className="w-full bg-stone-950 border border-stone-800 px-3 py-2 text-sm text-stone-200 outline-none focus:border-[#1e4d8c]" placeholder="••••••••" />
            </div>
            <button onClick={handleSubmit} disabled={loading || !email || !password} className="w-full py-2.5 text-sm bg-[#1e4d8c] hover:bg-[#2563eb] text-white disabled:opacity-40 transition">
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }} className="text-xs text-stone-500 hover:text-stone-300">
              {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [activeModule, setActiveModule] = useState('overview')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  // Data state
  const [properties, setProperties] = useState<Property[]>([])
  const [credits, setCredits] = useState<Credit[]>([])
  const [draws, setDraws] = useState<Draw[]>([])
  const [dscrPayments, setDscrPayments] = useState<DscrPayment[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [projectInstances, setProjectInstances] = useState<ProjectInstance[]>([])
  const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) { setShowLogin(false); loadProfile(session.user.id) }
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) { setProfile(data as Profile); await loadAllData() }
    setLoading(false)
  }

  const loadAllData = async () => {
    const [p, c, d, dp, a, pi, pa, e, ph, pr] = await Promise.all([
      supabase.from('properties').select('*').order('numero'),
      supabase.from('credits').select('*'),
      supabase.from('draws').select('*').order('numero'),
      supabase.from('dscr_payments').select('*').order('fecha_vencimiento'),
      supabase.from('activities').select('*').order('orden'),
      supabase.from('project_instances').select('*'),
      supabase.from('project_activities').select('*'),
      supabase.from('expenses').select('*').order('fecha', { ascending: false }),
      supabase.from('photos').select('*').order('fecha', { ascending: false }),
      supabase.from('profiles').select('*'),
    ])
    if (p.data) setProperties(p.data)
    if (c.data) setCredits(c.data)
    if (d.data) setDraws(d.data)
    if (dp.data) setDscrPayments(dp.data)
    if (a.data) setActivities(a.data)
    if (pi.data) setProjectInstances(pi.data)
    if (pa.data) setProjectActivities(pa.data)
    if (e.data) setExpenses(e.data)
    if (ph.data) setPhotos(ph.data)
    if (pr.data) setAllProfiles(pr.data)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); setProfile(null) }

  if (loading) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="text-stone-500 italic">Cargando...</div>
    </div>
  )

  // No session: public landing or login
  if (!session) {
    if (showLogin) return <LoginScreen onBack={() => setShowLogin(false)} />
    return <PublicLandingPage onLoginClick={() => setShowLogin(true)} />
  }

  // Session but profile still loading
  if (!profile) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="text-stone-500">Cargando perfil...</div>
    </div>
  )

  const rol = profile.rol
  const groundUp = credits.filter(c => c.tipo === 'ground_up')
  const dscr = credits.filter(c => c.tipo === 'dscr')

  const metrics = {
    totalCasas: properties.length,
    entregadas: properties.filter(p => p.estado === 'certificado_ocupacion').length,
    enConstruccion: properties.filter(p => p.estado === 'construccion').length,
    groundUpAprobado: groundUp.reduce((s, c) => s + (c.monto_aprobado || 0), 0),
    groundUpRecibido: draws.filter(d => d.recibido).reduce((s, d) => s + (d.monto || 0), 0),
    drawsPendientes: draws.filter(d => !d.recibido),
    dscrTotal: dscr.reduce((s, c) => s + (c.monto_desembolso || 0), 0),
    dscrPagado: dscrPayments.filter(p => p.pagado).reduce((s, p) => s + (p.monto || 0), 0),
    proximosPagosDSCR: dscrPayments.filter(p => !p.pagado && p.fecha_vencimiento).sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)).slice(0, 5),
    presupuestoHeracles: activities.reduce((s, a) => s + (a.presupuesto_estimado || 0), 0),
  }

  const modules = [
    { id: 'overview', label: 'Panel General', icon: BarChart3 },
    { id: 'properties', label: 'Propiedades', icon: Home },
    { id: 'credits', label: 'Créditos (GU / DSCR)', icon: Landmark },
    { id: 'heracles', label: 'Plantilla Heracles', icon: Briefcase },
    { id: 'projects', label: 'Proyectos por Casa', icon: Hammer },
    { id: 'accounting', label: 'Contabilidad', icon: DollarSign },
    { id: 'photos', label: 'Registro Fotográfico', icon: Camera },
    ...(rol === 'master' ? [{ id: 'users', label: 'Usuarios', icon: Users }] : []),
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 sticky top-0 z-30 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-3 px-5 py-2 border-2 border-[#1e4d8c] rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1e4d8c]" />
              <span style={{ fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: '28px', color: '#1e4d8c', lineHeight: 1 }}>Lavb.us</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-stone-400">{profile.nombre || profile.email}</p>
              <div className="flex items-center gap-1 justify-end">
                <Shield className="w-3 h-3 text-[#6ba3e8]" />
                <p className="text-[10px] text-[#6ba3e8] uppercase tracking-wider">{ROLE_LABELS[rol]}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-stone-500 hover:text-stone-200" title="Cerrar sesión"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        <aside className="w-64 min-h-[calc(100vh-65px)] border-r border-stone-800 py-6 px-3 sticky top-[65px] self-start">
          <nav className="space-y-1">
            {modules.map(m => {
              const Icon = m.icon
              const active = activeModule === m.id
              return (
                <button key={m.id} onClick={() => setActiveModule(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-2 ${active ? 'bg-[#1e4d8c]/20 border-[#1e4d8c] text-blue-100' : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-900/50'}`}>
                  <Icon className="w-4 h-4" /><span className="tracking-wide">{m.label}</span>
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {activeModule === 'overview' && <OverviewModule metrics={metrics} properties={properties} draws={draws} dscrPayments={dscrPayments} credits={credits} />}
          {activeModule === 'properties' && <PropertiesModule properties={properties} credits={credits} rol={rol} reload={loadAllData} setSelectedProperty={setSelectedProperty} setActiveModule={setActiveModule} />}
          {activeModule === 'credits' && <CreditsModule credits={credits} draws={draws} dscrPayments={dscrPayments} properties={properties} rol={rol} reload={loadAllData} />}
          {activeModule === 'heracles' && <HeraclesModule activities={activities} rol={rol} reload={loadAllData} />}
          {activeModule === 'projects' && <ProjectsModule properties={properties} activities={activities} projectInstances={projectInstances} projectActivities={projectActivities} credits={credits} selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty} rol={rol} reload={loadAllData} />}
          {activeModule === 'accounting' && <AccountingModule expenses={expenses} properties={properties} activities={activities} credits={credits} draws={draws} dscrPayments={dscrPayments} rol={rol} reload={loadAllData} />}
          {activeModule === 'photos' && <PhotosModule photos={photos} properties={properties} rol={rol} reload={loadAllData} />}
          {activeModule === 'users' && rol === 'master' && <UsersModule profiles={allProfiles} reload={loadAllData} />}
        </main>
      </div>
    </div>
  )
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ label, value, subtitle, icon: Icon, accent }: { label: string; value: any; subtitle?: string; icon: any; accent: string }) {
  const colors: Record<string, string> = {
    blue: 'from-[#1e4d8c]/20 to-transparent border-[#1e4d8c]/40 text-[#6ba3e8]',
    emerald: 'from-emerald-600/20 to-transparent border-emerald-900/40 text-emerald-400',
    rose: 'from-rose-600/20 to-transparent border-rose-900/40 text-rose-400',
    gray: 'from-stone-600/20 to-transparent border-stone-700 text-stone-400',
  }
  return (
    <div className={`border ${colors[accent] || colors.gray} bg-gradient-to-br p-5 rounded-sm`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">{label}</span>
        <Icon className="w-4 h-4 opacity-60" />
      </div>
      <p className="text-2xl font-light tabular-nums">{value}</p>
      {subtitle && <p className="text-[11px] text-stone-500 mt-1">{subtitle}</p>}
    </div>
  )
}

// ============================================================
// OVERVIEW MODULE
// ============================================================
function OverviewModule({ metrics, properties, draws, dscrPayments, credits }: any) {
  const pendienteGU = metrics.groundUpAprobado - metrics.groundUpRecibido
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Dashboard</p>
        <h2 className="text-4xl font-light">Panel General</h2>
        <p className="text-stone-500 text-sm mt-2 italic">Estado consolidado de todos los proyectos</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Propiedades" value={metrics.totalCasas} subtitle={`${metrics.entregadas} con CO · ${metrics.enConstruccion} en construcción`} icon={Home} accent="blue" />
        <StatCard label="Ground Up aprobado" value={fmt(metrics.groundUpAprobado)} subtitle={`${fmt(metrics.groundUpRecibido)} recibido`} icon={Banknote} accent="emerald" />
        <StatCard label="DSCR activos" value={fmt(metrics.dscrTotal)} subtitle={`${fmt(metrics.dscrPagado)} pagado`} icon={Landmark} accent="blue" />
        <StatCard label="Presupuesto Heracles" value={fmt(metrics.presupuestoHeracles)} subtitle="por casa · plantilla" icon={DollarSign} accent="rose" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border border-stone-800 bg-stone-900/40 rounded-sm p-6">
          <h3 className="text-lg tracking-wide mb-5">Distribución por Lote</h3>
          <div className="space-y-4">
            {[{l:'1',label:'Lote 1 · ~4 meses'},{l:'2',label:'Lote 2 · antes Nov 2026'},{l:'3',label:'Lote 3 · Feb 2027'},{l:'Hialeah',label:'Hialeah · Multifamiliar'}].map(({l,label}) => {
              const props = properties.filter((p: Property) => String(p.lote) === String(l))
              const ent = props.filter((p: Property) => p.estado === 'certificado_ocupacion').length
              const pct = props.length ? (ent / props.length) * 100 : 0
              return (
                <div key={l}>
                  <div className="flex items-center justify-between text-sm mb-1.5"><span className="text-stone-300">{label}</span><span className="text-[#6ba3e8] tabular-nums">{ent}/{props.length}</span></div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#1e4d8c] to-[#6ba3e8]" style={{ width: `${pct}%` }} /></div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="border border-emerald-900/30 bg-emerald-950/10 rounded-sm p-6">
          <h3 className="text-lg tracking-wide mb-4">Flujo Ground Up</h3>
          <div className="space-y-3">
            <div><p className="text-[10px] text-stone-500 uppercase tracking-wider">Recibido</p><p className="text-2xl text-emerald-400 tabular-nums">{fmt(metrics.groundUpRecibido)}</p></div>
            <div><p className="text-[10px] text-stone-500 uppercase tracking-wider">Pendiente</p><p className="text-xl text-[#6ba3e8] tabular-nums">{fmt(pendienteGU)}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// PROPERTIES MODULE
// ============================================================
function PropertiesModule({ properties, credits, rol, reload, setSelectedProperty, setActiveModule }: any) {
  const [filter, setFilter] = useState('todos')
  const filtered = filter === 'todos' ? properties : properties.filter((p: Property) => String(p.lote) === filter || (filter === 'hialeah' && p.lote === 'Hialeah'))
  const estados: Record<string, { text: string; color: string }> = {
    certificado_ocupacion: { text: 'CO Emitido', color: 'bg-emerald-900/40 text-emerald-400 border-emerald-800' },
    construccion: { text: 'En construcción', color: 'bg-[#1e4d8c]/30 text-[#6ba3e8] border-[#1e4d8c]' },
    planificado: { text: 'Planificado', color: 'bg-blue-900/40 text-blue-400 border-blue-800' },
    pendiente_datos: { text: 'Datos pendientes', color: 'bg-stone-800 text-stone-400 border-stone-700' },
  }
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Inventario</p>
          <h2 className="text-4xl font-light">Propiedades</h2>
        </div>
      </div>
      <div className="flex gap-2">
        {['todos', '1', '2', '3', 'hialeah'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-xs uppercase tracking-wider border ${filter === f ? 'bg-[#1e4d8c]/30 border-[#1e4d8c] text-[#6ba3e8]' : 'border-stone-800 text-stone-500'}`}>{f === 'todos' ? 'Todos' : f === 'hialeah' ? 'Hialeah' : `Lote ${f}`}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((p: Property) => {
          const est = estados[p.estado] || estados.planificado
          const gu = credits.find((c: Credit) => c.tipo === 'ground_up' && c.propiedad_id === p.id)
          const ds = credits.find((c: Credit) => c.tipo === 'dscr' && c.propiedad_id === p.id)
          return (
            <div key={p.id} className="border border-stone-800 bg-stone-900/40 p-5 rounded-sm hover:border-[#1e4d8c]/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500">{p.ubicacion}</p>
                  <h3 className="text-xl mt-0.5">Casa {p.numero}</h3>
                  <p className="text-xs text-[#6ba3e8] mt-0.5">{p.modelo}</p>
                </div>
                <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${est.color}`}>{est.text}</span>
              </div>
              {p.direccion && <div className="mb-3 pb-3 border-b border-stone-800/50"><p className="text-[9px] uppercase tracking-widest text-stone-500 mb-1">Dirección</p><p className="text-xs text-stone-200">{p.direccion}</p></div>}
              <div className="text-xs space-y-1 text-stone-400 mb-3">
                <div className="flex justify-between"><span>Entrega est.:</span><span className="text-stone-300">{fmtDate(p.fecha_estimada_entrega)}</span></div>
                <div className="flex justify-between"><span>Destino:</span><span className="text-stone-300 capitalize">{p.destino || '—'}</span></div>
                <div className="flex justify-between"><span>Precio venta:</span><span className="text-stone-300">{p.precio_venta ? fmt(p.precio_venta) : '—'}</span></div>
              </div>
              <div className="flex gap-1 mb-3">
                {gu && <span className="text-[9px] px-2 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">GROUND UP</span>}
                {ds && <span className="text-[9px] px-2 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-800/50">DSCR</span>}
                {!gu && !ds && <span className="text-[9px] px-2 py-0.5 bg-stone-900 text-stone-600 border border-stone-800">Sin financiamiento</span>}
              </div>
              <button onClick={() => { setSelectedProperty(p.id); setActiveModule('projects') }} className="w-full text-xs py-1.5 border border-[#1e4d8c]/50 text-[#6ba3e8] hover:bg-[#1e4d8c]/20">Ver obra</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================
// PLACEHOLDER MODULES (to be expanded)
// ============================================================
function CreditsModule({ credits, draws, dscrPayments, properties, rol, reload }: any) {
  const groundUp = credits.filter((c: Credit) => c.tipo === 'ground_up')
  const dscr = credits.filter((c: Credit) => c.tipo === 'dscr')
  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Financiamiento bancario</p><h2 className="text-4xl font-light">Créditos</h2></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-emerald-900/30 bg-stone-900/40 p-6 rounded-sm">
          <div className="flex items-center gap-2 mb-3"><Banknote className="w-4 h-4 text-emerald-400" /><span className="text-sm text-emerald-400">Ground Up ({groundUp.length})</span></div>
          {groundUp.length === 0 ? <p className="text-xs text-stone-500 italic">Sin préstamos Ground Up registrados</p> :
            groundUp.map((c: Credit) => <div key={c.id} className="text-sm text-stone-300 py-2 border-b border-stone-800/50 last:border-0">{c.banco} · {fmt(c.monto_aprobado)}</div>)}
        </div>
        <div className="border border-blue-900/30 bg-stone-900/40 p-6 rounded-sm">
          <div className="flex items-center gap-2 mb-3"><Landmark className="w-4 h-4 text-[#6ba3e8]" /><span className="text-sm text-[#6ba3e8]">DSCR ({dscr.length})</span></div>
          {dscr.length === 0 ? <p className="text-xs text-stone-500 italic">Sin DSCR registrados</p> :
            dscr.map((c: Credit) => <div key={c.id} className="text-sm text-stone-300 py-2 border-b border-stone-800/50 last:border-0">{c.banco} · {fmt(c.monto_desembolso)}</div>)}
        </div>
      </div>
      <p className="text-xs text-stone-500 italic">Módulo completo de créditos disponible en la próxima versión.</p>
    </div>
  )
}

function HeraclesModule({ activities, rol, reload }: any) {
  const fases = [...new Set(activities.map((a: Activity) => a.fase))]
  const total = activities.reduce((s: number, a: Activity) => s + (a.presupuesto_estimado || 0), 0)
  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Plantilla Maestra</p><h2 className="text-4xl font-light">Modelo Heracles</h2></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[#1e4d8c]/40 bg-[#1e4d8c]/10 p-4 rounded-sm"><p className="text-[10px] uppercase tracking-widest text-[#6ba3e8]">Presupuesto por casa</p><p className="text-2xl text-[#6ba3e8] mt-1 tabular-nums">{fmt(total)}</p></div>
        <div className="border border-stone-800 bg-stone-900/40 p-4 rounded-sm"><p className="text-[10px] uppercase tracking-widest text-stone-500">Actividades · Fases</p><p className="text-2xl text-stone-200 mt-1 tabular-nums">{activities.length} · {fases.length}</p></div>
      </div>
      {fases.map((fase: string) => {
        const acts = activities.filter((a: Activity) => a.fase === fase).sort((a: Activity, b: Activity) => a.orden - b.orden)
        const sub = acts.reduce((s: number, a: Activity) => s + (a.presupuesto_estimado || 0), 0)
        return (
          <div key={fase} className="border border-stone-800 rounded-sm overflow-hidden">
            <div className="bg-stone-900/60 px-5 py-3 flex items-center justify-between border-b border-stone-800">
              <h3 className="text-base tracking-wide">{fase}</h3><span className="text-xs text-[#6ba3e8] tabular-nums">{fmt(sub)}</span>
            </div>
            <div className="divide-y divide-stone-800/50">
              {acts.map((a: Activity) => (
                <div key={a.id} className="px-5 py-3 flex items-center gap-4 text-sm hover:bg-stone-900/30">
                  <span className="text-[10px] text-stone-600 tabular-nums w-6">#{a.orden}</span>
                  <div className="flex-1"><p className="text-stone-200">{a.nombre}</p>{a.descripcion && <p className="text-xs text-stone-500 mt-0.5">{a.descripcion}</p>}</div>
                  <span className="text-xs text-stone-500">{a.duracion_dias}d</span>
                  <span className="text-xs text-stone-400 capitalize">{a.forma_pago}</span>
                  <span className="w-24 text-right text-[#6ba3e8] tabular-nums">{fmt(a.presupuesto_estimado)}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProjectsModule({ properties, activities, projectInstances, projectActivities, credits, selectedProperty, setSelectedProperty, rol, reload }: any) {
  const prop = properties.find((p: Property) => p.id === selectedProperty)
  const instance = projectInstances.find((pi: ProjectInstance) => pi.propiedad_id === selectedProperty)
  const instActs = instance ? projectActivities.filter((pa: ProjectActivity) => pa.project_instance_id === instance.id) : []

  const initProject = async () => {
    if (!selectedProperty) return
    const id = `PROJ-${selectedProperty}-${Date.now()}`
    await supabase.from('project_instances').insert({ id, propiedad_id: selectedProperty, fecha_inicio: new Date().toISOString().split('T')[0] })
    for (const a of activities) {
      await supabase.from('project_activities').insert({ project_instance_id: id, actividad_id: a.id, estado: 'pendiente' })
    }
    await reload()
  }

  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Ejecución de obra</p><h2 className="text-4xl font-light">Proyectos por Casa</h2></div>
      <div className="flex gap-4 items-center flex-wrap">
        <select value={selectedProperty || ''} onChange={e => setSelectedProperty(e.target.value)} className="bg-stone-900 border border-stone-700 px-4 py-2 text-sm text-stone-200">
          <option value="">Selecciona una casa...</option>
          {properties.map((p: Property) => <option key={p.id} value={p.id}>Casa {p.numero} · {p.ubicacion}</option>)}
        </select>
        {prop && !instance && canWrite(rol, 'projects') && <button onClick={initProject} className="px-4 py-2 bg-[#1e4d8c] hover:bg-[#2563eb] text-white text-sm">Iniciar proyecto</button>}
      </div>
      {prop && instance && (
        <div className="border border-stone-800 bg-stone-900/40 rounded-sm overflow-hidden">
          <div className="bg-stone-900/60 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <div><h3 className="text-xl">Casa {prop.numero} · {prop.ubicacion}</h3><p className="text-xs text-stone-500">Inicio: {fmtDate(instance.fecha_inicio)}</p></div>
            <div className="flex gap-4 text-xs">
              <span className="text-emerald-400">{instActs.filter((a: ProjectActivity) => a.estado === 'completada').length} completadas</span>
              <span className="text-[#6ba3e8]">{instActs.filter((a: ProjectActivity) => a.estado === 'en_progreso').length} en progreso</span>
              <span className="text-stone-400">{instActs.filter((a: ProjectActivity) => a.estado === 'pendiente').length} pendientes</span>
            </div>
          </div>
          <div className="divide-y divide-stone-800/50">
            {instActs.map((ia: ProjectActivity) => {
              const act = activities.find((a: Activity) => a.id === ia.actividad_id)
              if (!act) return null
              const col: Record<string, string> = { pendiente: 'border-stone-700', en_progreso: 'border-[#6ba3e8]', completada: 'border-emerald-600' }
              return (
                <div key={ia.id} className="px-6 py-4 flex items-center gap-4 text-sm hover:bg-stone-900/30">
                  <div className={`w-3 h-3 rounded-full border-2 ${col[ia.estado]}`} />
                  <div className="flex-1"><p className="text-stone-200">{act.nombre}</p><p className="text-[10px] text-stone-500">{act.fase} · {fmt(act.presupuesto_estimado)}</p></div>
                  {canWrite(rol, 'projects') && (
                    <select value={ia.estado} onChange={async e => {
                      await supabase.from('project_activities').update({ estado: e.target.value }).eq('id', ia.id)
                      await reload()
                    }} className="bg-stone-950 border border-stone-800 px-2 py-1 text-xs text-stone-300">
                      <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option>
                    </select>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      {prop && !instance && <div className="border border-dashed border-stone-800 rounded-sm p-12 text-center"><Hammer className="w-10 h-10 text-stone-700 mx-auto mb-3" /><p className="text-stone-400">Casa {prop.numero} sin proyecto iniciado.</p></div>}
    </div>
  )
}

function AccountingModule({ expenses, properties, activities, credits, draws, dscrPayments, rol, reload }: any) {
  const totalGastos = expenses.reduce((s: number, e: Expense) => s + (e.monto || 0), 0)
  const drawsR = draws.filter((d: Draw) => d.recibido).reduce((s: number, d: Draw) => s + (d.monto || 0), 0)
  const dscrR = credits.filter((c: Credit) => c.tipo === 'dscr').reduce((s: number, c: Credit) => s + (c.monto_desembolso || 0), 0)
  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Finanzas</p><h2 className="text-4xl font-light">Contabilidad</h2></div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Ingresos GU (draws)" value={fmt(drawsR)} icon={Banknote} accent="emerald" />
        <StatCard label="Ingresos DSCR" value={fmt(dscrR)} icon={Landmark} accent="blue" />
        <StatCard label="Egresos obra" value={fmt(totalGastos)} subtitle={`${expenses.length} transacciones`} icon={DollarSign} accent="rose" />
      </div>
      {expenses.length === 0 ? <div className="border border-dashed border-stone-800 rounded-sm p-12 text-center"><DollarSign className="w-10 h-10 text-stone-700 mx-auto mb-3" /><p className="text-stone-500">Sin gastos registrados.</p></div> :
        <div className="border border-stone-800 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-900/60 text-[10px] uppercase tracking-widest text-stone-500"><tr><th className="text-left px-4 py-3">Fecha</th><th className="text-left px-4 py-3">Casa</th><th className="text-left px-4 py-3">Concepto</th><th className="text-right px-4 py-3">Monto</th></tr></thead>
            <tbody className="divide-y divide-stone-800/50">
              {expenses.map((e: Expense) => {
                const prop = properties.find((p: Property) => p.id === e.propiedad_id)
                return <tr key={e.id} className="hover:bg-stone-900/30"><td className="px-4 py-3 text-stone-400 text-xs">{fmtDate(e.fecha)}</td><td className="px-4 py-3 text-stone-300">{prop ? prop.numero : '—'}</td><td className="px-4 py-3 text-stone-200">{e.descripcion}</td><td className="px-4 py-3 text-right text-rose-400 tabular-nums">{fmt(e.monto)}</td></tr>
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

function PhotosModule({ photos, properties, rol, reload }: any) {
  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Avance visual</p><h2 className="text-4xl font-light">Registro Fotográfico</h2></div>
      {photos.length === 0 ? <div className="border border-dashed border-stone-800 rounded-sm p-12 text-center"><Camera className="w-10 h-10 text-stone-700 mx-auto mb-3" /><p className="text-stone-500">Sin fotos registradas.</p></div> :
        <div className="grid grid-cols-4 gap-3">
          {photos.map((p: Photo) => {
            const prop = properties.find((pp: Property) => pp.id === p.propiedad_id)
            return (
              <div key={p.id} className="border border-stone-800 bg-stone-900/40 rounded-sm overflow-hidden">
                <div className="aspect-video bg-stone-950">{p.url && <img src={p.url} alt={p.descripcion} className="w-full h-full object-cover" />}</div>
                <div className="p-3"><p className="text-xs text-stone-300">{prop ? `Casa ${prop.numero}` : '—'}</p><p className="text-[10px] text-stone-500">{p.fase} · {fmtDate(p.fecha)}</p></div>
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}

// ============================================================
// USERS MODULE (Master only)
// ============================================================
function UsersModule({ profiles, reload }: { profiles: Profile[]; reload: () => Promise<void> }) {
  const updateRole = async (id: string, newRole: Role) => {
    await supabase.from('profiles').update({ rol: newRole }).eq('id', id)
    await reload()
  }
  return (
    <div className="space-y-6">
      <div><p className="text-[10px] uppercase tracking-[0.3em] text-[#1e4d8c] mb-2">Administración</p><h2 className="text-4xl font-light">Usuarios</h2></div>
      <div className="border border-stone-800 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-900/60 text-[10px] uppercase tracking-widest text-stone-500"><tr><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Nombre</th><th className="text-left px-4 py-3">Rol</th><th className="text-left px-4 py-3">Cambiar rol</th></tr></thead>
          <tbody className="divide-y divide-stone-800/50">
            {profiles.map(p => (
              <tr key={p.id} className="hover:bg-stone-900/30">
                <td className="px-4 py-3 text-stone-300">{p.email}</td>
                <td className="px-4 py-3 text-stone-400">{p.nombre || '—'}</td>
                <td className="px-4 py-3"><span className="text-[10px] uppercase tracking-wider text-[#6ba3e8] bg-[#1e4d8c]/20 px-2 py-0.5">{ROLE_LABELS[p.rol]}</span></td>
                <td className="px-4 py-3">
                  <select value={p.rol} onChange={e => updateRole(p.id, e.target.value as Role)} className="bg-stone-950 border border-stone-800 px-2 py-1 text-xs text-stone-300">
                    <option value="master">Master</option><option value="ceo">CEO</option><option value="administrador">Administrador</option><option value="finanzas">Finanzas</option><option value="logistica">Logística</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
