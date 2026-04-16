//OrderCard
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Service from "./Service";

// id -> No Modificar
const OrderCard = ({ id, type, vehicleYear, vehicleBrand, vehicleModel, vehiclePlate, vehicleColor, ownerName, services, notes, time, mileage, navigation, expandedId, setExpandedId, mechanicName, showDetailsButton = true }) => {
    const isExpanded = expandedId === `${type}-${vehiclePlate}`;
    
    const handlePress = () => {
        setExpandedId(isExpanded ? null : `${type}-${vehiclePlate}`);
    };

    const getIconConfig = () => {
        switch (type) {
            case 'active':
                return { iconFamily: 'Feather', icon: 'tool', bgColor: '#FFD43B', stripColor: '#FFD43B' };
            case 'upcoming':
                return { iconFamily: 'Ionicons', icon: 'time-outline', bgColor: '#FFD43B', stripColor: null };
            case 'completed':
                return { iconFamily: 'Ionicons', icon: 'checkmark', bgColor: '#1E7D32', stripColor: null, color: '#fff' };
            default:
                return { iconFamily: 'Feather', icon: 'tool', bgColor: '#FFD43B', stripColor: '#FFD43B' };
        }
    };

    const iconConfig = getIconConfig();

    const renderIcon = () => {
        const iconProps = { size: 20, color: iconConfig.color || "#000" };
        if (iconConfig.iconFamily === 'Ionicons') {
            return <Ionicons name={iconConfig.icon} {...iconProps} />;
        }
        return <Feather name={iconConfig.icon} {...iconProps} />;
    };

    const vehicleText = `${vehicleYear} ${vehicleBrand} ${vehicleModel} • ${vehiclePlate}`;

    const getStatusText = () => {
        switch (type) {
            case 'active': return 'EN PROGRESO';
            case 'upcoming': return 'PROGRAMADO';
            case 'completed': return 'COMPLETADO';
            default: return '';
        }
    };

    const getStatusStyle = () => {
        switch (type) {
            case 'active': return styles.inProgress;
            case 'upcoming': return styles.scheduled;
            case 'completed': return styles.completed;
            default: return {};
        }
    };

    const getDetailsButtonStyle = () => {
        if (type === 'active') {
            return styles.detailsButtonActive;
        }
        return styles.detailsButton;
    };

    const getDetailsButtonTextStyle = () => {
        if (type === 'active') {
            return styles.detailsButtonTextActive;
        }
        return styles.detailsButtonText;
    };

    return (
        <View style={styles.orderCard}>
            {type === 'active' && <View style={[styles.yellowStrip, { backgroundColor: iconConfig.stripColor }]} />}

            <View style={[styles.iconContainer, { backgroundColor: iconConfig.bgColor }]}>
                {renderIcon()}
            </View>

            <TouchableOpacity style={{ flex: 1 }} onPress={handlePress} activeOpacity={0.8}>
                <View style={styles.rowBetween}>
                    <Text style={getStatusStyle()}>{getStatusText()}</Text>
                    <View style={styles.timeRow}>
                        <Text style={styles.since}>
                            {type === 'active' ? `Desde las ${time}` : time}
                        </Text>
                        <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={16} 
                            color="#777" 
                            style={{ marginLeft: 8 }}
                        />
                    </View>
                </View>

                <Text style={styles.jobTitle}>{vehicleText}</Text>

                {mechanicName && (
                    <View style={styles.mechanicRow}>
                        <Feather name="user" size={12} color="#888" />
                        <Text style={styles.mechanicText}>{mechanicName}</Text>
                    </View>
                )}

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        {services.map((item) => (
                            <Service
                                key={item.id}
                                title={item.title}
                                status={item.status}
                            />
                        ))}

                        {(type === 'active' || type === 'upcoming') && notes && (
                            <View style={styles.notesSection}>
                                <View style={styles.notesHeader}>
                                    <Ionicons name="document-text-outline" size={14} color="#FFD43B" />
                                    <Text style={styles.notesLabel}>Notas del cliente</Text>
                                </View>
                                <Text style={styles.notesText}>{notes}</Text>
                            </View>
                        )}

                        {showDetailsButton && (
                            <TouchableOpacity 
                            style={getDetailsButtonStyle()} 
                            onPress={() => {
                                const serviceInfo = services.map(s => s.title).join(', ') || 'Servicio general';
                                switch(type){
                                    case 'completed':
                                        navigation.navigate('LastService', { 
                                            orderId: id,  // id -> No Modificar
                                            vehicle: `${vehicleYear} ${vehicleBrand} ${vehicleModel}`,
                                            plate: vehiclePlate,
                                            vehicleColor: vehicleColor,
                                            ownerName: ownerName,
                                            service: serviceInfo,
                                            servicesList: services,
                                            mileage: mileage,
                                            notes: notes || ''
                                        });
                                        break;
                                    case 'upcoming':
                                        navigation.navigate('NextService', { 
                                            orderId: id,  // id -> No Modificar
                                            vehicle: `${vehicleYear} ${vehicleBrand} ${vehicleModel}`,
                                            plate: vehiclePlate,
                                            vehicleColor: vehicleColor,
                                            ownerName: ownerName,
                                            service: serviceInfo,
                                            servicesList: services,
                                            mileage: mileage,
                                            notes: notes || ''
                                        });
                                        break;
                                    case 'active':
                                        navigation.navigate('OrderDetails', { 
                                            orderId: id,  // id -> No Modificar
                                            vehicle: `${vehicleYear} ${vehicleBrand} ${vehicleModel}`,
                                            plate: vehiclePlate,
                                            vehicleColor: vehicleColor,
                                            ownerName: ownerName,
                                            service: serviceInfo,
                                            servicesList: services,
                                            mileage: mileage,
                                            notes: notes || ''
                                        });
                                        break;
                                }
                            }}
                        >
                            <Text style={getDetailsButtonTextStyle()}>Detalles</Text>
                            <Feather name="chevron-right" size={14} color={type === 'active' ? "#000" : "#FFD43B"} />
                        </TouchableOpacity>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default OrderCard;

const styles = {
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

    mechanicRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },

    mechanicText: {
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

    detailsButtonActive: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 15,
        backgroundColor: "#FFD43B",
    },

    detailsButtonText: {
        color: "#FFD43B",
        fontSize: 13,
        fontWeight: "600",
        marginRight: 4,
    },

    detailsButtonTextActive: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
        marginRight: 4,
    },
};