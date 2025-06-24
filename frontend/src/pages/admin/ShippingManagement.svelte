<script>
  import Button from '../../components/common/Button.svelte';
  let shippingZones = [
    { id: 1, zone: 'Domestic', rate: 5.00 },
    { id: 2, zone: 'International', rate: 20.00 }
  ];
  let showModal = false;
  let newZone = { zone: '', rate: '' };
  let editingId = null;
  function openAddModal() {
    editingId = null;
    newZone = { zone: '', rate: '' };
    showModal = true;
  }
  function openEditModal(zone) {
    editingId = zone.id;
    newZone = { ...zone };
    showModal = true;
  }
  function saveZone() {
    if (editingId) {
      shippingZones = shippingZones.map(z => z.id === editingId ? { ...newZone, id: editingId } : z);
    } else {
      shippingZones = [...shippingZones, { ...newZone, id: Date.now() }];
    }
    showModal = false;
  }
  function deleteZone(id) {
    if (confirm('Delete this shipping zone?')) {
      shippingZones = shippingZones.filter(z => z.id !== id);
    }
  }
</script>
<div class="max-w-3xl mx-auto px-2 sm:px-8 py-10">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-black dark:text-white">Shipping Management</h1>
    <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3" on:click={openAddModal}>Add Shipping Zone</Button>
  </div>
  <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-x-auto">
    <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
      <thead class="bg-white dark:bg-black">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Zone</th>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Rate ($)</th>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
        {#each shippingZones as zone}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">{zone.zone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">${zone.rate}</td>
            <td class="px-6 py-4 whitespace-nowrap flex gap-2">
              <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-4 py-2" on:click={() => openEditModal(zone)}>Edit</Button>
              <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 rounded-full px-4 py-2" on:click={() => deleteZone(zone.id)}>Delete</Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <h2 class="text-2xl font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white text-center">{editingId ? 'Edit' : 'Add'} Shipping Zone</h2>
        <form on:submit|preventDefault={saveZone} class="space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Zone</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newZone.zone} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Rate ($)</label>
            <input type="number" class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newZone.rate} required />
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <Button variation="ghost" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3" type="button" on:click={() => showModal = false}>Cancel</Button>
            <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3" type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div> 