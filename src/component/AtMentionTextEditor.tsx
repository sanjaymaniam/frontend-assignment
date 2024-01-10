import React, { useState, useEffect, useRef, CSSProperties } from "react";

const AtMentionTextEditor: React.FC<AtMentionTextEditorProps> = ({
  value,
  onChange,
  onInitiateSearch,
  mentionHtmlToAdd,
  onKeyDown,
  placeholder = "Mention someone",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(true);

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate) {
      // Find the last occurrence of '@'
      const lastAtIdx = editorRef.current.innerHTML.lastIndexOf("@");
      if (lastAtIdx !== -1) {
        // Remove everything after the last '@'
        editorRef.current.innerHTML = editorRef.current.innerHTML.substring(
          0,
          lastAtIdx
        );
      }

      // Add the new span
      editorRef.current.innerHTML += mentionHtmlToAdd;

      // Move the caret to the end
      setEndOfContentEditable(editorRef.current);
    }
    setIsInternalUpdate(false);
  }, [value, mentionHtmlToAdd]);

  useEffect(() => {
    // Initialize with placeholder
    if (editorRef.current) {
      editorRef.current.innerText = placeholder;
      editorRef.current.classList.add('editorPlaceholder');
    }
  }, []);

  const setEndOfContentEditable = (contentEditableElement: HTMLElement) => {
    if (
      contentEditableElement.lastChild &&
      contentEditableElement.lastChild.nodeName === "SPAN"
    ) {
      // Add a text node with a non-breaking space after the last <span>
      const textNode = document.createTextNode("\u00A0");
      contentEditableElement.appendChild(textNode);
    }

    // https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
    if (document.createRange) {
      const range = document.createRange();
      range.selectNodeContents(contentEditableElement);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else if ((document as any).selection) {
      const range = (document.body as any).createTextRange();
      range.moveToElementText(contentEditableElement);
      range.collapse(false);
      range.select();
    }
  };

  const hasValidMentionTerm = (value: string): boolean => {
    const atSymbolIndex = value.lastIndexOf("@");

    // Check if '@' exists
    if (atSymbolIndex === -1) return false;

    // Get the substring after the last '@'
    const mentionSubstring = value.substring(atSymbolIndex);

    // Check if the substring contains a space
    const containsSpace = mentionSubstring.includes(" ");
    return !containsSpace;
  };

  const checkForAtMention = (text: string) => {
    if (hasValidMentionTerm(text) && onInitiateSearch) {
      const mention = text.slice(text.lastIndexOf("@") + 1).trim();
      onInitiateSearch(mention);
    }
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isPlaceholderActive) {
        // Prevent arrow key movement
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
        return;
    }
      
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlaceholderActive) {
      // Prevents the caret from moving on mouse down
      e.preventDefault();
    }
  
    if (editorRef.current && document.activeElement !== editorRef.current) {
      // Focus the editor if it's not currently focused
      editorRef.current.focus();
    }
  };

  const editorStyle: CSSProperties = {
    border: "1px solid #616061",
    borderRadius: "4px",
    minHeight: isFocused ? "82px" : "40px",
    padding: "5px",
    textAlign: "left",
    fontSize: "22px",
    outline: "none",
    gap: "16px",
  };

  const handleFocus = () => {
    if (editorRef.current && isPlaceholderActive) {      
      // Move the caret to the start on focus
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(editorRef.current, 0);
      range.collapse(true);
      if (sel != null) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerText.trim() === '') {
      // Reinsert placeholder if content is empty
      editorRef.current.innerText = placeholder;
      editorRef.current.classList.add('editorPlaceholder');
      setIsPlaceholderActive(true);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
  
    // Check if the placeholder is currently active
    if (isPlaceholderActive) {
        // Prevent any input and caret movement
        e.preventDefault(); // Prevents the default input behavior

      handlePlaceholderActive(inputEvent.data);
    } else {
      handlePlaceholderInactive();
    }
  };
  
  /**
   * Handles the case when the placeholder is active.
   * @param {string | null} inputData - The character that was just typed.
   */
  const handlePlaceholderActive = (inputData: string | null) => {
    const inputChar = inputData || ''; // Default to empty string if inputData is null
    
    if (editorRef.current != null)
    {
        // Replace placeholder with the typed character and update states
        editorRef.current.innerText = inputChar;
        editorRef.current.classList.remove('editorPlaceholder');
        setIsPlaceholderActive(false);
    
        // Move the caret to the end
        setEndOfContentEditable(editorRef.current);
    }
  };
  
  /**
   * Handles the case when the placeholder is not active.
   */
  const handlePlaceholderInactive = () => {
    if (editorRef.current != null)
    {
        // If editor is empty, reset to placeholder
        if (!editorRef.current.innerText.trim()) {
            resetToPlaceholder();
        } else {
            // Update with the new value and initiate mention search if applicable
            const newValue = editorRef.current.innerText;
            setIsInternalUpdate(true);
            onChange(newValue);
            checkForAtMention(newValue);
        }
    }
  };
  
  /**
   * Resets the editor to show the placeholder.
   */
  const resetToPlaceholder = () => {
    if (editorRef.current != null)
    {
        editorRef.current.innerText = placeholder;
        editorRef.current.classList.add('editorPlaceholder');
        setIsPlaceholderActive(true);
    }
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
