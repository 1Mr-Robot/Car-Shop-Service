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

const NextServiceScreen = ({ navigation, route }) => {
    const { vehicle, plate, service, mileage, notes } = route.params || {};

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
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.carTitle}>
                                {vehicle || "Toyota Corolla 2022"}
                            </Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>PROGRAMADO</Text>
                            </View>
                        </View>

                        <Text style={styles.subText}>Dueño: Juan Pérez</Text>

                        <View style={[styles.row, { marginTop: 20 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>COLOR</Text>
                                <Text style={styles.value}>Blanco Perlado</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>PLACA</Text>
                                <Text style={styles.value}>
                                    {plate || "ABC-1234"}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.label, { marginTop: 15 }]}>
                            NIV / VIN
                        </Text>
                        <Text style={styles.value}>1HGBH456789012345</Text>
                    </View>

                    {/* Service Details */}
                    <Text style={styles.sectionTitle}>
                        DETALLES DEL SERVICIO
                    </Text>

                    <View style={styles.serviceCard}>
                        <View style={styles.row}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="wrench"
                                    size={24}
                                    color="black"
                                />
                            </View>

                            <View>
                                <Text style={styles.serviceName}>
                                    {service || "Servicio de mantenimiento"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <DetailRow
                            icon="speedometer"
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
                                        size={16}
                                        color="#FFD43B"
                                    />
                                    <Text style={styles.notesText}>
                                        {notes}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Check-in Button */}
                        <TouchableOpacity style={styles.checkInContainer}>
                            <Feather
                                name="arrow-right"
                                size={20}
                                color="#FFD43B"
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <BottomNav active="NextService" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <View style={styles.row}>
            <Feather name={icon} size={18} color="#9CA3AF" />
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
        padding: 18,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
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
        fontSize: 16,
        fontWeight: "600",
    },

    subText: {
        color: "#8B90A0",
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

    label: {
        color: "#8B90A0",
        fontSize: 12,
    },

    value: {
        color: "white",
        fontSize: 14,
        marginTop: 3,
    },

    sectionTitle: {
        color: "#8B90A0",
        fontSize: 13,
        marginBottom: 10,
    },

    serviceCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#FFD43B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    serviceName: {
        color: "white",
        fontWeight: "600",
    },

    serviceDesc: {
        color: "#8B90A0",
        fontSize: 12,
    },

    separator: {
        height: 1,
        backgroundColor: "#2A2E38",
        marginVertical: 15,
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    detailLabel: {
        color: "#8B90A0",
        marginLeft: 6,
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
        fontSize: 13,
        fontWeight: "600",
    },

    notesCheckInRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },

    notesSectionTitle: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 8,
    },

    notesCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 15,
        padding: 16,
        flex: 1,
    },

    notesRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },

    notesText: {
        color: "#888",
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },

    checkInContainer: {
        width: 70,
        height: 70,
        backgroundColor: "#1A1D24",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFD43B",
    },
});
