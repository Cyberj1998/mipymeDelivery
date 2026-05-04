import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();

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
          title: "Tienda",
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
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Carrito",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: focused ? "#ffffff" : "transparent" },
              ]}
            >
              <Image
                style={[
                  styles.icon,
                  { tintColor: focused ? "#488dd7" : "#333333" },
                ]}
                source={require("../../assets/images/cart.png")}
                contentFit="cover"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#488dd7",
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
    width: 45,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
