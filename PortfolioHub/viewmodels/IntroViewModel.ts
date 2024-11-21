import { useAssets } from 'expo-asset';
import { useState, useEffect } from 'react';

const useIntroViewModel = () => {
  const [assets, setAssets] = useState(null);

  // Fetch assets using the hook
  const [loadedAssets] = useAssets([require('@/assets/videos/intro.mp4')]);

  useEffect(() => {
    if (loadedAssets) {
      setAssets(loadedAssets[0].uri);
    }
  }, [loadedAssets]);

  return {
    videoUri: assets,
    headerText: 'Track, Analyze, Prosper',
  };
};

export default useIntroViewModel;