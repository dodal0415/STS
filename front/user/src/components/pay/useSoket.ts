import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.30.16:3001";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("initialState", (data) => {
      setDisabledButtons(new Set(data.disabledButtons));
      console.log("초기 상태 수신:", data.disabledButtons);
    });

    newSocket.on("buttonUpdate", (data) => {
      setDisabledButtons(new Set(data.disabledButtons));
      console.log("버튼 업데이트 수신:", data.disabledButtons);
    });

    newSocket.emit("getInitialState");
    console.log("초기 상태 요청 전송");

    newSocket.on("connect", () => {
      console.log("서버에 연결되었습니다.");
    });

    return () => {
      newSocket.off("initialState");
      newSocket.off("buttonUpdate");
      newSocket.off("connect");
      newSocket.close();
    };
  }, []);

  const toggleButton = (button: string, selected: boolean) => {
    socket?.emit("buttonToggle", { button, selected });
  };

  return { socket, disabledButtons, toggleButton };
};
