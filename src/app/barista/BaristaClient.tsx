"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function BaristaClient() {
  const [pin, setPin] = useState("");
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

  const submitPin = useCallback(() => {
    setError(null);
    if (pin.length !== 4) {
      setError("Enter 4 digits");
      return;
    }
    fetch("/api/barista/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) setAuthenticated(true);
        else setError("Wrong PIN");
      })
      .catch(() => setError("Something went wrong"));
  }, [pin]);

  const addStamp = useCallback(
    async (userId: string) => {
      setError(null);
      const res = await fetch("/api/barista/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          pin,
          redeem: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setLastScanned({
        userId,
        stampCount: data.stamp_count,
        rewardAvailable: data.reward_available ?? false,
      });
    },
    [pin]
  );

  const redeem = useCallback(
    async (userId: string) => {
      setError(null);
      const res = await fetch("/api/barista/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          pin,
          redeem: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setLastScanned({
        userId,
        stampCount: 0,
        rewardAvailable: false,
      });
      setRedeemMode(false);
    },
    [pin]
  );

  const startScanner = useCallback(() => {
    if (scannerRef.current) return;
    setError(null);
    setLastScanned(null);
    const html5Qr = new Html5Qrcode(scanAreaId);
    scannerRef.current = html5Qr;
    html5Qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
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
      )
      .then(() => setScanning(true))
      .catch((err: Error) => {
        setError(err.message || "Could not start camera");
        scannerRef.current = null;
      });
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
        <h1 className="text-2xl font-normal tracking-tight">Barista</h1>
        <p className="mt-2 text-sideout-green/80 text-sm">
          Enter store PIN to continue.
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          className="mt-6 w-32 text-center text-xl tracking-widest border border-sideout-green/30 bg-transparent py-3 text-sideout-green"
          placeholder="····"
          aria-label="Store PIN"
        />
        <button
          type="button"
          onClick={submitPin}
          className="mt-4 bg-sideout-green text-sideout-beige px-6 py-2 text-sm font-medium hover:bg-sideout-green/90"
        >
          Enter
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sideout-beige text-sideout-green px-6 py-8 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-normal tracking-tight">Barista</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setRedeemMode(false);
              stopScanner();
            }}
            className={`px-4 py-2 text-sm border ${
              !redeemMode
                ? "bg-sideout-green text-sideout-beige border-sideout-green"
                : "border-sideout-green/30"
            }`}
          >
            Add stamp
          </button>
          <button
            type="button"
            onClick={() => {
              setRedeemMode(true);
              stopScanner();
            }}
            className={`px-4 py-2 text-sm border ${
              redeemMode
                ? "bg-sideout-green text-sideout-beige border-sideout-green"
                : "border-sideout-green/30"
            }`}
          >
            Redeem
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {lastScanned && (
        <div className="mt-6 p-4 border border-sideout-green/20 bg-white/50">
          <p className="text-sm text-sideout-green/80">
            {redeemMode ? "Reward redeemed." : "Stamp added."}
          </p>
          <p className="text-sm mt-1">
            Stamps: {lastScanned.stampCount}
            {lastScanned.rewardAvailable && " — Reward available!"}
          </p>
          {lastScanned.rewardAvailable && !redeemMode && (
            <button
              type="button"
              onClick={() => redeem(lastScanned!.userId)}
              className="mt-3 bg-sideout-green text-sideout-beige px-4 py-2 text-sm"
            >
              Redeem for customer
            </button>
          )}
        </div>
      )}

      <div className="mt-8">
        <div
          id={scanAreaId}
          className="overflow-hidden rounded-lg border border-sideout-green/20 bg-black/5"
          style={{ width: "100%", maxWidth: 320, minHeight: 240 }}
        />
        {!scanning ? (
          <button
            type="button"
            onClick={startScanner}
            className="mt-4 bg-sideout-green text-sideout-beige px-6 py-3 text-sm font-medium hover:bg-sideout-green/90"
          >
            {redeemMode ? "Scan to redeem" : "Scan customer QR"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScanner}
            className="mt-4 border border-sideout-green px-6 py-3 text-sm"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
