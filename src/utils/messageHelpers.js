export const dedupeMessages = (messages = []) => {
  const map = new Map();

  messages.forEach((message) => {
    if (!message || !message._id) return;
    map.set(message._id, message);
  });

  return Array.from(map.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const formatClockTime = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const formatConversationStamp = (value) => {
  if (!value) return '';

  const date = new Date(value);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  if (diffInDays === 1) {
    return 'Yesterday';
  }

  if (diffInDays < 7) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'M';
