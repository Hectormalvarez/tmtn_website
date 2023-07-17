import React from 'react'
import { Repo as IRepo } from '@/types/repo'
import { convertDate } from '@/utils/time'

export const Repo = ({ repo }: { repo: IRepo }) => {
  return (
    <article
      className="flex flex-col justify-between py-4 px-2 my-4 mx-2 rounded-lg bg-gray-100 border-2 border-gray-400 max-w-full"
    >
      <div className="text-left text-ellipsis pb-4">
        <p className="font-serif text-lg font-bold">{repo.name}</p>
        <p className="font-md">
          {repo.description ?? 'No description'}
        </p>
      </div>
      <div className="text-right flex-1">
        <p className="text-sm">
          {repo.language ? `Language: ${repo.language}` : ''}
        </p>
        <p className="text-xs">Last Update: {convertDate(repo.updated_at)}</p>
        <p className="text-xs">Repo Created: {convertDate(repo.created_at)}</p>
      </div>
    </article>
  );
};