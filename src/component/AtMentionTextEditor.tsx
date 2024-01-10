import React, { useState, useEffect, useRef, CSSProperties } from "react";

/**
 * Wrapper around a content-editable div functioning as a text editor with 
 * @mention capabilities. It manages placeholder behavior, caret positioning,
 * and more importantly, allows us to render selected user names with a custom
 * styling in the editor.
 * 
 * Props:
 * - `value`: Current text content of the editor.
 * - `onChange`: Callback for text changes.
 * - `onInitiateSearch`: Callback to trigger a search when valid mention character is found.
 * - `mentionHtmlToAdd`: HTML content containing the mentioned user's name.
 * - `onKeyDown`: Handler for keyboard events.
 * - `placeholder`: Text displayed when the editor is empty.
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
    if (editorRef.current) {
      editorRef.current.innerText = placeholder;
      editorRef.current.classList.add('editorPlaceholder');
    }
  }, []);

  // Updates the content within the editor and handles mention HTML.
  const updateMentionContent = () => {
    if (editorRef.current) {
      const lastAtIdx = editorRef.current.innerHTML.lastIndexOf("@");
      if (lastAtIdx !== -1) {
        editorRef.current.innerHTML = editorRef.current.innerHTML.substring(0, lastAtIdx);
      }
      editorRef.current.innerHTML += mentionHtmlToAdd;
      moveCaretToEndOfEditor();
    }
  };

  // Moves the caret to the end of the contentEditable element.
  const moveCaretToEndOfEditor = () => {
    if (!editorRef.current) return;
  
    // Adds a non-breaking space if the last child is a SPAN element.
    if (editorRef.current.lastChild && editorRef.current.lastChild.nodeName === "SPAN") {
      const textNode = document.createTextNode("\u00A0");
      editorRef.current.appendChild(textNode);
    }
  
    // Moves the caret to the end.
    // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    const selection = window.getSelection();
  
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    } else if ((document as any).selection) { // For older IE versions
      const ieRange = (document.body as any).createTextRange();
      ieRange.moveToElementText(editorRef.current);
      ieRange.collapse(false);
      ieRange.select();
    }
  };

  // Handles behavior when the placeholder is active.
  const handlePlaceholderActive = (inputData: string | null) => {
    if (inputData && editorRef.current) {
      editorRef.current.innerText = inputData;
      editorRef.current.classList.remove('editorPlaceholder');
      setIsPlaceholderActive(false);
      moveCaretToEndOfEditor();
    }
  };

  // Handles behavior when the placeholder is not active.
  const handlePlaceholderInactive = () => {
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
      editorRef.current.classList.add('editorPlaceholder');
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
    const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
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
    if (editorRef.current && editorRef.current.innerText.trim() === '') {
      resetToPlaceholder();
    }
  };

  // Handles input events on the editor.
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    if (isPlaceholderActive) {
      e.preventDefault();
      handlePlaceholderActive(inputEvent.data);
    } else {
      handlePlaceholderInactive();
    }
  };

  // Checks if the current text contains a valid mention term.
  const hasValidMentionTerm = (value: string): boolean => {
    const atSymbolIndex = value.lastIndexOf("@");
    return atSymbolIndex !== -1 && !value.substring(atSymbolIndex).includes(" ");
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
    padding: "5px",
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
