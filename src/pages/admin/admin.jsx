import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const db = getFirestore();

  

  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const userList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
    };
    
    useEffect(() => {
    fetchUsers();
  }, );

  const addUser = async () => {
    if (!newUserEmail) return alert("Please enter an email.");
    
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const userDoc = snapshot.docs.find((doc) => doc.data().email === newUserEmail);

    if (userDoc) {
      await updateDoc(doc(db, "users", userDoc.id), { role: newUserRole });
      fetchUsers();
      setNewUserEmail("");
    } else {
      alert("User not found.");
    }
  };

  const changeUserRole = async (id, role) => {
    await updateDoc(doc(db, "users", id), { role });
    fetchUsers();
  };

  const removeUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center mb-4">User Management</h2>

        {/* Add User Section */}
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <input
            type="email"
            placeholder="Enter user email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={addUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Assign Role
          </button>
        </div>

 {/* Users Table */}
 {users.length > 0 ? (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Profile</th>
                <th className="p-2">Display Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center border-t">
                  <td className="p-2">
                    <img
                      src={user.image || "https://via.placeholder.com/40"} // Default image if none exists
                      alt="User"
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="p-2 font-semibold">{user.displayName || "Unknown"}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <select
                      value={user.role}
                      onChange={(e) => changeUserRole(user.id, e.target.value)}
                      className="border p-1 rounded-lg"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeUser(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

