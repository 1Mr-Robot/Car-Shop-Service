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

const LastServiceScreen = ({ navigation, route }) => {
    const { vehicle, plate, vehicleColor, service, mileage, notes, servicesList } = route.params || {};

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
                            <Text style={{ color: "white" }}>{vehicleColor || "Silver"}</Text>
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

                    {/* Services Card */}
                    <Text style={styles.sectionTitle}>
                        SERVICIOS
                    </Text>

                    <View style={styles.serviceCard}>
                        {servicesList && servicesList.map((item, index) => {
                            let iconName = 'clock';
                            let iconColor = '#FFD43B';
                            let statusText = 'En Proceso';
                            
                            if (item.status === 'Finalizado') {
                                iconName = 'check-circle';
                                iconColor = '#22C55E';
                                statusText = 'Terminado';
                            } else if (item.status === 'Pendiente') {
                                iconName = 'x-circle';
                                iconColor = '#EF4444';
                                statusText = 'Pendiente';
                            }
                            
                            return (
                            <View key={item.id || index} style={styles.serviceItem}>
                                <View style={styles.serviceItemLeft}>
                                    <Feather 
                                        name={iconName} 
                                        size={32} 
                                        color={iconColor} 
                                    />
                                    <Text style={styles.serviceItemText}>{item.title}</Text>
                                </View>
                                <Text style={[styles.serviceStatus, { color: iconColor }]}>{statusText}</Text>
                            </View>
                            );
                        })}
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
        paddingHorizontal: 24,
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
        fontSize: 32,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 28,
        padding: 28,
        marginBottom: 28,
    },

    labelGold: {
        color: "#FFD43B",
        fontSize: 14,
        marginBottom: 6,
    },

    carTitleLarge: {
        color: "white",
        fontSize: 24,
        fontWeight: "600",
    },

    subText: {
        color: "#8B90A0",
        marginTop: 8,
        fontSize: 16,
    },

    value: {
        color: "white",
        fontSize: 18,
        marginTop: 6,
    },

    sectionTitle: {
        color: "#8B90A0",
        fontSize: 22,
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
        fontSize: 16,
    },

    tableValue: {
        color: "white",
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: "600",
    },

    productName: {
        color: "#fff",
        fontSize: 18,
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
        fontSize: 16,
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
        fontSize: 20,
        flex: 1,
    },

    serviceStatus: {
        fontSize: 16,
        fontWeight: "600",
    },
});
