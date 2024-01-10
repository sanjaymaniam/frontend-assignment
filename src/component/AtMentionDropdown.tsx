import React, { CSSProperties } from "react";

const AtMentionDropdown: React.FC<AtMentionDropdownProps> = ({
  options,
  onSelect,
  isShown,
  dropdownRef,
}) => {
  if (!isShown) return null;

  const dropdownStyle: CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    position: "absolute",
    top: "100%",
    left: "0",
    zIndex: 1000,
    gap: "4px",
    overflowY: "auto",
    maxHeight: "200px",
  };

  return (
    <select
      ref={dropdownRef}
      onChange={onSelect}
      size={5}
      style={dropdownStyle}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.first_name} {option.last_name}
        </option>
      ))}
    </select>
  );
};

export default AtMentionDropdown;
