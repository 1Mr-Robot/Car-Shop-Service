import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Pressable,
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const CreateVehicleScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const clientId = route.params?.clientId;
    const clientName = route.params?.clientName || "Cliente";

    const [formData, setFormData] = useState({
        id_cliente: clientId,
        marca: "",
        modelo: "",
        anio: "",
        color: "",
        matricula: "",
        niv: "",
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return (
            formData.id_cliente &&
            formData.marca.trim() &&
            formData.modelo.trim() &&
            formData.anio &&
            formData.color.trim() &&
            formData.matricula.trim()
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert("Campos obligatorios", "Por favor completa todos los campos requeridos.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                id_cliente: formData.id_cliente,
                marca: formData.marca.trim(),
                modelo: formData.modelo.trim(),
                anio: parseInt(formData.anio),
                color: formData.color.trim(),
                matricula: formData.matricula.trim().toUpperCase(),
                niv: formData.niv.trim() || null,
            };

            await AdminService.createVehicle(payload);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error al crear vehículo:", error);
            Alert.alert("Error", "No se pudo crear el vehículo. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigation.goBack();
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
                    placeholder={isRequired ? `Ingresa ${label.toLowerCase()}` : `Opcional`}
                    placeholderTextColor="#555"
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={[styles.container, { paddingBottom: 160 }]} edges={["top", "bottom"]}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nuevo Vehículo</Text>
                    <View style={{ width: 24 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={10}
                >
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 0 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.sectionTitle}>Datos del Vehículo</Text>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Dueño <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={clientName}
                                    editable={false}
                                    placeholderTextColor="#555"
                                />
                            </View>
                        </View>

                        {renderInput("Marca", "marca", true)}
                        {renderInput("Modelo", "modelo", true)}

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Año <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity 
                                style={styles.inputContainer}
                                onPress={() => setShowYearPicker(true)}
                            >
                                <Text style={[styles.inputText, !formData.anio && styles.placeholderText]}>
                                    {formData.anio || "Seleccionar año..."}
                                </Text>
                                <Feather name="chevron-down" size={20} color="#888" style={styles.inputIcon} />
                            </TouchableOpacity>
                        </View>

                        {renderInput("Color", "color", true)}
                        {renderInput("Matrícula", "matricula", true)}
                        {renderInput("NIV", "niv", false)}
                    </ScrollView>
                </KeyboardAvoidingView>

                <Modal visible={showYearPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.pickerModalContent}>
                            <View style={styles.pickerHeader}>
                                <Text style={styles.pickerTitle}>Seleccionar Año</Text>
                                <Pressable onPress={() => setShowYearPicker(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            <ScrollView>
                                {years.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.pickerOption,
                                            formData.anio === year && styles.pickerOptionSelected,
                                        ]}
                                        onPress={() => {
                                            updateField("anio", year.toString());
                                            setShowYearPicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            formData.anio === year && styles.pickerOptionTextSelected,
                                        ]}>
                                            {year}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleSuccessClose}
                >
                    <View style={styles.modalOverlayCenter}>
                        <View style={styles.modalContentSuccess}>
                            <Feather name="check-circle" size={70} color="#22C55E" />
                            <Text style={styles.modalTitle}>Vehículo creado</Text>
                            <Text style={styles.modalText}>
                                El vehículo se ha registrado exitosamente.
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
                            <Text style={styles.submitButtonText}>Crear Vehículo</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <BottomNavReceptionist active="HomeReceptionist" />
            </View>
        </SafeAreaProvider>
    );
};

export default CreateVehicleScreen;

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
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flex: 1,
    },
    inputText: {
        color: "#fff",
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flex: 1,
    },
    inputIcon: {
        marginRight: 16,
    },
    placeholderText: {
        color: "#555",
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
        justifyContent: "flex-end",
    },
    modalOverlayCenter: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    pickerModalContent: {
        backgroundColor: "#1A1D23",
        borderRadius: 24,
        paddingBottom: 30,
        maxHeight: "60%",
        width: "90%",
        alignSelf: "center",
        marginVertical: "auto",
    },
    pickerHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
    },
    pickerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    pickerOption: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
    },
    pickerOptionSelected: {
        backgroundColor: "rgba(255, 212, 59, 0.1)",
    },
    pickerOptionText: {
        color: "#fff",
        fontSize: 16,
    },
    pickerOptionTextSelected: {
        color: "#FFD43B",
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