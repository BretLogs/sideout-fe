"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

/** Request camera permission and return a user-friendly error message on failure. */
async function requestCameraPermission(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return {
      ok: false,
      message: "Camera is not supported in this browser. Try a different browser or device.",
    };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    stream.getTracks().forEach((track) => track.stop());
    return { ok: true };
  } catch (err) {
    const name = err instanceof Error ? (err as DOMException).name : "";
    const message = err instanceof Error ? err.message : String(err);
    if (name === "NotAllowedError" || message.toLowerCase().includes("permission")) {
      return {
        ok: false,
        message:
          "Camera access was denied. Please allow camera in your browser or device settings, then try again.",
      };
    }
    if (name === "NotFoundError") {
      return { ok: false, message: "No camera found on this device." };
    }
    if (name === "NotReadableError" || name === "OverconstrainedError") {
      return {
        ok: false,
        message:
          "Camera is in use or unavailable. Close other apps using the camera and try again.",
      };
    }
    if (name === "SecurityError") {
      return {
        ok: false,
        message:
          "Camera access is blocked. Use HTTPS and allow camera permission for this site.",
      };
    }
    return {
      ok: false,
      message: message || "Could not access camera. Please check settings and try again.",
    };
  }
}

const fetchOpts = { credentials: "include" as const };

type BaristaInfo = { id: string; name: string } | null;

