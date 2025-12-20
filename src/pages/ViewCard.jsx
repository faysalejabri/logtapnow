import PhonePreview from "@/src/components/phone-preview/PhonePreview";
import { PROFILES } from "@/src/data/data";
import { useMemo } from "react";
import { useParams } from "react-router";

const ViewCard = () => {
  const { id } = useParams();

  const profile = useMemo(() => {
    return PROFILES.find((p) => p.id === id) || {};
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <PhonePreview profile={profile} />
    </div>
  );
};

export default ViewCard;
