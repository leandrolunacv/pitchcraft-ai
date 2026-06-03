export type Lang = 'en' | 'es'

export const pricingTranslations = {
  en: {
    tag: 'Plans',
    title: 'Invest in your next',
    titleHighlight: 'great pitch',
    subtitle: 'No long-term commitments. Cancel anytime.',
    mostPopular: 'MOST POPULAR',
    footer: 'Secure payments with Stripe · Cancel anytime · No hidden fees',
    plans: [
      {
        id: 'free', name: 'Free', price: '$0', period: 'forever',
        description: 'To explore the platform',
        features: ['3 free pitches', '6-dimension analysis', 'Build from scratch', 'File upload', 'Pitch history'],
        cta: 'Start for free',
      },
      {
        id: 'monthly', name: 'Pro', price: '$19', period: '/mo',
        description: 'For active founders and professionals',
        features: ['Unlimited pitches', '6-dimension analysis', 'Build from scratch', 'File & audio/video upload', 'Unlimited history', '8 quick optimization actions', 'Name & slogan generator', 'Investor Q&A simulator', 'Priority support'],
        cta: 'Start Pro',
      },
      {
        id: 'teams', name: 'Teams', price: '$49', period: '/mo',
        description: 'For incubators, universities and accelerators',
        features: ['Everything in Pro', 'Up to 5 users', 'Unlimited pitches per user', 'Admin panel', 'Ideal for entrepreneurship programs', 'VIP priority support'],
        cta: 'Start Teams',
      },
      {
        id: 'lifetime', name: 'Lifetime', price: '$149', period: 'one-time',
        description: 'Early adopter — first 50 customers only',
        features: ['Unlimited pitches forever', 'Everything in Pro', 'Lifetime access', 'Future updates included', 'VIP priority support', '🔥 Special early adopter price'],
        cta: 'Buy Lifetime',
      },
    ],
  },
  es: {
    tag: 'Planes',
    title: 'Invierte en tu próximo',
    titleHighlight: 'gran pitch',
    subtitle: 'Sin compromisos a largo plazo. Cancela cuando quieras.',
    mostPopular: 'MÁS POPULAR',
    footer: 'Pagos seguros con Stripe · Cancela en cualquier momento · Sin cargos ocultos',
    plans: [
      {
        id: 'free', name: 'Free', price: '$0', period: 'para siempre',
        description: 'Para explorar la plataforma',
        features: ['3 pitches gratis', 'Análisis en 6 dimensiones', 'Crear desde cero', 'Upload de archivos', 'Historial de pitches'],
        cta: 'Empezar gratis',
      },
      {
        id: 'monthly', name: 'Pro', price: '$19', period: '/mes',
        description: 'Para founders y profesionales activos',
        features: ['Pitches ilimitados', 'Análisis en 6 dimensiones', 'Crear desde cero', 'Upload de archivos y audio/video', 'Historial ilimitado', '8 acciones rápidas de optimización', 'Generador de nombres y slogans', 'Simulador de preguntas inversor', 'Soporte prioritario'],
        cta: 'Empezar Pro',
      },
      {
        id: 'teams', name: 'Teams', price: '$49', period: '/mes',
        description: 'Para incubadoras, universidades y aceleradoras',
        features: ['Todo lo de Pro', 'Hasta 5 usuarios', 'Pitches ilimitados por usuario', 'Panel de administración', 'Ideal para programas de emprendimiento', 'Soporte prioritario VIP'],
        cta: 'Empezar Teams',
      },
      {
        id: 'lifetime', name: 'Lifetime', price: '$149', period: 'pago único',
        description: 'Early adopter — solo primeros 50 clientes',
        features: ['Pitches ilimitados para siempre', 'Todo lo de Pro', 'Acceso de por vida', 'Actualizaciones futuras incluidas', 'Soporte prioritario VIP', '🔥 Precio especial early adopter'],
        cta: 'Comprar Lifetime',
      },
    ],
  },
}

