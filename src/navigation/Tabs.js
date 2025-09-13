import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import TreesScreen from "../screens/TreesScreen";
import CommunityScreen from "../screens/CommunityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewPhotoScreen from "../screens/NewPhotoScreen";

const Tab = createBottomTabNavigator();

export default function Tabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // ocultar texto, solo iconos
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Trees":
              iconName = focused ? "leaf" : "leaf-outline";
              break;
            case "NewPhoto":
              iconName = focused ? "camera" : "camera-outline";
              break;
            case "Community":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return (
            <View style={styles.iconWrapper}>
              <Ionicons
                name={iconName}
                size={focused ? 30 : 26} // más grande si está activo
                color={focused ? "#2e7d32" : "gray"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trees" component={TreesScreen} />
      <Tab.Screen name="NewPhoto" component={NewPhotoScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ onLogout }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 70,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
