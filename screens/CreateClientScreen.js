import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
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

const CreateClientScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        rfc: "",
        celular: "",
        correo: "",
        direccion: "",
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return (
            formData.nombre.trim() &&
            formData.apellido_paterno.trim() &&
            formData.celular.trim()
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert("Campos obligatorios", "Por favor completa nombre, apellido paterno y celular.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                nombre: formData.nombre.trim(),
                apellido_paterno: formData.apellido_paterno.trim(),
                apellido_materno: formData.apellido_materno.trim() || null,
                rfc: formData.rfc.trim() || null,
                celular: formData.celular.trim(),
                correo: formData.correo.trim() || null,
                direccion: formData.direccion.trim() || null,
            };

            await AdminService.createClient(payload);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error al crear cliente:", error);
            Alert.alert("Error", "No se pudo crear el cliente. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigation.goBack();
    };

    const renderInput = (label, field, isRequired = false, isMultiline = false, keyboardType = "default") => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>
                {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={[styles.inputContainer, isMultiline && { height: 100 }]}>
                <TextInput
                    style={[styles.input, isMultiline && { height: "100%", textAlignVertical: "top" }]}
                    value={formData[field]}
                    onChangeText={(text) => updateField(field, text)}
                    placeholder={isRequired ? `Ingresa ${label.toLowerCase()}` : `Opcional`}
                    placeholderTextColor="#555"
                    keyboardType={keyboardType}
                    multiline={isMultiline}
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
                    <Text style={styles.headerTitle}>Nuevo Cliente</Text>
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
                        <Text style={styles.sectionTitle}>Datos del Cliente</Text>

                        {renderInput("Nombre", "nombre", true)}
                        {renderInput("Apellido Paterno", "apellido_paterno", true)}
                        {renderInput("Apellido Materno", "apellido_materno")}
                        {renderInput("RFC", "rfc", false, false, "default")}
                        {renderInput("Celular", "celular", true, false, "phone")}
                        {renderInput("Correo", "correo", false, false, "email-address")}
                        {renderInput("Dirección", "direccion", false, true)}
                    </ScrollView>
                </KeyboardAvoidingView>

                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleSuccessClose}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContentSuccess}>
                            <Feather name="check-circle" size={70} color="#22C55E" />
                            <Text style={styles.modalTitle}>Cliente creado</Text>
                            <Text style={styles.modalText}>
                                El cliente se ha registrado exitosamente.
                            </Text>
                            <TouchableOpacity 
                                style={styles.successButton}
                                onPress={handleSuccessClose}
                            >
                                <Text style={styles.successButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
                            <Text style={styles.submitButtonText}>Crear Cliente</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <BottomNavReceptionist active="HomeReceptionist" />
            </View>
        </SafeAreaProvider>
    );
};

export default CreateClientScreen;

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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContentSuccess: {
        backgroundColor: "#1A1D23",
        borderRadius: 24,
        padding: 30,
        alignItems: "center",
        marginHorizontal: 20,
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 8,
    },
    modalText: {
        color: "#888",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },
    successButton: {
        backgroundColor: "#22C55E",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    successButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});