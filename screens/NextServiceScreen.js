import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert
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
    const [isStarting, setIsStarting] = useState(false);

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

        setIsStarting(true);
        try {
            // Tomamos el ID del primer servicio de la lista (Nivel 3 en nuestra BD)
            const firstServiceId = servicesList[0].id;
            
            // Usamos nuestro endpoint PATCH protegido por RBAC
            await OrderService.updateServiceStatus(orderId, firstServiceId, 'En Progreso');
            
            // Redirigimos al Home. El listener "focus" recargará el backend 
            // y la orden se mostrará mágicamente como Activa.
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error al iniciar la orden:", error);
            Alert.alert("Error", "No se pudo iniciar la orden. Verifica tu conexión.");
        } finally {
            setIsStarting(false);
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
                        paddingBottom: insets.bottom + 20,
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
                        style={[styles.primaryButton, isStarting && { opacity: 0.7 }]}
                        onPress={handleStartOrder}
                        disabled={isStarting}
                    >
                        {isStarting ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <>
                                <Text style={styles.primaryButtonText}>Comenzar</Text>
                                <Feather name="arrow-right" size={20} color="black" />
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
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
});
