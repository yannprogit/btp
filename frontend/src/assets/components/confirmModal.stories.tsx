// ConfirmModal.stories.tsx
import type { Meta, Story } from "@ladle/react";
import ConfirmModal from "./ConfirmModal";

export default {
  title: "Components/ConfirmModal",
  argTypes: {
    title: { control: { type: "text" }, defaultValue: "Confirmer l'action" },
    message: { control: { type: "text" }, defaultValue: "Êtes-vous sûr de vouloir continuer ?" },
    confirmText: { control: { type: "text" }, defaultValue: "Confirmer" },
    cancelText: { control: { type: "text" }, defaultValue: "Annuler" },
  },
} satisfies Meta;

// Story de base avec controls dynamiques
export const Default: Story<{
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}> = ({ title, message, confirmText, cancelText }) => (
  <ConfirmModal
    title={title}
    message={message}
    confirmText={confirmText}
    cancelText={cancelText}
    onConfirm={() => alert("Confirmé !")}
    onCancel={() => alert("Annulé !")}
  />
);

// Cas de suppression
export const Suppression: Story = () => (
  <ConfirmModal
    title="Supprimer l'élément"
    message="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
    confirmText="Supprimer"
    cancelText="Annuler"
    onConfirm={() => alert("Supprimé !")}
    onCancel={() => alert("Annulé !")}
  />
);

// Avec textes personnalisés
export const TextesPersonnalises: Story = () => (
  <ConfirmModal
    title="Quitter sans sauvegarder ?"
    message="Vos modifications seront perdues si vous quittez maintenant."
    confirmText="Quitter"
    cancelText="Rester"
    onConfirm={() => alert("Quitté !")}
    onCancel={() => alert("Resté !")}
  />
);