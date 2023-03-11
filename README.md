# TeleQuiz-backend

## Backend System for a telegram quizbot

### Usage

base url : https://telequiz-backend.onrender.com


| Endpoint   | Request type | Body/Params                                       | Response     | Route          |
|------------|--------------|---------------------------------------------------|--------------|----------------|
| AddQuiz    | POST         | Body: { questions,choices, answers,tag,language } | quize {}     | /api/quize/add |
| GetQuiz    | GET          | Body: { telegram_id,username,tag }                | quize {}     | /api/quize/get |
| SubmitQuiz | POST         | Body: { telegram_id,point,quiz_id }               | scoreboard[] | /api/submit    |