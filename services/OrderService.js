// OrderService.js
import ApiClient from './apiClient';

class OrderService {
    // ==========================================
    // 1. LECTURA Y FILTRADO (GET - Safe & Idempotent)
    // ==========================================

    /**
     * Método base para obtener órdenes con paginación, filtros y ordenamiento.
     */
    static async getOrders({ mecanicoId, estatus, sort, limit = 10, page = 1 }) {
        // Construimos los Query Parameters (ej. ?estatus=Pendiente&limit=5)
        const params = new URLSearchParams();
        if (mecanicoId) params.append('mecanico_id', mecanicoId);
        if (estatus) params.append('estatus_servicio', estatus); // Hace match con orden_servicio.estatus
        if (sort) params.append('sort', sort);
        params.append('limit', limit.toString());
        params.append('page', page.toString());

        // GET /api/v1/ordenes?...
        return await ApiClient.get(`/ordenes?${params.toString()}`);
    }

    // Wrappers específicos para la UI (HomeScreen y OrdersScreen)
    static async getActiveOrder(mecanicoId) {
        const response = await this.getOrders({
            mecanicoId,
            estatus: 'En Progreso',
            limit: 1
        });
        // Si el backend devuelve un arreglo, extraemos el primer elemento
        return response.data && response.data.length > 0 ? response.data[0] : null;
    }

    static async getUpcomingOrders(mecanicoId) {
        const response = await this.getOrders({
            mecanicoId,
            estatus: 'Pendiente',
            sort: 'fecha_inicio_asc',
            limit: 10
        });
        return response.data || [];
    }

    static async getCompletedOrders(mecanicoId) {
        const response = await this.getOrders({
            mecanicoId,
            estatus: 'Finalizado',
            sort: 'fecha_fin_desc',
            limit: 10
        });
        return response.data || [];
    }

    // ==========================================
    // 2. ACTUALIZACIÓN PARCIAL (PATCH - Not Safe, Idempotent)
    // ==========================================

    /**
     * Actualiza el estatus de un servicio específico dentro de una orden.
     * Utilizado en OrderDetailsScreen.js al tocar un servicio.
     */
    static async updateServiceStatus(orderId, serviceId, nuevoEstatus) {
        // PATCH /api/v1/ordenes/{orderId}/servicios/{serviceId}
        return await ApiClient.patch(`/ordenes/${orderId}/servicios/${serviceId}`, {
            estatus: nuevoEstatus // 'Pendiente', 'En Progreso', o 'Finalizado'
        })
    }

    /**
     * Inicia todos los servicios pendientes de una orden pasándolos a "En Progreso".
     */
    static async startAllServices(orderId) {
        return await ApiClient.put(`/ordenes/${orderId}/iniciar`, {});
    }

    
    // ==========================================
    // 3. CREACIÓN DE RECURSOS SUBORDINADOS (POST - Not Safe, Not Idempotent)
    // ==========================================

    /**
     * Agrega uno o más servicios nuevos a la orden.
     * Utilizado en AddServiceScreen.js
     */
    static async addServicesToOrder(orderId, serviceIdsArray) {
        // POST /api/v1/ordenes/{orderId}/servicios
        return await ApiClient.post(`/ordenes/${orderId}/servicios`, {
            servicios: serviceIdsArray
        });
    }

    /**
     * Agrega uno o más productos a la orden.
     * Utilizado en AddProductScreen.js
     */
    static async addProductsToOrder(orderId, productIdsArray) {
        // POST /api/v1/ordenes/{orderId}/productos
        return await ApiClient.post(`/ordenes/${orderId}/productos`, {
            productos: productIdsArray
        });
    }

    /**
     * Agrega un servicio personalizado (al vuelo) definiendo descripción y precio.
     */
    static async addCustomService(orderId, descripcion_personalizada, precio_personalizado) {
        return await ApiClient.post(`/ordenes/${orderId}/servicios-personalizados`, {
            descripcion_personalizada,
            precio_personalizado: parseFloat(precio_personalizado)
        });
    }

    /**
     * Sello de la orden maestra como finalizada.
     */
    static async finalizeOrder(orderId) {
        return await ApiClient.patch(`/ordenes/${orderId}/finalizar`, {});
    }
}

export default OrderService;