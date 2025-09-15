 
import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUser, deleteUser, User, UserUpdateRequest } from '../services/userApi';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
        setName(data.username);
        setEmail(data.email);
        setAvatar(data.avatar_url || '');
      } catch (err) {
        setError('No se pudo cargar tu perfil');
      }
    };
    loadUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userData: UserUpdateRequest = { username: name, email, avatar_url: avatar };
      const updated = await updateUser(userData);
      setUser(updated);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar perfil');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro? Esto eliminará tu cuenta permanentemente.')) return;
    try {
      await deleteUser();
      logout();
    } catch (err) {
      setError('No se pudo eliminar la cuenta');
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleUpdate} className="card p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nombre de Usuario</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">URL de Avatar (opcional)</label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full"
          />
        </div>
        <button type="submit" className="btn-primary mb-4">Actualizar Perfil</button>
        <button type="button" onClick={handleDelete} className="btn-danger">Eliminar Cuenta</button>
      </form>
    </div>
  );
};

export default Profile;