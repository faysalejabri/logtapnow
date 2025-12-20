export const generateVCF = (profile) => {
  const vcfLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.firstName} ${profile.lastName}`,
    `ORG:${profile.profession}`,
    `TITLE:${profile.profession}`,
    `TEL;TYPE=CELL:${profile.phone}`,
    `EMAIL;TYPE=WORK:${profile.email}`,
    `URL:${profile.socials.find((s) => s.platform === "website")?.url || ""}`,
    `ADR;TYPE=WORK:;;${profile.address};;;;`,
    `NOTE:${profile.bio}`,
    "END:VCARD",
  ];
  return vcfLines.filter((line) => !line.endsWith(":")).join("\n");
};

export const downloadVCard = (profile) => {
  const vcfData = generateVCF(profile);
  const blob = new Blob([vcfData], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${profile.firstName}_${profile.lastName}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getYoutubeEmbedId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
