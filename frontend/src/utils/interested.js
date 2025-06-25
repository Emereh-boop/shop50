import { get } from 'svelte/store';
import { user, token } from '../stores/auth';

const API_BASE = '/api';

// Add product to 'still interested' list
export async function addInterestedProduct(productId) {
  const currentUser = get(user);
  if (currentUser && currentUser.id) {
    // Logged in: sync to backend
    await fetch(`${API_BASE}/admin/users/${currentUser.id}/interested-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(token)}`
      },
      body: JSON.stringify({ productId })
    });
  } else {
    // Guest: localStorage
    let interested = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
    if (!interested.includes(productId)) {
      interested.push(productId);
      localStorage.setItem('interestedProducts', JSON.stringify(interested));
    }
  }
}

// Remove purchased products from 'still interested' list
export async function removePurchasedProducts(productIds) {
  const currentUser = get(user);
  if (currentUser && currentUser.id) {
    await fetch(`${API_BASE}/admin/users/${currentUser.id}/interested-products`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get(token)}`
      },
      body: JSON.stringify({ productIds })
    });
  } else {
    let interested = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
    interested = interested.filter(id => !productIds.includes(id));
    localStorage.setItem('interestedProducts', JSON.stringify(interested));
  }
}

// Get all 'still interested' product IDs
export async function getInterestedProducts() {
  const currentUser = get(user);
  if (currentUser && currentUser.id) {
    const res = await fetch(`${API_BASE}/admin/users/${currentUser.id}/interested-products`, {
      headers: { Authorization: `Bearer ${get(token)}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data.interestedProducts || [];
    }
    return [];
  } else {
    return JSON.parse(localStorage.getItem('interestedProducts') || '[]');
  }
}

// Sync localStorage to backend on login
export async function syncLocalToBackend() {
  const currentUser = get(user);
  if (currentUser && currentUser.id) {
    const local = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
    for (const productId of local) {
      await addInterestedProduct(productId);
    }
    localStorage.removeItem('interestedProducts');
  }
}

// Check if a product is new (added in last 30 days)
export function isNewProduct(product) {
  const days = 30;
  const now = new Date();
  const added = new Date(product.timeStamp);
  return (now - added) / (1000 * 60 * 60 * 24) <= days;
} 