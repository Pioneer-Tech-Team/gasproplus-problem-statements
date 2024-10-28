"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [accounts, setAccounts] = useState<{ id: number; name: string; is_group: boolean }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<{ id: number; name: string; is_group: boolean } | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      const response = await axios.get("http://localhost:4000/accounts");
      setAccounts(response.data);
    }
    fetchAccounts();
  }, []);

  const openModal = (type: "view" | "edit" | "delete", account: { id: number; name: string; is_group: boolean }) => {
    setModalType(type);
    setSelectedAccount(account);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedAccount(null);
  };

  const handleEdit = async () => {
    if (selectedAccount) {
      try {
        const updatedAccount = { ...selectedAccount };
        updatedAccount.name = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
        updatedAccount.is_group = (document.querySelector('input[type="checkbox"]') as HTMLInputElement).checked;
        await axios.put(`http://localhost:4000/accounts/${updatedAccount.id}`, updatedAccount);
        setAccounts((prev) =>
          prev.map((account) =>
            account.id === selectedAccount.id ? selectedAccount : account
          )
        );
        closeModal();
      } catch (error) {
        console.error("Error updating account:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedAccount) {
      try {
        await axios.delete(`http://localhost:4000/accounts/${selectedAccount.id}`);
        setAccounts((prev) => prev.filter((account) => account.id !== selectedAccount.id));
        closeModal();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accounts</h1>
      <Link href="/create">
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300">Add Account</button>
      </Link>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Is Group</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="border border-gray-300 p-2">{account.id}</td>
              <td className="border border-gray-300 p-2">{account.name}</td>
              <td className="border border-gray-300 p-2">{account.is_group ? "Yes" : "No"}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="bg-blue-500 text-white p-1 mr-2"
                  onClick={() => openModal("view", account)}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white p-1 mr-2"
                  onClick={() => openModal("edit", account)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1"
                  onClick={() => openModal("delete", account)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* modals  */}
      {showModal && selectedAccount && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-96">
            {modalType === "view" && (
              <>
                <h2 className="text-xl font-bold mb-4">View Account</h2>
                <p>ID: {selectedAccount.id}</p>
                <p>Name: {selectedAccount.name}</p>
                <p>Is Group: {selectedAccount.is_group ? "Yes" : "No"}</p>
                <button className="mt-4 bg-gray-300 p-2" onClick={closeModal}>
                  Close
                </button>
              </>
            )}

            {modalType === "edit" && (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Account</h2>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    value={selectedAccount.name}
                    onChange={(e) =>
                      setSelectedAccount((prev) => prev ? { ...prev, name: e.target.value } : prev)
                    }
                    className="w-full border border-gray-300 p-2 rounded mt-1"
                  />
                </label>
                <label className="block mb-2">
                  Is Group:
                  <input
                    type="checkbox"
                    checked={selectedAccount.is_group}
                    onChange={(e) =>
                      setSelectedAccount((prev) => prev ? ({ ...prev, is_group: e.target.checked }) : prev)
                    }
                    className="ml-2"
                  />
                </label>
                <button
                  className="mt-4 bg-green-500 text-white p-2 mr-2"
                  onClick={handleEdit}
                >
                  Save Changes
                </button>
                <button className="mt-4 bg-gray-300 p-2" onClick={closeModal}>
                  Cancel
                </button>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h2 className="text-xl font-bold mb-4">Delete Account</h2>
                <p>Are you sure you want to delete this account?</p>
                <button
                  className="mt-4 bg-red-500 text-white p-2 mr-2"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button className="mt-4 bg-gray-300 p-2" onClick={closeModal}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
