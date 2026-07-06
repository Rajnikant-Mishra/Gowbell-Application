import axios from "axios";

export const sendSchoolApprovalWhatsApp = async ({
  school_name,
  school_code,
  principal_whatsapp,
}) => {
  if (!principal_whatsapp) return;

  const number = principal_whatsapp.startsWith("91")
    ? principal_whatsapp
    : `91${principal_whatsapp}`;

  const template = {
    id: "3d226831-e623-418d-a23f-59b5c5c9e920",
    params: [school_name, school_code],
  };

  const message = {
    type: "image",
    image: {
      link: "https://fss.gupshup.io/0/public/0/0/gupshup/919337071236/aa1382b7-44bb-431d-94c1-b66a36209a15/1781938034105_1781368868728_WhatsApp%20Image%202026-06-13%20at%2022.09.04.jpeg",
    },
  };

  const postData = {
    channel: "whatsapp",
    source: process.env.GUPSHUP_SOURCE,
    destination: number,
    "src.name": process.env.GUPSHUP_APP_NAME,
    template: JSON.stringify(template),
    message: JSON.stringify(message),
  };

  return axios.post(
    "https://api.gupshup.io/wa/api/v1/template/msg",
    new URLSearchParams(postData).toString(),
    {
      headers: {
        apikey: process.env.GUPSHUP_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
};