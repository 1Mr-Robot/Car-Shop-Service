import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    FlatList,
    Modal,
    ActivityIndicator,
    Alert
} from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import VehicleCard from "../components/VehicleCard";
import OrderService from "../services/OrderService"; // POR NADA DEL MUNDO TOCAR ESTE IMPORT

const Item = ({ id, title, status, onToggle }) => {
    const renderIcon = () => {
        switch (status) {
            case "Finalizado":
                return (
                    <Feather name="check-circle" size={18} color="#22C55E" />
                );
            case "En Progreso":
                return <Feather name="clock" size={18} color="#FFD43B" />;
            case "Pendiente":
                return <Feather name="x-circle" size={18} color="#EF4444" />;
            default:
                return null;
        }
    };

    const isCompleted = status === "Finalizado";

    return (
        <TouchableOpacity
            activeOpacity={isCompleted ? 1 : 0.7}
            onPress={() => !isCompleted && onToggle(id, title)}
            style={styles.serviceItem}
        >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{title}</Text>
            {renderIcon()}
        </TouchableOpacity>
    );
};

const OrderDetailsScreen = ({ navigation, route }) => {
    // 1. Extraemos los datos dinámicos, incluyendo la nueva variable 'servicesList'
    const {
        orderId,
        vehicle,
        plate,
        vehicleColor,
        vehicleVIN,
        ownerName,
        servicesList,
        mileage,
        notes,
        productsList,
    } = route.params || {}; 
    
    const insets = useSafeAreaInsets();

    // 2. Inicializamos el estado con los datos reales de la BD
    const [orderServices, setOrderServices] = useState(servicesList || []);
    const [pendingServices, setPendingServices] = useState([]);

    const [showFinishModal, setShowFinishModal] = useState(false);
    const [isFinishingMaster, setIsFinishingMaster] = useState(false);

    const [serviceToFinish, setServiceToFinish] = useState(null);
    const [isUpdatingService, setIsUpdatingService] = useState(false);
    const [showSuccessServiceModal, setShowSuccessServiceModal] = useState(false);


    // ==========================================
    // LÓGICA DE TRANSICIÓN UNIDIRECCIONAL DE SERVICIOS
    // ==========================================
    const requestServiceToggle = (serviceId, title) => {
        // Al tocar un servicio 'En Progreso', abrimos el modal de confirmación
        setServiceToFinish({ id: serviceId, title });
    };

    const confirmFinishService = async () => {
        if (!serviceToFinish) return;

        setIsUpdatingService(true); // Oculta botones, muestra loader en el modal

        try {
            // Petición al Backend con ESPERA DE CONTRATO (await)
            await OrderService.updateServiceStatus(orderId, serviceToFinish.id, "Finalizado");
            
            // Si el backend responde 200 OK, actualizamos el estado local
            setOrderServices(prev => prev.map(item => 
                item.id === serviceToFinish.id ? { ...item, status: "Finalizado" } : item
            ));

            setIsUpdatingService(false);
            setServiceToFinish(null); // Cerramos modal de confirmación
            
            // Mostramos modal de éxito por 1.5 segundos
            setShowSuccessServiceModal(true);
            setTimeout(() => {
                setShowSuccessServiceModal(false);
            }, 1500);

        } catch (error) {
            console.error("Error al actualizar estatus:", error);
            setIsUpdatingService(false);
            setServiceToFinish(null);
            Alert.alert("Error", "No se pudo actualizar el servicio. Verifica tu conexión.");
        }
    };

    // ==========================================
    // LÓGICA "FINALIZAR ORDEN"
    // ==========================================
    const handleFinishMasterOrder = async () => {
        const allFinalized = orderServices.every(s => s.status === "Finalizado");
        if (allFinalized) {
            setIsFinishingMaster(true);
            try {
                await OrderService.finalizeOrder(orderId);
                navigation.navigate("PastRepairs"); 
            } catch (error) {
                console.error("Error al finalizar orden:", error);
                Alert.alert("Error", "No se pudo finalizar la orden maestra.");
                setIsFinishingMaster(false);
            }
        } else {
            const pending = orderServices.filter(s => s.status !== "Finalizado").map(s => s.title);
            setPendingServices(pending);
            setShowFinishModal(true);
        }
    };

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View
                    style={{ height: insets.top, backgroundColor: "#0F1115" }}
                />
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + 20,
                    }}
                >
                    <View
                        style={styles.navHeader}
                    >
                        <Pressable
                            onPress={() => navigation.goBack()}
                            hitSlop={12}
                            style={{ padding: 1 }}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color={"#ffff"}
                            />
                        </Pressable>
                        <Text
                            style={styles.navTitle}
                        >
                            Orden #{orderId || "---"}
                        </Text>
                    </View>
                    
                    <VehicleCard
                        status="active"
                        vehicleYear={vehicle ? vehicle.split(" ")[0] : ""}
                        vehicleBrand={vehicle ? vehicle.split(" ")[1] : ""}
                        vehicleModel={vehicle ? vehicle.split(" ").slice(2).join(" ") : ""}
                        owner={ownerName || "Cliente"} 
                        color={vehicleColor || "No especificado"}
                        plate={plate || "---"}
                        mileage={mileage || "---"}
                        vin={vehicleVIN || "No registrado"}
                    />

                    <View style={[styles.card]}>
                        <Text style={styles.carTitle}>Servicios</Text>
                        <FlatList
                            scrollEnabled={false}
                            data={orderServices} 
                            keyExtractor={(item) => item.id.toString()} // Aseguramos que el ID sea string
                            renderItem={({ item }) => (
                                <Item 
                                    id={item.id}
                                    title={item.title}
                                    status={item.status}
                                    onToggle={requestServiceToggle}
                                />
                            )}
                            ListEmptyComponent={
                                <Text style={{color: "#888", marginTop: 10}}>No hay servicios registrados.</Text>
                            }
                        />
                    </View>

                    <View style={[styles.card, { borderWidth: 1 }]}>
                        <View style={styles.notesHeader}>
                            <Ionicons
                                name="document-text-outline"
                                size={14}
                                color="#FFD43B"
                            />
                            <Text style={styles.notesSectionTitle}>
                                Notas del cliente
                            </Text>
                        </View>
                        <Text
                            style={[
                                { fontSize: 15 },
                                { marginTop: 1 },
                                { color: "#969494ff" },
                            ]}
                        >
                            {notes || "Sin notas adicionales."}
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>
                        PRODUCTOS UTILIZADOS
                    </Text>

                    {(!productsList || productsList.length === 0) ? (
                        <Text style={styles.noProductsText}>
                            Aún no se han utilizado productos en esta orden
                        </Text>
                    ) : (
                        productsList.map((product, index) => (
                            <View key={`${product.id}-${index}`} style={styles.productCard}>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productBrand}>
                                        {product.brand}
                                    </Text>
                                    <Text style={styles.productName}>
                                        {product.name}
                                    </Text>
                                </View>
                                <View style={styles.productQuantity}>
                                    <Text style={styles.quantityLabel}>Cant.</Text>
                                    <Text style={styles.quantityValue}>
                                        {product.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}



                    {/* MODAL MAESTRO: SERVICIOS PENDIENTE */}
                    <Modal
                        visible={showFinishModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowFinishModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Servicios Pendientes</Text>
                                <Text style={styles.modalText}>
                                    Antes de finalizar, marca los siguientes servicios como completados:
                                </Text>
                                {pendingServices.map((service, index) => (
                                    <View key={index} style={styles.pendingItem}>
                                        <Feather name="circle" size={12} color="#FFD43B" />
                                        <Text style={styles.pendingText}>{service}</Text>
                                    </View>
                                ))}
                                <TouchableOpacity
                                    style={styles.modalAcceptButton}
                                    onPress={() => setShowFinishModal(false)}
                                >
                                    <Text style={styles.modalAcceptText}>Entendido</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* MODAL 1 (SERVICIO): CONFIRMAR Y CARGAR */}
                    <Modal visible={!!serviceToFinish} transparent={true} animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                {isUpdatingService ? (
                                    <View style={{ alignItems: "center", paddingVertical: 20 }}>
                                        <ActivityIndicator size="large" color="#FFD43B" style={{ marginBottom: 15 }} />
                                        <Text style={styles.modalTitle}>Actualizando...</Text>
                                    </View>
                                ) : (
                                    <>
                                        <Text style={styles.modalTitle}>¿Deseas finalizar el servicio?</Text>
                                        <Text style={styles.modalText}>
                                            Estás a punto de marcar como finalizado:{"\n"}
                                            <Text style={{ fontWeight: "bold", color: "#fff" }}>{serviceToFinish?.title}</Text>
                                        </Text>
                                        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                                            <TouchableOpacity style={[styles.modalAcceptButton, { flex: 1, backgroundColor: "#333" }]} onPress={() => setServiceToFinish(null)}>
                                                <Text style={[styles.modalAcceptText, { color: "#fff" }]}>Regresar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.modalAcceptButton, { flex: 1 }]} onPress={confirmFinishService}>
                                                <Text style={styles.modalAcceptText}>Sí, Finalizar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>

                    {/* MODAL 2 (SERVICIO): ÉXITO */}
                    <Modal visible={showSuccessServiceModal} transparent={true} animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={[styles.modalContent, { alignItems: "center", paddingVertical: 30 }]}>
                                <Feather name="check-circle" size={60} color="#22C55E" style={{ marginBottom: 15 }} />
                                <Text style={styles.modalTitle}>Servicio Finalizado</Text>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
                    <View
                        style={{
                            marginBottom: 25
                        }}
                    >
                        <View
                            style={{
                                borderBottomColor: '#a8a8a86b',
                                borderBottomWidth: 1,
                            }}
                        >
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                gap: 15,
                            }}
                        >
                            <TouchableOpacity
                                style={[styles.productButton, styles.half]}
                                onPress={() =>
                                    navigation.navigate("AddProduct", {
                                        orderId: orderId,
                                    })
                                }
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Agregar Producto
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.serviceButton, styles.half]}
                                onPress={() =>
                                    navigation.navigate("AddService", {
                                        orderId: orderId,
                                    })
                                }
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Agregar Servicio
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={[styles.primaryButton, isFinishingMaster && { opacity: 0.7 }]} 
                            onPress={handleFinishMasterOrder}
                            disabled={isFinishingMaster}
                        >
                            {isFinishingMaster ? <ActivityIndicator color="black" /> : <Text style={styles.primaryButtonText}>Finalizar</Text>}
                        </TouchableOpacity>
                    </View>                  
            </View>
        </SafeAreaProvider>
    );
};

