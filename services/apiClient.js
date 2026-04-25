// apiClient.js

// 1. Importamos las herramientas de Firebase
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; 

const auth = getAuth(app);
const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`; 

class ApiClient {
    static async _getToken() {
        const user = auth.currentUser;
        if (user) {
            // FIX CRÍTICO: 'false' permite usar el token en caché. Firebase lo refresca solo si va a expirar.
            return await user.getIdToken(false); 
        }
        return null;
    }

    static async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;
        const token = await this._getToken();

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const textData = await response.text();
            
            let parsedData = {};
            try {
                // Intentamos parsear. Si el servidor crashea y devuelve HTML, esto nos salva.
                parsedData = textData ? JSON.parse(textData) : {};
            } catch (e) {
                parsedData = { error: "Respuesta no válida del servidor." };
                console.error("[API JSON Parse Error]", textData);
            }

            // MANEJO DE ERRORES RESTful
            if (!response.ok) {
                // FIX CRÍTICO: Leemos 'error' primero, que es la variable que usa nuestro backend
                const errorMessage = parsedData.error || parsedData.message || `Error HTTP: ${response.status}`;
                // Lanzamos un Error real de JavaScript para que el catch(error) en la UI pueda leer error.message
                throw new Error(errorMessage);
            }

            return parsedData;

        } catch (error) {
            console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
            throw error;
        }
    }

    // ==========================================
    // MÉTODOS HTTP RESTful
    // ==========================================
    static get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
    }

    static put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
    }

    static patch(endpoint, body) {
        return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
    }

    static delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export default ApiClient;