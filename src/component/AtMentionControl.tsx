import React, { useState, useEffect, useRef } from "react";
import AtMentionTextEditor from "./AtMentionTextEditor";
import AtMentionDropdown from "./AtMentionDropdown";

/**
 * This component handles the overall functionality of the @ mention system.
 * It integrates the custom text editor and dropdown.
 * @param {AtMentionControlProps} props - Component props
 * @param {Array} props.dataSource - Data source for user information
 */
const AtMentionControl: React.FC<AtMentionControlProps> = ({ dataSource, onChange, value }) => {
  const [editorText, setEditorText] = useState("");
  const [atMentionToAdd, setAtMentionToAdd] = useState("");
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const [mentionedOptions, setMentionedOptions] = useState<AtMentionUserInfo[]>(
    []
  );

  const dropdownRef = useRef<HTMLSelectElement>(null);

  // Effect to manage dropdown focus- dropdown should be in focus when isSearchInProgress is true
  useEffect(() => {
    if (isSearchInProgress && dropdownRef.current) {
      dropdownRef.current.selectedIndex = 0;
    }
  }, [isSearchInProgress]);

  useEffect(() => {
    // Update the editorText state if the value prop changes
    setEditorText(value || '');
  }, [value]);

  // Custom handling for keydown events required for dropdown navigation while focus is on editor
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchInProgress || !dropdownRef.current) return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        const selectedIndex =
          dropdownRef.current.selectedIndex + (e.key === "ArrowDown" ? 1 : -1);
        if (
          selectedIndex >= 0 &&
          selectedIndex < dropdownRef.current.options.length
        ) {
          dropdownRef.current.selectedIndex = selectedIndex;
        }
        break;
      case "Enter":
        e.preventDefault();
        selectUserFromDropdown();
        break;
      case "Escape":
        e.preventDefault();
        setIsSearchInProgress(false);
        break;
      default:
        break;
    }
  };

  const handleEditorTextChange = (newValue: string) => {
    setEditorText(newValue);
    onChange?.(newValue); 
  };

  const handleInitiateSearch = (mention: string) => {
    if (!mention || mention.trim() === "") {
      setIsSearchInProgress(false);
      setMentionedOptions([]);
      return;
    }

    setIsSearchInProgress(true);
    const filteredOptions = dataSource.filter((option) =>
      `${option.first_name} ${option.last_name}`
        .toLowerCase()
        .includes(mention.toLowerCase())
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
      const selectedUser = dataSource.find(
        (option) => option.id.toString() === selectedUserId
      );

      if (selectedUser) {
        const atMentionedUserName = `@${selectedUser.first_name} ${selectedUser.last_name}`;
        const styledText = applyMentionStyle(atMentionedUserName);
        setAtMentionToAdd(styledText);
        setEditorText(styledText);
        setIsSearchInProgress(false);
        onChange?.(styledText, selectedUser);
      }
    }
  };

  /**
   * Applies HTML styling to the last @ mention in a given text.
   * This function searches for the last occurrence of a mention (indicated by '@')
   * in the provided text and applies HTML styling to it. The mention is wrapped
   * in a `<span>` tag with a specified color style.
   */
  const applyMentionStyle = (text: string) => {
    const mentionRegex = /@[^@]*$/;
    return text.replace(
      mentionRegex,
      (match) => `<span style="color: #117AA7;">${match}</span>`
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <AtMentionTextEditor
        value={editorText}
        onChange={handleEditorTextChange}
        onKeyDown={handleEditorKeyDown}
        onInitiateSearch={handleInitiateSearch}
        mentionHtmlToAdd={atMentionToAdd}
        placeholder="Mention someone..."
      />

      <AtMentionDropdown
        options={mentionedOptions}
        onSelect={handleUserSelection}
        isShown={isSearchInProgress}
        dropdownRef={dropdownRef}
      />
    </div>
  );
};

export default AtMentionControl;
