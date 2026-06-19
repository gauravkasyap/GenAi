// ------------------------------
// Constants
// ------------------------------

export const CHAT_STORAGE_KEY = "healthai_chat_sessions";
export const ACTIVE_CHAT_KEY = "healthai_active_chat";

function scopedKey(baseKey, ownerKey = "") {
  return ownerKey ? `${baseKey}_${ownerKey}` : baseKey;
}

// ------------------------------
// Conversation ID
// ------------------------------

export function generateConversationId() {
  return `chat_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

// ------------------------------
// Message ID
// ------------------------------

export function generateMessageId() {
  return `msg_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

// ------------------------------
// Truncate Text
// ------------------------------

export function truncate(text, maxLength = 60) {
  if (!text) return "";

  const value = text.trim();

  if (value.length <= maxLength) {
    return value;
  }

  return value.substring(0, maxLength) + "...";
}

// ------------------------------
// Conversation Title
// ------------------------------

export function createConversationTitle(messages = []) {
  const firstUserMessage = messages.find(
    (message) => message.role === "user"
  );

  if (!firstUserMessage) {
    return "New Chat";
  }

  return truncate(firstUserMessage.text, 40);
}

// ------------------------------
// Conversation Subtitle
// ------------------------------

export function createConversationSubtitle(messages = []) {
  const lastMessage = messages[messages.length - 1];

  if (!lastMessage) {
    return "";
  }

  if (lastMessage.text) {
    return truncate(lastMessage.text, 90);
  }

  return "";
}

// ------------------------------
// Create Conversation Object
// ------------------------------

export function createConversation(messages = []) {
  return {
    id: generateConversationId(),
    title: createConversationTitle(messages),
    subtitle: createConversationSubtitle(messages),
    updatedAt: Date.now(),
    thread: messages,
  };
}

// ------------------------------
// Update Conversation
// ------------------------------

export function updateConversation(conversation, messages) {
  return {
    ...conversation,
    title: createConversationTitle(messages),
    subtitle: createConversationSubtitle(messages),
    updatedAt: Date.now(),
    thread: messages,
  };
}

// ------------------------------
// Add Message
// ------------------------------

export function appendMessage(thread, message) {
  return [
    ...thread,
    {
      id: generateMessageId(),
      createdAt: Date.now(),
      ...message,
    },
  ];
}

// ------------------------------
// Replace Conversation
// ------------------------------

export function replaceConversation(
  conversations,
  updatedConversation
) {
  const remaining = conversations.filter(
    (conversation) =>
      conversation.id !== updatedConversation.id
  );

  return [
    updatedConversation,
    ...remaining,
  ];
}

// ------------------------------
// Find Conversation
// ------------------------------

export function findConversation(
  conversations,
  conversationId
) {
  return conversations.find(
    (conversation) =>
      conversation.id === conversationId
  );
}

// ------------------------------
// Delete Conversation
// ------------------------------

export function deleteConversation(
  conversations,
  conversationId
) {
  return conversations.filter(
    (conversation) =>
      conversation.id !== conversationId
  );
}

// ------------------------------
// Sort Conversations
// ------------------------------

export function sortConversations(conversations) {
  return [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );
}

// ------------------------------
// Search Conversations
// ------------------------------

export function searchConversations(
  conversations,
  keyword
) {
  if (!keyword) {
    return conversations;
  }

  const search = keyword.toLowerCase();

  return conversations.filter((conversation) => {
    return (
      conversation.title
        .toLowerCase()
        .includes(search) ||
      conversation.subtitle
        .toLowerCase()
        .includes(search)
    );
  });
}

// ------------------------------
// Local Storage
// ------------------------------

export function saveConversations(conversations, ownerKey = "") {
  localStorage.setItem(
    scopedKey(CHAT_STORAGE_KEY, ownerKey),
    JSON.stringify(conversations)
  );
}

export function loadConversations(ownerKey = "") {
  const stored =
    localStorage.getItem(scopedKey(CHAT_STORAGE_KEY, ownerKey));

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// ------------------------------
// Active Conversation
// ------------------------------

export function saveActiveConversation(id, ownerKey = "") {
  localStorage.setItem(scopedKey(ACTIVE_CHAT_KEY, ownerKey), id);
}

export function loadActiveConversation(ownerKey = "") {
  return localStorage.getItem(scopedKey(ACTIVE_CHAT_KEY, ownerKey));
}

export function clearConversationStorage(ownerKey = "") {
  localStorage.removeItem(scopedKey(CHAT_STORAGE_KEY, ownerKey));
  localStorage.removeItem(scopedKey(ACTIVE_CHAT_KEY, ownerKey));
}
