import { useEffect, useMemo, useState } from "react";

import {
  confirmBook,
  fetchBooks,
  removeBook,
  uploadBook,
} from "../services/api";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function resolveUploadedBookName(file, bookNameInput) {
  return (bookNameInput || file?.name || "Medical book").trim();
}

function selectNextBookId(books, preferredId) {
  if (preferredId && books.some((book) => book.id === preferredId)) {
    return preferredId;
  }
  return books[0]?.id ?? null;
}

export function useBooks({
  currentUser,
  pushMessage,
  bookUi,
  setComposerMode,
  setToolSheetOpen,
  setActionMenuOpen,
  setActiveTool,
}) {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [uploadingBook, setUploadingBook] = useState(false);
  const [uploadingTextBook, setUploadingTextBook] = useState(false);
  const [removingBookId, setRemovingBookId] = useState("");
  const [confirmingBookId, setConfirmingBookId] = useState("");
  const [bookNameInput, setBookNameInput] = useState("");
  const [bookSourceInput, setBookSourceInput] = useState("");
  const [bookTextInput, setBookTextInput] = useState("");

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  useEffect(() => {
    if (!currentUser?.email) {
      setBooks([]);
      setSelectedBookId(null);
      return;
    }

    let cancelled = false;
    fetchBooks(currentUser.email)
      .then((data) => {
        if (cancelled) return;
        const nextBooks = Array.isArray(data?.books) ? data.books : [];
        setBooks(nextBooks);
        setSelectedBookId((current) => selectNextBookId(nextBooks, current));
      })
      .catch(() => {
        if (cancelled) return;
        setBooks([]);
        setSelectedBookId(null);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.email]);

  function applyBookList(nextBooks = [], preferredId = null) {
    setBooks(nextBooks);
    setSelectedBookId(selectNextBookId(nextBooks, preferredId));
  }

  function selectBook(bookId) {
    setSelectedBookId(bookId);
  }

  function activateBook(bookId) {
    setSelectedBookId(bookId);
    setComposerMode("book");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  async function uploadMedicalBookFile(file) {
    if (!currentUser?.email || !file) return;

    setUploadingBook(true);
    try {
      const contentBase64 = await fileToDataUrl(file);
      const result = await uploadBook({
        userEmail: currentUser.email,
        name: resolveUploadedBookName(file, bookNameInput),
        sourceLabel: bookSourceInput.trim(),
        mimeType: file.type || null,
        contentBase64,
      });

      applyBookList(result.books, result.book?.id ?? null);
      setComposerMode("book");
      setBookNameInput("");
      setBookSourceInput("");
      setBookTextInput("");
      setToolSheetOpen(true);
      setActiveTool("books");

      if (result.warning) {
        pushMessage({
          role: "assistant",
          kind: "text",
          title: bookUi.sourceWarningTitle,
          text: result.warning,
        });
      }
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: bookUi.uploadErrorTitle, text: error.message },
      });
    } finally {
      setUploadingBook(false);
    }
  }

  async function uploadProvidedMedicalText() {
    if (!currentUser?.email) return;
    if (!bookTextInput.trim()) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: {
          title: bookUi.uploadErrorTitle,
          text: bookUi.uploadFirstPrompt,
        },
      });
      return;
    }

    setUploadingTextBook(true);
    try {
      const result = await uploadBook({
        userEmail: currentUser.email,
        name:
          (bookNameInput || "Provided medical text.txt").trim() ||
          "Provided medical text.txt",
        sourceLabel: bookSourceInput.trim(),
        text: bookTextInput,
      });

      applyBookList(result.books, result.book?.id ?? null);
      setComposerMode("book");
      setBookNameInput("");
      setBookSourceInput("");
      setBookTextInput("");
      setToolSheetOpen(true);
      setActiveTool("books");

      if (result.warning) {
        pushMessage({
          role: "assistant",
          kind: "text",
          title: bookUi.sourceWarningTitle,
          text: result.warning,
        });
      }
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: bookUi.uploadErrorTitle, text: error.message },
      });
    } finally {
      setUploadingTextBook(false);
    }
  }

  async function removeMedicalBook(bookId) {
    if (!currentUser?.email || !bookId) return;

    setRemovingBookId(bookId);
    try {
      const result = await removeBook({ userEmail: currentUser.email, bookId });
      applyBookList(result.books, bookId === selectedBookId ? null : selectedBookId);
      if (bookId === selectedBookId) {
        setComposerMode("triage");
      }
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: bookUi.removeErrorTitle, text: error.message },
      });
    } finally {
      setRemovingBookId("");
    }
  }

  async function confirmMedicalBook(bookId) {
    if (!currentUser?.email || !bookId) return;

    setConfirmingBookId(bookId);
    try {
      const result = await confirmBook({ userEmail: currentUser.email, bookId });
      applyBookList(result.books, result.book?.id ?? bookId);
      setComposerMode("book");
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: bookUi.confirmErrorTitle, text: error.message },
      });
    } finally {
      setConfirmingBookId("");
    }
  }

  return {
    books,
    selectedBookId,
    setSelectedBookId,
    selectedBook,
    uploadingBook,
    uploadingTextBook,
    removingBookId,
    confirmingBookId,
    bookNameInput,
    setBookNameInput,
    bookSourceInput,
    setBookSourceInput,
    bookTextInput,
    setBookTextInput,
    selectBook,
    activateBook,
    uploadMedicalBookFile,
    uploadProvidedMedicalText,
    removeMedicalBook,
    confirmMedicalBook,
  };
}
