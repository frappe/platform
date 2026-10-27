export const sidebar = [
  {
    text: 'Platform',
    items: [
      { text: 'Overview', link: '/' },
      { text: 'Service responsibilities', link: '/overview/services' },
      { text: 'Service communication', link: '/overview/communication' },
      { text: 'Authentication and trust', link: '/trust/authentication' },
    ],
  },
  {
    text: 'Workflows',
    items: [
      { text: 'Raw VM creation', link: '/journeys/raw-vm' },
      { text: 'Product signup', link: '/journeys/signup' },
      { text: 'Pilot bootstrap', link: '/journeys/bootstrap' },
      { text: 'Fast app startup', link: '/journeys/fast-start' },
      { text: 'Domains and routing', link: '/journeys/domains' },
      { text: 'In-app Cloud', link: '/journeys/in-app-cloud' },
      { text: 'Resource lifecycle', link: '/journeys/lifecycle' },
    ],
  },
  {
    text: 'Infrastructure',
    items: [
      { text: 'Regional bootstrap', link: '/regional/bootstrap' },
      { text: 'App images', link: '/regional/images' },
      { text: 'Object storage', link: '/regional/storage' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Terms and concepts', link: '/overview/concepts' },
      { text: 'Token validation', link: '/reference/token-validation' },
      { text: 'API reference', link: '/reference/apis' },
      { text: 'Signup debugging', link: '/reference/debugging' },
      { text: 'Repositories', link: '/reference/projects' },
    ],
  },
]
