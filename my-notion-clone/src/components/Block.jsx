import React from "react";

export default function Block({ block, onChange }) {
  return (
    <div
  contentEditable
  suppressContentEditableWarning
  onBlur={(e) => onChange(block.id, e.target.innerText)}
  className="bg-white px-4 py-2 rounded-lg shadow border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
>
  {block.content}
</div>
  );
}