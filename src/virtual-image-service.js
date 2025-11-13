// Minimal image service shim for dev/server mode
// Exports functions expected by Astro's internal image handling.
export default {
  validateOptions: async (options) => {
    return options;
  },
  getSrcSet: async () => {
    return [];
  },
  getURL: async (options) => {
    // return original src if available
    if (!options) return '';
    if (typeof options.src === 'string') return options.src;
    if (options.src && typeof options.src === 'object' && options.src.src) return options.src.src;
    return '';
  },
  getHTMLAttributes: async () => {
    return {};
  },
  propertiesToHash: [],
};
