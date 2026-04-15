import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNavReceptionist from "../components/BottomNavReceptionist";
import OrderCard from "../components/OrderCard";

const HomeReceptionistScreen = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const insets = useSafeAreaInsets();

    const staticActiveOrders = [
        {
            id: "1",
            vehicleYear: "2020",
            vehicleBrand: "Toyota",
            vehicleModel: "Corolla",
            vehiclePlate: "ABC-1234",
            vehicleColor: "Rojo",
            ownerName: "Juan Pérez",
            services: [
                { id: "s1", title: "Cambio de aceite", status: "completed" },
                { id: "s2", title: "Revisión de frenos", status: "in_progress" },
            ],
            notes: "El cliente reportó ruido al girar",
            time: "09:30",
            mileage: "45,000 km",
            mechanicName: "Carlos Martínez",
        },
    ];

    const staticUpcomingOrders = [
        {
            id: "2",
            vehicleYear: "2018",
            vehicleBrand: "Honda",
            vehicleModel: "Civic",
            vehiclePlate: "XYZ-5678",
            vehicleColor: "Negro",
            ownerName: "María López",
            services: [
                { id: "s3", title: "Alineación y balanceo", status: "pending" },
            ],
            notes: "",
            time: "14:00",
            mileage: "60,000 km",
            mechanicName: "Pedro Sánchez",
        },
        {
            id: "3",
            vehicleYear: "2022",
            vehicleBrand: "Nissan",
            vehicleModel: "Sentra",
            vehiclePlate: "DEF-9012",
            vehicleColor: "Blanco",
            ownerName: "Roberto García",
            services: [
                { id: "s4", title: "Cambio de baterías", status: "pending" },
                { id: "s5", title: "Diagnóstico eléctrico", status: "pending" },
            ],
            notes: "Auto no enciende",
            time: "16:30",
            mileage: "30,000 km",
            mechanicName: "Ana Torres",
        },
    ];

    const staticCompletedOrders = [
        {
            id: "4",
            vehicleYear: "2019",
            vehicleBrand: "Ford",
            vehicleModel: "Explorer",
            vehiclePlate: "GHI-3456",
            vehicleColor: "Azul",
            ownerName: "Luis Hernández",
            services: [
                { id: "s6", title: "Cambio de filtros", status: "completed" },
                { id: "s7", title: "Lavado interior", status: "completed" },
            ],
            time: "Ayer",
            mileage: "80,000 km",
            mechanicName: "Carlos Martínez",
        },
        {
            id: "5",
            vehicleYear: "2021",
            vehicleBrand: "Chevrolet",
            vehicleModel: "Spark",
            vehiclePlate: "JKL-7890",
            vehicleColor: "Verde",
            ownerName: "Sofia Ramírez",
            services: [
                { id: "s8", title: "Rotación de llantas", status: "completed" },
            ],
            time: "Ayer",
            mileage: "25,000 km",
            mechanicName: "Pedro Sánchez",
        },
    ];

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
                                    BUENOS DÍAS,
                                </Text>
                                <Text style={styles.name}>Valentín Elizalde</Text>
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

                    {staticActiveOrders.length > 0 ? (
                        staticActiveOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}
                                type="active"
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                ownerName={order.ownerName}
                                services={order.services}
                                notes={order.notes}
                                time={order.time}
                                mileage={order.mileage}
                                mechanicName={order.mechanicName}
                                showDetailsButton={false}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No hay órdenes activas</Text>
                        </View>
                    )}

                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>
                            Ordenes de hoy
                        </Text>
                    </View>

                    {staticUpcomingOrders.length > 0 ? (
                        staticUpcomingOrders.map((order) => (
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
                                time={order.time}
                                mileage={order.mileage}
                                mechanicName={order.mechanicName}
                                showDetailsButton={false}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
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
                        <Text style={styles.subtle}>Ultimas 24h</Text>
                    </View>

                    {staticCompletedOrders.length > 0 ? (
                        staticCompletedOrders.map((order) => (
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
                                time={order.time}
                                mileage={order.mileage}
                                mechanicName={order.mechanicName}
                                showDetailsButton={false}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No se han completado órdenes</Text>
                        </View>
                    )}

                    <View style={{ height: 200 }} />
                </ScrollView>

                <TouchableOpacity 
                    style={styles.fabButton}
                    onPress={() => navigation.navigate('CreateOrder')}
                >
                    <Feather name="plus" size={20} color="#000" />
                    <Text style={styles.fabButtonText}>Generar nueva orden</Text>
                </TouchableOpacity>

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
                                    onPress={() => {
                                        setShowLogoutModal(false);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Login' }],
                                        });
                                    }}
                                >
                                    <Text style={styles.modalAcceptText}>Aceptar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <BottomNavReceptionist active="HomeReceptionist" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default HomeReceptionistScreen;

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

    logoutButton: {
        padding: 8,
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

    fabButton: {
        position: "absolute",
        bottom: 90,
        left: 18,
        right: 18,
        backgroundColor: "#FFD43B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },

    fabButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
});