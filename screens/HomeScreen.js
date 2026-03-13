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
import BottomNav from "../components/BottomNav";
import OrderCard from "../components/OrderCard";

const HomeScreen = ({ navigation }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const insets = useSafeAreaInsets();
    
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
                                <Text style={styles.name}>Chalino Sánchez</Text>
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

                    {ACTIVE_ORDER ? (
                        <OrderCard
                            id={ACTIVE_ORDER.id}  // id -> No Modificar
                            type="active"
                            vehicleYear={ACTIVE_ORDER.vehicleYear}
                            vehicleBrand={ACTIVE_ORDER.vehicleBrand}
                            vehicleModel={ACTIVE_ORDER.vehicleModel}
                            vehiclePlate={ACTIVE_ORDER.vehiclePlate}
                            vehicleColor={ACTIVE_ORDER.vehicleColor}
                            services={ACTIVE_ORDER.services}
                            notes={ACTIVE_ORDER.notes}
                            time={ACTIVE_ORDER.since}
                            mileage={ACTIVE_ORDER.vehicleMileage}
                            navigation={navigation}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No hay órdenes activas</Text>
                        </View>
                    )}

                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>
                            Ordenes de hoy
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
                            <Text style={styles.link}>Ver Calendario</Text>
                        </TouchableOpacity>
                    </View>

                    {UPCOMING_ORDERS.length > 0 ? (
                        UPCOMING_ORDERS.map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}  // id -> No Modificar
                                type="upcoming"
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                services={order.services}
                                notes={order.notes}
                                time={order.time}
                                mileage={order.vehicleMileage}
                                navigation={navigation}
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

                    {COMPLETED_ORDERS.length > 0 ? (
                        COMPLETED_ORDERS.map((order) => (
                            <OrderCard
                                key={order.id}
                                id={order.id}  // id -> No Modificar
                                type="completed"
                                vehicleYear={order.vehicleYear}
                                vehicleBrand={order.vehicleBrand}
                                vehicleModel={order.vehicleModel}
                                vehiclePlate={order.vehiclePlate}
                                vehicleColor={order.vehicleColor}
                                services={order.services}
                                time={order.time}
                                mileage={order.vehicleMileage}
                                navigation={navigation}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
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
                                    onPress={() => {
                                        setShowLogoutModal(false);
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

const ACTIVE_ORDER = {
    id: '1',
    vehicleYear: '2026',
    vehicleBrand: 'Ferrari',
    vehicleModel: 'SF-26',
    vehiclePlate: '62SBG2',
    vehicleColor: 'Rojo',
    vehicleMileage: '50,000 km',
    status: 'EN PROGRESO',
    since: '09:00 AM',
    notes: 'El cliente reporta ruido extraño al abrir el DRS. También pidió que se revisara el sistema de escape por posibles fugas.',
    services: [
        { id: '1', title: 'Cambio alerón delantero', status: 'Finalizado' },
        { id: '2', title: 'Inspección de unidad de potencia', status: 'Pendiente' },
        { id: '3', title: 'Reparación turbo', status: 'En Progreso' },   // No Modificar -> Cambio: "En Proceso " -> "En progreso"
        { id: '4', title: 'Cambio de discos carbono-ceramicos', status: 'En Progreso' },  // No Modificar -> Cambio: "En Proceso " -> "En progreso"
        { id: '5', title: 'Chequeo de fondo plano', status: 'En Progreso' },  // No Modificar -> Cambio: "En Proceso " -> "En progreso"
        { id: '6', title: 'Cambio de llantas a compuesto blando', status: 'Pendiente' },
    ]
}

const UPCOMING_ORDERS = [
    {
        id: '2',
        vehicleYear: '2019',
        vehicleBrand: 'Ford',
        vehicleModel: 'F-150',
        vehiclePlate: '57SBG3',
        vehicleColor: 'Gris',
        vehicleMileage: '60,000 km',
        time: 'Hoy, 02:30 PM',
        notes: 'El cliente pidió que se revisara la presión de las llantas.',
        services: [
            { id: '1', title: 'Diagnóstico de Motor', status: 'Pendiente' },
        ]
    },
    {
        id: '3',
        vehicleYear: '2022',
        vehicleBrand: 'Toyota',
        vehicleModel: 'RAV4',
        vehiclePlate: '29HJK1',
        vehicleColor: 'Azul',
        vehicleMileage: '70,000 km',
        time: 'Mañana, 09:00 AM',
        notes: 'El cliente solicita que se revise el sistema de aire acondicionado.',
        services: [
            { id: '1', title: 'Reemplazo de Batería', status: 'Pendiente' },
        ]
    }
]

const COMPLETED_ORDERS = [
    {
        id: '4',
        vehicleYear: '2023',
        vehicleBrand: 'BMW',
        vehicleModel: 'X5',
        vehiclePlate: '45JLM2',
        vehicleColor: 'Morado',
        vehicleMileage: '80,000 km',
        time: '08:15 AM',
        notes: 'El cliente pidió que se revisara la alarma.',
        services: [
            { id: '1', title: 'Cambio de Aceite y Filtro', status: 'Finalizado' },
        ]
    },
    {
        id: '5',
        vehicleYear: '2021',
        vehicleBrand: 'Audi',
        vehicleModel: 'A4',
        vehiclePlate: '78NPQ5',
        vehicleColor: 'Verde',
        vehicleMileage: '90,000 km',
        time: 'Ayer',
        notes: 'El cliente solicitó cambio de luces LED.',
        services: [
            { id: '1', title: 'Recarga de Aire Acondicionado', status: 'Finalizado' },
        ]
    }
]

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