import axios from "axios";
import qs from "qs";

const apiKey = "sk_e8c12b6b5cd241c887aaae6c585a8d66";

const template = {
  id: "3d226831-e623-418d-a23f-59b5c5c9e920",
  params: [
    "ABC Public School",
    "SCH1001"
  ]
};

const message = {
  type: "image",
  image: {
    link: "https://fss.gupshup.io/0/public/0/0/gupshup/919337071236/aa1382b7-44bb-431d-94c1-b66a36209a15/1781938034105_1781368868728_WhatsApp%20Image%202026-06-13%20at%2022.09.04.jpeg"
  }
};

const postData = {
  channel: "whatsapp",
  source: "919337071236",
  destination: "917991048546",
  "src.name": "GowbellFoundation",
  template: JSON.stringify(template),
  message: JSON.stringify(message)
};

async function sendWhatsAppTemplate() {
  try {
    const response = await axios.post(
      "https://api.gupshup.io/wa/api/v1/template/msg",
      qs.stringify(postData),
      {
        headers: {
          apikey: apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("HTTP Status:", response.status);
    console.log("Response:");
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.log("HTTP Status:", error.response.status);
      console.log(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

sendWhatsAppTemplate();