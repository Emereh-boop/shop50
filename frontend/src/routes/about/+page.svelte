<script>
  import branding from '../../lib/branding.js';
</script>

<div class="max-w-3xl mx-auto py-16 px-4">
  <h1 class="text-4xl font-extrabold mb-6">About {branding.companyName}</h1>
  <p class="text-lg mb-4">YoungnTrendy (YNT) is a modern brand based in {branding.address}, dedicated to providing the latest in fashion and lifestyle products for young and trendy individuals.</p>
  <div class="mb-2"><strong>Address:</strong> {branding.address}</div>
  <div class="mb-2"><strong>Email:</strong> <a href={`mailto:${branding.email}`} class="underline">{branding.email}</a></div>
  <div class="mb-2"><strong>Contact:</strong> +234 812 345 6789</div>
</div> 