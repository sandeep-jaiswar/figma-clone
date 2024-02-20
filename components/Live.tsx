import { useMyPresence, useOthers } from "@/liveblocks.config";
import Cursor from "./cursor/Cursor";
import LiveCursors from "./cursor/LiveCursors";
import { useCallback, useEffect, useState } from "react";
import { CursorMode } from "@/types/type";
import { CursorState } from "../types/type";
import CursorChat from "./cursor/CursorChat";

function Live() {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({
      cursor: {
        x,
        y,
      },
    });
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "/") {
      setCursorState({
        mode: CursorMode.Chat,
        message: "",
        previousMessage: null,
      });
    } else if (e.key === "Escape") {
      updateMyPresence({
        message: "",
      });
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "/") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [updateMyPresence]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="text-white h-[100vh] w-full flex justify-center items-center border-5 border-green-500"
    >
      <h1 className="2xl text-white">Hellow</h1>

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      <LiveCursors others={others} />
    </div>
  );
}

export default Live;
