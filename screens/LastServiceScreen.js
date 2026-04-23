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
        mileage,
        notes,
        servicesList,
        startDate,
        startTime,
        endDate,
        endTime,
        productsList,
    } = route.params || {};

    const insets = useSafeAreaInsets();

    // 2. Fallbacks de seguridad por si algún campo viene nulo desde la DB
    const displayStartDate = startDate || "---";
    const displayStartTime = startTime || "---";
    const displayEndDate = endDate || "---";
    const displayEndTime = endTime || "---";
    const safeProductsList = productsList || [];

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
                            <Text style={styles.dataValue}>{displayEndDate}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>
                                Hora de Finalización
                            </Text>
                            <Text style={styles.dataValue}>{displayEndTime}</Text>
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
                    {safeProductsList.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>PRODUCTOS UTILIZADOS</Text>
                            {safeProductsList.map((product) => (
                                <View key={product.id} style={styles.productCard}>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productBrand}>{product.brand}</Text>
                                        <Text style={styles.productName}>{product.name}</Text>
                                    </View>
                                    <View style={styles.productQuantity}>
                                        <Text style={styles.quantityLabel}>Cant.</Text>
                                        <Text style={styles.quantityValue}>{product.quantity}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={[styles.sectionTitle, { color: '#555', textAlign: 'center', marginTop: 10 }]}>
                            No se utilizaron productos en esta orden
                        </Text>
                    )}
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
    noProductsText: {
        color: "#888",
        fontSize: 15,
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 20,
    },
});