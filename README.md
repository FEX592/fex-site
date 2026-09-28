# FEX personal site

Static site (HTML, CSS, JavaScript). No build step and no dependencies.

## Structure

```
index.html            page markup and content
css/styles.css        all styling (colours are the variables at the top)
js/main.js            slide transitions, background videos, animations
assets/videos/        looping background videos (muted, no audio track)
assets/images/        badge photo, video posters, favicons, social preview image
vercel.json           build settings, caching and security headers
scripts/build.mjs     copies the site to dist/ and fills in the site URL
```

## Run locally

```
npx serve .
```

Open the address it prints. (Double-clicking `index.html` also works.)

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New > Project** and import the repository.
3. Framework Preset: **Other**. Leave the other settings as they are (`vercel.json` sets them). Deploy.

Or from the terminal: `npx vercel --prod`

## Things to edit

- **WhatsApp number and message:** the `wa.me` link in the Contact section of `index.html`.
- **Colours:** the `:root` variables at the top of `css/styles.css`.
- **Backgrounds:** replace the files in `assets/videos/` (keep the same names, or update `data-src` in `index.html`). Keep them short, muted and under about 2 MB each.
- **Social preview:** the site URL in the link-preview tags is filled in automatically on each Vercel build. If you use a custom domain and want to force it, add an environment variable `SITE_URL` (for example `https://yourname.com`) in the Vercel project settings.
