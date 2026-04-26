// SalesService.js
import ApiClient from './apiClient';

class SalesService {
    static async getAllSales() {
        const response = await ApiClient.get('/ventas');
        return response.data || [];
    }
}

export default SalesService;