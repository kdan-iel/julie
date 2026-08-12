<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/560b954f-eceb-4817-b3b5-1ab5e24d2359

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Personnalisation avant déploiement

- Ajoutez les vraies photos dans `public/photos/` en utilisant les noms indiqués dans `public/photos/README.txt`, ou modifiez les `imageUrl` dans `src/config/weddingContent.ts`.
- Pour activer la cagnotte en ligne, renseignez `weddingContent.gifts.onlineFundUrl` dans `src/config/weddingContent.ts`.
- Les RSVP sont transmis à `iletouakpo@gmail.com` via FormSubmit. Lors du premier envoi, FormSubmit adresse un e-mail d’activation à cette boîte : ouvrez-le et confirmez l’activation pour commencer à recevoir les RSVP. Vous pouvez remplacer l’endpoint avec `VITE_RSVP_ENDPOINT` dans `.env.local`.
