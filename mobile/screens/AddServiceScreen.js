import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    Modal,
    ActivityIndicator, 
    Alert
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets
} from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Checkbox } from 'expo-checkbox';

import CatalogService from "../services/CatalogService";
import OrderService from "../services/OrderService";


const formatPrice = (price) => `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

const SelectableService = ({ id, name, description, price, isSelected, isAlreadyAdded, onToggle }) => (
    <Pressable 
        style={[styles.selectableItem, isAlreadyAdded && styles.selectableItemDisabled]}
        onPress={() => onToggle(id)}
    >
        <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.serviceTitle, isAlreadyAdded && styles.serviceTitleDisabled]}>{name}</Text>
            {description ? <Text style={[styles.subText, isAlreadyAdded && styles.subTextDisabled]}>{description}</Text> : null}
            <Text style={[styles.priceText, isAlreadyAdded && styles.priceTextDisabled]}>{formatPrice(price)}</Text>
        </View>
        {isAlreadyAdded ? (
            <MaterialCommunityIcons name="check-circle" size={24} color="#4ADE80" />
        ) : (
            <Checkbox
                value={isSelected}
                onValueChange={() => onToggle(id)}
                color={isSelected ? '#FFD43B' : undefined}
            />
        )}
    </Pressable>
);

export default function AddServiceScreen({ navigation, route }){
    const insets = useSafeAreaInsets();
    const { orderId } = route.params || {}; 

    // Estados Catálogo Regular
    const [services, setServices] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingServiceIds, setExistingServiceIds] = useState([]);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicateServiceName, setDuplicateServiceName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar servicios del catálogo
                const catalogData = await CatalogService.getServices({ limit: 50 });
                
                const formattedServices = catalogData.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.descripcion, 
                    price: parseFloat(s.precio_mano_obra || 0)
                }));
                
                setServices(formattedServices);

                // Cargar servicios ya existentes en la orden
                const orderServicesData = await OrderService.getOrderServices(orderId);
                const existingIds = orderServicesData.data
                    .filter(os => os.id_servicio !== null)
                    .map(os => os.id_servicio);
                setExistingServiceIds(existingIds);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                Alert.alert("Error", "No se pudo cargar los datos necesarios.");
            } finally {
                setIsLoadingInit(false);
            }
        };
        fetchData();
    }, [orderId]);

    const toggleSelection = (serviceId) => {
        const service = services.find(s => s.id === serviceId);
        
        if (existingServiceIds.includes(serviceId)) {
            setDuplicateServiceName(service?.name || "este servicio");
            setShowDuplicateModal(true);
            return;
        }
        
        setSelectedServiceIds((prev) => 
            prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
        );
    };

    // Cálculos Financieros
    const totalToAdd = services
        .filter(s => selectedServiceIds.includes(s.id))
        .reduce((sum, s) => sum + s.price, 0);

    // POST: Servicios de Catálogo
    const handleAddServicesToOrder = async () => {
        if (selectedServiceIds.length === 0) return;
        setIsSubmitting(true);
        try {
            await OrderService.addServicesToOrder(orderId, selectedServiceIds);
            setIsSubmitting(false);
            navigation.navigate("Home"); 
        } catch (error) {
            setIsSubmitting(false);
            const errorMessage = error.response?.data?.error || "No se pudieron agregar los servicios.";
            if (error.response?.data?.duplicates) {
                Alert.alert("Servicios Duplicados", errorMessage);
            } else {
                Alert.alert("Error", errorMessage);
            }
        }
    };

    if (isLoadingInit) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FFD43B" />
                    <Text style={{ color: "#888", marginTop: 15 }}>Cargando catálogo...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return(
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                
                <View style={styles.navHeader}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={{ padding: 1}}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={"#ffff"} />           
                    </Pressable>
                    <Text style={styles.navTitle}>Orden #{orderId || '---'}</Text>    
                </View>
                <View style={styles.hr} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 20, marginBottom: 6 }}>
                        <Text style={styles.sectionTitleText}>CATÁLOGO DE SERVICIOS</Text>                  
                    </View>
                    <Text style={styles.subText}>Selecciona los servicios del catálogo.</Text>

                    <View style={styles.listContainer}>
                        {services.map((item, index) => (
                            <View key={item.id}>
                                <SelectableService
                                    id={item.id} 
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    isSelected={selectedServiceIds.includes(item.id)}
                                    isAlreadyAdded={existingServiceIds.includes(item.id)}
                                    onToggle={toggleSelection}
                                />
                                {index < services.length - 1 && <View style={styles.hrLight} />}
                            </View>
                        ))}
                    </View>

                    {/* RESUMEN DE VENTA / ORDEN (Consistencia con AddProductScreen) */}

                </ScrollView>
                <View>
                    <Text style={styles.summaryTitle}>Resumen de agregado</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Servicios Seleccionados</Text>
                        <Text style={styles.summaryValue}>{selectedServiceIds.length}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total agregado</Text>
                        <Text style={styles.totalValue}>{formatPrice(totalToAdd)}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.checkoutButton, (isSubmitting || selectedServiceIds.length === 0) && { opacity: 0.5 }]}
                        onPress={handleAddServicesToOrder}
                        disabled={isSubmitting || selectedServiceIds.length === 0}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text style={styles.checkoutButtonText}>Añadir a la Orden</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* MODAL: CARGANDO (MUTACIÓN) */}
                <Modal visible={isSubmitting} transparent={true} animationType="fade">
                    <View style={styles.modalOverlayDark}>
                        <View style={styles.modalContentSmall}>
                            <ActivityIndicator size="large" color="#FFD43B" style={{ marginBottom: 20 }} />
                            <Text style={[styles.modalTitle, { textAlign: 'center', color: "white" }]}>Actualizando Orden...</Text>
                            <Text style={styles.modalText}>Registrando servicios en el taller.</Text>
                        </View>
                    </View>
                </Modal>

                {/* MODAL: SERVICIO DUPLICADO */}
                <Modal visible={showDuplicateModal} transparent={true} animationType="fade" onRequestClose={() => setShowDuplicateModal(false)}>
                    <View style={styles.modalOverlayDark}>
                        <View style={styles.modalContentSmall}>
                            <MaterialCommunityIcons name="alert-circle" size={50} color="#FFD43B" style={{ marginBottom: 10 }} />
                            <Text style={[styles.modalTitle, { textAlign: 'center', fontSize: 18, color: "white" }]}>Servicio Duplicado</Text>
                            <Text style={styles.modalText}>El servicio "{duplicateServiceName}" ya está agregado a esta orden.</Text>
                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={() => setShowDuplicateModal(false)}
                            >
                                <Text style={[styles.checkoutButtonText, { paddingHorizontal: 20 }]}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    navHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 0, 
        paddingVertical: 10 
    },
    navTitle: { 
        color: "#ffff", 
        fontSize: 20, 
        fontWeight: "bold", 
        flex: 1, 
        textAlign: "center",
        marginRight: 24 
    },
    hr: {
        height: 1,
        backgroundColor: "#2A2F36",
        width: "100%",
    },
    hrLight: {
        height: 1,
        backgroundColor: "#2A2F36",
        width: "100%",
        opacity: 0.5
    },
    sectionTitleText: {
        color: "#8B90A0",
        fontSize: 14,
        fontWeight: "600",
    },
    subText: {
        color: "#8B90A0",
        fontSize: 13,
        marginBottom: 15
    },
    listContainer: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        paddingVertical: 5,
        marginBottom: 15
    },
    selectableItem: { 
        paddingVertical: 16, 
        paddingHorizontal: 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
    },
    serviceTitle: {
        color: "#ffff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4
    },
    priceText: {
        color: "#9CA3AF",
        size: 14,
        marginTop: 6,
        fontWeight: "600"
    },
    selectableItemDisabled: {
        opacity: 0.6,
    },
    serviceTitleDisabled: {
        color: "#9CA3AF",
    },
    subTextDisabled: {
        color: "#6B7280",
    },
    priceTextDisabled: {
        color: "#6B7280",
    },
    summaryCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 24,
        marginTop: 10,
        marginBottom: 0,
    },
    summaryTitle: {
        color: "#FFD43B",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 15,
        marginTop: 10
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        alignItems: "center"
    },
    summaryLabel: {
        color: "#9CA3AF",
        fontSize: 15,
    },
    summaryValue: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    totalValue: {
        color: "#FFD43B",
        fontSize: 24,
        fontWeight: "700",
    },
    checkoutButton: {
        backgroundColor: "#FFD43B",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        borderRadius: 16,
        marginTop: 10,
    },
    checkoutButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "700",
    },
    modalOverlayDark: { 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.8)", 
        justifyContent: "center", 
        alignItems: "center" 
    },
    modalContentSmall: { 
        backgroundColor: "#1A1D23", 
        borderRadius: 20, 
        padding: 30, 
        width: "85%", 
        alignItems: "center" 
    },
    modalText: { 
        color: "#888", 
        fontSize: 14, 
        textAlign: "center" 
    },
});