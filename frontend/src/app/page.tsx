"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search, ShoppingCart, User } from 'lucide-react';
import Image from "next/image";
import * as THREE from 'three';

export default function ProductLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null); // para el contenedor del canvas
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Setup Three.js scene
    if (mountRef.current && !sceneRef.current) {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(300, 300);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      mountRef.current.appendChild(renderer.domElement);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      const pointLight = new THREE.PointLight(0xff69b4, 0.5, 100);
      pointLight.position.set(-10, 0, 10);
      scene.add(pointLight);
      
      // Create ring
      const ringGroup = new THREE.Group();
      
      // Main ring (torus)
      const ringGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
      const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.castShadow = true;
      ringGroup.add(ring);
      
      // Gems on the ring
      const gemGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const gemMaterials = [
        new THREE.MeshPhysicalMaterial({ color: 0xff1493, metalness: 0, roughness: 0, transmission: 0.9, clearcoat: 1 }),
        new THREE.MeshPhysicalMaterial({ color: 0x9932cc, metalness: 0, roughness: 0, transmission: 0.9, clearcoat: 1 }),
        new THREE.MeshPhysicalMaterial({ color: 0x00ffff, metalness: 0, roughness: 0, transmission: 0.9, clearcoat: 1 })
      ];
      
      for (let i = 0; i < 8; i++) {
        const gem = new THREE.Mesh(gemGeometry, gemMaterials[i % 3]);
        const angle = (i / 8) * Math.PI * 2;
        gem.position.x = Math.cos(angle) * 2;
        gem.position.z = Math.sin(angle) * 2;
        gem.position.y = 0.2;
        gem.castShadow = true;
        ringGroup.add(gem);
      }
      
      scene.add(ringGroup);
      camera.position.z = 8;
      
      // Store references
      sceneRef.current = scene;
      rendererRef.current = renderer;
      ringRef.current = ringGroup;
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (ringRef.current) {
          ringRef.current.rotation.y += 0.01;
          ringRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      
      // Cleanup Three.js
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  const navigationLinks = [
    { name: 'Inicio', href: '/', current: true },
    { 
      name: 'Productos', 
      href: '/productos',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Collares', href: '/productos/collares' },
        { name: 'Pulseras', href: '/productos/pulseras' },
        { name: 'Aretes', href: '/productos/aretes' },
        { name: 'Anillos', href: '/productos/anillos' }
      ]
    },
    { name: 'Precios', href: '/precios' },
    { name: 'Contacto', href: '/contacto' }
  ];

  const products = [
    {
      id: 1,
      name: "Colección Premium",
      description: "Accesorios exclusivos de lujo",
      price: "$299",
      emoji: "👑",
      gradient: "from-pink-500 to-purple-600"
    },
    {
      id: 2,
      name: "Esenciales D&M",
      description: "Perfectos para el día a día",
      price: "$99",
      emoji: "💫",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      id: 3,
      name: "Edición Especial",
      description: "Diseños únicos y elegantes",
      price: "$199",
      emoji: "✨",
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

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

      {/* Professional Navigation Bar */}
<nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
  isScrolled 
    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg' 
    : 'bg-transparent'
}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16 lg:h-20">

      {/* Logo Section */}
      <div className={`flex items-center space-x-4 transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
      }`}>
        
        {/* Imagen del logo */}
        <Image
          src="/img/waaa.png"
          alt="Logo Accesorios D&M"
          width={44}
          height={44}
          className="rounded-xl shadow-lg"
        />

        {/* Icono D&M y texto */}
        <div className="flex items-center space-x-3">
          <div className="relative">
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Accesorios D&M
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Elegancia en cada detalle 💎
            </p>
          </div>
        </div>
      </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationLinks.map((link, index) => (
                <div key={link.name} className="relative group">
                  <a
                    href={link.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      link.current
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </a>
                  
                  {/* Dropdown Menu */}
                  {link.hasDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        {link.dropdownItems?.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <User className="w-5 h-5" />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-700/20">
            <div className="px-4 py-4 space-y-2">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.current
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content con padding top para compensar navbar fijo */}
      <div className="relative z-10 pt-20 lg:pt-24">
        <div className="grid grid-rows-[1fr_auto] min-h-screen p-6 sm:p-12 lg:p-20">
          
          {/* Main Content */}
          <main className="flex flex-col items-center justify-center text-center space-y-16">
            
            {/* Hero Section */}
            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative">
                <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Accesorios
                  <span className="block text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
                    D&M 💎
                  </span>
                </h1>
                
                {/* Accesorio 3D */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div 
                      ref={mountRef} 
                      className="w-[300px] h-[300px] mx-auto"
                      style={{
                        filter: 'drop-shadow(0 20px 40px rgba(255, 105, 180, 0.3))'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
                  
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Descubre nuestra exclusiva colección de accesorios diseñados para realzar tu estilo personal. 
                Elegancia, calidad y sofisticación en cada pieza. ✨
              </p>
            </div>

            {/* Products Grid */}
            <div className={`transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up`}
                    style={{ animationDelay: `${600 + index * 200}ms` }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {product.emoji}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-3xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                          {product.price}
                        </span>
                        <button className={`px-6 py-2 bg-gradient-to-r ${product.gradient} text-white rounded-full text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                          Elegir Plan
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className={`transition-all duration-1000 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-4">
                    ¿Lista para brillar? ✨👑
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    Únete a más de 5,000 mujeres que ya eligen Accesorios D&M para destacar
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Ver Catálogo 💎
                    </button>
                    <button className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300">
                      Tienda Online 🛍️
                    </button>
                  </div>
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full animate-spin" />
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className={`transition-all duration-1000 delay-900 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 pt-16">
              <a href="#" className="flex items-center gap-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group">
                <span className="text-lg group-hover:animate-bounce">💎</span>
                Catálogo
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                <span className="text-lg group-hover:animate-bounce">👜</span>
                Colecciones
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group">
                <span className="text-lg group-hover:animate-bounce">💌</span>
                Contacto
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                <span className="text-lg group-hover:animate-bounce">✨</span>
                Blog de Estilo
              </a>
            </div>
          </footer>
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