export const translations = {
  en: {
    nav: {
      features: 'Features',
      howItWorks: 'How it works',
      pricing: 'Pricing',
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'Powered by Claude Opus 4.7',
      title1: 'Craft Pitches That',
      title2: 'Actually Close',
      subtitle: 'AI-powered pitch creation and optimization for entrepreneurs, startups, and salespeople. Get investor-ready scripts in minutes, not months.',
      cta: 'Start Crafting Your Pitch',
      ctaSecondary: 'See How It Works',
      stats: [
        { value: '10,000+', label: 'Pitches Created' },
        { value: '$50M+', label: 'Funding Raised' },
        { value: '94%', label: 'Success Rate' },
        { value: '4.9/5', label: 'User Rating' },
      ],
    },
    features: {
      tag: 'Features',
      title1: 'Everything you need to',
      title2: 'win the room',
      subtitle: 'Professional-grade pitch tools powered by the most advanced AI, built for founders and sales professionals.',
      items: [
        { title: 'AI Pitch Analysis', description: 'Get a detailed breakdown of your pitch with scores across 6 dimensions: clarity, impact, persuasion, storytelling, confidence, and differentiation.' },
        { title: 'Pitch from Scratch', description: 'Our AI coach asks the right questions and builds a complete, polished pitch script tailored to your product, audience, and goals.' },
        { title: 'One-Click Optimization', description: '8 quick-action buttons to instantly transform your pitch: make it more persuasive, shorter, emotional, or investor-optimized — in seconds.' },
        { title: 'Audience Targeting', description: 'Tailor every pitch to 7 different audiences: investors, clients, partners, judges, incubators, corporations, or general public.' },
        { title: 'Duration Control', description: 'Generate pitches calibrated for any time slot: 1 minute elevator pitch, 3 minutes, 5 minutes, or a full 10-minute presentation.' },
        { title: 'Export & Share', description: 'Copy your pitch, download as PDF, or share with your team. Keep a history of all your pitches and iterations.' },
      ],
    },
    howItWorks: {
      tag: 'How It Works',
      title1: 'From idea to perfect pitch',
      title2: 'in minutes',
      subtitle: 'No pitch coach needed. PitchCraft AI guides you through every step.',
      steps: [
        { num: '01', title: 'Choose Your Mode', description: 'Paste an existing pitch for AI analysis and optimization, or start fresh and let our AI coach guide you through building one from scratch.' },
        { num: '02', title: 'Configure Your Pitch', description: 'Set your target duration (1–10 min), select your tone, and specify your audience. The AI adapts every element to match your context.' },
        { num: '03', title: 'AI Does the Work', description: 'Our AI analyzes your pitch across 6 dimensions, identifies weaknesses, and generates an optimized version in seconds.' },
        { num: '04', title: 'Refine & Perfect', description: 'Use quick-action buttons to fine-tune: more persuasive, shorter, investor-optimized. Iterate until your pitch is perfect.' },
      ],
    },
    cta: {
      tag: 'Ready to Start?',
      title1: 'Your next pitch will be',
      title2: 'unforgettable',
      subtitle: 'Join thousands of founders and sales professionals who craft winning pitches with PitchCraft AI.',
      cta: 'Create Your Pitch Now',
      sub: 'No credit card required • Free to use',
    },
  },
  es: {
    nav: {
      features: 'Funciones',
      howItWorks: 'Cómo funciona',
      pricing: 'Precios',
      getStarted: 'Comenzar',
    },
    hero: {
      badge: 'Impulsado por Claude Opus 4.7',
      title1: 'Crea Pitches Que',
      title2: 'Realmente Cierran',
      subtitle: 'Creación y optimización de pitches con IA para emprendedores, startups y vendedores. Scripts listos para inversores en minutos, no en meses.',
      cta: 'Crear Mi Pitch',
      ctaSecondary: 'Ver Cómo Funciona',
      stats: [
        { value: '10,000+', label: 'Pitches Creados' },
        { value: '$50M+', label: 'Fondos Levantados' },
        { value: '94%', label: 'Tasa de Éxito' },
        { value: '4.9/5', label: 'Valoración' },
      ],
    },
    features: {
      tag: 'Funciones',
      title1: 'Todo lo que necesitas para',
      title2: 'conquistar la sala',
      subtitle: 'Herramientas profesionales de pitch impulsadas por la IA más avanzada, creadas para founders y profesionales de ventas.',
      items: [
        { title: 'Análisis de Pitch con IA', description: 'Obtén un análisis detallado de tu pitch con puntuaciones en 6 dimensiones: claridad, impacto, persuasión, storytelling, confianza y diferenciación.' },
        { title: 'Pitch desde Cero', description: 'Nuestro coach de IA hace las preguntas correctas y construye un script de pitch completo y pulido adaptado a tu producto, audiencia y objetivos.' },
        { title: 'Optimización en Un Click', description: '8 botones de acción rápida para transformar tu pitch al instante: más persuasivo, más corto, emocional, u optimizado para inversores — en segundos.' },
        { title: 'Segmentación de Audiencia', description: 'Adapta cada pitch a 7 audiencias diferentes: inversores, clientes, socios, jueces, incubadoras, corporaciones o público general.' },
        { title: 'Control de Duración', description: 'Genera pitches calibrados para cualquier tiempo: elevator pitch de 1 minuto, 3 minutos, 5 minutos o una presentación completa de 10 minutos.' },
        { title: 'Exportar y Compartir', description: 'Copia tu pitch, descárgalo como PDF o compártelo con tu equipo. Mantén un historial de todos tus pitches e iteraciones.' },
      ],
    },
    howItWorks: {
      tag: 'Cómo Funciona',
      title1: 'De la idea al pitch perfecto',
      title2: 'en minutos',
      subtitle: 'Sin necesidad de coach. PitchCraft AI te guía en cada paso.',
      steps: [
        { num: '01', title: 'Elige Tu Modo', description: 'Pega un pitch existente para análisis y optimización con IA, o comienza desde cero y deja que nuestro coach de IA te guíe para construirlo.' },
        { num: '02', title: 'Configura Tu Pitch', description: 'Establece la duración objetivo (1–10 min), selecciona el tono y especifica tu audiencia. La IA adapta cada elemento a tu contexto.' },
        { num: '03', title: 'La IA Hace el Trabajo', description: 'Nuestra IA analiza tu pitch en 6 dimensiones, identifica debilidades y genera una versión optimizada en segundos.' },
        { num: '04', title: 'Refina y Perfecciona', description: 'Usa los botones de acción rápida para ajustar: más persuasivo, más corto, optimizado para inversores. Itera hasta que tu pitch sea perfecto.' },
      ],
    },
    cta: {
      tag: '¿Listo para Comenzar?',
      title1: 'Tu próximo pitch será',
      title2: 'inolvidable',
      subtitle: 'Únete a miles de founders y profesionales de ventas que crean pitches ganadores con PitchCraft AI.',
      cta: 'Crear Mi Pitch Ahora',
      sub: 'Sin tarjeta de crédito • Gratis para empezar',
    },
  },
}
