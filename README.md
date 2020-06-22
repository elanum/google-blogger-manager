# AWFT
> Manuel Schierenberg, Paul Manuel Kluge, Maxine Müller, Oliver Rascheja

App with a connection to [Google Blogger API](https://developers.google.com/blogger) with [React](https://reactjs.org/).

## Google Development Account
Username: `bloggerspa19@gmail.com`  
Password: `A3DG?6~7`  
Client-ID: `835840484437-f27qtek3epp6n65s8gu41gv6i95n44l5.apps.googleusercontent.com`

## Setup
1. Create a Google Account _(if you don't have one)_
2. Visit [Google API Console](https://console.developers.google.com/)
3. Create a Project in the top left corner
4. Select the Project
5. Add APIs through the Dashboard
6. Select "Enable APIs and Services"
7. Search and Activate "Blogger API v3" and "Google Analytics API"
8. Create Credentials with the following settings:
    * Which API are you using?
        * Blogger API v3
    * Where will you be calling the API from?
        * Web browser (Javascript)
    * What data will you be accessing?
        * User data
9. Create an OAuth 2.0 Client-ID
    * Name
        * AWFT
    * Authorized JavaScript origins
        * `https://localhost:3000` _(for development)_
        * `https://localhost:5000` _(for standard build)_
        * `https://yourdomain.com/` _(your domain)_
10. Copy your created client ID
11. Open `src/components/GoogleAuth` and replace in line 25 `<CLIENT-ID>` with your Client-ID

## Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

For environments using [Node](https://nodejs.org/), the easiest way to handle this would be to install [serve](https://github.com/zeit/serve) and let it handle the rest:
```
npm install -g serve
serve -s build
```
The last command shown above will serve your static site on the port **5000**. Like many of serve’s internal settings, the port can be adjusted using the `-l` or `--listen` flags:
```
serve -s build -l 4000
```
Run this command to get a full list of the options available:
```
serve -h
```

## Known Issues
* `post.replies.totalItems` will not refresh instantly
* Visit a page through the browsers address bar will alwyas redirect to `/` even if you're logged in

## Sources
* [React Documentation](https://reactjs.org/docs/getting-started.html)
* [Google Blogger API Documentation](https://developers.google.com/blogger)
* [Materialize Documentation](https://materializecss.com/)
* [react-materialize](https://github.com/react-materialize/react-materialize)
* [Build a CRUD App in React with Hooks](https://www.taniarascia.com/crud-app-in-react-with-hooks/)
* [React.js CRUD example to consume Web API](https://bezkoder.com/react-crud-web-api/)
* [React Hooks CRUD example with Axios and Web API](https://bezkoder.com/react-hooks-crud-axios-api/)
* [How to fetch data with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data)
* [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)
* [React example for Google Welcome using gapi-script npm package](https://github.com/LucasAndrad/gapi-script-live-example)
* [React router v4 redirect when no match](https://stackoverflow.com/questions/50341108/react-router-v4-redirect-when-no-match)
* [React Router: Declarative Routing for React.js](https://reacttraining.com/react-router/web/guides/quick-start)
* [Protected Routes in React using React Router](https://www.youtube.com/watch?v=Y0-qdp-XBJg)
* [Hooked with React - Using react router in our react application to route a dynamic page](https://learnwithparam.com/blog/book-details-page-using-react-router/)
* [p71pr7jn50](https://codesandbox.io/s/p71pr7jn50)
* [Display A 'Loading' Indicator In React During Ajax Requests ](https://blog.stvmlbrn.com/2017/10/14/display-loading-indicator-in-react-during-ajax-requests.html)
* [How to parse html to React component?](https://stackoverflow.com/questions/44643424/how-to-parse-html-to-react-component)
* [google-api-javascript-client](https://github.com/google/google-api-javascript-client)
* [How to fix missing dependency warning when using useEffect React Hook?](https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook)
* [http:403 forbidden error when trying to load img src with google profile pic](https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic)
* [React Draft Wysiwyg](https://jpuri.github.io/react-draft-wysiwyg/#/)
* [react-draft-wysiwyg: how to set default value](https://github.com/jpuri/react-draft-wysiwyg/issues/357)
* [How to useContext in React?](https://www.robinwieruch.de/react-usecontext-hook)
* [React Deployment](https://create-react-app.dev/docs/deployment/)