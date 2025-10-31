"use client";

import React, { useState } from "react";

export default function Home() {
  const [textToPrint, setTextToPrint] = useState(
    "Hola Mundo!\nPrueba de impresión con tildes (áéíóú) y eñes (ñÑ).\n¡Funciona!"
  );
  const [status, setStatus] = useState("");

  // 🔌 Solicitar conexión al dispositivo USB
  const connectToPrinter = async () => {
    try {
      setStatus("Solicitando acceso al dispositivo...");
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x04b8 }], // Epson Vendor ID
      });

      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      await device.claimInterface(0);

      setStatus(`Conectado a: ${device.productName}`);
      return device;
    } catch (error: any) {
      setStatus("Error al conectar: " + error.message);
      console.error(error);
      throw error;
    }
  };

  // 🖨️ Enviar texto al dispositivo
  const printWithWebUSB = async () => {
    try {
      const device = await connectToPrinter();

      // Convertir texto a bytes ESC/POS
      const encoder = new TextEncoder();
      const data = encoder.encode(textToPrint + "\n\n\n\x1D\x56\x41"); // \x1D\x56\x41 = cortar papel (si aplica)

      await device.transferOut(1, data); // endpoint 1 = salida típica ESC/POS

      setStatus("Texto enviado correctamente a la impresora.");
      await device.close();
    } catch (error: any) {
      console.error(error);
      setStatus("Error al imprimir: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>🖨️ Impresora de Texto</h1>
      <p>Conecta tu impresora matricial y haz clic en imprimir.</p>

      <textarea
        value={textToPrint}
        onChange={(e) => setTextToPrint(e.target.value)}
        rows={10}
        cols={80}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          fontFamily: "monospace",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      ></textarea>

      <button
        onClick={printWithWebUSB}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Imprimir
      </button>

      <p style={{ marginTop: "15px", fontStyle: "italic" }}>{status}</p>
    </div>
  );
}
