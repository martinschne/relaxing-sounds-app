import { IonItem, IonLabel, IonIcon } from "@ionic/react";

interface PopoverItemProps {
  id?: string;
  text: string;
  icon: string;
  onSelect?: () => void;
}

const PopoverItem: React.FC<PopoverItemProps> = ({
  id,
  text,
  icon,
  onSelect,
}) => {
  return (
    <IonItem id={id} lines="none" onClick={onSelect}>
      <IonLabel>{text}</IonLabel>
      <IonIcon icon={icon} slot="end" size="small" aria-hidden={true} />
    </IonItem>
  );
};

export default PopoverItem;
