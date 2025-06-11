import fs from "fs/promises";
import { SESSION_FILE } from "./config.js";

export async function saveSession(page) {
  try {
    const cookies = await page.cookies();
    const localStorage = await page.evaluate(() =>
      JSON.stringify(window.localStorage)
    );

    const sessionData = { cookies, localStorage };
    await fs.writeFile(SESSION_FILE, JSON.stringify(sessionData, null, 2));

    console.log("✅ Sesión guardada exitosamente.");
  } catch (error) {
    console.error("❌ Error al guardar la sesión:", error);
  }
}

export async function loadSession(page) {
  try {
    const sessionData = JSON.parse(await fs.readFile(SESSION_FILE, "utf8"));

    if (!sessionData.cookies || !sessionData.localStorage) {
      console.log("⚠️ La sesión guardada está incompleta.");
      return false;
    }

    await page.setCookie(...sessionData.cookies);

    await page.evaluate((localStorageData) => {
      try {
        const entries = JSON.parse(localStorageData);
        for (let key in entries) {
          window.localStorage.setItem(key, entries[key]);
        }
      } catch (err) {
        console.error("❌ Error al restaurar localStorage:", err);
      }
    }, sessionData.localStorage);

    console.log("✅ Sesión cargada correctamente.");
    return true;
  } catch (error) {
    console.log(
      "⚠️ No se encontró sesión guardada, iniciando sesión manualmente."
    );
    return false;
  }
}
