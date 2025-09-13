import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import TreesScreen from "../screens/TreesScreen";
import CommunityScreen from "../screens/CommunityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewPhotoScreen from "../screens/NewPhotoScreen";
import ScanAIScreen from "../screens/ScanAIScreen";

const Tab = createBottomTabNavigator();

export default function Tabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2e7d32", // verde activo
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#f9f9f9",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Trees":
              iconName = "leaf-outline";
              break;
            case "NewPhoto":
              iconName = "camera-outline";
              break;
            case "ScanIA":
              iconName = "scan-outline";
              break;
            case "Community":
              iconName = "people-outline";
              break;
            case "Profile":
              iconName = "person-circle-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trees" component={TreesScreen} />
      <Tab.Screen name="NewPhoto" component={NewPhotoScreen} />
      <Tab.Screen name="ScanIA" component={ScanAIScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ onLogout }}
      />
    </Tab.Navigator>
  );
}
