import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import OrderCard from "../components/OrderCard";

// Conexión al Backend y Firebase
import OrderService from "../services/OrderService";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

// Helper para procesar fechas (HOY, AYER o DD/MM/YYYY)
const processCompletedOrders = (orders) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatD = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const todayStr = formatD(today);
    const yesterdayStr = formatD(yesterday);

    return orders.map(order => {
        let dayKey = 'SIN FECHA';
        let displayTime = order.time;

        if (order.endDate) {
            if (order.endDate === todayStr) {
                dayKey = 'HOY';
                displayTime = `HOY, ${order.endTime}`;
            } else if (order.endDate === yesterdayStr) {
                dayKey = 'AYER';
                displayTime = `AYER, ${order.endTime}`;
            } else {
                dayKey = order.endDate;
                displayTime = `${order.endDate}, ${order.endTime}`;
            }
        }
        return { ...order, dayKey, displayTime };
    });
};

// Helper de agrupación
const groupOrdersByDay = (orders) => {
    const groups = {};
    orders.forEach((order) => {
        const day = order.dayKey;
        if (!groups[day]) {
            groups[day] = [];
        }
        groups[day].push(order);
    });
    return groups;
};

export default function PastRepairsScreen({ navigation }) {
    const [expandedId, setExpandedId] = useState(null);
    const insets = useSafeAreaInsets();

    const [completedOrders, setCompletedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrders = async (uid) => {
        if (!uid) return;
        try {
            setIsLoading(true);
            const rawOrders = await OrderService.getCompletedOrders(uid);
            setCompletedOrders(processCompletedOrders(rawOrders));
        } catch (err) {
            console.error("Error al cargar historial:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchOrders(user.uid);
            } else {
                setIsLoading(false);
            }
        });

        const unsubscribeFocus = navigation.addListener('focus', () => {
            const currentUser = auth.currentUser;
            if (currentUser) fetchOrders(currentUser.uid);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFocus();
        };
    }, [navigation]);

    // Filtrado en tiempo real basado en la barra de búsqueda (Placa o Cliente)
    const filteredOrders = completedOrders.filter(order => {
        const query = searchQuery.toLowerCase();
        const plateMatch = order.vehiclePlate?.toLowerCase().includes(query);
        const ownerMatch = order.ownerName?.toLowerCase().includes(query);
        return plateMatch || ownerMatch;
    });

    const groupedOrders = groupOrdersByDay(filteredOrders);
    
    // Calcular cuántas reparaciones se hicieron HOY
    const todayRepairsCount = completedOrders.filter(o => o.dayKey === 'HOY').length;

    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Cargando historial...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView
                style={[styles.container, { paddingBottom: insets.bottom }]}
                edges={["top", "bottom"]}
            >
                <ScrollView showsVerticalScrollIndicator={false}>

                    <Text style={styles.headerTitle}>
                        Historial de Ordenes
                    </Text>

                    {/* SUMMARY DINÁMICO */}
                    <View style={styles.summaryCard}>
                        <View>
                            <Text style={styles.smallLabel}>
                                COMPLETADAS HOY
                            </Text>
                            <Text style={styles.bigNumber}>
                                {todayRepairsCount} Ordenes
                            </Text>
                        </View>
                    </View>

                    {/* LISTADO AGRUPADO DINÁMICO */}
                    {Object.keys(groupedOrders).length === 0 ? (
                         <View style={{ alignItems: "center", marginTop: 40 }}>
                             <Text style={{ color: "#777", fontSize: 16 }}>No se encontraron ordenes.</Text>
                         </View>
                    ) : (
                        Object.keys(groupedOrders).map((day) => (
                            <View key={day}>
                                <Text style={styles.sectionLabel}>
                                    {day.toUpperCase()}
                                </Text>

                                {groupedOrders[day].map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        id={order.id}
                                        type="completed"
                                        vehicleYear={order.vehicleYear}
                                        vehicleBrand={order.vehicleBrand}
                                        vehicleModel={order.vehicleModel}
                                        vehiclePlate={order.vehiclePlate}
                                        vehicleColor={order.vehicleColor}
                                        ownerName={order.ownerName}
                                        services={order.services}
                                        notes={order.notes}
                                        time={order.displayTime || order.time}
                                        mileage={order.vehicleMileage}
                                        navigation={navigation}
                                        expandedId={expandedId}
                                        setExpandedId={setExpandedId}
                                        startDate={order.startDate}
                                        startTime={order.startTime}
                                        endDate={order.endDate}
                                        endTime={order.endTime}
                                        products={order.products}
                                    />
                                ))}
                            </View>
                        ))
                    )}

                    <View style={{ height: 120 }} />
                </ScrollView>

                <BottomNav active="PastRepairs" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginVertical: 16,
    },

    summaryCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255,212,59,0.3)",
    },

    smallLabel: {
        color: "#8B90A0",
        fontSize: 11,
        letterSpacing: 1,
    },

    bigNumber: {
        color: "#FFD43B",
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 4,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#14161C",
        borderRadius: 15,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 20,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: "#fff",
    },

    sectionLabel: {
        color: "#8B90A0",
        fontSize: 13,
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10,
    },
});