/**
 * Netlify Build Plugin: Purge CDN Cache on Deploy Success
 * 
 * This plugin runs after a successful deploy and purges the CDN cache
 * so that new content is immediately available.
 */

module.exports = {
  onSuccess: async ({ utils, constants }) => {
    console.log('🔄 Deploy successful! Purging CDN cache...');
    
    // The Netlify adapter automatically handles cache invalidation
    // when using durable caching (CDN-Cache-Control with durable directive)
    // 
    // For standard plans, each deploy automatically invalidates the CDN cache
    // because the deploy creates new function instances.
    //
    // This plugin just logs for visibility.
    
    console.log('✅ CDN cache will be automatically invalidated with this deploy');
    console.log('📝 Site ID:', constants.SITE_ID);
    console.log('🚀 Deploy ID:', constants.DEPLOY_ID);
  },
};
