
import { useState } from "react";
import RecomendacionesAlojamientos from "./RecomendacionesAlojamientos";
const Buscador = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
  
    console.log(" Sugerencias en Buscador.jsx:", suggestions); 
  
    return (
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar alojamientos..."
          list="suggestions-list"
        />
        

        <ul>
            {suggestions.length > 0 ? (
             suggestions.map((suggestion, index) => (
                <li key={index}>
                 {typeof suggestion === "string" ? suggestion : JSON.stringify(suggestion)}
                </li>
             ))  ) : 
             (
                <li>(Sin sugerencias) </li>
             )}
        </ul>
  
    
        <RecomendacionesAlojamientos searchQuery={searchQuery} setSuggestions={setSuggestions} />
      </div>
    );
  };
  
  export default Buscador;
  


