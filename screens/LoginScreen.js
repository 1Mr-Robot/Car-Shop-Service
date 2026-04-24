import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    Modal,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

//Importaciones de Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig"; 

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        type: "error",
    });

    const showModal = (title, message, type = "error") => {
        setModalConfig({ title, message, type });
        setModalVisible(true);
    };

    const hideModal = () => {
        setModalVisible(false);
    };
    const handleLogin = async () => {
        if (!email || !password) {
            showModal("Error", "Por favor ingresa tu correo y contraseña.");
            return;
        }

        setIsLoading(true);
        try {
            const auth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;
            
            console.log("¡Usuario autenticado en Firebase! UID:", user.uid);
            
            // Enviamos el UID al servidor Node.js
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firebase_uid: user.uid }),
            });

            const data = await response.json();

            // Si PostgreSQL no encuentra al usuario (Error 404) o hay otro error
            if (!response.ok) {
                // Cerramos la sesión en Firebase para que no se quede pegado
                await auth.signOut();
                showModal("Acceso Denegado", data.error || "No estás registrado en el sistema del taller.");
                return;
            }

            console.log("Datos desde PostgreSQL:", data.user);

            // ==================================================================
            // ENRUTAMIENTO BASADO EN RBAC
            // =================================================================
            if (data.user.rol === 'Recepcionista') {
                // Enrutamos a la nueva pantalla base del Recepcionista
                navigation.replace("CreateOrder", { userData: data.user });
            } else if (data.user.rol === 'Mecánico') {
                // Enrutamos al Home clásico del Mecánico
                navigation.replace("Home", { userData: data.user });
            } else {
                showModal("Error", "Tu rol no es válido. Contacta a soporte.");
            }
            
        } catch (error) {
            console.error("Error de Firebase:", error.code);
            // Manejo de errores en español para el usuario
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                showModal("Acceso Denegado", "El correo o la contraseña son incorrectos.");
            } else if (error.code === 'auth/invalid-email') {
                showModal("Error", "El formato del correo no es válido.");
            } else {
                showModal("Error", "Ocurrió un problema al iniciar sesión. Intenta de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "android" ? 0 : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header / Logo */}
                    <View style={styles.header}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.logoImage}
                        />
                        <View style={styles.titleRow}>
                            <Text style={styles.titleWhite}>Car Shop </Text>
                            <Text style={styles.titleYellow}>Service</Text>
                        </View>
                        <Text style={styles.subtitle}>TALLER AUTOMOTRIZ</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.welcomeTitle}>Bienvenido</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Por favor inicia sesión
                        </Text>

                        {/* Email Field */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>CORREO</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    emailFocused && styles.inputWrapperFocused,
                                ]}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder="mecanico@carshop.com"
                                    placeholderTextColor="#555"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    editable={!isLoading} //Bloquear si está cargando
                                />
                            </View>
                        </View>

                        {/* Password Field */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>CONTRASEÑA</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    passwordFocused &&
                                        styles.inputWrapperFocused,
                                ]}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#555"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    editable={!isLoading} //Bloquear si está cargando
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.eyeButton}
                                    activeOpacity={0.7}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.eyeIcon}>
                                        {showPassword ? (
                                            <AntDesign
                                                name="eye-invisible"
                                                size={24}
                                                color="#9A9A9A"
                                            />
                                        ) : (
                                            <AntDesign
                                                name="eye"
                                                size={24}
                                                color="#9A9A9A"
                                            />
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Remember Me + Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.rememberRow}
                                onPress={() => setRememberMe(!rememberMe)}
                                activeOpacity={0.8}
                                disabled={isLoading}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        rememberMe && styles.checkboxActive,
                                    ]}
                                >
                                    {rememberMe && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.rememberText}>
                                    Recuerdame
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        {/* Conectado a la función handleLogin y muestra un loader */}
                        <TouchableOpacity
                            style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
                            onPress={handleLogin}
                            activeOpacity={0.85}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#1a1a1a" />
                            ) : (
                                <Text style={styles.signInText}>
                                    Iniciar Sesión
                                </Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.alertText}>
                            Si olvidaste la contraseña, contacta con tu jefe
                            para que te proporcione una nueva.
                        </Text>
                    </View>
                </ScrollView>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={hideModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={[
                                styles.modalIconContainer,
                                modalConfig.type === "success" && styles.modalIconSuccess
                            ]}>
                                {modalConfig.type === "success" ? (
                                    <Ionicons name="checkmark-circle" size={36} color="#2ECC71" />
                                ) : (
                                    <Ionicons name="alert-circle" size={36} color="#FF4D4D" />
                                )}
                            </View>
                            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                            <Text style={styles.modalText}>{modalConfig.message}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    modalConfig.type === "success" && styles.modalButtonSuccess
                                ]}
                                onPress={hideModal}
                            >
                                <Text style={styles.modalButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const YELLOW = "#F5C518";
const BG = "#1C1C1C";
const CARD_BG = "#252525";
const INPUT_BG = "#2E2E2E";
const TEXT_MUTED = "#888";
const TEXT_LABEL = "#9A9A9A";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 32,
        alignItems: "center",
    },
    // ───── Header ─────
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    logoContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    logoImage: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginBottom: 0,
    },
    logoBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: YELLOW,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: YELLOW,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
    },
    logoSymbol: {
        fontSize: 36,
        color: "#1a1a1a",
    },
    logoGlow: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: YELLOW,
        opacity: 0.15,
        transform: [{ scale: 1.4 }],
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    titleWhite: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    titleYellow: {
        fontSize: 28,
        fontWeight: "800",
        color: YELLOW,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: "600",
        color: TEXT_MUTED,
        letterSpacing: 3,
        marginTop: 4,
    },
    // ───── Card ─────
    card: {
        width: "100%",
        backgroundColor: CARD_BG,
        borderRadius: 24,
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 28,
    },
    welcomeTitle: {
        fontSize: 26,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 6,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginBottom: 28,
    },
    // ───── Fields ─────
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 11,
        fontWeight: "700",
        color: TEXT_LABEL,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: INPUT_BG,
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 54,
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    inputWrapperFocused: {
        borderColor: YELLOW,
    },
    inputIcon: {
        fontSize: 16,
        color: TEXT_MUTED,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#FFFFFF",
        padding: 0,
    },
    eyeButton: {
        padding: 4,
    },
    eyeIcon: {
        fontSize: 16,
        color: TEXT_MUTED,
    },
    // ───── Options Row ─────
    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
        marginTop: 4,
    },
    rememberRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#555",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    checkboxActive: {
        backgroundColor: YELLOW,
        borderColor: YELLOW,
    },
    checkmark: {
        fontSize: 12,
        fontWeight: "800",
        color: "#1a1a1a",
    },
    rememberText: {
        fontSize: 14,
        color: TEXT_MUTED,
    },
    alertText: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginTop: 12,
    },
    // ───── Sign In Button ─────
    signInButton: {
        backgroundColor: YELLOW,
        borderRadius: 16,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: YELLOW,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    signInText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#1a1a1a",
        letterSpacing: 0.5,
    },
    // ───── Register Row ─────
    registerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    registerText: {
        fontSize: 14,
        color: TEXT_MUTED,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "800",
        color: YELLOW,
    },
    // ───── Modal ─────
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: CARD_BG,
        borderRadius: 24,
        padding: 28,
        width: "85%",
        alignItems: "center",
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    modalIconSuccess: {
        backgroundColor: "rgba(46, 204, 113, 0.2)",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    modalText: {
        fontSize: 15,
        color: TEXT_MUTED,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: "#FF4D4D",
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 14,
        width: "100%",
    },
    modalButtonSuccess: {
        backgroundColor: "#2ECC71",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
});