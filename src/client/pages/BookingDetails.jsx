import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailCard from "../components/BookingDetailCard";


export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        fetch(`/api/bookings/${id}`, { credentials: "include" })
            .then((res) => res.json())
            .then(setBooking)
            .catch(() => alert("Failed to load booking"));
    }, [id]);

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmed) return;

        const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: "PUT",
            credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
            alert("Booking cancelled.");
            navigate("/bookings");
        } else {
            alert(data.error || "Cancellation failed.");
        }
    };

    if (!booking) return <p>Loading...</p>;

    return <>

        <BookingDetailCard booking={booking} onCancel={handleCancel} />;
    </>

}
