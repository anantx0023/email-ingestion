"use client";
import { useState, useEffect } from "react";
import styles from './index.module.css';

export default function Home() {
  const [configs, setConfigs] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [connectionType, setConnectionType] = useState("IMAP");
  const [error, setError] = useState("");

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
        body: JSON.stringify({ emailAddress: email, username, password, host, port: parseInt(port), connectionType }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add configuration");
      }
      setEmail("");
      setUsername("");
      setPassword("");
      setHost("");
      setPort("");
      setConnectionType("IMAP");
      setError("");
      // Optionally, you can refetch the configurations to update the list
      const updatedConfigs = await fetch("/api/email-ingestion/config").then((res) => res.json());
      setConfigs(updatedConfigs);
    } catch (error) {
      console.error("Failed to add configuration", error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Configurations</h1>
      <div className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className={styles.input}
        />
        <select
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value)}
          className={styles.select}
        >
          <option value="IMAP">IMAP</option>
          <option value="POP3">POP3</option>
          <option value="GMAIL">Gmail API</option>
          <option value="OUTLOOK">Outlook/Graph API</option>
        </select>
        {(connectionType === "IMAP" || connectionType === "POP3") && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
            />
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Host"
              className={styles.input}
            />
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Port"
              className={styles.input}
            />
          </>
        )}
        {connectionType === "GMAIL" && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Gmail Username"
              className={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Gmail App Password"
              className={styles.input}
            />
          </>
        )}
        {connectionType === "OUTLOOK" && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Outlook Username"
              className={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Outlook App Password"
              className={styles.input}
            />
          </>
        )}
        <button onClick={addConfig} className={styles.button}>Add</button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.list}>
        {configs.map((config) => (
          <li key={config.id} className={styles.listItem}>
            {config.emailAddress} ({config.connectionType})
          </li>
        ))}
      </ul>
    </div>
  );
}