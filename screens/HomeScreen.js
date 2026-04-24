import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
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
import OrderService from "../services/OrderService";

// POR NADA DEL MUNDO TOCAR ESTOS IMPORT!!!!
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app);

// Helper para Saludo Dinámico
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "BUENOS DÍAS,";
    if (hour < 18) return "BUENAS TARDES,";
    return "BUENAS NOCHES,";
};

const HomeScreen = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const insets = useSafeAreaInsets();
    
    const [activeOrder, setActiveOrder] = useState(null);
    const [upcomingOrders, setUpcomingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userName, setUserName] = useState("Mecánico");
    const greeting = getGreeting();

    const fetchOrders = async (uid) => {
        // Guarda de seguridad: Si no hay UID, no disparamos nada a la base de datos
        if (!uid) return;

        try {
            setIsLoading(true);
            setError(null);

            // SOLUCIÓN: Hacemos peticiones secuenciales en lugar de simultáneas.
            // Esto evita el error "too many connections" en CleverCloud.
            const active = await OrderService.getActiveOrder(uid);
            const upcoming = await OrderService.getUpcomingOrders(uid);
            const completed = await OrderService.getCompletedOrders(uid);

            // Filtramos las 'upcoming' para quitar la que ya está como 'active'.
            const filteredUpcoming = upcoming.filter(o => !active || o.id !== active.id);

            const anyOrder = active || filteredUpcoming[0] || completed[0];
            if (anyOrder && anyOrder.mechanicName) {
                setUserName(anyOrder.mechanicName);
            }

            setActiveOrder(active);
            setUpcomingOrders(filteredUpcoming);
            setCompletedOrders(completed);

        } catch (err) {
            console.error("Error al cargar órdenes:", err);
            setError("No se pudieron cargar las órdenes. Verifica tu conexión e intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 1. Escuchamos activamente a Firebase. 
        // En cuanto Firebase "despierte" y nos dé el usuario, disparamos la búsqueda de forma segura.
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchOrders(user.uid);
            } else {
                setIsLoading(false); // Si no hay usuario, quitamos el loading
            }
        });

        // 2. Si venimos de otra pantalla (ej. Detalles), recargamos, 
        // pero verificamos primero que la sesión de Firebase esté viva.
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

    if (isLoading && !activeOrder && upcomingOrders.length === 0) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Sincronizando con el taller...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (error) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Feather name="alert-triangle" size={40} color="#FF4D4D" />
                    <Text style={{ color: "#fff", marginTop: 15, textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
                    <TouchableOpacity onPress={() => fetchOrders(auth?.currentUser?.uid)} style={[styles.detailsButton, { marginTop: 20 }]}>
                        <Text style={styles.detailsButtonText}>Reintentar</Text>
                    </TouchableOpacity>
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
                    <View style={styles.header}>
                        <View style={styles.profileRow}>
                            <View style={styles.avatar}>
                                <Feather name="user" size={30} color="black" />
                            </View>
                            <View>
                                <Text style={styles.greeting}>
                                    {greeting}
                                </Text>
                                <Text style={styles.name}>{userName}</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={() => setShowLogoutModal(true)}
                        >
                            <Feather name="log-out" size={22} color="#FF4D4D" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Ordenes activas</Text>

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
                            startDate={activeOrder.startDate}
                            startTime={activeOrder.startTime}
                            endDate={activeOrder.endDate}
                            endTime={activeOrder.endTime}
                            products={activeOrder.products}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No hay órdenes activas</Text>
                        </View>
                    )}

                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>
                            Ordenes próximas
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                            <Text style={styles.link}>Ver Todas</Text>
                        </TouchableOpacity>
                    </View>

                    {upcomingOrders.length > 0 ? (
                        upcomingOrders.slice(0, 5).map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}
                                type="upcoming"
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                vehicleVIN={order.vehicleVIN}
                                ownerName={order.ownerName}
                                services={order.services}
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
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No hay órdenes para hoy</Text>
                        </View>
                    )}

                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>
                            Ordenes Completadas
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('PastRepairs')}>
                            <Text style={styles.link}>Ver Historial Completo</Text>
                        </TouchableOpacity>
                    </View>

                    {completedOrders.length > 0 ? (
                        completedOrders.slice(0, 5).map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}
                                type="completed"
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                vehicleVIN={order.vehicleVIN}
                                ownerName={order.ownerName}
                                services={order.services}
                                time={order.endDate ? `${order.endDate}, ${order.endTime}` : order.time}
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
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No se han completado órdenes</Text>
                        </View>
                    )}

                    <View style={{ height: 120 }} />
                </ScrollView>

                <Modal
                    visible={showLogoutModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLogoutModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Cerrar Sesión</Text>
                            <Text style={styles.modalText}>¿Estás seguro de que deseas cerrar sesión?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={styles.modalCancelButton}
                                    onPress={() => setShowLogoutModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.modalAcceptButton}
                                    onPress={async () => {
                                        setShowLogoutModal(false);
                                        try {
                                            await auth.signOut();
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' }],
                                            });
                                        } catch (err) {
                                            console.error("Error al cerrar sesión:", err);
                                        }
                                    }}
                                >
                                    <Text style={styles.modalAcceptText}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <BottomNav active="Home" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFD43B",
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    greeting: {
        color: "#888",
        fontSize: 12,
    },
    name: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    bell: {
        position: "relative",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FFD43B",
        position: "absolute",
        right: 0,
        top: 0,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    link: {
        color: "#FFD43B",
    },
    subtle: {
        color: "#777",
    },
    servicesRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        gap: 8,
        width: "100%",
    },
    servicesText: {
        color: "#888",
        fontSize: 13,
        flex: 1,
        flexWrap: "wrap",
        lineHeight: 20,
    },
    orderCard: {
        flexDirection: "row",
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
    },
    yellowStrip: {
        width: 4,
        backgroundColor: "#FFD43B",
        borderRadius: 4,
        marginRight: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    inProgress: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "bold",
    },
    scheduled: {
        color: "#3B82F6",
        fontSize: 12,
        fontWeight: "bold",
    },
    completed: {
        color: "#22C55E",
        fontSize: 12,
        fontWeight: "bold",
    },
    since: {
        color: "#777",
        fontSize: 12,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    expandedContent: {
        marginTop: 12,
    },
    jobTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 8,
    },
    jobSub: {
        color: "#888",
        marginTop: 4,
    },
    progressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: "#333",
        borderRadius: 4,
        marginRight: 8,
    },
    progressFill: {
        width: "65%",
        height: "100%",
        backgroundColor: "#FFD43B",
        borderRadius: 4,
    },
    percent: {
        color: "#fff",
    },
    badge: {
        backgroundColor: "#3A1F1F",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        color: "#FF4D4D",
        fontSize: 12,
    },
    assignmentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1D23",
        padding: 16,
        borderRadius: 16,
    },
    assignmentTitle: {
        color: "#fff",
        fontWeight: "600",
    },
    assignmentSub: {
        color: "#888",
        fontSize: 13,
    },
    startBtn: {
        backgroundColor: "#FFD43B",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    startText: {
        fontWeight: "bold",
    },
    taskCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1D23",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    taskTitle: {
        color: "#fff",
        fontWeight: "600",
    },
    taskSub: {
        color: "#888",
        fontSize: 13,
    },
    time: {
        color: "#888",
        fontSize: 12,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    notesSection: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#2A2D35",
    },
    notesHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        gap: 6,
    },
    notesLabel: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
    },
    notesText: {
        color: "#888",
        fontSize: 13,
        lineHeight: 18,
    },
    detailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FFD43B",
    },
    detailsButtonText: {
        color: "#FFD43B",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 4,
    },
    logoutButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        padding: 24,
        width: "85%",
        alignItems: "center",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    modalText: {
        color: "#888",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    modalCancelButton: {
        backgroundColor: "#333",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    modalCancelText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    modalAcceptButton: {
        backgroundColor: "#FF4D4D",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    modalAcceptText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
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