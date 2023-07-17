import React, { Suspense } from 'react'

import { Repo } from '@/app/repo'
import { reposData } from './data'
import { RepoLoading } from './repo-loading'

async function getRepoData() {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  await delay(4000)
  return reposData
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
  return (
    <section className="repo-list container">
      {repos.map((repo) => (
        <Repo repo={repo} key={repo.name} />
      ))}
    </section>
  )
}
