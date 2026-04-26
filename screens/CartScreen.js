import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavReceptionist from "../components/BottomNavReceptionist";

// Servicios
import CatalogService from "../services/CatalogService";
import AdminService from "../services/AdminService";

const PurchaseMerchScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

    // 1. Carga de productos reales del catálogo
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setIsLoading(true);
                // Traemos productos que tengan stock disponible
                const data = await CatalogService.getProducts({ conStock: true, limit: 50 });
                
                // Mapeamos los datos de la DB al formato de la UI
                const formattedProducts = data.map(p => ({
                    id: p.id,
                    brand: p.marca,
                    name: p.nombre,
                    sku: p.sku,
                    price: parseFloat(p.precio_venta),
                    stock: p.cantidad_stock,
                    quantity: 0
                }));
                
                setProducts(formattedProducts);
            } catch (error) {
                console.error("Error al cargar inventario:", error);
                Alert.alert("Error", "No se pudo conectar con el catálogo de productos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const updateQuantity = (id, delta) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    // No permitir vender más de lo que hay en stock real
                    if (newQty > item.stock) {
                        Alert.alert("Límite de Stock", `Solo quedan ${item.stock} unidades de este producto.`);
                        return item;
                    }
                    return { ...item, quantity: newQty >= 0 ? newQty : 0 };
                }
                return item;
            })
        );
    };

    const resetAll = () => {
        setProducts((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
    };

    const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    const formatPrice = (price) => `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

    // 2. Lógica de envío de la venta al Backend
    const handleCheckout = async () => {
        const cartItems = products
            .filter(p => p.quantity > 0)
            .map(p => ({ id_producto: p.id, cantidad: p.quantity }));

        if (cartItems.length === 0) {
            setShowEmptyCartModal(true);
            return;
        }

        setIsSubmitting(true);
        try {
            await AdminService.createSale({ productos: cartItems });
            setShowCheckoutModal(true);
        } catch (error) {
            console.error("Error en la venta:", error);
            const msg = error.message || "No se pudo completar la venta.";
            Alert.alert("Venta Fallida", msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#FFD43B" />
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Cargando inventario...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={{ flex: 1, backgroundColor: "#0F1115" }} edges={["top", "bottom"]}>
                <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Feather name="arrow-left" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Nueva venta</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("SalesHistory")}>
                                <Feather name="clock" size={24} color="#FFD43B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sectionTitle}>
                            <Text style={styles.sectionTitleText}>PRODUCTOS EN STOCK ({products.length})</Text>
                        </View>

                        {products.length === 0 ? (
                            <Text style={{ color: '#8B90A0', textAlign: 'center', marginTop: 20 }}>No hay productos con stock disponible.</Text>
                        ) : (
                            products.map((item) => (
                                <View key={item.id} style={styles.cartItem}>
                                    <View style={styles.itemImageContainer}>
                                        <MaterialCommunityIcons name="wrench" size={35} color="#FFD43B" />
                                    </View>
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemBrand}>{item.brand}</Text>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemSku}>{item.sku}</Text>
                                        <Text style={styles.itemPrice}>{formatPrice(item.price)} c/u</Text>
                                    </View>
                                    <View style={styles.itemActions}>
                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, -1)}>
                                                <Feather name="minus" size={18} color="white" />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>{item.quantity}</Text>
                                            <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, 1)}>
                                                <Feather name="plus" size={18} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.fixedBottom}>
                        <View style={styles.topDivider} />
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>RESUMEN DE VENTA</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total a pagar</Text>
                                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.checkoutButton, isSubmitting && { opacity: 0.7 }]}
                                onPress={handleCheckout}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <ActivityIndicator color="black" /> : <Text style={styles.checkoutButtonText}>Completar Venta</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <BottomNavReceptionist active="CartScreen" />

                {/* Modal de Éxito */}
                <Modal visible={showCheckoutModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <MaterialCommunityIcons name="check-circle" size={70} color="#FFD43B" />
                            <Text style={styles.modalTitle}>Venta exitosa</Text>
                            <Text style={styles.modalText}>El stock ha sido actualizado automáticamente.</Text>
                            <TouchableOpacity
                                style={styles.modalAcceptButton}
                                onPress={() => { setShowCheckoutModal(false); resetAll(); }}
                            >
                                <Text style={styles.modalAcceptText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default PurchaseMerchScreen;

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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    headerTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    sectionTitle: {
        marginBottom: 16,
    },
    sectionTitleText: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
    },
    emptyCart: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 80,
    },
    emptyTitle: {
        color: "white",
        fontSize: 22,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8B90A0",
        fontSize: 14,
        marginBottom: 30,
    },
    addButton: {
        backgroundColor: "#FFD43B",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 14,
        gap: 8,
    },
    addButtonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "700",
    },
    cartItem: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    itemImageContainer: {
        width: 70,
        height: 70,
        backgroundColor: "#252830",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemBrand: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
    },
    itemName: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    itemSku: {
        color: "#6B7280",
        fontSize: 11,
        marginBottom: 4,
    },
    itemPrice: {
        color: "#9CA3AF",
        fontSize: 14,
    },
    itemActions: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: 70,
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#252830",
        borderRadius: 10,
        paddingHorizontal: 4,
    },
    qtyButton: {
        padding: 8,
    },
    qtyText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        paddingHorizontal: 12,
    },
    removeButton: {
        padding: 6,
    },
    itemTotal: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
    summaryCard: {
        backgroundColor: "transparent",
        borderRadius: 0,
        padding: 0,
        marginHorizontal: 0,
    },
    summaryTitle: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 16,
        textTransform: "uppercase",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    summaryLabel: {
        color: "#9CA3AF",
        fontSize: 15,
    },
    summaryValue: {
        color: "white",
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: "#2A2E38",
        marginVertical: 14,
    },
    totalLabel: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
    },
    totalValue: {
        color: "#FFD43B",
        fontSize: 22,
        fontWeight: "700",
    },
    checkoutButton: {
        backgroundColor: "#FFD43B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 16,
        alignSelf: "stretch",
    },
    checkoutButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
    },
    clearButton: {
        alignItems: "center",
        paddingVertical: 14,
        marginTop: 12,
    },
    clearButtonText: {
        color: "#FF4D4D",
        fontSize: 14,
        fontWeight: "600",
    },
    fixedBottom: {
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 80,
        backgroundColor: "#0F1115",
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    topDivider: {
        height: 1,
        backgroundColor: "#1F232B",
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1A1D24",
        borderRadius: 24,
        padding: 32,
        width: "85%",
        alignItems: "center",
    },
    modalTitle: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 10,
    },
    modalText: {
        color: "#9CA3AF",
        fontSize: 15,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButtons: {
        width: "100%",
    },
    modalAcceptButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
    },
    modalAcceptText: {
        color: "black",
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 20,
    },
});