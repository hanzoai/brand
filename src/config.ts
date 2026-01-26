/**
 * Main brand configuration for Hanzo AI
 */

export const brandConfig = {
  // Company Information
  company: {
    name: 'Hanzo',
    legalName: 'Hanzo AI Inc.',
    tagline: 'Building the future of AI infrastructure',
    description: 'Enterprise AI infrastructure and tools for the next generation of intelligent applications.',
    founded: 2023,
    headquarters: 'San Francisco, CA',
  },

  // Brand Values
  values: [
    'Innovation',
    'Reliability', 
    'Transparency',
    'Performance',
    'Accessibility'
  ],

  // Contact Information
  contact: {
    email: 'hello@hanzo.ai',
    support: 'support@hanzo.ai',
    sales: 'sales@hanzo.ai',
    press: 'press@hanzo.ai',
  },

  // Social Media
  social: {
    twitter: 'https://twitter.com/hanzoai',
    github: 'https://github.com/hanzoai',
    linkedin: 'https://linkedin.com/company/hanzoai',
    discord: 'https://discord.gg/hanzo',
    youtube: 'https://youtube.com/@hanzoai',
  },

  // Domains
  domains: {
    main: 'https://hanzo.ai',
    docs: 'https://docs.hanzo.ai',
    api: 'https://api.hanzo.ai',
    app: 'https://app.hanzo.ai',
    brand: 'https://brand.hanzo.ai',
    ui: 'https://ui.hanzo.ai',
    status: 'https://status.hanzo.ai',
  },

  // Legal
  legal: {
    privacy: 'https://hanzo.ai/privacy',
    terms: 'https://hanzo.ai/terms',
    cookies: 'https://hanzo.ai/cookies',
    security: 'https://hanzo.ai/security',
  },

  // SEO Defaults
  seo: {
    title: 'Hanzo AI - Enterprise AI Infrastructure',
    description: 'Build, deploy, and scale AI applications with Hanzo\'s enterprise-grade infrastructure and tools.',
    keywords: [
      'AI infrastructure',
      'machine learning',
      'artificial intelligence',
      'LLM',
      'enterprise AI',
      'AI platform',
      'ML ops',
      'AI deployment',
    ],
    image: 'https://hanzo.ai/og-image.png',
    twitterCard: 'summary_large_image',
    twitterCreator: '@hanzoai',
  },
} as const

export type BrandConfig = typeof brandConfig