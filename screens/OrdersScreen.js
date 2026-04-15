import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import OrderCard from "../components/OrderCard";


import OrderService from "../services/OrderService";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

// Helper para procesar fechas de Postgres a 'HOY', 'MAÑANA' o 'DD/MM/YYYY'
const processUpcomingOrders = (orders) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatD = (d) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const todayStr = formatD(today);
    const tomorrowStr = formatD(tomorrow);

    return orders.map(order => {
        let dayKey = 'SIN FECHA';
        let displayTime = order.time;

        if (order.time) {
            // El backend retorna 'DD/MM/YYYY, HH12:MI AM'
            const parts = order.time.split(', ');
            if (parts.length === 2) {
                const datePart = parts[0];
                const timePart = parts[1];
                
                if (datePart === todayStr) {
                    dayKey = 'HOY';
                    displayTime = `HOY, ${timePart}`;
                } else if (datePart === tomorrowStr) {
                    dayKey = 'MAÑANA';
                    displayTime = `MAÑANA, ${timePart}`;
                } else {
                    dayKey = datePart;
                }
            }
        }
        return { ...order, dayKey, displayTime };
    });
};

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

export default function OrdersScreen({ navigation }) {
    const [expandedId, setExpandedId] = useState(null);
    const insets = useSafeAreaInsets();
    
    // Estados para la API RESTful
    const [activeOrder, setActiveOrder] = useState(null);
    const [upcomingOrders, setUpcomingOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async (uid) => {
        if (!uid) return;
        try {
            setIsLoading(true);

            // Consultas secuenciales (Protegiendo CleverCloud)
            const active = await OrderService.getActiveOrder(uid);
            const upcomingRaw = await OrderService.getUpcomingOrders(uid);

            setActiveOrder(active);
            setUpcomingOrders(processUpcomingOrders(upcomingRaw));

        } catch (err) {
            console.error("Error al cargar la agenda:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Escuchamos a Firebase para obtener el UID
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchOrders(user.uid);
            } else {
                setIsLoading(false);
            }
        });

        // Recargamos si regresamos de otra pantalla
        const unsubscribeFocus = navigation.addListener('focus', () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                fetchOrders(currentUser.uid);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFocus();
        };
    }, [navigation]);

    // Renderizamos un Loading igual al de HomeScreen
    if (isLoading && !activeOrder && upcomingOrders.length === 0) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Cargando agenda...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    const groupedOrders = groupOrdersByDay(upcomingOrders);

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView
                style={[styles.container, { paddingBottom: insets.bottom }]}
                edges={["top", "bottom"]}
            >
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            margin: 16,
                            color: "#fff",
                        }}
                    >
                        Próximas Ordenes
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <Octicons name="dot-fill" size={24} color="#FFD43B" />
                        <Text
                            style={{
                                color: "#FFD43B",
                                marginLeft: 8,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            Ordenes actuales
                        </Text>
                    </View>
                    
                    {/* Renderización Dinámica de Orden Activa */}
                    {activeOrder ? (
                        <OrderCard
                            id={activeOrder.id} 
                            type="active"
                            vehicleYear={activeOrder.vehicleYear}
                            vehicleBrand={activeOrder.vehicleBrand}
                            vehicleModel={activeOrder.vehicleModel}
                            vehiclePlate={activeOrder.vehiclePlate}
                            vehicleColor={activeOrder.vehicleColor}
                            ownerName={activeOrder.ownerName} 
                            services={activeOrder.services}
                            notes={activeOrder.notes}
                            time={activeOrder.since}
                            mileage={activeOrder.vehicleMileage}
                            navigation={navigation}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No hay órdenes en progreso</Text>
                        </View>
                    )}

                    {upcomingOrders.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No tienes órdenes agendadas próximamente</Text>
                        </View>
                    )}

                    {/* Renderización Dinámica y Agrupada de Órdenes Próximas */}
                    {Object.keys(groupedOrders).map((day) => (
                        <View key={day}>
                            <Text style={styles.sectionLabel}>{day}</Text>
                            {groupedOrders[day].map((order) => (
                                <OrderCard
                                    key={order.id}
                                    id={order.id} 
                                    type="upcoming"
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
                                />
                            ))}
                        </View>
                    ))}

                    <View style={{ height: 120 }} />
                </ScrollView>
                <BottomNav active="Orders" />
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
    sectionLabel: {
        color: "#8B90A0",
        fontSize: 13,
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10,
    },
    emptyState: {
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    emptyText: {
        color: "#777",
        fontSize: 14,
    },
});