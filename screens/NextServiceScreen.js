import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import Service from "../components/Service";
import VehicleCard from "../components/VehicleCard";

const NextServiceScreen = ({ navigation, route }) => {
    const { vehicle, plate, vehicleColor, vehicleVIN, service, mileage, notes, servicesList } = route.params || {};

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top"]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Feather
                                name="arrow-left"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            Detalle de Próxima Orden
                        </Text>

                        <View style={{ width: 24 }} />
                    </View>

                    {/* Vehicle Card */}
                    <VehicleCard
                        status="upcoming"
                        vehicleYear={vehicle ? vehicle.split(' ')[0] : ''}
                        vehicleBrand={vehicle ? vehicle.split(' ')[1] : ''}
                        vehicleModel={vehicle ? vehicle.split(' ').slice(2).join(' ') : ''}
                        owner="Juan Pérez"
                        color={vehicleColor || "Blanco Perlado"}
                        plate={plate || "ABC-1234"}
                        mileage={mileage || "50,000 km"}
                        vin={vehicleVIN || "1HGBH456789012345"}
                    />

                    {/* Services Card */}
                    <Text style={styles.sectionTitle}>
                        SERVICIOS
                    </Text>

                    <View style={styles.serviceCard}>
                        {servicesList && servicesList.map((item, index) => (
                            <Service
                                key={item.id || index}
                                title={item.title}
                                status={item.status}
                            />
                        ))}
                    </View>

                    {/* Vehicle Details Card */}
                    <Text style={styles.sectionTitle}>
                        DATOS DEL VEHÍCULO
                    </Text>

                    <View style={styles.serviceCard}>
                        <DetailRow
                            icon="car"
                            label="Kilometraje"
                            value={mileage || "50,000 km"}
                        />
                        <DetailRow
                            icon="calendar"
                            label="Fecha de Inicio"
                            value="15/02/2026"
                        />
                        <DetailRow
                            icon="clock"
                            label="Hora Programada"
                            value="09:00 AM"
                        />
                    </View>

                    {/* Notes and Check-in Row */}
                    <View style={styles.notesCheckInRow}>
                        {notes && notes.length > 0 && (
                            <View style={styles.notesCard}>
                                <Text style={styles.notesSectionTitle}>
                                    NOTAS DEL CLIENTE
                                </Text>
                                <View style={styles.notesRow}>
                                    <Feather
                                        name="file-text"
                                        size={20}
                                        color="#FFD43B"
                                    />
                                    <Text style={styles.notesText}>
                                        {notes}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
                
                {/* Floating Check-in Button */}
                <View style={styles.fabWrapper}>
                    <TouchableOpacity style={styles.fabButton}>
                        <Feather name="arrow-right" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <BottomNav active="NextService" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <View style={styles.row}>
            <MaterialCommunityIcons name={icon} size={22} color="#9CA3AF" />
            <Text style={styles.detailLabel}>{label}</Text>
        </View>

        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default NextServiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
        paddingTop: 24,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    headerTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 28,
        padding: 28,
        marginBottom: 28,
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
        color: "white",
        fontWeight: "600",
    },

    subText: {
        color: "#8B90A0",
        marginTop: 6,
    },

    badge: {
        backgroundColor: "rgba(255,212,59,0.15)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
    },

    badgeText: {
        color: "#FFD43B",
        fontWeight: "600",
    },

    label: {
        color: "#8B90A0",
    },

    value: {
        color: "white",
        marginTop: 4,
    },

    sectionTitle: {
        color: "#8B90A0",
        marginBottom: 16,
    },

    serviceCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 28,
        padding: 28,
        marginBottom: 28,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#FFD43B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    serviceName: {
        color: "white",
        fontWeight: "600",
    },

    serviceDesc: {
        color: "#8B90A0",
    },

    separator: {
        height: 1,
        backgroundColor: "#2A2E38",
        marginVertical: 15,
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    detailLabel: {
        color: "#8B90A0",
        marginLeft: 8,
    },

    detailValue: {
        color: "white",
    },

    checkInContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1A1D24",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#FFD43B",
        gap: 8,
    },

    checkInText: {
        color: "#FFD43B",
        fontWeight: "600",
    },

    notesCheckInRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },

    notesSectionTitle: {
        color: "#FFD43B",
        fontWeight: "600",
        marginBottom: 6,
    },

    notesCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 24,
        padding: 24,
        flex: 1,
    },

    notesRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },

    notesText: {
        color: "#888",
        lineHeight: 22,
        flex: 1,
    },

    fabButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FFD43B",
        justifyContent: "center",
        alignItems: "center",
    },

    fabWrapper: {
        position: "absolute",
        bottom: 100,
        right: 28,
    },

    serviceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
    },

    serviceItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flex: 1,
    },

    serviceItemText: {
        color: "#fff",
        flex: 1,
    },

    serviceStatus: {
        fontWeight: "600",
    },
});
