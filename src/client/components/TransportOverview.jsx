import { useEffect, useState } from "react";
import AddTransportTypeModal from "./AddTransportTypeModal";
import AddVehicleModal from "./AddVehicleModal";
import BackButton from "./BackButton.jsx";

export default function TransportOverview() {
    const [types, setTypes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [typeSearch, setTypeSearch] = useState("");
    const [vehicleSearch, setVehicleSearch] = useState("");
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
    const vehiclesPerPage = 5;

    const fetchData = async () => {
        const [resTypes, resVehicles] = await Promise.all([
            fetch("/api/transports/types"),
            fetch("/api/transports/vehicles"),
        ]);

        if (resTypes.ok) setTypes(await resTypes.json());
        if (resVehicles.ok) setVehicles(await resVehicles.json());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteType = async (id) => {
        if (!window.confirm("Delete this transport type?")) return;
        const res = await fetch(`/api/admin/transport-types/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) fetchData();
    };

    const handleDeleteVehicle = async (id) => {
        if (!window.confirm("Delete this vehicle?")) return;
        const res = await fetch(`/api/admin/transports/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.ok) fetchData();
    };

    // Filtered lists
    const filteredTypes = types.filter((t) =>
        t.type.toLowerCase().includes(typeSearch.toLowerCase())
    );

    const filteredVehicles = vehicles.filter(
        (v) =>
            v.vehicle_identifier.toLowerCase().includes(vehicleSearch.toLowerCase()) &&
            (vehicleTypeFilter === "" || v.TransportType?.id == vehicleTypeFilter)
    );

    // Pagination
    const indexOfLast = currentPage * vehiclesPerPage;
    const indexOfFirst = indexOfLast - vehiclesPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

    return (
        <div>
            <div className="overview-back">
                <BackButton />
            </div>

            <h2 className="overview-title">🛠 Transport Manager</h2>

            {/* Buttons to add types and vehicles */}
            <div className="transport-overview-buttons">
                <button onClick={() => setShowTypeModal(true)}>Add Transport Type</button>
                <button onClick={() => setShowVehicleModal(true)}>Add Vehicle</button>
            </div>

            {/* ───── Transport Types Section ───── */}
            <h3>Transport Types</h3>
            <input
                type="text"
                placeholder="Search transport types..."
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
            />

            {filteredTypes.length === 0 ? (
                <p>No transport types found.</p>
            ) : (
                <ul>
                    {filteredTypes.map((t) => (
                        <li key={t.id}>
                            <div>
                                <strong>{t.type}</strong> – Capacity: {t.capacity}
                            </div>
                            <button onClick={() => handleDeleteType(t.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ───── Vehicles Section ───── */}
            <h3>Vehicles</h3>

            <input
                type="text"
                placeholder="Search vehicles..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
            />

            <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
            >
                <option value="">All Types</option>
                {types.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.type}
                    </option>
                ))}
            </select>

            {currentVehicles.length === 0 ? (
                <p>No vehicles found.</p>
            ) : (
                <ul>
                    {currentVehicles.map((v) => (
                        <li key={v.id}>
                            <div>
                                {v.vehicle_identifier} — Type: {v.TransportType?.type} — Status: {v.status}
                            </div>
                            <button onClick={() => handleDeleteVehicle(v.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ───── Pagination ───── */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ◀ Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next ▶
                    </button>
                </div>
            )}

            {/* ───── Modals ───── */}
            {showTypeModal && (
                <AddTransportTypeModal
                    onClose={() => setShowTypeModal(false)}
                    onCreated={fetchData}
                />
            )}
            {showVehicleModal && (
                <AddVehicleModal
                    types={types}
                    onClose={() => setShowVehicleModal(false)}
                    onCreated={fetchData}
                />
            )}
        </div>
    );
}