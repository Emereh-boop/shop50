<script>
  import "./app.css";
  import Router from "svelte-spa-router";
  import { onMount, onDestroy } from 'svelte';
  import { theme } from './stores/theme';
  import Navbar from './components/layout/Navbar.svelte';
  import Footer from './components/layout/Footer.svelte';
  import Cart from './components/layout/Cart.svelte';
  import AuthModal from './components/auth/AuthModal.svelte';
  import { cart } from './stores/cart';
  import { showCart, showAuthModal, authMode } from './stores/ui';
  import routes from './routes';
  import { products, fetchProducts } from './stores/products';
  import Sonner from './components/common/Sonner.svelte';

  function handleAuthSuccess() {
    showAuthModal.set(false);
  }

  let isAdminRoute = false;
  let heartbeatInterval;

  async function sendHeartbeat() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.id) {
      await fetch('https://shop50.onrender.com/api/users/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
    }
  }

  onMount(() => {
    // Initialize theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      theme.set(storedTheme);
    }
    // Check if current route is admin
    isAdminRoute = window.location.pathname.includes('/admin');

    // Global fetch for products
    fetchProducts();

    // Heartbeat for online status
    sendHeartbeat();
    heartbeatInterval = setInterval(sendHeartbeat, 30000);
  });

  onDestroy(() => {
    clearInterval(heartbeatInterval);
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-adidas flex flex-col">
  <div class="sticky top-0 z-50">
    <Navbar />
  </div>

  <main class="flex-1">
    <Router {routes} />
  </main>

  {#if !isAdminRoute}
    <Footer/>
  {/if}

  {#if $showCart}
    <Cart on:close={() => showCart.set(false)} />
  {/if}

  {#if $showAuthModal}
    <AuthModal
      mode={$authMode}
      on:close={() => showAuthModal.set(false)}
      on:success={handleAuthSuccess}
    />
  {/if}

  <Sonner />
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: 'Rajdhani', sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: white;
  }

  :global(.dark body) {
    background-color: #111827;
  }
</style>
