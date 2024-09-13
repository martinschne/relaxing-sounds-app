import { IonTitle, IonText, isPlatform } from "@ionic/react";

interface FooterNoteProps {
  children: any;
}

const FooterNote: React.FC<FooterNoteProps> = ({ children }) => {
  const isAndroid = isPlatform("android");

  let footerTextClasses = "ion-padding-horizontal ion-text-center";
  footerTextClasses += isAndroid ? " ion-margin-bottom" : "";

  return (
    <>
      <IonTitle size="small" className={footerTextClasses}>
        <IonText color="medium">{children}</IonText>
      </IonTitle>
    </>
  );
};

export default FooterNote;
