import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import OrdersScreen from "./screens/OrdersScreen";
import AgendaScreen from "./screens/AgendaScreen";
import AddServiceScreen from "./screens/AddServiceScreen";

import PastRepairsScreen from "./screens/PastRepairsScreen";
import OrderDetailsScreen from "./screens/OrderDetailsScreen";
import NextServiceScreen from "./screens/NextServiceScreen";
import LastServiceScreen from "./screens/LastServiceScreen";
import AddProductScreen  from "./screens/AddProductScreen";

import { app } from "./firebaseConfig";


const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        // Firebase connection
        if (app) {
            console.log("Firebase successfully connected!");
            console.log("Proyect initialized as:", app.name);
        }
        // Fondo de la barra
        NavigationBar.setBackgroundColorAsync("#000000");

        // Iconos blancos
        NavigationBar.setButtonStyleAsync("light");
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Orders"
                    component={OrdersScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Agenda"
                    component={AgendaScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen

                     name="PastRepairs"
                     component={PastRepairsScreen}
                     options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OrderDetails"
                    component={OrderDetailsScreen}
                    options={{ headerShown: false}}
                />
                <Stack.Screen
                    name="AddService"
                    component={AddServiceScreen}
                    options={{ headerShown: false}}
                />
                <Stack.Screen
                    name="NextService"
                    component={NextServiceScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LastService"
                    component={LastServiceScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AddProduct"
                    component={AddProductScreen}
                    options={{ headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
