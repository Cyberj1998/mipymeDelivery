import useCartStore from "@/store/CartSlice";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();

  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const cart = useCartStore((state) => state.cart);
  const theme = useCartStore((state) => state.theme);

  const [totalQuantityDisplay, setTotalQuantityDisplay] = useState(0);

  useEffect(() => {
    setTotalQuantityDisplay(getTotalQuantity());
  }, [cart]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: insets.bottom > 0 ? insets.bottom : 10,
            left: 20,
            right: 20,
            height: 60,
            backgroundColor: theme === "light" ? "#488dd7" : "#b0a1d5",
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#488dd7",
        tabBarInactiveTintColor: "#333333",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: focused ? "#FFFFFF" : "transparent" },
              ]}
            >
              <Image
                style={[
                  styles.icon,
                  { tintColor: focused ? "#488dd7" : "#333333" },
                ]}
                source={require("../../assets/images/store.png")}
                contentFit="cover"
              />
              <Text style={styles.title}>TIENDA</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: focused ? "#ffffff" : "transparent" },
              ]}
            >
              <Text style={styles.totalQuantity}>{totalQuantityDisplay}</Text>
              <Image
                style={[
                  styles.icon,
                  { tintColor: focused ? "#488dd7" : "#333333" },
                ]}
                source={require("../../assets/images/cart.png")}
                contentFit="cover"
              />
              <Text style={styles.title}>CARRITO</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    borderRadius: 100,
    paddingBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    position: "absolute",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  iconWrapper: {
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 10,
    fontWeight: 500,
  },
  totalQuantity: {
    position: "absolute",
    top: 0,
    right: 0,
    marginTop: -8,
    fontWeight: 500,
    fontSize: 20,
  },
});
