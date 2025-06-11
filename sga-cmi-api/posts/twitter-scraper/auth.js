import { LOGIN_URL, HOME_URL } from "./config.js";
import { saveSession } from "./sessionManager.js";

export async function isLoggedIn(page) {
  try {
    await page.goto(HOME_URL, { waitUntil: "networkidle2", timeout: 15000 });

    // Múltiples formas de verificar el inicio de sesión
    const loggedIn = await page.evaluate(() => {
      // Verificar elementos que solo aparecen cuando estás logueado
      return (
        document.querySelector('[data-testid="AppTabBar_Home_Link"]') !==
          null ||
        document.querySelector('a[href="/home"]') !== null ||
        document.body.innerText.includes("Inicio") ||
        document.body.innerText.includes("Home")
      );
    });

    return loggedIn;
  } catch (error) {
    console.log("⚠️ Error al verificar el estado de login:", error.message);
    return false;
  }
}

export async function login(page) {
  console.log("🔑 Preparando inicio de sesión en Twitter/X...");
  console.log(
    "🕒 Por favor inicia sesión MANUALMENTE en la ventana del navegador..."
  );
  console.log("⏳ Tienes 3 minutos para completar el inicio de sesión...");

  await page.goto(LOGIN_URL, { waitUntil: "networkidle2" });

  // Esperar a que el usuario complete el login
  try {
    // Esperar hasta que aparezca algún elemento de la página de inicio
    await page.waitForSelector(
      '[data-testid="AppTabBar_Home_Link"], a[href="/home"]',
      {
        timeout: 180000, // 3 minutos de espera
      }
    );

    console.log("✅ Inicio de sesión detectado correctamente");
    await saveSession(page);
    return true;
  } catch (error) {
    console.log("❌ No se pudo detectar el inicio de sesión.");
    return false;
  }
}
