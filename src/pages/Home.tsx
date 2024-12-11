import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Home: React.FC = () => {
  const config = useStore((state) => state.config);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Bienvenidos</h1>
          <p className="text-xl text-white mb-8">La mejor experiencia culinaria</p>
          <Link
            to="/menu"
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Ver Menú
          </Link>
        </div>
      </div>

      {/* Featured Dishes Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestras Especialidades
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Add featured dishes here */}
        </div>
      </div>
    </div>
  );
};