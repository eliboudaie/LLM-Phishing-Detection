const express = require('express');
const router = express.Router();
const Result = require('../models/EmailAnalysis');  
const User = require('../models/User');  

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: //input your api key here ,
});
const openai = new OpenAIApi(configuration);

// Handle the phishing detection form submission
async function detectPhishing(req, res) {
  const { email, body } = req.body;  

  try {
    // Perform phishing detection using the OpenAI API
    const result = await detectPhishingWithOpenAI(email, body);  

    // Render the result page with the phishing detection result
    res.render('result', { email, body, result });
  } catch (error) {
    console.log(error);
  }
}

// Function to detect phishing using the OpenAI API
async function detectPhishingWithOpenAI(email, body) {
  const prompt = `Analyze the following email to determine if it is a phishing attempt or not:
  
  Email address: ${email} 
  Email body: ${body}
  
  Is this email a phishing attempt?`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt, 
    max_tokens: 100,
  });

  const result = completion.data.choices[0].text;
  return result;
}

//Route for the phishing detection form submission
router.post('/phishing/detect', detectPhishing);  

router.get("/phishing", (req, res) => {
  res.render("phishing");
})

router.post("/phishing", async (req, res) => {
  const answer = await detectPhishingWithOpenAI(req.body.email, req.body.body);
  const EmailAnalysis = new EmailAnalysis({emailBody:req.body.email, phishingAnalysisResult:answer, userId:req.session.user._id}); 
  await EmailAnalysis.save();
  res.render("result", {phishingAnalysisResult:answer});
});


module.exports = router;