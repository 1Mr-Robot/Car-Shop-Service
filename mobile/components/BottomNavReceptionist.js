import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';

export default function BottomNavReceptionist({ active }) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const activeColor = "#FFD43B";
    const inactiveColor = "#888";

    return (
        <View style={[styles.bottomBar, { bottom: insets.bottom || 0 }]}>
            <View style={styles.container}>
                <Pressable onPress={() => navigation.navigate("HomeReceptionist")}>
                    <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color={active === "HomeReceptionist" ? activeColor : inactiveColor}
                    />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("CartScreen")}>
                    <Feather
                        name="shopping-cart"
                        size={24}
                        color={active === "CartScreen" ? activeColor : inactiveColor}
                    />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("InventoryScreen")}>
                    <Feather
                        name="package"
                        size={24}
                        color={active === "InventoryScreen" ? activeColor : inactiveColor}
                    />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("SalesHistory")}>
                    <MaterialCommunityIcons
                        name="history"
                        size={24}
                        color={active === "SalesHistory" ? activeColor : inactiveColor}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#15181E",
        height: 70,
    },
    container: {
        width: "100%",
        height: "100%",
        maxWidth: 600,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 10,
    }
});