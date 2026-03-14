import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    FlatList,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native"; //NAVEGACION
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

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onToggle(id)}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 15,
                paddingVertical: 5,
            }}
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
        ownerName,
        service,
        servicesList, // <-- ¡Aquí vienen los servicios reales de la base de datos!
        mileage,
        notes,
    } = route.params || {}; 
    
    const insets = useSafeAreaInsets();

    // 2. Inicializamos el estado con los datos reales de la BD
    const [orderServices, setOrderServices] = useState(servicesList || []);

    // 3. Lógica de cambio de estatus (UI y preparación para Backend)
    const toggleServiceStatus = async (serviceId) => {
        // Encontramos el servicio actual
        const servicioActual = orderServices.find(s => s.id === serviceId);
        if (!servicioActual) return;

        let nextStatus;
        if (servicioActual.status === "Pendiente") nextStatus = "En Progreso";
        else if (servicioActual.status === "En Progreso") nextStatus = "Finalizado";
        else nextStatus = "Pendiente";

        // Actualización "Optimista": Cambiamos la UI al instante para que sea veloz
        setOrderServices((prevServices) =>
            prevServices.map((item) =>
                item.id === serviceId ? { ...item, status: nextStatus } : item
            )
        );

        /* * ==========================================
         * CONEXIÓN RESTful (PATCH) - APARCADA
         * ==========================================
         * Descomenta el siguiente bloque cuando estés listo 
         * para que los cambios se guarden en PostgreSQL.
         */
        /*
        try {
            await OrderService.updateServiceStatus(orderId, serviceId, nextStatus);
        } catch (error) {
            console.error("Error al actualizar estatus:", error);
            alert("No se pudo guardar el cambio en la base de datos.");
            // Si falla en el backend, podríamos revertir la UI aquí
        }
        */
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
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            backgroundColor: "#0F1115",
                        }}
                    >
                        <Pressable
                            onPress={() => navigation.navigate("Orders")}
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
                            style={{
                                color: "#ffff",
                                fontSize: 24,
                                fontWeight: "bold",
                                marginLeft: 20,
                            }}
                        >
                            Orden #{orderId || "---"}
                        </Text>
                    </View>
                    
                    <VehicleCard
                        status="active"
                        vehicleYear={vehicle ? vehicle.split(" ")[0] : ""}
                        vehicleBrand={vehicle ? vehicle.split(" ")[1] : ""}
                        vehicleModel={
                            vehicle ? vehicle.split(" ").slice(2).join(" ") : ""
                        }
                        owner={ownerName || "Cliente sin nombre"} 
                        color={vehicleColor || "Sin color"}
                        plate={plate || "ABC-1234"}
                        mileage={mileage}
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
                                    onToggle={toggleServiceStatus}
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
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 15,
                            marginTop: -15,
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

                    <TouchableOpacity style={[styles.primaryButton]}>
                        <Text style={styles.primaryButtonText}>Finalizar</Text>
                    </TouchableOpacity>
                </ScrollView>
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
    sectionLabel: {
        color: "#8B90A0",
        fontSize: 13,
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10,
    },
    label: {
        color: "#8B90A0",
        fontSize: 12,
    },
    value: {
        color: "white",
        fontSize: 14,
        marginTop: 3,
    },
    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    carTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    subText: {
        color: "#8B90A0",
        fontSize: 13,
        marginTop: 4,
    },
    badge: {
        backgroundColor: "rgba(255,212,59,0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
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
    assignmentCard: {
        backgroundColor: "#14161C",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1F222B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    smallButton: {
        backgroundColor: "#FFD43B",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    notesHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 6,
    },
    notesSectionTitle: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
    },
    smallButtonText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 12,
    },
    taskCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    iconCircleDark: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#14161C",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    completedCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#2ECC71",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    timeText: {
        color: "#8B90A0",
        fontSize: 11,
        marginBottom: 6,
        textAlign: "right",
    },
    statusBadge: {
        borderWidth: 1,
        borderColor: "#FFD43B",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusText: {
        color: "#FFD43B",
        fontSize: 10,
    },
    price: {
        color: "#FFD43B",
        fontWeight: "700",
        fontSize: 16,
    },
    priorityBadge: {
        backgroundColor: "#402225",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    priorityText: {
        color: "#FF4D4F",
        fontSize: 11,
    },
    fab: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#FFD43B",
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
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
});
