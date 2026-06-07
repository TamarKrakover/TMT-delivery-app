## **Advanced Systems Programming - Exercise Number 4**

## **This exercise has two parts**

**Part A** In this part, you must continue to use the JIRA project from the previous exercises and plan part B of this exercise in it. You must use JIRA **throughout** the development process of part B, which will be closely aligned with the JIRA project **in real-time along the way**. This will be checked by the grader. If you wish to continue using GitHub from the previous exercises, you can do so in accordance with the instructions published on the subject in the previous exercises.

In particular, you must be careful to:
- Planning the group, status meetings, sprint planning, appointing a scrum master from among the group members.
- Writing tasks, writing user stories, dividing into epics.
- Creating all these actions in JIRA and documenting their results (you must document in JIRA at least twice a week during the sprint, but not every day). For example, the insights and conclusions of the status meetings must be detailed and documented.
- Updating the status of tasks (in progress, code review, done) including updating the activity of the task. Note: you must add the "code review" status, it is not a default status. When you have finished a task and opened a pull request for it, the task goes to code-review. You can now assign the task in JIRA to another team member who needs to do the code review, or alternatively, you can keep the task assigned to you and "tag" the other team member in the issue's activity in JIRA. In any case, you must clearly define who ultimately moves the task to done.
- Assigning tasks to the student performing them **before they start working on them**.
- You must identify which tasks "block" other tasks (and reflect this in the relevant feature in JIRA: "is blocked by").
- Assigning **all** tasks to feature branches - that is, you need to integrate Github and JIRA so that if you write the JIRA issue name in the branch name, JIRA knows how to display it automatically in the JIRA issue.

## **Part B**

You must write a **Web** application using HTML, CSS, JS, and React. The application will display real and dynamic information, support different users, and speak with the server of exercise 3 (Please note: the server of exercise 3, **not** the server of exercise 2). The goal of the application is to be as close as possible to the real Wolt application.

Now I will detail the required screens and functionality.

From a design perspective - the visual appearance of the screens should be **inspired by** the real Wolt app.
From a functional perspective - the goal is that the maximum functionality in the real Wolt app will also work in our app (of course, what can be supported in it). The main emphasis - the minimum requirement is that it must be possible to perform full scenarios of orders: meaning, managing a restaurant and menus, and performing orders:

I have to create the following screens:

● Login screen

● Registration screen (for us, it is enough that it is similar to the login screen just with appropriate fields, meaning: registration data that is not given during login like name, image, etc.).
● Main screen (Note: this screen contains a lot of functionality).
  ○ You see the nearby and promoted restaurants (according to all kinds of categories)
  ○ You see a top menu and search.
  ○ You can search and see the search results.
  ○ You can see the full menu of a restaurant, make orders, see orders, previous orders.
  ○ and more.

**Login Screen**, which will be displayed upon clicking the login button on the main page for users who are not logged in. You must enter a username and password or transition to the registration screen.
**In the Registration Screen** we will get a place to enter a username, password verification, password, display name, display image. Do not deal with connecting to Google/Apple/Facebook accounts - we manage users ourselves in the project using a username and password.

You must ensure that all functionality defined in the server of exercise 3 can be activated and its results seen through the user interface of this exercise. Additional functions can be added if necessary.
The REACT application speaks to the server of exercise 3 and displays the information it provides. The application does not show hard-coded information, and does not show mock data. For example, the restaurants the application displays come from the server; for example, creating a new restaurant is done through the server, and the REACT application does not display the restaurant as "as if" it was created.
Also, you must implement a button in the top menu of the home screen after login which changes the theme of the application. Meaning, when changing the setting, the colors of the application will change from dark mode to light mode and vice versa.

**Login and Registration:**

- Some of the actions against the server can only be performed by a user who is registered in the system and has identified against it.
- When a user identifies against the system, **he receives a JWT back**, and from that moment on, for all operations against the server, the JWT will always be attached by the client.
- For each operation, you must think:
  - Can it be performed by a user who is not connected to the system?
  - Can it only be performed by a registered user?