export function BaristaClient() {
  const [pin, setPin] = useState("");
  const [barista, setBarista] = useState<BaristaInfo>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<{
    userId: string;
    stampCount: number;
    rewardAvailable: boolean;
  } | null>(null);
  const [redeemMode, setRedeemMode] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanAreaId = "barista-qr-reader";

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch("/api/barista/me", { ...fetchOpts, method: "GET" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.barista) {
        setBarista(data.barista);
        setAuthenticated(true);
      }
    } catch {
      // not signed in
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const submitPin = useCallback(async () => {
    setError(null);
    if (pin.length !== 6) {
      setError("Enter 6 digits");
      return;
    }
    try {
      const res = await fetch("/api/barista/verify-pin", {
        ...fetchOpts,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.valid && data.barista) {
        setBarista(data.barista);
        setAuthenticated(true);
        setPin("");
      } else {
        setError(data.error || "Wrong PIN");
      }
    } catch {
      setError("Something went wrong");
    }
  }, [pin]);

  const lockUp = useCallback(async () => {
    try {
      await fetch("/api/barista/logout", { ...fetchOpts, method: "POST" });
    } finally {
      setBarista(null);
      setAuthenticated(false);
      setError(null);
      setLastScanned(null);
    }
  }, []);

  const addStamp = useCallback(async (userId: string) => {
    setError(null);
    const res = await fetch("/api/barista/stamp", {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, redeem: false }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setAuthenticated(false);
      setBarista(null);
      setError("Session expired. Please enter your PIN again.");
      return;
    }
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    setLastScanned({
      userId,
      stampCount: data.stamp_count,
      rewardAvailable: data.reward_available ?? false,
    });
  }, []);

  const redeem = useCallback(async (userId: string) => {
    setError(null);
    const res = await fetch("/api/barista/stamp", {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, redeem: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      setAuthenticated(false);
      setBarista(null);
      setError("Session expired. Please enter your PIN again.");
      return;
    }
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    setLastScanned({
      userId,
      stampCount: 0,
      rewardAvailable: false,
    });
    setRedeemMode(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return;
    setError(null);
    setLastScanned(null);

    const permission = await requestCameraPermission();
    if (!permission.ok) {
      setError(permission.message);
      return;
    }

    const html5Qr = new Html5Qrcode(scanAreaId);
    scannerRef.current = html5Qr;

    const startOptions = { facingMode: "environment" };
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await html5Qr.start(
        startOptions,
        config,
        (decodedText) => {
          html5Qr.stop();
          scannerRef.current = null;
          setScanning(false);
          if (redeemMode) {
            redeem(decodedText);
          } else {
            addStamp(decodedText);
          }
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start camera";
      setError(
        message.includes("NotAllowedError") || message.toLowerCase().includes("permission")
          ? "Camera access was denied. Please allow camera in your browser or device settings, then try again."
          : message || "Could not start camera. Please try again."
      );
      scannerRef.current = null;
    }
  }, [addStamp, redeem, redeemMode]);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-sideout-beige text-sideout-green flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl md:text-3xl font-normal tracking-tight text-center">
          Barista
        </h1>
        <p className="mt-3 text-sideout-green/80 text-sm text-center max-w-xs">
          Enter your 6-digit PIN to start.
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          className="mt-8 w-40 text-center text-2xl tracking-[0.4em] border-2 border-sideout-green/40 bg-white rounded-lg py-4 text-sideout-green focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="••••••"
          aria-label="Your 6-digit PIN"
        />
        <button
          type="button"
          onClick={submitPin}
          className="mt-6 w-full max-w-xs bg-sideout-green text-sideout-beige py-4 text-lg font-medium rounded-lg hover:bg-sideout-green/90 transition-colors"
        >
          Continue
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sideout-beige text-sideout-green px-4 py-6 md:px-8 md:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-normal tracking-tight">
            Barista
          </h1>
          <p className="mt-0.5 text-sm text-sideout-green/80">
            Signed in as <span className="font-medium text-sideout-green">{barista?.name ?? "—"}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={lockUp}
          className="px-4 py-2.5 text-sm font-medium border-2 border-sideout-green/50 text-sideout-green rounded-lg hover:bg-sideout-green/10 transition-colors"
        >
          Lock up
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setRedeemMode(false); stopScanner(); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg border-2 ${
            !redeemMode
              ? "bg-sideout-green text-sideout-beige border-sideout-green"
              : "border-sideout-green/30 text-sideout-green"
          }`}
        >
          Add stamp
        </button>
        <button
          type="button"
          onClick={() => { setRedeemMode(true); stopScanner(); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg border-2 ${
            redeemMode
              ? "bg-sideout-green text-sideout-beige border-sideout-green"
              : "border-sideout-green/30 text-sideout-green"
          }`}
        >
          Redeem
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {lastScanned && (
        <div className="mb-6 p-5 rounded-xl border-2 border-sideout-green/20 bg-white shadow-sm">
          <p className="text-base font-medium text-sideout-green">
            {redeemMode ? "Reward redeemed." : "Stamp added."}
          </p>
          <p className="mt-1 text-sm text-sideout-green/80">
            {redeemMode
              ? "Customer's card has been reset. They can start earning stamps again."
              : `Customer now has ${lastScanned.stampCount} of 10 stamps.`}
            {lastScanned.rewardAvailable && !redeemMode && (
              <span className="block mt-2">
                <button
                  type="button"
                  onClick={() => redeem(lastScanned!.userId)}
                  className="bg-sideout-green text-sideout-beige px-4 py-2 text-sm font-medium rounded-lg"
                >
                  Redeem for customer
                </button>
              </span>
            )}
          </p>
        </div>
      )}

      <section className="max-w-md">
        <h2 className="text-lg font-medium text-sideout-green mb-2">
          Add a stamp
        </h2>
        <p className="text-sm text-sideout-green/70 mb-4">
          Point your camera at the customer&apos;s loyalty QR code. You&apos;ll need to allow camera access when asked.
        </p>
        <div
          id={scanAreaId}
          className="overflow-hidden rounded-xl border-2 border-sideout-green/20 bg-black/5"
          style={{ width: "100%", minHeight: 240 }}
        />
        {!scanning ? (
          <button
            type="button"
            onClick={startScanner}
            className="mt-4 w-full bg-sideout-green text-sideout-beige py-4 text-base font-medium rounded-xl hover:bg-sideout-green/90 transition-colors"
            aria-label={redeemMode ? "Scan to redeem" : "Scan customer QR to add stamp"}
          >
            {redeemMode ? "Tap to scan (redeem)" : "Tap to scan"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScanner}
            className="mt-4 w-full border-2 border-sideout-green py-4 text-base font-medium rounded-xl text-sideout-green hover:bg-sideout-green/10 transition-colors"
          >
            Stop camera
          </button>
        )}
      </section>
    </div>
  );
}
