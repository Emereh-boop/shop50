<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Search, X, Cart2, PersonCircle } from "svelte-bootstrap-icons";
  import { push } from "svelte-spa-router";
  import Logo from "../../assets/yntlogo.svg";
  import { cart } from "../../stores/cart";
  import { theme } from "../../stores/theme";
  import { showCart, showAuthModal, authMode } from "../../stores/ui";
  import { auth, isAuthenticated, user } from "../../stores/auth";
  import ThemeToggle from "../common/ThemeToggle.svelte";
  import { createEventDispatcher } from "svelte";
  import { Menu, ShoppingCart, User, LogOut, LogIn } from "lucide-svelte";

  let showSearch = false;
  let searchTerm = "";
  let filter = [];
  let isLogoutOpen = false;
  let cartItems = [];
  let currentPath = window.location.pathname;
  let isMenuOpen = false;
  let searchQuery = "";
  let showMobileSearch = false;

  const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Collection", href: "/collection", current: false },
  ];

  const dispatch = createEventDispatcher();

  onMount(() => {
    window.addEventListener("popstate", () => {
      currentPath = window.location.pathname;
      updateNavigation();
    });
    updateNavigation();
  });

  function updateNavigation() {
    navigation.forEach((item) => {
      item.current = item.href === currentPath;
    });
  }

  function handleLogin() {
    authMode.set("login");
    showAuthModal.set(true);
  }

  function handleSignup() {
    authMode.set("signup");
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
    push(href);
  }

  function handleLogout() {
    auth.logout();
    push("/");
  }

  function handleProfile() {
    push("/profile");
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav class="bg-white dark:bg-gray-800 shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <!-- Logo -->
      <div class="flex items-center">
        <img class="h-8 w-auto" src={Logo} alt="Logo" />
      </div>

      <!-- Desktop Nav -->
      <div class="hidden md:flex space-x-6 ml-6">
        {#each navigation as item}
          <button
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {item.current
              ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
              : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'}"
            on:click={() => handleNavigation(item.href)}
          >
            {item.name}
          </button>
        {/each}
      </div>

      <!-- Desktop Search Bar -->
      <div class="hidden md:flex flex-1 px-4 md:px-6">
        <input
          type="text"
          placeholder="Search..."
          bind:value={searchQuery}
          on:keydown={handleKeydown}
          class="w-full md:w-1/2 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
        />
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

        <!-- Desktop Icons -->
        <div class="hidden md:flex items-center gap-4">
          {#if $isAuthenticated}
            <button
              on:click={handleProfile}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <PersonCircle class="h-6 w-6" />
            </button>
          {:else}
            <button
              on:click={handleLogin}
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <LogIn class="h-6 w-6" />
            </button>
          {/if}
          <button
            on:click={handleCart}
            class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Cart2 class="h-6 w-6" />
          </button>
          <ThemeToggle />
        </div>

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
      <div class="hidden md:flex mt-4 items-center gap-4">
        {#if $isAuthenticated}
          <button
            on:click={() => {
              handleProfile();
              isMenuOpen = false;
            }}
            class="text-gray-700 dark:text-gray-300"
          >
            <PersonCircle class="h-6 w-6" />
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
        <button
          on:click={() => {
            handleCart();
            isMenuOpen = false;
          }}
          class="text-gray-700 dark:text-gray-300"
        >
          <Cart2 class="h-6 w-6" />
        </button>
        <ThemeToggle />
      </div>
      
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden px-4 pt-4 pb-3 space-y-1">
        {#each navigation as item}
          <button
            class="block w-full text-left px-3 py-2 rounded-md text-base font-medium {item.current
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
        <div class="mt-4 flex items-center gap-4">
          {#if $isAuthenticated}
            <button
              on:click={() => {
                handleProfile();
                isMenuOpen = false;
              }}
              class="text-gray-700 dark:text-gray-300"
            >
              <PersonCircle class="h-6 w-6" />
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
          <button
            on:click={() => {
              handleCart();
              isMenuOpen = false;
            }}
            class="text-gray-700 dark:text-gray-300"
          >
            <Cart2 class="h-6 w-6" />
          </button>
          <ThemeToggle />
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
