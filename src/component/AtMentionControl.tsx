import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import AtMentionTextEditor from './AtMentionTextEditor';

const dropdownStyle: CSSProperties = {
  width: '100%', // Match the width of the input field
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  position: 'absolute',
  top: '100%', // Positioned below the input field
  left: '0',
  zIndex: 1000,
  gap: '4px',
  overflowY: 'auto', // Ensure dropdown is scrollable
  maxHeight: '200px', // Max height for dropdown
};

// Interface definitions for clarity and type safety.
interface AtMentionUserInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

interface AtMentionControlProps {
  dataSource: AtMentionUserInfo[];
  shouldHighlight?: boolean;
  mentionChar?: string;
}

const AtMentionControl: React.FC<AtMentionControlProps> = ({ dataSource }) => {
  const [editorText, setEditorText] = useState('');
  const [atMentionToAdd, setAtMentionToAdd] = useState('');
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const [mentionedOptions, setMentionedOptions] = useState<AtMentionUserInfo[]>([]);

  const dropdownRef = useRef<HTMLSelectElement>(null);

  // Effect to manage dropdown focus- dropdown should be in focus when isSearchInProgress is true
  useEffect(() => {
    if (isSearchInProgress && dropdownRef.current) {
      dropdownRef.current.selectedIndex = 0;
    }
  }, [isSearchInProgress]);

  // Handles keyboard interactions for accessibility and UX.
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchInProgress || !dropdownRef.current) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        const selectedIndex = dropdownRef.current.selectedIndex + (e.key === 'ArrowDown' ? 1 : -1);
        if (selectedIndex >= 0 && selectedIndex < dropdownRef.current.options.length) {
          dropdownRef.current.selectedIndex = selectedIndex;
        }
        break;
      case 'Enter':
        e.preventDefault();
        selectUserFromDropdown();
        break;
      case 'Escape':
        e.preventDefault();
        setIsSearchInProgress(false);
        break;
      default:
        break;
    }
  };

  const handleEditorTextChange = (newValue: string) => {
    setEditorText(newValue);
  };

  const handleInitiateSearch = (mention: string) => {
    console.log(`initiating search w/ ${mention}`);

    if (!mention || mention.trim() === '') {
        console.log("Mention is null or empty. Search not initiated.");
        setIsSearchInProgress(false);
        setMentionedOptions([]);
        return;
    }

    setIsSearchInProgress(true);
    const filteredOptions = dataSource.filter(option =>
        `${option.first_name} ${option.last_name}`.toLowerCase().includes(mention.toLowerCase())
    );
    setMentionedOptions(filteredOptions);
};

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectUserFromDropdown();
  };

  // Selects a user from the dropdown and updates the input value.
  const selectUserFromDropdown = () => {
    const selectedIndex = dropdownRef.current?.selectedIndex ?? -1;
    const selectedOption = dropdownRef.current?.options[selectedIndex];
  
    if (selectedIndex >= 0 && selectedOption) {
      const selectedUserId = selectedOption.value;
      const selectedUser = dataSource.find(option => option.id.toString() === selectedUserId);
  
      if (selectedUser) {
        const atMentionedUserName = `@${selectedUser.first_name} ${selectedUser.last_name}`;
        console.log(`editor text: ${editorText}`)
        // const newText = editorText.replace(/@[\w\s]*$/, atMentionedUserName);
        const styledText = applyMentionStyle(atMentionedUserName);
        setAtMentionToAdd(styledText);
        console.log(`styled text: ${styledText}`)
        setEditorText(styledText);
        setIsSearchInProgress(false);
      }
    }
  };
  
  const applyMentionStyle = (text: string) => {
    const mentionRegex = /@[^@]*$/;
    return text.replace(mentionRegex, (match) => `<span style="color: #117AA7;">${match}</span>`);
  };
  
  
  return (
    <div style={{ position: 'relative' }}>
      <AtMentionTextEditor
        value={editorText}
        onChange={handleEditorTextChange}
        onKeyDown={handleEditorKeyDown}
        onInitiateSearch={handleInitiateSearch}
        mentionHtmlToAdd={atMentionToAdd}
        placeholder="Mention someone..."/>
      
      {isSearchInProgress && (
        <select
          ref={dropdownRef}
          onChange={handleUserSelection}
          size={5}
          style={dropdownStyle}
        >
          {mentionedOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.first_name} {option.last_name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AtMentionControl;