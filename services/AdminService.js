import ApiClient from './apiClient';

class AdminService {
    static async getClientsWithVehicles() {
        const response = await ApiClient.get('/clientes');
        return response.data || [];
    }

    static async createClient(clientData) {
        return await ApiClient.post('/clientes', clientData);
    }

    static async getMechanics() {
        const response = await ApiClient.get('/usuarios/mecanicos');
        return response.data || [];
    }

    static async getCurrentUser() {
        const response = await ApiClient.get('/usuarios/yo');
        return response.data || null;
    }

    static async createMasterOrder(orderData) {
        return await ApiClient.post('/ordenes', orderData);
    }

    /**
     * Registra una nueva venta directa de mostrador.
     * @param {Object} saleData - Objeto con la lista de productos: { productos: [{ id_producto, cantidad }] }
     */
    static async createSale(saleData) {
        return await ApiClient.post('/ventas', saleData);
    }
}

export default AdminService;