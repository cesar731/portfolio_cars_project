 
import React from 'react';

interface RoleBadgeProps {
  role_id: number;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role_id }) => {
  const getRoleText = () => {
    switch (role_id) {
      case 1: return 'Administrador';
      case 2: return 'Asesor';
      case 3: return 'Usuario';
      default: return 'Desconocido';
    }
  };

  const getRoleColor = () => {
    switch (role_id) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs text-white rounded-full ${getRoleColor()}`}>
      {getRoleText()}
    </span>
  );
};

export default RoleBadge;