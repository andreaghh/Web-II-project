import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import BackButton from "../../components/BackButton.jsx";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    auth: { role: "admin" }
});

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [status, setStatus] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5;

    const fetchBookings = async () => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (searchUser) params.append("user", searchUser);

        const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
            credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setBookings(data);
    };

    useEffect(() => {
        fetchBookings();
        socket.on("newBooking", () => {
            alert("New booking received!");
            fetchBookings();
        });
        return () => {
            socket.off("newBooking");
        };
    }, [status, searchUser]);

    const updateBookingStatus = async (id, action) => {
        const confirmMsg = {
            approve: "Approve this booking?",
            deny: "Deny this booking?",
            cancel: "Cancel this booking?",
        };
        if (!window.confirm(confirmMsg[action])) return;

        const res = await fetch(`/api/admin/bookings/${id}/${action}`, {
            method: "PUT",
            credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Booking ${action}d.`);
            fetchBookings();
        } else {
            alert(data.error || `Failed to ${action} booking.`);
        }
    };

    // Pagination logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    return (
        <main className="admin-bookings">
            <BackButton />
            <h2>🗂 Admin – All Bookings</h2>

            <div className="booking-filters">
                <input
                    type="text"
                    placeholder="Search by user name"
                    value={searchUser}
                    onChange={(e) => { setSearchUser(e.target.value); setCurrentPage(1); }}
                />
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Vehicle Type</th>
                    <th>Reason</th>
                    <th>Departure</th>
                    <th>Return</th>
                    <th>Justification</th>
                    <th>Vehicles</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentBookings.map((b) => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.User?.name} ({b.User?.email})</td>
                        <td>{b.TransportType?.type}</td>
                        <td>{b.reason}</td>
                        <td>{new Date(b.departure_time).toLocaleString()}</td>
                        <td>{new Date(b.return_time).toLocaleString()}</td>
                        <td>
                            {b.justification_path && (
                                <a
                                    href={`http://localhost:3000/${b.justification_path.replace(/\\/g, "/")}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download
                                </a>
                            )}
                        </td>
                        <td>
                            {b.Transports && b.Transports.length > 0 ? (
                                <ul>
                                    {b.Transports.map((v) => (
                                        <li key={v.id}>{v.vehicle_identifier}</li>
                                    ))}
                                </ul>
                            ) : (
                                "No vehicles assigned"
                            )}
                        </td>
                        <td>
                            <span className={`status-badge ${b.status}`}>{b.status}</span>
                        </td>
                        <td>
                            {b.status === "pending" && (
                                <div className="booking-actions">
                                    <button
                                        className="action-button approve"
                                        onClick={() => updateBookingStatus(b.id, "approve")}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="action-button deny"
                                        onClick={() => updateBookingStatus(b.id, "deny")}
                                    >
                                        Deny
                                    </button>
                                    <button
                                        className="action-button cancel"
                                        onClick={() => updateBookingStatus(b.id, "cancel")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ◀ Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </main>
    );
}
