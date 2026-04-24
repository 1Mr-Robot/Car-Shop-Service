import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavReceptionist from "../components/BottomNavReceptionist";

const mockSales = [
    {
        id: 1,
        fecha: "22/04/2026",
        productos: [
            { nombre: "Filtro de aceite", marca: "Bosch", cantidad: 2, precioUnitario: 250 },
            { nombre: "Bujía", marca: "NGK", cantidad: 4, precioUnitario: 80 },
        ],
    },
    {
        id: 2,
        fecha: "21/04/2026",
        productos: [
            { nombre: "Pastillas de freno", marca: "Bendix", cantidad: 1, precioUnitario: 1200 },
        ],
    },
    {
        id: 3,
        fecha: "20/04/2026",
        productos: [
            { nombre: "Aceite Sintético", marca: "Mobil 1", cantidad: 4, precioUnitario: 350 },
            { nombre: "Filtro de aire", marca: "K&N", cantidad: 1, precioUnitario: 420 },
        ],
    },
];

const SalesHistoryScreen = ({ navigation }) => {
    const formatPrice = (price) => `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

    const calculateTotal = (productos) => {
        return productos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
    };

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Historial de ventas</Text>
                    </View>

                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>REGISTRO DE VENTAS ({mockSales.length})</Text>
                    </View>

                    {mockSales.map((sale) => {
                        const totalVenta = calculateTotal(sale.productos);
                        return (
                            <View key={sale.id} style={styles.saleCard}>
                                <View style={styles.saleHeader}>
                                    <Text style={styles.saleDate}>{sale.fecha}</Text>
                                    <Text style={styles.saleTotal}>{formatPrice(totalVenta)}</Text>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                {sale.productos.map((producto, index) => (
                                    <View key={index} style={styles.productRow}>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productBrand}>{producto.marca}</Text>
                                            <Text style={styles.productName}>{producto.nombre}</Text>
                                        </View>
                                        <View style={styles.productDetails}>
                                            <Text style={styles.productQuantity}>x{producto.cantidad}</Text>
                                            <Text style={styles.productUnitPrice}>
                                                {formatPrice(producto.precioUnitario)} c/u
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    <View style={{ height: 120 }} />
                </ScrollView>
                <BottomNavReceptionist active="CartScreen" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default SalesHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    headerTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        marginRight: 24,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    sectionTitleText: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
    },
    saleCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
    },
    saleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    saleDate: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    saleTotal: {
        color: "#FFD43B",
        fontSize: 18,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: "#2A2E38",
        marginVertical: 14,
    },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    productInfo: {
        flex: 1,
    },
    productBrand: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 2,
    },
    productName: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    productDetails: {
        alignItems: "flex-end",
    },
    productQuantity: {
        color: "#9CA3AF",
        fontSize: 14,
        fontWeight: "500",
    },
    productUnitPrice: {
        color: "#6B7280",
        fontSize: 12,
    },
});