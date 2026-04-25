import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    FlatList,
    Modal,
    ActivityIndicator,
    TextInput, 
    Alert
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets
} from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Checkbox } from 'expo-checkbox';

import CatalogService from "../services/CatalogService";
import OrderService from "../services/OrderService";


const formatPrice = (price) => `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

const SelectableService = ({ id, name, description, price, isSelected, onToggle }) => (
    <Pressable 
        style={styles.selectableItem}
        onPress={() => onToggle(id)}
    >
        <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.serviceTitle}>{name}</Text>
            {description ? <Text style={styles.subText}>{description}</Text> : null}
            <Text style={styles.priceText}>{formatPrice(price)}</Text>
        </View>
        <Checkbox
            value={isSelected}
            onValueChange={() => onToggle(id)}
            color={isSelected ? '#FFD43B' : undefined}
        />
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

    // Estados Servicio Personalizado
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customDesc, setCustomDesc] = useState("");
    const [customPrice, setCustomPrice] = useState("");

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const data = await CatalogService.getServices({ limit: 50 });
                
                // FIX: Normalizamos los datos (descripcion de BD a description de UI)
                const formattedServices = data.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.descripcion, 
                    price: parseFloat(s.precio_mano_obra || 0)
                }));
                
                setServices(formattedServices);
            } catch (error) {
                console.error("Error al cargar servicios:", error);
                Alert.alert("Error", "No se pudo cargar el catálogo de servicios.");
            } finally {
                setIsLoadingInit(false);
            }
        };
        fetchCatalog();
    }, []);

    const toggleSelection = (serviceId) => {
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
            Alert.alert("Error", "No se pudieron agregar los servicios.");
        }
    };

    // POST: Servicio Personalizado
    const handleAddCustomService = async () => {
        if (!customDesc.trim() || !customPrice.trim()) {
            Alert.alert("Campos incompletos", "Define la descripción y el precio estimado.");
            return;
        }

        setIsSubmitting(true);
        try {
            await OrderService.addCustomService(orderId, customDesc, customPrice);
            setIsSubmitting(false);
            setShowCustomModal(false);
            navigation.navigate("Home");
        } catch (error) {
            setIsSubmitting(false);
            Alert.alert("Error", "No se pudo crear el servicio personalizado.");
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
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={styles.sectionTitleText}>CATÁLOGO DE SERVICIOS</Text>                  
                        <TouchableOpacity 
                            style={styles.customServiceBtn} 
                            onPress={() => setShowCustomModal(true)}
                        >
                            <Feather name="plus" size={14} color="#000" />
                            <Text style={styles.customServiceBtnText}>Personalizado</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subText}>Selecciona del catálogo base o crea uno al vuelo.</Text>

                    <View style={styles.listContainer}>
                        {services.map((item, index) => (
                            <View key={item.id}>
                                <SelectableService
                                    id={item.id} 
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    isSelected={selectedServiceIds.includes(item.id)}
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

                {/* MODAL 1: CREAR SERVICIO PERSONALIZADO */}
                <Modal visible={showCustomModal} transparent={true} animationType="slide" onRequestClose={() => setShowCustomModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 }}>
                                <Text style={styles.modalTitle}>Servicio Extra / Imprevisto</Text>
                                <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                                    <Feather name="x" size={24} color="#888" />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.inputLabel}>Descripción del Trabajo</Text>
                            <TextInput 
                                style={styles.inputField}
                                placeholder="Ej. Soldadura de mofle especial..."
                                placeholderTextColor="#666"
                                value={customDesc}
                                onChangeText={setCustomDesc}
                                multiline
                            />

                            <Text style={styles.inputLabel}>Precio / Costo Estimado ($)</Text>
                            <TextInput 
                                style={styles.inputField}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                value={customPrice}
                                onChangeText={setCustomPrice}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity 
                                style={[styles.checkoutButton, { marginTop: 25 }]} 
                                onPress={handleAddCustomService}
                            >
                                <Text style={styles.checkoutButtonText}>Guardar y Añadir a la Orden</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* MODAL 2: CARGANDO (MUTACIÓN) */}
                <Modal visible={isSubmitting} transparent={true} animationType="fade">
                    <View style={styles.modalOverlayDark}>
                        <View style={styles.modalContentSmall}>
                            <ActivityIndicator size="large" color="#FFD43B" style={{ marginBottom: 20 }} />
                            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Actualizando Orden...</Text>
                            <Text style={styles.modalText}>Registrando servicios en el taller.</Text>
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
        fontSize: 14,
        marginTop: 6,
        fontWeight: "600"
    },
    customServiceBtn: { 
        backgroundColor: "#FFD43B", 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 14, 
        paddingVertical: 8, 
        borderRadius: 20, 
        gap: 6 
    },
    customServiceBtnText: { 
        color: "#000", 
        fontWeight: "bold", 
        fontSize: 12 
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
    modalOverlay: { 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.7)", 
        justifyContent: "flex-end" 
    },
    modalContent: { 
        backgroundColor: "#1A1D24", 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 25, 
        paddingBottom: 50 
    },
    modalTitle: { 
        color: "#fff", 
        fontSize: 20, 
        fontWeight: "bold" 
    },
    inputLabel: { 
        color: "#FFD43B", 
        fontSize: 13, 
        fontWeight: "600", 
        marginBottom: 8, 
        marginTop: 15 
    },
    inputField: { 
        backgroundColor: "#0F1115", 
        color: "#fff", 
        borderRadius: 12, 
        padding: 15, 
        fontSize: 16, 
        borderWidth: 1, 
        borderColor: "#2A2F36" 
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