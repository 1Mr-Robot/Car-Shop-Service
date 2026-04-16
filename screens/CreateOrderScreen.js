import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    Pressable,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const INITIAL_CLIENTS = [
    { id: "c1", name: "Juan Pérez", phone: "555-123-4567" },
    { id: "c2", name: "María López", phone: "555-234-5678" },
    { id: "c3", name: "Roberto García", phone: "555-345-6789" },
    { id: "c4", name: "Luis Hernández", phone: "555-456-7890" },
    { id: "c5", name: "Sofia Ramírez", phone: "555-567-8901" },
    { id: "c6", name: "Ana Torres", phone: "555-678-9012" },
    { id: "c7", name: "Carlos Martínez", phone: "555-789-0123" },
];

const INITIAL_MECHANICS = [
    { id: "m1", name: "Carlos Martínez", specialty: "General" },
    { id: "m2", name: "Pedro Sánchez", specialty: "Motor" },
    { id: "m3", name: "Ana Torres", specialty: "Eléctrico" },
    { id: "m4", name: "Roberto Lima", specialty: "Frenos" },
];

const INITIAL_SERVICES = [
    { id: "s1", name: "Alineación y balanceo" },
    { id: "s2", name: "Cambio de aceite" },
    { id: "s3", name: "Revisión de frenos" },
    { id: "s4", name: "Diagnóstico con escáner" },
    { id: "s5", name: "Cambio de batería" },
    { id: "s6", name: "Cambio de filtros" },
    { id: "s7", name: "Rotación de llantas" },
    { id: "s8", name: "Lavado interior" },
];

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
        days.push({ day: null, disabled: true });
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isSunday = date.getDay() === 0;
        days.push({ day: i, disabled: isPast || isSunday });
    }
    
    return days;
};

