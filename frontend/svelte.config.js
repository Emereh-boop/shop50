import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $stores: 'src/stores',
      $components: 'src/components'
    }
  }
};

export default config; 