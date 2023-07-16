import { ProfileHeader } from './profile-header'
import { reposData } from './data'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-center">
      <ProfileHeader />
      <section className="max-w-full">
        {reposData.map((repo) => (
          <article
            key={repo.id}
            className="flex justify-between py-4 px-2 my-4 mx-2 rounded-lg bg-gray-100 border-2 border-gray-400 max-w-full"
          >
            <div className="text-left truncate text-ellipsis">
              <h2 className="font-serif font-bold">{repo.name}</h2>
              <p className="font-sm">{repo.description}</p>
            </div>
            <div className="text-right">
              <p className="font-sm">{repo.language}</p>
              <p className="font-sm">{repo.updated_at}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
