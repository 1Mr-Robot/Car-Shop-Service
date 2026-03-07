import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
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

export default function OrdersScreen({ navigation }) {
    const [expandedId, setExpandedId] = useState(`active-${ACTIVE_ORDER.vehiclePlate}`);
    const insets = useSafeAreaInsets();
    const groupedOrders = groupOrdersByDay(UPCOMING_ORDERS);
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
                    <OrderCard
                        type="active"
                        vehicleYear={ACTIVE_ORDER.vehicleYear}
                        vehicleBrand={ACTIVE_ORDER.vehicleBrand}
                        vehicleModel={ACTIVE_ORDER.vehicleModel}
                        vehiclePlate={ACTIVE_ORDER.vehiclePlate}
                        services={ACTIVE_ORDER.services}
                        notes={ACTIVE_ORDER.notes}
                        time={ACTIVE_ORDER.time}
                        mileage={ACTIVE_ORDER.vehicleMileage}
                        navigation={navigation}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />

                    {/* UPCOMING */}
                    {dayOrder.map((day) => (
                        groupedOrders[day] && (
                            <View key={day}>
                                <Text style={styles.sectionLabel}>{day.toUpperCase()}</Text>
                                {groupedOrders[day].map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        type="upcoming"
                                        vehicleYear={order.vehicleYear}
                                        vehicleBrand={order.vehicleBrand}
                                        vehicleModel={order.vehicleModel}
                                        vehiclePlate={order.vehiclePlate}
                                        services={order.services}
                                        notes={order.notes}
                                        time={order.time}
                                        mileage={order.vehicleMileage}
                                        navigation={navigation}
                                        expandedId={expandedId}
                                        setExpandedId={setExpandedId}
                                    />
                                ))}
                            </View>
                        )
                    ))}

                    <View style={{ height: 120 }} />
                </ScrollView>
                <BottomNav active="Orders" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

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

const dayOrder = ['HOY', 'MAÑANA', '20/03/2026', '21/03/2026', '22/03/2026'];

const ACTIVE_ORDER = {
    id: 'active',
    vehicleYear: '2027',
    vehicleBrand: 'Honda',
    vehicleModel: 'Civic',
    vehiclePlate: 'AB123D',
    vehicleMileage: '10,000 km',
    time: '09:00 AM',
    notes: 'Cambio de aceite y revisión general',
    services: [
        { id: '1', title: 'Cambio de aceite', status: 'En Proceso' },
        { id: '2', title: 'Revisión de frenos', status: 'Pendiente' },
    ]
};

const UPCOMING_ORDERS = [
    {
        id: '1',
        vehicleYear: '2019',
        vehicleBrand: 'Ford',
        vehicleModel: 'F-150',
        vehiclePlate: 'PL-9988',
        vehicleMileage: '60,000 km',
        time: 'HOY, 02:30 PM',
        dayKey: 'HOY',
        notes: 'Diagnostico de motor',
        services: [
            { id: '1', title: 'Diagnostico de motor', status: 'Pendiente' },
        ]
    },
    {
        id: '2',
        vehicleYear: '2022',
        vehicleBrand: 'Toyota',
        vehicleModel: 'RAV4',
        vehiclePlate: 'TX-5544',
        vehicleMileage: '70,000 km',
        time: 'MAÑANA, 09:00 AM',
        dayKey: 'MAÑANA',
        notes: 'Servicio de mantenimiento',
        services: [
            { id: '1', title: 'Servicio de mantenimiento', status: 'Pendiente' },
        ]
    },
    {
        id: '3',
        vehicleYear: '2023',
        vehicleBrand: 'BMW',
        vehicleModel: 'X5',
        vehiclePlate: 'BM-2233',
        vehicleMileage: '80,000 km',
        time: 'MAÑANA, 11:00 AM',
        dayKey: 'MAÑANA',
        notes: 'Cambio de aceite',
        services: [
            { id: '1', title: 'Cambio de aceite', status: 'Pendiente' },
        ]
    },
    {
        id: '4',
        vehicleYear: '2021',
        vehicleBrand: 'Nissan',
        vehicleModel: 'Sentra',
        vehiclePlate: 'NS-8877',
        vehicleMileage: '50,000 km',
        time: '20/03/2026, 10:00 AM',
        dayKey: '20/03/2026',
        notes: 'Revisión de frenos',
        services: [
            { id: '1', title: 'Revisión de frenos', status: 'Pendiente' },
        ]
    },
    {
        id: '5',
        vehicleYear: '2020',
        vehicleBrand: 'Chevrolet',
        vehicleModel: 'Malibu',
        vehiclePlate: 'CH-4455',
        vehicleMileage: '65,000 km',
        time: '21/03/2026, 02:00 PM',
        dayKey: '21/03/2026',
        notes: 'Diagnóstico eléctrico',
        services: [
            { id: '1', title: 'Diagnóstico eléctrico', status: 'Pendiente' },
        ]
    },
    {
        id: '6',
        vehicleYear: '2022',
        vehicleBrand: 'Mazda',
        vehicleModel: 'CX-5',
        vehiclePlate: 'MZ-1122',
        vehicleMileage: '45,000 km',
        time: '22/03/2026, 09:30 AM',
        dayKey: '22/03/2026',
        notes: 'Alineación y balanceo',
        services: [
            { id: '1', title: 'Alineación y balanceo', status: 'Pendiente' },
        ]
    },
];

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
});