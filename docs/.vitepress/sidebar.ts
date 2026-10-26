export const sidebar = [
  {
    text: 'Platform',
    items: [
      { text: 'Overview', link: '/' },
      { text: 'Services', link: '/overview/services' },
      { text: 'Communication', link: '/overview/communication' },
      { text: 'Authentication', link: '/trust/authentication' },
    ],
  },
  {
    text: 'Workflows',
    items: [
      { text: 'Signup', link: '/journeys/signup' },
      { text: 'Pilot bootstrap', link: '/journeys/bootstrap' },
      { text: 'Domains', link: '/journeys/domains' },
      { text: 'In-app Cloud', link: '/journeys/in-app-cloud' },
      { text: 'After creation', link: '/journeys/lifecycle' },
    ],
  },
  {
    text: 'Infrastructure',
    items: [
      { text: 'App images', link: '/regional/images' },
      { text: 'Fast startup', link: '/journeys/fast-start' },
      { text: 'Object storage', link: '/regional/storage' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Debug a slow signup', link: '/reference/debugging' },
      { text: 'API reference', link: '/reference/apis' },
      { text: 'Token validation', link: '/reference/token-validation' },
      { text: 'Repositories', link: '/reference/projects' },
      { text: 'Terms and concepts', link: '/overview/concepts' },
    ],
  },
]
