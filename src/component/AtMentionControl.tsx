import React, { useState, useEffect, useRef } from "react";
import AtMentionTextEditor from "./AtMentionTextEditor";
import AtMentionDropdown from "./AtMentionDropdown";
import { applyMentionStyle, findSelectedUser } from "../utils/AtMentionUtils";

/**
 * A component for tagging and selecting a user from a suggestion list.
 * Implemented by combining a custom text editor (AtMentionTextEditor) with a dropdown (AtMentionDropdown).
 */
const AtMentionControl: React.FC<AtMentionControlProps> = ({
  dataSource,
  onChange,
  value,
  placeholder = "Mention",
  mentionTagStyle = "color: blue;",
}) => {
  const [editorHtml, setEditorHtml] = useState(value || "");
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const [mentionedOptions, setMentionedOptions] = useState<AtMentionUserInfo[]>(
    [],
  );
  const dropdownRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    // Focuses the first option in the dropdown when search is in progress.
    if (isSearchInProgress && dropdownRef.current) {
      dropdownRef.current.selectedIndex = 0;
    }
  }, [isSearchInProgress]);

  useEffect(() => {
    // Syncs the editor text with the value prop.
    setEditorHtml(value || "");
  }, [value]);

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    // Handles keyboard navigation in the dropdown.
    if (isSearchInProgress && dropdownRef.current) {
      
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
          e.preventDefault();
          navigateDropdown(e.key);
          break;
        case "Enter":
          e.preventDefault();
          selectUserFromDropdown();
          break;
        case "Escape":
          setIsSearchInProgress(false);
          break;
        default:
          // Allow other keys for normal typing.
          break;
      }
    }
  };

  const navigateDropdown = (key: string) => {
    // Navigates dropdown options with arrow keys.
    if (dropdownRef.current) {
      const selectedIndex =
        dropdownRef.current.selectedIndex + (key === "ArrowDown" ? 1 : -1);
      if (
        selectedIndex >= 0 &&
        selectedIndex < dropdownRef.current.options.length
      ) {
        dropdownRef.current.selectedIndex = selectedIndex;
      }
    }
  };

  const handleEditorTextChange = (editorInnerHtml: string, editorInnerText: string) => {
    // Updates the editor text and triggers the onChange callback.
    setEditorHtml(editorInnerHtml);
    onChange?.(editorInnerText);
  };

  const handleInitiateSearch = (mention: string) => {
    // Initiates the search for @mentions in the dropdown.
    if (!mention.trim()) {
      setIsSearchInProgress(false);
      setMentionedOptions([]);
      return;
    }

    setIsSearchInProgress(true);
    const filteredOptions = dataSource.filter((option) =>
      `${option.first_name} ${option.last_name}`
        .toLowerCase()
        .includes(mention.toLowerCase()),
    );
    setMentionedOptions(filteredOptions);
  };

  const handleUserSelection = () => {
    // Handles user selection from the dropdown.
    selectUserFromDropdown();
  };

  const selectUserFromDropdown = () => {
    // Selects a user from the dropdown and updates the editor content.
    const selectedIndex = dropdownRef.current?.selectedIndex ?? -1;
    const selectedOption = dropdownRef.current?.options[selectedIndex];

    if (selectedIndex >= 0 && selectedOption) {
      const selectedUser = findSelectedUser(dataSource, selectedOption.value);
      if (selectedUser) {
        updateEditorWithSelectedUser(selectedUser);
      }
    }
  };

  const updateEditorWithSelectedUser = (selectedUser: AtMentionUserInfo) => {
    // Updates the editor content with the selected user and triggers onChange.
    const atMentionedUserName = `@${selectedUser.first_name} ${selectedUser.last_name}`;
    const styledText = applyMentionStyle(atMentionedUserName, mentionTagStyle);
    const newEditorInnerHtml = getNewEditorInnerHtml(editorHtml, styledText);
    setEditorHtml(newEditorInnerHtml);
    setIsSearchInProgress(false);
  };

  const getNewEditorInnerHtml = (editorHtml: string, styledText: string) : string => {
    // Replaces the content following the last @ character in the editorHtml with the styledText
    let stringToReturn = "";
    const lastAtIdx = editorHtml.lastIndexOf("@");
    if (lastAtIdx !== -1) {
      stringToReturn = editorHtml.substring(
        0,
        lastAtIdx,
      );
    }
    stringToReturn += styledText;
    return stringToReturn;
  };

  return (
    <div style={{ position: "relative" }}>
      <AtMentionTextEditor
        value={editorHtml}
        onChange={handleEditorTextChange}
        onKeyDown={handleEditorKeyDown}
        onInitiateSearch={handleInitiateSearch}
        placeholder={placeholder}
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
