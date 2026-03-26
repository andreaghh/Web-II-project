import { useAuth } from "../context/AuthContext";
import BackButton from "./BackButton.jsx";

export default function BookingDetailCard({ booking, onCancel }) {
    const { user } = useAuth();

    const {
        id,
        status,
        TransportType,
        vehicle_count,
        reason,
        departure_time,
        return_time,
        createdAt,
        user_id,
    } = booking;

    const transportType = TransportType?.type || "Unknown";
    const imageUrl = TransportType?.image?.startsWith("http")
        ? TransportType.image
        : `/${TransportType?.image || "default.png"}`;

    const canCancel =
        user &&
        user.id === user_id &&
        ["pending", "approved"].includes(status.toLowerCase());

    return (
        <div className="booking-detail-card-vertical">
            <div className="booking-header">
                <BackButton />
                <h2>Booking Details</h2>
            </div>

            {TransportType?.image && (
                <img className="booking-img-top" src={imageUrl} alt={transportType} />
            )}

            <div className="booking-info-group">
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Transport Type:</strong> {transportType}</p>
                <p><strong>Vehicle Count:</strong> {vehicle_count}</p>
                <p><strong>Reason:</strong> {reason}</p>
                <p><strong>Departure:</strong> {new Date(departure_time).toLocaleString()}</p>
                <p><strong>Return:</strong> {new Date(return_time).toLocaleString()}</p>
                <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
            </div>

            {canCancel && (
                <button className="cancel-button" onClick={() => onCancel(id)}>
                    Cancel Booking
                </button>
            )}
        </div>
    );
}
