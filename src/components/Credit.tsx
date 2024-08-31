import { IonItem, IonItemGroup, IonLabel, IonText } from "@ionic/react";
import { Track } from "../types";

interface CreditProps {
  track: Track;
}

const Credit: React.FC<CreditProps> = ({ track }) => {
  return (
    <>
      <IonItemGroup>
        <IonItem lines="none">
          <IonLabel>
            <h2>Title:</h2>
            <IonText color="primary">{track.name}</IonText>
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <h2>Artist:</h2>
            <IonText color="medium">{track.artist}</IonText>
          </IonLabel>
        </IonItem>
        {track.url && (
          <IonItem lines="none">
            <IonLabel>
              <h2>Source:</h2>
              <IonText>
                <a href={track.url} target="_blank" rel="noopener noreferrer">
                  {track.url}
                </a>
              </IonText>
            </IonLabel>
          </IonItem>
        )}
        <IonItem lines="none">
          <IonLabel>
            <h2>License:</h2>
            <IonText>
              <a
                href={track.license.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {track.license.name}
              </a>
            </IonText>
          </IonLabel>
        </IonItem>
        <IonItem lines="none"></IonItem>
      </IonItemGroup>
    </>
  );
};

export default Credit;
