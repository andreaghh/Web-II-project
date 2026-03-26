export default function UserTable({ users, onDelete, onPromote }) {
    if (users.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u) => (
                <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                        {u.role !== "admin" && (
                            <button className="btn-promote" onClick={() => onPromote(u.id)}>Promote</button>
                        )}
                        <button className="btn-delete" onClick={() => onDelete(u.id)}>Delete</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
