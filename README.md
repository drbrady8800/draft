# NFL Draft Management App

A Next.js application with TypeScript using the App Router for managing NFL teams, fans, draftable players, and draft events.

## Features

- NFL Teams database with team colors
- Fan management with favorite team tracking
- Draftable Players database with player images
- Draft management system
- Draft pick selection and tracking

## Database Schema

- **teams**: NFL teams with city, mascot, and team colors
- **people**: Fans with their favorite NFL team
- **draftable_players**: Players available for drafting
- **drafts**: Draft events with name and date
- **draft_picks**: Individual picks in a draft, linking a fan, a draft, and a drafted player

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/drbrady8800/draft.git
cd draft
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Initialize the database with sample data:

```bash
npm run init-db
# or
yarn init-db
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
.
├── app/                # Next.js App Router
│   ├── api/            # API routes (.ts)
│   ├── drafts/         # Draft-related pages
│   ├── people/         # People-related pages
│   ├── players/        # Player-related pages
│   ├── teams/          # Team-related pages
│   ├── globals.css     # Global CSS
│   ├── layout.tsx      # Root layout
│   ├── not-found.tsx   # 404 page
│   └── page.tsx        # Home page
├── components/         # React components (.tsx)
├── lib/                # Utility functions, database connections, types (.ts)
├── public/             # Static assets
└── scripts/            # Database scripts (.ts)
```

## API Routes

The application uses Next.js App Router for API routes:

- `/api/teams` - CRUD operations for NFL teams
- `/api/people` - CRUD operations for fans
- `/api/players` - CRUD operations for draftable players
- `/api/drafts` - CRUD operations for draft events
- `/api/draft-picks` - CRUD operations for draft picks

Each API route follows the App Router convention with route handlers in route.ts files:

```
HTTP Method | File                        | Action
-----------|-----------------------------|--------------------------------
GET        | app/api/teams/route.ts      | Get all teams
POST       | app/api/teams/route.ts      | Create a new team
GET        | app/api/teams/[id]/route.ts | Get a specific team
PUT        | app/api/teams/[id]/route.ts | Update a specific team
DELETE     | app/api/teams/[id]/route.ts | Delete a specific team
```

All API routes are built with TypeScript for improved type safety and better development experience.

## Development

### TypeScript

This project uses TypeScript for improved developer experience and type safety. You can run type checking with:

```bash
npm run type-check
# or
yarn type-check
```

### Database

The application uses SQLite for data storage with TypeScript interfaces for all data models. The database file is created at the root of the project as `draft.sqlite`.

To reset the database, delete the database file and run:

```bash
npm run init-db
# or
yarn init-db
```

### Styling

This project uses Tailwind CSS for styling. You can customize the theme in the `tailwind.config.js` file.

## Next Steps

Here are some potential features that could be added:

- Authentication system for users
- Real-time draft updates with WebSockets
- Player statistics and performance tracking
- Mock draft simulation
- Mobile-responsive design improvements
- Image upload for players

## License

This project is licensed under the MIT License.
