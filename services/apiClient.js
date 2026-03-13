// apiClient.js

// 1. Importamos las herramientas de Firebase
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; // <-- Sube un nivel para encontrar el archivo en la raíz

// Inicializamos auth usando tu app configurada
const auth = getAuth(app);

// 2. Leemos la URL automáticamente de tu archivo .env
const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`; 

class ApiClient {
    // Método privado para obtener el token fresco de Firebase
    static async _getToken() {
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken(true); // true fuerza la actualización si expiró
        }
        return null;
    }

    // El motor central que procesa todas las llamadas
    static async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const token = await this._getToken();

        // Configuramos los Headers por defecto
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        // Si hay un usuario logueado en Firebase, inyectamos el Token
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            // Intentamos parsear el JSON
            const data = await response.text();
            const parsedData = data ? JSON.parse(data) : {};

            // MANEJO DE ERRORES RESTful (400, 404, 500, etc.)
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: parsedData.message || `Error HTTP: ${response.status}`,
                    details: parsedData
                };
            }

            // Si es un 200 OK o 201 Created, devolvemos los datos limpios
            return parsedData;

        } catch (error) {
            console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
            throw error;
        }
    }

    // ==========================================
    // MÉTODOS HTTP RESTful
    // ==========================================

    // SAFE & IDEMPOTENT: Lectura y filtrado
    static get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // NOT SAFE & NOT IDEMPOTENT: Creación de recursos
    static post(endpoint, body) {
        return this.request(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(body) 
        });
    }

    // NOT SAFE & IDEMPOTENT: Reemplazo completo
    static put(endpoint, body) {
        return this.request(endpoint, { 
            method: 'PUT', 
            body: JSON.stringify(body) 
        });
    }

    // NOT SAFE & NOT IDEMPOTENT: Actualizaciones parciales
    static patch(endpoint, body) {
        return this.request(endpoint, { 
            method: 'PATCH', 
            body: JSON.stringify(body) 
        });
    }

    // NOT SAFE & IDEMPOTENT: Eliminación
    static delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export default ApiClient;