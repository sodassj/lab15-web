'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, DollarSign, Archive, Edit3, Save, X, AlertCircle } from 'lucide-react';
import * as THREE from 'three';
import { getProducto, updateProducto } from '@/lib/api';

interface FormData {
  nomPro: string;
  precioProducto: string;
  stockProducto: string;
}

interface FormErrors {
  nomPro?: string;
  precioProducto?: string;
  stockProducto?: string;
  general?: string;
}

export default function EditarProducto() {
  const router = useRouter();
  const { codProducto } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({ 
    nomPro: '', 
    precioProducto: '', 
    stockProducto: '' 
  });
  
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringRef = useRef<THREE.Group | null>(null);

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nomPro.trim()) {
      newErrors.nomPro = 'El nombre del producto es requerido';
    } else if (form.nomPro.length < 2) {
      newErrors.nomPro = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!form.precioProducto) {
      newErrors.precioProducto = 'El precio es requerido';
    } else if (parseFloat(form.precioProducto) <= 0) {
      newErrors.precioProducto = 'El precio debe ser mayor a 0';
    }

    if (!form.stockProducto) {
      newErrors.stockProducto = 'El stock es requerido';
    } else if (parseInt(form.stockProducto) < 0) {
      newErrors.stockProducto = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cargar datos del producto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setIsLoadingData(true);
        const data = await getProducto(codProducto);
        setForm({
          nomPro: data.nomPro,
          precioProducto: data.precioProducto.toString(),
          stockProducto: data.stockProducto.toString()
        });
      } catch (error) {
        setErrors({ general: 'Error al cargar los datos del producto' });
        console.error('Error al cargar producto:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (codProducto) {
      loadProductData();
    }
  }, [codProducto]);

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await updateProducto(codProducto, { 
        ...form, 
        precioProducto: parseFloat(form.precioProducto),
        stockProducto: parseInt(form.stockProducto)
      });

      // Animación de éxito antes de redireccionar
      setTimeout(() => {
        router.push('/productos');
      }, 1000);

    } catch (error) {
      setErrors({ general: 'Error al actualizar el producto. Inténtalo de nuevo.' });
      console.error('Error al actualizar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja los cambios en los inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Limpia el error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Setup inicial
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Setup Three.js scene - Gema brillante para crear producto
        if (mountRef.current && !sceneRef.current) {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          
          renderer.setSize(150, 150);
          renderer.setClearColor(0x000000, 0);
          
          mountRef.current.appendChild(renderer.domElement);
          
          // Lighting
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
          scene.add(ambientLight);
          
          const pointLight1 = new THREE.PointLight(0xff69b4, 1, 100);
          pointLight1.position.set(10, 10, 10);
          scene.add(pointLight1);
          
          const pointLight2 = new THREE.PointLight(0x9932cc, 1, 100);
          pointLight2.position.set(-10, -10, 10);
          scene.add(pointLight2);
          
          // Create sparkling gem
          const gemGroup = new THREE.Group();
          
          const gemGeometry = new THREE.OctahedronGeometry(1);
          const gemMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff1493,
            metalness: 0,
            roughness: 0,
            transmission: 0.8,
            clearcoat: 1,
            clearcoatRoughness: 0
          });
          const gem = new THREE.Mesh(gemGeometry, gemMaterial);
          gemGroup.add(gem);
          
          scene.add(gemGroup);
          camera.position.z = 4;
          
          sceneRef.current = scene;
          rendererRef.current = renderer;
          ringRef.current = gemGroup;
          
          const animate = () => {
            requestAnimationFrame(animate);
            
            if (ringRef.current) {
              ringRef.current.rotation.y += 0.02;
              ringRef.current.rotation.x += 0.01;
              ringRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.1);
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos del producto...</p>
        </div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="pt-8 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back Button */}
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
              <button
                onClick={() => router.push('/productos')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Volver a Productos</span>
              </button>
            </div>

            {/* Page Header */}
            <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-12">
                
                {/* 3D Gem */}
                <div className="hidden sm:block">
                  <div 
                    ref={mountRef} 
                    className="w-[150px] h-[150px]"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(255, 105, 180, 0.4))'
                    }}
                  />
                </div>
                
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Editar
                    <span className="block text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
                      Producto ✏️
                    </span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Actualiza la información de tu accesorio elegante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
          <div className={`transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <div className="w-full max-w-2xl">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                
                {/* Form Header */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 dark:from-pink-500/20 dark:to-purple-600/20 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Editar Información
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Modifica los campos que desees actualizar
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  
                  {/* Error General */}
                  {errors.general && (
                    <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700 dark:text-red-400">{errors.general}</span>
                    </div>
                  )}

                  {/* Nombre del Producto */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Package className="w-4 h-4 text-purple-500" />
                      <span>Nombre del Producto *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Collar de Perlas Elegante"
                      value={form.nomPro}
                      onChange={(e) => handleInputChange('nomPro', e.target.value)}
                      className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 placeholder-gray-400 ${
                        errors.nomPro 
                          ? 'focus:ring-red-500 ring-2 ring-red-200 dark:ring-red-800' 
                          : 'focus:ring-purple-500'
                      }`}
                      disabled={isLoading}
                    />
                    {errors.nomPro && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.nomPro}</span>
                      </p>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Precio (USD) *</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="99.99"
                      value={form.precioProducto}
                      onChange={(e) => handleInputChange('precioProducto', e.target.value)}
                      className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 placeholder-gray-400 ${
                        errors.precioProducto 
                          ? 'focus:ring-red-500 ring-2 ring-red-200 dark:ring-red-800' 
                          : 'focus:ring-purple-500'
                      }`}
                      disabled={isLoading}
                    />
                    {errors.precioProducto && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.precioProducto}</span>
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Archive className="w-4 h-4 text-blue-500" />
                      <span>Cantidad en Stock *</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="50"
                      value={form.stockProducto}
                      onChange={(e) => handleInputChange('stockProducto', e.target.value)}
                      className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 placeholder-gray-400 ${
                        errors.stockProducto 
                          ? 'focus:ring-red-500 ring-2 ring-red-200 dark:ring-red-800' 
                          : 'focus:ring-purple-500'
                      }`}
                      disabled={isLoading}
                    />
                    {errors.stockProducto && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.stockProducto}</span>
                      </p>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => router.push('/productos')}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                      <span>Cancelar</span>
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Success Message */}
              {isLoading && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center space-x-3 text-green-700 dark:text-green-400">
                    <div className="w-5 h-5 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                    <span>Actualizando tu producto... ¡Casi listo! ✨</span>
                  </div>
                </div>
              )}
            </div>
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