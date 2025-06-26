<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Search, X, Cart2, PersonCircle, PersonBadge, Person } from "svelte-bootstrap-icons";
  import { push } from "svelte-spa-router";
  import Logo from "../../assets/yntlogo.png";
  import { showCart, showAuthModal, authMode } from "../../stores/ui";
  import { auth, isAuthenticated, user } from "../../stores/auth";
  import ThemeToggle from "../common/ThemeToggle.svelte";
  import { LogIn } from "lucide-svelte";
  import Button from '../common/Button.svelte';
  import { cart } from '../../stores/cart';
  import { Heart, Globe } from 'lucide-svelte';
  import { products, fetchProducts } from '../../stores/products';

  let currentPath = window.location.pathname;
  let isMenuOpen = false;
  let searchQuery = "";
  let showMobileSearch = false;
  let showMobileMenu = false;
  let showMobileSearchModal = false;
  let mobileSearchInput = '';

  let navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Collection", href: "/collection", current: false },
  ];

  const mainCategories = [
    { name: 'MEN', link: '/products?category=men' },
    { name: 'WOMEN', link: '/products?category=women' },
    { name: 'KIDS', link: '/products?category=kids' },
    { name: 'NEW & TRENDING', link: '/products?trending=true' },
    { name: 'SALE', link: '/products?sale=true' }
  ];

  const secondaryLinks = [
    { name: 'My Account', link: '/profile' },
    { name: 'Orders', link: '/orders' },
    { name: 'Contact', link: '/contact' },
    { name: 'About', link: '/about' },
    { name: 'Gift Cards', link: '/products?discounted=true' }
  ];

  let categories = [];
  $: categories = Array.from(new Set($products.products.map(p => p.category))).filter(Boolean);

  function handleLogin() {
    authMode.set("login");
    showAuthModal.set(true);
  }

  function handleCart() {
    showCart.set(true);
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      showMobileSearch = false; // Hide after search (mobile)
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleNavigation(href) {
    navigation.forEach((item) => {
      item.current = item.href === href;
    });
    navigation = [...navigation]; // trigger Svelte reactivity
    push(href);
  }

  function handleProfile() {
    push("/profile");
  }

  function openMobileSearch() { showMobileSearchModal = true; mobileSearchInput = ''; }
  function closeMobileSearch() { showMobileSearchModal = false; }
  function handleMobileSearch() {
    if (mobileSearchInput.trim()) {
      push(`/products?q=${encodeURIComponent(mobileSearchInput.trim())}`);
      closeMobileSearch();
    }
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .navbar-container {
    padding: calc(var(--page-pad) * 0.3);
  }
  .navbar-height {
    height: calc(var(--page-pad) * 2);
  }
  .logo-size {
    height: calc(var(--form-btn) * 2.5);
  }
  .nav-link {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.5) calc(var(--form-btn) * 1);
  }
  .search-input {
    font-size: var(--form-input);
    padding: calc(var(--form-input) * 0.5) calc(var(--form-input) * 1);
  }
  .nav-icon {
    width: calc(var(--form-btn) * 2);
    height: calc(var(--form-btn) * 2);
  }
  .mobile-height {
    height: calc(var(--page-pad) * 1.5);
  }
  .mobile-icon {
    width: calc(var(--form-btn) * 1.8);
    height: calc(var(--form-btn) * 1.8);
  }
  .mobile-logo {
    height: calc(var(--form-btn) * 2);
  }
  .mobile-search-modal {
    padding: calc(var(--page-pad) * 0.4);
  }
  .mobile-search-input {
    font-size: var(--form-input);
    padding: calc(var(--form-input) * 0.5) calc(var(--form-input) * 1);
  }
  
  :global(.bg-secondary) {
    background-color: #ffffff;
  }
</style>

<nav class="bg-white  dark:bg-gray-800 shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 navbar-container">
    <div class="flex justify-between md:navbar-height items-center">
      <!-- Logo -->
      <div class="md:flex items-center hidden">
        <img class="logo-size w-auto" src={Logo} alt="Logo" />
      </div>

      <!-- Desktop Nav -->
      <div class="hidden md:flex space-x-10 ml-10">
        {#each navigation as item}
          <button
            class="nav-link inline-flex items-center px-2 pt-1 border-b-4 font-extrabold uppercase tracking-widest {item.current
              ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
              : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'}"
            on:click={() => handleNavigation(item.href)}
          >
            {item.name}
          </button>
        {/each}
      </div>

      <!-- Desktop Search Bar -->
      <div class="hidden md:flex flex-1 px-4 md:px-6 justify-end">
        <input
          type="text"
          placeholder="Search..."
          bind:value={searchQuery}
          on:keydown={handleKeydown}
          class="search-input w-full md:w-1/2  border-2 border-black dark:border-white bg-white dark:bg-gray-700 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
        />
      </div>

      <!-- Desktop Icons -->
      <div class="hidden md:flex items-center h-full gap-6 ml-6">
        {#if $isAuthenticated}
          <button
            on:click={handleProfile}
            class="relative border-2 border-black dark:border-white  p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <Person class="nav-icon" />
          </button>
        {:else}
          <button
            on:click={handleLogin}
            class="border-2 border-black dark:border-white  p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold"
          >
            <LogIn class="nav-icon" />
          </button>
        {/if}
        <button
          on:click={handleCart}
          class="relative border-2 border-black dark:border-white  p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          <Cart2 class="nav-icon" />
          {#if $cart.length > 0}
            <span class="absolute top-0 right-0 block h-2 w-2  bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          {/if}
        </button>
        <!-- <ThemeToggle /> -->
      </div>


    </div>

    <!-- Mobile Top Bar (Adidas style, no logo/hamburger) -->
    <div class="md:hidden flex items-center justify-between mobile-height px-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-4">
        <button on:click={() => showMobileMenu = true} aria-label="Open menu">
          <svg class="mobile-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <button aria-label="Wishlist"><Heart class="mobile-icon" /></button>
      </div>
      <img src={Logo} alt="Logo" class="mobile-logo mx-auto" />
      <div class="flex items-center gap-4">
        <button on:click={handleProfile} class=" relative border-2 border-black  dark:border-white p-2">
          <Person class="mobile-icon" />
          <!-- <span class="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold  px-1">1</span> -->
        </button>
        <button on:click={openMobileSearch} class="border-2 border-black  dark:border-white p-2"><Search class="mobile-icon" /></button>
        <button on:click={handleCart} class="border-2 border-black  dark:border-white p-2"><Cart2 class="mobile-icon" /></button>
      </div>
    </div>

    <!-- Mobile Search Modal -->
    {#if showMobileSearchModal}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div class="bg-white dark:bg-gray-900  shadow-2xl mobile-search-modal w-full max-w-xs mx-auto flex flex-col items-center">
          <button class="self-end text-2xl font-bold text-gray-500 hover:text-black dark:hover:text-white mb-2" on:click={closeMobileSearch}>&times;</button>
          <input
            type="text"
            bind:value={mobileSearchInput}
            placeholder="Search products..."
            class="mobile-search-input w-full border-2 border-black dark:border-white  font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
            on:keydown={(e) => e.key === 'Enter' && handleMobileSearch()}
            autofocus
          />
          <Button variation='ghost' class="w-full border-2 border-black dark:border-white dark:text-white text-black font-bold  py-2" on:click={handleMobileSearch}>SEARCH</Button>
        </div>
      </div>
    {/if}

    <!-- Mobile Drawer -->
    {#if showMobileMenu}
      <div class="fixed inset-0 z-50 bg-black bg-opacity-30 flex">
        <div class="w-80 max-w-full bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl animate-slideInLeft relative">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <!-- <img src={Logo} alt="Logo" class="h-8" /> -->
            <h2 class="text-xl font-extrabold uppercase tracking-widest text-black dark:text-white">Menu</h2>
            <button on:click={() => showMobileMenu = false} class="text-2xl font-bold text-gray-500 hover:text-black dark:hover:text-white">&times;</button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Main Navigation -->
            <div class="mb-8">
              <h3 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Navigation</h3>
              <div class="space-y-2">
                {#each navigation as item}
                  <button
                    class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest {item.current
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}"
                    on:click={() => { handleNavigation(item.href); showMobileMenu = false; }}
                  >
                    {item.name}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-8">
              <h3 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Categories</h3>
              <div class="space-y-2">
                {#each mainCategories as category}
                  <button
                    class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    on:click={() => { push(category.link); showMobileMenu = false; }}
                  >
                    {category.name}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Secondary Links -->
            <div class="mb-8">
              <h3 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">More</h3>
              <div class="space-y-2">
                {#each secondaryLinks as link}
                  <button
                    class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    on:click={() => { push(link.link); showMobileMenu = false; }}
                  >
                    {link.name}
                  </button>
                {/each}
              </div>
            </div>

            <!-- User Actions -->
            <div class="border-t border-gray-200 dark:border-gray-800 pt-4">
              {#if $isAuthenticated}
                <div class="space-y-2">
                  <button
                    class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    on:click={() => { push('/profile'); showMobileMenu = false; }}
                  >
                    My Account
                  </button>
                  <button
                    class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    on:click={() => { auth.logout(); showMobileMenu = false; }}
                  >
                    Logout
                  </button>
                </div>
              {:else}
                <button
                  class="w-full text-left py-3 px-4 font-extrabold uppercase tracking-widest text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  on:click={() => { handleLogin(); showMobileMenu = false; }}
                >
                  Login
                </button>
              {/if}
            </div>
          </div>
        </div>
        <div class="flex-1" on:click={() => showMobileMenu = false}></div>
      </div>
    {/if}
  </div>
</nav>
