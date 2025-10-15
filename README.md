# Publishing changes to Netlify
Push code to 

Run "npm run dev" and ensure the local build is running as expected

Run "npm run build" to build a production version of the application.

Run "netlify deploy" and specify "dist" as the publish directory, this will publish the application to a draft URL. Check out this URL to ensure everything runs as expected.

Run "netlify deploy --prod" and specify "dist" as the publish directory, this will deploy to the production version of the site: https://bward-portfolio.netlify.app

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
