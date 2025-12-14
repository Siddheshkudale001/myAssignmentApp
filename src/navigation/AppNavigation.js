// src/navigation/AppNavigation.js
import { useEffect, useState } from "react";
import RootNavigator from "./RootNavigator";

export default function AppNavigation() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSplashDone, setIsSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsSplashDone(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <RootNavigator
      isSignedIn={isSignedIn}
      setIsSignedIn={setIsSignedIn}
      isSplashDone={isSplashDone}
    />
  );
}
