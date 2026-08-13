"use client";

import { useEffect, useState } from "react";
import type { Pin } from "@/lib/constants";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [pins, setPins] = useState<Pin[]>([]);
  const [err, setErr] = useState("");

  const adminRequest = async (action: "list" | "hide", id?: string) => {
    const response = await fetch("/api/admin/pins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ password: pass, action, id }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Admin request failed");
    return result;
  };

  const load = async () => {
    try {
      const result = await adminRequest("list");
      setPins(result.pins as Pin[]);
      setErr("");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not load pins");
    }
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const login = async () => {
    try {
      const result = await adminRequest("list");
      setPins(result.pins as Pin[]);
      setAuthed(true);
      setErr("");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Wrong password");
    }
  };

  const hide = async (id: string) => {
    try {
      await adminRequest("hide", id);
      setPins((current) => current.filter((pin) => pin.id !== id));
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not hide pin");
    }
  };

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="admin-login">
          <h1>Admin</h1>
          <label className="field">
            Password
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void login()}
            />
          </label>
          {err && <p className="hint-soft" style={{ color: "#ff4d7a" }}>{err}</p>}
          <button type="button" className="btn btn-y" onClick={login}>
            Sign in
          </button>
          <a className="link-btn" href="/">
            Back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <header className="bar" style={{ position: "static", marginBottom: 16 }}>
          <a className="link-btn" href="/">
            Home
          </a>
          <strong className="bar-title">Pins · {pins.length}</strong>
          <button type="button" className="btn btn-sm btn-ghost" onClick={load}>
            Refresh
          </button>
        </header>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>City</th>
              <th>Coords</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pins.map((p) => (
              <tr key={p.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo || "/assets/pin-builder.svg"} alt="" />
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <div className="hint-soft">{p.stack}</div>
                </td>
                <td>{p.city}</td>
                <td className="hint-soft">
                  {p.lat?.toFixed(3)}, {p.lng?.toFixed(3)}
                </td>
                <td>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => hide(p.id)}>
                    Hide
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
