<script>
  import branding from '../../lib/branding.js';
</script>

<div class="max-w-2xl mx-auto py-16 px-4">
  <h1 class="text-4xl font-extrabold mb-6">Contact Us</h1>
  <div class="mb-4">
    <strong>Email:</strong> <a href={`mailto:${branding.email}`} class="underline">{branding.email}</a>
  </div>
  <div class="mb-4">
    <strong>Phone:</strong> <a href="tel:+2348123456789" class="underline">+234 812 345 6789</a>
  </div>
  <div class="mb-4">
    <strong>Social Media:</strong>
    <ul class="mt-2 space-y-2">
      {#each branding.socialLinks as link}
        <li>
          <a href={link.url} target="_blank" rel="noopener" class="underline">{link.name}</a>
        </li>
      {/each}
    </ul>
  </div>
</div> 