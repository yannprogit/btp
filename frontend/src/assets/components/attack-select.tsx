import { useState } from "react";
import type { Attack } from "../data";

type AttackSelectProps = {
  numero: number;
  onSelect: (attackName: string, slot: number) => void;
  attacks: Attack[];
};

const AttackSelect = ({ numero, onSelect, attacks }: AttackSelectProps) => {
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onSelect(value, numero);
  };

  return (
    <div className="my-2">
      <label className="flex w-full font-bold mb-1" htmlFor={`pokemonAttack${numero}`}>Attaque n°{numero}</label>
      <select
        className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
        id={`pokemonAttack${numero}`}
        name={`pokemonAttack${numero}`}
        value={selected}
        onChange={handleChange}
      >
        <option value="">Sélectionner une attaque</option>
        {attacks.map((attack:Attack )=> (
          <option
            key={`${attack.name}-${numero}`}
            value={attack.name}
            title={`Dégâts: ${attack.damage} | Précision: ${attack.accuracy}%`}
          >
            {attack.name} ({attack.type})
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttackSelect;