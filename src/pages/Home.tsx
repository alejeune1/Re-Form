import ChallengesPreview from '../components/ChallengesPreview';
import CommunityPreview from '../components/CommunityPreview';
import Hero from '../components/Hero';
import PlatformPillars from '../components/PlatformPillars';
import TutorialsPreview from '../components/TutorialsPreview';
import UploadMaterialCTA from '../components/UploadMaterialCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformPillars />
      <TutorialsPreview />
      <UploadMaterialCTA />
      <ChallengesPreview />
      <CommunityPreview />
    </>
  );
}
