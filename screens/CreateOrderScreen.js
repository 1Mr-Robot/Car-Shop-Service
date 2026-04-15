import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const CreateOrderScreen = ({ navigation }) => {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Feather name="clipboard" size={64} color="#FFD43B" />
                    <Text style={styles.title}>Crear Nueva Orden</Text>
                    <Text style={styles.subtitle}>
                        Esta pantalla está en construcción. Próximamente podrás crear órdenes de servicio aquí.
                    </Text>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default CreateOrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 12,
    },
    subtitle: {
        color: "#888",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 22,
    },
    button: {
        marginTop: 30,
        backgroundColor: "#FFD43B",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});