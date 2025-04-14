import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false); // State for dialog visibility
  const [tableToDelete, setTableToDelete] = useState(null); // Track the table to delete

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = () => {
    fetch("http://localhost:3001/api/tables")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Failed to fetch tables:", err));
  };

  const confirmDelete = (table) => {
    setTableToDelete(table); // Set the table to delete
    setOpen(true); // Open the dialog
  };

  const deleteTable = () => {
    if (!tableToDelete) return;

    fetch(`http://localhost:3001/api/tables/${tableToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete table");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message); // Debugging log
        fetchTables(); // Refresh the table list
        setOpen(false); // Close the dialog
        setTableToDelete(null); // Reset the table to delete
      })
      .catch((err) => {
        console.error("Error deleting table:", err);
        alert("An error occurred while deleting the table.");
        setOpen(false); // Close the dialog
        setTableToDelete(null); // Reset the table to delete
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6">All Tables</h1>
        <ul className="space-y-4">
          {tables.map((table) => (
            <li key={table} className="flex justify-between items-center text-lg">
              <Link
                to={`/preview/${table}`} // Navigate to the preview page
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {table}
              </Link>
              <button
                onClick={() => confirmDelete(table)} // Open the confirmation dialog
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Delete Table
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the table "{tableToDelete}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={deleteTable} // Confirm deletion
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)} // Cancel deletion
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
