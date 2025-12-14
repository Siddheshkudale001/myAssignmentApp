import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { getUserSession } from "../../services/session";

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runAnimation = () => {
      return new Promise(resolve => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });
    };

    const checkSessionAndNavigate = async () => {
      await runAnimation();

      const user = await getUserSession();

      // Give animation breathing room
      setTimeout(() => {
        if (navigation && navigation.replace) {
          navigation.replace(user ? "Home" : "AuthFlow");
        }
      }, 400);
    };

    checkSessionAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/logo.webp")}
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
  },
});
