import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./i18n";
import { PreferencesService } from "./services/PreferencesService";
import { Settings } from "./types";

const applyTheme = async () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const settings: Settings | null = await PreferencesService.loadPreference(
    "settings"
  );
  const theme = settings ? settings.theme : prefersDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
};

applyTheme();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
