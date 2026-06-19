import { useEffect, useRef, useState } from "react";

import {
  appendMessage,
  createConversation,
  deleteConversation,
  findConversation,
  loadActiveConversation,
  loadConversations,
  replaceConversation,
  saveActiveConversation,
  saveConversations,
  updateConversation,
} from "../utils/conversation";

export function useConversation(ownerKey = "") {
  const [conversations, setConversations] = useState(() =>
    loadConversations(ownerKey),
  );

  const [activeConversationId, setActiveConversationId] = useState(() =>
    loadActiveConversation(ownerKey),
  );

  const [thread, setThread] = useState([]);

  const activeConversationIdRef = useRef(activeConversationId);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    const nextConversations = loadConversations(ownerKey);
    const nextActiveConversationId = loadActiveConversation(ownerKey);

    activeConversationIdRef.current = nextActiveConversationId;
    setConversations(nextConversations);
    setActiveConversationId(nextActiveConversationId);

    const activeConversation = findConversation(
      nextConversations,
      nextActiveConversationId,
    );
    setThread(activeConversation?.thread ?? []);
  }, [ownerKey]);

  useEffect(() => {
    saveConversations(conversations, ownerKey);
  }, [conversations, ownerKey]);

  useEffect(() => {
    if (activeConversationId) {
      saveActiveConversation(activeConversationId, ownerKey);
    }
  }, [activeConversationId, ownerKey]);

  useEffect(() => {
    if (!activeConversationId) {
      setThread([]);

      return;
    }

    const conversation = findConversation(conversations, activeConversationId);

    if (conversation) {
      setThread(conversation.thread);
    }
  }, [activeConversationId, conversations]);

  function persistConversation(nextThread) {
  setConversations((current) => {
    const currentConversation = findConversation(
      current,
      activeConversationIdRef.current
    );

    if (!currentConversation) {
      const conversation = createConversation(nextThread);

      activeConversationIdRef.current = conversation.id;
      setActiveConversationId(conversation.id);

      return [conversation, ...current];
    }

    const updatedConversation = updateConversation(
      currentConversation,
      nextThread
    );

    return replaceConversation(current, updatedConversation);
  });
}

  function pushMessage(message) {
    setThread((current) => {
      const nextThread = appendMessage(current, message);

      persistConversation(nextThread);

      return nextThread;
    });
  }

  function createNewConversation() {
    activeConversationIdRef.current = null;

    setActiveConversationId(null);

    setThread([]);
  }

  function loadConversation(conversationId) {
    const conversation = findConversation(conversations, conversationId);

    if (!conversation) return;

    activeConversationIdRef.current = conversation.id;

    setActiveConversationId(conversation.id);

    setThread(conversation.thread);
  }

  function removeConversation(conversationId) {
    const next = deleteConversation(conversations, conversationId);

    setConversations(next);

    if (activeConversationIdRef.current === conversationId) {
      if (next.length) {
        activeConversationIdRef.current = next[0].id;

        setActiveConversationId(next[0].id);

        setThread(next[0].thread);
      } else {
        activeConversationIdRef.current = null;

        setActiveConversationId(null);

        setThread([]);
      }
    }
  }

  function clearConversation() {
    activeConversationIdRef.current = null;

    setActiveConversationId(null);

    setThread([]);
  }

  function clearAllConversations() {
    activeConversationIdRef.current = null;

    setActiveConversationId(null);

    setThread([]);

    setConversations([]);
  }

  function updateThread(nextThread) {
    setThread(nextThread);

    if (!activeConversationIdRef.current) {
      const conversation = createConversation(nextThread);

      activeConversationIdRef.current = conversation.id;

      setActiveConversationId(conversation.id);

      setConversations((current) => [conversation, ...current]);

      return;
    }

    const currentConversation = findConversation(
      conversations,
      activeConversationIdRef.current,
    );

    if (!currentConversation) return;

    const updated = updateConversation(currentConversation, nextThread);

    setConversations((current) => replaceConversation(current, updated));
  }

  function replaceLastMessage(message) {
    setThread((current) => {
      if (!current.length) return current;

      const nextThread = [...current];

      nextThread[nextThread.length - 1] = {
        ...nextThread[nextThread.length - 1],
        ...message,
      };

      persistConversation(nextThread);

      return nextThread;
    });
  }

  function updateLastAssistantMessage(data) {
    setThread((current) => {
      const nextThread = [...current];

      for (let i = nextThread.length - 1; i >= 0; i--) {
        if (nextThread[i].role === "assistant") {
          nextThread[i] = {
            ...nextThread[i],
            ...data,
          };

          break;
        }
      }

      persistConversation(nextThread);

      return nextThread;
    });
  }

  function renameConversation(conversationId, title) {
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        return {
          ...conversation,

          title,

          updatedAt: Date.now(),
        };
      }),
    );
  }

  function getActiveConversation() {
    return findConversation(conversations, activeConversationId);
  }

  function hasConversation() {
    return thread.length > 0;
  }

  function startNewCase() {
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    setThread([]);
  }
  return {
    conversations,

    activeConversationId,

    thread,
    startNewCase,
    setThread,

    pushMessage,

    updateThread,

    replaceLastMessage,

    updateLastAssistantMessage,

    createNewConversation,

    loadConversation,

    removeConversation,

    clearConversation,

    clearAllConversations,

    renameConversation,

    getActiveConversation,

    hasConversation,
  };
}
