import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Service from "../components/Service";
import VehicleCard from "../components/VehicleCard";

const NextServiceScreen = ({ navigation, route }) => {
    const {
        orderId,
        vehicle,
        plate,
        vehicleColor,
        vehicleVIN,
        ownerName,
        service,
        mileage,
        notes,
        servicesList,
        scheduledDate,
        scheduledTime,
    } = route.params || {};
    const insets = useSafeAreaInsets();

    const displayScheduledDate = scheduledDate || "---";
    const displayScheduledTime = scheduledTime || "---";

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
                        vehicleModel={
                            vehicle ? vehicle.split(" ").slice(2).join(" ") : ""
                        }
                        owner={ownerName || "Cliente"}
                        color={vehicleColor || "Blanco Perlado"}
                        plate={plate || "ABC-1234"}
                        mileage={mileage || "50,000 km"}
                        vin={vehicleVIN || "1HGBH456789012345"}
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
                                {displayScheduledDate}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Hora Programada
                            </Text>
                            <Text style={styles.dataValue}>
                                {displayScheduledTime}
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

                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Comenzar</Text>
                        <Feather name="arrow-right" size={20} color="black" />
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
