import { Route, Routes } from "react-router-dom";
import Invitacion from "./pages/Invitacion";
import Panel from "./pages/Panel";
import NoEncontrada from "./pages/NoEncontrada";

const rutaPanel = `/panel-${import.meta.env.VITE_PANEL_PATH ?? "secreto"}`;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Invitacion />} />
      <Route path="/i/:id" element={<Invitacion />} />
      <Route path={rutaPanel} element={<Panel />} />
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}
