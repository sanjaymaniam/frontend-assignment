import React, { useState, useEffect, useRef, CSSProperties } from 'react';

interface AtMentionTextEditorProps {
    value: string;
    mentionHtmlToAdd: string;
    onChange: (value: string) => void;
    onInitiateSearch: (searchString: string) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    placeholder?: string;
    className?: string;
}

const AtMentionTextEditor: React.FC<AtMentionTextEditorProps> = ({ value, onChange, onInitiateSearch, mentionHtmlToAdd, onKeyDown, placeholder = "Mention someone" }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
    useEffect(() => {
        if (editorRef.current && !isInternalUpdate) {
            // Find the last occurrence of '@'
            const lastAtIdx = editorRef.current.innerHTML.lastIndexOf('@');
            if (lastAtIdx !== -1) {
                // Remove everything after the last '@'
                editorRef.current.innerHTML = editorRef.current.innerHTML.substring(0, lastAtIdx);
            }

            // Add the new span
            editorRef.current.innerHTML += mentionHtmlToAdd;
            console.log(`val @ editor: ${value}`);

            // Move the caret to the end
            setEndOfContentEditable(editorRef.current);
        }
        setIsInternalUpdate(false);
    }, [value, mentionHtmlToAdd]);


  const setEndOfContentEditable = (contentEditableElement: HTMLElement) => {
    if (contentEditableElement.lastChild && contentEditableElement.lastChild.nodeName === 'SPAN') {
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


  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerText;
      setIsInternalUpdate(true);
      onChange(newValue);
      checkForAtMention(newValue);
    }
  };

  const hasValidMentionTerm = (value: string): boolean => {
    const atSymbolIndex = value.lastIndexOf('@');

    // Check if '@' exists
    if (atSymbolIndex === -1) return false;

    // Get the substring after the last '@'
    const mentionSubstring = value.substring(atSymbolIndex);

    // Check if the substring contains a space
    const containsSpace = mentionSubstring.includes(" ");
    console.log(`checking if @ mention is present in ${value} : ${!containsSpace}`);

    return !containsSpace;
};


  const checkForAtMention = (text: string) => {
    if (hasValidMentionTerm(text) && onInitiateSearch) {
      const mention = text.slice(text.lastIndexOf('@') + 1).trim();
      onInitiateSearch(mention);
    }
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const editorStyle : CSSProperties = {
    border: '1px solid #616061',
    borderRadius: '4px',
    minHeight: isFocused ? '82px' : '40px',
    padding: '5px',
    textAlign: 'left',
    fontSize: '22px',
    outline: 'none',
    gap: '16px'
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDownInternal}
      spellCheck={false}
      style={editorStyle}
    />
  );
};

export default AtMentionTextEditor;
