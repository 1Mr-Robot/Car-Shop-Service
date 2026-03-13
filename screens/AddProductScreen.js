import React, { useState } from "react";
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

const productsData = [                                           //CREAR LISTA SOLO FRONT, BACKEND CONSULTA -> JSON
    {
        id: "1",
        name: "Aceite de motor 5W-30"
    },
    {
        id: "2",
        name: "Filtro de aceite"
    },
    {
        id: "3",
        name: "Filtro de aire"
    },
    {
        id: "4",
        name: "Filtro de gasolina"
    },
    {
        id: "5",
        name: "Bujía"
    },
    {
        id: "6",
        name: "Pastillas de freno"
    },
    {
        id: "7",
        name: "Disco de freno"
    },
    {
        id: "8",
        name: "Anticongelante"
    },
    {
        id: "9",
        name: "Líquido de frenos"
    },
    {
        id: "10",
        name: "Batería"
    }

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

const AddProductScreen= ({navigation, route}) => {
    // No Modificar: orderId
    const { orderId, vehicle, plate, service, mileage, notes } = route.params || {};
    const insets = useSafeAreaInsets();

return (
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
                        Agregar Productos

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
                    <Text style={[styles.carTitle]}>Lista de productos</Text>                  
                </View>
                <View style={{
                    marginTop: 1
                }}>
                    <Text style={[styles.subText]}>Selecciona uno o mas productos requeridos para este vehiculo</Text>  
                </View>
                <FlatList style={{marginTop: 25}}
                    data={productsData}
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
                <View style={{flexDirection:"row", gap:15}}>
                    <View style={[styles.card, styles.half]}>
                        <Text style={[styles.subText]}>Total de Productos</Text>  
                        <Text style={styles.carTitle}>3</Text>
                    </View>
                    <Pressable style={[styles.primaryButton, styles.half]}>
                        <Text style={styles.primaryButtonText}>Continuar</Text>
                    </Pressable>
                </View>
 
            </SafeAreaView>
        </SafeAreaProvider>

  );
}

export default AddProductScreen;

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