# Open-Source Contribution Analyzer

Open-Source Contribution Analyzer is an application that allows you to analyze contributions to open-source repositories on GitHub. The application provides detailed information about the repository, including name, description, language, license, star count, and the owner's follower count. Additionally, it displays a table with the top contributors to the repository.

## Features

- Fetch detailed information about a GitHub repository.
- Display the repository's name, description, language, license, star count, and the owner's follower count.
- List the top contributors to the repository.
- Load more contributors as needed.

## Technologies Used

- React
- TypeScript
- Material-UI
- Axios

## How to Run the Project

1. Clone the repository:

   ```sh
   git clone https://github.com/<your-username>/os-contribution-analyzer.git
   cd os-contribution-analyzer

   ```

2. Install the dependencies:
   npm install

3. Create a .env file in the root of the project and add your GitHub personal access token:
   REACT_APP_GITHUB_TOKEN=your_github_token

4. Run the application:
   npm start

5. Open your browser and go to http://localhost:3000.

How to Contribute
Fork the project.
Create a new branch with your feature: git checkout -b my-feature.
Commit your changes: git commit -m 'My new feature'.
Push to the branch: git push origin my-feature.
Open a Pull Request.
