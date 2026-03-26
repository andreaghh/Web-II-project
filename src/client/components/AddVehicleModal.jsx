import { useState } from "react";

export default function AddVehicleModal({ types, onClose, onCreated }) {
    const [form, setForm] = useState({
        type_id: "",
        vehicle_identifier: "",
        status: "available",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/admin/transports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
        });
        if (res.ok) {
            onCreated();
            onClose();
        } else {
            alert("Failed to create vehicle.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>New Vehicle</h4>
                <form onSubmit={handleSubmit}>
                    <select
                        value={form.type_id}
                        onChange={(e) => setForm({ ...form, type_id: e.target.value })}
                        required
                    >
                        <option value="">Select Transport Type</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.type} (Cap: {t.capacity})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Vehicle ID (e.g. Bus-01)"
                        value={form.vehicle_identifier}
                        onChange={(e) =>
                            setForm({ ...form, vehicle_identifier: e.target.value })
                        }
                        required
                    />
                    <button type="submit">Create</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
