import { useState, useEffect } from "react";
import type { Move } from "../interfaces/pokemon";

type MoveSelectProps = {
  numero: number;
  onSelect: (attackName: string, slot: number) => void;
  moves: Move[];
  selectedMove?: string;
};

const MoveSelect = ({ numero, onSelect, moves, selectedMove }: MoveSelectProps) => {
  const [selected, setSelected] = useState(selectedMove || "");

  useEffect(() => {
    setSelected(selectedMove || "");
  }, [selectedMove]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onSelect(value, numero);
  };

  return (
    <div className="my-2">
      <label className="flex w-full font-bold mb-1" htmlFor={`pokemonMove${numero}`}>
        Attaque n°{numero}
      </label>
      <select
        className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
        id={`pokemonMove${numero}`}
        name={`pokemonMove${numero}`}
        value={selected}
        onChange={handleChange}
      >
        <option value="">Sélectionner une attaque</option>
        {moves.map((move: Move) => (
          <option
            key={`${move.name}-${numero}`}
            value={move.name}
            title={`Dégâts: ${move.damage} | Précision: ${move.accuracy}% | ${move.description}`}
          >
            {move.name} ({move.type.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default MoveSelect;
