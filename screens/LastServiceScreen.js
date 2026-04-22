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

const LastServiceScreen = ({ navigation, route }) => {
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
        startDate,
        startTime,
    } = route.params || {};
    const insets = useSafeAreaInsets();

    const endDate = "10/01/2026";
    const endTime = "02:30 PM";

    const displayStartDate = startDate || "---";
    const displayStartTime = startTime || "---";

    const productsList = [
        {
            id: "1",
            name: "Aceite Sintético 5W-30",
            brand: "Mobil 1",
            quantity: 1,
        },
        {
            id: "2",
            name: "Filtro de Aceite",
            brand: "Toyota Genuine",
            quantity: 1,
        },
        { id: "3", name: "Filtro de Aire", brand: "Bosch", quantity: 1 },
    ];

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
                        status="completed"
                        vehicleYear={vehicle ? vehicle.split(" ")[0] : ""}
                        vehicleBrand={vehicle ? vehicle.split(" ")[1] : ""}
                        vehicleModel={
                            vehicle ? vehicle.split(" ").slice(2).join(" ") : ""
                        }
                        owner={ownerName || "Cliente"}
                        color={vehicleColor || "Silver"}
                        plate={plate || "ABC-1234"}
                        mileage={mileage || "45,000 km"}
                        vin={vehicleVIN || "1B3HB48M2X8D12345"}
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
                                Fecha de Inicio
                            </Text>
                            <Text style={styles.dataValue}>{displayStartDate}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Hora de Inicio</Text>
                            <Text style={styles.dataValue}>{displayStartTime}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Fecha de Finalización
                            </Text>
                            <Text style={styles.dataValue}>{endDate}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Hora de Finalización
                            </Text>
                            <Text style={styles.dataValue}>{endTime}</Text>
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

                    <Text style={styles.sectionTitle}>
                        PRODUCTOS UTILIZADOS
                    </Text>

                    {productsList.map((product) => (
                        <View key={product.id} style={styles.productCard}>
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
                    ))}
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
};

export default LastServiceScreen;

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
    sectionTitle: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 1,
        marginBottom: 16,
        marginHorizontal: 18,
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
