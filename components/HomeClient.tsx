// components/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import LocationPopup from "./LocationPopup";
import useLocationStore from "@/store/LocationStore";

export default function HomeClient() {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const { isLocationEnabled, ifUserHasDeclinedToEnable } = useLocationStore();

  useEffect(() => {
    // Only show popup if user hasn't made a choice yet
    if (!isLocationEnabled && !ifUserHasDeclinedToEnable) {
      setShowLocationPopup(true);
    }
  }, [isLocationEnabled, ifUserHasDeclinedToEnable]);

  return (
    <>
      <LocationPopup
        show={showLocationPopup}
        onClose={() => setShowLocationPopup(false)}
      />
      {/* Other client-side UI */}
    </>
  );
}
