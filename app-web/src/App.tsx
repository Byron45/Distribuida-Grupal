import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { CustomersPage } from './pages/CustomersPage';

function App() {
  return (
      <BrowserRouter>
        {/* 🧭 Barra de Navegación Global */}
        <nav style={{ padding: '15px', backgroundColor: '#333', color: 'white', display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
          <Link to="/books" style={{ color: 'white', textDecoration: 'none' }}>📚 Libros</Link>
          <Link to="/authors" style={{ color: 'white', textDecoration: 'none' }}>✍️ Autores</Link>
          <Link to="/customers" style={{ color: 'white', textDecoration: 'none' }}>👥 Clientes</Link>
        </nav>

        {/* 🔀 Definición de las 4 Rutas Oficiales */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;