import { derived } from 'svelte/store';
import { user } from './user';

export const isAdmin = derived(user, ($user, set) => {
  if ($user && $user.role === 'admin') {
    set(true);
  } else {
    set(false);
  }
}); 