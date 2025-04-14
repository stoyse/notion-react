import React, { useEffect, useState } from "react";
import Block from "./components/Block";
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/page")
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, []);

  const updateBlock = (id, content) => {
    const updated = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updated);

    fetch(`http://localhost:3001/api/block/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  };

  const addBlock = () => {
    const newBlock = { id: uuidv4(), type: "text", content: "" };
    setBlocks([...blocks, newBlock]);

    fetch("http://localhost:3001/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlock),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1
          contentEditable
          suppressContentEditableWarning
          className="text-4xl font-bold mb-6 outline-none border-b-2 border-gray-300 pb-2"
        >
          Untitled Page
        </h1>
        <div className="space-y-4">
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              updateBlock={updateBlock}
            />
          ))}
          <button
            onClick={addBlock}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md"
          >
            + Add Block
          </button>
        </div>
      </div>
    </div>
  );
}
