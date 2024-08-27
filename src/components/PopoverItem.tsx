import { IonItem, IonLabel, IonIcon } from "@ionic/react";

interface PopoverItemProps {
  text: string;
  icon: string;
  onSelect: () => void;
}

const PopoverItem: React.FC<PopoverItemProps> = ({ text, icon, onSelect }) => {
  return (
    <IonItem lines="none" onClick={onSelect}>
      <IonLabel>{text}</IonLabel>
      <IonIcon icon={icon} slot="end" size="small" aria-hidden={true} />
    </IonItem>
  );
};

export default PopoverItem;
