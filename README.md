This is my New Year's resolution project, a game where people can submit their own New Year's resolutions and vote for others. The resolutions with the most votes will be displayed on the top 5 pages.

## Navigation
- `/` - submit your resolution
- `/vote` - vote for resolutions
- `/top5` - view the top 5 resolutions
- `/admin-1` - admin page to view all resolutions and delete them

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

and create a `.env.local` file in the root directory and add the following:

BASIC_AUTH=(username:password)
NEXT_PUBLIC_ADMIN_TOKEN=(admin token)
ADMIN_TOKEN=(admin token)
