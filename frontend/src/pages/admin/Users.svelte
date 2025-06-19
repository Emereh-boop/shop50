<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  
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

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Users Management</h1>
    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      on:click={() => showAddModal = true}
    >
      Add New User
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each users as user}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src={user.avatar || 'https://via.placeholder.com/40'} alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{user.name}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  value={user.role}
                  on:change={(e) => updateUserRole(user.id, e.target.value)}
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  class="text-red-600 hover:text-red-900"
                  on:click={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Add New User</h2>
      <form on:submit|preventDefault={handleAddUser}>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              bind:value={newUser.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              bind:value={newUser.email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              bind:value={newUser.password}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select 
              bind:value={newUser.role}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            on:click={() => showAddModal = false}
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 