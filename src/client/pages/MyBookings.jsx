import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyBookings() {
    const { user, loading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        if (!loading && user) {
            const fetchBookings = async () => {
                const res = await fetch("/api/bookings/mine", {
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok) setBookings(data);
            };
            fetchBookings();
        }
    }, [loading, user]);

    if (loading) return <p>Loading session...</p>;
    if (!user) return <p>Not logged in.</p>;

    const filteredBookings = bookings.filter((b) =>
        new Date(b.createdAt).toLocaleDateString().includes(search) &&
        (statusFilter === "" || b.status === statusFilter)
    );

    return (
        <div className="my-bookings">
            <h2>Welcome, {user.name}</h2>
            <h4>Your Bookings</h4>

            <div>
                <input
                    type="text"
                    placeholder="Search by date (e.g. 4/21/2025)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {filteredBookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Date Created</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBookings.map((b) => (
                        <tr key={b.id}>
                            <td>
                                <Link to={`/bookings/${b.id}`}>{b.id}</Link>
                            </td>
                            <td>{new Date(b.createdAt).toLocaleString()}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}