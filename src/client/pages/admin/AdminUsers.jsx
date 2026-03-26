import { useEffect, useState } from "react";
import UserTable from "../../components/UserTable";
import BackButton from "../../components/BackButton.jsx";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    const fetchUsers = async () => {
        const params = new URLSearchParams();
        if (search) params.append("name", search);
        if (role) params.append("role", role);

        const res = await fetch(`/api/admin/users?${params.toString()}`, {
            credentials: "include",
        });

        const data = await res.json();
        if (res.ok) setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, [search, role]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Delete this user?");
        if (!confirm) return;

        const res = await fetch(`/api/admin/users/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            alert("User deleted.");
            fetchUsers();
        } else {
            const data = await res.json();
            alert(data.error || "Failed to delete user.");
        }
    };
    const handlePromote = async (id) => {
        const confirm = window.confirm("Promote this user to admin?");
        if (!confirm) return;

        const res = await fetch(`/api/admin/users/${id}/promote`, {
            method: "PUT",
            credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
            alert("User promoted to admin.");
            fetchUsers();
        } else {
            alert(data.error || "Promotion failed.");
        }
    };

    return (
        <main className="admin-users">
            <BackButton />
            <h2>Admin - User Management</h2>

            <div className="user-filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <UserTable users={users} onDelete={handleDelete} onPromote={handlePromote} />
        </main>
    );
}
