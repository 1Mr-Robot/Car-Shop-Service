import React from "react";
import { View, Text, StyleSheet } from "react-native";

const VehicleCard = ({
    status, // 'active', 'upcoming', 'completed'
    vehicleYear,
    vehicleBrand,
    vehicleModel,
    owner,
    color,
    plate,
    mileage,
    vin,
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case "active":
                return {
                    text: "EN CURSO",
                    style: styles.badgeActive,
                    textStyle: styles.badgeTextActive,
                };
            case "upcoming":
                return {
                    text: "PROGRAMADO",
                    style: styles.badgeUpcoming,
                    textStyle: styles.badgeTextUpcoming,
                };
            case "completed":
                return {
                    text: "COMPLETADO",
                    style: styles.badgeCompleted,
                    textStyle: styles.badgeTextCompleted,
                };
            default:
                return {
                    text: "EN CURSO",
                    style: styles.badgeActive,
                    textStyle: styles.badgeTextActive,
                };
        }
    };

    const statusConfig = getStatusConfig();
    const vehicleText = `${vehicleYear} ${vehicleBrand} ${vehicleModel}`;

    return (
        <View style={styles.card}>
            <View style={styles.rowBetween}>
                <Text style={styles.carTitle}>{vehicleText}</Text>
                <View style={[styles.badge, statusConfig.style]}>
                    <Text style={[styles.badgeText, statusConfig.textStyle]}>
                        {statusConfig.text}
                    </Text>
                </View>
            </View>
            <Text style={styles.subText}>Dueño: {owner}</Text>
            <View style={[styles.row, { marginTop: 20 }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>COLOR</Text>
                    <Text style={styles.value}>{color}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>PLACA</Text>
                    <Text style={styles.value}>{plate}</Text>
                </View>
            </View>
            <View style={[styles.row, { marginTop: 20 }]}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>KILOMETRAJE</Text>
                    <Text style={styles.value}>{mileage}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>VIN/NIV</Text>
                    <Text style={styles.value}>{vin}</Text>
                </View>
            </View>
        </View>
    );
};

export default VehicleCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    carTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        flex: 1,
    },
    subText: {
        color: "#8B90A0",
        fontSize: 13,
        marginTop: 4,
    },
    label: {
        color: "#8B90A0",
        fontSize: 12,
    },
    value: {
        color: "white",
        fontSize: 14,
        marginTop: 3,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeActive: {
        backgroundColor: "rgba(255,212,59,0.15)",
    },
    badgeTextActive: {
        color: "#FFD43B",
    },
    badgeUpcoming: {
        backgroundColor: "rgba(59,130,246,0.15)",
    },
    badgeTextUpcoming: {
        color: "#3B82F6",
    },
    badgeCompleted: {
        backgroundColor: "rgba(34,197,94,0.15)",
    },
    badgeTextCompleted: {
        color: "#22C55E",
    },
});