import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { CustomersPage } from './pages/CustomersPage';
import styles from './App.module.css';

function App() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

    return (
        <BrowserRouter>
            {/* Barra de Navegación Global */}
            <nav className={styles.navbar}>
                <NavLink to="/" end className={linkClass}>Home</NavLink>
                <NavLink to="/books" className={linkClass}>Libros</NavLink>
                <NavLink to="/authors" className={linkClass}>Autores</NavLink>
                <NavLink to="/customers" className={linkClass}>Clientes</NavLink>
            </nav>

            {/* Definición de las 4 Rutas Oficiales */}
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
