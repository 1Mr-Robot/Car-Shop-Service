import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import BottomNavReceptionist from "../components/BottomNavReceptionist";
import { StatusBar } from "expo-status-bar";
import AdminService from "../services/AdminService";

const CreateProductScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        sku: "",
        codigo_barras: "",
        marca: "",
        nombre: "",
        vehiculos_compatibles: "",
        descripcion: "",
        cantidad_stock: "",
        precio_compra: "",
        precio_venta: "",
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return (
            formData.sku.trim() &&
            formData.nombre.trim() &&
            formData.marca.trim() &&
            formData.cantidad_stock.trim() &&
            formData.precio_compra.trim() &&
            formData.precio_venta.trim()
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert("Error", "Por favor completa los campos requeridos.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                sku: formData.sku.trim(),
                codigo_barras: formData.codigo_barras.trim() || null,
                nombre: formData.nombre.trim(),
                marca: formData.marca.trim(),
                vehiculos_compatibles: formData.vehiculos_compatibles.trim() || null,
                descripcion: formData.descripcion.trim() || null,
                cantidad_stock: parseInt(formData.cantidad_stock),
                precio_compra: parseFloat(formData.precio_compra),
                precio_venta: parseFloat(formData.precio_venta),
            };

            await AdminService.createProducto(payload);
            Alert.alert("Éxito", "Producto creado correctamente.", [
                { text: "Aceptar", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Error creando producto:", error);
            Alert.alert("Error", "No se pudo crear el producto.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInput = (label, field, isRequired = false, keyboardType = "default") => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>
                {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={formData[field]}
                    onChangeText={(text) => updateField(field, text)}
                    placeholder={isRequired ? `Ingresa ${label.toLowerCase()}` : "Opcional"}
                    placeholderTextColor="#555"
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nuevo Producto</Text>
                    <View style={{ width: 24 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={10}
                >
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 180 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.sectionTitle}>Datos del Producto</Text>

                        {renderInput("SKU", "sku", true)}
                        {renderInput("Código de Barras", "codigo_barras")}
                        {renderInput("Marca", "marca", true)}
                        {renderInput("Nombre", "nombre", true)}
                        {renderInput("Vehículos Compatibles", "vehiculos_compatibles")}
                        {renderInput("Descripción", "descripcion")}
                        
                        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Inventario</Text>
                        
                        {renderInput("Cantidad en Stock", "cantidad_stock", true, "numeric")}
                        {renderInput("Precio de Compra", "precio_compra", true, "decimal")}
                        {renderInput("Precio de Venta", "precio_venta", true, "decimal")}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <View style={styles.bottom}>
                <View style={[styles.footer, { bottom: insets.bottom || 0 }]}>
                    <TouchableOpacity 
                        style={[styles.submitButton, (!isFormValid() || isSubmitting) && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.submitButtonText}>Crear Producto</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <BottomNavReceptionist active="InventoryScreen" />
            </View>
        </SafeAreaProvider>
    );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1A1D23",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    sectionTitle: {
        color: "#FFD43B",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
        marginTop: 24,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        color: "#888",
        fontSize: 14,
        marginBottom: 8,
    },
    required: {
        color: "#FF4D4D",
    },
    inputContainer: {
        backgroundColor: "#1A1D23",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    input: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 160,
    },
    footer: {
        padding: 18,
        backgroundColor: "#0F1115",
        borderTopWidth: 1,
        borderTopColor: "#1A1D23",
        height: 90,
    },
    submitButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
});