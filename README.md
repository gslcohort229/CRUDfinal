This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Setting up Firebase

This application uses Firebase for authentication, database, and storage services. To run the app locally or to use it as a base for your own project, you'll need to set up your own Firebase project.

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project.
2. Once the project is created, click on the "Settings" cog near the "Project Overview" and go to "Project settings."
3. Scroll down to the "Firebase SDK snippet" section and select the "Config" option.
4. Copy the configuration object and replace the `firebaseConfig` object in your local project's `firebase.js` file with your own configuration.

You should also store these values in a `.env` file in the root directory of your project for security reasons. The `.env` file should contain the following variables:

REACT_APP_API_KEY=<your-firebase-api-key>
REACT_APP_AUTH_DOMAIN=<your-firebase-auth-domain>
REACT_APP_PROJECT_ID=<your-firebase-project-id>
REACT_APP_STORAGE_BUCKET=<your-firebase-storage-bucket>
REACT_APP_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
REACT_APP_APP_ID=<your-firebase-app-id>
REACT_APP_MEASUREMENT_ID=<your-firebase-measurement-id> 
Remember to replace `<your-firebase-...>` with your own Firebase configuration values.

**Note:** The `.env` file is ignored by Git by default. This means it won't be tracked or pushed to your repository, keeping your Firebase configuration safe.

# CRUDfinal2023
