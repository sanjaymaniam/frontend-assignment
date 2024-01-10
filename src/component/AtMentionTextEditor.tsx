import React, { useState, useEffect, useRef, CSSProperties } from "react";
import {
  hasValidMentionTerm,
  moveCaretToEndOfEditor,
} from "../utils/AtMentionUtils";

/**
 * Wrapper around a content-editable div functioning as a text editor with
 * @mention capabilities. It manages placeholder behavior, caret positioning,
 * and more importantly, allows us to render selected user names with a custom
 * styling in the editor.
 */
const AtMentionTextEditor: React.FC<AtMentionTextEditorProps> = ({
  value,
  onChange,
  onInitiateSearch,
  mentionHtmlToAdd,
  onKeyDown,
  placeholder = "Mention",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(true);

  // Effect for handling updates to mention content and moving the caret.
  useEffect(() => {
    if (!isInternalUpdate && editorRef.current) {
      updateMentionContent();
    }
    setIsInternalUpdate(false);
  }, [value, mentionHtmlToAdd]);

  // Initialize the editor with a placeholder text.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText.trim() === '') {
      console.log("Initialized the editor with placeholder text");
      editorRef.current.innerText = placeholder;
      editorRef.current.classList.add("editorPlaceholder");
      setIsPlaceholderActive(true);
    }
  }, []);

  // Updates the content within the editor and handles mention HTML.
  const updateMentionContent = () => {
    if (editorRef.current) {
      const lastAtIdx = editorRef.current.innerHTML.lastIndexOf("@");
      if (lastAtIdx !== -1) {
        editorRef.current.innerHTML = editorRef.current.innerHTML.substring(
          0,
          lastAtIdx,
        );
      }
      editorRef.current.innerHTML += mentionHtmlToAdd;
      moveCaretToEndOfEditor(editorRef);
    }
  };

  // Handles behavior when the placeholder is active.
  const handleInputWhenPlaceholderActive = (inputData: string | null) => {
    if (inputData && editorRef.current) {
      editorRef.current.innerText = inputData;
      editorRef.current.classList.remove("editorPlaceholder");
      setIsPlaceholderActive(false);
      moveCaretToEndOfEditor(editorRef);
    }
  };

  // Handles input behavior when the placeholder is not active.
  const handleInputWhenPlaceholderInactive = () => {
    if (editorRef.current) {
      if (!editorRef.current.innerText.trim()) {
        resetToPlaceholder();
      } else {
        const newValue = editorRef.current.innerText;
        setIsInternalUpdate(true);
        onChange(newValue);
        checkForAtMention(newValue);
      }
    }
  };

  // Resets the editor content to show the placeholder.
  const resetToPlaceholder = () => {
    if (editorRef.current) {
      editorRef.current.innerText = placeholder;
      editorRef.current.classList.add("editorPlaceholder");
      setIsPlaceholderActive(true);
    }
  };

  // Handles key down events and prevents arrow key movement when placeholder is active.
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isPlaceholderActive) {
      preventArrowKeyMovement(e);
      return;
    }
    onKeyDown?.(e);
  };

  // Prevents movement of the caret with arrow keys.
  const preventArrowKeyMovement = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (arrowKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handles mouse down events and prevents caret movement when placeholder is active.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlaceholderActive) {
      e.preventDefault();
    }
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handles focus events on the editor.
  const handleFocus = () => {
    if (editorRef.current && isPlaceholderActive) {
      moveCaretToStart();
    }
  };

  // Moves the caret to the start of the contentEditable element.
  const moveCaretToStart = () => {
    if (editorRef.current) {
      const range = document.createRange();
      range.setStart(editorRef.current, 0);
      range.collapse(true);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  // Handles blur events on the editor.
  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerText.trim() === "") {
      resetToPlaceholder();
    }
  };

  // Handles input events on the editor.
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    if (isPlaceholderActive) {
      e.preventDefault();
      handleInputWhenPlaceholderActive(inputEvent.data);
    } else {
      handleInputWhenPlaceholderInactive();
    }
  };

  // Initiates a search for mentions based on the current text.
  const checkForAtMention = (text: string) => {
    if (hasValidMentionTerm(text) && onInitiateSearch) {
      const mention = text.slice(text.lastIndexOf("@") + 1).trim();
      onInitiateSearch(mention);
    }
  };

  // Styles for the contentEditable div.
  const editorStyle: CSSProperties = {
    border: "1px solid #616061",
    borderRadius: "4px",
    minHeight: isPlaceholderActive ? "40px" : "82px",
    padding: "12px",
    textAlign: "left",
    fontSize: "22px",
    outline: "none",
    gap: "16px",
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDownInternal}
      onMouseDown={handleMouseDown}
      spellCheck={false}
      style={editorStyle}
    />
  );
};

export default AtMentionTextEditor;
