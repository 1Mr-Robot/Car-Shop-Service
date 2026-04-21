import ApiClient from './apiClient';

class AdminService {
    static async getClientsWithVehicles() {
        const response = await ApiClient.get('/clientes');
        return response.data || [];
    }

    static async getMechanics() {
        const response = await ApiClient.get('/usuarios/mecanicos');
        return response.data || [];
    }

    static async createMasterOrder(orderData) {
        return await ApiClient.post('/ordenes', orderData);
    }
}

export default AdminService;