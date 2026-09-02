# BodycraftPwa

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


Android Setup & APK Generation Guide
1. First-Time Setup (Android Integration)
If you are setting up the Android platform and Capacitor configuration in this project for the very first time, run these commands in your terminal:

DOS
npm install
npx cap add android
npm run build && npx cap sync android
cd android && gradlew assembleDebug && cd ..
2. Future Updates (How to Update the APK after Code Changes)
Whenever you make changes to your code and want a fresh updated APK, run this single command directly from your terminal:

DOS
npm run build && npx cap sync android && cd android && gradlew assembleDebug && cd ..
Where to Find Your APK File:
After running the build commands, your debug APK will be generated and located at:

Plaintext
android/app/build/outputs/apk/debug/app-debug.apk
Building (Web Only)
To build the project for standard web deployment, run:

Bash
ng build
This will compile your project and store the build artifacts in the dist/ directory.

Running unit tests
To execute unit tests with the Vitest test runner, use the following command:

Bash
ng test
Running end-to-end tests
For end-to-end (e2e) testing, run:

Bash
ng e2e
Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.