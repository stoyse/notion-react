import React from "react";

export default function Block({ block, onChange }) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.target.innerText)} // Call onChange with the updated content
      className="p-2 border rounded shadow-sm"
    >
      {block.content}
    </div>
  );
}