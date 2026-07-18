import React from 'react';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>📚 Sistema de Distribución de Libros</h1>
                <p className={styles.subtitle}>
                    Arquitectura de Software Orientada a Microservicios Distribuidos.
                </p>
                <hr className={styles.divider} />

                <h3>🛠️ Componentes de la Arquitectura</h3>
                <ul className={styles.list}>
                    <li><strong>Ecosistema Backend:</strong> Microservicios desarrollados en Quarkus y Spring Boot.</li>
                    <li><strong>Base de Datos:</strong> Persistencia aislada y relacional con PostgreSQL.</li>
                    <li><strong>Descubrimiento y Gateway:</strong> Service Discovery mediante Consul y enrutamiento dinámico con Traefik.</li>
                    <li><strong>Resiliencia y Monitoreo:</strong> Implementación de Circuit Breaker, Health Checks y recolección de métricas con Prometheus.</li>
                </ul>

                <hr className={styles.divider} />

                <h3>👥 Integrantes del Grupo</h3>
                <p className={styles.member}>• Michael Barrionuevo</p>
                <p className={styles.member}>• Byron Flores</p>
                <p className={styles.member}>• Jordi Pila</p>
            </div>
        </div>
    );
};