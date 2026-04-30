import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import OrderCard from "../components/OrderCard";
import OrderService from "../services/OrderService";

import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const weekDays = ["L","M","M","J","V","S","D"];

const convertToDateKey = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
};

export default function AgendaScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [filterType, setFilterType] = useState("day");
    const [expandedId, setExpandedId] = useState(null);
    
    const [ordersByDate, setOrdersByDate] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;
    const allDates = Object.keys(ordersByDate);

    const fetchOrders = async (uid) => {
        if (!uid) return;
        try {
            setIsLoading(true);
            setError(null);
            const allOrders = await OrderService.getAllOrders(uid, 100);
            
            const grouped = {};
            allOrders.forEach(order => {
                const dateKey = convertToDateKey(order.startDate);
                if (dateKey) {
                    if (!grouped[dateKey]) {
                        grouped[dateKey] = [];
                    }
                    const hasPending = order.services?.some(s => s.status === 'Pendiente');
                    const hasInProgress = order.services?.some(s => s.status === 'En Progreso');
                    const hasFinalized = order.services?.every(s => s.status === 'Finalizado');
                    
                    let status = 'Pendiente';
                    if (hasInProgress) status = 'En Progreso';
                    else if (hasFinalized && order.endDate) status = 'Finalizado';
                    else if (order.services?.length > 0) status = 'Pendiente';
                    
                    grouped[dateKey].push({
                        ...order,
                        status,
                        time: order.time || order.startTime,
                    });
                }
            });
            
            setOrdersByDate(grouped);
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
            setError("No se pudieron cargar las órdenes.");
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
            if (currentUser) {
                fetchOrders(currentUser.uid);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeFocus();
        };
    }, [navigation]);

    let filteredOrders = [];

    if (filterType === "day") {
        filteredOrders = ordersByDate[formattedDate] || [];
    }

    if (filterType === "month") {
        const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}`;
        filteredOrders = allDates
        .filter(date => date.startsWith(monthPrefix))
        .flatMap(date => ordersByDate[date] || []);
    }

    if (filterType === "week") {
        const selectedDate = new Date(formattedDate);
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        filteredOrders = allDates
        .filter(date => {
            const d = new Date(date);
            return d >= startOfWeek && d <= endOfWeek;
        })
        .flatMap(date => ordersByDate[date] || []);
    }

    const goNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDay(1);
    };

    const goPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDay(1);
    };

    if (isLoading && Object.keys(ordersByDate).length === 0) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFD43B" />
                <Text style={{ color: "#888", marginTop: 15 }}>Cargando calendario...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Feather name="alert-triangle" size={40} color="#FF4D4D" />
                <Text style={{ color: "#fff", marginTop: 15, textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
                <Pressable onPress={() => fetchOrders(auth?.currentUser?.uid)} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <>
            <StatusBar style="light" />
            <SafeAreaView
                style={[styles.container, { paddingBottom: insets.bottom }]}
                edges={["top","bottom"]}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Órdenes programadas</Text>
                    </View>

                    <View style={styles.monthRow}>
                        <Pressable onPress={goPrevMonth}>
                            <Feather name="chevron-left" size={22} color="#fff" />
                        </Pressable>

                        <Text style={styles.monthText}>
                            {months[currentMonth]} {currentYear}
                        </Text>

                        <Pressable onPress={goNextMonth}>
                            <Feather name="chevron-right" size={22} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.weekRow}>
                        {weekDays.map((day, index) => (
                            <Text key={index} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.calendarGrid}>
                        {[...Array(startOffset).fill(null), ...Array(daysInMonth).keys()]
                        .map((value, i) => {

                            if (value === null) {
                                return <View key={i} style={styles.dayBox} />;
                            }

                            const day = value + 1;
                            const isSelected = selectedDay === day;

                            return (
                                <Pressable
                                    key={i}
                                    style={[
                                    styles.dayBox,
                                    isSelected && styles.selectedDay
                                    ]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        isSelected && { color: "#000" }
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.filterRow}>
                        {["day","week","month"].map(type => (
                            <Pressable
                                key={type}
                                onPress={() => setFilterType(type)}
                                style={[
                                styles.filterButton,
                                filterType === type && styles.activeFilter
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    filterType === type && { color: "#000" }
                                ]}>
                                    {type === "day" ? "Día" : type === "week" ? "Semana" : "Mes"}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.repairsTitle}>Órdenes</Text>

                    {filteredOrders.length === 0 ? (
                        <Text style={styles.noRepairs}>
                            No hay órdenes para este filtro.
                        </Text>
                    ) : (
                        filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}
                                type={
                                    order.status === "En Progreso"
                                        ? "active"
                                        : order.status === "Finalizado"
                                        ? "completed"
                                        : "upcoming"
                                }
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                vehicleVIN={order.vehicleVIN}
                                ownerName={order.ownerName}
                                services={order.services || []}
                                notes={order.notes}
                                time={order.time}
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
                        ))
                    )}
                </ScrollView>
                <BottomNav active="Agenda" />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerRow: {
        marginTop: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold",
    },
    monthRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    monthText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    weekDayText: {
        width: "14.28%",
        textAlign: "center",
        color: "#8B90A0",
        fontSize: 12,
        fontWeight: "600",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 2,
    },
    dayBox: {
        width: "14.28%",
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    selectedDay: {
        backgroundColor: "#FFD43B",
        borderRadius: 8,
    },
    dayText: {
        color: "#fff",
        fontSize: 14,
    },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 0,
        marginBottom: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: "#1A1D24",
        borderRadius: 20,
    },
    activeFilter: {
        backgroundColor: "#FFD43B",
    },
    filterText: {
        color: "#fff",
        fontSize: 13,
    },
    repairsTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },
    noRepairs: {
        color: "#888",
        fontSize: 14,
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#FFD43B",
        borderRadius: 12,
    },
    retryButtonText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 14,
    },
});