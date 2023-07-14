import Image from "next/image";
import { reposData } from "./repos";

const profileData = {
  login: "Hectormalvarez",
  id: 31625850,
  node_id: "MDQ6VXNlcjMxNjI1ODUw",
  avatar_url: "https://avatars.githubusercontent.com/u/31625850?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/Hectormalvarez",
  html_url: "https://github.com/Hectormalvarez",
  followers_url: "https://api.github.com/users/Hectormalvarez/followers",
  following_url:
    "https://api.github.com/users/Hectormalvarez/following{/other_user}",
  gists_url: "https://api.github.com/users/Hectormalvarez/gists{/gist_id}",
  starred_url:
    "https://api.github.com/users/Hectormalvarez/starred{/owner}{/repo}",
  subscriptions_url:
    "https://api.github.com/users/Hectormalvarez/subscriptions",
  organizations_url: "https://api.github.com/users/Hectormalvarez/orgs",
  repos_url: "https://api.github.com/users/Hectormalvarez/repos",
  events_url: "https://api.github.com/users/Hectormalvarez/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/Hectormalvarez/received_events",
  type: "User",
  site_admin: false,
  name: "Hector Alvarez",
  company: "Taylor Made Tech Network",
  blog: "taylormadetech.net",
  location: "Austin, TX",
  email: null,
  hireable: null,
  bio: "Systems administrator  that is learning devops",
  twitter_username: null,
  public_repos: 15,
  public_gists: 1,
  followers: 1,
  following: 3,
  created_at: "2017-09-04T14:56:54Z",
  updated_at: "2023-06-14T13:39:51Z",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="flex py-8 px-2 items-center justify-around w-full">
        <div>
          <Image
            src={profileData.avatar_url}
            alt={profileData.name}
            width={75}
            height={75}
            className="rounded-full"
          />
        </div>
        <div className="pl-2 w-2/3">
          <h1 className="text-2xl font-bold font-serif">{profileData.name}</h1>
          <p className="text-sm">{profileData.company}</p>
        </div>
      </header>
      <section className="flex flex-col items-center justify-center">
        <h2 className="font-serif">{profileData.bio}</h2>
        <div className="flex  py-2 items-center justify-around text-center w-full">
          <div className="">
            <p>Public Repos</p>
            <p>{profileData.public_repos}</p>
          </div>
          <div>
            <p>Public Gists</p>
            <p>{profileData.public_gists}</p>
          </div>
        </div>
      </section>
      <section>
        {reposData.map((repo) => (
          <div
            key={repo.id}
            className="py-4 px-2 my-4 mx-2 rounded-lg justify-center max-w-full bg-gray-200 border-2 border-gray-900"
          >
            <h2 className="font-serif">{repo.name}</h2>
            <p className="text-sm text-ellipsis w-2/3">{repo.description}</p>
            <p className="text-sm">{repo.language}</p>
            <p className="text-sm">{repo.updated_at}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
