 
import React from 'react';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel_type?: string;
  mileage?: number;
  color?: string;
}

interface ComparisonTableProps {
  cars: Car[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ cars }) => {
  if (!cars || cars.length === 0) return <p>No hay autos seleccionados para comparar.</p>;

  const headers = ['Característica', ...cars.map(car => `${car.brand} ${car.model}`)];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left font-semibold border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium px-4 py-2">Precio</td>
            {cars.map(car => (
              <td key={car.id} className="px-4 py-2">${car.price.toLocaleString()}</td>
            ))}
          </tr>
          <tr>
            <td className="font-medium px-4 py-2">Año</td>
            {cars.map(car => (
              <td key={car.id} className="px-4 py-2">{car.year}</td>
            ))}
          </tr>
          <tr>
            <td className="font-medium px-4 py-2">Combustible</td>
            {cars.map(car => (
              <td key={car.id} className="px-4 py-2">{car.fuel_type || '-'}</td>
            ))}
          </tr>
          <tr>
            <td className="font-medium px-4 py-2">Kilometraje</td>
            {cars.map(car => (
              <td key={car.id} className="px-4 py-2">{car.mileage ? `${car.mileage} km` : '-'}</td>
            ))}
          </tr>
          <tr>
            <td className="font-medium px-4 py-2">Color</td>
            {cars.map(car => (
              <td key={car.id} className="px-4 py-2">{car.color || '-'}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;