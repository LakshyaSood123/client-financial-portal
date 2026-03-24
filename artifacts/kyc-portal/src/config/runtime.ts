export const config = {
  cognitoDomain:   import.meta.env.VITE_COGNITO_DOMAIN    ?? "",
  cognitoClientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? "",
  cognitoRedirect: import.meta.env.VITE_COGNITO_REDIRECT  ?? "",
  portalApiBase:   import.meta.env.VITE_PORTAL_API_BASE   ?? "",
  adminBffBase:    import.meta.env.VITE_ADMIN_BFF_BASE    ?? "",
} as const;

export const isCognitoConfigured  = () => Boolean(config.cognitoDomain && config.cognitoClientId);
export const isPortalApiConfigured = () => Boolean(config.portalApiBase);
export const isAdminBffConfigured  = () => Boolean(config.adminBffBase);
