import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import Service from "../components/Service";
import VehicleCard from "../components/VehicleCard";

const LastServiceScreen = ({ navigation, route }) => {
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
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>
                            Detalle de Orden Pasada
                        </Text>

                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color="white"
                        />
                    </View>

                    {/* Vehicle Card */}
                    <VehicleCard
                        status="completed"
                        vehicleYear={vehicle ? vehicle.split(' ')[0] : ''}
                        vehicleBrand={vehicle ? vehicle.split(' ')[1] : ''}
                        vehicleModel={vehicle ? vehicle.split(' ').slice(2).join(' ') : ''}
                        owner="Juan Pérez"
                        color={vehicleColor || "Silver"}
                        plate={plate || "ABC-1234"}
                        mileage={mileage || "45,000 km"}
                        vin={vehicleVIN || "1B3HB48M2X8D12345"}
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

                    {/* Service Data Card */}
                    <Text style={styles.sectionTitle}>
                        DATOS DEL SERVICIO
                    </Text>

                    <View style={styles.serviceCard}>
                        <TableRow
                            label="Kilometraje"
                            value={mileage || "45,000 km"}
                        />
                        <TableRow label="Fecha de Inicio" value="10/01/2026" />
                        <TableRow
                            label="Fecha de Finalización"
                            value="10/01/2026"
                        />
                    </View>

                    {/* Notes Section */}
                    {notes && notes.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>
                                NOTAS DEL CLIENTE
                            </Text>
                            <View style={styles.notesCard}>
                                <View style={styles.notesRow}>
                                    <MaterialCommunityIcons
                                        name="document-text-outline"
                                        size={20}
                                        color="#FFD43B"
                                    />
                                    <Text style={styles.notesText}>
                                        {notes}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Products */}
                    <Text style={styles.sectionTitle}>
                        PRODUCTOS UTILIZADOS
                    </Text>

                    <ProductRow brand="Mobil 1" name="Aceite Sintético 5W-30" />

                    <ProductRow
                        brand="Toyota Genuine"
                        name="Filtro de Aceite"
                    />

                    <ProductRow brand="Bosch" name="Filtro de Aire" />
                </ScrollView>
                <BottomNav active="LastService" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const TableRow = ({ label, value }) => (
    <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>{label}</Text>
        <Text style={styles.tableValue}>{value}</Text>
    </View>
);

const ProductRow = ({ brand, name }) => (
    <View style={styles.productRow}>
        <View>
            <Text style={styles.brandText}>{brand}</Text>
            <Text style={styles.productName}>{name}</Text>
        </View>
    </View>
);

export default LastServiceScreen;

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
        fontWeight: "bold",
        fontSize: 20,
    },

    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 28,
        padding: 28,
        marginBottom: 28,
    },

    labelGold: {
        color: "#FFD43B",
        marginBottom: 6,
    },

    carTitleLarge: {
        color: "white",
        fontWeight: "600",
    },

    subText: {
        color: "#8B90A0",
        marginTop: 8,
    },

    value: {
        color: "white",
        marginTop: 6,
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

    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    tableLabel: {
        color: "#8B90A0",
    },

    tableValue: {
        color: "white",
    },

    productRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1A1D24",
        padding: 22,
        borderRadius: 22,
        marginBottom: 14,
    },

    brandText: {
        color: "#FFD43B",
        fontWeight: "600",
    },

    productName: {
        color: "#fff",
        marginTop: 6,
    },

    notesCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderTopWidth: 4,
        borderTopColor: "#FFD43B",
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
