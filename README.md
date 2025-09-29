# FAST Cybersecurity Research Project

**Welcome to the Research Project's GitHub repo!**
## First-time Setup Instructions
Once you've been added to the organization you should be able to **clone/pull**

To do this, open your command line and navigate to where you'd like to clone it onto your machine. Then, type `git clone https://github.com/FAST-Cyber-Security-Team/Research-Project.git`. Then, you can `cd` into the newly cloned repo.

Then once you've gotten the repo down, you can navigate to both the `app/frontend` and the `app/backend` directories, and run `npm install` to install the required modules from `package.json`. When you pull from GitHub, you would need to do this any time a new package is added (though not every time you pull, don't worry)—`node_modules` is too big to push and pull from the remote repo!
## Backend
To run the backend server on your machine, navigate to `app/backend` and run `npm run dev` (which is a script in package.json), or `node app.mjs`. Then you can navigate in your browser to `http://localhost:3000`, and you should see a web-page pop up that says 'Hello, World!'
## Frontend
To run the live dev server using Vite, navigate to `app/frontend` and run `npm run dev` (which is a script in package.json). You should see Vite start up in the command line before displaying a link saying `Local: http://localhost:5173/`. Clicking on this link will bring you to the page created from the code in `frontend/src`. Since this is a live dev server, too, when you edit the source code, it will automatically update.
## Contribution rules
The Research Leads will retain authority over PR requests made on the main branch. Contributing team members will not be able to push directly to the main branch, they must work on separate branches (using `git checkout -b <branchname>`), and can push their branch to GitHub before creating a PR request on the site to be reviewed by the Research Lead(s) whom have authority over the affected code (frontend/backend). Before opening a PR, be sure that your code is synced with main with `git checkout main`, `git pull origin main`. You can see .github/PR_TEMPLATE.md for an example template to use when making a PR.