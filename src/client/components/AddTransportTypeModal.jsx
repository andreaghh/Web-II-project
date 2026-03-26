import { useState } from "react";

export default function AddTransportTypeModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ type: "", capacity: "", image: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/admin/transport-types", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });
        if (res.ok) {
            onCreated();
            onClose();
        } else {
            alert("Failed to create transport type.");
        }
    };

    return (

        <div className="modal-overlay">
            <div className="modal-content">
                <h4>New Transport Type</h4>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Type (e.g. Bus)"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                    <button type="submit">Create</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
