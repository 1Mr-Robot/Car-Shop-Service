import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";

const LastServiceScreen = ({ navigation, route }) => {
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
                    <View style={styles.card}>
                        <Text style={styles.labelGold}>VEHÍCULO</Text>
                        <Text style={styles.carTitleLarge}>
                            {vehicle || "Toyota Corolla 2022"}
                        </Text>

                        <Text style={styles.subText}>
                            Placa:{" "}
                            <Text style={{ color: "white" }}>
                                {plate || "ABC-1234"}
                            </Text>{" "}
                            | Color:{" "}
                            <Text style={{ color: "white" }}>Silver</Text>
                        </Text>

                        <Text style={[styles.labelGold, { marginTop: 20 }]}>
                            VIN / NIV
                        </Text>
                        <Text style={styles.value}>1B3HB48M2X8D12345</Text>

                        <Text style={[styles.labelGold, { marginTop: 20 }]}>
                            PROPIETARIO
                        </Text>
                        <Text style={styles.value}>Juan Pérez</Text>
                    </View>

                    {/* Service Details */}
                    <Text style={styles.sectionTitle}>
                        DETALLES DEL SERVICIO
                    </Text>

                    <View style={styles.serviceCard}>
                        <TableRow
                            label="Descripción"
                            value={service || "Cambio de Aceite y Filtros"}
                        />
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
                                        size={16}
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

    labelGold: {
        color: "#FFD43B",
        fontSize: 12,
        marginBottom: 4,
    },

    carTitleLarge: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },

    subText: {
        color: "#8B90A0",
        marginTop: 6,
    },

    value: {
        color: "white",
        fontSize: 14,
        marginTop: 4,
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

    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    tableLabel: {
        color: "#8B90A0",
    },

    tableValue: {
        color: "white",
    },

    productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    tableHeader: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 8,
    },

    productHeader: {
        marginBottom: 8,
    },

    productRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1A1D24",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },

    brandText: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
    },

    productName: {
        color: "#fff",
        fontSize: 13,
        marginTop: 2,
    },

    value: {
        color: "#fff",
        fontSize: 13,
    },

    skuText: {
        color: "#FFD43B",
        fontSize: 12,
    },

    brandText: {
        color: "#8B90A0",
        fontSize: 11,
    },

    qtyBadge: {
        backgroundColor: "#FFD43B",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },

    qtyText: {
        color: "black",
        fontWeight: "600",
    },

    notesCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 15,
        padding: 16,
        marginBottom: 25,
        borderTopWidth: 4,
        borderTopColor: "#FFD43B",
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
});
