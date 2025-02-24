"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [configs, setConfigs] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/email-ingestion/config")
      .then((res) => res.json())
      .then((data) => setConfigs(data))
      .catch((error) => console.error("Failed to fetch configurations", error));
  }, []);

  const addConfig = async () => {
    try {
      const response = await fetch("/api/email-ingestion/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress: email, connectionType: "IMAP" }),
      });
      if (!response.ok) {
        throw new Error("Failed to add configuration");
      }
      setEmail("");
      // Optionally, you can refetch the configurations to update the list
      const updatedConfigs = await fetch("/api/email-ingestion/config").then((res) => res.json());
      setConfigs(updatedConfigs);
    } catch (error) {
      console.error("Failed to add configuration", error);
    }
  };

  return (
    <div>
      <h1>Email Configurations</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={addConfig}>Add</button>
      <ul>
        {configs.map((config) => (
          <li key={config.id}>{config.emailAddress}</li>
        ))}
      </ul>
    </div>
  );
}