import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    Modal
} from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Service from "../components/Service";
import VehicleCard from "../components/VehicleCard";

// servicio para la logica del botón: "Comenzar"
import OrderService from "../services/OrderService"
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

const NextServiceScreen = ({ navigation, route }) => {
    // 1. Recibo de parametros de OrderCard
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
        time,
    } = route.params || {};

    const insets = useSafeAreaInsets();
    const [showActiveOrderModal,  setShowActiveOrderModal] = useState(false);
    const [isStartingLoading, setIsStartingLoading] = useState(false);
    // 2. Extraemos Fecha y Hora de la variable 'time' del backend
    let scheduledDate = "---";
    let scheduledTime = "---";

    if (time) {
        const parts = time.split(", ");
        if (parts.length === 2) {
            scheduledDate = parts[0];
            scheduledTime = parts[1];
        } else {
            scheduledDate = time;
        }
    }

    // ==========================================
    // LÓGICA DEL BOTÓN "COMENZAR"
    // ==========================================
    const handleStartOrder = async () => {
        if (!servicesList || servicesList.length === 0) {
            Alert.alert("Error", "No hay servicios asociados a esta orden.");
            return;
        }

        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert("Error", "No se pudo verificar la sesión.");
            return;
            }
        
        try {
            // 1. REGLA DE NEGOCIO: Comprobar si hay una orden activa existente
            const currentActiveOrder = await OrderService.getActiveOrder(uid);
                if (currentActiveOrder) {
                    setShowActiveOrderModal(true);
                    return;
            }

            // 2. Si no hay orden activa, mostramos el modal de carga e iniciamos la petición
            setIsStartingLoading(true);
            await OrderService.startAllServices(orderId);
            // 3. Ocultamos el modal y navegamos al Home. El estado ya está garantizado en la BD.
            setIsStartingLoading(false);
            navigation.navigate("Home");
            
        } 

        catch (error) {
            setIsStartingLoading(false);
            console.error("Error al iniciar la orden:", error);
            Alert.alert("Error", "No se pudo iniciar la orden. Verifica tu conexión.");
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: insets.bottom + 20
                    }}
                >
                    {/* FIX 1: Header restaurado a su estructura visual en línea (idéntico a LastServiceScreen) */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            backgroundColor: "#0F1115",
                            marginBottom: 10
                        }}
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
                        status="upcoming"
                        vehicleYear={vehicle ? vehicle.split(" ")[0] : ""}
                        vehicleBrand={vehicle ? vehicle.split(" ")[1] : ""}
                        vehicleModel={vehicle ? vehicle.split(" ").slice(2).join(" ") : ""}
                        owner={ownerName || "Cliente"}
                        color={vehicleColor || "No especificado"}
                        plate={plate || "---"}
                        mileage={mileage || "---"}
                        vin={vehicleVIN || "No registrado"}
                    />

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Servicios</Text>
                        {servicesList &&
                            servicesList.map((item, index) => (
                                <Service
                                    key={item.id || index}
                                    title={item.title}
                                    status={item.status}
                                />
                            ))}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Datos del Servicio</Text>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Fecha Programada
                            </Text>
                            <Text style={styles.dataValue}>
                                {scheduledDate}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Hora Programada
                            </Text>
                            <Text style={styles.dataValue}>
                                {scheduledTime}
                            </Text>
                        </View>
                    </View>

                    {notes && notes.length > 0 && (
                        <View style={[styles.card, { borderWidth: 1 }]}>
                            <View style={styles.notesHeader}>
                                <Feather
                                    name="file-text"
                                    size={14}
                                    color="#FFD43B"
                                />
                                <Text style={styles.notesSectionTitle}>
                                    Notas del cliente
                                </Text>
                            </View>
                            <Text style={styles.notesText}>{notes}</Text>
                        </View>
                    )}

                    {/* FIX 2: Botón Comenzar con Lógica y Loader */}
                    <TouchableOpacity 
                        style={styles.primaryButton}
                        onPress={handleStartOrder}
                    >
                        <Text style={styles.primaryButtonText}>Comenzar</Text>
                        <Feather name="arrow-right" size={20} color="black" />
                    </TouchableOpacity>
                </ScrollView>
                {/* MODAL DE BLOQUEO DE ORDEN ACTIVA */}
                <Modal
                    visible={showActiveOrderModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowActiveOrderModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Feather name="alert-circle" size={50} color="#FF4D4D" style={{ marginBottom: 15 }} />
                            <Text style={styles.modalTitle}>Acción Bloqueada</Text>
                            <Text style={styles.modalText}>
                                No fue posible comenzar la orden. Ya tienes una orden en progreso existente. 
                                Finalízala antes de comenzar una nueva.
                            </Text>
                            <TouchableOpacity
                                style={[styles.primaryButton, { width: "100%", marginTop: 10 }]}
                                onPress={() => setShowActiveOrderModal(false)}
                            >
                                <Text style={styles.primaryButtonText}>Entendido</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* MODAL 2: CARGANDO NUEVA ORDEN (ESPERA DE CONTRATO) */}
                <Modal visible={isStartingLoading} transparent={true} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { paddingVertical: 40 }]}>
                            <ActivityIndicator size="large" color="#FFD43B" style={{ marginBottom: 20 }} />
                            <Text style={styles.modalTitle}>Iniciando Orden...</Text>
                            <Text style={styles.modalText}>Sincronizando servicios con el taller.</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaProvider>
    );
};

export default NextServiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    dataRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    dataLabel: {
        color: "#8B90A0",
        fontSize: 14,
    },
    dataValue: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
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
    notesText: {
        color: "#888",
        fontSize: 15,
        lineHeight: 22,
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
        fontSize: 17,
    },
    modalOverlay: { 
        flex: 1, 
        backgroundColor: "rgba(0, 0, 0, 0.7)", 
        justifyContent: "center", 
        alignItems: "center" 
    },
    modalContent: { 
        backgroundColor: "#1A1D23", 
        borderRadius: 20, 
        padding: 24, 
        width: "85%", 
        alignItems: "center" 
    },
    modalTitle: { 
        color: "#fff", 
        fontSize: 20, 
        fontWeight: "bold", 
        marginBottom: 12 
    },
    modalText: { 
        color: "#888", 
        fontSize: 14, 
        textAlign: "center", 
        marginBottom: 20, 
        lineHeight: 20 
    },
});