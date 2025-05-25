
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token'); // Deprecated, but good to keep for older versions
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('sb-') || key.startsWith('supabase.auth.')) { // sb- is the new prefix
      localStorage.removeItem(key);
    }
  });

  // Remove from sessionStorage if in use (though we'll configure Supabase to use localStorage)
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('sb-') || key.startsWith('supabase.auth.')) {
      sessionStorage.removeItem(key);
    }
  });
  console.log("Auth state cleaned up from localStorage and sessionStorage.");
};
