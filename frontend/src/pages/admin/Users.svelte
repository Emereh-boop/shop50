<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Button from '../../components/common/Button.svelte';
  import { adminUsers, fetchAdminUsers } from '../../stores/adminUsers';
  import { get } from 'svelte/store';
  
  let users = [];
  let loading = true;
  let error = null;
  let showAddModal = false;
  let newUser = {
    name: '',
    email: '',
    role: 'customer',
    password: ''
  };

  onMount(async () => {
    loading = true;
    await fetchAdminUsers();
    const store = get(adminUsers);
    users = store.users;
    loading = store.loading;
    error = store.error;
  });

  async function handleAddUser() {
    try {
      await axios.post('https://shop50.onrender.com/api/admin/users', newUser);
      showAddModal = false;
      await fetchAdminUsers(true);
      const store = get(adminUsers);
      users = store.users;
      loading = store.loading;
      error = store.error;
      // Reset form
      newUser = {
        name: '',
        email: '',
        role: 'customer',
        password: ''
      };
    } catch (e) {
      error = 'Failed to add user';
      console.error(e);
    }
  }

  async function updateUserRole(userId, newRole) {
    try {
      await axios.put(`https://shop50.onrender.com/api/admin/users/${userId}`, { role: newRole });
      await fetchAdminUsers(true);
      const store = get(adminUsers);
      users = store.users;
      loading = store.loading;
      error = store.error;
    } catch (e) {
      error = 'Failed to update user role';
      console.error(e);
    }
  }

  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`https://shop50.onrender.com/api/admin/users/${userId}`);
      await fetchAdminUsers(true);
      const store = get(adminUsers);
      users = store.users;
      loading = store.loading;
      error = store.error;
    } catch (e) {
      error = 'Failed to delete user';
      console.error(e);
    }
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .users-title {
    font-size: var(--page-title);
  }
  .users-container {
    padding: var(--page-pad);
  }
  .users-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.8) calc(var(--form-btn) * 2);
  }
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .table-container table {
    min-width: 600px;
  }
  .table-header {
    font-size: var(--form-label);
  }
  .table-cell {
    font-size: var(--form-input);
  }
  .modal-content {
    padding: calc(var(--page-pad) * 0.6);
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .users-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    .users-btn {
      width: 100%;
      text-align: center;
    }
    .table-container {
      margin: 0 -1rem;
      padding: 0 1rem;
    }
    .modal-content {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }
  }
</style>

<div class="max-w-7xl mx-auto px-2 sm:px-8 py-6 md:py-10 users-container">
  <div class="users-header flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 md:mb-12 gap-4">
    <h1 class="users-title font-extrabold uppercase tracking-widest text-black dark:text-white">Users Management</h1>
    <Button 
      variation="stroke"
      class="users-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      on:click={() => showAddModal = true}
    >
      Add New User
    </Button>
  </div>
  
  {#if $adminUsers.loading}
    <div class="flex justify-center">
      <div class="animate-spin h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  {:else if $adminUsers.error}
    <div class="text-red-500 text-center">{$adminUsers.error}</div>
  {:else}
    <div class="table-container">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl overflow-auto">
        <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
          <thead class="bg-white dark:bg-black">
            <tr>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">User</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Email</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Role</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Joined</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
            {#each $adminUsers.users as user}
              <tr>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-4">
                    <div>
                      <div class="text-sm md:text-base font-extrabold uppercase tracking-widest text-black dark:text-white">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-black dark:text-white">{user.email}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    on:change={(e) => updateUserRole(user.id, e.target.value)}
                    class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white px-2 md:px-4 py-1 md:py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-xs md:text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-black dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <Button 
                    variation="stroke"
                    class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 px-2 md:px-4 py-1 md:py-2 hover:bg-red-500 hover:text-white transition-colors text-xs md:text-sm"
                    on:click={() => deleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl modal-content max-w-md w-full max-h-[90vh] overflow-y-auto relative">
      <h2 class="text-xl md:text-2xl font-extrabold uppercase tracking-widest mb-6 md:mb-8 text-black dark:text-white text-center">Add New User</h2>
      <form on:submit|preventDefault={handleAddUser} class="space-y-4 md:space-y-6">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input 
            type="text" 
            bind:value={newUser.name}
            class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            bind:value={newUser.email}
            class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input 
            type="password" 
            bind:value={newUser.password}
            class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Role</label>
          <select 
            bind:value={newUser.role}
            class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <div class="mt-6 md:mt-8 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
          <Button 
            variation="ghost"
            class="users-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white"
            on:click={() => showAddModal = false}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            variation="stroke"
            class="users-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white"
            type="submit"
          >
            Add User
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if} 