<script>
  import Button from '../../components/common/Button.svelte';
  let coupons = [
    { id: 1, code: 'WELCOME10', discount: 10, expiry: '2024-12-31' },
    { id: 2, code: 'FREESHIP', discount: 0, expiry: '2024-10-01' }
  ];
  let showModal = false;
  let newCoupon = { code: '', discount: '', expiry: '' };
  let editingId = null;
  function openAddModal() {
    editingId = null;
    newCoupon = { code: '', discount: '', expiry: '' };
    showModal = true;
  }
  function openEditModal(coupon) {
    editingId = coupon.id;
    newCoupon = { ...coupon };
    showModal = true;
  }
  function saveCoupon() {
    if (editingId) {
      coupons = coupons.map(c => c.id === editingId ? { ...newCoupon, id: editingId } : c);
    } else {
      coupons = [...coupons, { ...newCoupon, id: Date.now() }];
    }
    showModal = false;
  }
  function deleteCoupon(id) {
    if (confirm('Delete this coupon?')) {
      coupons = coupons.filter(c => c.id !== id);
    }
  }
</script>
<div class="max-w-3xl mx-auto px-2 sm:px-8 py-10">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-black dark:text-white">Coupon Management</h1>
    <Button variation="stroke" class="border-white text-black dark:text-white px-8 py-3" on:click={openAddModal}>Add Coupon</Button>
  </div>
  <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl overflow-x-auto">
    <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
      <thead class="bg-white dark:bg-black">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Code</th>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Discount (%)</th>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Expiry</th>
          <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
        {#each coupons as coupon}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">{coupon.code}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">{coupon.discount}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-black dark:text-white">{coupon.expiry}</td>
            <td class="px-6 py-4 whitespace-nowrap flex gap-2">
              <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white px-4 py-2" on:click={() => openEditModal(coupon)}>Edit</Button>
              <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 px-4 py-2" on:click={() => deleteCoupon(coupon.id)}>Delete</Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <h2 class="text-2xl font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white text-center">{editingId ? 'Edit' : 'Add'} Coupon</h2>
        <form on:submit|preventDefault={saveCoupon} class="space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Code</label>
            <input class="w-full border-2 border-black dark:border-white px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newCoupon.code} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Discount (%)</label>
            <input type="number" class="w-full border-2 border-black dark:border-white px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newCoupon.discount} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Expiry</label>
            <input type="date" class="w-full border-2 border-black dark:border-white px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newCoupon.expiry} required />
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <Button variation="ghost" class="border-white text-black dark:text-white px-8 py-3" type="button" on:click={() => showModal = false}>Cancel</Button>
            <Button variation="stroke" class="border-white text-black dark:text-white px-8 py-3" type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div> 