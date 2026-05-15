# Publishing changes to Netlify
Push code to 

Run "npm run dev" and ensure the local build is running as expected
Run "npm run build" to build a production version of the application.
OR
Run "netlify dev" to run the app locally (it will also consider the netlify functions and env variables)

Run "netlify deploy" and specify "dist" as the publish directory, this will publish the application to a draft URL. Check out this URL to ensure everything runs as expected.

Run "netlify deploy --prod" and specify "dist" as the publish directory, this will deploy to the production version of the site: https://bward-portfolio.netlify.app

# Spotify Top Artists World Map setup
Set these environment variables for local/dev/prod:
- `VITE_SPOTIFY_CLIENT_ID` = your Spotify app client ID
- Keep `VITE_SPOTIFY_CLIENT_ID` in `.env.local`
- Spotify callback URL rules can differ by app/account. In this project, localhost/IP redirect URLs could not be added in Spotify Developer Dashboard.
- Because of that, do auth testing on deployed URLs (Netlify draft or production), not local dev URLs.
- Set `VITE_SPOTIFY_REDIRECT_URI` to the deployed callback URL when needed.
- Spotify app redirect URIs should include deployed callbacks such as:
	- `https://<netlify-draft-url>/Projects/TopArtistsMap`
	- `https://bward-portfolio.netlify.app/Projects/TopArtistsMap`
- The feature route is `/Projects/TopArtistsMap`.

# Update dependencies
Run "npm update -g"

# Push to GitHub
git add -A
git commit -m "Blah Blah"
git push

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
