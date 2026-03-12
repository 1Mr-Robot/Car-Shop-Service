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

const DATA = [
    {
        id: '1',
        title: 'Alineación y balanceo',
        status: 'Finalizado'
    },
    {
        id: '2',
        title: 'Cambio filtro aire acondicionado',
        status: 'Pendiente'
    },
    {
        id: '3',
        title: 'Lavado de motor',
        status: 'En Proceso'
    },
    {
        id: '4',
        title: 'Cambio de aceite',
        status: 'En Proceso'
    },
    {
        id: '5',
        title: 'Cambio de filtro de aceite',
        status: 'En Proceso'
    },
    {
        id: '6',
        title: 'Inflado de llantas con nitrogeno',
        status: 'Pendiente'
    },
]


const Item = ({ title, status }) => {
  const renderIcon = () => {
    switch (status) {
      case "Finalizado":
        return <Feather name="check-circle" size={18} color="#22C55E" />;
      case "En Proceso":
        return <Feather name="clock" size={18} color="#FFD43B" />;
      case "Pendiente":
        return <Feather name="x-circle" size={18} color="#EF4444" />;
      default:
        return null;
    }
  };

  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 15,
    }}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        {title}
      </Text>

      {renderIcon()}
    </View>
  );
};


const OrderDetailsScreen= ({navigation, route}) => {
    const { vehicle, plate, service, mileage, notes } = route.params || {};
    const insets = useSafeAreaInsets();
    
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView
                style={[styles.container, { }]}
                edges={["top", "bottom"]}
            >
                <View style={{
                    flexDirection:"row",
                    alignItems: "center",
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: "#0B0F14",
                }}>
                    <Pressable 
                        onPress={() => navigation.navigate("Orders")}
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
                        fontSize: 24,
                        fontWeight: "bold",
                        marginLeft: 20,

                    }}                  //PONER EL NUMERO DE ORDEM               
                    >
                        Orden #341

                    </Text>                    
                </View>

                <ScrollView>
                    <View
                        style={[
                            styles.card,
                            { borderColor: "#FFD43B" },
                            { borderWidth: 1},
                            { marginTop: 15}
                        ]}
                    >
                        <View style={styles.rowBetween}>
                            <View>
                                <Text style={styles.carTitle}>{vehicle}</Text>
                                <View style={{
                                    flexDirection: "row"}}>                                    
                                    <Text style={styles.subText}>{plate}</Text>
                                    <Text style={styles.subText}>   Gris</Text>
                                    <Text style={styles.subText}> {mileage}</Text>
                                </View>
                                                                
                            </View>
                            <View style={{
                                alignItems: "flex-end"
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: "rgba(255,255,255,0.6)",
                                    letterSpacing: 1
                                }}>
                                    Fecha Estimada                
                                </Text>
                                <Text style={{
                                    color: "#FFD43B"
                                }}>
                                    28/02/26</Text>
                            </View>
                        </View>
                    </View>
                    <View 
                        style={[
                            styles.card,
                            {borderColor: "#ffffffa8"},
                            {borderWidth: 1}
                        ]}
                    >
                        <Text style={styles.carTitle}>Servicios</Text>   
                            <FlatList
                                scrollEnabled={false}
                                data={DATA}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <Item title={item.title} status={item.status} />
                            )}
                        />        
                    </View>
                    <View style={[
                        styles.card,
                        {borderColor: "#ffffffa8"},
                        {borderWidth: 1}
                        ]}>
                        <Text style={styles.carTitle}>Notas</Text>
                        <Text style={[
                            { fontSize: 15 },
                            { marginTop: 15},
                            { color: "#969494ff"}                          

                        ]}>{notes}</Text>

                    </View>
                    <View style={{
                            flexDirection: "row",
                            gap: 15
                         }}>
                        <TouchableOpacity style={[styles.productButton, styles.half]}>
                            <Text style={styles.secondaryButtonText}>Agregar Producto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.serviceButton, styles.half]} onPress={() => navigation.navigate("AddService")}>
                            <Text style={styles.secondaryButtonText}>Agregar Servicio</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.primaryButton]}>
                            <Text style={styles.primaryButtonText}>
                                Finalizar
                            </Text>
                    </TouchableOpacity>

                    
                </ScrollView>


            </SafeAreaView>

        </SafeAreaProvider>

  );
}

export default OrderDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F1115",
        paddingHorizontal: 18,
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
        padding: 20,
        marginBottom: 25,
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
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    primaryButtonText: {
        color: "#000",
        fontWeight: "700",
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
