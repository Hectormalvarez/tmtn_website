import React, { Suspense } from 'react'

import { Repo } from '@/app/repo'
import { RepoLoading } from '@/app/repo-loading'
import { Repo as RepoType } from '@/types/repo'

async function getRepoData() {
  const reposUrl = "https://api.github.com/users/Hectormalvarez/repos"
  const res = await fetch(reposUrl)
  const data = await res.json()
  return data
}

export const RepoList = () => {
  return (
    <Suspense fallback={<RepoLoading />}>
      <RepoSection />
    </Suspense>
  )
}

const RepoSection = async () => {
  const repos = await getRepoData()
  repos.sort((a: RepoType, b: RepoType) => {
    const aTimestamp = new Date(a.updated_at).getTime()
    const bTimestamp = new Date(b.updated_at).getTime()
    return bTimestamp - aTimestamp
  })
  
  return (
    <section className="repo-list container">
      {repos.map((repo: RepoType) => (
        <Repo repo={repo} key={repo.name} />
      ))}
    </section>
  )
}
