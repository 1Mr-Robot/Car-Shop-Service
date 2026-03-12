import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Pressable,
    FlatList,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import { useNavigation } from "@react-navigation/native"; //NAVEGACION
import { descending } from "firebase/firestore/pipelines";
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';

const servicesData = [                                           //CREAR LISTA SOLO FRONT, BACKEND CONSULTA -> JSON
    {
        id: "1",
        name: "Alineación y balanceo",
        description: "Ajuste de posición de las llants"
    },
    {
        id: "2",
        name: "Cambio de filtro de aire acondicionado",
        description: "Reemplazo del filtro del aire acondicionado"
    },
    {
        id: "3",
        name: "Lavado de motor",
        description: "Lavado exprés de motor"
    },
    {
        id: "4",
        name: "Cambio de aceite",
        description: "Incluye filtro y hasta 5 litros de aceite sintetico"
    },
    {
        id: "5",
        name: "Inflado de llantas con nitrogeno",
        description: "Inflado y calibración de llantas con nitrógeno"
    },
    {
        id: "6",
        name: "Rotación de llantas",
        description: "Intercambio de posición de llantas para desgaste uniforme"
    },
    {
        id: "7",
        name: "Balanceo de llantas",
        description: "Corrección de vibraciones en ruedas"
    },
    {
        id: "8",
        name: "Cambio de balatas",
        description: "Reemplazo de balatas delanteras o traseras"
    },
    {
        id: "9",
        name: "Rectificación de discos",
        description: "Ajuste de discos de freno para eliminar vibración"
    },
    {
        id: "10",
        name: "Revisión de frenos",
        description: "Inspección del sistema de frenado"
    },
    {
        id: "11",
        name: "Diagnóstico con escáner",
        description: "Lectura de códigos de falla del vehículo"
    },
    {
        id: "12",
        name: "Cambio de batería",
        description: "Instalación de batería nueva"
    },
    {
        id: "13",
        name: "Revisión de batería",
        description: "Prueba de carga y estado de batería"
    },
    {
        id: "14",
        name: "Cambio de bujías",
        description: "Reemplazo de bujías del motor"
    },
    {
        id: "15",
        name: "Cambio de filtro de aire",
        description: "Reemplazo del filtro de aire del motor"
    },
    {
        id: "16",
        name: "Cambio de filtro de gasolina",
        description: "Reemplazo del filtro de combustible"
    },
    {
        id: "17",
        name: "Cambio de anticongelante",
        description: "Sustitución del refrigerante del motor"
    },
    {
        id: "18",
        name: "Cambio de líquido de frenos",
        description: "Reemplazo del líquido del sistema de frenos"
    },
    {
        id: "19",
        name: "Cambio de aceite de transmisión",
        description: "Reemplazo del aceite de la transmisión"
    },
    {
        id: "20",
        name: "Afinación mayor",
        description: "Servicio completo de afinación del motor"
    },
    {
        id: "21",
        name: "Afinación menor",
        description: "Revisión básica y ajustes del motor"
    },

];

const Service = ({ name, description }) => (
    <View style={{
        paddingVertical: 12,
        paddingHorizontal: 15
    }}>
        <Text style={styles.serviceTitle}>{name}</Text>
        <Text style={styles.subText}>{description}</Text>
    </View>
);

