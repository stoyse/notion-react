import React, { useEffect, useState } from "react";
import Block from "./components/Block";
import { v4 as uuidv4 } from 'uuid';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [title, setTitle] = useState("Untitled Page"); // State for the title
  const [previousTitle, setPreviousTitle] = useState("Untitled_Page"); // Track the previous title

  useEffect(() => {
    fetch(`http://localhost:3001/api/notes?table=${title}`) // Fetch blocks for the current title
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, [title]); // Refetch blocks when the title changes

  const updateBlock = (id, content) => {
    // Log the content being updated
    console.log("Updating block:", { id, content });

    // Prevent updating a block with empty content
    if (!content.trim()) {
      alert("Block content cannot be empty!");
      return;
    }

    const updated = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(updated);

    fetch(`http://localhost:3001/api/notes/${id}?table=${title}`, { // Include table parameter
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  };

  const addBlock = () => {
    const newBlock = { id: uuidv4(), type: "text", content: "New Block Content" }; // Default content for debugging
    console.log("Adding new block:", newBlock); // Debugging log
    setBlocks([...blocks, newBlock]);

    fetch(`http://localhost:3001/api/notes?table=${title}`, { // Include table parameter
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlock),
    });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.innerText.trim().replace(/\W+/g, "_"); // Sanitize title
    if (!newTitle) {
      alert("Title cannot be empty!");
      return;
    }

    if (newTitle !== previousTitle) {
      // Rename the table in the backend
      fetch("http://localhost:3001/api/rename_table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_table: previousTitle, new_table: newTitle }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to rename table");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Debugging log
          setPreviousTitle(newTitle); // Update the previous title
          setTitle(newTitle); // Update the title state

          // Refetch blocks from the renamed table
          return fetch(`http://localhost:3001/api/notes?table=${newTitle}`);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch blocks from renamed table");
          }
          return res.json();
        })
        .then((data) => {
          setBlocks(data); // Update blocks with data from the renamed table
        })
        .catch((err) => {
          console.error("Error during table rename or data fetch:", err);
          alert("An error occurred while renaming the table or fetching data.");
        });
    }
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange} // Handle title changes
            className="text-4xl font-bold mb-6 outline-none border-b-2 border-gray-300 pb-2"
          >
            {title}
          </h1>
          <div className="space-y-4">
            {blocks.map((block) => (
              <Block
                key={block.id}
                block={block}
                onChange={(content) => updateBlock(block.id, content)} // Pass updateBlock as onChange
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
    </>
  );
}
