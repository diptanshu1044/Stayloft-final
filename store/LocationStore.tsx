import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  isLocationEnabled: boolean;
  ifUserHasDeclinedToEnable: boolean;
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, long: number) => void;
  setIsLocationEnabled: (enabled: boolean) => void;
  setUserDeclined: (declined: boolean) => void;
  clearLocationData: () => void;
}

const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      isLocationEnabled: false,
      ifUserHasDeclinedToEnable: false,
      latitude: null,
      longitude: null,
      setLocation: (lat, long) => set({ latitude: lat, longitude: long }),
      setIsLocationEnabled: (enabled) => set({ isLocationEnabled: enabled }),
      setUserDeclined: (declined) =>
        set({ ifUserHasDeclinedToEnable: declined }),
      clearLocationData: () =>
        set({
          isLocationEnabled: false,
          ifUserHasDeclinedToEnable: false,
          latitude: null,
          longitude: null,
        }),
    }),
    {
      name: "location-storage", // localStorage key
    },
  ),
);

export default useLocationStore;
