export function homeByRole(role) {
  if (role === 'bedienung') return '/bedienung'
  if (role === 'theke') return '/theke'
  if (role === 'kueche') return '/kueche'
  if (role === 'admin') return '/admin'
  return '/login'
}
