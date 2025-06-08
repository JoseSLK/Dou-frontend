/**
 * @fileoverview Punto de entrada principal de la aplicación DOU.
 * Este componente es el punto de montaje inicial de la aplicación React.
 * Renderiza el componente AppUI que contiene toda la estructura base de la aplicación,
 * incluyendo el enrutador, proveedores de contexto y efectos visuales.
 * 
 * @module App
 * @requires react
 * @requires ./AppUI
 */

import { AppUI } from './AppUI'

/**
 * Componente raíz de la aplicación.
 * Actúa como punto de entrada y renderiza el componente AppUI.
 * 
 * @component
 * @returns {JSX.Element} Componente AppUI envuelto en la estructura base
 */
function App() {
  return (
    <AppUI />
  )
}

export default App
