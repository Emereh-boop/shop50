<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Button from '../../components/common/Button.svelte';
  
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
    await loadUsers();
  });

  async function loadUsers() {
    try {
      const response = await axios.get('/api/admin/users');
      users = response.data;
    } catch (e) {
      error = 'Failed to load users';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleAddUser() {
    try {
      await axios.post('/api/admin/users', newUser);
      showAddModal = false;
      await loadUsers();
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
      await axios.put(`/api/admin/users/${userId}`, { role: newRole });
      await loadUsers();
    } catch (e) {
      error = 'Failed to update user role';
      console.error(e);
    }
  }

  async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      await loadUsers();
    } catch (e) {
      error = 'Failed to delete user';
      console.error(e);
    }
  }
</script>

<div class="max-w-7xl mx-auto px-2 sm:px-8 py-10">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-black dark:text-white">Users Management</h1>
    <Button 
      variation="stroke"
      class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      on:click={() => showAddModal = true}
    >
      Add New User
    </Button>
  </div>
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-x-auto">
      <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
        <thead class="bg-white dark:bg-black">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">User</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Email</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Role</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Joined</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
          {#each users as user}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-4">
                  
                  <div>
                    <div class="text-base font-extrabold uppercase tracking-widest text-black dark:text-white">{user.name}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-black dark:text-white">{user.email}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  on:change={(e) => updateUserRole(user.id, e.target.value)}
                  class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-4 py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-black dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Button 
                  variation="stroke"
                  class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white transition-colors"
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
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
      <h2 class="text-2xl font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white text-center">Add New User</h2>
      <form on:submit|preventDefault={handleAddUser} class="space-y-6">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input 
            type="text" 
            bind:value={newUser.name}
            class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            bind:value={newUser.email}
            class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input 
            type="password" 
            bind:value={newUser.password}
            class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Role</label>
          <select 
            bind:value={newUser.role}
            class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <div class="mt-8 flex justify-end gap-4">
          <Button 
            variation="ghost"
            class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3"
            on:click={() => showAddModal = false}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            variation="stroke"
            class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3"
            type="submit"
          >
            Add User
          </Button>
        </div>
      </form>
    </div>
  </div>
{/if} 