import React from 'react';

export const HomePage: React.FC = () => {
    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>📚 Sistema de Distribución de Libros</h1>
                <p style={{ fontSize: '16px', color: '#666', margin: '0 0 20px 0' }}>
                    Arquitectura de Software Orientada a Microservicios Distribuidos.
                </p>
                <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }} />

                <h3>🛠️ Componentes de la Arquitectura</h3>
                <ul style={{ paddingLeft: '20px' }}>
                    <li><strong>Ecosistema Backend:</strong> Microservicios desarrollados en Quarkus y Spring Boot.</li>
                    <li><strong>Base de Datos:</strong> Persistencia aislada y relacional con PostgreSQL.</li>
                    <li><strong>Descubrimiento y Gateway:</strong> Service Discovery mediante Consul y enrutamiento dinámico con Traefik.</li>
                    <li><strong>Resiliencia y Monitoreo:</strong> Implementación de Circuit Breaker, Health Checks y recolección de métricas con Prometheus.</li>
                </ul>

                <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '20px 0' }} />

                <h3>👥 Integrantes del Grupo</h3>
                <p style={{ margin: '5px 0' }}>• Michael Barrionuevo</p>
                <p style={{ margin: '5px 0' }}>• Byron Flores</p>
                <p style={{ margin: '5px 0' }}>• Jordi Pila</p>
            </div>
        </div>
    );
};