import { useEffect, useState } from "react";

export default function BookForm({ onSubmit, defaultValues = {} }) {
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({
        transport_type_id: defaultValues.transport_type_id || "",
        quantity: defaultValues.quantity || 1,
        reason: defaultValues.reason || "",
        departure_time: defaultValues.departure_time || "",
        return_time: defaultValues.return_time || "",
    });
    const [justificationFile, setJustificationFile] = useState(null);
    const [availability, setAvailability] = useState(null);

    useEffect(() => {
        fetch("/api/transports/types", { credentials: "include" })
            .then((res) => res.json())
            .then(setTypes)
            .catch((err) => console.error("Failed to load types:", err));
    }, []);

    // Fetch availability
    useEffect(() => {
        if (form.transport_type_id && form.departure_time && form.return_time) {
            fetch(`/api/transports/availability?type_id=${form.transport_type_id}&departure=${form.departure_time}&return=${form.return_time}`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => setAvailability(data.available))
                .catch((err) => {
                    console.error("Failed to fetch availability:", err);
                    setAvailability(null);
                });
        } else {
            setAvailability(null);
        }
    }, [form.transport_type_id, form.departure_time, form.return_time]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setJustificationFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        if (justificationFile) {
            formData.append("justification", justificationFile);
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label>
                Transport Type:
                <select
                    name="transport_type_id"
                    value={form.transport_type_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select type</option>
                    {types.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.type} (Capacity: {t.capacity})
                        </option>
                    ))}
                </select>
            </label>

            {/* Show Availability under the Transport Type */}
            {availability !== null && (
                <p style={{ marginTop: "4px", color: availability > 0 ? "green" : "red" }}>
                    {availability > 0
                        ? `${availability} vehicle(s) available for the selected times.`
                        : "No vehicles available for this selection."}
                </p>
            )}

            <label>
                Quantity:
                <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Departure Time:
                <input
                    type="datetime-local"
                    name="departure_time"
                    value={form.departure_time}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Return Time:
                <input
                    type="datetime-local"
                    name="return_time"
                    value={form.return_time}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Reason:
                <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Justification Document (PDF, JPG, PNG):
                <input
                    type="file"
                    name="justification"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                />
            </label>

            <button type="submit">Submit Booking</button>
        </form>
    );
}
