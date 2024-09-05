export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds - minutes * 60;

  let formattedTime = "";

  if (minutes) {
    formattedTime += `${minutes}m `;
  }
  if (seconds || !minutes) {
    formattedTime += `${seconds}s`;
  }
  return formattedTime;
};
