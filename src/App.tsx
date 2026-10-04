import { useEffect } from "react";
import Oddity from "./Oddity";

export default function App() {
  useEffect(() => {
    document.title = "Oddity® — Independent Design Studio, Lisbon";
  }, []);

  return <Oddity />;
}