And protect access to actions using the JWT accordingly.

* JWT is/will be learned in the exercise session.

How is it expressed in the API?
- Post action for the address: http://foo.com/api/users creates a new user.

- Post action for the address: http://foo.com/api/tokens creates a JWT for a user registered in the system.

At the end of the exercise, there are examples of working with the API.

## **Notes:**

You must include in the README a structured process of compiling all the code that needs to be compiled and running all servers and applications using docker-compose, including all explanations, commands, and appropriate screenshots.
Design is required. "Reasonable" design is minimal (you can get more than 100). Points will be deducted for design. A bonus will be given for excellent design.
In this exercise, due to a bonus, you can get a grade higher than 100, but it is not possible to receive more than 100 in the final project or course grade (if the final project is above 100, the project grade will be rounded to 100).

## **Must include the minimum required, but we encourage you to go above and beyond and submit an upgraded interface that contains more than the defined minimum.**

You must write a React application composed of appropriate components. You must divide the code well and correctly into components, and not (for example) simply create a single component that contains all the code.

You must implement validation on fields in the registration and login screens, input validation.

That is, all fields are mandatory, and you must implement logical logic for the rest of the fields and display a clear visual feedback to the user on what values they are allowed to enter before entering - as well as an appropriate message when they enter incorrect values. For example, a password with a length of at least 8 characters combining digits and letters, etc. You cannot register to the application or login without correctly filling out the fields. This validation must also be implemented on the server side in every function with appropriate validations for the function.

You must ensure that the logic for the image on the registration screen works (selecting an image displays the image from the computer). The user selects an existing image, password verification, etc.

After successful registration (and their details), entering correct user details will log the user into the application (only). You must protect access to pages that require permissions, through the login screen. Screens/pages that require a logged-in user should only be displayed if the user has logged in successfully. An attempt to access them without logging in will display the login screen accordingly. Do not enter/store any sensitive information in the project (e.g. passwords, emails, sensitive/real messages, photos, etc.).
- The information the user registered/logged in with (name, photo, etc.) will appear in the appropriate location in the top menu.

- You must implement the relevant logic on the main page.

- Logout, for example, returns the user to the login screen and logs them out of the application.

**In terms of React:**
You must use `useState`, `useRef`. You must use a `Router` (meaning the application loads only once and there is no refresh when transitioning between pages, like a real application).

**The main emphasis in this exercise is that the system must be complete and fully functional like a real application.** ⇐ For example, if a user enters an incorrect username/password - a clear message must be shown to them. If there is a validation issue when entering data - it must be shown to them. If there is already such a username when they try to register - it must be shown to them, etc., etc. The user needs to understand all along the way if they did something incorrect - and normal usage throughout the application must work in the various scenarios.

You are allowed to use HTML, CSS, BOOTSTRAP, JAVASCRIPT, REACT. (Hint: navigating to the home page of the server returns the React application. You did/will do this in the exercise session).

You are forbidden to use any library/module that did not appear in the course presentations or auxiliary materials (or received explicit approval for use in the course forum). Do not ask for verbal approval from the lecturer/TAs - only through the forum.

There is no need to ask for approval on trivial and built-in things in the language, e.g., data structures, etc.

You must work in REACT, and it is not enough to just put HTML and the rest of the code in a REACT environment, but actually use the framework, meaning divide the code into components. This will be checked by the grader.
You must submit the exercise in pairs or trios (submission individually for any reason will result in a grade cap. In an exercise submitted individually, it will not be possible to receive a grade higher than a maximum of 75 in any exercise submitted individually).

