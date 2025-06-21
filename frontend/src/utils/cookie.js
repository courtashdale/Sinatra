export function getUserCookie() {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('sinatra_user_id='));
  return match ? match.split('=').pop() : null;
}
