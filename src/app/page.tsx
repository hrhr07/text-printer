"use client";

import { useState } from "react";

export default function Home() {
  const [textToPrint, setTextToPrint] = useState(
    "Hola Mundo!\nPrueba de impresión con tildes (áéíóú) y eñes (ñÑ)."
  );
  const [status, setStatus] = useState("");

  const encodeToPC437 = (text: string): Uint8Array => {
    const pc437Map: { [key: string]: number } = {
      Ç: 0x80,
      ü: 0x81,
      é: 0x82,
      â: 0x83,
      ä: 0x84,
      à: 0x85,
      å: 0x86,
      ç: 0x87,
      ê: 0x88,
      ë: 0x89,
      è: 0x8a,
      ï: 0x8b,
      î: 0x8c,
      ì: 0x8d,
      Ä: 0x8e,
      Å: 0x8f,
      É: 0x90,
      æ: 0x91,
      Æ: 0x92,
      ô: 0x93,
      ö: 0x94,
      ò: 0x95,
      û: 0x96,
      ù: 0x97,
      ÿ: 0x98,
      Ö: 0x99,
      Ü: 0x9a,
      ø: 0x9b,
      "£": 0x9c,
      Ø: 0x9d,
      "×": 0x9e,
      ƒ: 0x9f,
      á: 0xa0,
      í: 0xa1,
      ó: 0xa2,
      ú: 0xa3,
      ñ: 0xa4,
      Ñ: 0xa5,
      ª: 0xa6,
      º: 0xa7,
      "¿": 0xa8,
      "®": 0xa9,
      "¬": 0xaa,
      "½": 0xab,
      "¼": 0xac,
      "¡": 0xad,
      "«": 0xae,
      "»": 0xaf,
    };

    const bytes: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (pc437Map[char] !== undefined) {
        bytes.push(pc437Map[char]);
      } else {
        const encoder = new TextEncoder();
        const encodedChar = encoder.encode(char);
        bytes.push(...Array.from(encodedChar));
      }
    }
    return new Uint8Array(bytes);
  };

  const connectToPrinter = async () => {
    try {
      setStatus("Solicitando acceso al dispositivo...");
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x04b8 }],
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

  const printWithWebUSB = async () => {
    try {
      const device = await connectToPrinter();

      const initPrinter = "\x1B\x40";

      const setCodePage437 = "\x1B\x74\x00";

      const paperAdvance = "\n\n\n\n\n\n\n\n\n\n\n\n";

      const textDataPC437 = encodeToPC437(textToPrint);

      const commandData = new TextEncoder().encode(
        initPrinter + setCodePage437
      );
      const allData = new Uint8Array(
        commandData.length +
          textDataPC437.length +
          new TextEncoder().encode(paperAdvance).length
      );

      allData.set(commandData, 0);
      allData.set(textDataPC437, commandData.length);
      allData.set(
        new TextEncoder().encode(paperAdvance),
        commandData.length + textDataPC437.length
      );

      await device.transferOut(1, allData);

      setStatus("Texto enviado correctamente a la impresora.");
      await device.close();
    } catch (error: any) {
      console.error(error);
      setStatus("Error al imprimir: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Impresora de Texto</h1>

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
