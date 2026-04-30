import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav";
import OrderCard from "../components/OrderCard";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const weekDays = ["L","M","M","J","V","S","D"];

const mockOrders = {
  "2026-03-06": [
    {
      id: 1,
      vehicle: "Ford F-150",
      service: "Diagnóstico de motor",
      plate: "PL-9988",
      time: "02:30 PM",
      status: "PENDIENTE"
    }
  ],
  "2026-03-07": [
    {
      id: 2,
      vehicle: "Toyota RAV4",
      service: "Servicio de mantenimiento",
      plate: "TX-5544",
      time: "09:00 AM",
      status: "PROGRAMADO"
    },
    {
      id: 3,
      vehicle: "BMW X5",
      service: "Cambio de aceite",
      plate: "BM-2233",
      time: "11:00 AM",
      status: "PROGRAMADO"
    }
  ]
};

export default function AgendaScreen() {
const navigation = useNavigation();
const insets = useSafeAreaInsets();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [filterType, setFilterType] = useState("day");
  const [expandedId, setExpandedId] = useState(null);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`;
  const allDates = Object.keys(mockOrders);

  let filteredOrders = [];

  if (filterType === "day") {
    filteredOrders = mockOrders[formattedDate] || [];
  }

  if (filterType === "month") {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}`;
    filteredOrders = allDates
      .filter(date => date.startsWith(monthPrefix))
      .flatMap(date => mockOrders[date]);
  }

  if (filterType === "week") {
    const selectedDate = new Date(formattedDate);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    filteredOrders = allDates
      .filter(date => {
        const d = new Date(date);
        return d >= startOfWeek && d <= endOfWeek;
      })
      .flatMap(date => mockOrders[date]);
  }

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1);
  };

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView
  style={[styles.container, { paddingBottom: insets.bottom }]}
  edges={["top","bottom"]}
>

        <ScrollView
         style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          shwsVerticalScrollIndicator={false}
        >

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Órdenes programadas</Text>
          </View>

          <View style={styles.monthRow}>
            <Pressable onPress={goPrevMonth}>
              <Feather name="chevron-left" size={22} color="#fff" />
            </Pressable>

            <Text style={styles.monthText}>
              {months[currentMonth]} {currentYear}
            </Text>

            <Pressable onPress={goNextMonth}>
              <Feather name="chevron-right" size={22} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {[...Array(startOffset).fill(null), ...Array(daysInMonth).keys()]
              .map((value, i) => {

                if (value === null) {
                  return <View key={i} style={styles.dayBox} />;
                }

                const day = value + 1;
                const isSelected = selectedDay === day;

                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.dayBox,
                      isSelected && styles.selectedDay
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && { color: "#000" }
                    ]}>
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
          </View>

          <View style={styles.filterRow}>
            {["day","week","month"].map(type => (
              <Pressable
                key={type}
                onPress={() => setFilterType(type)}
                style={[
                  styles.filterButton,
                  filterType === type && styles.activeFilter
                ]}
              >
                <Text style={[
                  styles.filterText,
                  filterType === type && { color: "#000" }
                ]}>
                  {type === "day" ? "Día" : type === "week" ? "Semana" : "Mes"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.repairsTitle}>Órdenes</Text>

          {filteredOrders.length === 0 ? (
            <Text style={styles.noRepairs}>
              No hay órdenes para este filtro.
            </Text>
          ) : (
           filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                type={
                  order.status === "PENDIENTE"
                    ? "active"
                    : order.status === "PROGRAMADO"
                    ? "upcoming"
                    : "completed"
                }
                vehicleYear="2026"
                vehicleBrand={order.vehicle.split(" ")[0]}
                vehicleModel={order.vehicle.split(" ").slice(1).join(" ")}
                vehiclePlate={order.plate}
                services={[
                  {
                    id: 1,
                    title: order.service,
                    status: "pending"
                  }
                ]}
                notes="Sin notas"
                time={order.time}
                mileage="15000"
                navigation={navigation}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
            ))
          )}

        </ScrollView>

        <BottomNav active="Agenda" />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1115",
    paddingHorizontal: 18,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  headerRow: {
    marginTop: 20,
  marginBottom: 10,
  },

  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  monthText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  weekDayText: {
    width: "14.28%",
    textAlign: "center",
    color: "#8B90A0",
    fontSize: 12,
    fontWeight: "600",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
  },

  dayBox: {
    width: "14.28%",
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  selectedDay: {
    backgroundColor: "#FFD43B",
    borderRadius: 8,
  },

  dayText: {
    color: "#fff",
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 8,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#1A1D24",
    borderRadius: 20,
  },

  activeFilter: {
    backgroundColor: "#FFD43B",
  },

  filterText: {
    color: "#fff",
    fontSize: 13,
  },

  repairsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  noRepairs: {
    color: "#888",
    fontSize: 14,
  },

  orderCard: {
    flexDirection: "row",
    backgroundColor: "#1A1D24",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
  },

  vehicle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  service: {
    color: "#8B90A0",
    fontSize: 12,
    marginTop: 4,
  },

  timeText: {
    color: "#8B90A0",
    fontSize: 12,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  pendingBadge: {
    backgroundColor: "#FFD43B",
  },

  programmedBadge: {
    borderWidth: 1,
    borderColor: "#FFD43B",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  pendingText: {
    color: "#000",
  },

  programmedText: {
    color: "#FFD43B",
  },
});