export default OrderDetailsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    navHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        backgroundColor: "#0F1115", 
        marginBottom: 10 
    },
    navTitle: { 
        color: "#ffff", 
        fontSize: 24, 
        fontWeight: "bold", 
        marginLeft: 20 
    },
    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    carTitle: { 
        color: "#fff", 
        fontSize: 20, 
        fontWeight: "600" 
    },
    serviceItem: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        marginTop: 15, 
        paddingVertical: 5 
    },
    notesHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 6, 
        gap: 6 
    },
    notesSectionTitle: { 
        color: "#FFD43B", 
        fontSize: 12, 
        fontWeight: "600" 
    },
    primaryButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    primaryButtonText: {
        color: "#000",
        fontWeight: "700",
    },
    secondaryButtonText: {
        color: "#ffff",
        fontWeight: "700",
    },
    half: {
        flex: 1,
    },
    productButton: {
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 15,
        borderColor: "#FACC15",
        borderWidth: 1.5,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    serviceButton: {
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 15,
        borderColor: "#FACC15",
        borderWidth: 1.5,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        padding: 24,
        width: "85%",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    modalText: {
        color: "#888",
        fontSize: 14,
        marginBottom: 16,
    },
    pendingItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    pendingText: {
        color: "#fff",
        fontSize: 14,
    },
    modalAcceptButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 16,
    },
    modalAcceptText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
    },
    sectionTitle: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 10,
    },
    noProductsText: {
        color: "#888",
        fontSize: 15,
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 20,
    },
    productCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
    },
    productBrand: {
        color: "#FFD43B",
        fontSize: 14,
        fontWeight: "600",
    },
    productName: {
        color: "#fff",
        fontSize: 16,
        marginTop: 4,
    },
    productQuantity: {
        alignItems: "center",
        backgroundColor: "#2A2D35",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    quantityLabel: {
        color: "#8B90A0",
        fontSize: 10,
    },
    quantityValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});