export const epochTime = (time: number) => {
  // Create a new date object from the epoch time
  const date = new Date(time);
  // Return the date in ISO 8601 format
  return date.toISOString();
};

export const convertUnixToLocalDate = (unixTimestamp: any) => {
  // Create a new Date object using the Unix timestamp
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert to milliseconds

  // Convert to ISO 8601 format
  return date.toISOString();
};

export const transformData = (data: any) => {
  const transformedAverage = Object.entries(data.average).map(
    ([timestamp, value]) => {
      return { date: epochTime(Number(timestamp)), average: value }; // Use epochTime for date formatting
    },
  );

  const transformedDaily = Object.entries(data.daily).map(
    ([timestamp, value]) => {
      return { date: epochTime(Number(timestamp)), daily: value }; // Use epochTime for date formatting
    },
  );

  return {
    transformedAverage,
    transformedDaily,
  };
};
