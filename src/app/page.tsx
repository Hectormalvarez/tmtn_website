import { ProfileHeader } from './profile-header'
import { RepoList } from './repo-list'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-center">
      <ProfileHeader />
      <RepoList />
    </main>
  )
}
