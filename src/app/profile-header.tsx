import Image from 'next/image'

async function getProfileData() {
  const profileUrl = "https://api.github.com/users/Hectormalvarez"
  const res = await fetch(profileUrl)
  const data = await res.json()
  return data
}

export async function ProfileHeader() {
  const profile = await getProfileData()
  return (
    <header className="flex flex-col py-8 px-2 justify-center items-center w-full">
      <div className="flex justify-center items-center">
        <div>
          <Image
            src={profile.avatar_url}
            alt={profile.name}
            width={75}
            height={75}
            className="rounded-full"
          />
        </div>
        <div className="pl-4">
          <h1 className="text-2xl font-bold font-serif">{profile.name}</h1>
          <p className="text-sm">{profile.company}</p>
        </div>
      </div>
      <div className="py-4 max-w-">
        <h2>{profile.bio}</h2>
        <a href={profile.html_url} className="text-sm underline text-blue-700">
          checkout my github
        </a>
      </div>
    </header>
  )
}
