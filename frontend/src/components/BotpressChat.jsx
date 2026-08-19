import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script.async = true;

    script.onload = () => {
      window.botpress.init({
        botId: "1ab0ea4f-4e0e-43e6-bb85-81aef071e049",
        configuration: {
          botName: "PCOS AI Assistant",
          botDescription:
            "Ask questions about PCOS symptoms, diet, exercise, and lifestyle recommendations.",
          color: "#7C3AED",
          themeMode: "light",
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default BotpressChat;