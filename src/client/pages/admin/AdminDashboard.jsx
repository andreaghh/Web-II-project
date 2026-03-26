import DashboardCharts from "../../components/DashboardCharts.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {Link} from "react-router-dom";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="admin-dashboard">
            <h2>Welcome, {user?.name}</h2>
            <p>This is your admin dashboard.</p>
            <div className="admin-links">
                <Link to="/admin/users"><button>Manage Users</button></Link>
                <Link to="/admin/bookings"><button>Manage Bookings</button></Link>
                <Link to="/admin/transports"><button>Manage Transport</button></Link>
                <Link to="/admin/support"><button>Manage Chats</button></Link>
            </div>
            <DashboardCharts />


        </div>
    );
}
