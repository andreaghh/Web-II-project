import { useEffect, useState } from "react";

import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer
} from "recharts";

const COLORS = ["#005691", "#00A6ED", "#28C2FF", "#66D1FF", "#99E2FF"];

export default function DashboardCharts() {
    const [bookingData, setBookingData] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await fetch("/api/admin/dashboard", { credentials: "include" });
            const data = await res.json();
            if (!res.ok) return alert("Failed to load stats");

            // Booking status pie chart
            const booking = data.bookings || {};
            const formattedBooking = Object.entries(booking)
                .filter(([k]) => k !== "total")
                .map(([status, count]) => ({ name: status, value: count }));
            setBookingData(formattedBooking);

            // Transport bar chart
            const transport = data.transports || {};
            setVehicleData([
                { name: "Vehicles", count: transport.totalVehicles },
                { name: "Types", count: transport.totalTypes }
            ]);

            // User roles pie chart
            const users = data.userRoles || {};
            const formattedUsers = Object.entries(users).map(([role, count]) => ({
                name: role,
                value: count
            }));
            setUserData(formattedUsers);
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-charts">

            <div className="dashboard-row">
                <div className="chart-block">
                    <h4>📊 Booking Status</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={bookingData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {bookingData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-block">
                    <h4>🚐 Transport</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={vehicleData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}
