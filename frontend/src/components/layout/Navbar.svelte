<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Search, X, Cart2, PersonCircle, PersonBadge, Person } from "svelte-bootstrap-icons";
  import { push } from "svelte-spa-router";
  import Logo from "../../assets/yntlogo.svg";
  import { showCart, showAuthModal, authMode } from "../../stores/ui";
  import { auth, isAuthenticated, user } from "../../stores/auth";
  import ThemeToggle from "../common/ThemeToggle.svelte";
  import { LogIn } from "lucide-svelte";
  import Button from '../common/Button.svelte';
  import { cart } from '../../stores/cart';

  let currentPath = window.location.pathname;
  let isMenuOpen = false;
  let searchQuery = "";
  let showMobileSearch = false;

  let navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Collection", href: "/collection", current: false },
  ];

  function handleLogin() {
    authMode.set("login");
    showAuthModal.set(true);
  }

  function handleCart() {
    showCart.set(true);
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
</script>

<nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-20 items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <img class="h-10 w-auto" src={Logo} alt="Logo" />
      </div>

      <!-- Desktop Nav -->
      <div class="hidden md:flex space-x-10 ml-10">
        {#each navigation as item}
          <button
            class="inline-flex items-center px-2 pt-1 border-b-4 text-lg font-extrabold uppercase tracking-widest {item.current
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
          class="w-full md:w-1/2 px-4 py-2 rounded-full border-2 border-black dark:border-white bg-white dark:bg-gray-700 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
        />
      </div>

      <!-- Desktop Icons -->
      <div class="hidden md:flex items-center h-full gap-6 ml-6">
        {#if $isAuthenticated}
          <button
            on:click={handleProfile}
            class="relative border-2 border-black dark:border-white rounded-full p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <Person class="h-7 w-7" />
          </button>
        {:else}
          <button
            on:click={handleLogin}
            class="border-2 border-black dark:border-white rounded-full p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-lg font-bold"
          >
            <LogIn class="h-7 w-7" />
          </button>
        {/if}
        <button
          on:click={handleCart}
          class="relative border-2 border-black dark:border-white rounded-full p-2 text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
        >
          <Cart2 class="h-7 w-7" />
          {#if $cart.length > 0}
            <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          {/if}
        </button>
        <ThemeToggle />
      </div>

      <!-- Mobile Right Controls (Search Icon + Menu Button) -->
      <div class="md:hidden flex items-center gap-3">
        {#if !showMobileSearch}
          <!-- Search Icon -->
          <button
            on:click={() => (showMobileSearch = true)}
            class="text-gray-500 dark:text-gray-300"
            aria-label="Open Search"
          >
            <Search class="h-5 w-5" />
          </button>
        {/if}

        <!-- Mobile Search Bar -->
        {#if showMobileSearch}
          <div class="md:hidden px-4 py-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              bind:value={searchQuery}
              on:keydown={handleKeydown}
              autofocus
              class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-300"
            />
            <button
              on:click={() => (showMobileSearch = false)}
              class="text-gray-500 dark:text-gray-300"
              aria-label="Close Search"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        {/if}

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            on:click={() => (isMenuOpen = !isMenuOpen)}
            class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
          >
            {#if isMenuOpen}
              <X class="h-6 w-6" />
            {:else}
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden px-2 pt- pb- 3 flex justify-between items-center space-y-1">
        <div class="flex gap-2">
          {#each navigation as item}
          <button
            class="block w- full text-left px- 3 py-2 rounded-md text-base font-medium {item.current
              ? 'text-primary-light dark:text-primary-dark'
              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
            on:click={() => {
              handleNavigation(item.href);
              isMenuOpen = false;
            }}
          >
            {item.name}
          </button>
        {/each}
        </div>
        
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
          on:click={() => {
            handleCart();
            isMenuOpen = false;
          }}
            class="text-gray-700 dark:text-gray-300"
            >
            <Cart2 class="h-6 w-6" />
          </button>
          {#if $isAuthenticated}
            <button
              on:click={() => {
                handleProfile();
                isMenuOpen = false;
              }}
              class="text-gray-700 dark:text-gray-300"
            >
              <Person class="h-6 w-6" />
            </button>
          {:else}
            <button
              on:click={() => {
                handleLogin();
                isMenuOpen = false;
              }}
              class="text-gray-700 dark:text-gray-300"
            >
              <LogIn class="h-6 w-6" />
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  :global(.bg-secondary) {
    background-color: #ffffff;
  }
</style>
