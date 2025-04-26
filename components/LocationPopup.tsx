// components/LocationPopup.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import useLocationStore from "@/store/LocationStore";

export default function LocationPopup({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLocationEnabled, ifUserHasDeclinedToEnable, setLocation, setIsLocationEnabled, setUserDeclined } = useLocationStore();

  useEffect(() => {
    // Don't show popup if user has already made a choice
    if (isLocationEnabled || ifUserHasDeclinedToEnable) {
      onClose();
    }
  }, [isLocationEnabled, ifUserHasDeclinedToEnable, onClose]);

  const handleGetLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get("/api/properties/nearby", {
            params: { lat: latitude, lng: longitude },
          });
          setLocation(latitude, longitude);
          setIsLocationEnabled(true);
          onClose(); // Close popup after fetching
        } catch (err) {
          console.error("Failed to fetch nearby properties:", err);
          setError("Failed to fetch nearby properties.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied.");
        setUserDeclined(true);
        setLoading(false);
        onClose();
      },
    );
  };

  const handleDecline = () => {
    setUserDeclined(true);
    onClose();
  };

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div>
        <p className="mb-2">
          We can show you properties near your current location.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleGetLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Allow Location Access
          </button>
          <button
            onClick={handleDecline}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            Not Now
          </button>
        </div>

        {loading && <p className="mt-2">Loading nearby properties...</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </Modal>
  );
}
