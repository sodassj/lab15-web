'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Package, Search, Grid, List } from 'lucide-react';

import * as THREE from 'three';

// Define el tipo del producto
interface Producto {
  codProducto: number;
  nomPro: string;
  precioProducto: number;
  stockProducto: number;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringRef = useRef<THREE.Group | null>(null);

  // Obtener productos del backend
  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Eliminar un producto por su código
  const eliminarProducto = async (codProducto: number) => {
    const confirmar = confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/api/productos/${codProducto}`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        alert('Producto eliminado');
        fetchProductos();
      } else {
        const data = await res.json();
        alert('Error al eliminar: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Filtrar productos por búsqueda
  useEffect(() => {
    const filtered = productos.filter(producto =>
      producto.nomPro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codProducto.toString().includes(searchTerm)
    );
    setFilteredProductos(filtered);
  }, [productos, searchTerm]);

  // Setup inicial
  useEffect(() => {
    setIsVisible(true);
    fetchProductos();
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Setup Three.js scene - versión simplificada para productos
    if (mountRef.current && !sceneRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(200, 200);
      renderer.setClearColor(0x000000, 0);
      
      mountRef.current.appendChild(renderer.domElement);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);
      
      // Create a simple jewelry box
      const boxGroup = new THREE.Group();
      
      const boxGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
      const boxMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      boxGroup.add(box);
      
      scene.add(boxGroup);
      camera.position.z = 4;
      
      sceneRef.current = scene;
      rendererRef.current = renderer;
      ringRef.current = boxGroup;
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (ringRef.current) {
          ringRef.current.rotation.y += 0.005;
          ringRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  const getStockColor = (stock: number) => {
    if (stock <= 5) return 'text-red-500 bg-red-50';
    if (stock <= 15) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStockIcon = (stock: number) => {
    if (stock <= 5) return '⚠️';
    if (stock <= 15) return '📦';
    return '✅';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-pink-400/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation breadcrumb */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <button onClick={() => router.push('/')} className="hover:text-purple-600 transition-colors">
                Inicio
              </button>
              <span>/</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium">Productos</span>
            </div>
          </div>

          {/* Main Header */}
          <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
              
              <div className="flex items-center space-x-6">
                {/* 3D Icon */}
                <div className="hidden sm:block">
                  <div 
                    ref={mountRef} 
                    className="w-[200px] h-[200px]"
                    style={{
                      filter: 'drop-shadow(0 10px 20px rgba(255, 105, 180, 0.3))'
                    }}
                  />
                </div>
                
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Gestión de 
                    <span className="block text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
                      Productos 💎
                    </span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Administra tu catálogo de accesorios elegantes
                  </p>
                </div>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => router.push('/productos/new')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Producto</span>
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className={`transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className={`transition-all duration-1000 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProductos.map((producto, index) => (
                  <div
                    key={producto.codProducto}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      {/* Product Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Package className="w-8 h-8 text-white" />
                      </div>

                      {/* Stock Badge */}
                      <div className={`absolute top-0 right-0 px-2 py-1 rounded-lg text-xs font-medium ${getStockColor(producto.stockProducto)}`}>
                        {getStockIcon(producto.stockProducto)} {producto.stockProducto}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                      {producto.nomPro}
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      Código: {producto.codProducto}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        ${producto.precioProducto}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Editar</span>
                      </button>
                      <button
                        onClick={() => eliminarProducto(producto.codProducto)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 dark:from-pink-500/20 dark:to-purple-600/20">
                      <tr>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Código</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Producto</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Precio</th>
                        <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                        <th className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductos.map((producto, index) => (
                        <tr 
                          key={producto.codProducto} 
                          className="border-t border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="p-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                            #{producto.codProducto}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 dark:text-white">
                                  {producto.nomPro}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                              ${producto.precioProducto}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStockColor(producto.stockProducto)}`}>
                              <span>{getStockIcon(producto.stockProducto)}</span>
                              <span>{producto.stockProducto} unidades</span>
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => router.push(`/productos/${producto.codProducto}/edit`)}
                                className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-all duration-200 hover:scale-105"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => eliminarProducto(producto.codProducto)}
                                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 hover:scale-105"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredProductos.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => router.push('/productos/new')}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Agregar Primer Producto</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}