import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Camera } from "@mui/icons-material";

const WebcamCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.label);
      });
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, [stream]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log("Iniciando câmera...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });
        console.log("Stream obtido:", mediaStream);

        setStream(mediaStream);
        if (videoRef.current) {
          console.log("Definindo srcObject do vídeo");
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Vídeo metadata carregado");
            setCameraReady(true);
          };
        } else {
          throw new Error("Referência do vídeo não encontrada");
        }
      } catch (err) {
        console.error("Erro detalhado ao acessar câmera:", err);
        setError(err.message || "Erro ao acessar câmera");
        alert("Erro ao acessar câmera. Verifique as permissões.");
      }
    };

    startCamera();

    return stopCamera;
  }, [stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current) {
      console.error("Referência do vídeo não encontrada");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Não foi possível obter o contexto 2D do canvas");
        return;
      }

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Falha ao criar blob da imagem");
            alert("Erro ao capturar imagem. Por favor, tente novamente.");
            return;
          }

          if (blob.size < 1000) {
            console.error(
              "Imagem capturada é muito pequena:",
              blob.size,
              "bytes"
            );
            alert("Erro ao capturar imagem. Por favor, tente novamente.");
            return;
          }

          try {
            const file = new File([blob], "webcam-photo.jpg", {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            });

            onCapture(file);
            stopCamera();
          } catch (error) {
            console.error("Erro ao criar arquivo:", error);
            alert(
              "Erro ao processar imagem capturada. Por favor, tente novamente."
            );
          }
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      alert("Erro ao capturar foto. Por favor, tente novamente.");
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Tirar Foto</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {!cameraReady && !error && (
            <CircularProgress
              sx={{ position: "absolute", top: "50%", left: "50%" }}
            />
          )}
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: cameraReady ? "block" : "none",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={capturePhoto}
          startIcon={<Camera />}
          color="primary"
          variant="contained"
          disabled={!cameraReady || !!error}
        >
          Capturar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebcamCapture;
