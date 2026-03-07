import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const Service = ({ title, status }) => {
    const renderIcon = () => {
        switch (status) {
            case "Finalizado":
                return (
                    <Feather name="check-circle" size={18} color="#22C55E" />
                );
            case "En Proceso":
                return <Feather name="clock" size={18} color="#FFD43B" />;
            case "Pendiente":
                return <Feather name="x-circle" size={18} color="#EF4444" />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.servicesRow}>
            <Text style={styles.servicesText}>•  {title}</Text>
            {renderIcon()}
        </View>
    );
};

export default Service;

const styles = {
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
};