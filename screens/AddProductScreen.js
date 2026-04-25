import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Modal, 
    ActivityIndicator, 
    Alert
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import CatalogService from "../services/CatalogService";
import OrderService from "../services/OrderService";

const AddProductScreen = ({ navigation, route }) => {
    const { orderId } = route.params || {};
    const insets = useSafeAreaInsets();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Carga de productos reales del catálogo
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setIsLoading(true);
                const data = await CatalogService.getProducts({ conStock: true, limit: 50 });
                
                // Mapeamos los datos de la DB al formato de la UI interactiva
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

    // 2. Controladores de Cantidad con Validación de Stock
    const updateQuantity = (id, delta) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    if (newQty > item.stock) {
                        Alert.alert("Límite de Stock", `Solo quedan ${item.stock} unidades disponibles de este producto.`);
                        return item;
                    }
                    return { ...item, quantity: newQty >= 0 ? newQty : 0 };
                }
                return item;
            })
        );
    };

    // 3. Cálculos Financieros
    const totalToAdd = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formatPrice = (price) => `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
    const itemsSelectedCount = products.filter(p => p.quantity > 0).length;

    // 4. Lógica de Mutación (POST a la Orden)
    const handleAddProductsToOrder = async () => {
        const payload = products
            .filter(p => p.quantity > 0)
            .map(p => ({ id_producto: p.id, cantidad: p.quantity }));

        if (payload.length === 0) return;

        setIsSubmitting(true);
        try {
            // Mandamos el arreglo con las cantidades correctas al Backend
            await OrderService.addProductsToOrder(orderId, payload);
            
            setIsSubmitting(false);
            // TRUCO DE SINCRONIZACIÓN: Redirigir al Home dispara el fetch y actualiza todo el árbol
            navigation.navigate("Home");
        } catch (error) {
            setIsSubmitting(false);
            Alert.alert("Transacción Fallida", error.message || "Error al agregar productos a la orden.");
        }
    };

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Cargando catálogo...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <View style={styles.navHeader}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={{ padding: 1}}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={"#ffff"} />           
                    </Pressable>
                    <Text style={styles.navTitle}>Agregar Productos</Text>    
                </View>
                <View style={styles.hr} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>PRODUCTOS EN STOCK ({products.length})</Text>
                    </View>

                    {products.length === 0 ? (
                        <Text style={{ color: '#8B90A0', textAlign: 'center', marginTop: 40 }}>No hay productos con stock disponible en el taller.</Text>
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

                    {/* RESUMEN DE VENTA / ORDEN */}

                </ScrollView>
                
                <View style={styles.hr}/>
                <View style={{flexDirection: "row", gap: 25}}>
                    <View style={{flexDirection: 1, marginTop: 1}}>
                        <Text style={styles.summaryTitle}>Resumen de agregado</Text>
                        <View styles={[styles.summaryRow]}>
                            <Text style={styles.summaryLabel}>Total a sumar a la orden</Text>
                            <Text style={styles.totalValue}>{formatPrice(totalToAdd)}</Text>
                        </View>                       
                    </View>
                        <TouchableOpacity
                            style={[styles.checkoutButton, (isSubmitting || itemsSelectedCount === 0) && { opacity: 0.5 }]}
                            onPress={handleAddProductsToOrder}
                            disabled={isSubmitting || itemsSelectedCount === 0}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={styles.checkoutButtonText}>Añadir</Text>
                            )}
                        </TouchableOpacity>                   

                </View>

                {/* MODAL DE TRANSICIÓN (CARGA) */}
                <Modal visible={isSubmitting} transparent={true} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color="#FFD43B" style={{ marginBottom: 20 }} />
                            <Text style={styles.modalTitle}>Actualizando Orden...</Text>
                            <Text style={styles.modalText}>Añadiendo productos y realizando descuento de inventario.</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AddProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    navHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 0, 
        paddingVertical: 10 
    },
    navTitle: { 
        color: "#ffff", 
        fontSize: 20, 
        fontWeight: "bold", 
        flex: 1, 
        textAlign: "center",
        marginRight: 24 
    },
    hr: {
        height: 1,
        backgroundColor: "#2A2F36",
        width: "100%",
        marginBottom: 20
    },
    sectionTitle: {
        marginBottom: 16,
    },
    sectionTitleText: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
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
        width: 60,
        height: 60,
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
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 12,
    },
    itemTotal: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    summaryCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 24,
        marginTop: 10,
        marginBottom: 0,
    },
    summaryTitle: {
        color: "#FFD43B",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
        flex: 1
    },
    summaryLabel: {
        color: "#9CA3AF",
        fontSize: 15,
    },
    totalValue: {
        color: "#FFD43B",
        fontSize: 24,
        fontWeight: "700",
    },
    checkoutButton: {
        backgroundColor: "#FFD43B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        borderRadius: 16,
        marginTop: 24,
        flex: 1
    },
    checkoutButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        padding: 30,
        width: "85%",
        alignItems: "center",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    modalText: {
        color: "#888",
        fontSize: 14,
        textAlign: "center",
    },
});