const DatePickerModal = ({ visible, onClose, onSelect, initialDate }) => {
    const [currentDate, setCurrentDate] = useState(initialDate || new Date());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const calendarDays = generateCalendarDays(currentYear, currentMonth);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDayPress = (day) => {
        if (!day.disabled && day.day) {
            const selectedDate = new Date(currentYear, currentMonth, day.day);
            onSelect(selectedDate);
        }
    };

    const today = new Date();
    const isPastMonth = currentYear < today.getFullYear() || 
        (currentYear === today.getFullYear() && currentMonth < today.getMonth());

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={[styles.pickerModalContent, { maxHeight: "60%" }]}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Seleccionar Fecha</Text>
                        <Pressable onPress={onClose}>
                            <Feather name="x" size={24} color="#fff" />
                        </Pressable>
                    </View>
                    
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                            <Feather name="chevron-left" size={24} color="#FFD43B" />
                        </TouchableOpacity>
                        <Text style={styles.calendarMonthYear}>
                            {MONTHS[currentMonth]} {currentYear}
                        </Text>
                        <TouchableOpacity 
                            onPress={goToNextMonth} 
                            style={styles.calendarNavButton}
                            disabled={isPastMonth && currentMonth === today.getMonth()}
                        >
                            <Feather 
                                name="chevron-right" 
                                size={24} 
                                color={isPastMonth && currentMonth === today.getMonth() ? "#444" : "#FFD43B"} 
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.calendarGrid}>
                        {DAYS_OF_WEEK.map((day, index) => (
                            <View key={index} style={styles.calendarDayHeader}>
                                <Text style={styles.calendarDayHeaderText}>{day}</Text>
                            </View>
                        ))}
                        {calendarDays.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.calendarDay,
                                    !item.day && styles.calendarDayEmpty,
                                    item.day && !item.disabled && styles.calendarDayEnabled,
                                    item.day && item.disabled && styles.calendarDayDisabled,
                                ]}
                                onPress={() => handleDayPress(item)}
                                disabled={!item.day || item.disabled}
                            >
                                {item.day && (
                                    <Text style={[
                                        styles.calendarDayText,
                                        item.disabled && styles.calendarDayTextDisabled,
                                    ]}>
                                        {item.day}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.pickerFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const TimePickerModal = ({ visible, onClose, onSelect, initialTime }) => {
    const [selectedHour, setSelectedHour] = useState(initialTime ? parseInt(initialTime.split(":")[0]) : 9);
    const [selectedMinute, setSelectedMinute] = useState(initialTime ? parseInt(initialTime.split(":")[1]) : 0);

    const hours = Array.from({ length: 12 }, (_, i) => i + 8);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

    const formatTime = (hour, minute) => {
        const h = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        return `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    const handleConfirm = () => {
        const timeString = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
        onSelect(timeString);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={[styles.pickerModalContent, { maxHeight: "50%" }]}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Seleccionar Hora</Text>
                        <Pressable onPress={onClose}>
                            <Feather name="x" size={24} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.timePickerContainer}>
                        <View style={styles.timeColumn}>
                            <Text style={styles.timeColumnLabel}>Hora</Text>
                            <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                                {hours.map((hour) => (
                                    <TouchableOpacity
                                        key={hour}
                                        style={[
                                            styles.timeOption,
                                            selectedHour === hour && styles.timeOptionSelected,
                                        ]}
                                        onPress={() => setSelectedHour(hour)}
                                    >
                                        <Text style={[
                                            styles.timeOptionText,
                                            selectedHour === hour && styles.timeOptionTextSelected,
                                        ]}>
                                            {hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.timeColumn}>
                            <Text style={styles.timeColumnLabel}>Minuto</Text>
                            <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                                {minutes.map((minute) => (
                                    <TouchableOpacity
                                        key={minute}
                                        style={[
                                            styles.timeOption,
                                            selectedMinute === minute && styles.timeOptionSelected,
                                        ]}
                                        onPress={() => setSelectedMinute(minute)}
                                    >
                                        <Text style={[
                                            styles.timeOptionText,
                                            selectedMinute === minute && styles.timeOptionTextSelected,
                                        ]}>
                                            {minute.toString().padStart(2, "0")}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.selectedTimePreview}>
                        <Text style={styles.selectedTimeText}>
                            {formatTime(selectedHour, selectedMinute)}
                        </Text>
                    </View>

                    <View style={styles.pickerFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const CreateOrderScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [mileage, setMileage] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);

    const [showClientModal, setShowClientModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showMechanicModal, setShowMechanicModal] = useState(false);
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [tempDate, setTempDate] = useState(new Date());

    const clientVehicles = selectedClient ? [
        { id: "v1", brand: "Toyota", model: "Corolla", year: "2020", plate: "ABC-1234" },
        { id: "v2", brand: "Honda", model: "Civic", year: "2018", plate: "XYZ-5678" },
    ] : [];

    const toggleService = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const isFormValid = () => {
        return selectedClient && 
               selectedVehicle && 
               selectedMechanic && 
               mileage.trim() && 
               scheduledDate.trim() && 
               startTime.trim() &&
               selectedServices.length > 0;
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }
        
        const orderData = {
            client: selectedClient,
            vehicle: selectedVehicle,
            mileage,
            scheduledDate,
            startTime,
            services: selectedServices,
            notes,
            mechanic: selectedMechanic
        };
        
        console.log("Nueva orden creada:", orderData);
        alert("Orden creada exitosamente");
        navigation.goBack();
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    };

    const formatTimeDisplay = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${hour12}:${minutes} ${ampm}`;
    };

    const handleDateSelect = (date) => {
        setScheduledDate(date.toISOString());
        setShowDatePicker(false);
    };

    const handleTimeSelect = (time) => {
        setStartTime(time);
        setShowTimePicker(false);
    };

    const renderSelectButton = (label, value, onPress, isRequired = true) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>
                {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity style={styles.selectButton} onPress={onPress}>
                <Text style={[styles.selectText, !value && styles.placeholderText]}>
                    {value || "Seleccionar..."}
                </Text>
                <Feather name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Nueva Orden de Servicio</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <Text style={styles.sectionTitle}>Información del Cliente</Text>
                    
                    {renderSelectButton("Dueño", selectedClient?.name, () => setShowClientModal(true))}
                    
                    {renderSelectButton("Auto", selectedVehicle ? 
                        `${selectedVehicle.year} ${selectedVehicle.brand} ${selectedVehicle.model}` : null, 
                        () => selectedClient ? setShowVehicleModal(true) : alert("Primero selecciona un dueño"),
                        true
                    )}

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Kilometraje <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={mileage}
                                onChangeText={setMileage}
                                placeholder="Ej: 45,000 km"
                                placeholderTextColor="#555"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Programación</Text>

                    <View style={styles.row}>
                        <View style={[styles.fieldContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Fecha programada <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity 
                                style={styles.selectButton} 
                                onPress={() => {
                                    setTempDate(scheduledDate ? new Date(scheduledDate) : new Date());
                                    setShowDatePicker(true);
                                }}
                            >
                                <Text style={[styles.selectText, !scheduledDate && styles.placeholderText]}>
                                    {scheduledDate ? formatDateDisplay(scheduledDate) : "DD/MM/AAAA"}
                                </Text>
                                <Feather name="calendar" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 12 }} />
                        <View style={[styles.fieldContainer, { flex: 1 }]}>
                            <Text style={styles.label}>Hora de inicio <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity 
                                style={styles.selectButton} 
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={[styles.selectText, !startTime && styles.placeholderText]}>
                                    {startTime ? formatTimeDisplay(startTime) : "HH:MM"}
                                </Text>
                                <Feather name="clock" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Servicios</Text>
                    
                    <TouchableOpacity 
                        style={styles.servicesButton}
                        onPress={() => setShowServicesModal(true)}
                    >
                        <View style={styles.servicesContent}>
                            <Text style={[styles.selectText, selectedServices.length === 0 && styles.placeholderText]}>
                                {selectedServices.length > 0 
                                    ? `${selectedServices.length} servicio(s) seleccionado(s)`
                                    : "Seleccionar servicios..."}
                            </Text>
                            <Feather name="chevron-down" size={20} color="#888" />
                        </View>
                    </TouchableOpacity>

                    {selectedServices.length > 0 && (
                        <View style={styles.selectedServicesContainer}>
                            {selectedServices.map(serviceId => {
                                const service = INITIAL_SERVICES.find(s => s.id === serviceId);
                                return (
                                    <View key={serviceId} style={styles.serviceChip}>
                                        <Text style={styles.serviceChipText}>{service?.name}</Text>
                                        <Pressable onPress={() => toggleService(serviceId)}>
                                            <Feather name="x" size={16} color="#FF4D4D" />
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Asignación</Text>
                    
                    {renderSelectButton("Mecánico asignado", selectedMechanic?.name, () => setShowMechanicModal(true))}

                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Notas del cliente</Text>
                        <View style={[styles.inputContainer, { height: 100 }]}>
                            <TextInput
                                style={[styles.input, { height: "100%", textAlignVertical: "top" }]}
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Notas adicionales del cliente..."
                                placeholderTextColor="#555"
                                multiline
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!isFormValid()}
                    >
                        <Text style={styles.submitButtonText}>Crear Orden</Text>
                    </TouchableOpacity>
                </View>

                <DatePickerModal
                    visible={showDatePicker}
                    onClose={() => setShowDatePicker(false)}
                    onSelect={handleDateSelect}
                    initialDate={scheduledDate ? new Date(scheduledDate) : new Date()}
                />

                <TimePickerModal
                    visible={showTimePicker}
                    onClose={() => setShowTimePicker(false)}
                    onSelect={handleTimeSelect}
                    initialTime={startTime}
                />

                <Modal visible={showClientModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar Dueño</Text>
                                <Pressable onPress={() => setShowClientModal(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            <FlatList
                                data={INITIAL_CLIENTS}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedClient(item);
                                            setSelectedVehicle(null);
                                            setShowClientModal(false);
                                        }}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={styles.modalItemText}>{item.name}</Text>
                                            <Text style={styles.modalItemSubtext}>{item.phone}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity 
                                style={styles.addNewButton}
                                onPress={() => {
                                    setShowClientModal(false);
                                    alert("Próximamente: Crear nuevo cliente");
                                }}
                            >
                                <Feather name="plus" size={20} color="#FFD43B" />
                                <Text style={styles.addNewButtonText}>Crear nuevo dueño</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={showVehicleModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar Vehículo</Text>
                                <Pressable onPress={() => setShowVehicleModal(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            <FlatList
                                data={clientVehicles}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedVehicle(item);
                                            setShowVehicleModal(false);
                                        }}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={styles.modalItemText}>
                                                {item.year} {item.brand} {item.model}
                                            </Text>
                                            <Text style={styles.modalItemSubtext}>{item.plate}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity 
                                style={styles.addNewButton}
                                onPress={() => {
                                    setShowVehicleModal(false);
                                    alert("Próximamente: Crear nuevo vehículo");
                                }}
                            >
                                <Feather name="plus" size={20} color="#FFD43B" />
                                <Text style={styles.addNewButtonText}>Crear nuevo vehículo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={showMechanicModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar Mecánico</Text>
                                <Pressable onPress={() => setShowMechanicModal(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            <FlatList
                                data={INITIAL_MECHANICS}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setSelectedMechanic(item);
                                            setShowMechanicModal(false);
                                        }}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={styles.modalItemText}>{item.name}</Text>
                                            <Text style={styles.modalItemSubtext}>{item.specialty}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                <Modal visible={showServicesModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { maxHeight: "80%" }]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar Servicios</Text>
                                <Pressable onPress={() => setShowServicesModal(false)}>
                                    <Feather name="x" size={24} color="#fff" />
                                </Pressable>
                            </View>
                            <FlatList
                                data={INITIAL_SERVICES}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={[
                                            styles.modalItem,
                                            selectedServices.includes(item.id) && styles.modalItemSelected
                                        ]}
                                        onPress={() => toggleService(item.id)}
                                    >
                                        <View style={styles.modalItemContent}>
                                            <Text style={[
                                                styles.modalItemText,
                                                selectedServices.includes(item.id) && styles.modalItemTextSelected
                                            ]}>
                                                {item.name}
                                            </Text>
                                        </View>
                                        {selectedServices.includes(item.id) && (
                                            <Feather name="check" size={20} color="#FFD43B" />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity 
                                style={styles.submitButton}
                                onPress={() => setShowServicesModal(false)}
                            >
                                <Text style={styles.submitButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default CreateOrderScreen;

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
    selectButton: {
        backgroundColor: "#1A1D23",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    selectText: {
        color: "#fff",
        fontSize: 16,
    },
    placeholderText: {
        color: "#555",
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
    row: {
        flexDirection: "row",
    },
    servicesButton: {
        backgroundColor: "#1A1D23",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#2A2E38",
    },
    servicesContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectedServicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    serviceChip: {
        backgroundColor: "#1A1D23",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#FFD43B",
    },
    serviceChipText: {
        color: "#FFD43B",
        fontSize: 14,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 18,
        backgroundColor: "#0F1115",
        borderTopWidth: 1,
        borderTopColor: "#1A1D23",
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
    modalContent: {
        backgroundColor: "#1A1D23",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 30,
        maxHeight: "60%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2A2E38",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    modalItemSelected: {
        backgroundColor: "rgba(255, 212, 59, 0.1)",
    },
    modalItemContent: {
        flex: 1,
    },
    modalItemText: {
        color: "#fff",
        fontSize: 16,
    },
    modalItemTextSelected: {
        color: "#FFD43B",
    },
    modalItemSubtext: {
        color: "#888",
        fontSize: 14,
        marginTop: 4,
    },
    addNewButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: "#111827",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FFD43B",
        gap: 8,
    },
    addNewButtonText: {
        color: "#FFD43B",
        fontSize: 16,
        fontWeight: "600",
    },
    pickerModalContent: {
        backgroundColor: "#1A1D23",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 30,
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
    calendarHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    calendarNavButton: {
        padding: 8,
    },
    calendarMonthYear: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
    },
    calendarDayHeader: {
        width: "14.28%",
        alignItems: "center",
        paddingVertical: 8,
    },
    calendarDayHeaderText: {
        color: "#888",
        fontSize: 12,
        fontWeight: "600",
    },
    calendarDay: {
        width: "14.28%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    calendarDayEmpty: {
        backgroundColor: "transparent",
    },
    calendarDayEnabled: {
        backgroundColor: "transparent",
    },
    calendarDayDisabled: {
        backgroundColor: "transparent",
    },
    calendarDayText: {
        color: "#fff",
        fontSize: 16,
    },
    calendarDayTextDisabled: {
        color: "#444",
    },
    timePickerContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        height: 200,
    },
    timeColumn: {
        flex: 1,
        alignItems: "center",
    },
    timeColumnLabel: {
        color: "#888",
        fontSize: 14,
        marginBottom: 12,
    },
    timeScroll: {
        flex: 1,
        width: "100%",
    },
    timeOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 2,
    },
    timeOptionSelected: {
        backgroundColor: "#FFD43B",
    },
    timeOptionText: {
        color: "#fff",
        fontSize: 16,
    },
    timeOptionTextSelected: {
        color: "#000",
        fontWeight: "600",
    },
    selectedTimePreview: {
        alignItems: "center",
        paddingVertical: 16,
    },
    selectedTimeText: {
        color: "#FFD43B",
        fontSize: 24,
        fontWeight: "600",
    },
    pickerFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#333",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#FFD43B",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});