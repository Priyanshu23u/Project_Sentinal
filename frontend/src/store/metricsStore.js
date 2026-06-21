import { create } from "zustand";

const useMetricsStore = create((set) => ({
  metrics: {
    rps: 0,
    success: 0,
    failure: 0,
    activeRoutes: 0,
    circuitState: "CLOSED",
  },

  history: [],

  setMetrics: (data) =>
    set((state) => {

      const history = [
        ...state.history,
        {
          time: new Date().toLocaleTimeString(),
          rps: data.rps,
          success: data.success,
          failure: data.failure,
        },
      ].slice(-50);

      return {
        metrics: data,
        history,
      };
    }),
}));

export default useMetricsStore;