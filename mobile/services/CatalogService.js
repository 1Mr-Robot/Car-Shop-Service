// CatalogService.js
import ApiClient from './apiClient';

class CatalogService {
    // ==========================================
    // 1. CATÁLOGO DE SERVICIOS (GET - Safe & Idempotent)
    // ==========================================

    /**
     * Obtiene la lista de servicios estandarizados.
     * Ideal para llenar AddServiceScreen.js
     * * @param {number} page - Página actual para la paginación.
     * @param {number} limit - Cantidad de resultados por página.
     * @param {boolean} soloActivos - Filtrar solo los servicios con activo=true.
     */
    static async getServices({ page = 1, limit = 15, soloActivos = true } = {}) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (soloActivos) {
            params.append('activo', 'true');
        }

        // GET /api/v1/servicios?page=1&limit=15&activo=true
        const response = await ApiClient.get(`/servicios?${params.toString()}`);
        return response.data || [];
    }

    // ==========================================
    // 2. CATÁLOGO DE PRODUCTOS (GET - Safe & Idempotent)
    // ==========================================

    /**
     * Obtiene la lista de productos/refacciones.
     * Ideal para llenar AddProductScreen.js
     * * @param {number} page - Página actual para la paginación.
     * @param {number} limit - Cantidad de resultados por página.
     * @param {boolean} soloActivos - Filtrar solo productos con activo=true.
     * @param {boolean} conStock - (Opcional) Filtrar productos que tengan cantidad_stock > 0.
     */
    static async getProducts({ page = 1, limit = 15, soloActivos = true, conStock = false } = {}) {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        if (soloActivos) {
            params.append('activo', 'true');
        }
        
        if (conStock) {
            params.append('inStock', 'true'); // Preparado para que el backend filtre cantidad_stock > 0
        }

        // GET /api/v1/productos?page=1&limit=15&activo=true
        const response = await ApiClient.get(`/productos?${params.toString()}`);
        return response.data || [];
    }
}

export default CatalogService;