const rawApiUrl =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const rawSocketUrl =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const SOCKET_URL = rawSocketUrl.replace(/\/$/, '');