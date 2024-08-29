import { IonImg } from "@ionic/react";
import { useEffect, useState } from "react";

interface FallbackImageProps {
  src?: string;
  alt: string;
  [key: string]: any; // Allows any additional props
}

const PUBLIC_IMAGE_PATH = "/assets/images/";
const PLACEHOLDER_IMG = "thumbnail.svg";

const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(
    `${PUBLIC_IMAGE_PATH}${PLACEHOLDER_IMG}`
  );

  useEffect(() => {
    setImgSrc(
      src
        ? `${PUBLIC_IMAGE_PATH}${src}`
        : `${PUBLIC_IMAGE_PATH}${PLACEHOLDER_IMG}`
    );
  }, [src]);

  const handleImageLoadingError = () => {
    setImgSrc(`${PUBLIC_IMAGE_PATH}${PLACEHOLDER_IMG}`);
  };

  return (
    <IonImg
      src={imgSrc}
      alt={alt}
      onIonError={handleImageLoadingError}
      {...props}
    ></IonImg>
  );
};

export default FallbackImage;
