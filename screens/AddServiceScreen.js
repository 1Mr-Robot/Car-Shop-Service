import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    FlatList,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native"; //NAVEGACION
import { Checkbox } from 'expo-checkbox';

// No Modificar: servicesData -> INITIAL_SERVICES - paginacion API: (GET /api/v1/servicios?page=1&limit=7 - 15)
const INITIAL_SERVICES = [                                           //CREAR LISTA SOLO FRONT, BACKEND CONSULTA -> JSON
    {
        id: "1",
        name: "Alineación y balanceo",
    },
    {
        id: "2",
        name: "Cambio de filtro de aire acondicionado",
    },
    {
        id: "3",
        name: "Lavado de motor",
    },
    {
        id: "4",
        name: "Cambio de aceite",
    },
    {
        id: "5",
        name: "Inflado de llantas con nitrogeno",
    },
    {
        id: "6",
        name: "Rotación de llantas",
    },
    {
        id: "7",
        name: "Balanceo de llantas",
    },
    {
        id: "8",
        name: "Cambio de balatas",
    },
    {
        id: "9",
        name: "Rectificación de discos",
    },
    {
        id: "10",
        name: "Revisión de frenos",
    },
    {
        id: "11",
        name: "Diagnóstico con escáner",
    },
    {
        id: "12",
        name: "Cambio de batería",
    },
    {
        id: "13",
        name: "Revisión de batería",
    },
    {
        id: "14",
        name: "Cambio de bujías",
    },
    {
        id: "15",
        name: "Cambio de filtro de aire",
    },
    {
        id: "16",
        name: "Cambio de filtro de gasolina",
    },
    {
        id: "17",
        name: "Cambio de anticongelante",
    },
    {
        id: "18",
        name: "Cambio de líquido de frenos",
    },
    {
        id: "19",
        name: "Cambio de aceite de transmisión",
    },
    {
        id: "20",
        name: "Afinación mayor",
    },
    {
        id: "21",
        name: "Afinación menor",
    },

];

// No modificar: Service -> SelectableService
const SelectableService = ({ id, name, description, isSelected, onToggle }) => (
    <Pressable 
        style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}
        onPress={() => onToggle(id)}
    >
        <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.serviceTitle}>{name}</Text>
            <Text style={styles.subText}>{description}</Text>
        </View>
        <Checkbox
            value={isSelected}
            onValueChange={() => onToggle(id)}
            color={isSelected ? '#FFD43B' : undefined}
        />
    </Pressable>
);

export default function AddServiceScreen(){
    const navigation = useNavigation();
    const route = useRoute(); // No modificar

    const { orderId } = route.params || {}; // No modificar

    // No modificar
    const [availableServices, setAvailableServices] = useState(INITIAL_SERVICES);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    // No modificar: Función para manejar la selección de checkboxes
    const toggleSelection = (serviceId) => {
        setSelectedServiceIds((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter(id => id !== serviceId); // Lo quita
            } else {
                return [...prevSelected, serviceId]; // Lo agrega
            }
        });
    };

    // No modificar Función para manejar el botón "Continuar"
    const handleAddServicesToOrder = () => {
        if (selectedServiceIds.length === 0) {
            alert("Por favor selecciona al menos un servicio.");
            return;
        }

        console.log(`Listo para hacer POST /api/v1/ordenes/${orderId}/servicios`);
        console.log("Servicios seleccionados (IDs):", selectedServiceIds);
        
        // fetch()
        // ...
        navigation.goBack();
    };

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
                        fontWeight: "bold",
                        marginLeft: 0,
                        flex: 1,
                        textAlign: "center"
                    }}                             
                    > 
                        Orden #{orderId || '---'} {/* No modificar */}
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
                    <Text style={[styles.carTitle]}>Catálogo de Servicios</Text>                  
                </View>
                <View style={{
                    marginTop: 1
                }}>
                    <Text style={[styles.subText]}>Selecciona uno o mas servicios requeridos para este vehiculo</Text>  
                </View>

                {/* No modificar */}
                <FlatList 
                    style={{marginTop: 25}}
                    data={availableServices}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SelectableService
                            id={item.id} 
                            name={item.name}
                            description={item.description}
                            isSelected={selectedServiceIds.includes(item.id)}
                            onToggle={toggleSelection}
                        />
                    )}
                    ItemSeparatorComponent={()=> <View style={styles.hr} />}
                    showsVerticalScrollIndicator={false}
                    // No Modificar: boton paginacion api
                    ListFooterComponent={() => (
                        <TouchableOpacity style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#FFD43B' }}>Cargar más servicios...</Text>
                        </TouchableOpacity>                        
                    )}
                />

                <View style={{flexDirection:"row", gap:15, marginTop: 15, marginBottom: 20}}>
                    <View style={[styles.card, styles.half]}>
                        <Text style={[styles.subText]}>Nuevos Servicios</Text>  
                        <Text style={styles.carTitle}>{selectedServiceIds.length}</Text> {/* No modificar: Contador dinámico */}
                    </View>
                    <Pressable 
                        style={[
                            styles.primaryButton,
                            styles.half,
                            { opacity: selectedServiceIds.length > 0 ? 1 : 0.5 }
                            ]}
                            onPress={handleAddServicesToOrder}
                            disabled={selectedServiceIds.length === 0}
                    >
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