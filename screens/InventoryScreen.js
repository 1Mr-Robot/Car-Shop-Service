import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Pressable,
    ActivityIndicator,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import BottomNavReceptionist from "../components/BottomNavReceptionist";
import { StatusBar } from "expo-status-bar";
import AdminService from "../services/AdminService";

const InventoryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStock, setNewStock] = useState("");
    const [userName, setUserName] = useState("Usuario");

    useEffect(() => {
        loadData();
        const unsubscribe = navigation.addListener("focus", () => {
            loadData();
        });
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        try {
            setIsLoadingData(true);
            const productsData = await AdminService.getProductos();
            const currentUser = await AdminService.getCurrentUser();
            setProducts(productsData);
            if (currentUser) {
                setUserName(`${currentUser.nombre} ${currentUser.apellido_paterno}`);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
            Alert.alert("Error", "No se pudieron cargar los productos.");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setNewStock(product.cantidad_stock?.toString() || "0");
        setShowProductModal(true);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        
        const stock = parseInt(newStock);
        if (isNaN(stock) || stock < 0) {
            Alert.alert("Error", "Ingresa una cantidad válida.");
            return;
        }

        setIsUpdating(true);
        try {
            await AdminService.updateStock(selectedProduct.id, stock);
            await loadData();
            setShowProductModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error actualizando stock:", error);
            Alert.alert("Error", "No se pudo actualizar el stock.");
        } finally {
            setIsUpdating(false);
        }
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.productItem}
            onPress={() => handleSelectProduct(item)}
        >
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.productDetails}>{item.marca} | SKU: {item.sku}</Text>
                <Text style={styles.productPrices}>
                    Compra: ${item.precio_compra} | Venta: ${item.precio_venta}
                </Text>
            </View>
            <View style={styles.stockBadge}>
                <Text style={styles.stockText}>{item.cantidad_stock}</Text>
                <Text style={styles.stockLabel}>en stock</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoadingData) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Cargando inventario...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={[styles.container, { paddingBottom: 160 }]} edges={["top", "bottom"]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Inventario</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{products.length}</Text>
                        <Text style={styles.statLabel}>Productos</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {products.reduce((sum, p) => sum + (p.cantidad_stock || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Piezas</Text>
                    </View>
                </View>

                <FlatList
                    data={products}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderProductItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay productos en el inventario.</Text>
                        </View>
                    }
                />

                <Modal visible={showProductModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Actualizar Stock</Text>
                                <Pressable onPress={() => setShowProductModal(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            {selectedProduct && (
                                <View style={styles.modalBody}>
                                    <Text style={styles.modalProductName}>{selectedProduct.nombre}</Text>
                                    <Text style={styles.modalProductDetails}>
                                        {selectedProduct.marca} | SKU: {selectedProduct.sku}
                                    </Text>
                                    <Text style={styles.modalProductDetails}>
                                        Precio de compra: ${selectedProduct.precio_compra}
                                    </Text>
                                    <Text style={styles.modalProductDetails}>
                                        Precio de venta: ${selectedProduct.precio_venta}
                                    </Text>
                                    <Text style={[styles.modalProductDetails, { marginBottom: 20 }]}>
                                        Stock actual: {selectedProduct.cantidad_stock}
                                    </Text>

                                    <Text style={styles.label}>Nueva cantidad en stock <Text style={styles.required}>*</Text></Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={newStock}
                                            onChangeText={setNewStock}
                                            placeholder="Ingresa la cantidad"
                                            placeholderTextColor="#555"
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <TouchableOpacity 
                                        style={[styles.submitButton, isUpdating && styles.submitButtonDisabled]}
                                        onPress={handleUpdateStock}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <ActivityIndicator color="#000" />
                                        ) : (
                                            <Text style={styles.submitButtonText}>Actualizar Stock</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowSuccessModal(false)}
                >
                    <View style={styles.successModalOverlay}>
                        <View style={styles.successModalContent}>
                            <Feather name="check-circle" size={70} color="#22C55E" />
                            <Text style={styles.successModalTitle}>Stock actualizado</Text>
                            <Text style={styles.successModalText}>
                                El stock del producto se ha actualizado correctamente.
                            </Text>
                            <TouchableOpacity 
                                style={styles.successButton}
                                onPress={() => setShowSuccessModal(false)}
                            >
                                <Text style={styles.successButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>

            <View style={styles.bottom}>
                <View style={[styles.footer, { bottom: insets.bottom || 0 }]}>
                    <TouchableOpacity 
                        style={styles.addProductButton}
                        onPress={() => navigation.navigate("CreateProduct")}
                    >
                        <Feather name="plus" size={20} color="#000" />
                        <Text style={styles.addProductButtonText}>Nuevo Producto</Text>
                    </TouchableOpacity>
                </View>
                <BottomNavReceptionist active="InventoryScreen" />
            </View>
        </SafeAreaProvider>
    );
};

export default InventoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
    },
    header: {
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1A1D23",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    statsContainer: {
        flexDirection: "row",
        paddingHorizontal: 18,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#1A1D23",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    statNumber: {
        color: "#FFD43B",
        fontSize: 24,
        fontWeight: "bold",
    },
    statLabel: {
        color: "#888",
        fontSize: 12,
    },
    listContent: {
        paddingHorizontal: 18,
        paddingBottom: 20,
    },
    productItem: {
        backgroundColor: "#1A1D23",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    productDetails: {
        color: "#888",
        fontSize: 13,
        marginTop: 4,
    },
    productPrices: {
        color: "#888",
        fontSize: 13,
        marginTop: 2,
    },
    stockBadge: {
        backgroundColor: "#22C55E",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    stockText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    stockLabel: {
        color: "#fff",
        fontSize: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#888",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 24,
        paddingBottom: 20,
        maxHeight: "60%",
        width: "90%",
        alignSelf: "center",
        marginVertical: "auto",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    modalBody: {
        padding: 20,
    },
    modalProductName: {
        color: "#FFD43B",
        fontSize: 18,
        fontWeight: "600",
    },
    modalProductDetails: {
        color: "#888",
        fontSize: 14,
        marginTop: 4,
    },
    modalScroll: {
        paddingHorizontal: 20,
        maxHeight: 300,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        color: "#888",
        fontSize: 14,
        marginBottom: 8,
    },
    required: {
        color: "#FF4D4D",
    },
    inputContainer: {
        backgroundColor: "#0F1115",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    input: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    submitButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 0,
        marginTop: 20,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 160,
    },
    footer: {
        padding: 18,
        backgroundColor: "#0F1115",
        borderTopWidth: 1,
        borderTopColor: "#1A1D23",
        height: 90,
    },
    addProductButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    addProductButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
    successModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    successModalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 24,
        padding: 30,
        alignItems: "center",
        marginHorizontal: 20,
    },
    successModalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    successModalText: {
        color: "#888",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },
    successButton: {
        backgroundColor: "#22C55E",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    successButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});