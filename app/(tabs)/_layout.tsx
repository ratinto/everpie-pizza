import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { CartProvider } from "@/context/cart-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  useColorScheme();

  return (
    <CartProvider>
      <Tabs
        tabBar={(props) => <UnifiedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={23}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    height: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2f2f2f",
  },
  navLabelActive: {
    color: "#0078a8",
    fontWeight: "600",
  },
});

function UnifiedTabBar({ state, navigation }: any) {
  const isHomeFocused = state.routes[state.index]?.name === "index";
  const isMenuFocused = state.routes[state.index]?.name === "menu";

  return (
    <View style={styles.barContainer}>
      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("index")}
      >
        <Ionicons
          name={isHomeFocused ? "home" : "home-outline"}
          size={20}
          color={isHomeFocused ? "#0078a8" : "#8b8b8b"}
        />
        <Text style={[styles.navLabel, isHomeFocused && styles.navLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("menu")}
      >
        <Ionicons
          name="reorder-three-outline"
          size={20}
          color={isMenuFocused ? "#0078a8" : "#595959"}
        />
        <Text style={[styles.navLabel, isMenuFocused && styles.navLabelActive]}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
