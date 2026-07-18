import { useState } from 'react';
import { AuthorsPage } from './pages/AuthorsPage';
import { CustomersPage } from './pages/CustomersPage';
import { BooksPage } from './pages/BooksPage';

function App() {

  const [activeTab, setActiveTab] = useState<'books' | 'authors' | 'customers'>('books');

  const tabStyle = (tab: 'books' | 'authors' | 'customers') => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#007bff' : '#f8f9fa',
    color: activeTab === tab ? '#white' : '#333',
    border: '1px solid #dee2e6',
    borderBottom: activeTab === tab ? 'none' : '1px solid #dee2e6',
    borderRadius: '5px 5px 0 0',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    marginRight: '5px',
  });

  return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fff' }}>
        {/* Encabezado Principal */}
        <header style={{ backgroundColor: '#212529', color: 'white', padding: '15px 20px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>📚 Sistema de Librería Distribuida</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
            Arquitectura del Grupo: Quarkus | Spring Boot | Consul | Traefik
          </p>
        </header>

        {/* Menú de Navegación por Pestañas */}
        <nav style={{ display: 'flex', borderBottom: '1px solid #dee2e6', paddingLeft: '20px' }}>
          <button
              style={tabStyle('books')}
              onClick={() => setActiveTab('books')}
          >
            📊 Inventario y Ventas
          </button>
          <button
              style={tabStyle('authors')}
              onClick={() => setActiveTab('authors')}
          >
            👥 Gestión de Autores
          </button>
          <button
              style={tabStyle('customers')}
              onClick={() => setActiveTab('customers')}
          >
            👤 Gestión de Clientes
          </button>
        </nav>

        {/* Contenedor de la Página Activa */}
        <main style={{ marginTop: '10px' }}>
          {activeTab === 'books' && <BooksPage />}
          {activeTab === 'authors' && <AuthorsPage />}
          {activeTab === 'customers' && <CustomersPage />}
        </main>
      </div>
  );
}

export default App;