You must work in Git throughout the entire exercise. Every student works from their own computer and separate user. It is not possible to work together from the same computer or from the same user or without Git. You must work using the feature branches method. You must merge code into a main branch to which you merge the feature branches, and maintain only a main branch. The pull request must be approved by someone other than the person who requested the pull request, and it is mandatory that the approver of the pull request is different from the request creator. (Of course, in the event that the request was approved - it is possible that the one reviewing the pull request finds issues in the implementation that must be fixed before approval). Each pull request must pass the approval of all other members of the group.
Meaning, if you are a pair - one opens the pull request, and the second reviews the code and gives comments if there are any (and only if the code is correct, approves the request). If you are a trio - one opens the request, and the other two must review the code and give comments if there are any, and both approve the request only if the code is correct (mandatory).
By the way, GitHub has a built-in feature that allows you to do this, you can use it but you don't have to (it is available for free only for those who created the account as a student account, and we only use free tools). If you made a suitable account, you can use this and it simply won't allow the person who opened the pull request to approve it themselves. If you chose not to use the built-in feature, it is your responsibility to make sure to perform the defined logic (one opens PR, the others approve).

You must plan and divide the tasks in JIRA as a sprint and maintain them according to progress. To merge (== to do merge) in the project. These are significant essential requirements and their weight in the exercise is substantial.

The exercise must be submitted to the Moodle submission box by submitting a text file named `details.txt` with the names and IDs of the submitters and a link to the Git repository. Note, the file must be in the following format:
Israel Israeli 123456789
Israela Israeli 012345678
Israeli Israeli 012345679
LINK TO GITHUB HERE

Without extra lines, without extra spaces, and in English only. Failure to submit the above `details.txt` file or submitting it in a different way than defined will result in a 20-point deduction from the exercise grade.

Please make sure that your Git is in private mode throughout the semester. You must add the testing email (which was published) with viewing permissions on Github and Jira for the TAs.

Questions about the exercise should be asked in the forum. Only private inquiries should be sent to the TAs.

Independent work of the submitters only. Plagiarisms will be checked both manually and by an automated system and will be handled directly by the department.

The Git repository must contain a README file explaining how to run the code and briefly explaining your workflow.

Do not store (or send any real/important/sensitive information) like real passwords or text in the server because the exercise does not take into account many security highlights that must be taken in the context of the server or application.

I remind you again not to upload any sensitive, private, secret information, passwords, keys, tokens, API Keys, etc. anywhere in the project, not in Git, not in README, not in code, not in Jira Wiki, and not in GitHub, and not anywhere else in the course. Remember that most things have history - and the information appears there even if you deleted it. **Do not** upload the `node_modules` folder to Git (and certainly not any private or sensitive information like passwords or anything else).

- In the course we work solely with legal, free, and open source resources.

- If you use files like images, you can only use things that are permitted and legal to use. For example, there are free icon databases, Google icons, etc. that are allowed for use which could be relevant to React. It is your responsibility to verify and ensure that you have permission to use them.

- In all stages of the project, we do not use anything that is not free, legal, and open source.

**Please note, the work is independent only. This topic will be tested and enforced. The exercise is yours and you must implement it yourself. Do not use Gen AI-based tools in a way that these tools implement parts of the exercise for you; doing so is equivalent to non-independent and non-autonomous work. The topic will be tested and enforced.**

## **Good Luck**

## **Appendix:**

Suppose we want to access the server asynchronously using JAVASCRIPT. We can use the following code example:

And then extract the JWT from the response and get the details of the user by sending an additional request along with the JWT to verify our identity. Now we can attach the JWT to future requests to the server.

Another example -

Suppose that on the home screen of the React application, we want to display a list of objects that came from the server, for example, a list of movies (but for you, it is, for example, a list of restaurants). In the next example, it is a list of movies. Where the list of movies is displayed, you implemented the list of movies in a simplified code for explanation purposes.

You created a state called videos:

`const [videos, setVideos] = useState([]);`

And then for each video, you created a component like this and passed the video details to it:
`const listItems = videos.map((video) =>`

`<Video video={video} />`

`);`

And then you displayed the list of movies:

`<div className="videos">`

`{listItems}`

`</div>`

To make this code dynamic working with the server, meaning bringing the list of movies from the server (as explained above with fetch) and updating the state variable with the list:
`const data = await response.json(); setVideos(data);`

And that's it, React will take care of rendering the list automatically according to what arrived from the server.
