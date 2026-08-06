// Keep development diagnostics available locally without exposing them in the
// browser console for production builds.
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}
