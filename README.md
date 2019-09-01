# Zoro Internship

---

This repo contains the work that myself and three other interns accomplished during our 10 week internship at Zoro.com

The project was a proof of concept for a voice experience of Zoro.com. This was done by using an Amazon Alexa device with the Alexa Skills Kit.

Certain parts of the code have been removed (You can tell because it will say "/* removed \*/") in order to ensure that various Zoro API endpoints are not leaked. This project has been allowed to be published publicly on this repo by Zoro.


---

How the content is organized:
 1. There are five main folders containing important files.
  a. The handlers folder contains the code to actually handle specific intents for Alexa. This is basically what the Alexa skill can do.
  b. The models folder contains the interaction model for the skill. This is how Alexa is able to recognize specific phrases that a user can say and send them to the correct intent.
  c. The resources folder contains various resources such as mock data for the tests, or otherwise constant data. This is where the majority of information has been redacted.
  d. The services folder is where most of the methods are abstracted to. This is done to ensure that code is able to be reused in other parts of the project.
  e. The test folder is where all of the unit and integration tests are located. Some data has been redacted here as well.

 ---

 Things I am especially proud of:
  1. Fully functioning CI / CD (utilizing Jenkins) involving linting, testing, and deployment.
  2. 100% branch and line coverage with the unit tests.
  3. Code is abstracted such that you would not have to do much refactoring in order to port it to another voice interface (i. e. Google Home).
  4. How much I learned from doing this project.



For any questions about this project, the internship, or development for Alexa skills in general, feel free to email me at danielbarnes175@gmail.com

