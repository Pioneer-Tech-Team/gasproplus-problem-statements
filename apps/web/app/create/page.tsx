"use client"
import { useState } from "react";
import axios from "axios";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [isGroup, setIsGroup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/accounts", {
        name,
        is_group: isGroup,
      });
      alert("Account created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create account", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Account Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Is Group</label>
          <input
            type="checkbox"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
            className="h-4 w-4"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
          Create
        </button>
      </form>
    </div>
  );
}
