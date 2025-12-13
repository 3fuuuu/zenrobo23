import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isMobile } from "react-device-detect";

createRoot(document.getElementById("root")!).render(
  <ChakraProvider value={defaultSystem}>
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <StrictMode>
        <App />`
      </StrictMode>
    </DndProvider>
  </ChakraProvider>
);
