import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PreviewPage() {
  const { table } = useParams(); // Get the table name from the URL
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/notes?table=${table}`)
      .then((res) => res.json())
      .then((data) => setBlocks(data))
      .catch((err) => console.error("Failed to fetch blocks:", err));
  }, [table]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6">{table}</h1>
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="p-4 border rounded shadow-sm bg-gray-50"
            >
              <p>{block.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
