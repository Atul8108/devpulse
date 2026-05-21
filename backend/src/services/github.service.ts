import axios from 'axios';
import {
  GitHubUser,
  GitHubProfile,
  ContributionCalendar,
  LanguageStat,
  PinnedRepo,
} from '../types';

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchRESTUser(username: string): Promise<GitHubUser> {
  const { data } = await axios.get<GitHubUser>(`${GITHUB_API}/users/${username}`, {
    headers: authHeaders(),
  });
  return data;
}

const GRAPHQL_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            stargazerCount
            forkCount
            url
            primaryLanguage { name color }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          stargazerCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

interface GraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
      pinnedItems: {
        nodes: PinnedRepo[];
      };
      repositories: {
        nodes: Array<{
          stargazerCount: number;
          languages: {
            edges: Array<{ size: number; node: { name: string; color: string | null } }>;
          };
        }>;
      };
    };
  };
}

async function fetchGraphQLData(username: string): Promise<{
  contributionCalendar: ContributionCalendar;
  languages: LanguageStat[];
  totalStars: number;
  pinnedRepos: PinnedRepo[];
}> {
  const { data } = await axios.post<GraphQLResponse>(
    GITHUB_GRAPHQL,
    { query: GRAPHQL_QUERY, variables: { login: username } },
    { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
  );

  const { contributionsCollection, pinnedItems, repositories } = data.data.user;

  const langMap = new Map<string, LanguageStat>();
  let totalStars = 0;

  for (const repo of repositories.nodes) {
    totalStars += repo.stargazerCount;
    for (const edge of repo.languages.edges) {
      const existing = langMap.get(edge.node.name);
      if (existing) {
        existing.size += edge.size;
      } else {
        langMap.set(edge.node.name, { name: edge.node.name, color: edge.node.color, size: edge.size });
      }
    }
  }

  const languages = Array.from(langMap.values()).sort((a, b) => b.size - a.size);

  return {
    contributionCalendar: contributionsCollection.contributionCalendar,
    languages,
    totalStars,
    pinnedRepos: pinnedItems.nodes,
  };
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const [user, graphql] = await Promise.all([
    fetchRESTUser(username),
    fetchGraphQLData(username),
  ]);

  return { user, ...graphql };
}
