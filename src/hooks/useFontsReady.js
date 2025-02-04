import { useEffect, useState } from "react";

/**
 * SplitText necesita que Montserrat esté cargada para medir las líneas
 * correctamente; este hook avisa cuando document.fonts está listo.
 */
export default function useFontsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => alive && setReady(true));
    } else {
      setReady(true);
    }
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}