export default function AddServiceScreen(){
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    return(

        <SafeAreaProvider>
            <SafeAreaView
                style={[styles.container, { }]}
                edges={["top", "bottom"]}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                }}>
                    <Pressable 
                        onPress={() => navigation.goBack()}  //IR ATRAS
                        hitSlop={12}
                        style={{ padding: 1}}
                        >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={24}
                            color={"#ffff"}                       
                        />           
                    </Pressable>
                    <Text
                    style={{
                        color: "#ffff",
                        fontSize: 18,
                        fontWeight: "",
                        marginLeft: 0,
                        flex: 1,
                        textAlign: "center"
                    }}                  //PONER EL NUMERO DE ORDEM               
                    >
                        Agregar Servicios

                    </Text>    
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: "#2A2F36",
                    width: "100%"
                }}>
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <Text style={[styles.carTitle]}>Servicios Comunes</Text>                  
                </View>
                <View style={{
                    marginTop: 1
                }}>
                    <Text style={[styles.subText]}>Selecciona uno o mas servicios requeridos para este vehiculo</Text>  
                </View>
                <FlatList style={{marginTop: 25}}
                    data={servicesData}
                    renderItem={({ item }) => <Service 
                        name={item.name}
                        description={item.description}
                        />}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={()=> (
                        <View style={styles.hr}></View>
                    )}
                    showsVerticalScrollIndicator={false}
                />                                  
                <Pressable style={styles.productButton}>               
                    <Text style={styles.productButtonText}>Servicio Personalizado</Text>
                </Pressable>
                <View style={{flexDirection:"row", gap:15}}>
                    <View style={[styles.card, styles.half]}>
                        <Text style={[styles.subText]}>Nuevos Servicios</Text>  
                        <Text style={styles.carTitle}>3</Text>
                    </View>
                    <Pressable style={[styles.primaryButton, styles.half]}>
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    </Pressable>
                </View>
 
            </SafeAreaView>
        </SafeAreaProvider>

    );
//PRESSABLE 'SERVICIO PERSONALIZADO' OPCIONAL PERO ESTARIA PERRO QUE JALE
//PRESSABLE 'AGREGAR' ACTUALIZAR ORDEN AGREGANDO LOS SERVICIOS SELECCIONADOS
//NUEVOS SERVICIOS IGUAL OPCIONAL +1 CADA QUE SE SELECCIONA UN SERVICIO
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
    },
    hr: {
        height: 1,
        backgroundColor: "#2A2F36",
        width: "100%",
    },
    sectionLabel: {
        color: "#8B90A0",
        fontSize: 13,
        letterSpacing: 1,
        marginBottom: 15,
        marginTop: 10,
    },
    card: {
        backgroundColor: "#1A1D24",
        borderRadius: 20,
        padding: 10,
        alignItems: "flex-start",
        marginTop:10
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    carTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    subText: {
        color: "#8B90A0",
        fontSize: 13,
        marginTop: 4,
    },
    serviceTitle: {
        color: "#ffff",
        fontSize: 16,
        marginTop: 4,
        maxWidth: 280
    },
    badge: {
        backgroundColor: "rgba(255,212,59,0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: "#FFD43B",
        fontSize: 12,
        fontWeight: "600",
    },
    primaryButton: {
        backgroundColor: "#FFD43B",
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: "center",
        marginTop:10,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    primaryButtonText: {
        color: "#000",
        fontWeight: "700",
        fontSize: 20
    },
    secondaryButtonText: {
        color: "#ffff",
        fontWeight: "700",
    },
    assignmentCard: {
        backgroundColor: "#14161C",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1F222B",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    smallButton: {
        backgroundColor: "#FFD43B",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    smallButtonText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 12,
    },
    taskCard: {
        backgroundColor: "#1A1D24",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    iconCircleDark: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#14161C",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    completedCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#2ECC71",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    timeText: {
        color: "#8B90A0",
        fontSize: 11,
        marginBottom: 6,
        textAlign: "right",
    },
    statusBadge: {
        borderWidth: 1,
        borderColor: "#FFD43B",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusText: {
        color: "#FFD43B",
        fontSize: 10,
    },
    price: {
        color: "#FFD43B",
        fontWeight: "700",
        fontSize: 16,
    },
    priorityBadge: {
        backgroundColor: "#402225",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    priorityText: {
        color: "#FF4D4F",
        fontSize: 11,
    },
    fab: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "#FFD43B",
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },
    half: {
        flex: 1
    },
    productButton: {
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 15,
        borderColor: "#FACC15",
        borderWidth: 1.5,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    productButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    serviceButton: {
        backgroundColor: "#111827",
        paddingVertical: 14,
        borderRadius: 15,
        borderColor: "#FACC15",
        borderWidth: 1.5,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    }
});
