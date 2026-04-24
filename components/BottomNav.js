import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';

export default function BottomNav({ active }) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const activeColor = "#FFD43B";
    const inactiveColor = "#888";

    return (
        <View style={[styles.bottomBar, { bottom: insets.bottom || 0 }]}>
            <Pressable onPress={() => navigation.navigate("Home")}>
                <Ionicons
                    name="grid-outline"
                    size={24}
                    color={active === "Home" ? activeColor : inactiveColor}
                />
            </Pressable>

            <Pressable onPress={() => navigation.navigate("Orders")}>
                <Ionicons
                    name="clipboard-outline"
                    size={24}
                    color={active === "Orders" ? activeColor : inactiveColor}
                />
            </Pressable>

<Pressable onPress={() => navigation.navigate("PastRepairs")}>
    <Feather
        name="archive"
        size={24}
        color={active === "PastRepairs" ? activeColor : inactiveColor}
    />
</Pressable>
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
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 10,
    },
});
