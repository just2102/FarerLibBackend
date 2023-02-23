const express = require("express");
const dotenv = require("dotenv");
const { OpenAIApi, Configuration } = require("openai");
dotenv.config();

const configuration = new Configuration({
  organization: "org-cWFQZXHlsOR9I7Hibrdv6ayH",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const router = express.Router();

router.route("/")
.post(async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.prompt.slice(0,300) + ' GENERATE BOOK COVER',
      n: 1,
      response_format: "b64_json",
      size: "1024x1024",
    });
    const image = response.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.response.data.error.message);
  }
});

module.exports = router;
