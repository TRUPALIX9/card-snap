"use client";
import { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  useTheme,
  Text,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useRouter, Stack } from "expo-router";

export default function ScanAddPage() {
  const theme = useTheme();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null); // use `CameraViewRef` if available
  const [cameraReady, setCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("back");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const takePhoto = async () => {
    console.log("📸 Attempting photo capture...");

    if (!cameraRef.current || !cameraReady) {
      Alert.alert("Error", "Camera not ready");
      return;
    }

    try {
      setIsProcessing(true);

      const photo = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 1,
        skipProcessing: false,
      });

      if (!photo?.base64) {
        throw new Error("Base64 data missing from capture.");
      }

      // const res = await fetch(`${apiUrl}/api/ocr`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     base64: photo.base64,
      //   }),
      // });

      const res = await fetch(`${apiUrl}/api/ocrExtract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64: photo.base64,
        }),
      });
      if (!res.ok) throw new Error("Failed to scan the image");

      const result = await res.json();
      console.log("🧠 OCR result:", result);
      console.log("------------------------------------------");

      router.push("../add/manual");
    } catch (err: any) {
      console.error("❌ Capture error:", err);
      Alert.alert("Scan Failed", err.message || "An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCamera = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  if (Platform.OS !== "web" && !permission?.granted) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <Text style={styles.permissionText}>
          Camera access is required to scan business cards.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[
            styles.retryButton,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={{ color: theme.colors.onPrimary, fontWeight: "bold" }}>
            Retry Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          onCameraReady={() => {
            console.log("✅ Camera ready");
            setCameraReady(true);
          }}
        />

        <View style={styles.controls}>
          <IconButton
            icon="camera-flip"
            size={28}
            onPress={toggleCamera}
            iconColor="#fff"
            style={styles.flipButton}
          />

          <TouchableOpacity onPress={takePhoto} disabled={isProcessing}>
            <View
              style={[
                styles.shutter,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    alignItems: "center",
    gap: 16,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    marginBottom: 12,
  },
  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  permissionText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
