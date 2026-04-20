import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavReceptionist from "../components/BottomNavReceptionist";

const PurchaseMerchScreen = ({ navigation }) => {
    const [products, setProducts] = useState([
        {
            id: "1",
            brand: "Mobil 1",
            name: "Aceite Sintético 5W-30",
            sku: "MO-5W30-4L",
            price: 1250,
            quantity: 0,
            image: null,
        },
        {
            id: "2",
            brand: "Toyota Genuine",
            name: "Filtro de Aceite",
            sku: "TG-OF-001",
            price: 350,
            quantity: 0,
            image: null,
        },
        {
            id: "3",
            brand: "Bosch",
            name: "Filtro de Aire",
            sku: "BS-AF-045",
            price: 480,
            quantity: 0,
            image: null,
        },
    ]);

    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showEmptyCartModal, setShowEmptyCartModal] = useState(false);

    const updateQuantity = (id, delta) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return { ...item, quantity: newQty >= 0 ? newQty : 0 };
                }
                return item;
            })
        );
    };

    const resetItem = (id) => {
        setProducts((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return { ...item, quantity: 0 };
                }
                return item;
            })
        );
    };

    const resetAll = () => {
        setProducts((prev) =>
            prev.map((item) => ({ ...item, quantity: 0 }))
        );
    };

    const subtotal = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const total = subtotal;

    const formatPrice = (price) => {
        return `$${price.toLocaleString("es-MX")}`;
    };

    const hasProducts = products.some((item) => item.quantity > 0);

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Nueva venta</Text>
                    </View>

                    {/* Products List */}
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>
                            PRODUCTOS ({products.length})
                        </Text>
                    </View>
                    <>
                        {products.map((item) => (
                            <View key={item.id} style={styles.cartItem}>
                                <View style={styles.itemImageContainer}>
                                    <MaterialCommunityIcons
                                        name="wrench"
                                        size={40}
                                        color="#FFD43B"
                                    />
                                </View>

                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemBrand}>
                                        {item.brand}
                                    </Text>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemSku}>{item.sku}</Text>
                                    <Text style={styles.itemPrice}>
                                        {formatPrice(item.price)} c/u
                                    </Text>
                                </View>

                                <View style={styles.itemActions}>
                                    <View style={styles.quantityControl}>
                                        <TouchableOpacity
                                            style={styles.qtyButton}
                                            onPress={() => updateQuantity(item.id, -1)}
                                        >
                                            <Feather
                                                name="minus"
                                                size={18}
                                                color="white"
                                            />
                                        </TouchableOpacity>

                                        <Text style={styles.qtyText}>
                                            {item.quantity}
                                        </Text>

                                        <TouchableOpacity
                                            style={styles.qtyButton}
                                            onPress={() => updateQuantity(item.id, 1)}
                                        >
                                            <Feather
                                                name="plus"
                                                size={18}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => resetItem(item.id)}
                                    >
                                        <Feather
                                            name="trash-2"
                                            size={18}
                                            color="#FF4D4D"
                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.itemTotal}>
                                        {formatPrice(item.price * item.quantity)}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* Summary Card */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryTitle}>
                                RESUMEN DE VENTA
                            </Text>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>
                                    Subtotal ({products.length} productos)
                                </Text>
                                <Text style={styles.summaryValue}>
                                    {formatPrice(subtotal)}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.summaryRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>
                                    {formatPrice(total)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={() => hasProducts ? setShowCheckoutModal(true) : setShowEmptyCartModal(true)}
                            >
                                <Text style={styles.checkoutButtonText}>
                                    Completar Venta
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={() => resetAll()}
                            >
                                <Text style={styles.clearButtonText}>
                                    Reiniciar Todo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>

                    <View style={{ height: 120 }} />
                </ScrollView>

                <BottomNavReceptionist active="PurchaseMerchScreen" />

                {/* Checkout Modal */}
                <Modal
                    visible={showCheckoutModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCheckoutModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={70}
                                color="#FFD43B"
                            />
                            <Text style={styles.modalTitle}>
                                Venta Completada
                            </Text>
                            <Text style={styles.modalText}>
                                La venta se ha registrado correctamente por un total
                                de {formatPrice(total)}
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalAcceptButton}
                                    onPress={() => {
                                        setShowCheckoutModal(false);
                                        resetAll();
                                        navigation.navigate("HomeReceptionist");
                                    }}
                                >
                                    <Text style={styles.modalAcceptText}>
                                        Aceptar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Empty Cart Modal */}
                <Modal
                    visible={showEmptyCartModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowEmptyCartModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <MaterialCommunityIcons
                                name="cart-off"
                                size={70}
                                color="#FF4D4D"
                            />
                            <Text style={styles.modalTitle}>
                                Carrito Vacío
                            </Text>
                            <Text style={styles.modalText}>
                                No hay productos en el carrito.{"\n"}Agrega productos para completar una venta.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalAcceptButton}
                                    onPress={() => setShowEmptyCartModal(false)}
                                >
                                    <Text style={styles.modalAcceptText}>
                                        Aceptar
                                    </Text>
                                </TouchableOpacity>
                            </View>
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
    },
});
