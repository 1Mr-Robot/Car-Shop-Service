import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavReceptionist from "../components/BottomNavReceptionist";
import SalesService from "../services/SalesService";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

const SalesHistoryScreen = ({ navigation }) => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSales = async () => {
        try {
            setIsLoading(true);
            const salesData = await SalesService.getAllSales();
            setSales(salesData);
        } catch (error) {
            console.error("Error al cargar ventas:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchSales();
            }
        });

        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchSales();
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFocus();
        };
    }, [navigation]);

    const formatPrice = (price) => `$${Number(price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

    if (isLoading && sales.length === 0) {
        return (
            <SafeAreaProvider>
                <StatusBar style="light" />
                <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Historial de ventas</Text>
                    </View>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFD43B" />
                        <Text style={styles.loadingText}>Cargando ventas...</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

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
                        <Text style={styles.sectionTitleText}>REGISTRO DE VENTAS ({sales.length})</Text>
                    </View>

                    {sales.map((sale) => {
                        const totalVenta = Number(sale.total);
                        return (
                            <View key={sale.id} style={styles.saleCard}>
                                <View style={styles.saleHeader}>
                                    <Text style={styles.saleDate}>{sale.fecha}</Text>
                                    <Text style={styles.saleTotal}>{formatPrice(totalVenta)}</Text>
                                </View>
                                
                                <View style={styles.vendedorRow}>
                                    <Text style={styles.vendedorLabel}>Vendedor: </Text>
                                    <Text style={styles.vendedorNombre}>
                                        {sale.usuario_nombre} {sale.usuario_apellido}
                                    </Text>
                                </View>
                                
                                <View style={styles.divider} />
                                
                                {sale.productos.map((producto, index) => (
                                    <View key={index} style={styles.productRow}>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productBrand}>{producto.producto_marca}</Text>
                                            <Text style={styles.productName}>{producto.producto_nombre}</Text>
                                        </View>
                                        <View style={styles.productDetails}>
                                            <Text style={styles.productQuantity}>x{producto.cantidad}</Text>
                                            <Text style={styles.productUnitPrice}>
                                                {formatPrice(producto.precio_unitario)} c/u
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}

                    <View style={{ height: 120 }} />
                </ScrollView>
                <View style={styles.bottom}>
                    <BottomNavReceptionist active="CartScreen" />
                </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#888",
        marginTop: 15,
    },
    vendedorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    vendedorLabel: {
        color: "#6B7280",
        fontSize: 12,
    },
    vendedorNombre: {
        color: "#9CA3AF",
        fontSize: 12,
        fontWeight: "600",
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
});