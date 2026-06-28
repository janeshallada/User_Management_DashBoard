import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userService';
import { mapApiUserToAppUser, generateId } from '../utils/helpers';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const mapped = response.data.map(mapApiUserToAppUser);
      setUsers(mapped);
    } catch (err) {
      setError('Unable to fetch users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = useCallback(async (userData) => {
    setError(null);
    try {
      // POST to API (JSONPlaceholder simulates success but doesn't persist)
      await createUser(userData);
      const newUser = {
        ...userData,
        id: generateId(users),
      };
      setUsers((prev) => [newUser, ...prev]);
      return { success: true };
    } catch (err) {
      setError('Failed to add user. Please try again.');
      return { success: false };
    }
  }, [users]);

  const editUser = useCallback(async (id, userData) => {
    setError(null);
    try {
      await updateUser(id, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...userData, id } : u))
      );
      return { success: true };
    } catch (err) {
      setError('Failed to update user. Please try again.');
      return { success: false };
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      return { success: false };
    }
  }, []);

  return {
    users,
    loading,
    error,
    setError,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
};
