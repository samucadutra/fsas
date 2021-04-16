export const environment = {
  production: true,
  apiUrl: 'https://samueldutra-algamoney-api.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('samueldutra-algamoney-api.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
