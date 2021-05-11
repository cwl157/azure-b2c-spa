// The current application coordinates were pre-registered in a B2C tenant.
const apiConfig = {
    b2cScopes: ["--b2c-scope-read--", "--b2c-scope-write--"],
    webApi: "https://localhost:44332/api/stats/"
  };

  /**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
const b2cPolicies = {
    names: {
        signUpSignIn: "--b2c-signup-signin-policy--",
        forgotPassword: "--b2c-password-reset-policy--",
        editProfile: "--b2c-profile-edit-policy--"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://--b2c-domain-name--.b2clogin.com/--b2c-domain-name--.onmicrosoft.com/--b2c-signup-signin-policy--",
        },
        forgotPassword: {
            authority: "https://--b2c-domain-name--.b2clogin.com/--b2c-domain-name--.onmicrosoft.com/--b2c-password-reset-policy--",
        },
        editProfile: {
            authority: "https://--b2c-domain-name--.b2clogin.com/--b2c-domain-name--.onmicrosoft.com/--b2c-profile-edit-policy--"
        }
    },
    authorityDomain: "--b2c-domain-name--.b2clogin.com"
}

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 * For more details on using MSAL.js with Azure AD B2C, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/working-with-b2c.md 
 */

 const msalConfig = {
    auth: {
      clientId: "--b2c-client-id--", // This is the ONLY mandatory field; everything else is optional.
      authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose sign-up/sign-in user-flow as your default.
      knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
      redirectUri: "http://localhost:6420", // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
    },
    cache: {
      cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
      storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
  };
  
/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
const loginRequest = {
  scopes: ["openid", ...apiConfig.b2cScopes],
};

/**
 * Scopes you add here will be used to request a token from Azure AD B2C to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const tokenRequest = {
  scopes: [...apiConfig.b2cScopes],  // e.g. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
  forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};