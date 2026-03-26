import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import BackButton from "../components/BackButton.jsx";

export default function BookNew() {
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch("/api/transports/types", { credentials: "include" })
            .then((res) => res.json())
            .then(setTypes)
            .catch((err) => console.error("Failed to load types:", err));
    }, []);

    const handleSubmit = async (formData) => {
        const res = await fetch("/api/bookings", {
            method: "POST",
            credentials: "include",
            body: formData, // ← no need to stringify
        });

        const result = await res.json();

        if (res.ok) {
            alert("Booking submitted!");
            navigate("/bookings");
        } else {
            alert(result.error || "Booking failed.");
        }
    };

    const handleSelectType = (type) => {
        if (selectedImage === type.image) {
            setSelectedImage(null);
        } else {
            setSelectedImage(type.image);
        }
    };

    return (
        <main className="booking-new">
            <div className="booking-header">
                <BackButton />
                <h2>Request a New Booking</h2>
            </div>

            <div className="booking-container">
                {/* Vehicle Selector */}
                <div className="booking-vehicles">
                    <h4>Available Vehicles</h4>
                    {types.length === 0 ? (
                        <p>Loading transport types...</p>
                    ) : (
                        <ul className="vehicle-list">
                            {types.map((t) => (
                                <li
                                    key={t.id}
                                    className={selectedImage === t.image ? "vehicle-item selected" : "vehicle-item"}
                                    onClick={() => handleSelectType(t)}
                                >
                                    <strong>{t.type}</strong> — Capacity: {t.capacity}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                <div className="booking-form-area">
                    {selectedImage && (
                        <div className="vehicle-preview">
                            <h5>Vehicle Preview:</h5>
                            <img src={selectedImage} alt="Transport Preview" />
                        </div>
                    )}
                    <BookForm onSubmit={handleSubmit} />
                </div>
            </div>
        </main>

    );
}
